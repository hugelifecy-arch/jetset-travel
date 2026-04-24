import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { sendResendEmail } from "../src/lib/email/resend.ts";

const ENDPOINT = "https://api.resend.com/emails";
const SANDBOX = "JetSet Travel <onboarding@resend.dev>";

function mockFetch(responses) {
  const calls = [];
  const queue = [...responses];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    const next = queue.shift();
    if (!next) throw new Error("no mock response queued");
    return next;
  };
  return calls;
}

function jsonOk(body = { id: "stub" }) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function errorResponse(status, text) {
  return new Response(text, { status });
}

describe("sendResendEmail — unverified-sender fallback", () => {
  let originalFetch;
  let originalWarn;
  let warnings;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    originalWarn = console.warn;
    warnings = [];
    console.warn = (...args) => warnings.push(args.join(" "));
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
  });

  it("returns the parsed JSON when the first send succeeds", async () => {
    const calls = mockFetch([jsonOk({ id: "abc-123" })]);
    const result = await sendResendEmail("re_test", {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: "info@jetset.com.cy",
      subject: "hi",
      html: "<p>hi</p>",
    });
    assert.deepEqual(result, { id: "abc-123" });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, ENDPOINT);
  });

  it("retries with the sandbox sender when the custom domain is unverified", async () => {
    const calls = mockFetch([
      errorResponse(
        403,
        JSON.stringify({
          statusCode: 403,
          message: "The jetset-travel.com domain is not verified.",
        }),
      ),
      jsonOk({ id: "sandbox-ok" }),
    ]);

    const result = await sendResendEmail("re_test", {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: "info@jetset.com.cy",
      subject: "hi",
      html: "<p>hi</p>",
    });

    assert.deepEqual(result, { id: "sandbox-ok" });
    assert.equal(calls.length, 2);
    assert.equal(
      calls[0].body.from,
      "JetSet Travel <noreply@jetset-travel.com>",
    );
    assert.equal(calls[1].body.from, SANDBOX);
    // Same to/subject/html preserved on the retry
    assert.equal(calls[1].body.to, "info@jetset.com.cy");
    assert.equal(calls[1].body.subject, "hi");
    assert.ok(warnings.some((msg) => msg.includes("sandbox sender")));
  });

  it("does not retry on a 403 whose message is not a verification failure", async () => {
    const calls = mockFetch([errorResponse(403, "Forbidden: API key disabled")]);
    await assert.rejects(
      () =>
        sendResendEmail("re_test", {
          from: "JetSet Travel <noreply@jetset-travel.com>",
          to: "info@jetset.com.cy",
          subject: "hi",
          html: "<p>hi</p>",
        }),
      /Resend API error \(403\)/,
    );
    assert.equal(calls.length, 1);
  });

  it("does not retry when the sender is already the sandbox", async () => {
    const calls = mockFetch([
      errorResponse(403, "The sandbox can only send to the account owner, not verified recipient."),
    ]);
    await assert.rejects(
      () =>
        sendResendEmail("re_test", {
          from: SANDBOX,
          to: "visitor@example.com",
          subject: "auto-reply",
          html: "<p>hi</p>",
        }),
      /Resend API error \(403\)/,
    );
    assert.equal(calls.length, 1);
  });

  it("does not retry on validation errors (422)", async () => {
    const calls = mockFetch([errorResponse(422, "Invalid `to` field.")]);
    await assert.rejects(
      () =>
        sendResendEmail("re_test", {
          from: "JetSet Travel <noreply@jetset-travel.com>",
          to: "",
          subject: "hi",
          html: "<p>hi</p>",
        }),
      /Resend API error \(422\)/,
    );
    assert.equal(calls.length, 1);
  });

  it("surfaces both the original error and the sandbox-retry error when the retry also fails", async () => {
    mockFetch([
      errorResponse(403, "Domain is not verified."),
      errorResponse(403, "Sandbox can only send to the account owner."),
    ]);
    await assert.rejects(
      () =>
        sendResendEmail("re_test", {
          from: "JetSet Travel <noreply@jetset-travel.com>",
          to: "visitor@example.com",
          subject: "auto-reply",
          html: "<p>hi</p>",
        }),
      /sandbox retry also failed/,
    );
  });
});
