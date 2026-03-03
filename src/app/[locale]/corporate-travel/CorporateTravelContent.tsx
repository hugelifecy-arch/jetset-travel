"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Zap,
  ShieldCheck,
  Clock,
  FileText,
  Phone,
  UserCheck,
  PlaneTakeoff,
  ChevronDown,
  Check,
  ArrowRight,
} from "lucide-react";
import InlineTestimonial from "@/components/sections/InlineTestimonial";

export default function CorporateTravelContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const locale = useLocale();
  const t = useTranslations("corporatePage");

  const pillars = [
    {
      icon: Zap,
      title: t("speedTitle"),
      description: t("speedDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("complianceTitle"),
      description: t("complianceDesc"),
    },
    {
      icon: Clock,
      title: t("reliabilityTitle"),
      description: t("reliabilityDesc"),
    },
  ];

  const steps = [
    {
      number: "01",
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      number: "02",
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      number: "03",
      title: t("step3Title"),
      description: t("step3Desc"),
    },
    {
      number: "04",
      title: t("step4Title"),
      description: t("step4Desc"),
    },
  ];

  const coverageLeft = [
    t("cover1"),
    t("cover2"),
    t("cover3"),
    t("cover4"),
    t("cover5"),
    t("cover6"),
  ];

  const coverageRight = [
    t("cover7"),
    t("cover8"),
    t("cover9"),
    t("cover10"),
    t("cover11"),
    t("cover12"),
  ];

  const faqs = [
    {
      question: t("faq1Q"),
      answer: t("faq1A"),
    },
    {
      question: t("faq2Q"),
      answer: t("faq2A"),
    },
    {
      question: t("faq3Q"),
      answer: t("faq3A"),
    },
    {
      question: t("faq4Q"),
      answer: t("faq4A"),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("heroLabel")}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-2xl">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                {t("requestQuote")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href={`https://wa.me/35799478073?text=${locale === "ru" ? encodeURIComponent("Здравствуйте, я хотел бы обсудить корпоративные тревел-услуги.") : encodeURIComponent("Hi, I'd like to discuss corporate travel services.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="mr-2 h-4 w-4" />
                {t("callUsNow")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("whyTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("whySubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="text-center p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                  <pillar.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {pillar.title}
                </h3>
                <p className="text-brand-navy/60 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("howTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("howSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-5xl font-bold text-brand-gold/20 font-display">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-brand-navy mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("coverTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("coverSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 max-w-3xl mx-auto">
            <ul className="space-y-4">
              {coverageLeft.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-brand-navy/80">{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-4">
              {coverageRight.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-brand-navy/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-8 text-center">
            {t("testimonialTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <InlineTestimonial
              quote={t("testimonial1Quote")}
              author={t("testimonial1Author")}
              role={t("testimonial1Role")}
              date="2025-09"
            />
            <InlineTestimonial
              quote={t("testimonial2Quote")}
              author={t("testimonial2Author")}
              role={t("testimonial2Role")}
              date="2025-03"
            />
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("faqTitle")}
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-brand-navy/10 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-brand-navy pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-brand-gold flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-brand-navy/60 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-6">
            <PlaneTakeoff className="h-8 w-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t("ctaQuote")}
            </Link>
            <a
              href={`https://wa.me/35799478073?text=${locale === "ru" ? encodeURIComponent("Здравствуйте, я хотел бы открыть корпоративный тревел-аккаунт.") : encodeURIComponent("Hi, I'd like to set up a corporate travel account.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              {t("ctaAccount")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
