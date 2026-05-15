#!/usr/bin/env node
/**
 * Phase 5 / Step 43 — weekly GSC delta tracker.
 *
 * Pulls clicks / impressions / CTR / average position from the Google
 * Search Console Search Analytics API for the last 7 days vs the previous
 * 7 days, grouped by device. Posts a compact summary to Slack (or just
 * logs to stdout if SLACK_WEBHOOK_URL is unset).
 *
 * Designed to run as a Vercel Cron / GitHub Actions schedule / Cloudflare
 * Worker. Has no runtime dependencies beyond Node 18+ fetch.
 *
 * Required environment variables:
 *   GSC_SITE_URL              e.g. "https://www.jetset-travel.com/"
 *   GSC_SERVICE_ACCOUNT_KEY   JSON blob (one line) of a GCP service-account
 *                             key with "Full" access to the GSC property.
 *                             The service account email must be added as
 *                             "Full" user in Search Console.
 *
 * Optional:
 *   SLACK_WEBHOOK_URL         Incoming webhook URL; if set, we POST there.
 *   GSC_DELTA_DRY_RUN=1       Print the request bodies and exit (for
 *                             local debugging without burning quota).
 *
 * Acceptance (Phase 5): desktop CTR climbs from 0.4% → ≥1.5% within
 * 30 days. This script is what proves it without us having to log into
 * Search Console manually every Monday.
 */

const GSC_API = "https://searchconsole.googleapis.com/v1";

function envOrDie(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env var: ${name}`);
    process.exit(2);
  }
  return v;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function dateRanges(today = new Date()) {
  // GSC data has ~2-day lag; offset the window so we don't query empty days.
  const lag = 2;
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() - lag);
  const startCurrent = new Date(end);
  startCurrent.setUTCDate(end.getUTCDate() - 6); // 7-day window incl. end
  const endPrev = new Date(startCurrent);
  endPrev.setUTCDate(startCurrent.getUTCDate() - 1);
  const startPrev = new Date(endPrev);
  startPrev.setUTCDate(endPrev.getUTCDate() - 6);
  return {
    current: { startDate: isoDate(startCurrent), endDate: isoDate(end) },
    previous: { startDate: isoDate(startPrev), endDate: isoDate(endPrev) },
  };
}

/**
 * Mint a Google OAuth2 access token from a service-account key JSON using
 * the JWT bearer flow. No external SDK needed.
 */
async function getAccessToken(serviceAccountKey) {
  const key = JSON.parse(serviceAccountKey);
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const header = { alg: "RS256", typ: "JWT" };

  const b64url = (s) =>
    Buffer.from(s).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`;

  const { createSign } = await import("node:crypto");
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = signer.sign(key.private_key).toString("base64")
    .replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

  const jwt = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OAuth token exchange failed: ${res.status} ${body}`);
  }
  const json = await res.json();
  return json.access_token;
}

async function queryGsc(token, siteUrl, body) {
  const url = `${GSC_API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`GSC query failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function fmtPct(x) {
  return `${(x * 100).toFixed(2)}%`;
}

function fmtSigned(x, digits = 2) {
  const s = x.toFixed(digits);
  return x >= 0 ? `+${s}` : s;
}

function summarizeByDevice(current, previous) {
  const byDevice = new Map();
  for (const row of current.rows ?? []) {
    byDevice.set(row.keys[0], { current: row, previous: null });
  }
  for (const row of previous.rows ?? []) {
    const e = byDevice.get(row.keys[0]) ?? { current: null, previous: null };
    e.previous = row;
    byDevice.set(row.keys[0], e);
  }
  const lines = [];
  for (const [device, { current: c, previous: p }] of byDevice) {
    if (!c) continue;
    const dClicks = c.clicks - (p?.clicks ?? 0);
    const dCtr = c.ctr - (p?.ctr ?? 0);
    const dPos = c.position - (p?.position ?? 0);
    lines.push(
      `${device.padEnd(8)}  clicks ${String(c.clicks).padStart(4)} (${fmtSigned(dClicks, 0)})` +
        `  CTR ${fmtPct(c.ctr).padStart(6)} (${fmtSigned(dCtr * 100)}pp)` +
        `  pos ${c.position.toFixed(1).padStart(5)} (${fmtSigned(dPos, 1)})`,
    );
  }
  return lines.join("\n");
}

async function postToSlack(text) {
  const hook = process.env.SLACK_WEBHOOK_URL;
  if (!hook) {
    console.log("[no SLACK_WEBHOOK_URL — skipping Slack post]");
    return;
  }
  await fetch(hook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

async function main() {
  const siteUrl = envOrDie("GSC_SITE_URL");
  const ranges = dateRanges();

  const queryBody = (range) => ({
    startDate: range.startDate,
    endDate: range.endDate,
    dimensions: ["device"],
    rowLimit: 10,
  });

  if (process.env.GSC_DELTA_DRY_RUN) {
    console.log("DRY RUN — request bodies:");
    console.log("CURRENT", JSON.stringify(queryBody(ranges.current), null, 2));
    console.log("PREVIOUS", JSON.stringify(queryBody(ranges.previous), null, 2));
    return;
  }

  const serviceAccountKey = envOrDie("GSC_SERVICE_ACCOUNT_KEY");
  const token = await getAccessToken(serviceAccountKey);

  const [current, previous] = await Promise.all([
    queryGsc(token, siteUrl, queryBody(ranges.current)),
    queryGsc(token, siteUrl, queryBody(ranges.previous)),
  ]);

  const summary = summarizeByDevice(current, previous);
  const text =
    `*GSC weekly delta — ${siteUrl}*\n` +
    `current: ${ranges.current.startDate} → ${ranges.current.endDate}\n` +
    `previous: ${ranges.previous.startDate} → ${ranges.previous.endDate}\n` +
    "```\n" +
    summary +
    "\n```";

  console.log(text);
  await postToSlack(text);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
