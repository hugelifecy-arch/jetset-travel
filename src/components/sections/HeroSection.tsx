"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

// TODO: Compress hero.mp4 to under 2MB:
// ffmpeg -i hero.mp4 -vcodec h264 -crf 28 -preset medium -vf scale=1920:-2 -an hero-compressed.mp4

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function HeroSection() {
  const locale = useLocale();
  const t = useTranslations("hero");
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileVideoPlaying, setMobileVideoPlaying] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const handlePlayMobile = useCallback(() => {
    setMobileVideoPlaying(true);
  }, []);

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden">
      {/* Background image — always visible, acts as poster on mobile */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero-bg.jpg"
          alt="Aerial view of the Mediterranean coastline in Cyprus with turquoise waters"
          fill
          sizes="100vw"
          className="object-cover"
          priority={true}
        />
      </div>

      {/* Video background — desktop only (conditionally rendered to prevent mobile download) */}
      {isDesktop && (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-bg.jpg"
          aria-hidden="true"
        />
      )}

      {/* Mobile: play button overlay to load video on demand */}
      {!isDesktop && !mobileVideoPlaying && (
        <button
          onClick={handlePlayMobile}
          className="absolute bottom-8 right-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
          aria-label="Play background video"
        >
          <Play className="h-5 w-5 text-white" />
        </button>
      )}

      {/* Mobile video — only rendered after user taps play */}
      {!isDesktop && mobileVideoPlaying && (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-bg.jpg"
          aria-hidden="true"
        />
      )}

      {/* Navy gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-navy/90 via-brand-navy/70 to-brand-dark/90" />

      <div className="mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Headline */}
          <motion.h1
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            {t("title")}{" "}
            <span className="text-brand-gold">{t("titleHighlight")}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <Link
              href={`/${locale}/contact?type=corporate`}
              className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-4 text-base font-semibold text-brand-navy shadow-luxury transition-opacity hover:opacity-90"
            >
              {t("ctaCorporate")}
            </Link>
            <Link
              href={`/${locale}/contact?type=luxury`}
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("ctaLuxury")}
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-12 flex flex-wrap items-center gap-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Image
                src="/images/iata-logo.jpg"
                alt="IATA Accredited Travel Agent"
                width={28}
                height={28}
                className="h-7 w-7 rounded object-contain"
              />
              <span className="font-medium">{t("badgeIATA")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <MessageCircle className="h-5 w-5 text-brand-gold" />
              <span className="font-medium">{t("badgeWhatsApp")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Image
                src="/images/tourism-logo.jpg"
                alt="Cyprus Tourism Organisation Licensed"
                width={28}
                height={28}
                className="h-7 w-7 rounded object-contain"
              />
              <span className="font-medium">{t("badgeLicense")}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
