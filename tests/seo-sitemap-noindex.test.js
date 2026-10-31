/**
 * Audit 2026-10-21 (F-05): sitemap.xml listed /ru/privacy and /ru/terms,
 * which render `robots: noindex`. A sitemap must only submit indexable,
 * canonical URLs. This guard keeps NOINDEX_LOCALE_PATHS and the sitemap in
 * step so a translation-pending stub can never be submitted again.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sitemap from "../src/app/sitemap.ts";
import { NOINDEX_LOCALE_PATHS } from "../src/lib/seo.ts";

describe("seo: sitemap excludes noindexed pages", () => {
  const paths = sitemap().map((entry) => new URL(entry.url).pathname);

  it("has at least one noindexed path to guard", () => {
    assert.ok(NOINDEX_LOCALE_PATHS.size > 0);
  });

  for (const noindexed of NOINDEX_LOCALE_PATHS) {
    it(`does not list ${noindexed}`, () => {
      assert.ok(!paths.includes(noindexed), `${noindexed} is noindex but listed in sitemap.xml`);
    });
  }

  it("still lists the indexable English legal pages", () => {
    assert.ok(paths.includes("/en/privacy"));
    assert.ok(paths.includes("/en/terms"));
  });
});

describe("seo: hreflang never points at a noindexed page", async () => {
  const { localizedAlternates } = await import("../src/lib/seo.ts");

  it("no sitemap entry lists a noindexed path as an alternate", () => {
    for (const entry of sitemap()) {
      for (const [lang, url] of Object.entries(entry.alternates?.languages ?? {})) {
        assert.ok(
          !NOINDEX_LOCALE_PATHS.has(new URL(url).pathname),
          `${entry.url}: hreflang=${lang} points at noindexed ${url}`,
        );
      }
    }
  });

  it("page metadata for /en/privacy and /en/terms omits the noindexed RU stubs", () => {
    for (const route of ["/privacy", "/terms"]) {
      const { languages, canonical } = localizedAlternates("en", route);
      assert.equal(canonical, `https://www.jetset-travel.com/en${route}`);
      assert.equal(languages.en, canonical);
      assert.equal(languages["x-default"], canonical);
      assert.equal(languages.ru, undefined);
      assert.equal(languages["ru-RU"], undefined);
    }
  });

  it("indexable pairs keep both languages", () => {
    const { languages } = localizedAlternates("en", "/about");
    assert.equal(languages.ru, "https://www.jetset-travel.com/ru/about");
    assert.equal(languages["ru-RU"], "https://www.jetset-travel.com/ru/about");
  });
});
