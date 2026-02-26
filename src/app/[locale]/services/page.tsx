import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates } from "@/lib/seo";
import Link from "next/link";
import {
  Plane,
  Hotel,
  FileText,
  Palmtree,
  Briefcase,
  ArrowRight,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      absolute:
        locale === "ru"
          ? "Наши услуги — Авиабилеты, отели, визы, корпоративные и премиальные путешествия | JetSet Travel"
          : "Our Services — Flights, Hotels, Visas, Corporate & Luxury Travel | JetSet Travel",
    },
    description:
      locale === "ru"
        ? "Полный спектр туристических услуг от JetSet Travel Cyprus: авиабилеты, бронирование отелей, визовая поддержка, корпоративные и премиальные путешествия."
        : "Full-service travel management from JetSet Travel Cyprus: flights, hotel reservations, visa assistance, corporate travel, and luxury holiday planning.",
    alternates: localizedAlternates(locale, "/services"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });

  const serviceNav = [
    { id: "flights", label: t("flightsTitle"), icon: Plane },
    { id: "hotels", label: t("hotelsTitle"), icon: Hotel },
    { id: "visas", label: t("visasTitle"), icon: FileText },
    { id: "luxury", label: t("luxuryTitle"), icon: Palmtree },
    { id: "corporate", label: t("corporateTitle"), icon: Briefcase },
  ];

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
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            {t("heroSubtitle")}
          </p>

          {/* Service quick-nav pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {serviceNav.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 hover:border-brand-gold/60 hover:text-brand-gold transition-colors"
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6 text-center">
            {t("introTitle")}
          </h2>
          <div className="space-y-4 text-brand-navy/70 leading-relaxed text-lg">
            <p>{t("introP1")}</p>
            <p>{t("introP2")}</p>
          </div>
        </div>
      </section>

      {/* Flights */}
      <section id="flights" className="py-20 bg-brand-light scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                <Plane className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
                {t("flightsTitle")}
              </h2>
              <div className="space-y-4 text-brand-navy/70 leading-relaxed">
                <p>{t("flightsP1")}</p>
                <p>{t("flightsP2")}</p>
                <p>{t("flightsP3")}</p>
              </div>
              <div className="mt-8">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
                >
                  {t("flightsCta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full hidden md:block">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-navy to-brand-dark flex items-center justify-center">
                <Plane className="h-20 w-20 text-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels */}
      <section id="hotels" className="py-20 bg-white scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row-reverse items-start gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                <Hotel className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
                {t("hotelsTitle")}
              </h2>
              <div className="space-y-4 text-brand-navy/70 leading-relaxed">
                <p>{t("hotelsP1")}</p>
                <p>{t("hotelsP2")}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
                >
                  {t("hotelsCta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href={`/${locale}/hotel-reservations`}
                  className="inline-flex items-center rounded-full border border-brand-navy/20 px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5 transition-colors"
                >
                  {t("hotelsLink")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full hidden md:block">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex items-center justify-center">
                <Hotel className="h-20 w-20 text-brand-navy/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visas */}
      <section id="visas" className="py-20 bg-brand-light scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                <FileText className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
                {t("visasTitle")}
              </h2>
              <div className="space-y-4 text-brand-navy/70 leading-relaxed">
                <p>{t("visasP1")}</p>
                <p>{t("visasP2")}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
                >
                  {t("visasCta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href={`/${locale}/visa-services`}
                  className="inline-flex items-center rounded-full border border-brand-navy/20 px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5 transition-colors"
                >
                  {t("visasLink")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full hidden md:block">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-navy to-brand-dark flex items-center justify-center">
                <FileText className="h-20 w-20 text-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury */}
      <section id="luxury" className="py-20 bg-white scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row-reverse items-start gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                <Palmtree className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
                {t("luxuryTitle")}
              </h2>
              <div className="space-y-4 text-brand-navy/70 leading-relaxed">
                <p>{t("luxuryP1")}</p>
                <p>{t("luxuryP2")}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
                >
                  {t("luxuryCta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href={`/${locale}/luxury-travel`}
                  className="inline-flex items-center rounded-full border border-brand-navy/20 px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5 transition-colors"
                >
                  {t("luxuryLink")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full hidden md:block">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex items-center justify-center">
                <Palmtree className="h-20 w-20 text-brand-navy/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate */}
      <section id="corporate" className="py-20 bg-brand-light scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                <Briefcase className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
                {t("corporateTitle")}
              </h2>
              <div className="space-y-4 text-brand-navy/70 leading-relaxed">
                <p>{t("corporateP1")}</p>
                <p>{t("corporateP2")}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/contact?type=corporate`}
                  className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
                >
                  {t("corporateCta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href={`/${locale}/corporate-travel`}
                  className="inline-flex items-center rounded-full border border-brand-navy/20 px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5 transition-colors"
                >
                  {t("corporateLink")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full hidden md:block">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-navy to-brand-dark flex items-center justify-center">
                <Briefcase className="h-20 w-20 text-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/quote`}
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              {t("ctaQuote")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {t("ctaContact")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
