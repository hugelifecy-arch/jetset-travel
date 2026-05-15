/**
 * Phase 6 / Step 54 — CI guard against the "Duplicate field FAQPage"
 * regression that hit GSC's FAQ enhancement report between 2026-04-02
 * and 2026-04-14.
 *
 * Two checks:
 *
 *  1. NO route file may render more than one `@type":"FAQPage"` JSON-LD
 *     block (counting both inline `<script type="application/ld+json">`
 *     bodies and JSON-LD emitted via a single `<JsonLd>` / FAQ section).
 *     Two FAQPage scripts on the same page is exactly the shape that
 *     made Google flag "Duplicate field FAQPage" in April.
 *
 *  2. Every route file that imports `FAQSection` must NOT also contain
 *     an inline `"@type":"FAQPage"` string — `FAQSection` already emits
 *     its own FAQPage JSON-LD, so an inline copy duplicates the block
 *     even when both renders use different question lists.
 *
 * The test is static (regex over `src/`) — it doesn't need Next to be
 * running, so it's safe to put on the critical path of `npm test`.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(here, "..");
const srcRoot = join(repoRoot, "src");

/**
 * Recursively walk `dir` and yield absolute paths for every `.tsx` and
 * `.ts` file. Skips `node_modules` defensively even though `src` should
 * not contain one.
 */
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

/**
 * Count occurrences of `"@type":"FAQPage"` in `source`, tolerant of
 * whitespace and quote variations between TS/JS/JSON contexts.
 *
 * Matches:
 *   "@type":"FAQPage"
 *   "@type": "FAQPage"
 *   '@type': 'FAQPage'
 */
function countFaqPageMentions(source) {
  const re = /['"]@type['"]\s*:\s*['"]FAQPage['"]/g;
  return (source.match(re) ?? []).length;
}

function importsFaqSection(source) {
  return /from\s+["'][^"']*\/components\/sections\/FAQSection["']/.test(source);
}

describe("FAQ JSON-LD schema regression guard (Phase 6 Step 54)", () => {
  it("no source file emits more than one FAQPage JSON-LD block", () => {
    const offenders = [];
    for (const file of walk(srcRoot)) {
      const source = readFileSync(file, "utf8");
      const count = countFaqPageMentions(source);
      if (count > 1) {
        offenders.push({ file: relative(repoRoot, file), count });
      }
    }

    // Allow the shared FAQSection.tsx itself to contain a single FAQPage
    // literal (it's the canonical implementation) — that's already only
    // one occurrence, so no allowlist is needed here. Just assert empty.
    assert.deepEqual(
      offenders,
      [],
      `Multiple FAQPage JSON-LD blocks detected. Each page must emit ` +
        `at most one @type:"FAQPage" script — Google flags duplicates ` +
        `as "Duplicate field FAQPage" and invalidates the enhancement ` +
        `report.\nOffenders:\n${offenders
          .map((o) => `  - ${o.file}: ${o.count} mentions`)
          .join("\n")}`,
    );
  });

  it("pages that import FAQSection do not also inline an FAQPage block", () => {
    const offenders = [];
    for (const file of walk(srcRoot)) {
      const source = readFileSync(file, "utf8");
      if (!importsFaqSection(source)) continue;
      // FAQSection itself emits the JSON-LD; an inline copy elsewhere in
      // the same file is a duplicate.
      if (countFaqPageMentions(source) > 0) {
        offenders.push(relative(repoRoot, file));
      }
    }

    assert.deepEqual(
      offenders,
      [],
      `Pages that import <FAQSection /> must not also inline a ` +
        `"@type":"FAQPage" JSON-LD literal — <FAQSection /> already emits ` +
        `one. Remove the inline copy to avoid GSC "Duplicate field FAQPage" ` +
        `errors.\nOffenders:\n${offenders.map((f) => `  - ${f}`).join("\n")}`,
    );
  });
});
