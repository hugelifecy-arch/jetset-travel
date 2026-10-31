#!/usr/bin/env node
/**
 * List the rendered <title> of every EN and RU route and every blog post,
 * and flag any longer than 65 characters (Bing Webmaster flags > 70 as a
 * High-severity issue; we keep a margin).
 *
 *   npm run build && npm run start          # in one terminal
 *   node scripts/check-titles.mjs           # http://localhost:3000
 *   node scripts/check-titles.mjs --base https://www.jetset-travel.com
 *   node scripts/check-titles.mjs --all     # print every title, not just failures
 *
 * Routes come from the folders under src/app/[locale] (both locales) and
 * from content/blog (each post in its own locale), so a new page is checked
 * without editing this file. Titles are read from the served HTML, so
 * layout templates and metadata helpers are included exactly as rendered.
 * Lengths count characters (Unicode code points), not bytes, so Cyrillic is
 * counted correctly. Exits 1 if any title is over the limit or missing.
 */
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllPosts } from "../src/lib/blog.ts";
import { MAX_TITLE_LENGTH, titleLength } from "../src/lib/seo-title.ts";

const argIndex = process.argv.indexOf("--base");
const BASE = (argIndex > -1 ? process.argv[argIndex + 1] : "http://localhost:3000").replace(/\/+$/, "");
const SHOW_ALL = process.argv.includes("--all");
const LOCALES = ["en", "ru"];

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "src", "app", "[locale]");
const segments = readdirSync(appDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("[") && existsSync(join(appDir, d.name, "page.tsx")))
  .map((d) => d.name)
  .sort();

const paths = [
  ...LOCALES.flatMap((loc) => [`/${loc}`, ...segments.map((s) => `/${loc}/${s}`)]),
  ...getAllPosts()
    .filter((p) => p.frontmatter.status === "published")
    .map((p) => `/${p.frontmatter.locale}/blog/${p.frontmatter.slug}`),
];

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function inspect(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  if (res.status >= 300 && res.status < 400) {
    return { path, status: res.status, redirect: res.headers.get("location") };
  }
  const html = res.status === 200 ? await res.text() : "";
  const head = html.split(/<\/head>/i)[0];
  const m = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = m ? decode(m[1]).trim() : "";
  return { path, status: res.status, title, length: titleLength(title) };
}

const results = [];
for (let i = 0; i < paths.length; i += 8) {
  results.push(...(await Promise.all(paths.slice(i, i + 8).map(inspect))));
}

const pages = results.filter((r) => r.status === 200);
const redirects = results.filter((r) => r.redirect);
const broken = results.filter((r) => r.status !== 200 && !r.redirect);
const missing = pages.filter((r) => !r.title);
const tooLong = pages.filter((r) => r.length > MAX_TITLE_LENGTH).sort((a, b) => b.length - a.length);

const w = Math.max(...pages.map((r) => r.path.length));
if (SHOW_ALL) {
  console.log(`${"len".padStart(3)}  ${"path".padEnd(w)}  title`);
  for (const r of [...pages].sort((a, b) => b.length - a.length)) {
    console.log(`${String(r.length).padStart(3)}  ${r.path.padEnd(w)}  ${r.title}`);
  }
  console.log("");
}

console.log(`Base: ${BASE}`);
console.log(`Checked ${pages.length} pages (${redirects.length} redirecting routes skipped: they serve no title of their own).`);
for (const r of redirects) console.log(`  skip ${r.path} -> ${r.status} ${r.redirect}`);
if (broken.length) for (const r of broken) console.log(`  HTTP ${r.status}: ${r.path}`);
if (missing.length) for (const r of missing) console.log(`  NO <title>: ${r.path}`);

if (tooLong.length) {
  console.log(`\n${tooLong.length} title(s) over ${MAX_TITLE_LENGTH} characters:`);
  for (const r of tooLong) console.log(`  ${String(r.length).padStart(3)}  ${r.path.padEnd(w)}  ${r.title}`);
} else {
  const longest = Math.max(...pages.map((r) => r.length));
  console.log(`\nAll ${pages.length} titles are ${MAX_TITLE_LENGTH} characters or fewer (longest: ${longest}).`);
}
process.exit(tooLong.length || missing.length || broken.length ? 1 : 0);
