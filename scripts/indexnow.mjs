#!/usr/bin/env node
/**
 * Tell Bing (and other IndexNow engines: Yandex, Seznam, Naver) that pages
 * changed, so ChatGPT search / Copilot (Bing-backed) pick them up sooner.
 *
 *   node scripts/indexnow.mjs                 # every URL in the live sitemap
 *   node scripts/indexnow.mjs /en/cruises ... # only these paths
 *
 * The key file is public by design (IndexNow protocol): public/4338cc8b3af74065bf84162fa446f406.txt
 * Run after a deploy is live. Free; at most 10,000 URLs per request.
 */
const HOST = "www.jetset-travel.com";
const KEY = "4338cc8b3af74065bf84162fa446f406";
const ORIGIN = `https://${HOST}`;

async function sitemapUrls() {
  const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => (p.startsWith("http") ? p : `${ORIGIN}${p.startsWith("/") ? "" : "/"}${p}`))
  : await sitemapUrls();

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URL(s) -> HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) process.exit(1);
