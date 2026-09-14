import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

// Runs only against a loopback server with synthetic credentials and mocked providers.
const root = resolve(import.meta.dirname, "..");
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
      ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1", JETSET_HTTP_SMOKE: "1",
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
} finally {
  await unconfigured.stop();
}
console.log(`PASS: ${checks} production-build HTTP checks; no external emails or CAPTCHA requests sent.`);
