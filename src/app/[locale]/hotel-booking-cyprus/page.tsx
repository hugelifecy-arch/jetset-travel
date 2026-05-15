import type { Metadata } from "next";
import { buildPageMetadata, SERVICE_LAST_UPDATED } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  Hotel,
  Building2,
  Star,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  Briefcase,
  CreditCard,
  HeadphonesIcon,
  MapPin,
  Award,
  Gem,
  Users,
  FileText,
  Palmtree,
} from "lucide-react";
import CTABanner from "@/components/sections/CTABanner";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import ServiceSchema from "@/components/seo/ServiceSchema";
import FAQSection from "@/components/sections/FAQSection";

const languagePaths = {
  en: "/hotel-booking-cyprus",
  ru: "/hotel-booking-cyprus",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/hotel-booking-cyprus",
    title:
      locale === "ru"
        ? "Бронирование Отелей Кипр | Лучшие Тарифы — JetSet"
        : "Hotel Booking Cyprus | Best Rates — JetSet Travel",
    description:
      locale === "ru"
        ? "Бронирование отелей на Кипре и по всему миру. Корпоративные тарифы, партнёрские люксовые отели. Чистые счета. JetSet Travel Пафос."
        : "Hotel reservations in Cyprus and worldwide. Negotiated corporate rates, luxury hotel partners. Clean invoicing. JetSet Travel Paphos.",
    keywords:
      locale === "ru"
        ? ["бронирование отелей Кипр", "лучшие тарифы отели", "корпоративное бронирование отелей", "отели Пафос"]
        : ["hotel booking Cyprus", "best hotel rates", "corporate hotel booking", "hotels Paphos"],
    languagePaths,
  });
}

export default async function HotelBookingCyprusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "hotelCyprusPage" });

  const whyAgent = [
    { icon: CreditCard, titleKey: "why1Title", descKey: "why1Desc" },
    { icon: Shield, titleKey: "why2Title", descKey: "why2Desc" },
    { icon: HeadphonesIcon, titleKey: "why3Title", descKey: "why3Desc" },
    { icon: FileText, titleKey: "why4Title", descKey: "why4Desc" },
  ] as const;

  const paphosHotels = [
    {
      icon: Star,
      titleKey: "paphosHotel1Title",
      descKey: "paphosHotel1Desc",
      tagKey: "paphosHotel1Tag",
    },
    {
      icon: Star,
      titleKey: "paphosHotel2Title",
      descKey: "paphosHotel2Desc",
      tagKey: "paphosHotel2Tag",
    },
    {
      icon: Star,
      titleKey: "paphosHotel3Title",
      descKey: "paphosHotel3Desc",
      tagKey: "paphosHotel3Tag",
    },
  ] as const;

  const limassolHotels = [
    {
      icon: Star,
      titleKey: "limassolHotel1Title",
      descKey: "limassolHotel1Desc",
      tagKey: "limassolHotel1Tag",
    },
    {
      icon: Star,
      titleKey: "limassolHotel2Title",
      descKey: "limassolHotel2Desc",
      tagKey: "limassolHotel2Tag",
    },
    {
      icon: Star,
      titleKey: "limassolHotel3Title",
      descKey: "limassolHotel3Desc",
      tagKey: "limassolHotel3Tag",
    },
  ] as const;

  const corporateFeatures = [
    "corpFeature1",
    "corpFeature2",
    "corpFeature3",
    "corpFeature4",
    "corpFeature5",
    "corpFeature6",
  ] as const;

  const luxuryPartners = [
    { icon: Gem, titleKey: "luxPartner1Title", descKey: "luxPartner1Desc" },
    { icon: Palmtree, titleKey: "luxPartner2Title", descKey: "luxPartner2Desc" },
    { icon: Award, titleKey: "luxPartner3Title", descKey: "luxPartner3Desc" },
  ] as const;

  const faqItems = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
    { question: t("faq4Q"), answer: t("faq4A") },
    { question: t("faq5Q"), answer: t("faq5A") },
  ];

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

      {/* Why Book Through a Travel Agent */}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-brand-navy/70 leading-relaxed mb-6">
                {t("whyP1")}
              </p>
              <p className="text-brand-navy/70 leading-relaxed">
                {t("whyP2")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyAgent.map((item) => (
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

      {/* Hotels in Paphos */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 mx-auto">
              <MapPin className="h-7 w-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("paphosTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("paphosSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paphosHotels.map((hotel) => (
              <div
                key={hotel.titleKey}
                className="group p-8 rounded-2xl border border-brand-navy/10 bg-white hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <hotel.icon className="h-7 w-7" />
                </div>
                <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">
                  {t(hotel.tagKey)}
                </p>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {t(hotel.titleKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(hotel.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels in Limassol */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 mx-auto">
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("limassolTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("limassolSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {limassolHotels.map((hotel) => (
              <div
                key={hotel.titleKey}
                className="group p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <hotel.icon className="h-7 w-7" />
                </div>
                <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">
                  {t(hotel.tagKey)}
                </p>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {t(hotel.titleKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(hotel.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Hotel Programs */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("corpTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("corpSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-navy/70 leading-relaxed mb-6">
                {t("corpP1")}
              </p>
              <p className="text-brand-navy/70 leading-relaxed mb-8">
                {t("corpP2")}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                {t("corpCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {corporateFeatures.map((key) => (
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

      {/* Luxury Hotel Partners */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("luxTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("luxSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {luxuryPartners.map((partner) => (
              <div
                key={partner.titleKey}
                className="group p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors mx-auto">
                  <partner.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {t(partner.titleKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(partner.descKey)}
                </p>
              </div>
            ))}
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
        name="Hotel Booking Cyprus"
        description="Hotel reservations in Cyprus and worldwide. Negotiated corporate rates, luxury hotel partners, clean invoicing, and 24/7 support. JetSet Travel Paphos, IATA-accredited agency."
        url={`https://www.jetset-travel.com/${locale}/hotel-booking-cyprus/`}
        serviceType="Hotel Reservation Service"
        dateModified={SERVICE_LAST_UPDATED}
      />
    </>
  );
}
