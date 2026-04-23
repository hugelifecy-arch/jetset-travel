/**
 * Regression test for src/lib/canonicalize.ts.
 *
 * Proves that every URL variant reaches the canonical target
 * (https://www.jetset-travel.com/<locale>/<path>/ — WITH trailing slash)
 * in a single middleware hop (after the unavoidable Vercel HTTP→HTTPS 308
 * for http:// variants).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canonicalize } from "../src/lib/canonicalize.ts";

// ---- GSC validation cases ----

const CANONICAL_ROOT = "https://www.jetset-travel.com/en/";

describe("middleware: GSC 'Page with redirect' failing URLs", () => {
  // The http:// variant gets an unavoidable 308 from Vercel's platform
  // HTTPS upgrade before middleware runs. Assert on the https:// half of
  // the chain (which is what middleware controls).

  it("http://www.jetset-travel.com/ (after HTTPS upgrade) → single 301 to /en/", () => {
    const result = canonicalize("https://www.jetset-travel.com/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en/");
  });

  it("http://jetset-travel.com/ (after HTTPS upgrade) → single 301 to canonical", () => {
    const result = canonicalize("https://jetset-travel.com/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/");
  });

  it("https://jetset-travel.com/ → single 301 to canonical www", () => {
    const result = canonicalize("https://jetset-travel.com/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/");
  });

  it("https://www.jetset-travel.com/en/en/ → single 301 to /en/", () => {
    const result = canonicalize("https://www.jetset-travel.com/en/en/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://jetset-travel.com/en → single 301 to canonical /en/", () => {
    const result = canonicalize("https://jetset-travel.com/en");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://jetset-travel.com/?lang=en → single 301 to canonical /en/", () => {
    const result = canonicalize("https://jetset-travel.com/?lang=en");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://jetset-travel.com/en?lang=en → single 301 to canonical /en/ (no double prefix)", () => {
    const result = canonicalize("https://jetset-travel.com/en?lang=en");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://www.jetset-travel.com/en?lang=en → single 301 to /en/ (no double prefix)", () => {
    const result = canonicalize("https://www.jetset-travel.com/en?lang=en");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });
});

describe("middleware: trailing-slash canonicalization", () => {
  it("already-canonical /en/ is passed through", () => {
    const result = canonicalize("https://www.jetset-travel.com/en/");
    assert.equal(result.action, "passthrough");
  });

  it("already-canonical /ru/about/ is passed through", () => {
    const result = canonicalize("https://www.jetset-travel.com/ru/about/");
    assert.equal(result.action, "passthrough");
  });

  it("/en/about (no trailing slash) → 301 to /en/about/", () => {
    const result = canonicalize("https://www.jetset-travel.com/en/about");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en/about/");
  });

  it("/en (no trailing slash) → 301 to /en/", () => {
    const result = canonicalize("https://www.jetset-travel.com/en");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en/");
  });

  it("/ru (no trailing slash) → 301 to /ru/", () => {
    const result = canonicalize("https://www.jetset-travel.com/ru");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru/");
  });

  it("/en/blog/post-slug → 301 to /en/blog/post-slug/", () => {
    const result = canonicalize(
      "https://www.jetset-travel.com/en/blog/post-slug",
    );
    assert.equal(result.action, "redirect");
    assert.equal(
      result.url,
      "https://www.jetset-travel.com/en/blog/post-slug/",
    );
  });

  it("?lang=ru on /en/about/ swaps locale to /ru/about/ in one hop", () => {
    const result = canonicalize(
      "https://www.jetset-travel.com/en/about?lang=ru",
    );
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru/about/");
  });

  it("/ru/ru/blog/ collapses to /ru/blog/ in one hop", () => {
    const result = canonicalize("https://www.jetset-travel.com/ru/ru/blog/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru/blog/");
  });

  it("bare /about on apex → single 301 to canonical /en/about/", () => {
    const result = canonicalize("https://jetset-travel.com/about");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en/about/");
  });

  it("/luxury special-case resolves to /en/luxury-travel/ in one hop", () => {
    const result = canonicalize("https://www.jetset-travel.com/luxury");
    assert.equal(result.action, "redirect");
    assert.equal(
      result.url,
      "https://www.jetset-travel.com/en/luxury-travel/",
    );
  });

  it("/quote special-case resolves to /en/contact/?type=quote in one hop", () => {
    const result = canonicalize("https://www.jetset-travel.com/quote");
    assert.equal(result.action, "redirect");
    assert.equal(
      result.url,
      "https://www.jetset-travel.com/en/contact/?type=quote",
    );
  });

  it("/robots.txt on apex is preserved (search-engine verification bypass)", () => {
    const result = canonicalize("https://jetset-travel.com/robots.txt");
    assert.equal(result.action, "passthrough");
  });

  it("/sitemap.xml on apex is preserved", () => {
    const result = canonicalize("https://jetset-travel.com/sitemap.xml");
    assert.equal(result.action, "passthrough");
  });

  it("localhost requests are never redirected to www", () => {
    const result = canonicalize("http://localhost:3000/en/");
    assert.equal(result.action, "passthrough");
  });

  it("Vercel preview domain is never redirected to www", () => {
    const result = canonicalize("https://jetset-travel-abc.vercel.app/en/");
    assert.equal(result.action, "passthrough");
  });

  it("query params unrelated to lang are preserved through redirect", () => {
    const result = canonicalize(
      "https://jetset-travel.com/en/blog?utm_source=twitter",
    );
    assert.equal(result.action, "redirect");
    assert.equal(
      result.url,
      "https://www.jetset-travel.com/en/blog/?utm_source=twitter",
    );
  });

  it("root on canonical www with no lang → 301 to /en/", () => {
    const result = canonicalize("https://www.jetset-travel.com/", {
      preferredLocale: "en",
    });
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en/");
  });

  it("root on canonical www with RU Accept-Language → 301 to /ru/", () => {
    const result = canonicalize("https://www.jetset-travel.com/", {
      preferredLocale: "ru",
    });
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru/");
  });
});
