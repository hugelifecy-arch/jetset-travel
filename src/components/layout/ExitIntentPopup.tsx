"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/* The dialog (form, reCAPTCHA call) is fetched only when the exit intent
   fires, and its zod validation only when the form is used. Until then this
   component is a timer and one listener on desktop, nothing on phones. */
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
/*  Once per browser session (sessionStorage; may be unavailable)      */
/* ------------------------------------------------------------------ */

const SESSION_SHOWN_KEY = "exit_intent_shown";

function wasShownThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_SHOWN_KEY) === "1";
  } catch {
    return false;
  }
}

function markShownThisSession() {
  try {
    window.sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
  } catch {
    // Storage blocked: the session cookies above still stop repeats.
  }
}

/* ------------------------------------------------------------------ */
/*  Where and on which devices it may appear                           */
/* ------------------------------------------------------------------ */

/* Visitors on these pages are already enquiring or reading answers.
   /private is excluded because the Private & Family Office page bans
   mass-market conversion patterns (PRIVATE_OFFICE_PAGE_SPEC §2). */
const EXCLUDED_SUFFIXES = ["/contact", "/quote", "/faq", "/private"];

function isExcludedPage(pathname: string): boolean {
  return EXCLUDED_SUFFIXES.some((s) => pathname.endsWith(s));
}

/* Exit intent means "the mouse leaves through the top of the window", which
   only exists with a real mouse. Never on touch screens (including touch
   laptops) or below the md breakpoint. */
const DESKTOP_MOUSE_MQ = "(min-width: 768px) and (hover: hover) and (pointer: fine)";

function isDesktopMouseDevice(): boolean {
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return false;
  return window.matchMedia(DESKTOP_MOUSE_MQ).matches;
}

/** Not armed until the visitor has spent this long on the page. */
const ARM_DELAY_MS = 30_000;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ExitIntentPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  /* ---- Desktop only: armed after 30 s on the page, fires when the mouse
          leaves the window through the top ---- */
  useEffect(() => {
    if (isExcludedPage(pathname)) return;
    if (!isDesktopMouseDevice()) return;

    const alreadyHandled = () =>
      triggered.current ||
      wasShownThisSession() ||
      getSessionCookie(COOKIE_DISMISSED) ||
      getSessionCookie(COOKIE_SUBMITTED);
    if (alreadyHandled()) return;

    const handleMouseOut = (e: MouseEvent) => {
      // relatedTarget null = the pointer left the document, not an element.
      if (e.relatedTarget !== null || e.clientY > 0) return;
      if (alreadyHandled()) return;
      triggered.current = true;
      markShownThisSession();
      setVisible(true);
    };

    // The timer restarts on every page (client-side navigations included).
    const armTimer = window.setTimeout(() => {
      document.addEventListener("mouseout", handleMouseOut);
    }, ARM_DELAY_MS);

    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [pathname]);

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
