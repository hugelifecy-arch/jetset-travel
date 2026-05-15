/**
 * SEO regression test: every URL emitted in the sitemap, plus every
 * hreflang `alternates.languages` URL on it, must already be in the
 * canonical form that `src/lib/canonicalize.ts` enforces.
 *
 * The test catches the class of regression that causes
 * "Page with redirect" / "Sitemaps: Temporary processing error" entries
 * in Google Search Console: a sitemap <loc> that itself triggers a 301
 * the moment Google fetches it.
 *
 * It runs entirely in-process — no Next.js build or running server needed
 * — so it is safe to put on the critical-path of `npm test` and CI.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sitemap from "../src/app/sitemap.ts";
import {
  CANONICAL_ORIGIN,
  LOCALE_ALTERNATES,
} from "../src/lib/canonical.ts";
import { canonicalize } from "../src/lib/canonicalize.ts";
import { resolveAlternateUrls } from "../src/lib/i18n-route-resolver.ts";

/**
 * The static redirects from next.config.ts plus the bare-path special-cases
 * in canonicalize.ts. None of these source paths may ever appear as a
 * sitemap <loc> — they would each cost Google a 308 hop on fetch.
 *
 * Phase 3: stored in the no-slash canonical form to match LOCALE_ALTERNATES.
 */
const RETIRED_PATHS = new Set([
  "/luxury",
  "/en/luxury",
  "/ru/luxury",
  "/ru/paphos-travel-agency",
  "/en/turisticheskoe-agentstvo-pafos",
  "/ru/flight-tickets-cyprus",
  "/en/aviabilety-kipr",
  "/en/vizovye-uslugi-kipr",
  "/ru/vizovye-uslugi-kipr",
  "/en/luxusnyy-otdykh-kipr",
  "/ru/luxusnyy-otdykh-kipr",
  "/en/korporativnye-poezdki-kipr",
  "/ru/korporativnye-poezdki-kipr",
  "/en/bronirovanie-otelej-kipr",
  "/ru/bronirovanie-otelej-kipr",
  // Phase 3 wrong-folder fix: RU folder was serving an EN-only slug.
  "/ru/blog/cyprus-schengen-2026-business-travel",
]);

function assertCanonical(url, context) {
  const result = canonicalize(url);
  assert.equal(
    result.action,
    "passthrough",
    `${context}: ${url} should already be canonical, ` +
      `but canonicalize() wants to redirect it to ${
        result.action === "redirect" ? result.url : "unknown"
      }`,
  );
}

describe("seo: every sitemap URL is canonical", () => {
  const entries = sitemap();

  it("sitemap contains at least the static pages we expect", () => {
    // Sanity check: catch the case where the generator silently emits
    // an empty sitemap (would be Success-empty in GSC).
    assert.ok(
      entries.length >= 30,
      `expected at least 30 sitemap entries, got ${entries.length}`,
    );
  });

  it("every <loc> is on the canonical origin", () => {
    for (const entry of entries) {
      assert.ok(
        entry.url.startsWith(`${CANONICAL_ORIGIN}/`),
        `sitemap <loc> is not on canonical origin: ${entry.url}`,
      );
    }
  });

  it("every <loc> uses the NO-trailing-slash canonical form", () => {
    for (const entry of entries) {
      const { pathname } = new URL(entry.url);
      assert.ok(
        pathname === "/" || !pathname.endsWith("/"),
        `sitemap <loc> has stray trailing slash: ${entry.url}`,
      );
      assert.ok(
        !pathname.includes("//"),
        `sitemap <loc> has duplicated slashes: ${entry.url}`,
      );
    }
  });

  it("no <loc> is a retired/redirecting path", () => {
    for (const entry of entries) {
      const { pathname } = new URL(entry.url);
      assert.ok(
        !RETIRED_PATHS.has(pathname),
        `sitemap <loc> points at a path that ${pathname} is 308-redirected: ` +
          `${entry.url}`,
      );
    }
  });

  it("every <loc> survives canonicalize() as passthrough", () => {
    for (const entry of entries) {
      assertCanonical(entry.url, "sitemap <loc>");
    }
  });

  it("every hreflang alternate URL is also canonical", () => {
    for (const entry of entries) {
      const langs = entry.alternates?.languages;
      if (!langs) continue;
      for (const [hreflang, url] of Object.entries(langs)) {
        if (!url) continue;
        assertCanonical(
          url,
          `sitemap hreflang=${hreflang} alternate for ${entry.url}`,
        );
        const { pathname } = new URL(url);
        assert.ok(
          !RETIRED_PATHS.has(pathname),
          `sitemap hreflang=${hreflang} alternate points at retired path: ${url}`,
        );
      }
    }
  });

  it("every <loc> appears as the self-locale alternate", () => {
    // If a URL ships in the sitemap WITHOUT pointing at itself via the
    // matching hreflang, Google sees a contradictory signal: the URL is
    // claimed bilingual but doesn't self-identify. Catch that drift.
    for (const entry of entries) {
      const langs = entry.alternates?.languages;
      if (!langs) continue;
      const { pathname } = new URL(entry.url);
      const selfLocale = pathname.startsWith("/ru") ? "ru" : "en";
      const selfHreflang = langs[selfLocale];
      assert.ok(
        selfHreflang,
        `${entry.url} is missing self-locale alternate hreflang=${selfLocale}`,
      );
      assert.equal(
        selfHreflang,
        entry.url,
        `${entry.url} self-alternate (hreflang=${selfLocale}) is ${selfHreflang}`,
      );
    }
  });
});

describe("seo: LOCALE_ALTERNATES is internally consistent", () => {
  it("every entry's keys point at no-trailing-slash absolute paths", () => {
    for (const [key, entry] of Object.entries(LOCALE_ALTERNATES)) {
      assert.ok(
        key.startsWith("/") && !key.endsWith("/"),
        `LOCALE_ALTERNATES key is not no-trailing-slash form: ${key}`,
      );
      for (const [locale, target] of Object.entries(entry)) {
        if (!target) continue;
        assert.ok(
          target.startsWith("/") && !target.endsWith("/"),
          `LOCALE_ALTERNATES[${key}].${locale} is not no-trailing-slash form: ${target}`,
        );
      }
    }
  });

  it("every alternate target is itself a key (round-trip consistency)", () => {
    // Prevents one-way links: if /en/foo claims /ru/bar as its RU
    // alternate, then /ru/bar must also claim /en/foo as its EN.
    for (const [key, entry] of Object.entries(LOCALE_ALTERNATES)) {
      for (const [locale, target] of Object.entries(entry)) {
        if (!target || target === key) continue;
        const reverse = LOCALE_ALTERNATES[target];
        assert.ok(
          reverse,
          `LOCALE_ALTERNATES[${key}].${locale} → ${target} but ${target} ` +
            `has no entry of its own`,
        );
      }
    }
  });

  it("every target URL canonicalizes as passthrough", () => {
    for (const entry of Object.values(LOCALE_ALTERNATES)) {
      for (const target of Object.values(entry)) {
        if (!target) continue;
        const url = `${CANONICAL_ORIGIN}${target}`;
        assertCanonical(url, "LOCALE_ALTERNATES target");
      }
    }
  });
});

describe("seo: language switcher resolver", () => {
  // Step 14 — the language switcher must point to a real 200-OK URL or
  // be hidden, never to a guessed string-substituted path. These cases
  // are the ones URL Inspection flagged: /en/about, /en/cruises, etc.

  it("resolves /en/about → real /ru/about", () => {
    const { en, ru } = resolveAlternateUrls("/en/about");
    assert.equal(en, `${CANONICAL_ORIGIN}/en/about`);
    assert.equal(ru, `${CANONICAL_ORIGIN}/ru/about`);
  });

  it("resolves /ru/about → real /en/about", () => {
    const { en, ru } = resolveAlternateUrls("/ru/about");
    assert.equal(en, `${CANONICAL_ORIGIN}/en/about`);
    assert.equal(ru, `${CANONICAL_ORIGIN}/ru/about`);
  });

  it("cross-locale slug pair: /en/paphos-travel-agency ↔ /ru/turisticheskoe-agentstvo-pafos", () => {
    const { en, ru } = resolveAlternateUrls("/en/paphos-travel-agency");
    assert.equal(en, `${CANONICAL_ORIGIN}/en/paphos-travel-agency`);
    assert.equal(ru, `${CANONICAL_ORIGIN}/ru/turisticheskoe-agentstvo-pafos`);
  });

  it("cross-locale slug pair (reverse): /ru/turisticheskoe-agentstvo-pafos ↔ /en/paphos-travel-agency", () => {
    const { en, ru } = resolveAlternateUrls("/ru/turisticheskoe-agentstvo-pafos");
    assert.equal(en, `${CANONICAL_ORIGIN}/en/paphos-travel-agency`);
    assert.equal(ru, `${CANONICAL_ORIGIN}/ru/turisticheskoe-agentstvo-pafos`);
  });

  it("blog post with translation: returns both locales", () => {
    // digital-nomads-cyprus-guide ↔ digital-nomady-kipr-gid (confirmed
    // present in content/blog/).
    const { en, ru } = resolveAlternateUrls(
      "/en/blog/digital-nomads-cyprus-guide",
    );
    assert.equal(
      en,
      `${CANONICAL_ORIGIN}/en/blog/digital-nomads-cyprus-guide`,
    );
    assert.ok(ru, "blog post with translationSlug should resolve RU URL");
    assert.ok(
      ru.startsWith(`${CANONICAL_ORIGIN}/ru/blog/`),
      `expected RU blog URL, got ${ru}`,
    );
  });

  it("unknown blog slug: hides the other-locale link", () => {
    const { en, ru } = resolveAlternateUrls("/en/blog/does-not-exist");
    assert.equal(en, `${CANONICAL_ORIGIN}/en/blog/does-not-exist`);
    assert.equal(ru, null, "missing post slug must not emit a guessed alternate");
  });

  it("locale roots resolve to both locale roots", () => {
    const { en, ru } = resolveAlternateUrls("/en");
    assert.equal(en, `${CANONICAL_ORIGIN}/en`);
    assert.equal(ru, `${CANONICAL_ORIGIN}/ru`);
  });

  it("returned URLs survive canonicalize() as passthrough", () => {
    const paths = [
      "/en",
      "/ru",
      "/en/about",
      "/ru/contact",
      "/en/paphos-travel-agency",
      "/ru/turisticheskoe-agentstvo-pafos",
      "/en/blog/digital-nomads-cyprus-guide",
    ];
    for (const path of paths) {
      const alt = resolveAlternateUrls(path);
      for (const [loc, url] of Object.entries(alt)) {
        if (url) assertCanonical(url, `resolveAlternateUrls(${path}).${loc}`);
      }
    }
  });
});
