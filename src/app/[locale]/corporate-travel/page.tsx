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
    title: {
      absolute:
        locale === "ru"
          ? "Корпоративное управление поездками Кипр | JetSet Travel"
          : "Corporate Travel Management Cyprus | Policy-Compliant Bookings | JetSet Travel",
    },
    description:
      locale === "ru"
        ? "Корпоративное управление поездками с прозрачной отчётностью, поддержкой 24/7 и персональными менеджерами. Более 500 корпоративных клиентов."
        : "Executive travel management with clean invoicing, 24/7 disruption support, and dedicated account managers. Trusted by 500+ corporate clients.",
    alternates: localizedAlternates(locale, "/corporate-travel"),
  };
}

export default function CorporateTravelPage() {
  return <CorporateTravelContent />;
}
