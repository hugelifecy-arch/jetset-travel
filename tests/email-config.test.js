import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { envOrDefault } from "../src/lib/email/config.ts";

describe("envOrDefault — Resend email config fallbacks", () => {
  it("uses fallback when env var is undefined", () => {
    assert.equal(envOrDefault(undefined, "fallback@example.com"), "fallback@example.com");
  });

  it("uses fallback when env var is an empty string (Vercel blank-value case)", () => {
    // Regression: a declared-but-blank Vercel env var arrives as "" and
    // slipped past the old `??` operator, leaking from:"" into the Resend
    // payload and causing every send to 422.
    assert.equal(envOrDefault("", "fallback@example.com"), "fallback@example.com");
  });

  it("uses fallback when env var is whitespace-only", () => {
    assert.equal(envOrDefault("   ", "fallback@example.com"), "fallback@example.com");
    assert.equal(envOrDefault("\t\n", "fallback@example.com"), "fallback@example.com");
  });

  it("uses the env var when it has a real value", () => {
    assert.equal(
      envOrDefault("JetSet Travel <noreply@jetset-travel.com>", "fallback@example.com"),
      "JetSet Travel <noreply@jetset-travel.com>",
    );
  });

  it("trims surrounding whitespace from a real value", () => {
    assert.equal(
      envOrDefault("  noreply@jetset-travel.com  ", "fallback@example.com"),
      "noreply@jetset-travel.com",
    );
  });
});
