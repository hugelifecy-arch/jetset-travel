"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, MessageCircle, Award } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const trustBadges = [
  { icon: Shield, label: "IATA Accredited" },
  { icon: MessageCircle, label: "24/7 WhatsApp" },
  { icon: Award, label: "Tourism License 7775" },
];

export default function HeroSection() {
  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>

      {/* Video background — desktop only */}
      <video
        className="absolute inset-0 -z-20 hidden h-full w-full object-cover md:block"
        src="/videos/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

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
            Travel Managed.{" "}
            <span className="text-brand-gold">Luxury Delivered.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            IATA-accredited corporate and luxury travel management based in
            Paphos, Cyprus. Fast quotes, compliant invoicing, and 24/7
            disruption support — so your team just has to show up.
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
              href="/quote"
              className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-4 text-base font-semibold text-brand-navy shadow-luxury transition-opacity hover:opacity-90"
            >
              Get a Corporate Quote
            </Link>
            <Link
              href="/luxury-travel"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Plan a Luxury Trip
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
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-sm text-white/80"
              >
                <badge.icon className="h-5 w-5 text-brand-gold" />
                <span className="font-medium">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
