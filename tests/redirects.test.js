/**
 * Retired / merged / wrong-locale URLs (src/lib/redirects.ts).
 *
 * Every source must reach a live page in ONE 301 from the proxy, whatever
 * shape the request arrives in: trailing slash, upper-case locale, apex
 * host, no locale prefix, extra query string. Destinations must be live
 * sitemap pages (never another redirect), and no sitemap URL may be a
 * redirect source.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import sitemap from "../src/app/sitemap.ts";
import { PATH_REDIRECTS, resolvePathRedirect } from "../src/lib/redirects.ts";
import { canonicalize } from "../src/lib/canonicalize.ts";

const WWW = "https://www.jetset-travel.com";
const APEX = "https://jetset-travel.com";
const entries = Object.entries(PATH_REDIRECTS);
const sitemapPaths = new Set(sitemap().map((e) => new URL(e.url).pathname));

/** canonicalize() must redirect `url` straight to `expected`, in one hop. */
function assertOneHop(url, expected) {
  const result = canonicalize(url);
  assert.equal(result.action, "redirect", `${url} should redirect`);
  assert.equal(result.url, expected, `${url} → ${result.url}, expected ${expected}`);
  assert.equal(
    canonicalize(result.url).action,
    "passthrough",
    `${url} → ${result.url} is not final (redirect chain)`,
  );
}

describe("redirects: the table itself", () => {
  it("has entries", () => {
    assert.ok(entries.length > 20, `only ${entries.length} redirects`);
  });

  for (const [source, destination] of entries) {
    it(`${source} → ${destination}: canonical form, same locale, no chain`, () => {
      for (const p of [source, destination]) {
        assert.match(p, /^\/(en|ru)\/[a-z0-9-]+(\/[a-z0-9-]+)*$/, `${p} is not lower-case, locale-prefixed, no-slash`);
      }
      assert.equal(source.slice(0, 4), destination.slice(0, 4), "redirect must keep the locale");
      assert.notEqual(source, destination);
      assert.equal(resolvePathRedirect(destination), null, `${destination} is itself redirected (chain)`);
    });
  }

  it("every destination is a live page listed in the sitemap", () => {
    for (const [source, destination] of entries) {
      assert.ok(sitemapPaths.has(destination), `${source} → ${destination}, which is not in sitemap.xml`);
    }
  });

  it("no sitemap URL is a redirect source", () => {
    for (const p of sitemapPaths) {
      assert.equal(resolvePathRedirect(p), null, `${p} is in sitemap.xml but redirects`);
    }
  });
});

describe("redirects: every request shape reaches the destination in one 301", () => {
  for (const [source, destination] of entries) {
    const expected = `${WWW}${destination}`;
    const upperLocale = source.replace(/^\/(en|ru)/, (m) => m.toUpperCase());
    it(`${source} (plain, slash, case, apex, query)`, () => {
      assertOneHop(`${WWW}${source}`, expected);
      assertOneHop(`${WWW}${source}/`, expected);
      assertOneHop(`${WWW}${upperLocale}`, expected);
      assertOneHop(`${WWW}${source.toUpperCase()}`, expected);
      assertOneHop(`${APEX}${source}`, expected);
      assertOneHop(`${APEX}${source}/`, expected);
      assertOneHop(`${WWW}${source}/?utm_source=x`, `${expected}?utm_source=x`);
    });
  }

  it("English sources also resolve without the locale prefix", () => {
    for (const [source, destination] of entries.filter(([s]) => s.startsWith("/en/"))) {
      assertOneHop(`${WWW}${source.slice(3)}`, `${WWW}${destination}`);
    }
  });

  it("?lang= swaps the locale and still lands on the right page", () => {
    assertOneHop(`${WWW}/en/visa-services-cyprus?lang=ru`, `${WWW}/ru/visa-services`);
  });
});

describe("redirects: Search Console audit (1 Nov 2026)", () => {
  it("/en/visa-services-cyprus → /en/visa-services", () => {
    assertOneHop(`${WWW}/en/visa-services-cyprus`, `${WWW}/en/visa-services`);
  });

  it("/ru/visa-services-cyprus → /ru/visa-services", () => {
    assertOneHop(`${WWW}/ru/visa-services-cyprus`, `${WWW}/ru/visa-services`);
  });

  it("trailing-slash URLs → the no-slash URL in one hop", () => {
    assertOneHop(`${WWW}/ru/about/`, `${WWW}/ru/about`);
    assertOneHop(`${WWW}/en/about/`, `${WWW}/en/about`);
    assertOneHop(`${APEX}/ru/about/`, `${WWW}/ru/about`);
  });

  it("/corporate-travel-cyprus (merged 1 Nov 2026) → /corporate-travel, with or without a slash", () => {
    for (const loc of ["en", "ru"]) {
      assertOneHop(`${WWW}/${loc}/corporate-travel-cyprus`, `${WWW}/${loc}/corporate-travel`);
      assertOneHop(`${WWW}/${loc}/corporate-travel-cyprus/`, `${WWW}/${loc}/corporate-travel`);
      assertOneHop(`${WWW}/${loc}/korporativnye-poezdki-kipr`, `${WWW}/${loc}/corporate-travel`);
    }
  });

  it("the proxy answers 301 (not 307/308)", () => {
    const proxy = readFileSync(new URL("../src/proxy.ts", import.meta.url), "utf-8");
    assert.match(proxy, /NextResponse\.redirect\([^)]*,\s*301\)/);
  });

  it("next.config.ts leaves redirects and trailing slashes to the proxy", () => {
    const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf-8");
    assert.doesNotMatch(config, /async redirects\(/);
    assert.match(config, /skipTrailingSlashRedirect:\s*true/);
    assert.match(config, /trailingSlash:\s*false/);
  });
});
