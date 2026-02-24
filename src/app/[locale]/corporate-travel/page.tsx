import type { Metadata } from "next";
import CorporateTravelContent from "./CorporateTravelContent";

export const metadata: Metadata = {
  title: "Corporate Travel Management — Fast Quotes & Clean Invoicing",
  description:
    "IATA-accredited corporate travel management in Cyprus. Fast quotes, VAT-compliant invoicing, travel policy compliance, and 24/7 support for businesses.",
};

export default function CorporateTravelPage() {
  return <CorporateTravelContent />;
}
