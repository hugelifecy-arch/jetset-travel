/**
 * IndexNow presets (scripts/indexnow-presets.mjs) must only contain live,
 * canonical sitemap URLs: submitting a redirect or a 404 wastes the crawl.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import sitemap from "../src/app/sitemap.ts";
import { INDEXNOW_PRESETS } from "../scripts/indexnow-presets.mjs";

const sitemapPaths = new Set(sitemap().map((e) => new URL(e.url).pathname));

describe("indexnow presets", () => {
  it("has the 27-URL priority preset (7 EN + 20 RU)", () => {
    const p = INDEXNOW_PRESETS.priority;
    assert.equal(p.length, 27);
    assert.equal(p.filter((u) => u.startsWith("/en/")).length, 7);
    assert.equal(p.filter((u) => u.startsWith("/ru/")).length, 20);
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
});
