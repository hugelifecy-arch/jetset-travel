import { hasConsent } from "@/lib/cookie-consent";

type GtagFunction = (
  command: "event" | "config" | "set" | "consent" | "js",
  targetOrName: string | Date,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  }
}

function canTrack(): boolean {
  return typeof window !== "undefined" && hasConsent("analytics");
}

function pushEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!canTrack()) return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params });
  }
}

export type CTALocation =
  | "hero"
  | "cta_banner"
  | "nav"
  | "mobile_action_bar"
  | "footer"
  | "service_page"
  | "blog"
  | "exit_intent";

export type CTAType =
  | "corporate_consultation"
  | "luxury_quote"
  | "whatsapp_quick_quote"
  | "phone_call"
  | "email"
  | "generic";

export function trackCTAClick(params: {
  location: CTALocation;
  cta_type: CTAType;
  cta_label?: string;
  destination?: string;
  /** Blog topic CTA: topic id (e.g. "vip-airport") and placement ("inline" | "end"). Never personal data. */
  topic?: string;
  placement?: string;
}): void {
  pushEvent("cta_click", params);
}

export function trackWhatsAppClick(location: CTALocation, intent?: string): void {
  pushEvent("whatsapp_click", {
    location,
    intent: intent ?? "generic",
  });
}

export type TelegramPlacement = "mobile_action_bar" | "floating_button";

/**
 * Telegram chat link click (shown on /ru pages). Intent only, like the
 * WhatsApp event: carries where the link sat, never the handle or any text.
 */
export function trackTelegramClick(placement: TelegramPlacement): void {
  pushEvent("telegram_click", { placement });
}

export type FormName =
  | "hero_lead_form"
  | "cta_lead_form"
  | "exit_intent_form"
  | "contact_form"
  | "cruise_enquiry"
  | "corporate_quote"
  | "luxury_quote"
  | "vip_airport_request"
  | "private_enquiry";

/**
 * First interaction with an enquiry form (once per form per page view).
 * Named enquiry_start, not form_start, so it is not mixed up with GA4's
 * automatic "form interactions" events. Carries the form name only.
 */
export function trackEnquiryStart(form_name: FormName): void {
  pushEvent("enquiry_start", { form_name });
}

export function trackFormSubmit(form_name: FormName): void {
  pushEvent("form_submit", { form_name });
}

export function trackFormSuccess(
  form_name: FormName,
  params: {
    travel_type?: string;
    travelers?: string;
    urgency?: string;
    budget?: string;
  } = {}
): void {
  pushEvent("generate_lead", { form_name, ...params });
}

export function trackFormError(form_name: FormName, reason: string): void {
  pushEvent("form_error", { form_name, reason });
}

/**
 * Contact-intent clicks (audit F-07 event spec). These are expressions of
 * intent, NOT completed enquiries — never mark them as GA4 key events
 * alongside generate_lead. Parameters must not carry the number or address.
 */
export type ContactClickEvent = "click_phone" | "click_whatsapp" | "click_email";

export function trackContactClick(
  event: ContactClickEvent,
  params: { link_region: string },
): void {
  pushEvent(event, params);
}
