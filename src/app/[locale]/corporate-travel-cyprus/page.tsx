import type { Metadata } from "next";
import { buildPageMetadata, SERVICE_LAST_UPDATED } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plane,
  Hotel,
  Car,
  FileText,
  ArrowRight,
  MapPin,
  Building2,
  Briefcase,
  HeartPulse,
  Laptop,
  Scale,
  Landmark,
  Ship,
  Handshake,
  Package,
  ClipboardList,
  UserCheck,
  Clock,
  PhoneCall,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import CTABanner from "@/components/sections/CTABanner";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import ServiceSchema from "@/components/seo/ServiceSchema";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/corporate-travel-cyprus",
    title:
      locale === "ru"
        ? "Корпоративные Поездки Кипр | Деловой Туризм — JetSet"
        : "Corporate Travel Cyprus | Business Travel — JetSet",
    description:
      locale === "ru"
        ? "Управление корпоративными поездками на Кипре. Бронирование, чистые счета, поддержка 24/7. IATA. Пафос, Лимассол, Никосия, Ларнака."
        : "Corporate travel management across Cyprus. Policy-compliant bookings, 24/7 disruption support, clean invoicing. IATA accredited. Serving Paphos, Limassol, Nicosia & Larnaca.",
    keywords:
      locale === "ru"
        ? ["корпоративные поездки Кипр", "деловой туризм Пафос Лимассол", "бизнес командировки Кипр", "IATA корпоративное агентство", "корпоративные путешествия Кипр", "корпоративное турагентство Кипр", "корпоративное обслуживание в Пафосе"]
        : ["corporate travel Cyprus", "business travel Paphos Limassol", "corporate trips Cyprus", "IATA corporate agency", "corporate travel agency Paphos", "business travel management Cyprus", "how to get corporate travel policy Cyprus"],
    languagePaths: {
      en: "/corporate-travel-cyprus",
      ru: "/korporativnye-poezdki-kipr",
    },
  });
}

const cities = [
  {
    titleKey: "cityPaphosTitle",
    descKey: "cityPaphosDesc",
    tagKey: "cityPaphosTag",
    icon: Building2,
  },
  {
    titleKey: "cityLimassolTitle",
    descKey: "cityLimassolDesc",
    tagKey: "cityLimassolTag",
    icon: Landmark,
  },
  {
    titleKey: "cityNicosiaTitle",
    descKey: "cityNicosiaDesc",
    tagKey: "cityNicosiaTag",
    icon: Building2,
  },
  {
    titleKey: "cityLarnacaTitle",
    descKey: "cityLarnacaDesc",
    tagKey: "cityLarnacaTag",
    icon: Plane,
  },
] as const;

const processSteps = [
  { titleKey: "step1Title", descKey: "step1Desc", icon: ClipboardList },
  { titleKey: "step2Title", descKey: "step2Desc", icon: UserCheck },
  { titleKey: "step3Title", descKey: "step3Desc", icon: CheckCircle },
  { titleKey: "step4Title", descKey: "step4Desc", icon: Clock },
  { titleKey: "step5Title", descKey: "step5Desc", icon: PhoneCall },
] as const;

const industries = [
  { titleKey: "industryLaw", icon: Scale },
  { titleKey: "industryFinance", icon: Landmark },
  { titleKey: "industryTech", icon: Laptop },
  { titleKey: "industryHealthcare", icon: HeartPulse },
  { titleKey: "industryRealEstate", icon: Building2 },
  { titleKey: "industryImportExport", icon: Package },
  { titleKey: "industryShipping", icon: Ship },
  { titleKey: "industryProfessional", icon: Handshake },
] as const;

export default async function CorporateTravelCyprusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === "ru") {
    redirect("/ru/korporativnye-poezdki-kipr/");
  }

  const t = await getTranslations({
    locale,
    namespace: "corporateCyprusPage",
  });

  const faqItems = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("heroLabel")}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-2xl leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                {t("heroCtaQuote")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {t("heroCtaContact")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Travel Services for Cyprus Businesses */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("servicesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("servicesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="prose prose-brand max-w-none">
              <p className="text-brand-navy/70 leading-relaxed mb-4">
                {t("servicesText1")}
              </p>
              <p className="text-brand-navy/70 leading-relaxed">
                {t("servicesText2")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <Plane className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t("serviceFlightsTitle")}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t("serviceFlightsDesc")}
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <Hotel className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t("serviceHotelsTitle")}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t("serviceHotelsDesc")}
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t("serviceTransportTitle")}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t("serviceTransportDesc")}
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t("serviceVisaTitle")}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t("serviceVisaDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities We Serve Across Cyprus */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("citiesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("citiesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cities.map((city) => (
              <div
                key={city.titleKey}
                className="p-6 rounded-2xl border border-brand-navy/10 bg-white hover:shadow-luxury transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <city.icon className="h-6 w-6" />
                </div>
                <span className="inline-block text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2">
                  {t(city.tagKey)}
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t(city.titleKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(city.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Corporate Travel Management Works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("processTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("processSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.titleKey} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold/10 text-brand-gold mb-4 relative">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-brand-navy mb-2">
                  {t(step.titleKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("industriesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("industriesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {industries.map((industry) => (
              <div
                key={industry.titleKey}
                className="flex flex-col items-center p-6 rounded-2xl border border-brand-navy/10 bg-white hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <industry.icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-brand-navy text-center">
                  {t(industry.titleKey)}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Travel FAQs for Cyprus Companies */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("faqTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("faqSubtitle")}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-brand-navy/10 bg-white hover:shadow-card transition-shadow"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 text-left">
                  <span className="text-base font-semibold text-brand-navy pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown className="h-5 w-5 text-brand-navy/40 flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner />

      {/* Cross Links */}
      <ServicesCrossLinks
        locale={locale}
        include={["visa", "hotels", "flights"]}
      />

      {/* Structured Data */}
      <ServiceSchema
        locale={locale}
        name="Corporate Travel Management Cyprus"
        description="Corporate travel management across Cyprus. Policy-compliant bookings, 24/7 disruption support, clean invoicing, and dedicated account management for businesses in Paphos, Limassol, Nicosia, and Larnaca. IATA accredited."
        url={`https://www.jetset-travel.com/${locale}/corporate-travel-cyprus/`}
        serviceType="Corporate Travel Management"
        dateModified={SERVICE_LAST_UPDATED}
      />
      <JsonLd data={faqSchema} />
    </>
  );
}
