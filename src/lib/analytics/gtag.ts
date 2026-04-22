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
}): void {
  pushEvent("cta_click", params);
}

export function trackWhatsAppClick(location: CTALocation, intent?: string): void {
  pushEvent("whatsapp_click", {
    location,
    intent: intent ?? "generic",
  });
}

export type FormName =
  | "hero_lead_form"
  | "cta_lead_form"
  | "exit_intent_form"
  | "contact_form"
  | "cruise_enquiry";

export function trackFormStart(form_name: FormName): void {
  pushEvent("form_start", { form_name });
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
  pushEvent("form_success", { form_name, ...params });
}

export function trackFormError(form_name: FormName, reason: string): void {
  pushEvent("form_error", { form_name, reason });
}
