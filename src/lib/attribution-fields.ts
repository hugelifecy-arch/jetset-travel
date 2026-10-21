/**
 * Enquiry attribution: where a visitor came from, for the STAFF notification
 * email only. Never sent to analytics.
 *
 * The browser sends an `_attribution` object with each enquiry (see
 * src/lib/attribution.ts). Everything in it is untrusted, so this parser keeps
 * only known keys, caps lengths, accepts paths that start with "/", referrer
 * values that look like a host name, and the gclid/gbraid/wbraid flag as a
 * boolean (the click id itself is never forwarded). Free-form query strings
 * are never accepted, so sensitive URL parameters cannot reach the email.
 *
 * No imports: the node test runner loads this file directly.
 */

export type AttributionRow = [label: string, value: string];

const MAX_PATH = 200;
const MAX_TEXT = 100;

const UTM_LABELS: ReadonlyArray<[key: string, label: string]> = [
  ["utm_source", "Campaign source (utm_source)"],
  ["utm_medium", "Campaign medium (utm_medium)"],
  ["utm_campaign", "Campaign name (utm_campaign)"],
  ["utm_term", "Campaign term (utm_term)"],
  ["utm_content", "Campaign content (utm_content)"],
];

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  // Drop control characters, collapse whitespace.
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned.length > max ? `${cleaned.slice(0, max)}…` : cleaned;
}

function path(value: unknown): string | null {
  const v = text(value, MAX_PATH);
  if (!v || !v.startsWith("/") || v.startsWith("//")) return null;
  // Paths only: anything after ? or # is dropped.
  const bare = v.split(/[?#]/)[0];
  return bare || null;
}

function host(value: unknown): string | null {
  const v = text(value, MAX_TEXT);
  if (!v) return null;
  return /^[a-z0-9.-]+(?::\d{1,5})?$/i.test(v) ? v.toLowerCase() : null;
}

/** Rows for the staff email, in display order; empty when nothing usable. */
export function attributionRows(raw: unknown): AttributionRow[] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
  const a = raw as Record<string, unknown>;
  const rows: AttributionRow[] = [];

  const page = path(a.page);
  if (page) rows.push(["Sent from page", page]);

  const landing = path(a.landing);
  if (landing && landing !== page) rows.push(["First page this visit", landing]);

  const referrer = host(a.referrer);
  if (referrer) rows.push(["Came from (referrer)", referrer]);

  for (const [key, label] of UTM_LABELS) {
    const v = text(a[key], MAX_TEXT);
    if (v) rows.push([label, v]);
  }

  if (a.adClick === true) rows.push(["Google Ads click", "Yes"]);

  return rows;
}
