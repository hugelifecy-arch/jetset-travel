"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  Palmtree,
  CheckCircle,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import CorporateForm from "./CorporateForm";
import LuxuryForm from "./LuxuryForm";
import type { QuoteTFunction } from "./shared";

function SuccessScreen({ t }: { t: QuoteTFunction }) {
  const locale = useLocale();
  const whatsAppText =
    locale === "ru"
      ? "Здравствуйте, я только что отправил запрос на предложение на вашем сайте."
      : "Hi, I just submitted a quote request on your website.";
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 lg:py-24">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-gold/10 mb-8">
        <CheckCircle className="h-10 w-10 text-brand-gold" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
        {t("successTitle")}
      </h2>
      <p className="text-brand-navy/60 text-lg max-w-md mb-8">
        {t("successMessage")}
      </p>
      <a
        href={`https://wa.me/35799478073?text=${encodeURIComponent(whatsAppText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white hover:bg-[#22c35e] transition-colors"
      >
        <MessageCircle className="h-5 w-5" />
        {t("successWhatsApp")}
      </a>
    </div>
  );
}

export default function QuoteContent() {
  const t = useTranslations("quotePage");
  const [branch, setBranch] = useState<"corporate" | "luxury" | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
            {t("heroLabel")}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Form Area */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {success ? (
            <SuccessScreen t={t} />
          ) : branch === null ? (
            /* Step 1: Choose Branch */
            <div>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
                  {t("typeTitle")}
                </h2>
                <p className="text-brand-navy/60">
                  {t("typeSubtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => setBranch("corporate")}
                  className="group flex flex-col items-center text-center p-10 rounded-2xl border-2 border-brand-navy/10 hover:border-brand-gold hover:shadow-luxury transition-all"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">
                    {t("corporateTitle")}
                  </h3>
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    {t("corporateDesc")}
                  </p>
                </button>

                <button
                  onClick={() => setBranch("luxury")}
                  className="group flex flex-col items-center text-center p-10 rounded-2xl border-2 border-brand-navy/10 hover:border-brand-gold hover:shadow-luxury transition-all"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                    <Palmtree className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">
                    {t("luxuryTitle")}
                  </h3>
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    {t("luxuryDesc")}
                  </p>
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Form */
            <div>
              <button
                onClick={() => setBranch(null)}
                className="inline-flex items-center gap-2 text-sm text-brand-navy/60 hover:text-brand-gold transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("backToSelection")}
              </button>

              <div className="mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold mb-3">
                  {branch === "corporate" ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <Palmtree className="h-4 w-4" />
                  )}
                  {branch === "corporate"
                    ? t("corporateTitle")
                    : t("luxuryTitle")}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
                  {branch === "corporate"
                    ? t("corporateEnquiry")
                    : t("luxuryEnquiry")}
                </h2>
                <p className="text-brand-navy/60 text-sm">
                  {t("formSubtitle")}
                </p>
              </div>

              {branch === "corporate" ? (
                <CorporateForm onSuccess={() => setSuccess(true)} t={t} />
              ) : (
                <LuxuryForm onSuccess={() => setSuccess(true)} t={t} />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
