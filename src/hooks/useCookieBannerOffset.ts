"use client";

import { useState, useEffect } from "react";

/**
 * Listens for cookie-banner-change events dispatched by CookieConsentBanner
 * and returns the pixel offset needed to clear the banner.
 */
export function useCookieBannerOffset(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const { visible, height } = (e as CustomEvent).detail;
      setOffset(visible ? height : 0);
    };
    window.addEventListener("cookie-banner-change", handler);
    return () => window.removeEventListener("cookie-banner-change", handler);
  }, []);

  return offset;
}
