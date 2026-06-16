/**
 * Phase 7 / Step 63 — Link-graph regression guard.
 *
 * The Phase 7 Links Audit revealed that the four trending Schengen-cluster
 * blog posts each had ≤2 inbound internal links, and the privacy page was
 * over-weighted (35 inbound) because every nav/sidebar that linked it
 * multiplied that count. After Phase 7 fixes:
 *
 *   - the Schengen-2026 cluster URLs gain a pillar hub at
 *     /<locale>/schengen-cyprus-2026 and explicit in-body anchors from
 *     /<locale>/visa-services and /<locale>/corporate-travel;
 *   - privacy is rendered only from the footer (and from the cookie-consent
 *     re-open link in the consent banner) — NOT from the main nav, the
 *     services dropdown, or any service-page template.
 *
 * This test fails (and blocks CI) if any of those properties regress.
 * It is fully static — runs in `node --test`, no Next dev server needed.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(here, "..");
const srcRoot = join(repoRoot, "src");

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      yield* walk(full);
    } else if (/\.tsx?$/.test(name)) {
      yield full;
    }
  }
}

/** All TSX/TS sources in `src/` (deterministically ordered). */
function allSources() {
  return [...walk(srcRoot)].sort();
}

/**
 * Strip line-comments and block-comments from a TS/TSX source string so
 * accidental matches inside JSDoc or `//` lines don't trip the static
 * link-graph checks. (Markdown URLs inside docstrings are not real links.)
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .replace(/^\s*\/\/.*$/gm, ""); // single-line comments
}

describe("Phase 7 — Schengen cluster has the planned internal link coverage", () => {
  // Hub page itself must exist.
  it("the topic hub page is checked into the app router", () => {
    const hubFile = join(
      srcRoot,
      "app",
      "[locale]",
      "schengen-cyprus-2026",
      "page.tsx",
    );
    assert.ok(
      existsSync(hubFile),
      "Phase 7 / Step 56 regression: the Schengen hub page is missing. " +
        "Restore src/app/[locale]/schengen-cyprus-2026/page.tsx.",
    );
  });

  // Hub must be reachable from BOTH high-authority service pages
  // (Phase 7 / Step 57). Two locales × two source files = at least 4 refs.
  it("/visa-services and /corporate-travel both link to the hub", () => {
    const visaSrc = readFileSync(
      join(srcRoot, "app", "[locale]", "visa-services", "page.tsx"),
      "utf-8",
    );
    const corpSrc = readFileSync(
      join(
        srcRoot,
        "app",
        "[locale]",
        "corporate-travel",
        "CorporateTravelContent.tsx",
      ),
      "utf-8",
    );
    assert.match(
      visaSrc,
      /schengen-cyprus-2026/,
      "Phase 7 / Step 57 regression: /visa-services no longer carries an " +
        "in-body link to the Schengen hub.",
    );
    assert.match(
      corpSrc,
      /schengen-cyprus-2026/,
      "Phase 7 / Step 57 regression: /corporate-travel no longer carries " +
        "an in-body link to the Schengen hub.",
    );
  });

  // The hub page must reference every blog post in the cluster (one
  // language-conditional per locale). Static occurrence counts under-
  // estimate runtime link counts — Related-Articles tiles and the blog
  // index render dynamically — so we assert the structural property
  // (cluster post slugs are present in the hub) rather than a numeric
  // count threshold that flickers with refactors.
  const hubPath = join(
    srcRoot,
    "app",
    "[locale]",
    "schengen-cyprus-2026",
    "page.tsx",
  );
  const clusterBlogSlugs = [
    "schengen-visa-guide-cyprus-residents",
    "cyprus-schengen-2026-business-travel",
    "shengenskaya-viza-dlya-zhitelej-kipra",
    "kipr-v-shengene-2026-delovye-poezdki",
  ];
  for (const slug of clusterBlogSlugs) {
    it(`the hub page links to /blog/${slug}`, () => {
      const hubSrc = readFileSync(hubPath, "utf-8");
      assert.ok(
        hubSrc.includes(`/blog/${slug}`),
        `Phase 7 / Step 56 regression: the Schengen hub no longer references ` +
          `/blog/${slug}. Re-add it to clusterPosts so the bidirectional ` +
          `internal-link graph is intact.`,
      );
    });
  }

  // Floor for the hub URL itself — must be referenced from at least 4
  // source files (hub page, sitemap, canonical map, breadcrumb names —
  // each unique). This is a low floor on purpose: it doesn't fluctuate
  // with content edits, but it does catch the case where the hub URL
  // gets ripped out of one of its registries.
  it("the Schengen hub URL is referenced from at least 4 source files", () => {
    let files = 0;
    for (const file of allSources()) {
      const src = stripComments(readFileSync(file, "utf-8"));
      if (/schengen-cyprus-2026/.test(src)) files++;
    }
    assert.ok(
      files >= 4,
      `Phase 7 / Step 56 regression: only ${files} source files reference ` +
        `the Schengen hub. Expect ≥4 (hub page, sitemap.ts, canonical.ts, ` +
        `breadcrumb-names.ts, visa-services + corporate-travel intros).`,
    );
  });
});

describe("Phase 7 — privacy page is footer-only", () => {
  // The audit found 35 inbound links to /en/privacy and 17 to /ru/privacy.
  // That count comes from the footer rendering on every page; what we
  // GUARD here is that privacy never leaks into the header nav, the
  // services dropdown, or any non-cookie/non-footer template — adding
  // privacy to any of those would multiply the count again.
  const FORBIDDEN_FILES = [
    "src/components/layout/Header.tsx",
    "src/components/layout/HeaderClient.tsx",
    "src/components/layout/MobileActionBar.tsx",
    "src/components/sections/ServicesCrossLinks.tsx",
    "src/components/sections/ServicesGrid.tsx",
  ];
  for (const rel of FORBIDDEN_FILES) {
    it(`${rel} does NOT link to /<locale>/privacy`, () => {
      const full = join(repoRoot, rel);
      if (!existsSync(full)) return; // file was renamed/removed — OK
      const src = readFileSync(full, "utf-8");
      assert.doesNotMatch(
        src,
        /\/privacy(?![-A-Za-z0-9_])/,
        `Phase 7 / Step 55 regression: ${rel} now references /privacy. ` +
          "Move the link back to Footer.tsx + CookieConsentBanner only.",
      );
    });
  }
});

describe("Phase 7 — trailing-slash variants don't coexist in the link graph", () => {
  // Pick the canonical no-slash form (Phase 3 lock-in). Any new code that
  // emits a trailing-slash variant of one of these high-traffic routes
  // would split internal PageRank between two URL strings.
  const CANONICAL_NO_SLASH = [
    "/en/blog",
    "/ru/blog",
    "/en/visa-services",
    "/en/corporate-travel",
    "/en/cruises",
    "/en/luxury-travel",
    "/en/hotel-reservations",
    "/en/about",
    "/en/contact",
    "/en/schengen-cyprus-2026",
  ];
  for (const path of CANONICAL_NO_SLASH) {
    it(`no internal Link points at "${path}/" (trailing-slash variant)`, () => {
      const offenders = [];
      for (const file of allSources()) {
        const src = stripComments(readFileSync(file, "utf-8"));
        // Match the path followed by a slash and then a quote so we don't
        // false-match "/en/blog/foo" (which is correct) or "/en/blog?x=1"
        // (also fine). Comments are stripped above so doc strings can show
        // the trailing-slash form without tripping the guard.
        const re = new RegExp(
          path.replace(/\//g, "\\/") + "\\/(?=[\"'`])",
          "g",
        );
        if (re.test(src)) offenders.push(file);
      }
      assert.deepStrictEqual(
        offenders,
        [],
        `Phase 7 / Step 59 regression: ${offenders.length} file(s) emit ` +
          `"${path}/" instead of "${path}". Files: ${offenders.join(", ")}`,
      );
    });
  }

  // The loop above only catches the hard-coded "/en/…/" and "/ru/…/"
  // literals. In practice almost every internal link is built as a
  // `/${locale}/<path>` template literal, so a stray trailing slash there
  // (e.g. `/${locale}/luxury-travel/`) 308-redirects at runtime yet slips
  // past the locale-literal checks above. Guard the locale-agnostic form by
  // matching the route suffix immediately after a `${…}` interpolation closes.
  const SUFFIX_NO_SLASH = [
    ...new Set(CANONICAL_NO_SLASH.map((p) => p.replace(/^\/(en|ru)/, ""))),
  ];
  for (const suffix of SUFFIX_NO_SLASH) {
    it(`no internal Link emits "\${locale}${suffix}/" (template trailing slash)`, () => {
      const offenders = [];
      for (const file of allSources()) {
        const src = stripComments(readFileSync(file, "utf-8"));
        // "}" = end of a `${…}` interpolation, then the suffix, then "/" and
        // a closing quote/backtick. Requiring the leading "}" avoids matching
        // child routes (`/blog/${slug}`) and sibling slugs
        // (`/corporate-travel-cyprus`).
        const re = new RegExp(
          "\\}" + suffix.replace(/\//g, "\\/") + "\\/(?=[\"'`])",
          "g",
        );
        if (re.test(src)) offenders.push(file);
      }
      assert.deepStrictEqual(
        offenders,
        [],
        `Trailing-slash regression: ${offenders.length} file(s) emit ` +
          `"\${locale}${suffix}/" instead of "\${locale}${suffix}". ` +
          `Files: ${offenders.join(", ")}`,
      );
    });
  }
});

describe("Phase 7 — Schengen hub is wired into canonical + sitemap + breadcrumbs", () => {
  it("the hub URL is registered in LOCALE_ALTERNATES", () => {
    const canonical = readFileSync(
      join(srcRoot, "lib", "canonical.ts"),
      "utf-8",
    );
    assert.match(
      canonical,
      /\/en\/schengen-cyprus-2026/,
      "LOCALE_ALTERNATES no longer contains the Schengen hub — sitemap " +
        "and hreflang will go silent on it. Restore the entry.",
    );
    assert.match(canonical, /\/ru\/schengen-cyprus-2026/);
  });

  it("the hub URL is listed in sitemap.ts", () => {
    const sitemap = readFileSync(join(srcRoot, "app", "sitemap.ts"), "utf-8");
    assert.match(
      sitemap,
      /\/schengen-cyprus-2026/,
      "sitemap.ts dropped the Schengen hub — Google can't see it. " +
        "Restore the staticPages entry.",
    );
  });

  it("breadcrumb labels exist in both locales", () => {
    const names = readFileSync(
      join(srcRoot, "components", "seo", "breadcrumb-names.ts"),
      "utf-8",
    );
    assert.match(names, /schengen-cyprus-2026.*Cyprus.*Schengen/s);
    assert.match(names, /schengen-cyprus-2026.*Шенген/s);
  });
});
