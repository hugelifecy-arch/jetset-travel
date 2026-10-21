"use client";

import { useEffect } from "react";
import { rememberVisitStart } from "@/lib/attribution";

/**
 * Notes the first page of the visit (and its campaign tags) for the staff
 * enquiry email, only once analytics consent exists. Renders nothing.
 */
export default function VisitStartTracker() {
  useEffect(() => {
    rememberVisitStart();
    window.addEventListener("cookie-consent-change", rememberVisitStart);
    return () => window.removeEventListener("cookie-consent-change", rememberVisitStart);
  }, []);
  return null;
}
