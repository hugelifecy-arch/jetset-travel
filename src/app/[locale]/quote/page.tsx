import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/seo";
import QuoteContent from "./QuoteContent";
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
          ? "Запросить предложение | Корпоративные и премиальные поездки | JetSet Travel"
          : "Get a Travel Quote | Corporate & Luxury Travel | JetSet Travel Cyprus",
    },
    description:
      locale === "ru"
        ? "Запросите индивидуальное предложение от JetSet Travel Cyprus. Корпоративные поездки с отчётностью или элитный отдых — ответ в течение 1 часа."
        : "Request a tailored corporate or luxury travel quote from JetSet Travel Cyprus. Compliant invoicing or bespoke holidays — we respond within 1 hour.",
    alternates: localizedAlternates(locale, "/quote"),
  };
}

export default function QuotePage() {
  return <QuoteContent />;
}
