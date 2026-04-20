// @ts-check
/**
 * Regression test for src/middleware.ts canonicalization logic.
 *
 * Exercises the 8 URLs that triggered the Google Search Console "Page with
 * redirect" validation failure on 2026-04-18 to prove each one reaches the
 * canonical target in a single middleware hop (after the unavoidable Vercel
 * HTTP→HTTPS 308 for http:// variants).
 *
 * We cannot import the TypeScript middleware directly from Node's test
 * runner, so the canonicalization algorithm is mirrored here. If you change
 * src/middleware.ts, keep this port in sync.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

const CANONICAL_HOST = "www.jetset-travel.com";
const APEX_HOST = "jetset-travel.com";
const locales = ["en", "ru"];
const LOCALE_PREFIX_RE = new RegExp(`^/(${locales.join("|")})(/|$)`);
const APEX_BYPASS =
  /^\/(robots\.txt|sitemap\.xml|yandex_[a-f0-9]+\.html|mailru-verification[a-f0-9]+\.html)$/i;
const PUBLIC_FILE = /\.(.*)$/;

const BARE_PATH_SPECIALS = {
  "/luxury": { pathname: "/luxury-travel" },
  "/luxury-travel": { pathname: "/luxury-travel" },
  "/quote": { pathname: "/contact", extraSearch: { type: "quote" } },
};

function collapseDoubleLocalePrefix(pathname) {
  let out = pathname;
  for (const loc of locales) {
    const re = new RegExp(`^/${loc}/${loc}(?=/|$)`, "i");
    while (re.test(out)) {
      out = out.replace(re, `/${loc}`);
    }
  }
  return out;
}

/**
 * Pure port of src/middleware.ts canonicalization. Returns either:
 *   { action: "redirect", url }   — single 301 target
 *   { action: "rewrite",  url }   — root rewrite to /en or /ru (200)
 *   { action: "passthrough" }     — already canonical
 */
function canonicalize(inputUrl, { preferredLocale = "en" } = {}) {
  const u = new URL(inputUrl);
  const hostname = u.hostname.toLowerCase();
  const originalPathname = u.pathname;
  const originalSearch = u.search;

  const isLocalOrPreview =
    hostname.includes("localhost") ||
    hostname.endsWith(".vercel.app") ||
    hostname.endsWith(".vercel-preview.app");

  const isInternal =
    originalPathname.startsWith("/_next") ||
    originalPathname.startsWith("/api") ||
    PUBLIC_FILE.test(originalPathname);

  const shouldCanonicalizeHost =
    !isLocalOrPreview &&
    hostname === APEX_HOST &&
    !APEX_BYPASS.test(originalPathname);
  const targetHost = shouldCanonicalizeHost ? CANONICAL_HOST : hostname;
  const hostChanged = targetHost !== hostname;

  if (isInternal) {
    if (hostChanged) {
      const r = new URL(inputUrl);
      r.hostname = targetHost;
      return { action: "redirect", url: r.toString() };
    }
    return { action: "passthrough" };
  }

  let pathname = originalPathname;

  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/, "");
  }

  pathname = collapseDoubleLocalePrefix(pathname);

  const searchParams = new URLSearchParams(originalSearch);
  const lang = searchParams.get("lang");
  let queryChanged = false;
  if (lang === "en" || lang === "ru") {
    searchParams.delete("lang");
    queryChanged = true;
    const prefixMatch = pathname.match(LOCALE_PREFIX_RE);
    if (prefixMatch) {
      const existing = prefixMatch[1];
      if (existing !== lang) {
        pathname = `/${lang}${pathname.slice(existing.length + 1)}`;
      }
    } else {
      pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
    }
  }

  const special = BARE_PATH_SPECIALS[pathname];
  if (special) {
    pathname = `/en${special.pathname}`;
    if (special.extraSearch) {
      for (const [k, v] of Object.entries(special.extraSearch)) {
        if (searchParams.get(k) !== v) {
          searchParams.set(k, v);
          queryChanged = true;
        }
      }
    }
  }

  if (pathname !== "/" && !LOCALE_PREFIX_RE.test(pathname)) {
    pathname = `/en${pathname}`;
  }

  const newSearch = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";
  const pathChanged = pathname !== originalPathname;
  const searchStringChanged = queryChanged && newSearch !== originalSearch;

  if (hostChanged || pathChanged || searchStringChanged) {
    const r = new URL(inputUrl);
    r.hostname = targetHost;
    r.pathname = pathname;
    r.search = newSearch;
    return { action: "redirect", url: r.toString() };
  }

  if (pathname === "/") {
    const r = new URL(inputUrl);
    r.pathname = `/${preferredLocale}`;
    return { action: "rewrite", url: r.toString() };
  }

  return { action: "passthrough" };
}

// ---- GSC validation cases ----

const CANONICAL_ROOT = "https://www.jetset-travel.com/en";

describe("middleware: GSC 'Page with redirect' failing URLs", () => {
  // The http:// variant gets an unavoidable 308 from Vercel's platform
  // HTTPS upgrade before middleware runs. Assert on the https:// half of
  // the chain (which is what middleware controls).

  it("http://www.jetset-travel.com/ (after HTTPS upgrade) rewrites to /en (no 301)", () => {
    const result = canonicalize("https://www.jetset-travel.com/");
    assert.equal(result.action, "rewrite");
    assert.equal(result.url, "https://www.jetset-travel.com/en");
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

  // Pending duplicate-locale variants

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
});

describe("middleware: other canonicalization behaviours", () => {
  it("already-canonical /en is passed through", () => {
    const result = canonicalize("https://www.jetset-travel.com/en");
    assert.equal(result.action, "passthrough");
  });

  it("already-canonical /ru/about is passed through", () => {
    const result = canonicalize("https://www.jetset-travel.com/ru/about");
    assert.equal(result.action, "passthrough");
  });

  it("?lang=ru on /en/about swaps locale to /ru/about in one hop", () => {
    const result = canonicalize(
      "https://www.jetset-travel.com/en/about?lang=ru",
    );
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/ru/about");
  });

  it("trailing slash on interior path is stripped in one hop", () => {
    const result = canonicalize("https://www.jetset-travel.com/en/about/");
    assert.equal(result.action, "redirect");
    assert.equal(result.url, "https://www.jetset-travel.com/en/about");
  });

  it("/ru/ru/blog/ collapses and strips in one hop", () => {
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
    assert.equal(result.url, "https://www.jetset-travel.com/en/luxury-travel");
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

  it("root on canonical www with no lang → rewrite to /en (200, not 301)", () => {
    const result = canonicalize("https://www.jetset-travel.com/", {
      preferredLocale: "en",
    });
    assert.equal(result.action, "rewrite");
    assert.equal(result.url, "https://www.jetset-travel.com/en");
  });

  it("root on canonical www with RU Accept-Language → rewrite to /ru", () => {
    const result = canonicalize("https://www.jetset-travel.com/", {
      preferredLocale: "ru",
    });
    assert.equal(result.action, "rewrite");
    assert.equal(result.url, "https://www.jetset-travel.com/ru");
  });
});
