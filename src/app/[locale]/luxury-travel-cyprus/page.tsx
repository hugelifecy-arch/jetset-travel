import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Star,
  Gem,
  Plane,
  Hotel,
  MapPin,
  Heart,
  Shield,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  Palmtree,
  Mountain,
} from "lucide-react";
import CTABanner from "@/components/sections/CTABanner";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import ServiceSchema from "@/components/seo/ServiceSchema";
import FAQSection from "@/components/sections/FAQSection";

const languagePaths = {
  en: "/luxury-travel-cyprus",
  ru: "/luxusnyy-otdykh-kipr",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/luxury-travel-cyprus",
    title:
      locale === "ru"
        ? "Люкс Отдых Кипр | Премиум — JetSet Travel Пафос"
        : "Luxury Travel Cyprus | Premium Holidays — JetSet",
    description:
      locale === "ru"
        ? "Планирование люкс-путешествий с Кипра. 5-звёздочные отели, частные трансферы, индивидуальные маршруты, свадебные путешествия. Ваш премиум партнёр в Пафосе."
        : "Luxury travel planning from Cyprus. 5-star hotels, private transfers, bespoke itineraries, honeymoon packages. Your premium travel partner in Paphos.",
    keywords:
      locale === "ru"
        ? ["люкс отдых Кипр", "премиальные путешествия Пафос", "VIP туры Кипр", "элитный отдых из Кипра"]
        : ["luxury travel Cyprus", "premium holidays Paphos", "VIP tours Cyprus", "luxury vacations from Cyprus"],
    languagePaths,
  });
}

export default async function LuxuryTravelCyprusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === "ru") {
    redirect("/ru/luxusnyy-otdykh-kipr");
  }

  const t = await getTranslations({ locale, namespace: "luxuryCyprusPage" });

  const whyChooseUs = [
    { icon: Star, titleKey: "why1Title", descKey: "why1Desc" },
    { icon: Shield, titleKey: "why2Title", descKey: "why2Desc" },
    { icon: Clock, titleKey: "why3Title", descKey: "why3Desc" },
    { icon: Users, titleKey: "why4Title", descKey: "why4Desc" },
  ] as const;

  const destinations = [
    {
      icon: Palmtree,
      nameKey: "destMaldives",
      descKey: "destMaldivesDesc",
      tagKey: "destMaldivesTag",
    },
    {
      icon: MapPin,
      nameKey: "destSantorini",
      descKey: "destSantoriniDesc",
      tagKey: "destSantoriniTag",
    },
    {
      icon: Hotel,
      nameKey: "destDubai",
      descKey: "destDubaiDesc",
      tagKey: "destDubaiTag",
    },
    {
      icon: Palmtree,
      nameKey: "destSeychelles",
      descKey: "destSeychellesDesc",
      tagKey: "destSeychellesTag",
    },
    {
      icon: Mountain,
      nameKey: "destSwissAlps",
      descKey: "destSwissAlpsDesc",
      tagKey: "destSwissAlpsTag",
    },
  ] as const;

  const included = [
    "included1",
    "included2",
    "included3",
    "included4",
    "included5",
    "included6",
  ] as const;

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

      {/* Luxury Overview */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("overviewTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("overviewSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-navy/70 leading-relaxed mb-6">
                {t("overviewP1")}
              </p>
              <p className="text-brand-navy/70 leading-relaxed mb-6">
                {t("overviewP2")}
              </p>
              <p className="text-brand-navy/70 leading-relaxed">
                {t("overviewP3")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyChooseUs.map((item) => (
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

      {/* Popular Luxury Destinations */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("destTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("destSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.nameKey}
                className="group p-8 rounded-2xl border border-brand-navy/10 bg-white hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <dest.icon className="h-7 w-7" />
                </div>
                <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">
                  {t(dest.tagKey)}
                </p>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {t(dest.nameKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(dest.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("includedTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("includedSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((key) => (
              <div
                key={key}
                className="flex items-start gap-4 p-6 rounded-2xl border border-brand-navy/10"
              >
                <CheckCircle2 className="h-6 w-6 text-brand-gold flex-shrink-0 mt-0.5" />
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
      </section>

      {/* Honeymoon Section */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                <Heart className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                {t("honeymoonTitle")}
              </h2>
              <p className="text-brand-navy/60 leading-relaxed mb-6">
                {t("honeymoonP1")}
              </p>
              <p className="text-brand-navy/60 leading-relaxed mb-8">
                {t("honeymoonP2")}
              </p>
              <Link
                href={`/${locale}/contact?type=honeymoon`}
                className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                {t("honeymoonCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-brand-navy/10 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <Gem className="h-5 w-5 text-brand-gold" />
                  <h3 className="text-lg font-bold text-brand-navy">
                    {t("honeymoonFeature1Title")}
                  </h3>
                </div>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t("honeymoonFeature1Desc")}
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-brand-navy/10 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <Plane className="h-5 w-5 text-brand-gold" />
                  <h3 className="text-lg font-bold text-brand-navy">
                    {t("honeymoonFeature2Title")}
                  </h3>
                </div>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t("honeymoonFeature2Desc")}
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-brand-navy/10 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <Hotel className="h-5 w-5 text-brand-gold" />
                  <h3 className="text-lg font-bold text-brand-navy">
                    {t("honeymoonFeature3Title")}
                  </h3>
                </div>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t("honeymoonFeature3Desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        title={t("faqTitle")}
        items={[
          { question: t("faq1Q"), answer: t("faq1A") },
          { question: t("faq2Q"), answer: t("faq2A") },
          { question: t("faq3Q"), answer: t("faq3A") },
          { question: t("faq4Q"), answer: t("faq4A") },
          { question: t("faq5Q"), answer: t("faq5A") },
        ]}
      />

      {/* CTA Banner */}
      <CTABanner />

      {/* Cross-links */}
      <ServicesCrossLinks locale={locale} include={["hotels", "cruises"]} />

      {/* Structured Data */}
      <ServiceSchema
        locale={locale}
        name="Luxury Travel Planning Cyprus"
        description="Bespoke luxury travel planning from Cyprus. 5-star hotels, private transfers, honeymoon packages, and premium holiday itineraries. IATA-accredited agency in Paphos."
        url={`https://www.jetset-travel.com/${locale}/luxury-travel-cyprus`}
      />
    </>
  );
}
