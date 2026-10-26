import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { resolve, join } from "node:path";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { setTimeout as delay } from "node:timers/promises";

// Runs only against a loopback server with synthetic credentials and mocked providers.
const root = resolve(import.meta.dirname, "..");
const recordFile = join(mkdtempSync(join(tmpdir(), "jetset-smoke-")), "emails.jsonl");
writeFileSync(recordFile, "");
const recorded = () => readFileSync(recordFile, "utf8").trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
const routes = [
  ["contact", "contact", {}],
  ["quote", "quote", { route: "Paphos to Athens" }],
  ["cruise-enquiry", "cruise_enquiry", {}],
  ["private-enquiry", "private_enquiry", { contactMethod: "email" }],
];

async function start(emailKey = "smoke-key-not-real") {
  const socket = createServer();
  socket.listen(0, "127.0.0.1");
  await once(socket, "listening");
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  let logs = "";
  const child = spawn(process.execPath, [
    "--import", resolve(root, "tests/support/mock-services.mjs"),
    resolve(root, "node_modules/next/dist/bin/next"), "start", "-H", "127.0.0.1", "-p", String(port),
  ], {
    cwd: root,
    env: {
      ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1", JETSET_HTTP_SMOKE: "1", JETSET_SMOKE_RECORD: recordFile,
      RESEND_API_KEY: emailKey, RECAPTCHA_SECRET_KEY: "smoke-secret-not-real",
      RECAPTCHA_ALLOWED_HOSTNAMES: "localhost", UPSTASH_REDIS_REST_URL: "", UPSTASH_REDIS_REST_TOKEN: "",
      CONTACT_EMAIL: "office@example.invalid", RESEND_FROM_EMAIL: "JetSet <sender@example.invalid>",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", chunk => { logs += chunk; });
  child.stderr.on("data", chunk => { logs += chunk; });
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Startup timeout: ${logs}`)), 20_000);
      child.stdout.on("data", chunk => {
        if (String(chunk).includes("Ready")) { clearTimeout(timeout); resolve(); }
      });
      child.once("error", error => { clearTimeout(timeout); reject(error); });
      child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Server exited ${code}: ${logs}`)); });
    });
  } catch (error) {
    child.kill();
    throw error;
  }
  return {
    origin: `http://127.0.0.1:${port}`,
    async stop() {
      if (child.exitCode !== null) return;
      const exited = once(child, "exit");
      child.kill("SIGTERM");
      await Promise.race([exited, delay(5_000)]);
      if (child.exitCode === null) child.kill("SIGKILL");
    },
  };
}

let checks = 0;
async function check(server, route, body, expectedStatus, headers = {}) {
  const response = await fetch(`${server.origin}/api/${route}`, {
    method: "POST", headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body), signal: AbortSignal.timeout(10_000),
  });
  assert.equal(response.status, expectedStatus, `${route}: expected ${expectedStatus}, received ${response.status}`);
  const result = await response.json();
  assert.equal(result.success, expectedStatus === 200);
  checks++;
}

const payload = (action, extras) => ({
  name: "Smoke Example", email: "visitor@example.invalid", phone: "+35799000000",
  _formLoadedAt: Date.now() - 10_000, _recaptchaToken: `smoke-${action}`, ...extras,
});

const server = await start();
try {
  for (const [route, action, extras] of routes) {
    const body = payload(action, extras);
    await check(server, route, body, 200);
    await check(server, route, { ...body, name: "Delivery Failure" }, 503);
    await check(server, route, { ...body, _recaptchaToken: undefined }, 400);
    await check(server, route, { ...body, _recaptchaToken: "smoke-wrong_action" }, 400);
    await check(server, route, { ...body, website: "bot.example" }, 200);
    for (const invalid of [null, [], "text", 42]) await check(server, route, invalid, 400);
    await check(server, route, { ...body, message: "x".repeat(40_000) }, 413);
    await check(server, route, body, 415, { "content-type": "text/plain" });
  }
  await check(server, "private-enquiry", payload("private_enquiry", { contactMethod: "whatsapp", phone: "" }), 400);
  await check(server, "contact", payload("contact", { email: "reply-fails@example.invalid" }), 200);
  // Audit F-11: RU submissions get a Russian acknowledgement whose replies go to the office.
  writeFileSync(recordFile, "");
  await check(server, "contact", payload("contact", { locale: "ru" }), 200);
  const [, ack] = recorded().filter((mail) => mail.to === "office@example.invalid" || mail.to === "visitor@example.invalid");
  assert.equal(ack?.to, "visitor@example.invalid");
  assert.equal(ack.reply_to, "office@example.invalid");
  assert.match(ack.subject, /получили/);
  checks++;
  // Enquiry attribution: shown to staff only, cleaned server-side (no query
  // strings, no unknown keys, ad click id reduced to yes/no).
  writeFileSync(recordFile, "");
  await check(server, "contact", payload("contact", { _attribution: {
    page: "/en/contact?email=leak@example.invalid", landing: "/en/blog/visa-guide",
    referrer: "www.google.com", utm_source: "google", utm_campaign: "spring-offer",
    adClick: true, gclid: "Cj0leak", email: "leak@example.invalid",
  } }), 200);
  const mails = recorded();
  const staffMail = mails.find((mail) => mail.to === "office@example.invalid");
  const visitorMail = mails.find((mail) => mail.to === "visitor@example.invalid");
  assert.match(staffMail?.html ?? "", /How they found us/);
  for (const expected of [">/en/contact<", ">/en/blog/visa-guide<", ">www.google.com<", ">google<", ">spring-offer<", "Google Ads click"]) {
    assert.ok(staffMail.html.includes(expected), `staff email missing ${expected}`);
  }
  assert.ok(!staffMail.html.includes("leak"), "attribution leaked a query string or unknown key");
  assert.ok(!visitorMail?.html.includes("How they found us"), "attribution must not reach the visitor");
  checks++;
  // VIP airport quick request (type "vip") on /api/quote: staff notification
  // lists every field, the visitor gets the localized quote acknowledgement.
  writeFileSync(recordFile, "");
  const vip = payload("quote", {
    type: "vip", airport: "PFO", service: "both", date: "14 June 2027",
    flightNumber: "A3 612", passengers: "2 adults", notes: "Wheelchair assistance", locale: "ru",
  });
  await check(server, "quote", vip, 200);
  const [vipStaff, vipAck] = recorded();
  assert.equal(vipStaff?.to, "office@example.invalid");
  assert.equal(vipStaff.subject, "New VIP Quote Request — Smoke Example");
  for (const expected of ["New VIP Airport Service Request", "Paphos (PFO)", "Arrival and departure",
    "14 June 2027", "A3 612", "2 adults", "Wheelchair assistance", "visitor@example.invalid", "+35799000000"]) {
    assert.ok(vipStaff.html.includes(expected), `VIP staff email missing ${expected}`);
  }
  assert.equal(vipAck?.to, "visitor@example.invalid");
  assert.equal(vipAck.reply_to, "office@example.invalid");
  assert.match(vipAck.subject, /получили/);
  checks++;
  for (const invalid of [{ airport: "ATH" }, { service: "lounge" }, { flightNumber: "A3_612" }, { passengers: "" }]) {
    await check(server, "quote", { ...vip, ...invalid }, 400);
  }
  await check(server, "quote", { ...vip, name: "Delivery Failure" }, 503);
  await check(server, "quote", { ...vip, _recaptchaToken: "smoke-private_enquiry" }, 400);
  // Luxury wizard: trip types are optional (older payloads still accepted) and
  // listed in the staff email when present.
  writeFileSync(recordFile, "");
  const luxury = payload("quote", {
    type: "luxury", destinations: "Santorini", dates: "June 2027", groupSize: "2 adults", budget: "5k-10k",
  });
  await check(server, "quote", luxury, 200);
  await check(server, "quote", { ...luxury, tripTypes: ["yacht", "villa"] }, 200);
  const [plainLuxury, typedLuxury] = recorded().filter((mail) => mail.to === "office@example.invalid");
  assert.ok(!plainLuxury?.html.includes("Trip Types"), "trip types row shown without a selection");
  assert.ok(typedLuxury?.html.includes("Villa, Yacht charter"), "luxury staff email missing trip types");
  checks++;
  await check(server, "quote", { ...luxury, tripTypes: ["spaceflight"] }, 400);
  // Audit F-01/F-06: unknown paths return 404 (previously 500 for /ads.txt etc.)
  // with an HTML document. Localized rendering is checked in a browser (report §9).
  for (const path of ["/ads.txt", "/xmlrpc.php", "/apple-touch-icon-precomposed.png", "/en/no-such-page", "/ru/no-such-page"]) {
    const res = await fetch(`${server.origin}${path}`, { redirect: "manual" });
    assert.equal(res.status, 404, `${path}: expected 404, received ${res.status}`);
    assert.match(await res.text(), /<html/, `${path}: not an HTML document`);
    checks++;
  }
  for (const policy of ["privacy", "terms"]) {
    const html = await (await fetch(`${server.origin}/ru/${policy}`)).text();
    assert.match(html, new RegExp(`href="/en/${policy}"`));
    checks++;
  }
} finally {
  await server.stop();
}

const unconfigured = await start("");
try {
  for (const [route, action, extras] of routes) {
    await check(unconfigured, route, payload(action, extras), 503);
  }
  await check(unconfigured, "quote", payload("quote", {
    type: "vip", airport: "LCA", service: "arrival", date: "14 June 2027", passengers: "1",
  }), 503);
} finally {
  await unconfigured.stop();
}
console.log(`PASS: ${checks} production-build HTTP checks; no external emails or CAPTCHA requests sent.`);
