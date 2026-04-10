"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";
import { hasConsent } from "@/lib/cookie-consent";

export default function VercelAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const check = () => setConsentGiven(hasConsent("analytics"));
    check();

    window.addEventListener("storage", check);
    const handleBannerChange = () => setTimeout(check, 0);
    window.addEventListener("cookie-banner-change", handleBannerChange);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("cookie-banner-change", handleBannerChange);
    };
  }, []);

  if (!consentGiven) return null;

  return <Analytics />;
}
