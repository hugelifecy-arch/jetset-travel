import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/seo";
import CorporateTravelContent from "./CorporateTravelContent";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
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
          ? "Корпоративное управление поездками Кипр | Бронирования с отчётностью | JetSet Travel"
          : "Corporate Travel Management Cyprus | Policy-Compliant Bookings | JetSet Travel",
    },
    description:
      locale === "ru"
        ? "Корпоративное управление поездками для компаний Кипра. Прозрачная отчётность, соответствие политикам, перебронирование 24/7, персональный менеджер. Запросите бесплатное предложение."
        : "Corporate travel management for Cyprus businesses. Clean invoicing, policy compliance, 24/7 rebooking, and dedicated account management. Get a free quote today.",
    alternates: localizedAlternates(locale, "/corporate-travel"),
  };
}

export default async function CorporateTravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <CorporateTravelContent />
      <ServicesCrossLinks locale={locale} exclude="corporate" />
    </>
  );
}
