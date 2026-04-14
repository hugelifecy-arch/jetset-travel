"use client";

import { useState, useCallback, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const DESKTOP_MQ = "(min-width: 768px)";
const REDUCED_MOTION_MQ = "(prefers-reduced-motion: reduce)";

function subscribeDesktop(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_MQ);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getIsDesktop() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

function getIsDesktopServer() {
  return false;
}

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_MQ);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getPrefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_MQ).matches;
}

function getPrefersReducedMotionServer() {
  return false;
}

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
  const isDesktop = useSyncExternalStore(subscribeDesktop, getIsDesktop, getIsDesktopServer);
  const prefersReducedMotion = useSyncExternalStore(subscribeReducedMotion, getPrefersReducedMotion, getPrefersReducedMotionServer);
  const [mobileVideoPlaying, setMobileVideoPlaying] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayMobile = useCallback(() => {
    setMobileVideoPlaying(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoAvailable(false);
  }, []);

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-brand-navy">
      {/* Background image — always visible, acts as poster on mobile */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero-bg.jpg"
          alt={t("heroImageAlt")}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          fetchPriority="high"
          quality={85}
        />
      </div>

      {/* Video background — desktop only, hidden when user prefers reduced motion */}
      {isDesktop && videoAvailable && !prefersReducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-bg.jpg"
          aria-hidden="true"
          onError={handleVideoError}
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Mobile: play button overlay to load video on demand (hidden if reduced motion) */}
      {!isDesktop && !mobileVideoPlaying && videoAvailable && !prefersReducedMotion && (
        <button
          onClick={handlePlayMobile}
          className="absolute bottom-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8"
          aria-label="Play background video"
        >
          <Play className="h-5 w-5 text-white" />
        </button>
      )}

      {/* Mobile video — only rendered after user taps play */}
      {!isDesktop && mobileVideoPlaying && videoAvailable && (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-bg.jpg"
          aria-hidden="true"
          onError={handleVideoError}
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Navy gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-navy/90 via-brand-navy/70 to-brand-dark/90" />

      <div className="mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Headline */}
          <motion.h1
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
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
            className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg md:text-xl"
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
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-base font-semibold text-brand-navy shadow-luxury transition-opacity hover:opacity-90 sm:px-8 sm:py-4"
            >
              {t("ctaCorporate")}
            </Link>
            <Link
              href={`/${locale}/quote`}
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:px-8 sm:py-4"
            >
              {t("ctaLuxury")}
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3 sm:mt-12 sm:gap-4 md:gap-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Image
                src="/images/iata-logo.jpg"
                alt={t("iataAlt")}
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
                alt={t("tourismAlt")}
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
