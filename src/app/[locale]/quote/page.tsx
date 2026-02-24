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
    title: "Get a Quote — Corporate & Luxury Travel from Cyprus",
    description:
      "Request a tailored travel quote from JetSet Travel Cyprus. Corporate travel with VAT invoicing or bespoke luxury holidays — we respond within 1 hour.",
    alternates: localizedAlternates(locale, "/quote"),
  };
}

export default function QuotePage() {
  return <QuoteContent />;
}
