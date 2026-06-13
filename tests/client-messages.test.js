/**
 * Drift guard for the client-side message allowlist.
 *
 * The [locale] layout serializes only `CLIENT_NAMESPACES` (see
 * src/lib/client-messages.ts) into NextIntlClientProvider, keeping the
 * server-only page-content namespaces out of every page's RSC payload.
 *
 * If a `"use client"` component starts consuming a namespace that isn't in
 * the allowlist, its strings would render as raw message keys in production.
 * This test fails CI first: it scans every client component for
 * `useTranslations("...")` literals and asserts each namespace is allowed,
 * exists in both message catalogs, and that the list carries no dead entries.
 * Fully static — runs in `node --test`, no Next server.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
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

function allowedNamespaces() {
  const src = readFileSync(join(srcRoot, "lib", "client-messages.ts"), "utf-8");
  const m = src.match(/CLIENT_NAMESPACES\s*=\s*\[([\s\S]*?)\]/);
  assert.ok(m, "could not locate CLIENT_NAMESPACES literal");
  return new Set([...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
}

function clientNamespaceUsages() {
  const usages = new Map(); // namespace → [files]
  for (const file of walk(srcRoot)) {
    const src = readFileSync(file, "utf-8");
    if (!/^\s*"use client";/m.test(src)) continue;
    for (const m of src.matchAll(/useTranslations\(\s*("([^"]+)"|[^)"\s][^)]*)\)/g)) {
      assert.ok(
        m[2] !== undefined,
        `${file}: useTranslations() must be called with a string literal so the client-message allowlist stays statically checkable (found: useTranslations(${m[1]}))`,
      );
      if (!usages.has(m[2])) usages.set(m[2], []);
      usages.get(m[2]).push(file.slice(repoRoot.length + 1));
    }
  }
  return usages;
}

describe("client message namespaces", () => {
  const allowed = allowedNamespaces();
  const usages = clientNamespaceUsages();
  const en = JSON.parse(
    readFileSync(join(srcRoot, "messages", "en.json"), "utf-8"),
  );
  const ru = JSON.parse(
    readFileSync(join(srcRoot, "messages", "ru.json"), "utf-8"),
  );

  it("every namespace used by a client component is in CLIENT_NAMESPACES", () => {
    for (const [ns, files] of usages) {
      assert.ok(
        allowed.has(ns),
        `namespace "${ns}" is used client-side (${files.join(", ")}) but missing from CLIENT_NAMESPACES — its strings would render as raw keys`,
      );
    }
  });

  it("CLIENT_NAMESPACES has no dead entries", () => {
    for (const ns of allowed) {
      assert.ok(
        usages.has(ns),
        `namespace "${ns}" is in CLIENT_NAMESPACES but no client component uses it — remove it to keep the payload minimal`,
      );
    }
  });

  it("every allowed namespace exists in both message catalogs", () => {
    for (const ns of allowed) {
      assert.ok(ns in en, `namespace "${ns}" missing from en.json`);
      assert.ok(ns in ru, `namespace "${ns}" missing from ru.json`);
    }
  });
});
