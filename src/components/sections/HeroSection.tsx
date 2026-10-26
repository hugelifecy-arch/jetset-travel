"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MessageCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { trackCTAClick, trackWhatsAppClick } from "@/lib/analytics/gtag";

const WHATSAPP_NUMBER = "35799478073";

export default function HeroSection() {
  const locale = useLocale();
  const t = useTranslations("hero");

  return (
    /* Full first screen below the 80 px header on desktop only; on phones and
       tablets the hero is as tall as its content, so the headline sits right
       under the header instead of below an empty band. */
    <section className="relative isolate flex items-center overflow-hidden bg-brand-navy lg:min-h-[calc(100svh-5rem)]">
      {/* Background photo: the Blue Lagoon on the Akamas peninsula (Paphos
          district), free Unsplash License. Replaces the gradient placeholder
          and the ~2 MB cliff video. next/image serves AVIF/WebP. */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero-cyprus.jpg"
          alt={t("heroImageAlt")}
          fill
          sizes="100vw"
          className="object-cover object-[62%_center] md:object-center"
          priority
          fetchPriority="high"
        />
      </div>

      {/* Navy gradient: dark behind the text, clear where there is none so
          the photo shows. Phones/tablets: top to bottom, ending in a clear
          strip of the lagoon below the badges (the extra bottom padding).
          Desktop: left to right, the right half of the photo stays clear.
          Measured against the brightest photo pixel behind each line (EN
          and RU, 390 px and 1440 px): white text at least 4.5:1, the gold
          headline (large text) at least 3:1. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(27_42_74/0.92)_0%,rgb(27_42_74/0.84)_calc(100%_-_10rem),rgb(27_42_74/0)_100%)] lg:bg-[linear-gradient(to_right,rgb(27_42_74/0.94)_0%,rgb(27_42_74/0.86)_52%,rgb(27_42_74/0.35)_75%,rgb(27_42_74/0)_100%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-40 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          {/* Headline */}
          <h1
            className="enter-up font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {t("title")}{" "}
            <span className="text-brand-gold">{t("titleHighlight")}</span>
          </h1>

          {/* Subtitle */}
          <p
            className="enter-up mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg md:text-xl"
            style={{ "--enter-step": 1 } as CSSProperties}
          >
            {t("subtitle")}
          </p>

          {/* Dual-path CTAs — Corporate Concierge vs Luxury Planning, with WhatsApp quick-quote */}
          <div
            className="enter-up mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch"
            style={{ "--enter-step": 2 } as CSSProperties}
          >
            <Link
              href={`/${locale}/contact`}
              onClick={() =>
                trackCTAClick({
                  location: "hero",
                  cta_type: "corporate_consultation",
                  cta_label: t("ctaCorporate"),
                  destination: `/${locale}/contact`,
                })
              }
              className="group inline-flex flex-col items-center justify-center rounded-2xl bg-brand-gold px-6 py-3 text-brand-navy shadow-luxury transition-opacity hover:opacity-90 sm:items-start sm:px-8 sm:py-4"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-navy">
                {t("pathCorporateLabel")}
              </span>
              <span className="mt-1 text-base font-semibold">
                {t("ctaCorporate")}
              </span>
              <span className="mt-0.5 text-xs text-brand-navy">
                {t("pathCorporateHint")}
              </span>
            </Link>
            <Link
              href={`/${locale}/quote?type=luxury`}
              onClick={() =>
                trackCTAClick({
                  location: "hero",
                  cta_type: "luxury_quote",
                  cta_label: t("ctaLuxury"),
                  destination: `/${locale}/quote?type=luxury`,
                })
              }
              className="group inline-flex flex-col items-center justify-center rounded-2xl border-2 border-white px-6 py-3 text-white transition-colors hover:bg-white/10 sm:items-start sm:px-8 sm:py-4"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {t("pathLuxuryLabel")}
              </span>
              <span className="mt-1 text-base font-semibold">
                {t("ctaLuxury")}
              </span>
              <span className="mt-0.5 text-xs text-white/80">
                {t("pathLuxuryHint")}
              </span>
            </Link>
          </div>

          {/* Tertiary quick-path: WhatsApp + SLA microcopy */}
          <div
            className="enter-up mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
            style={{ "--enter-step": 3 } as CSSProperties}
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("ctaWhatsAppMessage"))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackCTAClick({
                  location: "hero",
                  cta_type: "whatsapp_quick_quote",
                  cta_label: t("ctaWhatsApp"),
                  destination: "whatsapp",
                });
                trackWhatsAppClick("hero", "quick_quote");
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/90 underline-offset-4 hover:text-brand-gold hover:underline"
            >
              <MessageCircle className="h-4 w-4 text-brand-gold" aria-hidden="true" />
              <span>{t("ctaWhatsApp")}</span>
            </a>
            <span className="hidden text-white/30 sm:inline" aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-2 text-xs text-white/80 sm:text-sm">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {t("slaLine")}
            </span>
          </div>

          {/* Trust badges */}
          <div
            className="enter-up mt-8 flex flex-wrap items-center gap-3 sm:mt-12 sm:gap-4 md:gap-6"
            style={{ "--enter-step": 4 } as CSSProperties}
          >
            {/* The logos are dark artwork on transparent backgrounds: show
                them on small white tiles, as the footer does. */}
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Image
                src="/images/iata-logo.png"
                alt={t("iataAlt")}
                width={40}
                height={40}
                className="h-10 w-10 rounded-md bg-white object-contain p-1"
              />
              <span className="font-medium">{t("badgeIATA")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <MessageCircle className="h-5 w-5 text-brand-gold" aria-hidden="true" />
              <span className="font-medium">{t("badgeWhatsApp")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Image
                src="/images/tourism-logo.png"
                alt={t("tourismAlt")}
                width={40}
                height={40}
                className="h-10 w-10 rounded-md bg-white object-contain p-1"
              />
              <span className="font-medium">{t("badgeLicense")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
