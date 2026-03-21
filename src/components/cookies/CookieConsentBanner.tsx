"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  type CookiePreferences,
  DEFAULT_PREFERENCES,
  ACCEPT_ALL,
  getConsentPreferences,
  setConsentPreferences,
} from "@/lib/cookie-consent";

function subscribeConsentStore(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("cookie-consent-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cookie-consent-change", callback);
  };
}

function getConsentSnapshot() {
  return getConsentPreferences() !== null;
}

function getConsentServerSnapshot() {
  return true;
}

export default function CookieConsentBanner() {
  const t = useTranslations("cookies");
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  const hasExistingConsent = useSyncExternalStore(
    subscribeConsentStore,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  const [forcedVisible, setForcedVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(DEFAULT_PREFERENCES);

  const visible = !hasExistingConsent || forcedVisible;

  useEffect(() => {
    const handleReopen = () => {
      const saved = getConsentPreferences();
      if (saved) {
        setPreferences(saved);
      }
      setShowSettings(true);
      setForcedVisible(true);
    };
    window.addEventListener("open-cookie-settings", handleReopen);
    return () =>
      window.removeEventListener("open-cookie-settings", handleReopen);
  }, []);

  const handleSave = useCallback((prefs: CookiePreferences) => {
    setConsentPreferences(prefs);
    setForcedVisible(false);
    setShowSettings(false);
  }, []);

  const handleAcceptAll = useCallback(() => {
    handleSave(ACCEPT_ALL);
  }, [handleSave]);

  const handleRejectNonEssential = useCallback(() => {
    handleSave(DEFAULT_PREFERENCES);
  }, [handleSave]);

  const handleSavePreferences = useCallback(() => {
    handleSave(preferences);
  }, [handleSave, preferences]);

  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) {
      window.dispatchEvent(
        new CustomEvent("cookie-banner-change", { detail: { visible: false, height: 0 } }),
      );
      return;
    }
    requestAnimationFrame(() => {
      const height = bannerRef.current?.offsetHeight ?? 0;
      window.dispatchEvent(
        new CustomEvent("cookie-banner-change", { detail: { visible: true, height } }),
      );
    });
  }, [visible, showSettings]);

  if (!visible) return null;

  return (
    <div ref={bannerRef} className="fixed inset-x-0 bottom-0 z-[60] p-4">
      <div className="mx-auto max-w-4xl rounded-xl border border-brand-navy/10 bg-white shadow-luxury">
        {/* Main banner */}
        {!showSettings && (
          <div className="p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-brand-navy/80 sm:text-base">
              {t("banner")}{" "}
              <a
                href={`/${locale}/privacy`}
                className="font-medium text-brand-gold underline underline-offset-2 transition-colors hover:text-brand-gold/80"
              >
                {t("privacyLink")}
              </a>
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center justify-center rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
              >
                {t("acceptAll")}
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="inline-flex items-center justify-center rounded-full border border-brand-navy/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-light"
              >
                {t("rejectNonEssential")}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-brand-navy/70 underline underline-offset-2 transition-colors hover:text-brand-navy"
              >
                {t("managePreferences")}
              </button>
            </div>
          </div>
        )}

        {/* Settings panel */}
        {showSettings && (
          <div className="p-5 sm:p-6">
            <h3 className="font-display text-lg font-semibold text-brand-navy">
              {t("settingsTitle")}
            </h3>
            <div className="mt-4 space-y-4">
              {/* Essential */}
              <CookieCategory
                label={t("essential")}
                description={t("essentialDescription")}
                checked={true}
                disabled
                badge={t("alwaysOn")}
              />
              {/* Analytics */}
              <CookieCategory
                label={t("analytics")}
                description={t("analyticsDescription")}
                checked={preferences.analytics}
                onChange={(v) =>
                  setPreferences((p) => ({ ...p, analytics: v }))
                }
              />
              {/* Marketing */}
              <CookieCategory
                label={t("marketing")}
                description={t("marketingDescription")}
                checked={preferences.marketing}
                onChange={(v) =>
                  setPreferences((p) => ({ ...p, marketing: v }))
                }
              />
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button
                onClick={handleSavePreferences}
                className="inline-flex items-center justify-center rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
              >
                {t("savePreferences")}
              </button>
              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center justify-center rounded-full border border-brand-navy/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-light"
              >
                {t("acceptAll")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CookieCategory({
  label,
  description,
  checked,
  disabled,
  badge,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onChange?: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-brand-navy/10 p-3 sm:p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-brand-navy">
            {label}
          </span>
          {badge && (
            <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand-navy/60">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-brand-navy/60 sm:text-sm">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
          checked ? "bg-brand-gold" : "bg-brand-navy/20",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
