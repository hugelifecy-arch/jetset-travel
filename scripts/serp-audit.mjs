#!/usr/bin/env node
/**
 * Phase 5 / Step 36 — capture the actual Google desktop SERP for the
 * 10 zero-CTR queries surfaced by GSC, so we can see what is eating the
 * clicks (AI Overviews, People Also Ask, ads, knowledge panel, etc.).
 *
 * This is a ONE-OFF audit, run on demand — NOT part of CI. The output
 * (screenshots + a small JSON report) feeds the next round of structured
 * data / meta description work.
 *
 * Playwright is intentionally NOT in package.json's devDependencies — this
 * script is rarely run and we don't want a 200 MB browser bundle on every
 * CI install. Before running:
 *
 *   npm install --no-save playwright
 *   npx playwright install chromium
 *
 * Then:
 *
 *   node scripts/serp-audit.mjs [--out tmp/serp-audit] [--hl en-GB]
 *
 * The script visits Google with a signed-out, incognito desktop Chrome
 * user agent, dismisses the cookie banner, takes a full-page screenshot
 * for each query, and writes a JSON manifest with the URL and a hash of
 * the rendered title bar so re-runs can be diffed.
 */

import { argv } from "node:process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";

const QUERIES = [
  // Desktop zero-CTR queries — listed in the Phase-5 brief.
  { q: "cyprus schengen accession status 2026", hl: "en-GB" },
  { q: "cruise travel agent in cyprus", hl: "en-GB" },
  { q: "cyprus travel agency", hl: "en-GB" },
  { q: "travel agency paphos", hl: "en-GB" },
  { q: "cyprus business travel", hl: "en-GB" },
  { q: "best time to visit cyprus", hl: "en-GB" },
  { q: "is cyprus in the schengen area", hl: "en-GB" },
  // Russian queries the RU snippet rewrites target.
  { q: "кипр это шенген", hl: "ru" },
  { q: "круизы из лимассола", hl: "ru" },
  { q: "отдых на кипре в 2026 году", hl: "ru" },
];

const UA_DESKTOP_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function parseArgs() {
  const args = argv.slice(2);
  let out = "tmp/serp-audit";
  let overrideHl = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--out" && args[i + 1]) {
      out = args[i + 1];
      i++;
    } else if (args[i] === "--hl" && args[i + 1]) {
      overrideHl = args[i + 1];
      i++;
    }
  }
  return { out, overrideHl };
}

function slugify(q) {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch (err) {
    console.error(
      "Playwright is not installed. Run:\n" +
        "  npm install --no-save playwright\n" +
        "  npx playwright install chromium\n",
    );
    throw err;
  }
}

async function main() {
  const { out, overrideHl } = parseArgs();
  const { chromium } = await loadPlaywright();
  await mkdir(out, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: UA_DESKTOP_CHROME,
    viewport: { width: 1440, height: 900 },
    // Treat each run as a fresh incognito session: no cookies, no history.
    storageState: undefined,
  });

  const report = [];

  for (const { q, hl: hlDefault } of QUERIES) {
    const hl = overrideHl ?? hlDefault;
    const page = await context.newPage();
    const url = `https://www.google.com/search?q=${encodeURIComponent(q)}&hl=${hl}&gl=${hl.split("-")[1]?.toLowerCase() ?? "cy"}&pws=0&num=10`;
    console.log(`[serp-audit] ${q}  (hl=${hl})`);

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });

      // Best-effort cookie banner dismiss (Google EU consent).
      for (const sel of [
        'button:has-text("Reject all")',
        'button:has-text("Отклонить все")',
        'button:has-text("Accept all")',
      ]) {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click().catch(() => {});
          await page.waitForLoadState("networkidle").catch(() => {});
          break;
        }
      }

      const file = join(out, `${slugify(q)}.png`);
      await page.screenshot({ path: file, fullPage: true });

      // Hash the visible <h1>+top-result block so re-runs are diffable.
      const top = await page.evaluate(() => {
        const h1 = document.querySelector("h1")?.innerText ?? "";
        const firstResult =
          document.querySelector("#search a h3")?.innerText ?? "";
        return { h1, firstResult };
      });

      const fingerprint = createHash("sha256")
        .update(JSON.stringify(top))
        .digest("hex")
        .slice(0, 12);

      report.push({ query: q, hl, url, screenshot: file, top, fingerprint });
    } catch (err) {
      report.push({ query: q, hl, url, error: err.message });
    } finally {
      await page.close();
    }
  }

  await writeFile(
    join(out, "report.json"),
    JSON.stringify(report, null, 2),
    "utf-8",
  );

  await browser.close();
  console.log(`\nDone. See ${out}/report.json and the .png files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
