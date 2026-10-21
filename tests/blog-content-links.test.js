/**
 * Audit 2026-10-21 (F-04, F-09): blog content regressions.
 *
 *  - `tel:` links must survive sanitization (they rendered as dead <a> tags).
 *  - Sanitization must still strip script/javascript: payloads.
 *  - Internal links in content must already be canonical: no trailing slash
 *    (each one cost a 308 hop) and no bare-origin links (301 to /en).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { markdownToHtml } from "../src/lib/markdown.ts";

const blogDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "content", "blog");
const posts = readdirSync(blogDir).filter((f) => f.endsWith(".md"));

describe("blog: markdown rendering", () => {
  it("keeps tel: hrefs", async () => {
    const html = await markdownToHtml("[Call +357 99 478 073](tel:+35799478073)");
    assert.match(html, /<a href="tel:\+35799478073">/);
  });

  it("still strips javascript: hrefs and raw script tags", async () => {
    const html = await markdownToHtml('[x](javascript:alert(1)) <script>alert(1)</script>');
    assert.doesNotMatch(html, /javascript:/i);
    assert.doesNotMatch(html, /<script/i);
  });
});

describe("blog: internal links are canonical", () => {
  for (const file of posts) {
    const body = readFileSync(join(blogDir, file), "utf8");
    it(`${file} has no trailing-slash internal links`, () => {
      const bad = body.match(/\]\(\/(?:en|ru)\/[^)\s]*\/(?:[)?#])/g) ?? [];
      assert.deepEqual(bad, []);
    });
    it(`${file} has no bare-origin links`, () => {
      assert.doesNotMatch(body, /\]\(https:\/\/www\.jetset-travel\.com\/?\)/);
    });
  }
});
