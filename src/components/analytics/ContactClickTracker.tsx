"use client";

import { useEffect } from "react";
import { trackContactClick, type ContactClickEvent } from "@/lib/analytics/gtag";

/** Classify a link as a contact-intent click; share links are excluded. */
export function contactClickEvent(href: string): ContactClickEvent | null {
  if (href.startsWith("tel:")) return "click_phone";
  if (href.startsWith("mailto:")) return "click_email";
  // wa.me/<number> opens a chat; wa.me/?text= is a share action, not contact.
  if (/^https:\/\/(wa\.me\/\d|api\.whatsapp\.com\/send\?phone=)/.test(href)) return "click_whatsapp";
  return null;
}

/**
 * One delegated listener covers every tel:/mailto:/WhatsApp link on the site
 * (header, footer, floating button, mobile bar, page bodies, blog markdown)
 * without editing each component. Events only fire when analytics consent
 * exists — pushEvent() checks consent before sending.
 */
export default function ContactClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const kind = contactClickEvent(link.getAttribute("href") ?? "");
      if (!kind) return;
      const region = link.closest("header")
        ? "header"
        : link.closest("footer")
          ? "footer"
          : (link.closest("[data-track-region]")?.getAttribute("data-track-region") ?? "page");
      trackContactClick(kind, { link_region: region });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
