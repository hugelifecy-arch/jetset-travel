"use client";

import { useLocale, useTranslations } from "next-intl";
import LazyCTALeadForm from "@/components/forms/LazyCTALeadForm";
import { trackCTAClick, trackWhatsAppClick } from "@/lib/analytics/gtag";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "35799478073";

/** Optional title/subtitle let a page replace the default (corporate)
 *  wording, e.g. luxury and hotel pages. */
export default function CTABanner({
  title,
  subtitle,
}: { title?: string; subtitle?: string } = {}) {
  const locale = useLocale();
  const t = useTranslations("cta");

  return (
    <section className="bg-brand-navy py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal-up text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title ?? t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            {subtitle ?? t("subtitle")}
          </p>

          <div className="mt-10">
            <LazyCTALeadForm />
          </div>

          <div className="mt-8 text-sm text-white/50">
            <p>{t("orContactDirectly")}</p>
            <div className="mt-2 flex items-center justify-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${locale === "ru" ? encodeURIComponent("Здравствуйте JetSet, мне нужна помощь с...") : encodeURIComponent("Hi JetSet, I'd like help with...")}`}
                className="text-white/70 underline transition-colors hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("cta_banner", "generic")}
              >
                WhatsApp
              </a>
              <span className="text-white/30">|</span>
              <a
                href="tel:+35799478073"
                className="text-white/70 underline transition-colors hover:text-white"
                onClick={() =>
                  trackCTAClick({
                    location: "cta_banner",
                    cta_type: "phone_call",
                    destination: "tel:+35799478073",
                  })
                }
              >
                +357 99 478 073
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
