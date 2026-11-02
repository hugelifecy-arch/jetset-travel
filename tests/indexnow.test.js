/**
 * IndexNow presets (scripts/indexnow-presets.mjs) must only contain live,
 * canonical sitemap URLs: submitting a redirect or a 404 wastes the crawl.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import sitemap from "../src/app/sitemap.ts";
import { INDEXNOW_PRESETS } from "../scripts/indexnow-presets.mjs";

const sitemapPaths = new Set(sitemap().map((e) => new URL(e.url).pathname));

describe("indexnow presets", () => {
  // Bing's Oct 2026 list had 27 URLs; the merged "*-cyprus" pages were
  // dropped from it when they started to 301 (1 Nov 2026).
  it("has the 24-URL priority preset (7 EN + 17 RU)", () => {
    const p = INDEXNOW_PRESETS.priority;
    assert.equal(p.length, 24);
    assert.equal(p.filter((u) => u.startsWith("/en/")).length, 7);
    assert.equal(p.filter((u) => u.startsWith("/ru/")).length, 17);
    assert.equal(new Set(p).size, p.length, "duplicate path in preset");
  });

  for (const [name, paths] of Object.entries(INDEXNOW_PRESETS)) {
    for (const path of paths) {
      it(`${name}: ${path} is a sitemap URL`, () => assert.ok(sitemapPaths.has(path)));
    }
  }

  it("the key file in /public matches the key the script submits", () => {
    const key = "4338cc8b3af74065bf84162fa446f406";
    assert.equal(readFileSync(new URL(`../public/${key}.txt`, import.meta.url), "utf-8").trim(), key);
    assert.match(readFileSync(new URL("../scripts/indexnow.mjs", import.meta.url), "utf-8"), new RegExp(`KEY = "${key}"`));
  });

  // The child runs with fetch disabled, so a regression in the guard fails
  // the test instead of really submitting the live sitemap to IndexNow.
  const NO_NETWORK = "data:text/javascript,globalThis.fetch=()=>{throw new Error('network disabled in tests')}";
  const run = (args, env = {}) =>
    spawnSync(process.execPath, ["--import", NO_NETWORK, new URL("../scripts/indexnow.mjs", import.meta.url).pathname, ...args], {
      encoding: "utf-8",
      timeout: 10000,
      env: { ...process.env, npm_config_dry_run: "", npm_config_preset: undefined, ...env },
    });

  for (const args of [["--no-such-flag"], ["--preset"], ["--preset", "--dry-run"]]) {
    it(`"${args.join(" ")}" prints usage and submits nothing (never the whole sitemap)`, () => {
      const r = run(args);
      assert.equal(r.status, 1);
      assert.match(r.stdout, /--dry-run/);
      assert.doesNotMatch(r.stdout + r.stderr, /IndexNow: \d+ URL|dry run: \d+ URL|network disabled/);
    });
  }

  it("a bare word (forgotten --preset) is refused, not submitted as a 404 page", () => {
    const r = run(["gsc-nov-2026"]);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /Not a path or URL: gsc-nov-2026/);
    assert.doesNotMatch(r.stderr, /network disabled/);
  });

  it("`npm run indexnow --dry-run` (flag swallowed by npm) is refused", () => {
    const r = run([], { npm_config_dry_run: "true" });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /Put flags after --/);
    assert.doesNotMatch(r.stderr, /network disabled/);
  });

  it("--dry-run --preset <name> lists the preset and makes no request", () => {
    const r = run(["--dry-run", "--preset", "gsc-nov-2026"]);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /dry run: 24 URL\(s\), nothing submitted/);
  });
});
