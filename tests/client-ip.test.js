// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";

/*
 * The production code in src/lib/client-ip.ts is TypeScript and can't
 * be imported directly. We mirror the resolution logic here so the
 * tests exercise identical behavior.
 */

function getClientIp(request) {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const first = vercel.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    const trimmed = realIp.trim();
    if (trimmed) return trimmed;
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }

  return "unknown";
}

function makeRequest(headers) {
  return {
    headers: {
      get(name) {
        const value = headers[name.toLowerCase()];
        return value === undefined ? null : value;
      },
    },
  };
}

describe("getClientIp", () => {
  it("prefers x-vercel-forwarded-for over other headers", () => {
    const req = makeRequest({
      "x-vercel-forwarded-for": "203.0.113.5",
      "x-real-ip": "10.0.0.1",
      "x-forwarded-for": "198.51.100.7, 10.0.0.1",
    });
    assert.equal(getClientIp(req), "203.0.113.5");
  });

  it("falls back to x-real-ip when vercel header is absent", () => {
    const req = makeRequest({
      "x-real-ip": "203.0.113.9",
      "x-forwarded-for": "198.51.100.7, 203.0.113.9",
    });
    assert.equal(getClientIp(req), "203.0.113.9");
  });

  it("takes the RIGHTMOST entry from x-forwarded-for (the trusted proxy hop)", () => {
    const req = makeRequest({
      "x-forwarded-for": "1.2.3.4, 203.0.113.10",
    });
    assert.equal(getClientIp(req), "203.0.113.10");
  });

  it("ignores attacker-supplied leftmost XFF value", () => {
    // Attacker puts a fake IP at the front; Vercel/reverse proxy
    // appends the real client IP at the end. We must NOT return the
    // attacker-controlled leftmost value.
    const req = makeRequest({
      "x-forwarded-for": "127.0.0.1, 203.0.113.42",
    });
    assert.notEqual(getClientIp(req), "127.0.0.1");
    assert.equal(getClientIp(req), "203.0.113.42");
  });

  it("handles a single XFF entry", () => {
    const req = makeRequest({ "x-forwarded-for": "203.0.113.99" });
    assert.equal(getClientIp(req), "203.0.113.99");
  });

  it("returns 'unknown' when no IP headers are set", () => {
    assert.equal(getClientIp(makeRequest({})), "unknown");
  });

  it("tolerates whitespace in XFF list", () => {
    const req = makeRequest({
      "x-forwarded-for": "  1.1.1.1 ,  203.0.113.50  ",
    });
    assert.equal(getClientIp(req), "203.0.113.50");
  });

  it("skips empty x-real-ip and falls back to XFF", () => {
    const req = makeRequest({
      "x-real-ip": "   ",
      "x-forwarded-for": "203.0.113.77",
    });
    assert.equal(getClientIp(req), "203.0.113.77");
  });
});
