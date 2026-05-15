#!/usr/bin/env node
/**
 * Phase 5 / Step 42 — verify rendered SERP snippet lengths against a
 * running server (dev / preview / production).
 *
 * Usage:
 *   node scripts/check-serp-snippets.mjs [--base-url https://...]
 *
 * For every canonical URL in the sitemap, fetches the HTML and extracts:
 *   <title>...</title>
 *   <meta name="description" content="..." />
 *   <meta property="og:title" content="..." />
 *   <meta property="og:description" content="..." />
 *
 * Fails (exit code 1) when any of the above is missing or falls outside
 * its target length window. Use this:
 *  - locally after `npm run build && npm start`
 *  - against Vercel preview URLs in PR CI
 *  - against production weekly (paired with the GSC delta job)
 */

import { argv } from "node:process";
import sitemap from "../src/app/sitemap.ts";

const TITLE_MIN = 30;
const TITLE_MAX = 72;
const DESC_MIN = 110;
const DESC_MAX = 165;
const OG_TITLE_MIN = 30;
const OG_TITLE_MAX = 90;
const OG_DESC_MIN = 80;
const OG_DESC_MAX = 200;

function parseArgs() {
  const args = argv.slice(2);
  let baseUrl = "http://localhost:3000";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--base-url" && args[i + 1]) {
      baseUrl = args[i + 1].replace(/\/+$/, "");
      i++;
    }
  }
  return { baseUrl };
}

function extractTag(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

function extractMeta(html, attrValue) {
  // Matches both name="x" content="..." and property="x" content="..."
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${attrValue}["'][^>]*content=["']([^"']+)["']`,
    "i",
  );
  const m = html.match(re);
  if (m) return m[1].trim();
  // Try the reverse attribute order.
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${attrValue}["']`,
    "i",
  );
  const m2 = html.match(re2);
  return m2 ? m2[1].trim() : null;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function checkBounds(label, value, min, max, failures) {
  if (value == null) {
    failures.push(`${label}: MISSING`);
    return;
  }
  const decoded = decodeEntities(value);
  if (decoded.length < min || decoded.length > max) {
    failures.push(
      `${label}: length ${decoded.length} out of [${min}-${max}] — "${decoded}"`,
    );
  }
}

async function checkUrl(baseUrl, sitemapUrl) {
  const url = sitemapUrl.replace(/^https?:\/\/[^/]+/, baseUrl);
  let res;
  try {
    res = await fetch(url, { redirect: "manual" });
  } catch (err) {
    return { url, failures: [`fetch error: ${err.message}`] };
  }
  if (res.status !== 200) {
    return { url, failures: [`HTTP ${res.status} (expected 200)`] };
  }
  const html = await res.text();

  const title = extractTag(html, /<title[^>]*>([^<]+)<\/title>/i);
  const description = extractMeta(html, "description");
  const ogTitle = extractMeta(html, "og:title");
  const ogDescription = extractMeta(html, "og:description");

  const failures = [];
  checkBounds("<title>", title, TITLE_MIN, TITLE_MAX, failures);
  checkBounds(
    '<meta name="description">',
    description,
    DESC_MIN,
    DESC_MAX,
    failures,
  );
  checkBounds("og:title", ogTitle, OG_TITLE_MIN, OG_TITLE_MAX, failures);
  checkBounds(
    "og:description",
    ogDescription,
    OG_DESC_MIN,
    OG_DESC_MAX,
    failures,
  );

  return { url, failures };
}

async function main() {
  const { baseUrl } = parseArgs();
  const entries = sitemap();
  console.log(
    `Checking ${entries.length} canonical URLs against ${baseUrl} ...\n`,
  );

  let failed = 0;
  for (const entry of entries) {
    const result = await checkUrl(baseUrl, entry.url);
    if (result.failures.length === 0) {
      console.log(`  ok  ${result.url}`);
    } else {
      failed++;
      console.log(`FAIL  ${result.url}`);
      for (const f of result.failures) console.log(`        ${f}`);
    }
  }

  console.log(`\n${entries.length - failed} ok, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
