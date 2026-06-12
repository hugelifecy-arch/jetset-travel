/**
 * Drift guard for the language switcher's blog slug-pair map.
 *
 * `src/lib/blog-translation-pairs.ts` is a checked-in, client-safe mirror of
 * the per-post `translationSlug` frontmatter in `content/blog/*.md`. The
 * header resolves cross-locale blog URLs from that map on the client (the
 * filesystem-backed resolver forced every page into per-request SSR — see
 * AUDIT_REPORT.md §3).
 *
 * This test fails (and blocks CI) when a post's `translationSlug` is added,
 * removed, or changed without updating the map: every frontmatter pair must
 * appear in the map, and the map must not contain pairs that no longer exist
 * in frontmatter. Fully static — runs in `node --test`, no Next server.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(here, "..");
const blogDir = join(repoRoot, "content", "blog");
const mapFile = join(repoRoot, "src", "lib", "blog-translation-pairs.ts");

/** Parse `key: value` (optionally quoted) out of a frontmatter block. */
function fmValue(frontmatter, key) {
  const m = frontmatter.match(new RegExp(`^${key}:\\s*"?([^"\\n]+?)"?\\s*$`, "m"));
  return m ? m[1].trim() : null;
}

/** Collect { enSlug → ruSlug } pairs from every post's frontmatter. */
function pairsFromFrontmatter() {
  const pairs = new Map();
  for (const name of readdirSync(blogDir)) {
    if (!name.endsWith(".md")) continue;
    const raw = readFileSync(join(blogDir, name), "utf-8");
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fmMatch, `${name}: missing frontmatter block`);
    const fm = fmMatch[1];
    const slug = fmValue(fm, "slug");
    const locale = fmValue(fm, "locale");
    const translationSlug = fmValue(fm, "translationSlug");
    assert.ok(slug, `${name}: missing slug`);
    assert.ok(locale === "en" || locale === "ru", `${name}: bad locale`);
    if (!translationSlug) continue;
    const en = locale === "en" ? slug : translationSlug;
    const ru = locale === "ru" ? slug : translationSlug;
    const existing = pairs.get(en);
    assert.ok(
      existing === undefined || existing === ru,
      `frontmatter disagrees on the RU pair for "${en}": "${existing}" vs "${ru}"`,
    );
    pairs.set(en, ru);
  }
  return pairs;
}

/** Extract the literal pairs out of blog-translation-pairs.ts. */
function pairsFromMap() {
  const src = readFileSync(mapFile, "utf-8");
  const objMatch = src.match(
    /BLOG_SLUG_PAIRS_EN_TO_RU[^=]*=\s*\{([\s\S]*?)\n\};/,
  );
  assert.ok(objMatch, "could not locate BLOG_SLUG_PAIRS_EN_TO_RU literal");
  const pairs = new Map();
  for (const m of objMatch[1].matchAll(/"([^"]+)":\s*"([^"]+)",/g)) {
    pairs.set(m[1], m[2]);
  }
  return pairs;
}

describe("blog translation pairs map", () => {
  const fromFm = pairsFromFrontmatter();
  const fromMap = pairsFromMap();

  it("contains every frontmatter translation pair", () => {
    for (const [en, ru] of fromFm) {
      assert.equal(
        fromMap.get(en),
        ru,
        `pair "${en}" → "${ru}" missing or wrong in blog-translation-pairs.ts — update the map`,
      );
    }
  });

  it("contains no stale pairs that frontmatter no longer declares", () => {
    for (const [en, ru] of fromMap) {
      assert.equal(
        fromFm.get(en),
        ru,
        `stale pair "${en}" → "${ru}" in blog-translation-pairs.ts — remove or fix it`,
      );
    }
  });

  it("has unique RU slugs (map must be invertible for RU→EN lookups)", () => {
    const ruSlugs = [...fromMap.values()];
    assert.equal(new Set(ruSlugs).size, ruSlugs.length, "duplicate RU slug in map");
  });
});
