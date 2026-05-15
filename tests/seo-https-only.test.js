/**
 * Phase 8 / Step 64 — guard against insecure (http://) URL regressions.
 *
 * GSC URL Inspection on /ru/blog/kipr-v-shengene-2026-delovye-poezdki returned
 * "HTTPS — Page is not served over HTTPS". Whenever Google flags a page that
 * way it's usually because either (a) the rendered HTML contains an `http://`
 * sub-resource that the browser blocks as mixed content, or (b) the canonical
 * URL itself was emitted with an `http://` scheme. Either form is a downgrade
 * signal that throttles ranking for the affected URL.
 *
 * This test scans every TypeScript and Markdown source the site renders from
 * (the [locale] app router, the blog markdown library, lib/ helpers, all
 * components, content/blog/*.md) and FAILS the build if it finds an `http://`
 * URL pointing at a host that should always be served over HTTPS.
 *
 * Allowed `http://` strings (none of these are fetched by the browser):
 *   - XML namespace declarations: `xmlns="http://www.w3.org/..."` in inline SVG
 *   - schema.org `@context` URLs: the JSON-LD spec literal is
 *     "http://schema.org" / "https://schema.org" — both are valid identifiers
 *     and Google's parser accepts either. We only emit the `https://` form,
 *     but a future contributor may copy in a `http://schema.org` example.
 *   - Local dev URLs (`localhost`, `127.0.0.1`)
 *   - Long-form W3C / Schema.org identifier URIs (purl.org, ogp.me, etc.)
 *
 * Anything else — and in particular any `http://` reference to
 * `jetset-travel.com`, `googletagmanager.com`, `google-analytics.com`,
 * `elfsight.com`, `mc.yandex.ru`, `facebook.net`, `clarity.ms`, `wa.me` — is
 * an automatic failure.
 *
 * Runs entirely in-process so it's safe on the critical path of `npm test`.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(here, "..");

/** Directories we recursively scan. */
const SCAN_DIRS = [
  join(repoRoot, "src"),
  join(repoRoot, "content"),
];

/** Filename extensions whose contents we scan line-by-line. */
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".md", ".mdx", ".json"]);

/**
 * Substrings that, if present in a line containing `http://`, make the match
 * safe to ignore. These are identifier URIs, not fetched URLs.
 */
const ALLOWLIST_SUBSTRINGS = [
  // XML / SVG / RDF namespaces
  "http://www.w3.org/",
  "xmlns=\"http://",
  "xmlns='http://",
  // Schema.org / OGP / Dublin Core identifier URIs
  "http://schema.org",
  "http://ogp.me/",
  "http://purl.org/",
  // Local dev — never reached in production
  "http://localhost",
  "http://127.0.0.1",
  "http://0.0.0.0",
];

/**
 * Files we intentionally don't scan:
 *   - any compiled `.next/` / `node_modules/` output
 *   - test fixtures that intentionally contain a bad http:// URL
 *   - this test file itself (it contains http:// strings in its docstring)
 */
function shouldSkip(absPath) {
  if (absPath.includes(`${repoRoot}/node_modules/`)) return true;
  if (absPath.includes(`${repoRoot}/.next/`)) return true;
  if (absPath.endsWith("seo-https-only.test.js")) return true;
  return false;
}

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      yield* walk(full);
    } else {
      const dot = name.lastIndexOf(".");
      const ext = dot === -1 ? "" : name.slice(dot);
      if (SCAN_EXTENSIONS.has(ext)) yield full;
    }
  }
}

function allScannedFiles() {
  const out = [];
  for (const dir of SCAN_DIRS) {
    for (const f of walk(dir)) {
      if (!shouldSkip(f)) out.push(f);
    }
  }
  return out.sort();
}

function isAllowed(line) {
  for (const allowed of ALLOWLIST_SUBSTRINGS) {
    if (line.includes(allowed)) return true;
  }
  return false;
}

describe("Phase 8 — every rendered URL uses https://", () => {
  const files = allScannedFiles();

  it("scans a non-trivial set of source files", () => {
    // Sanity check: a future refactor that moves all source out of `src/`
    // would otherwise turn this test into a silent no-op.
    assert.ok(
      files.length >= 20,
      `expected to scan at least 20 source files, scanned ${files.length}`,
    );
  });

  it("no source file references jetset-travel.com over http://", () => {
    const offenders = [];
    for (const file of files) {
      const src = readFileSync(file, "utf-8");
      const lines = src.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("http://") && lines[i].includes("jetset-travel.com")) {
          offenders.push(`${file}:${i + 1}: ${lines[i].trim()}`);
        }
      }
    }
    assert.equal(
      offenders.length,
      0,
      `Phase 8 / Step 64 regression: found http://...jetset-travel.com references. ` +
        `These will trigger GSC "HTTPS — Page is not served over HTTPS" the moment ` +
        `Google crawls the affected page.\n  ${offenders.join("\n  ")}`,
    );
  });

  it("no source file references an external CDN over http://", () => {
    // Hosts that always have an HTTPS endpoint and should NEVER be referenced
    // over http:// from this site. Includes every third-party domain in our
    // CSP `connect-src` / `script-src` / `frame-src` allowlists.
    const httpsOnlyHosts = [
      "googletagmanager.com",
      "google-analytics.com",
      "googleapis.com",
      "gstatic.com",
      "google.com",
      "doubleclick.net",
      "mc.yandex.ru",
      "yandex.ru",
      "connect.facebook.net",
      "facebook.com",
      "facebook.net",
      "clarity.ms",
      "elfsight.com",
      "wa.me",
      "maps.google.com",
      "vercel.com",
      "vercel-insights.com",
      "youtube.com",
      "fonts.googleapis.com",
      "fonts.gstatic.com",
      "recaptcha.net",
    ];

    const offenders = [];
    for (const file of files) {
      const src = readFileSync(file, "utf-8");
      const lines = src.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.includes("http://")) continue;
        if (isAllowed(line)) continue;
        for (const host of httpsOnlyHosts) {
          if (line.includes(`http://${host}`) || line.includes(`http://www.${host}`)) {
            offenders.push(`${file}:${i + 1}: ${line.trim()}`);
            break;
          }
        }
      }
    }

    assert.equal(
      offenders.length,
      0,
      `Phase 8 / Step 64 regression: found http:// references to HTTPS-only ` +
        `external hosts. These cause mixed-content blocks in modern browsers ` +
        `and downgrade the page's HTTPS classification in Google Search Console.\n  ` +
        offenders.join("\n  "),
    );
  });

  it("no source file contains a raw http:// URL outside the allowlist", () => {
    // Catch-all rule: any `http://...` literal that isn't on the namespace /
    // identifier allowlist gets flagged. This is intentionally aggressive so
    // it surfaces things like a stray `http://cdn.example.com/...` slipped in
    // via a copy-paste from an unrelated codebase.
    const HTTP_LITERAL = /http:\/\/[^\s'"`<>()]+/g;
    const offenders = [];

    for (const file of files) {
      const src = readFileSync(file, "utf-8");
      const lines = src.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matches = line.match(HTTP_LITERAL);
        if (!matches) continue;
        for (const m of matches) {
          // Skip if the surrounding context is on the allowlist
          // (xmlns="http://...", "http://schema.org", localhost, etc.).
          if (ALLOWLIST_SUBSTRINGS.some((a) => m.startsWith(a) || line.includes(a))) {
            continue;
          }
          offenders.push(`${file}:${i + 1}: ${m}`);
        }
      }
    }

    assert.equal(
      offenders.length,
      0,
      `Phase 8 / Step 64 regression: found raw http:// URL(s) outside the ` +
        `allowlist (W3C/SVG namespaces, schema.org @context, localhost). ` +
        `Replace each with https:// or, if it's truly a namespace identifier, ` +
        `add it to ALLOWLIST_SUBSTRINGS in tests/seo-https-only.test.js.\n  ` +
        offenders.join("\n  "),
    );
  });
});

describe("Phase 8 — canonical URL builders always emit https://", () => {
  // These are smoke tests on the live constants/builders. If a future
  // refactor introduces a bug like `CANONICAL_ORIGIN = "http://..."` or a
  // sitemap entry emitted over http://, the assertion catches it without
  // needing a running server.
  it("CANONICAL_ORIGIN is https://", async () => {
    const { CANONICAL_ORIGIN } = await import("../src/lib/canonical.ts");
    assert.ok(
      CANONICAL_ORIGIN.startsWith("https://"),
      `CANONICAL_ORIGIN must use https://, got ${CANONICAL_ORIGIN}`,
    );
  });

  it("getCanonicalUrl emits https:// for every locale + route", async () => {
    const { getCanonicalUrl } = await import("../src/lib/canonical.ts");
    const samples = [
      ["", "en"],
      ["", "ru"],
      ["/blog", "en"],
      ["/blog", "ru"],
      ["/blog/kipr-v-shengene-2026-delovye-poezdki", "ru"],
      ["/blog/cyprus-schengen-2026-business-travel", "en"],
      ["/corporate-travel", "en"],
      ["/visa-services", "ru"],
    ];
    for (const [path, loc] of samples) {
      const url = getCanonicalUrl(path, /** @type {any} */ (loc));
      assert.ok(
        url.startsWith("https://"),
        `getCanonicalUrl(${JSON.stringify(path)}, ${loc}) must start with https://, got ${url}`,
      );
    }
  });

  it("every sitemap <loc> and hreflang URL is https://", async () => {
    const sitemap = (await import("../src/app/sitemap.ts")).default;
    const entries = sitemap();
    for (const entry of entries) {
      assert.ok(
        entry.url.startsWith("https://"),
        `sitemap <loc> not on https://: ${entry.url}`,
      );
      const langs = entry.alternates?.languages ?? {};
      for (const [code, href] of Object.entries(langs)) {
        assert.ok(
          typeof href === "string" && href.startsWith("https://"),
          `sitemap hreflang ${code} for ${entry.url} not on https://: ${href}`,
        );
      }
    }
  });
});
