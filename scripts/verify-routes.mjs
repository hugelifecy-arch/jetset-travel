#!/usr/bin/env node
/**
 * Step 9 — build/staging route verifier.
 *
 * Crawls a RUNNING build (local `next start`, a Vercel preview, or production)
 * and reports, for every route:
 *   - final HTTP status code
 *   - number of redirect hops taken to reach it
 *   - whether the rendered <link rel="canonical"> matches the final URL
 *
 * It flags (and exits non-zero on) any route where:
 *   - a canonical content URL did not return 200 in 0 hops, or
 *   - the rendered canonical != the route's own sitemap <loc>, or
 *   - the rendered canonical path != the final fetched path, or
 *   - a redirect case took more than 1 hop / landed on the wrong URL, or
 *   - a non-content file (ai.txt/llms.txt/…) is missing X-Robots-Tag: noindex,
 *   - the 404 probe returns a 5xx instead of 404.
 *
 * The canonical route inventory is read from the LIVE /sitemap.xml of the
 * target, so it can never drift from what the app actually publishes.
 *
 * Usage:
 *   1) Build + start the app:   npm run build && npm start    (serves :3000)
 *   2) In another shell:        npm run verify:routes
 *   Point at staging/prod with: BASE_URL=https://staging.example npm run verify:routes
 *
 * Host note: the rendered canonical always uses the production origin
 * (https://www.jetset-travel.com). When BASE_URL is localhost we therefore
 * compare canonical==loc by exact string and canonical.path==final.path by
 * path — both must hold. Host/protocol (http→https, apex→www) redirects can
 * only be exercised against production; those are covered by the companion
 * scripts/verify-canonical-redirects.sh.
 */

const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const CANONICAL_ORIGIN = "https://www.jetset-travel.com";
const CANONICAL_HOST = "www.jetset-travel.com";
const MAX_REDIRS = 10;

const C = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  green: "\x1b[32m", red: "\x1b[31m", yellow: "\x1b[33m", cyan: "\x1b[36m",
};
const ok = (s) => `${C.green}${s}${C.reset}`;
const bad = (s) => `${C.red}${s}${C.reset}`;

/** Map a production canonical URL onto the target BASE for fetching. */
function toBase(prodUrl) {
  const u = new URL(prodUrl);
  return BASE + u.pathname + u.search;
}

/**
 * Follow redirects manually so we can count hops and capture the final body.
 * Returns { status, hops, finalUrl, body, headers, chain }.
 */
async function fetchChain(startUrl) {
  let url = startUrl;
  const chain = [];
  for (let i = 0; i <= MAX_REDIRS; i++) {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "JetSet-Route-Verifier/1.0" },
    });
    const status = res.status;
    if (status >= 300 && status < 400 && res.headers.get("location")) {
      const loc = new URL(res.headers.get("location"), url).toString();
      chain.push({ from: url, status, to: loc });
      url = loc;
      continue;
    }
    const body = await res.text();
    return { status, hops: chain.length, finalUrl: url, body, headers: res.headers, chain };
  }
  return { status: 0, hops: chain.length, finalUrl: url, body: "", headers: new Headers(), chain };
}

function extractCanonical(html) {
  // Tolerate attribute order: rel before href OR href before rel.
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of linkTags) {
    if (/\brel\s*=\s*["']canonical["']/i.test(tag)) {
      const m = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
      if (m) return m[1].replace(/&amp;/g, "&");
    }
  }
  return null;
}

async function getSitemapLocs() {
  const res = await fetch(`${BASE}/sitemap.xml`, {
    headers: { "User-Agent": "JetSet-Route-Verifier/1.0" },
  });
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status} at ${BASE}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].trim().replace(/&amp;/g, "&"),
  );
  return [...new Set(locs)];
}

const results = [];
function record(category, target, passed, detail) {
  results.push({ category, target, passed, detail });
  const tag = passed ? ok("PASS") : bad("FAIL");
  console.log(`  ${tag}  ${target}`);
  if (detail) console.log(`        ${C.dim}${detail}${C.reset}`);
}

/* ----------------------------- content routes ---------------------------- */
async function checkContentRoutes(locs) {
  console.log(`\n${C.bold}Content routes (expect 200, 0 hops, canonical == loc == final)${C.reset}`);
  for (const loc of locs) {
    const local = toBase(loc);
    let r;
    try {
      r = await fetchChain(local);
    } catch (e) {
      record("content", loc, false, `fetch error: ${e.message}`);
      continue;
    }
    const canon = extractCanonical(r.body);
    const finalPath = new URL(r.finalUrl).pathname + new URL(r.finalUrl).search;
    const locPath = new URL(loc).pathname + new URL(loc).search;

    const problems = [];
    if (r.status !== 200) problems.push(`status=${r.status}`);
    if (r.hops > 0) problems.push(`hops=${r.hops} (${r.chain.map((c) => c.status).join("→")})`);
    if (!canon) {
      problems.push("no <link rel=canonical>");
    } else {
      const cu = new URL(canon);
      if (canon !== loc) problems.push(`canonical "${canon}" != loc "${loc}"`);
      if (cu.protocol !== "https:") problems.push(`canonical not https (${cu.protocol})`);
      if (cu.host !== CANONICAL_HOST) problems.push(`canonical host ${cu.host} != ${CANONICAL_HOST}`);
      const canonPath = cu.pathname + cu.search;
      if (canonPath !== finalPath) problems.push(`canonical path ${canonPath} != final path ${finalPath}`);
      if (canonPath !== locPath) problems.push(`canonical path ${canonPath} != loc path ${locPath}`);
    }
    record("content", loc, problems.length === 0,
      problems.length ? problems.join("; ") : `200 in 0 hops, canonical self-references`);
  }
}

/* ------------------------- redirect-class probes -------------------------- */
// Host-independent redirects exercisable on any origin (path/query based).
// Each must reach the target in exactly ONE hop and end in 200.
const REDIRECT_CASES = [
  { from: "/en/about/", to: "/en/about", label: "trailing slash" },
  { from: "/ru/about/", to: "/ru/about", label: "trailing slash (ru)" },
  { from: "/en/", to: "/en", label: "locale-root trailing slash" },
  { from: "/ru/", to: "/ru", label: "locale-root trailing slash (ru)" },
  { from: "/en/en", to: "/en", label: "doubled locale" },
  { from: "/en/en/about", to: "/en/about", label: "doubled locale + path" },
  { from: "/ru/ru/blog", to: "/ru/blog", label: "doubled locale (ru)" },
  { from: "/en/about?lang=ru", to: "/ru/about", label: "?lang= locale swap" },
  { from: "/?lang=ru", to: "/ru", label: "?lang= on root" },
  { from: "/?lang=en", to: "/en", label: "?lang= on root (en)" },
  { from: "/luxury", to: "/en/luxury-travel", label: "bare-path special" },
  { from: "/en/vizovye-uslugi-kipr", to: "/en/visa-services-cyprus", label: "retired *-cyprus slug" },
  { from: "/ru/korporativnye-poezdki-kipr", to: "/ru/corporate-travel-cyprus", label: "retired *-cyprus slug (ru)" },
];

async function checkRedirects() {
  console.log(`\n${C.bold}Redirect classes (expect ≤1 hop to the canonical target, 200)${C.reset}`);
  for (const tc of REDIRECT_CASES) {
    let r;
    try {
      r = await fetchChain(BASE + tc.from);
    } catch (e) {
      record("redirect", `${tc.from}  (${tc.label})`, false, `fetch error: ${e.message}`);
      continue;
    }
    const finalPath = new URL(r.finalUrl).pathname + new URL(r.finalUrl).search;
    const problems = [];
    if (finalPath !== tc.to) problems.push(`final ${finalPath} != expected ${tc.to}`);
    if (r.status !== 200) problems.push(`status=${r.status}`);
    if (r.hops > 1) problems.push(`hops=${r.hops} (${r.chain.map((c) => c.status).join("→")}) — redirect chain!`);
    if (r.hops < 1) problems.push(`hops=0 — no redirect happened`);
    record("redirect", `${tc.from}  →  ${tc.to}  (${tc.label})`,
      problems.length === 0, problems.length ? problems.join("; ") : `${r.hops} hop, ${finalPath}`);
  }
}

/* ----------------------- non-content & 404 probes ------------------------- */
async function checkNonContent(locs) {
  console.log(`\n${C.bold}Non-content files (Step 6 — reachable but X-Robots-Tag: noindex, not in sitemap)${C.reset}`);
  const files = ["/ai.txt", "/llms.txt", "/llms-full.txt", "/humans.txt"];
  const locSet = new Set(locs.map((l) => new URL(l).pathname));
  for (const f of files) {
    let res;
    try {
      res = await fetch(BASE + f, { headers: { "User-Agent": "JetSet-Route-Verifier/1.0" } });
    } catch (e) {
      record("non-content", f, false, `fetch error: ${e.message}`);
      continue;
    }
    const xrobots = (res.headers.get("x-robots-tag") || "").toLowerCase();
    const problems = [];
    if (!res.ok) problems.push(`status=${res.status} (should stay reachable)`);
    if (!xrobots.includes("noindex")) problems.push(`X-Robots-Tag missing noindex (got "${xrobots || "none"}")`);
    if (locSet.has(f)) problems.push("appears in sitemap.xml (should not)");
    record("non-content", f, problems.length === 0,
      problems.length ? problems.join("; ") : `reachable + noindex, absent from sitemap`);
  }

  console.log(`\n${C.bold}404 probe (must be 404, never 5xx)${C.reset}`);
  const missing = "/en/__verify_routes_definitely_missing__";
  try {
    const r = await fetchChain(BASE + missing);
    const passed = r.status === 404;
    record("404", missing, passed,
      passed ? "returns 404" : `returns ${r.status}${r.status >= 500 ? " — 5xx runtime error!" : ""}`);
  } catch (e) {
    record("404", missing, false, `fetch error: ${e.message}`);
  }
}

/* --------------------------------- main ---------------------------------- */
(async () => {
  console.log(`${C.cyan}${C.bold}Route verifier${C.reset}  target = ${BASE}`);
  let locs;
  try {
    locs = await getSitemapLocs();
  } catch (e) {
    console.error(bad(`\nCannot read sitemap at ${BASE}/sitemap.xml — is the server running?`));
    console.error(`  ${e.message}`);
    console.error(`  Start it first:  ${C.bold}npm run build && npm start${C.reset}`);
    process.exit(2);
  }
  console.log(`${C.dim}Discovered ${locs.length} content URLs in sitemap.xml${C.reset}`);

  await checkContentRoutes(locs);
  await checkRedirects();
  await checkNonContent(locs);

  const failed = results.filter((r) => !r.passed);
  const byCat = (cat) => results.filter((r) => r.category === cat);
  console.log(`\n${C.bold}== Summary ==${C.reset}`);
  for (const cat of ["content", "redirect", "non-content", "404"]) {
    const rows = byCat(cat);
    const f = rows.filter((r) => !r.passed).length;
    console.log(`  ${cat.padEnd(12)} ${rows.length - f}/${rows.length} passed` +
      (f ? `  ${bad(`(${f} failed)`)}` : `  ${ok("✓")}`));
  }
  console.log(`\n  total: ${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log(bad(`\n  ${failed.length} mismatch(es) — fix before clicking "Validate Fix" in GSC:`));
    for (const r of failed) console.log(`    ${bad("✗")} [${r.category}] ${r.target}\n        ${r.detail}`);
    process.exit(1);
  }
  console.log(ok(`\n  All routes canonical-clean: every page is 200 in 0 hops with a self-referencing canonical, every redirect is a single hop. Safe to validate in GSC.`));
})();
