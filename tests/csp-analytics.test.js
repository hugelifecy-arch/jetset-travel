/**
 * Guard: the Content-Security-Policy must let Google Analytics 4 send hits.
 *
 * In October 2026 GA4 showed "No data received" for the whole life of the
 * property: gtag.js loaded after consent, but every hit went to
 * https://analytics.google.com/g/collect (and www.google.com/g/collect),
 * which connect-src did not allow, so the browser blocked them all.
 *
 * Host list follows Google's "Analytics without any Ads features" CSP
 * (https://developers.google.com/tag-platform/tag-manager/csp):
 *   connect-src https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com
 * Ads endpoints (*.g.doubleclick.net) stay blocked on purpose: the site only
 * asks for analytics consent, not advertising.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = readFileSync(join(repoRoot, "next.config.ts"), "utf8");

function directive(name) {
  const match = config.match(new RegExp(`"${name} ([^"]+)"`));
  assert.ok(match, `${name} not found in next.config.ts`);
  return match[1].split(/\s+/);
}

/** Minimal CSP host-source matcher: scheme, optional *. host wildcard, path prefix. */
function allows(sources, url) {
  const u = new URL(url);
  return sources.some((src) => {
    if (src === "'self'") return false;
    const m = src.match(/^(https?):\/\/([^/]+)(\/.*)?$/);
    if (!m) return false;
    const [, scheme, host, path] = m;
    if (`${scheme}:` !== u.protocol) return false;
    const hostOk = host.startsWith("*.")
      ? u.hostname.endsWith(host.slice(1))
      : u.hostname === host;
    if (!hostOk) return false;
    if (!path) return true;
    return path.endsWith("/") ? u.pathname.startsWith(path) : u.pathname === path;
  });
}

describe("CSP lets GA4 collect hits through (connect-src)", () => {
  const connect = directive("connect-src");

  for (const url of [
    "https://analytics.google.com/g/collect?v=2&tid=G-RD25ZDGW5H",
    "https://region1.analytics.google.com/g/collect?v=2",
    "https://www.google.com/g/collect?v=2",
    "https://region1.google-analytics.com/g/collect?v=2",
    "https://www.google-analytics.com/g/collect?v=2",
    "https://www.googletagmanager.com/td?id=G-RD25ZDGW5H",
  ]) {
    it(`allows ${new URL(url).host}${new URL(url).pathname}`, () => {
      assert.ok(allows(connect, url), `connect-src blocks ${url}`);
    });
  }

  it("still allows reCAPTCHA", () => {
    assert.ok(allows(connect, "https://www.google.com/recaptcha/api2/clr"));
  });

  it("does not open Ads endpoints (no advertising consent is asked)", () => {
    assert.ok(!allows(connect, "https://stats.g.doubleclick.net/g/collect?v=2"));
  });
});
