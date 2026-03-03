"use client";

import { useTranslations } from "next-intl";

export default function CookieSettingsButton() {
  const t = useTranslations("cookies");

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      className="inline-flex items-center justify-center rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
    >
      {t("reopenSettings")}
    </button>
  );
}
