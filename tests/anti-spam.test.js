// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";

/*
 * We can't directly import TypeScript modules, so we inline the
 * gibberish-detection logic here to unit-test the algorithm.
 * The production code in src/lib/anti-spam.ts uses identical logic.
 */

function isGibberish(text) {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < 8) return false;

  const alphaOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (alphaOnly.length < 6) return false;

  /* Signal 1 — long single token with no spaces */
  const hasNoSpaces = !trimmed.includes(" ") && !trimmed.includes("@");
  const isLong = trimmed.length > 15;

  /* Signal 2 — random case mixing */
  let caseChanges = 0;
  for (let i = 1; i < alphaOnly.length; i++) {
    const prevUp = alphaOnly[i - 1] !== alphaOnly[i - 1].toLowerCase();
    const currUp = alphaOnly[i] !== alphaOnly[i].toLowerCase();
    if (prevUp !== currUp) caseChanges++;
  }
  const hasRandomCase = caseChanges / (alphaOnly.length - 1) > 0.35;

  /* Signal 3 — low vowel ratio */
  const vowelCount = (alphaOnly.match(/[aeiouAEIOU]/g) || []).length;
  const hasLowVowels = vowelCount / alphaOnly.length < 0.12;

  if (hasNoSpaces && isLong && (hasRandomCase || hasLowVowels)) return true;
  if (hasRandomCase && hasLowVowels) return true;

  return false;
}

function isSubmittedTooFast(formLoadedAt) {
  if (typeof formLoadedAt !== "number" || formLoadedAt <= 0) return false;
  return Date.now() - formLoadedAt < 3000;
}

const GIBBERISH_FIELDS = [
  "name", "message", "companyName", "notes",
  "specialRequirements", "route", "destinations",
];

function findGibberishField(data) {
  for (const field of GIBBERISH_FIELDS) {
    if (typeof data[field] === "string" && isGibberish(data[field])) {
      return field;
    }
  }
  return null;
}

// --- Tests ---

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
