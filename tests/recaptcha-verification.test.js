import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { verifyRecaptcha, runAntiSpamChecks } from "../src/lib/anti-spam.ts";

describe("production reCAPTCHA verification", () => {
  let savedEnv, originalFetch;
  const keys = ["NODE_ENV", "RECAPTCHA_SECRET_KEY", "RECAPTCHA_ALLOWED_HOSTNAMES"];
  const valid = { success: true, score: 0.9, action: "contact", hostname: "www.jetset-travel.com" };
  beforeEach(() => {
    savedEnv = Object.fromEntries(keys.map(key => [key, process.env[key]]));
    originalFetch = globalThis.fetch;
    process.env.NODE_ENV = "production";
    process.env.RECAPTCHA_SECRET_KEY = "test-secret-not-real";
    delete process.env.RECAPTCHA_ALLOWED_HOSTNAMES;
    globalThis.fetch = async () => Response.json(valid);
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (savedEnv[key] === undefined) delete process.env[key];
      else process.env[key] = savedEnv[key];
    }
  });
  it("accepts verified score, action and hostname", async () => {
    assert.equal(await verifyRecaptcha("test-token", "contact"), true);
  });
  it("rejects missing and blank tokens without querying Google", async () => {
    globalThis.fetch = () => { throw new Error("must not call"); };
    for (const token of [undefined, null, "", "   "]) {
      assert.equal(await verifyRecaptcha(token, "contact"), false);
    }
  });
  it("rejects a forged old timestamp without CAPTCHA evidence", async () => {
    assert.deepEqual(await runAntiSpamChecks({ name: "John Smith", _formLoadedAt: 1 }, "contact"), {
      blocked: true, reason: "recaptcha_failed",
    });
  });
  for (const patch of [
    { success: false }, { score: undefined }, { score: 0.1 }, { score: 2 },
    { action: "quote" }, { hostname: "attacker.example" }, { hostname: undefined },
  ]) {
    it(`rejects invalid evidence ${JSON.stringify(patch)}`, async () => {
      globalThis.fetch = async () => Response.json({ ...valid, ...patch });
      assert.equal(await verifyRecaptcha("test-token", "contact"), false);
    });
  }
  it("rejects API failure, malformed responses and transport failure", async () => {
    for (const fn of [
      async () => new Response("unavailable", { status: 503 }),
      async () => Response.json(null),
      async () => new Response("not json"),
      async () => { throw new Error("offline"); },
    ]) {
      globalThis.fetch = fn;
      assert.equal(await verifyRecaptcha("test-token", "contact"), false);
    }
  });
  it("does not silently disable verification in production", async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    assert.equal(await verifyRecaptcha("test-token", "contact"), false);
    process.env.NODE_ENV = "development";
    assert.equal(await verifyRecaptcha(null, "contact"), true);
  });
  it("supports explicitly configured preview hosts", async () => {
    process.env.RECAPTCHA_ALLOWED_HOSTNAMES = "preview.example, www.jetset-travel.com";
    globalThis.fetch = async () => Response.json({ ...valid, hostname: "preview.example" });
    assert.equal(await verifyRecaptcha("test-token", "contact"), true);
  });
});
