import type { Metadata } from "next";
import QuoteContent from "./QuoteContent";

export const metadata: Metadata = {
  title: "Get a Quote — Corporate & Luxury Travel from Cyprus",
  description:
    "Request a tailored travel quote from JetSet Travel Cyprus. Corporate travel with VAT invoicing or bespoke luxury holidays — we respond within 1 hour.",
};

export default function QuotePage() {
  return <QuoteContent />;
}
