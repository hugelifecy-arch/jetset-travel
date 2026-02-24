import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/seo";
import CorporateTravelContent from "./CorporateTravelContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Corporate Travel Management — Fast Quotes & Clean Invoicing",
    description:
      "IATA-accredited corporate travel management in Cyprus. Fast quotes, VAT-compliant invoicing, travel policy compliance, and 24/7 support for businesses.",
    alternates: localizedAlternates(locale, "/corporate-travel"),
  };
}

export default function CorporateTravelPage() {
  return <CorporateTravelContent />;
}
