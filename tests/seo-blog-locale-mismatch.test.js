/**
 * SEO regression test: requesting a blog post under the wrong locale prefix
 * (e.g. /en/blog/<russian-slug> or /ru/blog/<english-slug>) must 308-redirect
 * to the correct URL, not 200-render the wrong-locale article.
 *
 * GSC flagged two real wrong-locale URLs that were 200-rendering before the
 * fix:
 *   /en/blog/luchshee-vremya-dlya-poseshcheniya-kipra  (RU slug under /en)
 *   /ru/blog/best-time-visit-cyprus-monthly-guide      (EN slug under /ru)
 *
 * `next/navigation`'s `permanentRedirect` throws an internal "NEXT_REDIRECT"
 * error tagged with the target — assert on that so the test stays free of
 * Next runtime / React rendering.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPostBySlug } from "../src/lib/blog.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGE_PATH = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "[locale]",
  "blog",
  "[slug]",
  "page.tsx",
);

const PAIRS = [
  {
    wrong: { locale: "en", slug: "luchshee-vremya-dlya-poseshcheniya-kipra" },
    right: { locale: "ru", slug: "luchshee-vremya-dlya-poseshcheniya-kipra" },
    enSlug: "best-time-visit-cyprus-monthly-guide",
  },
  {
    wrong: { locale: "ru", slug: "best-time-visit-cyprus-monthly-guide" },
    right: { locale: "en", slug: "best-time-visit-cyprus-monthly-guide" },
    ruSlug: "luchshee-vremya-dlya-poseshcheniya-kipra",
  },
];

describe("seo: blog locale-mismatch handling", () => {
  const source = fs.readFileSync(PAGE_PATH, "utf8");

  it("the blog post page uses permanentRedirect (308), not redirect (307)", () => {
    assert.match(
      source,
      /permanentRedirect\s*\(/,
      "Wrong-locale URLs must be removed from Google's index permanently — " +
        "use permanentRedirect (308) so GSC can dedupe them on the next crawl.",
    );
    assert.match(
      source,
      /post\.frontmatter\.locale\s*!==\s*locale/,
      "Expected a guard comparing the URL locale against the post's frontmatter locale.",
    );
  });

  for (const { wrong, right } of PAIRS) {
    it(`/${wrong.locale}/blog/${wrong.slug} → resolves to a post whose true locale is /${right.locale}/`, () => {
      const post = getPostBySlug(wrong.slug);
      assert.ok(post, `Test fixture missing: blog post with slug "${wrong.slug}"`);
      assert.notEqual(
        post.frontmatter.locale,
        wrong.locale,
        "Sanity check: the test fixture is supposed to be a wrong-locale case.",
      );
      assert.equal(
        post.frontmatter.locale,
        right.locale,
        `The post for slug "${wrong.slug}" must live in locale "${right.locale}".`,
      );
    });
  }

  it("EN/RU translation pair both declare `translationSlug` so the redirect can hop to the requested locale", () => {
    const en = getPostBySlug("best-time-visit-cyprus-monthly-guide");
    const ru = getPostBySlug("luchshee-vremya-dlya-poseshcheniya-kipra");
    assert.ok(en && ru, "Both EN and RU fixtures must exist.");
    // At least one side must list the other as its translation, otherwise the
    // redirect falls back to the post's own locale (still correct, but a
    // missed opportunity to keep the user in their requested locale).
    const linked =
      en.frontmatter.translationSlug === "luchshee-vremya-dlya-poseshcheniya-kipra" ||
      ru.frontmatter.translationSlug === "best-time-visit-cyprus-monthly-guide";
    assert.ok(
      linked,
      "Expected at least one of the EN/RU best-time posts to declare " +
        "`translationSlug` pointing at its counterpart.",
    );
  });
});
