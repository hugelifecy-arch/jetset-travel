#!/usr/bin/env node
/**
 * Probe EVERY redirect in src/lib/redirects.ts against a running build, in
 * several request shapes, and require exactly one 301 to a 200 page:
 *   /<source>   /<source>/   /<SOURCE upper-case locale>   /<source>?q=1
 *   bare path without /en (English sources only)
 *
 *   npm run build && npm start            (or: next start -p 3100)
 *   node scripts/verify-redirects.mjs --base http://localhost:3000
 *
 * Host/protocol hops (http → https, apex → www) only exist on the real
 * domains; scripts/verify-canonical-redirects.sh covers those in production.
 */
import { PATH_REDIRECTS } from "../src/lib/redirects.ts";

const argIndex = process.argv.indexOf("--base");
const BASE = (argIndex > -1 ? process.argv[argIndex + 1] : "http://localhost:3000").replace(/\/+$/, "");
const CONCURRENCY = 6;

async function probe(path) {
  const res = await fetch(BASE + path, { redirect: "manual", headers: { "User-Agent": "JetSet-Redirect-Verifier/1.0" } });
  const location = res.headers.get("location");
  if (!(res.status >= 300 && res.status < 400) || !location) return { status: res.status, hops: 0 };
  const next = new URL(location, BASE + path);
  const second = await fetch(next, { redirect: "manual", headers: { "User-Agent": "JetSet-Redirect-Verifier/1.0" } });
  return { status: res.status, hops: 1, target: next.pathname + next.search, finalStatus: second.status };
}

const cases = [];
for (const [source, destination] of Object.entries(PATH_REDIRECTS)) {
  const upper = source.replace(/^\/(en|ru)/, (m) => m.toUpperCase());
  cases.push([source, destination], [`${source}/`, destination], [upper, destination], [`${source}?q=1`, `${destination}?q=1`]);
  if (source.startsWith("/en/")) cases.push([source.slice(3), destination]);
}

const failures = [];
let done = 0;
async function worker(queue) {
  for (let item = queue.shift(); item; item = queue.shift()) {
    const [from, to] = item;
    try {
      const r = await probe(from);
      const problems = [];
      if (r.status !== 301) problems.push(`status ${r.status} (expected 301)`);
      if (r.target !== to) problems.push(`→ ${r.target ?? "(none)"} (expected ${to})`);
      if (r.finalStatus !== 200) problems.push(`target answered ${r.finalStatus} (expected 200, no second hop)`);
      if (problems.length) failures.push(`${from}: ${problems.join("; ")}`);
    } catch (e) {
      failures.push(`${from}: ${e.message}`);
    }
    done++;
  }
}

const queue = [...cases];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));
console.log(`Redirect probes: ${done - failures.length}/${done} passed (${Object.keys(PATH_REDIRECTS).length} redirects × request shapes)`);
if (failures.length) {
  for (const f of failures) console.log(`  FAIL ${f}`);
  process.exit(1);
}
console.log("Every redirect is a single 301 to a 200 page.");
