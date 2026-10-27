/**
 * Blog article heading anchors, contents list and CTA placement
 * (src/lib/article-headings.ts).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  addHeadingIds,
  buildToc,
  ctaInsertOffset,
  headingText,
  slugifyHeading,
} from "../src/lib/article-headings.ts";
import { markdownToHtml } from "../src/lib/markdown.ts";

const blogDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "content", "blog");

describe("slugifyHeading", () => {
  it("lower-cases and hyphenates English headings, dropping punctuation", () => {
    assert.equal(slugifyHeading("Larnaca vs Paphos at a Glance"), "larnaca-vs-paphos-at-a-glance");
    assert.equal(slugifyHeading("Meet & Assist: What's Included?"), "meet-assist-whats-included");
    assert.equal(slugifyHeading("  Express Lane — Larnaca only  "), "express-lane-larnaca-only");
  });

  it("keeps Cyrillic letters instead of returning an empty slug", () => {
    assert.equal(slugifyHeading("Что такое VIP-сервис?"), "что-такое-vip-сервис");
    assert.equal(slugifyHeading("Ларнака и Пафос: сравнение"), "ларнака-и-пафос-сравнение");
    assert.equal(slugifyHeading("Ёлки и йод"), "ёлки-и-йод");
  });

  it("keeps digits and collapses repeated separators", () => {
    assert.equal(slugifyHeading("Top 5 cruises -- 2026 / 2027"), "top-5-cruises-2026-2027");
  });

  it("returns an empty string when nothing usable is left", () => {
    assert.equal(slugifyHeading("?!…"), "");
  });

  it("caps very long slugs at a word boundary", () => {
    const slug = slugifyHeading(
      "Как получить шенгенскую визу для жителей Кипра в 2026 году: документы, сроки и типичные ошибки",
    );
    assert.ok(slug.length <= 64, slug);
    assert.ok(!slug.endsWith("-"));
    assert.ok(slug.startsWith("как-получить-шенгенскую-визу"));
  });
});

describe("headingText", () => {
  it("strips inline tags and decodes the entities remark-html emits", () => {
    assert.equal(headingText("Meet <strong>&#x26;</strong> Assist"), "Meet & Assist");
    assert.equal(headingText("a &#x3C; b &amp; c &#169;"), "a < b & c ©");
  });
});

describe("addHeadingIds", () => {
  it("adds ids to bare h2–h6 tags and lists them in order", () => {
    const { html, headings } = addHeadingIds("<h2>One</h2>\n<p>x</p>\n<h3>Two</h3>");
    assert.equal(html, '<h2 id="one">One</h2>\n<p>x</p>\n<h3 id="two">Two</h3>');
    assert.deepEqual(
      headings.map(({ level, id, text }) => ({ level, id, text })),
      [
        { level: 2, id: "one", text: "One" },
        { level: 3, id: "two", text: "Two" },
      ],
    );
  });

  it("de-duplicates repeated headings and avoids reserved ids", () => {
    const { headings } = addHeadingIds(
      "<h2>FAQ</h2><h2>FAQ</h2><h2>Main content</h2><h2>?</h2>",
      ["main-content"],
    );
    assert.deepEqual(headings.map((h) => h.id), ["faq", "faq-1", "main-content-1", "section"]);
  });

  it("records offsets that point at the heading in the returned HTML", () => {
    const { html, headings } = addHeadingIds("<p>intro</p><h2>A</h2><p>a</p><h2>B</h2>");
    for (const h of headings) assert.ok(html.startsWith(`<h2 id="${h.id}">`, h.offset));
  });

  it("marks headings nested in other elements as not top-level", () => {
    const { headings } = addHeadingIds(
      "<h2>Top</h2><blockquote><h2>Quoted</h2></blockquote><p>a<br>b<img src=x></p><h2>After</h2>",
    );
    assert.deepEqual(headings.map((h) => h.topLevel), [true, false, true]);
  });

  it("leaves headings that already carry attributes alone", () => {
    const input = '<h2 id="user-content-x">X</h2>';
    assert.deepEqual(addHeadingIds(input), { html: input, headings: [] });
  });

  it("works on real markdownToHtml output", async () => {
    const md = "Intro\n\n## Why **VIP**?\n\nText\n\n### Fast & easy\n\n## Цены и сроки\n";
    const { html, headings } = addHeadingIds(await markdownToHtml(md));
    assert.match(html, /<h2 id="why-vip">Why <strong>VIP<\/strong>\?<\/h2>/);
    assert.match(html, /<h3 id="fast-easy">/);
    assert.match(html, /<h2 id="цены-и-сроки">/);
    assert.equal(headings.length, 3);
  });

  it("gives every heading of every published post a unique, non-empty id", async () => {
    for (const name of readdirSync(blogDir).filter((f) => f.endsWith(".md"))) {
      const raw = readFileSync(join(blogDir, name), "utf-8");
      const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");
      const { html, headings } = addHeadingIds(await markdownToHtml(body), ["main-content"]);
      const ids = headings.map((h) => h.id);
      assert.equal(new Set(ids).size, ids.length, `${name}: duplicate heading ids`);
      assert.ok(ids.every((id) => /^[\p{L}\p{M}\p{N}-]+$/u.test(id)), `${name}: odd id`);
      assert.equal((html.match(/<h[2-6]>/g) ?? []).length, 0, `${name}: heading without id`);
    }
  });
});

const h = (level, text, offset, topLevel = true) => ({ level, text, id: text, offset, topLevel });

describe("buildToc", () => {
  it("lists H2s only, and only when there are at least three", () => {
    assert.equal(buildToc([h(2, "a", 0), h(3, "b", 1), h(2, "c", 2)]), null);
    assert.deepEqual(buildToc([h(2, "a", 0), h(3, "b", 1), h(2, "c", 2), h(2, "d", 3)]), [
      { id: "a", text: "a" },
      { id: "c", text: "c" },
      { id: "d", text: "d" },
    ]);
  });
});

describe("ctaInsertOffset", () => {
  it("goes before the third H2 when there are at least three", () => {
    assert.equal(ctaInsertOffset([h(2, "a", 10), h(3, "x", 15), h(2, "b", 20), h(2, "c", 30), h(2, "d", 40)]), 30);
  });

  it("skips nested H2s", () => {
    assert.equal(ctaInsertOffset([h(2, "a", 10), h(2, "q", 15, false), h(2, "b", 20), h(2, "c", 30)]), 30);
  });

  it("otherwise goes before a conclusion heading", () => {
    assert.equal(ctaInsertOffset([h(2, "Conclusion", 10)]), 10);
    assert.equal(ctaInsertOffset([h(2, "Итоги", 10), h(2, "FAQ", 20)]), 10);
  });

  it("otherwise before the last of two H2s, or after the body", () => {
    assert.equal(ctaInsertOffset([h(2, "a", 10), h(2, "b", 20)]), 20);
    assert.equal(ctaInsertOffset([h(2, "a", 10)]), null);
    assert.equal(ctaInsertOffset([]), null);
  });
});
