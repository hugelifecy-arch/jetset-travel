/**
 * SEO regression test: the WebSite JSON-LD `potentialAction` must use the
 * Schema.org `EntryPoint` form for its `target`.
 *
 * The previous shape — `target: "https://…/?q={search_term_string}"` — caused
 * Googlebot to fetch the literal placeholder URL as if it were a real page,
 * which surfaced in Google Search Console as a 5xx "Server error (Not Started)"
 * indexing failure. See:
 * https://developers.google.com/search/docs/appearance/sitelinks-search-box
 *
 * This test reads the source of `WebSiteSchema.tsx` and asserts on the
 * `target` literal — keeping the test runtime-free so it slots into the
 * existing `npm test` (node --test) suite without needing React or Next.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "seo",
  "WebSiteSchema.tsx",
);

describe("seo: WebSite SearchAction schema", () => {
  const source = fs.readFileSync(SCHEMA_PATH, "utf8");

  it("uses an EntryPoint object for `target`, not a bare string", () => {
    // The bug shape: `target: "https://…?q={search_term_string}"`
    // The fix shape: `target: { "@type": "EntryPoint", urlTemplate: "…" }`
    const bareStringTarget = /target:\s*"https:\/\/[^"]*\{search_term_string\}[^"]*"/;
    assert.equal(
      bareStringTarget.test(source),
      false,
      "WebSiteSchema must not set `target` to a bare URL string — Googlebot " +
        "will fetch the literal placeholder. Use an EntryPoint object.",
    );

    assert.match(
      source,
      /target:\s*\{[\s\S]*"@type":\s*"EntryPoint"[\s\S]*urlTemplate:/,
      "Expected `target` to be an EntryPoint object with a `urlTemplate` key.",
    );
  });

  it("declares `query-input: required name=search_term_string`", () => {
    assert.match(
      source,
      /"query-input":\s*"required name=search_term_string"/,
      "SearchAction requires the `query-input` pairing for Google sitelinks.",
    );
  });

  it("urlTemplate is on the canonical https://www host with /en prefix", () => {
    const m = source.match(/urlTemplate:\s*"([^"]+)"/);
    assert.ok(m, "urlTemplate must be declared as a string literal");
    const url = m[1];
    assert.ok(
      url.startsWith("https://www.jetset-travel.com/"),
      `urlTemplate must be on the canonical origin, got: ${url}`,
    );
    assert.ok(
      url.includes("{search_term_string}"),
      "urlTemplate must contain the {search_term_string} placeholder",
    );
  });

  it("`url` is the canonical /en homepage, no trailing slash", () => {
    // `url: "https://www.jetset-travel.com/"` is a 301 hop (middleware
    // redirects bare-root to /en). Use the no-redirect form.
    assert.match(
      source,
      /url:\s*"https:\/\/www\.jetset-travel\.com\/en"/,
      "WebSite `url` should point at /en (no trailing slash) so Google never " +
        "follows a 301 from the schema's homepage identifier.",
    );
  });
});
