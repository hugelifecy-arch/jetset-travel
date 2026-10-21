/**
 * Browser side of enquiry attribution (landing page, referrer, campaign tags),
 * sent with each enquiry and shown only in the staff notification email.
 * Never sent to analytics; the server re-validates everything
 * (src/lib/attribution-fields.ts).
 *
 * Privacy:
 * - Without analytics consent nothing is stored. An enquiry carries only the
 *   page it was sent from, the referring site's host name, and campaign tags
 *   present in the current URL.
 * - With analytics consent, the first page of the visit and its campaign tags
 *   are kept in sessionStorage (cleared when the tab closes) so an enquiry
 *   sent later in the visit still shows how it started. If consent is given
 *   after the first page, the page where it was given counts as the start.
 * - Only utm_* tags are kept, plus a yes/no for a Google Ads click id; the
 *   rest of the query string is never read.
 */
import { hasConsent } from "@/lib/cookie-consent";

const STORAGE_KEY = "jetset_visit_start";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const AD_CLICK_KEYS = ["gclid", "gbraid", "wbraid"] as const;
const MAX = 100;

type UtmKey = (typeof UTM_KEYS)[number];

export type EnquiryAttribution = Partial<Record<UtmKey, string>> & {
  page?: string;
  landing?: string;
  referrer?: string;
  adClick?: boolean;
};

function campaignFromUrl(): Partial<EnquiryAttribution> {
  const params = new URLSearchParams(window.location.search);
  const out: Partial<EnquiryAttribution> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) out[key] = value.slice(0, MAX);
  }
  if (AD_CLICK_KEYS.some((k) => params.has(k))) out.adClick = true;
  return out;
}

/** Host of an external referring site; document.referrer survives client-side navigation. */
function externalReferrer(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const ref = new URL(document.referrer);
    return ref.host && ref.host !== window.location.host ? ref.host : undefined;
  } catch {
    return undefined;
  }
}

/** Record the start of this visit, only with analytics consent and only once per tab. */
export function rememberVisitStart(): void {
  if (!hasConsent("analytics")) {
    // Consent withdrawn (or never given): drop anything kept earlier.
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage blocked: nothing was kept.
    }
    return;
  }
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    const start: EnquiryAttribution = {
      landing: window.location.pathname,
      ...campaignFromUrl(),
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(start));
  } catch {
    // Storage blocked: enquiries still carry the current page.
  }
}

function storedVisitStart(): EnquiryAttribution {
  if (!hasConsent("analytics")) return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const p = parsed as Record<string, unknown>;
    const out: EnquiryAttribution = {};
    if (typeof p.landing === "string") out.landing = p.landing;
    for (const key of UTM_KEYS) if (typeof p[key] === "string") out[key] = p[key] as string;
    if (p.adClick === true) out.adClick = true;
    return out;
  } catch {
    return {};
  }
}

/** Attribution to send with an enquiry (as `_attribution`). */
export function enquiryAttribution(): EnquiryAttribution {
  if (typeof window === "undefined") return {};
  const stored = storedVisitStart();
  const current = campaignFromUrl();
  // First-touch campaign tags win; the current URL fills any gaps.
  return {
    ...current,
    ...stored,
    page: window.location.pathname,
    referrer: externalReferrer(),
  };
}
