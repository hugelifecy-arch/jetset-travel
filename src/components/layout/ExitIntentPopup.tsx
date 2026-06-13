"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  buildExitIntentSchema,
  type ExitIntentFormValues,
} from "@/components/forms/schemas";
import { useFormMessages } from "@/components/forms/useFormMessages";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { cn } from "@/lib/utils/cn";

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

const EXCLUDED_SUFFIXES = ["/contact", "/quote"];

function isExcludedPage(pathname: string): boolean {
  return EXCLUDED_SUFFIXES.some((s) => pathname.endsWith(s));
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])';

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ExitIntentPopup() {
  const pathname = usePathname();
  const t = useTranslations("exitIntent");

  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const triggered = useRef(false);
  const formLoadedAt = useRef(0);
  useEffect(() => { formLoadedAt.current = Date.now(); }, []);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const formMessages = useFormMessages();
  const schema = useMemo(
    () => buildExitIntentSchema(formMessages),
    [formMessages],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExitIntentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const selectedTravelType = useWatch({ control, name: "travelType" });

  /* ---- Show the popup ---- */
  const show = useCallback(() => {
    if (triggered.current) return;
    if (getSessionCookie(COOKIE_DISMISSED)) return;
    if (getSessionCookie(COOKIE_SUBMITTED)) return;
    if (isExcludedPage(pathname)) return;

    triggered.current = true;
    formLoadedAt.current = Date.now();
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

  /* ---- Close handler ---- */
  const close = useCallback(() => {
    setVisible(false);
    setSessionCookie(COOKIE_DISMISSED);
  }, []);

  /* ---- Close on Escape ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, close]);

  /* ---- Focus management: move focus into the dialog while it is open,
          return it to the previously focused element when it closes
          (covers both manual dismissal and the post-submit auto-close) ---- */
  useEffect(() => {
    if (!visible) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        ?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus?.();
    };
  }, [visible]);

  /* ---- Trap Tab inside the dialog while open ---- */
  const handleTrapKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [],
  );

  /* ---- Form submit ---- */
  const onSubmit = async (data: ExitIntentFormValues) => {
    setSubmitError(null);

    const recaptchaToken = await getRecaptchaToken("exit_intent");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        travelType: data.travelType,
        website: honeypotRef.current?.value || "",
        _formLoadedAt: formLoadedAt.current,
        _recaptchaToken: recaptchaToken,
      }),
    });

    if (!res.ok) throw new Error("Submission failed");

    setSubmitted(true);
    setSessionCookie(COOKIE_SUBMITTED);

    // Auto-close after 3 seconds
    setTimeout(() => setVisible(false), 3000);
  };

  /* ---- Don't render on excluded pages, or while hidden. Rendering
          nothing (instead of an opacity-0 overlay) keeps the dialog and
          its form fields out of the accessibility tree and tab order. ---- */
  if (isExcludedPage(pathname)) return null;
  if (!visible) return null;

  /* ---- Render ---- */
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center animate-modal-in"
      role="dialog"
      aria-modal="true"
      aria-label={t("heading")}
      onKeyDown={handleTrapKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-luxury sm:p-8"
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute right-4 top-4 text-brand-navy/50 transition-colors hover:text-brand-navy"
          aria-label={t("close")}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {submitted ? (
          /* ---- Thank-you state ---- */
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-brand-navy">
              {t("thankYou")}
            </p>
          </div>
        ) : (
          /* ---- Form state ---- */
          <>
            <h2 className="font-display text-2xl font-bold text-brand-navy">
              {t("heading")}
            </h2>
            <p className="mt-1 text-sm text-brand-navy/70">
              {t("subheading")}
            </p>

            <form
              onSubmit={(e) => {
                void handleSubmit(async (data) => {
                  try {
                    await onSubmit(data);
                  } catch {
                    setSubmitError(t("error"));
                  }
                })(e);
              }}
              className="mt-5 space-y-3"
            >
              {/* Honeypot */}
              <div
                className="absolute -left-[9999px]"
                aria-hidden="true"
                style={{ opacity: 0, height: 0, overflow: "hidden" }}
              >
                <input
                  type="text"
                  ref={honeypotRef}
                  name="b_website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <Input
                  {...register("name")}
                  placeholder={t("namePlaceholder")}
                  aria-label={t("namePlaceholder")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "exit-intent-name-error" : undefined}
                />
                {errors.name && (
                  <span
                    id="exit-intent-name-error"
                    role="alert"
                    className="text-xs text-red-500"
                  >
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  aria-label={t("emailPlaceholder")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "exit-intent-email-error" : undefined}
                />
                {errors.email && (
                  <span
                    id="exit-intent-email-error"
                    role="alert"
                    className="text-xs text-red-500"
                  >
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Travel type pills */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-brand-navy/70">
                  {t("travelTypeLabel")}
                </p>
                <div className="flex gap-2">
                  {(["Corporate", "Leisure", "Visa"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={selectedTravelType === type}
                      onClick={() =>
                        setValue(
                          "travelType",
                          selectedTravelType === type ? undefined : type,
                          { shouldValidate: true },
                        )
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        selectedTravelType === type
                          ? "border-brand-gold bg-brand-gold/10 text-brand-navy"
                          : "border-brand-navy/20 text-brand-navy/60 hover:border-brand-gold hover:text-brand-navy",
                      )}
                    >
                      {t(
                        `travelType${type}` as
                          | "travelTypeCorporate"
                          | "travelTypeLeisure"
                          | "travelTypeVisa",
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {submitError && (
                <p role="alert" className="text-xs text-red-600">{submitError}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </form>

            <p className="mt-3 text-center text-xs text-brand-navy/50">
              {t("disclaimer")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
