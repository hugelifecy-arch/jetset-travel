import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  Plane,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Award,
  Globe,
  CreditCard,
  HeadphonesIcon,
  TowerControl,
} from "lucide-react";
import CTABanner from "@/components/sections/CTABanner";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import ServiceSchema from "@/components/seo/ServiceSchema";
import FAQSection from "@/components/sections/FAQSection";

export default async function FlightPageContent({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "flightsCyprusPage" });

  const iataReasons = [
    { icon: Shield, titleKey: "iata1Title", descKey: "iata1Desc" },
    { icon: CreditCard, titleKey: "iata2Title", descKey: "iata2Desc" },
    { icon: HeadphonesIcon, titleKey: "iata3Title", descKey: "iata3Desc" },
    { icon: Award, titleKey: "iata4Title", descKey: "iata4Desc" },
  ] as const;

  const pfoRoutes = [
    "pfoRoute1",
    "pfoRoute2",
    "pfoRoute3",
    "pfoRoute4",
    "pfoRoute5",
    "pfoRoute6",
  ] as const;

  const lcaRoutes = [
    "lcaRoute1",
    "lcaRoute2",
    "lcaRoute3",
    "lcaRoute4",
    "lcaRoute5",
    "lcaRoute6",
    "lcaRoute7",
    "lcaRoute8",
  ] as const;

  const businessFeatures = [
    "bizFeature1",
    "bizFeature2",
    "bizFeature3",
    "bizFeature4",
  ] as const;

  const groupFeatures = [
    "groupFeature1",
    "groupFeature2",
    "groupFeature3",
    "groupFeature4",
  ] as const;

  const faqItems = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
    { question: t("faq4Q"), answer: t("faq4A") },
    { question: t("faq5Q"), answer: t("faq5A") },
  ];

  const slug =
    locale === "ru" ? "aviabilety-kipr" : "flight-tickets-cyprus";

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
                {t("heroCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {t("heroCtaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Book Through an IATA Agent */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("iataTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("iataSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-brand-navy/70 leading-relaxed mb-6">
                {t("iataP1")}
              </p>
              <p className="text-brand-navy/70 leading-relaxed">
                {t("iataP2")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {iataReasons.map((item) => (
                <div
                  key={item.titleKey}
                  className="p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy mb-2">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Paphos Airport (PFO) Routes */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                <TowerControl className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                {t("pfoTitle")}
              </h2>
              <p className="text-brand-navy/60 leading-relaxed mb-6">
                {t("pfoP1")}
              </p>
              <p className="text-brand-navy/60 leading-relaxed">
                {t("pfoP2")}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-brand-navy/10">
              <h3 className="text-xl font-bold text-brand-navy mb-6">
                {t("pfoRoutesTitle")}
              </h3>
              <ul className="space-y-3">
                {pfoRoutes.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <Plane className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span className="text-brand-navy/80 text-sm leading-relaxed">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Larnaca Airport (LCA) Routes */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="order-2 lg:order-1 bg-brand-light rounded-2xl p-8 border border-brand-navy/10">
              <h3 className="text-xl font-bold text-brand-navy mb-6">
                {t("lcaRoutesTitle")}
              </h3>
              <ul className="space-y-3">
                {lcaRoutes.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <Plane className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span className="text-brand-navy/80 text-sm leading-relaxed">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                <Globe className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                {t("lcaTitle")}
              </h2>
              <p className="text-brand-navy/60 leading-relaxed mb-6">
                {t("lcaP1")}
              </p>
              <p className="text-brand-navy/60 leading-relaxed">
                {t("lcaP2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business & First Class */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("bizTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("bizSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-navy/70 leading-relaxed mb-6">
                {t("bizP1")}
              </p>
              <p className="text-brand-navy/70 leading-relaxed">
                {t("bizP2")}
              </p>
            </div>
            <div className="space-y-4">
              {businessFeatures.map((key) => (
                <div
                  key={key}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-brand-navy/10 bg-white"
                >
                  <CheckCircle className="h-6 w-6 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-semibold text-brand-navy mb-1">
                      {t(`${key}Title`)}
                    </h3>
                    <p className="text-brand-navy/60 text-sm leading-relaxed">
                      {t(`${key}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Group Bookings */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                <Users className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                {t("groupTitle")}
              </h2>
              <p className="text-brand-navy/60 leading-relaxed mb-6">
                {t("groupP1")}
              </p>
              <p className="text-brand-navy/60 leading-relaxed mb-8">
                {t("groupP2")}
              </p>
              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                {t("groupCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {groupFeatures.map((key) => (
                <div
                  key={key}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-brand-navy/10"
                >
                  <CheckCircle className="h-6 w-6 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-semibold text-brand-navy mb-1">
                      {t(`${key}Title`)}
                    </h3>
                    <p className="text-brand-navy/60 text-sm leading-relaxed">
                      {t(`${key}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection title={t("faqTitle")} items={faqItems} background="light" />

      {/* CTA Banner */}
      <CTABanner />

      {/* Cross-links */}
      <ServicesCrossLinks
        locale={locale}
        include={["corporate", "luxury", "paphos"]}
      />

      {/* Structured Data */}
      <ServiceSchema
        locale={locale}
        name="Flight Booking from Cyprus"
        description="Book flights from Cyprus with IATA-accredited JetSet Travel. Best fares from Paphos (PFO) and Larnaca (LCA) airports. Business class deals, group bookings, and 24/7 support."
        url={`https://www.jetset-travel.com/${locale}/${slug}`}
      />
    </>
  );
}
