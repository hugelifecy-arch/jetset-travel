/**
 * Regression test for src/lib/canonicalize.ts.
 *
 * Proves that every URL variant reaches the canonical target
 * (https://www.jetset-travel.com/<locale>/<path> — NO trailing slash, Phase 3)
 * in a single middleware hop (after the unavoidable Vercel HTTP→HTTPS 308
 * for http:// variants).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canonicalize } from "../src/lib/canonicalize.ts";

// ---- GSC validation cases ----

const CANONICAL_ROOT = "https://www.jetset-travel.com/en";

describe("middleware: GSC 'Page with redirect' failing URLs", () => {
  // The http:// variant gets an unavoidable 308 from Vercel's platform
  // HTTPS upgrade before middleware runs. Assert on the https:// half of
  // the chain (which is what middleware controls).

  it("http://www.jetset-travel.com/ (after HTTPS upgrade) → single 301 to /en", () => {
    const result = canonicalize("https://www.jetset-travel.com/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en");
  });

  // Apex root goes straight to the locale home (one hop instead of
  // apex → www/ → www/en). Search Console listed the two-hop chain under
  // "Page with redirect" (22 Oct 2026).
  it("http://jetset-travel.com/ (after HTTPS upgrade) → single 301 to /en", () => {
    const result = canonicalize("https://jetset-travel.com/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://jetset-travel.com/ with RU Accept-Language → single 301 to /ru", () => {
    const result = canonicalize("https://jetset-travel.com/", { preferredLocale: "ru" });
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru");
  });

  it("https://www.jetset-travel.com/en/en/ → single 301 to /en", () => {
    const result = canonicalize("https://www.jetset-travel.com/en/en/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://jetset-travel.com/en → single 301 to canonical /en", () => {
    const result = canonicalize("https://jetset-travel.com/en");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://jetset-travel.com/?lang=en → single 301 to canonical /en", () => {
    const result = canonicalize("https://jetset-travel.com/?lang=en");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://jetset-travel.com/en?lang=en → single 301 to canonical /en (no double prefix)", () => {
    const result = canonicalize("https://jetset-travel.com/en?lang=en");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://www.jetset-travel.com/en?lang=en → single 301 to /en (no double prefix)", () => {
    const result = canonicalize("https://www.jetset-travel.com/en?lang=en");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, CANONICAL_ROOT);
  });

  it("https://www.jetset-travel.com/?lang=ru → single 301 to /ru", () => {
    const result = canonicalize("https://www.jetset-travel.com/?lang=ru");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru");
  });
});

describe("middleware: no-trailing-slash canonicalization", () => {
  it("already-canonical /en is passed through", () => {
    const result = canonicalize("https://www.jetset-travel.com/en");
    assert.equal(result.action, "passthrough");
  });

  it("already-canonical /ru/about is passed through", () => {
    const result = canonicalize("https://www.jetset-travel.com/ru/about");
    assert.equal(result.action, "passthrough");
  });

  it("/en/about/ (trailing slash) → 301 to /en/about", () => {
    const result = canonicalize("https://www.jetset-travel.com/en/about/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en/about");
  });

  it("/en/ (locale root with trailing slash) → 301 to /en", () => {
    const result = canonicalize("https://www.jetset-travel.com/en/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en");
  });

  it("/ru/ (locale root with trailing slash) → 301 to /ru", () => {
    const result = canonicalize("https://www.jetset-travel.com/ru/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru");
  });

  it("/en/blog/post-slug/ → 301 to /en/blog/post-slug", () => {
    const result = canonicalize(
      "https://www.jetset-travel.com/en/blog/post-slug/",
    );
    assert.equal(result.action, "redirect");
    assert.equal(
      result.url,
      "https://www.jetset-travel.com/en/blog/post-slug",
    );
  });

  it("?lang=ru on /en/about swaps locale to /ru/about in one hop", () => {
    const result = canonicalize(
      "https://www.jetset-travel.com/en/about?lang=ru",
    );
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru/about");
  });

  it("/ru/ru/blog/ collapses to /ru/blog in one hop", () => {
    const result = canonicalize("https://www.jetset-travel.com/ru/ru/blog/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru/blog");
  });

  it("bare /about on apex → single 301 to canonical /en/about", () => {
    const result = canonicalize("https://jetset-travel.com/about");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en/about");
  });

  it("/luxury special-case resolves to /en/luxury-travel in one hop", () => {
    const result = canonicalize("https://www.jetset-travel.com/luxury");
    assert.equal(result.action, "redirect");
    assert.equal(
      result.url,
      "https://www.jetset-travel.com/en/luxury-travel",
    );
  });

  it("/quote special-case resolves to /en/contact?type=quote in one hop", () => {
    const result = canonicalize("https://www.jetset-travel.com/quote");
    assert.equal(result.action, "redirect");
    assert.equal(
      result.url,
      "https://www.jetset-travel.com/en/contact?type=quote",
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
    const result = canonicalize("http://localhost:3000/en");
    assert.equal(result.action, "passthrough");
  });

  it("Vercel preview domain is never redirected to www", () => {
    const result = canonicalize("https://jetset-travel-abc.vercel.app/en");
    assert.equal(result.action, "passthrough");
  });

  // The "*-cyprus" landing pages used to have transliterated Russian
  // counterparts that bounced back to the EN-slug page (creating an infinite
  // redirect loop visible in GSC). The retired slugs are now 308-redirected
  // to the consolidated Latin slug at the edge in next.config.ts; middleware
  // sees the same Latin slug for both locales and just strips any trailing
  // slash. These cases lock the post-edge behaviour in place.
  for (const slug of [
    "luxury-travel-cyprus",
    "corporate-travel-cyprus",
    "hotel-booking-cyprus",
  ]) {
    it(`/ru/${slug}/ (trailing slash) → 301 to /ru/${slug} (no loop)`, () => {
      const result = canonicalize(`https://www.jetset-travel.com/ru/${slug}/`);
      assert.equal(result.action, "redirect");
      assert.equal(result.url, `https://www.jetset-travel.com/ru/${slug}`);
    });

    it(`already-canonical /ru/${slug} is passed through (no loop)`, () => {
      const result = canonicalize(`https://www.jetset-travel.com/ru/${slug}`);
      assert.equal(result.action, "passthrough");
    });

    it(`already-canonical /en/${slug} is passed through`, () => {
      const result = canonicalize(`https://www.jetset-travel.com/en/${slug}`);
      assert.equal(result.action, "passthrough");
    });
  }

  it("query params unrelated to lang are preserved through redirect", () => {
    const result = canonicalize(
      "https://jetset-travel.com/en/blog?utm_source=twitter",
    );
    assert.equal(result.action, "redirect");
    assert.equal(
      result.url,
      "https://www.jetset-travel.com/en/blog?utm_source=twitter",
    );
  });

  it("root on canonical www with no lang → 301 to /en", () => {
    const result = canonicalize("https://www.jetset-travel.com/", {
      preferredLocale: "en",
    });
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en");
  });

  it("root on canonical www with RU Accept-Language → 301 to /ru", () => {
    const result = canonicalize("https://www.jetset-travel.com/", {
      preferredLocale: "ru",
    });
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru");
  });
});

// ---- Upper/mixed-case locale prefix (audit 22 Oct 2026) ----
// /EN/contact used to 301 to /en/EN/contact (a 404): the prefix test is
// case-sensitive, so "EN" was treated as a bare path and got /en prepended.

describe("middleware: locale prefix in the wrong case", () => {
  for (const [input, expected] of [
    ["https://www.jetset-travel.com/EN/contact", "https://www.jetset-travel.com/en/contact"],
    ["https://www.jetset-travel.com/En", "https://www.jetset-travel.com/en"],
    ["https://www.jetset-travel.com/RU/blog/", "https://www.jetset-travel.com/ru/blog"],
    ["https://jetset-travel.com/Ru/faq", "https://www.jetset-travel.com/ru/faq"],
    ["https://www.jetset-travel.com/EN/en/about", "https://www.jetset-travel.com/en/about"],
  ]) {
    it(`${input} → single 301 to ${expected}`, () => {
      const result = canonicalize(input);
      assert.equal(result.action, "redirect");
      assert.equal(result.url, expected);
      // One hop: the target itself is canonical.
      assert.equal(canonicalize(result.url).action, "passthrough");
    });
  }

  it("only the locale segment is lower-cased; the rest of the path keeps its case", () => {
    const result = canonicalize("https://www.jetset-travel.com/EN/blog/Some-Slug");
    assert.equal(result.url, "https://www.jetset-travel.com/en/blog/Some-Slug");
  });

  it("paths that merely start with the letters en/ru are not locale prefixes", () => {
    const result = canonicalize("https://www.jetset-travel.com/ENQUIRY");
    assert.equal(result.url, "https://www.jetset-travel.com/en/ENQUIRY");
  });
});

// ---- Trailing encoded spaces (audit 22 Oct 2026) ----
// Google found /en/flight-tickets-cyprus/%20%20%20 (an inbound link with
// trailing spaces) and got a 404. Trailing whitespace is never part of a
// real path, so strip it in the same single hop.

describe("middleware: trailing whitespace in the path", () => {
  for (const [input, expected] of [
    ["https://www.jetset-travel.com/en/flight-tickets-cyprus/%20%20%20", "https://www.jetset-travel.com/en/flight-tickets-cyprus"],
    ["https://www.jetset-travel.com/en/contact%20", "https://www.jetset-travel.com/en/contact"],
    ["https://www.jetset-travel.com/ru/blog%09", "https://www.jetset-travel.com/ru/blog"],
  ]) {
    it(`${input} → single 301 to ${expected}`, () => {
      const result = canonicalize(input);
      assert.equal(result.action, "redirect");
      assert.equal(result.url, expected);
      assert.equal(canonicalize(result.url).action, "passthrough");
    });
  }

  it("encoded spaces inside a path are left alone", () => {
    const result = canonicalize("https://www.jetset-travel.com/en/blog?q=paphos%20hotels");
    assert.equal(result.action, "passthrough");
  });
});
