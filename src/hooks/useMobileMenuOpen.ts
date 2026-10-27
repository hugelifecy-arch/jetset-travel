"use client";

import { useState, useEffect } from "react";

/** Dispatched by HeaderClient with `{ open: boolean }` when the mobile menu opens or closes. */
export const MOBILE_MENU_EVENT = "mobile-menu-change";

/**
 * Whether the header's mobile menu is open. Lets fixed bottom bars step aside
 * so they cannot cover menu items (WCAG 2.4.11 Focus Not Obscured).
 */
export function useMobileMenuOpen(): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      setOpen(Boolean((e as CustomEvent<{ open?: boolean }>).detail?.open));
    };
    window.addEventListener(MOBILE_MENU_EVENT, handler);
    return () => window.removeEventListener(MOBILE_MENU_EVENT, handler);
  }, []);

  return open;
}
