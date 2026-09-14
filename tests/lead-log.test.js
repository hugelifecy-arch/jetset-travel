import { it, mock } from "node:test";
import assert from "node:assert/strict";
import { logLeadDeliveryFailure } from "../src/lib/email/lead-log.ts";

it("keeps personal data in provider errors out of operational logs", () => {
  const capture = mock.method(console, "error", () => {});
  try {
    logLeadDeliveryFailure("contact", new Error("Resend API error (422): rejected john@example.com passport request"));
    const output = JSON.stringify(capture.mock.calls.map(call => call.arguments));
    assert.match(output, /422/);
    assert.doesNotMatch(output, /john@example|passport/);
  } finally {
    capture.mock.restore();
  }
});
