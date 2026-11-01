#!/usr/bin/env node
/**
 * Crawl every page in sitemap.xml of a running build and check every internal
 * link on it: each must answer 200 directly — no redirect (Search Console
 * "Page with redirect" starts with our own links) and no 404.
 *
 *   node scripts/verify-internal-links.mjs --base http://localhost:3000
 *
 * Internal = relative hrefs and absolute https://www.jetset-travel.com URLs.
 * Fragments are ignored; query strings are kept. tel:/mailto:/external hosts
 * and /_next assets are skipped.
 */
const ORIGIN = "https://www.jetset-travel.com";
const argIndex = process.argv.indexOf("--base");
const BASE = (argIndex > -1 ? process.argv[argIndex + 1] : "http://localhost:3000").replace(/\/+$/, "");
const CONCURRENCY = 6;
const UA = { "User-Agent": "JetSet-Link-Verifier/1.0" };

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

async function pool(items, fn) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) await fn(item);
    }),
  );
}

const sitemapXml = await (await fetch(`${BASE}/sitemap.xml`, { headers: UA })).text();
const pages = [...new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(decode(m[1])).pathname))];

/** link path → Set of pages that contain it */
const linkedFrom = new Map();
await pool(pages, async (page) => {
  const html = await (await fetch(BASE + page, { headers: UA })).text();
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*"([^"]+)"/gi)) {
    const href = decode(m[1]).trim();
    if (/^(mailto:|tel:|#|javascript:|data:|sms:|whatsapp:)/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, ORIGIN + page);
    } catch {
      continue;
    }
    if (url.origin !== ORIGIN) continue;
    if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/api/")) continue;
    const key = url.pathname + url.search;
    if (!linkedFrom.has(key)) linkedFrom.set(key, new Set());
    linkedFrom.get(key).add(page);
  }
});

const problems = [];
await pool([...linkedFrom.keys()], async (link) => {
  const res = await fetch(BASE + link, { redirect: "manual", headers: UA });
  if (res.status !== 200) {
    const loc = res.headers.get("location");
    const from = [...linkedFrom.get(link)];
    problems.push(
      `${link} → ${res.status}${loc ? ` ${new URL(loc, BASE + link).pathname}` : ""}  (linked from ${from.length} page(s), e.g. ${from.slice(0, 3).join(", ")})`,
    );
  }
});

console.log(`Crawled ${pages.length} sitemap pages; ${linkedFrom.size} distinct internal links.`);
if (problems.length) {
  console.log(`${problems.length} internal link(s) do not answer 200 directly:`);
  for (const p of problems.sort()) console.log(`  FAIL ${p}`);
  process.exit(1);
}
console.log("Every internal link answers 200 with no redirect.");
