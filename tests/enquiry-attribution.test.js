/**
 * Enquiry attribution for the staff email (src/lib/attribution-fields.ts).
 *
 * The browser-supplied `_attribution` object is untrusted. Only known keys
 * reach the email, paths lose any query string or fragment, referrers must be
 * bare host names, and the Google Ads click id is reduced to yes/no.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { attributionRows } from "../src/lib/attribution-fields.ts";

const labels = (rows) => rows.map(([label]) => label);
const value = (rows, label) => rows.find(([l]) => l === label)?.[1];

describe("attributionRows", () => {
  it("returns nothing for missing or malformed input", () => {
    for (const raw of [undefined, null, "x", 42, [], ["/en"]]) {
      assert.deepEqual(attributionRows(raw), []);
    }
  });

  it("keeps the page path and drops any query string or fragment", () => {
    const rows = attributionRows({ page: "/en/contact?email=a@b.com&name=Jo#form" });
    assert.equal(value(rows, "Sent from page"), "/en/contact");
    assert.ok(!JSON.stringify(rows).includes("a@b.com"));
  });

  it("rejects paths that are not site-relative", () => {
    for (const page of ["https://evil.example/x", "//evil.example/x", "javascript:alert(1)", ""]) {
      assert.deepEqual(attributionRows({ page }), [], page);
    }
  });

  it("shows the first page of the visit only when it differs from the sending page", () => {
    assert.deepEqual(labels(attributionRows({ page: "/en/quote", landing: "/en/quote" })), ["Sent from page"]);
    const rows = attributionRows({ page: "/en/quote", landing: "/ru/blog/visa" });
    assert.equal(value(rows, "First page this visit"), "/ru/blog/visa");
  });

  it("accepts a referrer host name and nothing else", () => {
    assert.equal(value(attributionRows({ referrer: "www.Google.com" }), "Came from (referrer)"), "www.google.com");
    for (const referrer of ["https://www.google.com/search?q=x", "evil.com/path", "a b"]) {
      assert.deepEqual(attributionRows({ referrer }), [], referrer);
    }
  });

  it("keeps utm_* tags, strips control characters and caps length", () => {
    const rows = attributionRows({ utm_source: "google\u0000\n", utm_campaign: "x".repeat(300) });
    assert.equal(value(rows, "Campaign source (utm_source)"), "google");
    assert.equal(value(rows, "Campaign name (utm_campaign)").length, 101); // 100 chars + ellipsis
  });

  it("ignores unknown keys, so form fields or click ids cannot ride along", () => {
    const rows = attributionRows({ page: "/en", email: "a@b.com", gclid: "Cj0KCQ", phone: "+357" });
    assert.deepEqual(labels(rows), ["Sent from page"]);
  });

  it("reduces the ad click flag to yes only for a literal true", () => {
    assert.equal(value(attributionRows({ adClick: true }), "Google Ads click"), "Yes");
    assert.deepEqual(attributionRows({ adClick: "true" }), []);
  });
});
