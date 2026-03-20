import { hasConsent } from "@/lib/cookie-consent";

type FbqFunction = {
  (action: "track", event: string, params?: Record<string, unknown>): void;
  (action: "trackCustom", event: string, params?: Record<string, unknown>): void;
  (action: "init", pixelId: string): void;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

function canTrack(): boolean {
  return typeof window !== "undefined" && !!window.fbq && hasConsent("marketing");
}

/** Fire after a contact or quote form submission */
export function trackLead(params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) {
  if (!canTrack()) return;
  window.fbq!("track", "Lead", params);
}

/** Fire on the contact page form submission */
export function trackContact() {
  if (!canTrack()) return;
  window.fbq!("track", "Contact");
}

/** Fire when a user views a service page (corporate, luxury, visa, hotel) */
export function trackViewContent(params: {
  content_name: string;
  content_category: string;
}) {
  if (!canTrack()) return;
  window.fbq!("track", "ViewContent", params);
}
