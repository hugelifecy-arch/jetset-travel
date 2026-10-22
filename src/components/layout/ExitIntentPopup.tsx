"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/* The dialog (form, validation, reCAPTCHA call) is fetched only when the exit
   intent fires. Until then this component is a few listeners, which keeps
   react-hook-form and zod out of every page's initial JavaScript. */
const ExitIntentDialog = dynamic(() => import("./ExitIntentDialog"), {
  ssr: false,
});

/* ------------------------------------------------------------------ */
/*  Session cookie helpers                                             */
/* ------------------------------------------------------------------ */

const COOKIE_DISMISSED = "exit_intent_dismissed";
const COOKIE_SUBMITTED = "exit_intent_submitted";

function getSessionCookie(name: string): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${name}=1`));
}

function setSessionCookie(name: string) {
  // No max-age / expires → session cookie (cleared when browser closes)
  document.cookie = `${name}=1; path=/; SameSite=Lax`;
}

/* ------------------------------------------------------------------ */
/*  Excluded paths (contact / quote pages in both locales)             */
/* ------------------------------------------------------------------ */

/* /private is excluded because the Private & Family Office page bans
   mass-market conversion patterns (PRIVATE_OFFICE_PAGE_SPEC §2). */
const EXCLUDED_SUFFIXES = ["/contact", "/quote", "/private"];

function isExcludedPage(pathname: string): boolean {
  return EXCLUDED_SUFFIXES.some((s) => pathname.endsWith(s));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ExitIntentPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  /* ---- Show the popup ---- */
  const show = useCallback(() => {
    if (triggered.current) return;
    if (getSessionCookie(COOKIE_DISMISSED)) return;
    if (getSessionCookie(COOKIE_SUBMITTED)) return;
    if (isExcludedPage(pathname)) return;

    triggered.current = true;
    setVisible(true);
  }, [pathname]);

  /* ---- Desktop: exit-intent (mouse leaves viewport top) ---- */
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };

    document.addEventListener("mouseout", handleMouseLeave);
    return () => document.removeEventListener("mouseout", handleMouseLeave);
  }, [show]);

  /* ---- Mobile: scrolled 70%+ then scrolls up ---- */
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    let lastScrollY = window.scrollY;
    let reachedThreshold = false;

    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent >= 0.7) reachedThreshold = true;

      if (reachedThreshold && window.scrollY < lastScrollY) {
        show();
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [show]);

  const dismiss = useCallback(() => {
    setVisible(false);
    setSessionCookie(COOKIE_DISMISSED);
  }, []);

  const handleSubmitted = useCallback(() => {
    setSessionCookie(COOKIE_SUBMITTED);
    // Auto-close after 3 seconds
    window.setTimeout(() => setVisible(false), 3000);
  }, []);

  /* ---- Don't render on excluded pages, or while hidden. Rendering
          nothing (instead of an opacity-0 overlay) keeps the dialog and
          its form fields out of the accessibility tree and tab order. ---- */
  if (isExcludedPage(pathname)) return null;
  if (!visible) return null;

  return <ExitIntentDialog onDismiss={dismiss} onSubmitted={handleSubmitted} />;
}
