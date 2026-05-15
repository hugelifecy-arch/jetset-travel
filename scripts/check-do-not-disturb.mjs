#!/usr/bin/env node
/**
 * Phase 3 — Do-Not-Disturb CI guard.
 *
 * Asserts that every URL listed in `data/do-not-disturb.json` responds
 * either 200 OK directly, or with a single-hop 301 to a 200 OK. Anything
 * else (404, 5xx, redirect chain) fails the build, because the URLs in
 * that file are currently ranking in Google Search and a regression
 * would cost real organic traffic.
 *
 * Two modes:
 *   1. Static (default) — verifies each URL is reachable from the route
 *      tree (i.e. has a corresponding `src/app/[locale]/<slug>/page.tsx`,
 *      blog `content/blog/<slug>.md`, or explicit redirect in
 *      `next.config.ts`). Runs without a live server, suitable for CI
 *      pre-merge.
 *   2. Live (`--live` flag, env URL) — fetches each URL from a running
 *      origin and verifies the HTTP response. Suitable for post-deploy
 *      smoke checks against production or a preview environment.
 *
 * Usage:
 *   node scripts/check-do-not-disturb.mjs                  # static
 *   ORIGIN=https://www.jetset-travel.com \
 *     node scripts/check-do-not-disturb.mjs --live         # live HTTP
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");

const DATA_PATH = join(ROOT, "data", "do-not-disturb.json");
const APP_DIR = join(ROOT, "src", "app", "[locale]");
const BLOG_CONTENT_DIR = join(ROOT, "content", "blog");
const NEXT_CONFIG = join(ROOT, "next.config.ts");

const args = new Set(process.argv.slice(2));
const isLive = args.has("--live");
const origin = process.env.ORIGIN || "https://www.jetset-travel.com";

function loadDoNotDisturbList() {
  const raw = readFileSync(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.urls)) {
    throw new Error(`${DATA_PATH}: "urls" must be an array`);
  }
  return parsed.urls;
}

function loadBlogSlugs() {
  if (!existsSync(BLOG_CONTENT_DIR)) return new Set();
  return new Set(
    readdirSync(BLOG_CONTENT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.slice(0, -3)),
  );
}

function loadFrontmatterSlugs() {
  // Blog frontmatter `slug:` may differ from the filename. Parse it out
  // cheaply (no `gray-matter` import — this script must run in CI without
  // hitting Next.js module resolution).
  if (!existsSync(BLOG_CONTENT_DIR)) return new Set();
  const slugs = new Set();
  for (const f of readdirSync(BLOG_CONTENT_DIR)) {
    if (!f.endsWith(".md")) continue;
    const raw = readFileSync(join(BLOG_CONTENT_DIR, f), "utf8");
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) continue;
    const slugMatch = m[1].match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
    if (slugMatch) slugs.add(slugMatch[1].trim());
  }
  return slugs;
}

function loadRedirectSources() {
  if (!existsSync(NEXT_CONFIG)) return new Set();
  const raw = readFileSync(NEXT_CONFIG, "utf8");
  const sources = new Set();
  const re = /source:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    sources.add(m[1]);
  }
  return sources;
}

function loadAppRoutes() {
  // Recursively collect every `page.tsx` under `src/app/[locale]/...` and
  // convert its directory path to a no-slash route relative to the locale.
  if (!existsSync(APP_DIR)) return new Set();
  const routes = new Set();
  routes.add(""); // locale root has page.tsx directly under [locale]
  function walk(dir, prefix) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        // Skip dynamic [slug] segments — handled by blog logic separately.
        if (entry.name.startsWith("[")) continue;
        const next = `${prefix}/${entry.name}`;
        const pageFile = join(dir, entry.name, "page.tsx");
        if (existsSync(pageFile)) routes.add(next);
        walk(join(dir, entry.name), next);
      }
    }
  }
  walk(APP_DIR, "");
  return routes;
}

function isLocaleRoot(url) {
  return url === "/en" || url === "/ru";
}

function classifyStatic(url, { appRoutes, blogSlugs, redirectSources }) {
  if (isLocaleRoot(url)) return { ok: true, reason: "locale root (page.tsx)" };

  // Strip the locale prefix.
  const localeMatch = url.match(/^\/(en|ru)(\/.*)?$/);
  if (!localeMatch) return { ok: false, reason: "missing /en or /ru prefix" };
  const tail = localeMatch[2] ?? "";

  // Blog post detail page: /en/blog/<slug>
  const blogMatch = tail.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    if (blogSlugs.has(slug)) {
      return { ok: true, reason: `blog post: content/blog/${slug}.md or frontmatter slug` };
    }
    return { ok: false, reason: `blog slug "${slug}" has no matching content/blog/*.md` };
  }

  // Static app route.
  if (appRoutes.has(tail)) {
    return { ok: true, reason: `app route: src/app/[locale]${tail}/page.tsx` };
  }

  // Allowed to resolve through an explicit redirect.
  if (redirectSources.has(url)) {
    return { ok: true, reason: `explicit redirect in next.config.ts` };
  }

  return {
    ok: false,
    reason: `no page.tsx at src/app/[locale]${tail || ""}/, no blog post, no redirect`,
  };
}

async function liveCheck(url) {
  const full = `${origin}${url}`;
  let response;
  try {
    response = await fetch(full, { redirect: "manual" });
  } catch (err) {
    return { ok: false, reason: `fetch error: ${err.message}` };
  }
  if (response.status === 200) {
    return { ok: true, reason: "200 OK" };
  }
  if (response.status === 301 || response.status === 308) {
    const location = response.headers.get("location");
    if (!location) return { ok: false, reason: `${response.status} with no Location header` };
    let target;
    try {
      target = new URL(location, full).toString();
    } catch {
      return { ok: false, reason: `${response.status} with invalid Location: ${location}` };
    }
    let second;
    try {
      second = await fetch(target, { redirect: "manual" });
    } catch (err) {
      return { ok: false, reason: `redirect target fetch error: ${err.message}` };
    }
    if (second.status === 200) {
      return { ok: true, reason: `${response.status} → 200 (single hop to ${target})` };
    }
    return {
      ok: false,
      reason: `${response.status} → ${second.status} (redirect chain to ${target})`,
    };
  }
  return { ok: false, reason: `unexpected status ${response.status}` };
}

async function main() {
  const urls = loadDoNotDisturbList();
  console.log(
    `Checking ${urls.length} protected URLs (${isLive ? `live, origin=${origin}` : "static"})...`,
  );

  const blogSlugs = new Set([
    ...loadBlogSlugs(),
    ...loadFrontmatterSlugs(),
  ]);
  const appRoutes = loadAppRoutes();
  const redirectSources = loadRedirectSources();

  const failures = [];

  for (const url of urls) {
    const result = isLive
      ? await liveCheck(url)
      : classifyStatic(url, { appRoutes, blogSlugs, redirectSources });
    const mark = result.ok ? "ok  " : "FAIL";
    console.log(`  ${mark}  ${url}  — ${result.reason}`);
    if (!result.ok) failures.push({ url, reason: result.reason });
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} protected URL${failures.length === 1 ? "" : "s"} failed:`);
    for (const f of failures) {
      console.error(`  - ${f.url}: ${f.reason}`);
    }
    console.error(
      "\nThese URLs are currently ranking in Google Search (see " +
        "docs/seo/phase-3-performance-report.md). Restore the page, fix " +
        "the redirect, or — only with SEO sign-off — remove the URL from " +
        "data/do-not-disturb.json.",
    );
    process.exit(1);
  }

  console.log(`\nAll ${urls.length} protected URLs OK.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
