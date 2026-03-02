/**
 * Client-side spam protection hook for forms.
 *
 * Provides:
 *   - A page-load timestamp for time-based server validation
 *   - reCAPTCHA v3 script loading + token generation (gracefully optional)
 *   - A `getSpamFields()` function to merge into form submission payloads
 *
 * The honeypot field is rendered directly in the form JSX (not in this hook)
 * so it appears in the DOM for bots to find.
 */
"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export function useSpamProtection(recaptchaAction: string = "submit") {
  const timestampRef = useRef<number>(0);

  // Record timestamp and load reCAPTCHA v3 script on mount
  useEffect(() => {
    timestampRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    if (document.getElementById("recaptcha-v3-script")) return;

    const script = document.createElement("script");
    script.id = "recaptcha-v3-script";
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const getSpamFields = useCallback(async () => {
    let _recaptchaToken: string | undefined;

    if (RECAPTCHA_SITE_KEY && window.grecaptcha) {
      try {
        _recaptchaToken = await new Promise<string>((resolve, reject) => {
          window.grecaptcha!.ready(() => {
            window.grecaptcha!
              .execute(RECAPTCHA_SITE_KEY, { action: recaptchaAction })
              .then(resolve)
              .catch(reject);
          });
        });
      } catch {
        // reCAPTCHA failed — continue without token
      }
    }

    return {
      website_url: "", // honeypot — value comes from hidden input, this is fallback
      _timestamp: timestampRef.current,
      _recaptchaToken,
    };
  }, [recaptchaAction]);

  return { getSpamFields };
}
