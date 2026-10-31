/**
 * Yandex Webmaster audit (Oct 2026): robots.txt carried `Host:` and
 * `Crawl-delay:`, both obsolete (Yandex ignores them; the main mirror comes
 * from the 301/308 redirects and crawl rate is set in Webmaster). robots.ts
 * imports through the "@/" alias, which node --test cannot resolve, so this
 * guard reads the source; scripts/verify-sitemap.mjs checks the served file.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/app/robots.ts", import.meta.url), "utf-8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*$/gm, "");

describe("seo: robots.txt", () => {
  it("emits no Host: line", () => assert.doesNotMatch(src, /\bhost\s*:/));
  it("emits no Crawl-delay: line", () => assert.doesNotMatch(src, /crawlDelay/));
  it("still points crawlers at the sitemap", () => assert.match(src, /sitemap:\s*`\$\{CANONICAL_ORIGIN\}\/sitemap\.xml`/));
  it("keeps the Yandex rule group", () => assert.match(src, /"Yandex", "YandexBot", "Mail\.RU_Bot"/));
});
