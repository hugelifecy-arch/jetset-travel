import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import Accordion from "@/components/ui/Accordion";
import JsonLd from "@/components/seo/JsonLd";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  return buildPageMetadata({
    locale,
    routePath: "/faq",
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords:
      locale === "ru"
        ? ["частые вопросы турагентство", "FAQ JetSet Travel", "вопросы и ответы путешествия Кипр", "IATA агентство вопросы"]
        : ["travel agency FAQ", "JetSet Travel questions", "travel Cyprus FAQ", "IATA agency questions"],
  });
}

interface FaqCategory {
  titleKey: string;
  namespace: string;
  count: number;
}

const faqCategories: FaqCategory[] = [
  { titleKey: "categoryBooking", namespace: "booking", count: 4 },
  { titleKey: "categoryCorporate", namespace: "corporate", count: 3 },
  { titleKey: "categoryPayments", namespace: "payments", count: 3 },
  { titleKey: "categoryVisa", namespace: "visa", count: 3 },
  { titleKey: "categoryAbout", namespace: "about", count: 9 },
];

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  // Build all Q&A pairs for JSON-LD
  const allQAPairs: { question: string; answer: string }[] = [];
  const categoryData = faqCategories.map((cat) => {
    const items: { question: string; answer: string }[] = [];
    for (let i = 1; i <= cat.count; i++) {
      const question = t(`${cat.namespace}.q${i}`);
      const answer = t(`${cat.namespace}.a${i}`);
      items.push({ question, answer });
      allQAPairs.push({ question, answer });
    }
    return { title: t(cat.titleKey), items };
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQAPairs.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-faq-answer]"],
    },
  };

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
            {t("heroLabel")}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {categoryData.map((category) => (
              <div key={category.title}>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">
                  {category.title}
                </h2>
                <Accordion items={category.items} />
              </div>
            ))}
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
              href={`/${locale}/contact`}
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              {t("ctaContact")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/35799478073?text=${locale === "ru" ? encodeURIComponent("Здравствуйте JetSet, мне нужна помощь с...") : encodeURIComponent("Hi JetSet, I'd like help with...")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t("ctaWhatsApp")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
