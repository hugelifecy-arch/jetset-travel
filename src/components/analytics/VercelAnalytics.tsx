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
    window.addEventListener("cookie-consent-change", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("cookie-consent-change", check);
    };
  }, []);

  if (!consentGiven) return null;

  return <Analytics />;
}
