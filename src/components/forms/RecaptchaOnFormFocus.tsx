"use client";

import { useEffect } from "react";
import { loadRecaptcha } from "@/lib/recaptcha";

/**
 * Starts loading reCAPTCHA the first time a visitor focuses a field inside any
 * <form> on the page, so the spam check is ready (and has seen some
 * interaction) by the time they submit. Pages where nobody touches a form
 * never download it. Renders nothing.
 */
export default function RecaptchaOnFormFocus() {
  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("form")) return;
      document.removeEventListener("focusin", onFocusIn, true);
      void loadRecaptcha();
    };
    document.addEventListener("focusin", onFocusIn, true);
    return () => document.removeEventListener("focusin", onFocusIn, true);
  }, []);

  return null;
}
