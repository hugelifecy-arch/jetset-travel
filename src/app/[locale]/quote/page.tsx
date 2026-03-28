import type { Metadata } from "next";
import { buildPageMetadata, CANONICAL_ORIGIN } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import QuoteContent from "./QuoteContent";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/quote",
    title:
      locale === "ru"
        ? "Запросить предложение | Корпоративный и люкс — JetSet"
        : "Get a Travel Quote | Corporate & Luxury — JetSet",
    description:
      locale === "ru"
        ? "Запросите индивидуальное предложение от JetSet Travel Cyprus. Корпоративные поездки с отчётностью или элитный отдых — ответ в течение 1 часа."
        : "Request a tailored corporate or luxury travel quote from JetSet Travel Cyprus. Compliant invoicing or bespoke holidays — we respond within 1 hour.",
    keywords:
      locale === "ru"
        ? ["запросить предложение путешествие", "бесплатная консультация турагентство", "корпоративное предложение Кипр"]
        : ["travel quote request", "free travel consultation", "corporate travel quote Cyprus"],
  });
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const quotePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name:
      locale === "ru"
        ? "Запросить предложение — JetSet Travel"
        : "Get a Travel Quote — JetSet Travel",
    url: `${CANONICAL_ORIGIN}/${locale}/quote`,
    description:
      locale === "ru"
        ? "Запросите индивидуальное предложение от JetSet Travel Cyprus."
        : "Request a tailored corporate or luxury travel quote from JetSet Travel Cyprus.",
    potentialAction: {
      "@type": "CommunicateAction",
      target: `${CANONICAL_ORIGIN}/${locale}/quote`,
      name:
        locale === "ru"
          ? "Запросить предложение"
          : "Request Travel Quote",
    },
    mainEntity: {
      "@type": "TravelAgency",
      name: "JetSet Travel Cyprus",
      url: "https://www.jetset-travel.com",
      telephone: "+357-99-478-073",
      email: "info@jetset.com.cy",
    },
  };

  return (
    <>
      <JsonLd data={quotePageSchema} />
      <QuoteContent />
    </>
  );
}
