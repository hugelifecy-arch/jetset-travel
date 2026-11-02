/**
 * data/do-not-disturb.json lists URLs that rank in Google Search. Each must
 * stay reachable from the code: a page, a blog post, or a single 301 (from
 * src/lib/redirects.ts) to a live page. Runs the static checker so CI
 * enforces it (it is not otherwise part of the CI workflow).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

describe("do-not-disturb: ranking URLs stay reachable", () => {
  it("scripts/check-do-not-disturb.mjs (static) passes", () => {
    const script = fileURLToPath(new URL("../scripts/check-do-not-disturb.mjs", import.meta.url));
    const r = spawnSync(process.execPath, [script], { encoding: "utf-8", timeout: 30000 });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /All \d+ protected URLs OK/);
  });
});
