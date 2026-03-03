import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import {
  FileCheck,
  Clock,
  Download,
  MessageCircle,
  ArrowRight,
  ShieldAlert,
  Phone,
  ClipboardList,
  Search,
  Send,
  BarChart3,
  Globe,
  ChevronDown,
} from "lucide-react";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import ServiceSchema from "@/components/seo/ServiceSchema";
import JsonLd from "@/components/seo/JsonLd";
import CTABanner from "@/components/sections/CTABanner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/visa-services",
    title:
      locale === "ru"
        ? "Визовые Услуги Кипр | Шенгенская Виза Пафос — JetSet Travel"
        : "Visa Services Cyprus | Schengen Visa Paphos | Business Visa — JetSet Travel",
    description:
      locale === "ru"
        ? "Визовые услуги в Пафосе, Кипр. Шенгенская виза, деловые визы, помощь с документами, координация с посольствами. Профессиональная поддержка от JetSet Travel."
        : "Visa services in Paphos, Cyprus. Schengen visa assistance, business visa support, document preparation, embassy coordination. Expert help from JetSet Travel since 2006.",
  });
}

export default async function VisaServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "visaPage" });

  const visaCards = [
    {
      flag: "🇬🇧",
      country: t("uk"),
      processing: t("ukTime"),
      difficulty: t("medium"),
      difficultyColor: "bg-yellow-100 text-yellow-800",
    },
    {
      flag: "🇺🇸",
      country: t("us"),
      processing: t("usTime"),
      difficulty: t("hard"),
      difficultyColor: "bg-red-100 text-red-800",
    },
    {
      flag: "🇨🇦",
      country: t("canada"),
      processing: t("canadaTime"),
      difficulty: t("hard"),
      difficultyColor: "bg-red-100 text-red-800",
    },
    {
      flag: "🇦🇪",
      country: t("uae"),
      processing: t("uaeTime"),
      difficulty: t("easy"),
      difficultyColor: "bg-green-100 text-green-800",
    },
    {
      flag: "🇦🇺",
      country: t("australia"),
      processing: t("australiaTime"),
      difficulty: t("hard"),
      difficultyColor: "bg-red-100 text-red-800",
    },
    {
      flag: "🇨🇳",
      country: t("china"),
      processing: t("chinaTime"),
      difficulty: t("medium"),
      difficultyColor: "bg-yellow-100 text-yellow-800",
    },
    {
      flag: "🇪🇺",
      country: t("schengen"),
      processing: t("schengenTime"),
      difficulty: t("medium"),
      difficultyColor: "bg-yellow-100 text-yellow-800",
    },
    {
      flag: "🇷🇺",
      country: t("russia"),
      processing: t("russiaTime"),
      difficulty: t("medium"),
      difficultyColor: "bg-yellow-100 text-yellow-800",
    },
    {
      flag: "🇯🇵",
      country: t("japan"),
      processing: t("japanTime"),
      difficulty: t("medium"),
      difficultyColor: "bg-yellow-100 text-yellow-800",
    },
  ];

  const visaTypes = [
    {
      icon: Globe,
      title: t("schengenVisaTitle"),
      description: t("schengenVisaDesc"),
    },
    {
      icon: Globe,
      title: t("ukVisaTitle"),
      description: t("ukVisaDesc"),
    },
    {
      icon: Globe,
      title: t("usVisaTitle"),
      description: t("usVisaDesc"),
    },
    {
      icon: Globe,
      title: t("uaeVisaTitle"),
      description: t("uaeVisaDesc"),
    },
    {
      icon: Globe,
      title: t("russiaVisaTitle"),
      description: t("russiaVisaDesc"),
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Phone,
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      number: "02",
      icon: ClipboardList,
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      number: "03",
      icon: Search,
      title: t("step3Title"),
      description: t("step3Desc"),
    },
    {
      number: "04",
      icon: Send,
      title: t("step4Title"),
      description: t("step4Desc"),
    },
    {
      number: "05",
      icon: BarChart3,
      title: t("step5Title"),
      description: t("step5Desc"),
    },
  ];

  const documents = [
    t("doc1"),
    t("doc2"),
    t("doc3"),
    t("doc4"),
    t("doc5"),
    t("doc6"),
    t("doc7"),
    t("doc8"),
    t("doc9"),
    t("doc10"),
  ];

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
            <div className="flex flex-wrap gap-4">
              <a
                href="#visa-cta"
                className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                {t("getAssistance")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#visa-types"
                className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <ChevronDown className="mr-2 h-4 w-4" />
                {t("visaTypesTitle")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-brand-navy/80 text-lg leading-relaxed mb-6">
              {t("introP1")}
            </p>
            <p className="text-brand-navy/80 text-lg leading-relaxed">
              {t("introP2")}
            </p>
          </div>
        </div>
      </section>

      {/* Visa Types We Assist With */}
      <section id="visa-types" className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("visaTypesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("visaTypesSubtitle")}
            </p>
          </div>
          <div className="space-y-6">
            {visaTypes.map((visa) => (
              <div
                key={visa.title}
                className="bg-white p-6 md:p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex-shrink-0">
                    <visa.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-navy mb-3">
                      {visa.title}
                    </h3>
                    <p className="text-brand-navy/70 leading-relaxed">
                      {visa.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Visa Cards */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("destTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("destSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visaCards.map((visa) => (
              <div
                key={visa.country}
                className="p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{visa.flag}</span>
                    <h3 className="text-lg font-bold text-brand-navy">
                      {visa.country}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${visa.difficultyColor}`}
                  >
                    {visa.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-navy/60">
                  <Clock className="h-4 w-4 text-brand-gold" />
                  <span>
                    {t("processing")}: {visa.processing}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step Process */}
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

      {/* Document Checklist */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-light rounded-2xl p-8 md:p-12 border border-brand-navy/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex-shrink-0">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
                  {t("checklistTitle")}
                </h2>
                <p className="text-brand-navy/60">
                  {t("checklistSubtitle")}
                </p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {documents.map((doc) => (
                <li key={doc} className="flex items-start gap-3">
                  <FileCheck className="h-4 w-4 text-brand-gold flex-shrink-0 mt-1" />
                  <span className="text-brand-navy/80 text-sm">{doc}</span>
                </li>
              ))}
            </ul>
            <p className="text-brand-navy/40 text-xs">
              {t("checklistNote")}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
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
          <div className="space-y-6">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white rounded-2xl border border-brand-navy/10 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 text-left">
                  <h3 className="text-base font-semibold text-brand-navy pr-4">
                    {faq.q}
                  </h3>
                  <ChevronDown className="h-5 w-5 text-brand-navy/40 flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-brand-navy/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
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

      {/* CTA with Lead Form */}
      <div id="visa-cta">
        <CTABanner />
      </div>

      {/* Related Services */}
      <ServicesCrossLinks locale={locale} include={["corporate", "luxury"]} />

      {/* WhatsApp CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            {t("ctaSubtitle")}
          </p>
          <a
            href={`https://wa.me/35799478073?text=${locale === "ru" ? encodeURIComponent("Здравствуйте, мне нужна помощь с оформлением визы.") : encodeURIComponent("Hi, I need help with a visa application.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {t("ctaWhatsApp")}
          </a>
        </div>
      </section>

      {/* JSON-LD: Service Schema */}
      <ServiceSchema
        name={locale === "ru" ? "Визовые услуги" : "Visa Services"}
        description={
          locale === "ru"
            ? "Профессиональные визовые услуги в Пафосе, Кипр. Подготовка документов, координация с посольствами, сопровождение для деловых и туристических виз по всему миру."
            : "Expert visa assistance from Paphos, Cyprus. Document preparation, application guidance, embassy coordination, and status tracking for business and tourist visas worldwide."
        }
        url={`https://www.jetset-travel.com/${locale}/visa-services`}
      />

      {/* JSON-LD: FAQPage Schema */}
      <JsonLd data={faqSchema} />
    </>
  );
}
