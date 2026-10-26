/**
 * createLazyResolver keeps zod out of the first page load: the validation
 * module is fetched on first focus (preload) or first validation, once.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createLazyResolver } from "../src/components/forms/lazyResolver.ts";

function fakeLoader(result = { values: { ok: true }, errors: {} }) {
  const calls = [];
  let loads = 0;
  const load = async () => {
    loads++;
    return async (values, context, options) => {
      calls.push({ values, context, options });
      return result;
    };
  };
  return { load, calls, loads: () => loads };
}

describe("createLazyResolver", () => {
  it("does not load anything until it is used", () => {
    const f = fakeLoader();
    createLazyResolver(f.load);
    assert.equal(f.loads(), 0);
  });

  it("preload fetches once and validation reuses it", async () => {
    const f = fakeLoader();
    const { resolver, preload } = createLazyResolver(f.load);
    preload();
    preload();
    await resolver({ a: 1 }, undefined, {});
    await resolver({ a: 2 }, undefined, {});
    assert.equal(f.loads(), 1);
    assert.equal(f.calls.length, 2);
  });

  it("delegates to the loaded resolver with the same arguments", async () => {
    const expected = { values: {}, errors: { email: { type: "invalid_format", message: "Bad" } } };
    const f = fakeLoader(expected);
    const { resolver } = createLazyResolver(f.load);
    const options = { fields: {}, shouldUseNativeValidation: false };
    const result = await resolver({ email: "x" }, "ctx", options);
    assert.deepEqual(result, expected);
    assert.deepEqual(f.calls[0], { values: { email: "x" }, context: "ctx", options });
  });

  it("lets the submission through if the code cannot be fetched, and retries later", async () => {
    let attempts = 0;
    const load = async () => {
      attempts++;
      if (attempts === 1) throw new Error("ChunkLoadError");
      return async () => ({ values: {}, errors: { name: { type: "too_small" } } });
    };
    const { resolver } = createLazyResolver(load);
    const first = await resolver({ name: "" }, undefined, {});
    assert.deepEqual(first, { values: { name: "" }, errors: {} });
    const second = await resolver({ name: "" }, undefined, {});
    assert.deepEqual(second.errors, { name: { type: "too_small" } });
    assert.equal(attempts, 2);
  });

  it("a failed preload is swallowed and the next use retries", async () => {
    let attempts = 0;
    const load = async () => {
      attempts++;
      if (attempts === 1) throw new Error("ChunkLoadError");
      return async (values) => ({ values, errors: {} });
    };
    const { resolver, preload } = createLazyResolver(load);
    preload(); // must not cause an unhandled rejection
    await new Promise((r) => setTimeout(r, 0));
    const result = await resolver({ name: "Maria" }, undefined, {});
    assert.deepEqual(result, { values: { name: "Maria" }, errors: {} });
    assert.equal(attempts, 2);
  });
});

describe("no component imports zod statically", () => {
  // A static import puts zod into the route chunk, and Next.js prefetches
  // route chunks for visible links, so it would reach the home page again.
  // Components import form types with `import type` and load validation
  // through createLazyResolver(() => import("./validation")).
  const root = join(fileURLToPath(new URL(".", import.meta.url)), "..", "src");
  const files = readdirSync(root, { recursive: true })
    .filter((f) => /\.(tsx|ts)$/.test(f))
    .map((f) => join(root, f));

  it("no .tsx file imports zod or @hookform/resolvers", () => {
    const offenders = files.filter((f) => f.endsWith(".tsx")).filter((f) =>
      /^import\s+(?!type\b)[^;]*from\s+["'](zod|@hookform\/resolvers[^"']*)["']/m.test(readFileSync(f, "utf8")),
    );
    assert.deepEqual(offenders, []);
  });

  it("validation modules are only imported dynamically or as types", () => {
    const offenders = files.filter((f) =>
      /^import\s+(?!type\b)[^;]*from\s+["'][^"']*\/validation["']/m.test(readFileSync(f, "utf8")),
    );
    assert.deepEqual(offenders, []);
  });
});
