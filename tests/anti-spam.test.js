import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isGibberish,
  isSubmittedTooFast,
  findGibberishField,
  runAntiSpamChecks,
} from "../src/lib/anti-spam.ts";

describe("isGibberish", () => {
  it("detects random string with mixed case (spam name)", () => {
    assert.ok(isGibberish("JbpIUbHwXqmrjhvjtzjbHsz"));
  });

  it("detects random string (spam company)", () => {
    assert.ok(isGibberish("eRalsJQDSzZuINHRdK"));
  });

  it("detects random string (spam message)", () => {
    assert.ok(isGibberish("BOhSKMQsNZhNfnXQOrXIBcQ"));
  });

  it("allows normal English name", () => {
    assert.equal(isGibberish("John Smith"), false);
  });

  it("allows normal short name", () => {
    assert.equal(isGibberish("Maria"), false);
  });

  it("allows normal long name", () => {
    assert.equal(isGibberish("Christopher Alexander"), false);
  });

  it("allows hyphenated name", () => {
    assert.equal(isGibberish("Jean-Pierre"), false);
  });

  it("allows normal company name", () => {
    assert.equal(isGibberish("Acme Corporation Ltd"), false);
  });

  it("allows normal message with spaces", () => {
    assert.equal(
      isGibberish("Hi, I'd like to book a flight to London next week."),
      false,
    );
  });

  it("allows email addresses (contains @)", () => {
    assert.equal(isGibberish("pepijn@korper.nl"), false);
  });

  it("allows Russian text (non-Latin)", () => {
    assert.equal(isGibberish("Александр Иванов"), false);
  });

  it("allows single word under threshold", () => {
    assert.equal(isGibberish("Hello"), false);
  });
});

describe("isSubmittedTooFast", () => {
  it("rejects submission under 3 seconds", () => {
    const justNow = Date.now() - 500; // 0.5 seconds ago
    assert.ok(isSubmittedTooFast(justNow));
  });

  it("allows submission after 3 seconds", () => {
    const fiveSecondsAgo = Date.now() - 5000;
    assert.equal(isSubmittedTooFast(fiveSecondsAgo), false);
  });

  it("allows when timestamp is missing", () => {
    assert.equal(isSubmittedTooFast(undefined), false);
  });

  it("allows when timestamp is 0", () => {
    assert.equal(isSubmittedTooFast(0), false);
  });
});

describe("findGibberishField", () => {
  it("detects gibberish in the sample spam payload", () => {
    const spamPayload = {
      name: "JbpIUbHwXqmrjhvjtzjbHsz",
      email: "pepijn@korper.nl",
      companyName: "eRalsJQDSzZuINHRdK",
      message: "BOhSKMQsNZhNfnXQOrXIBcQ",
    };
    const field = findGibberishField(spamPayload);
    assert.ok(field, "Should detect at least one gibberish field");
    assert.equal(field, "name"); // name is checked first
  });

  it("passes clean payload", () => {
    const cleanPayload = {
      name: "John Smith",
      email: "john@example.com",
      companyName: "Acme Corp",
      message: "I'd like to book a trip to Greece.",
    };
    assert.equal(findGibberishField(cleanPayload), null);
  });
});

describe("runAntiSpamChecks — timing field is mandatory", () => {
  // Every first-party form sends _formLoadedAt; omission means the payload
  // didn't come from our UI. (reCAPTCHA is unconfigured in the test env, so
  // these run without network access.)
  it("blocks a payload without _formLoadedAt", async () => {
    const res = await runAntiSpamChecks({
      name: "John Smith",
      email: "john@example.com",
    });
    assert.equal(res.blocked, true);
    assert.equal(res.reason, "missing_timing");
  });

  it("blocks a non-numeric _formLoadedAt", async () => {
    const res = await runAntiSpamChecks({
      name: "John Smith",
      _formLoadedAt: "not-a-number",
    });
    assert.equal(res.blocked, true);
    assert.equal(res.reason, "missing_timing");
  });

  it("still blocks instant submissions", async () => {
    const res = await runAntiSpamChecks({
      name: "John Smith",
      _formLoadedAt: Date.now(),
    });
    assert.equal(res.blocked, true);
    assert.equal(res.reason, "too_fast");
  });

  it("allows a plausibly-timed clean payload", async () => {
    const res = await runAntiSpamChecks({
      name: "John Smith",
      email: "john@example.com",
      message: "I'd like to book a trip to Greece.",
      _formLoadedAt: Date.now() - 30_000,
    });
    assert.equal(res.blocked, false);
  });
});
