"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { hasConsent } from "@/lib/cookie-consent";

const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export default function MicrosoftClarity() {
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

  if (!projectId || !consentGiven) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  );
}
