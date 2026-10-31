#!/usr/bin/env node
/**
 * Tell Bing (and other IndexNow engines: Yandex, Seznam, Naver) that pages
 * changed, so ChatGPT search / Copilot (Bing-backed) pick them up sooner.
 * Run after a deploy is live. Free; at most 10,000 URLs per request.
 *
 *   npm run indexnow                          # every URL in the live sitemap
 *   npm run indexnow:priority                 # the "priority" preset
 *   node scripts/indexnow.mjs /en/cruises https://www.jetset-travel.com/ru/faq
 *   node scripts/indexnow.mjs --preset priority
 *   node scripts/indexnow.mjs --dry-run [...]  # print the list, submit nothing
 *
 * Arguments can be paths (/en/cruises) or full https://www.jetset-travel.com
 * URLs; other hosts are rejected, because IndexNow only accepts URLs on the
 * host that owns the key. Presets live in scripts/indexnow-presets.mjs.
 *
 * The key file is public by design (IndexNow protocol):
 * public/4338cc8b3af74065bf84162fa446f406.txt
 */
import { INDEXNOW_PRESETS } from "./indexnow-presets.mjs";

const HOST = "www.jetset-travel.com";
const KEY = "4338cc8b3af74065bf84162fa446f406";
const ORIGIN = `https://${HOST}`;

async function sitemapUrls() {
  const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function toUrl(arg) {
  if (!arg.startsWith("http")) return `${ORIGIN}${arg.startsWith("/") ? "" : "/"}${arg}`;
  const u = new URL(arg);
  if (u.host !== HOST) {
    console.error(`${arg}: IndexNow only accepts ${HOST} URLs for this key.`);
    process.exit(1);
  }
  return u.toString();
}

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const presetIndex = argv.indexOf("--preset");
const presetName = presetIndex > -1 ? argv[presetIndex + 1] : null;
const paths = argv.filter((a, i) => !a.startsWith("--") && (presetIndex === -1 || i !== presetIndex + 1));

let urlList;
if (presetName) {
  const preset = INDEXNOW_PRESETS[presetName];
  if (!preset) {
    console.error(`Unknown preset "${presetName}". Available: ${Object.keys(INDEXNOW_PRESETS).join(", ")}`);
    process.exit(1);
  }
  urlList = [...preset, ...paths].map(toUrl);
} else {
  urlList = paths.length ? paths.map(toUrl) : await sitemapUrls();
}
urlList = [...new Set(urlList)];

if (urlList.length === 0) {
  console.error("No URLs to submit.");
  process.exit(1);
}

if (dryRun) {
  console.log(`IndexNow dry run: ${urlList.length} URL(s), nothing submitted.`);
  for (const u of urlList) console.log(`  ${u}`);
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URL(s) -> HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) process.exit(1);
