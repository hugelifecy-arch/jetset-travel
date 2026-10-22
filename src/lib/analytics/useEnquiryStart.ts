"use client";

import { useCallback, useRef } from "react";
import { trackEnquiryStart, type FormName } from "@/lib/analytics/gtag";

/**
 * Returns a handler for a form's onFocus (React focus events bubble from the
 * fields) that sends `enquiry_start` once per page view of that form.
 */
export function useEnquiryStart(formName: FormName): () => void {
  const started = useRef(false);
  return useCallback(() => {
    if (started.current) return;
    started.current = true;
    trackEnquiryStart(formName);
  }, [formName]);
}
