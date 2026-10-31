/**
 * Bing Webmaster (Oct 2026): <title> over 70 characters is a High-severity
 * issue. Every title we control stays at or under 65 characters, counted as
 * characters (code points), not bytes. scripts/check-titles.mjs checks the
 * rendered titles of every route on a running build; this suite covers the
 * parts that need no server, so CI catches regressions.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getPublishedPosts } from "../src/lib/blog.ts";
import {
  BLOG_TITLE_SUFFIX,
  MAX_TITLE_LENGTH,
  blogDocumentTitle,
  titleLength,
} from "../src/lib/seo-title.ts";

const messages = {
  en: JSON.parse(readFileSync(new URL("../src/messages/en.json", import.meta.url), "utf-8")),
  ru: JSON.parse(readFileSync(new URL("../src/messages/ru.json", import.meta.url), "utf-8")),
};

describe("seo-title: blogDocumentTitle", () => {
  it("adds ' | JetSet' when the result fits", () => {
    assert.equal(BLOG_TITLE_SUFFIX, " | JetSet");
    assert.equal(blogDocumentTitle({ title: "Cruises from Limassol" }), "Cruises from Limassol | JetSet");
  });

  it("drops the suffix rather than go over 65 characters", () => {
    const title = "x".repeat(60); // 60 + 9 = 69
    assert.equal(blogDocumentTitle({ title }), title);
    const fits = "y".repeat(56); // 56 + 9 = 65, the limit itself
    assert.equal(blogDocumentTitle({ title: fits }), `${fits} | JetSet`);
  });

  it("uses seoTitle as written when present", () => {
    assert.equal(blogDocumentTitle({ title: "Long H1", seoTitle: "Short | JetSet" }), "Short | JetSet");
  });

  it("counts characters, not bytes", () => {
    assert.equal(titleLength("Кипр"), 4);
    assert.equal(titleLength("2026–27 — JetSet"), 16);
  });
});

describe("seo-title: every blog post <title> fits", () => {
  const posts = getPublishedPosts();
  const seen = new Map();
  for (const post of posts) {
    const { locale, slug, seoTitle } = post.frontmatter;
    const id = `${locale}/${slug}`;
    const docTitle = blogDocumentTitle(post.frontmatter);
    it(`${id}: <title> is at most ${MAX_TITLE_LENGTH} characters`, () => {
      assert.ok(
        titleLength(docTitle) <= MAX_TITLE_LENGTH,
        `${titleLength(docTitle)} chars: "${docTitle}" (add or shorten seoTitle)`,
      );
      if (seoTitle !== undefined) assert.ok(seoTitle.trim(), "seoTitle is empty");
    });
    it(`${id}: <title> is unique`, () => {
      assert.ok(!seen.has(docTitle), `same <title> as ${seen.get(docTitle)}: "${docTitle}"`);
      seen.set(docTitle, id);
    });
  }

  it("uses the owner-specified titles", () => {
    const bySlug = new Map(posts.map((p) => [p.frontmatter.slug, blogDocumentTitle(p.frontmatter)]));
    assert.equal(bySlug.get("larnaca-vs-paphos-airport-2026"), "Larnaca vs Paphos Airport 2026: Which to Fly From? | JetSet");
    assert.equal(bySlug.get("luchshee-vremya-dlya-poseshcheniya-kipra"), "Когда ехать на Кипр: погода и цены по месяцам 2026–27 | JetSet");
    assert.ok(bySlug.get("korporativnye-komandirovki-kipr-gid").startsWith("Корпоративные командировки на Кипр"));
  });

  it("keeps the full post title for the H1 / og:title (seoTitle never replaces it)", () => {
    for (const post of posts) assert.ok(post.frontmatter.title.trim(), post.frontmatter.slug);
  });
});

describe("seo-title: metaTitle strings in the message catalogues fit", () => {
  for (const locale of ["en", "ru"]) {
    for (const [ns, values] of Object.entries(messages[locale])) {
      if (typeof values?.metaTitle !== "string") continue;
      it(`${locale}.${ns}.metaTitle is at most ${MAX_TITLE_LENGTH} characters`, () => {
        assert.ok(
          titleLength(values.metaTitle) <= MAX_TITLE_LENGTH,
          `${titleLength(values.metaTitle)} chars: "${values.metaTitle}"`,
        );
      });
    }
  }
});

describe("seo-title: /en/cruises", () => {
  it("uses the owner-specified title", () => {
    const src = readFileSync(new URL("../src/app/[locale]/cruises/page.tsx", import.meta.url), "utf-8");
    assert.ok(src.includes('"Cruise Booking Cyprus | Mediterranean & World Cruises | JetSet"'));
  });
});
