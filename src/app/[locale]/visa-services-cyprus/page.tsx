import type { Metadata } from "next";
import { buildPageMetadata, SERVICE_LAST_UPDATED } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  Globe,
  Briefcase,
  Palmtree,
  GraduationCap,
  Plane,
  ShieldCheck,
  FileText,
  Phone,
  ClipboardList,
  Search,
  Send,
  BarChart3,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Clock,
  Users,
  Award,
  HeadphonesIcon,
} from "lucide-react";
import CTABanner from "@/components/sections/CTABanner";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import FeaturedBlogPost from "@/components/sections/FeaturedBlogPost";
import RelatedArticles from "@/components/sections/RelatedArticles";
import ServiceSchema from "@/components/seo/ServiceSchema";
import JsonLd from "@/components/seo/JsonLd";
import Accordion from "@/components/ui/Accordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/visa-services-cyprus",
    title:
      locale === "ru"
        ? "Визовые Услуги Кипр | Шенген Пафос — JetSet Travel"
        : "Visa Services Cyprus | Schengen & Business — JetSet",
    description:
      locale === "ru"
        ? "Профессиональные визовые услуги в Пафосе, Кипр. Шенгенская виза, UK, US, бизнес виза. Подготовка документов. Бесплатная консультация."
        : "Professional visa services in Paphos, Cyprus. Schengen visa, UK visa, US visa, business & tourist visa assistance. Document preparation and application guidance.",
    keywords:
      locale === "ru"
        ? ["визовые услуги Кипр Пафос", "шенгенская виза оформление", "деловая виза Кипр", "визовая помощь Пафос", "виза на Кипр для россиян 2026", "как оформить визу на Кипр из России 2026"]
        : ["visa services Cyprus Paphos", "Schengen visa application", "business visa Cyprus", "visa help Paphos", "visa support for business trips to Cyprus"],
    languagePaths: {
      en: "/visa-services-cyprus",
      ru: "/visa-services-cyprus",
    },
  });
}

const visaTypes = [
  {
    icon: Globe,
    titleKey: "visaSchengenTitle",
    descKey: "visaSchengenDesc",
  },
  {
    icon: Globe,
    titleKey: "visaUKTitle",
    descKey: "visaUKDesc",
  },
  {
    icon: Globe,
    titleKey: "visaUSTitle",
    descKey: "visaUSDesc",
  },
  {
    icon: Globe,
    titleKey: "visaUAETitle",
    descKey: "visaUAEDesc",
  },
  {
    icon: Briefcase,
    titleKey: "visaBusinessTitle",
    descKey: "visaBusinessDesc",
  },
  {
    icon: Palmtree,
    titleKey: "visaTouristTitle",
    descKey: "visaTouristDesc",
  },
  {
    icon: GraduationCap,
    titleKey: "visaStudentTitle",
    descKey: "visaStudentDesc",
  },
] as const;

const steps = [
  {
    number: "01",
    icon: Phone,
    titleKey: "step1Title",
    descKey: "step1Desc",
  },
  {
    number: "02",
    icon: ClipboardList,
    titleKey: "step2Title",
    descKey: "step2Desc",
  },
  {
    number: "03",
    icon: Search,
    titleKey: "step3Title",
    descKey: "step3Desc",
  },
  {
    number: "04",
    icon: Send,
    titleKey: "step4Title",
    descKey: "step4Desc",
  },
  {
    number: "05",
    icon: BarChart3,
    titleKey: "step5Title",
    descKey: "step5Desc",
  },
] as const;

const benefits = [
  {
    icon: FileText,
    titleKey: "benefit1Title",
    descKey: "benefit1Desc",
  },
  {
    icon: Clock,
    titleKey: "benefit2Title",
    descKey: "benefit2Desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "benefit3Title",
    descKey: "benefit3Desc",
  },
  {
    icon: Users,
    titleKey: "benefit4Title",
    descKey: "benefit4Desc",
  },
  {
    icon: Award,
    titleKey: "benefit5Title",
    descKey: "benefit5Desc",
  },
  {
    icon: HeadphonesIcon,
    titleKey: "benefit6Title",
    descKey: "benefit6Desc",
  },
] as const;

export default async function VisaServicesCyprusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "visaCyprusPage" });

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const schengenRequirements = [
    t("schengenReq1"),
    t("schengenReq2"),
    t("schengenReq3"),
    t("schengenReq4"),
    t("schengenReq5"),
    t("schengenReq6"),
    t("schengenReq7"),
    t("schengenReq8"),
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
                {t("heroCTA")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {t("heroContactCTA")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visa Types We Assist With */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("visaTypesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("visaTypesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visaTypes.map((visa) => (
              <div
                key={visa.titleKey}
                className="p-6 rounded-2xl border border-brand-navy/10 bg-white hover:shadow-luxury transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <visa.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t(visa.titleKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(visa.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Our Visa Service Works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("howTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("howSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
                  {t("step")} {step.number}
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
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

      {/* Schengen Visa from Cyprus — Complete Guide */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
              {t("schengenTitle")}
            </h2>
            <p className="text-brand-navy/80 text-lg leading-relaxed mb-6">
              {t("schengenIntroP1")}
            </p>
            <p className="text-brand-navy/80 text-lg leading-relaxed mb-8">
              {t("schengenIntroP2")}
            </p>
            <div className="bg-white rounded-2xl p-8 border border-brand-navy/10">
              <h3 className="text-xl font-bold text-brand-navy mb-4">
                {t("schengenReqTitle")}
              </h3>
              <ul className="space-y-3">
                {schengenRequirements.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span className="text-brand-navy/80 text-sm leading-relaxed">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-brand-navy/80 text-lg leading-relaxed mt-8">
              {t("schengenOutro")}
            </p>
          </div>
        </div>
      </section>

      {/* Why Use a Travel Agent for Visa Applications */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("whyAgentTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("whyAgentSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.titleKey}
                className="p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t(benefit.titleKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(benefit.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa FAQs */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("faqTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("faqSubtitle")}
            </p>
          </div>
          <Accordion
            items={faqs.map((faq) => ({
              question: faq.q,
              answer: faq.a,
            }))}
          />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 p-6 rounded-xl bg-brand-light border border-brand-navy/10">
            <ShieldAlert className="h-5 w-5 text-brand-navy/40 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                <strong className="text-brand-navy">
                  {t("disclaimerLabel")}
                </strong>{" "}
                {t("disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />

      {/* Phase 6 Step 52 — amplify the Schengen guide that GSC flagged with
          +143% impressions but underwater CTR. Permanent anchor link from
          the highest-intent visa-services landing page in both locales. */}
      <FeaturedBlogPost
        locale={locale}
        enSlug="schengen-visa-guide-cyprus-residents"
        ruSlug="shengenskaya-viza-dlya-zhitelej-kipra"
      />
      <RelatedArticles
        locale={locale}
        tags={["visa", "schengen", "visas"]}
      />

      {/* Related Services */}
      <ServicesCrossLinks locale={locale} include={["corporate", "paphos"]} />

      {/* JSON-LD: Service Schema */}
      <ServiceSchema
        locale={locale}
        name="Visa Services Cyprus"
        description="Professional visa services in Paphos, Cyprus. Schengen visa, UK visa, US visa, business and tourist visa assistance. Document preparation and application guidance from JetSet Travel, IATA-accredited agency."
        url={`https://www.jetset-travel.com/${locale}/visa-services-cyprus`}
        serviceType="Visa Services"
        dateModified={SERVICE_LAST_UPDATED}
      />

      {/* JSON-LD: FAQPage Schema */}
      <JsonLd data={faqSchema} />
    </>
  );
}
