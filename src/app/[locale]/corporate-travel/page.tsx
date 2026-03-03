import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import CorporateTravelContent from "./CorporateTravelContent";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import ServiceSchema from "@/components/seo/ServiceSchema";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/corporate-travel",
    title:
      locale === "ru"
        ? "Корпоративное Турагентство Кипр | Управление Деловыми Поездками — JetSet Travel"
        : "Corporate Travel Agency Cyprus | Business Travel Management — JetSet Travel",
    description:
      locale === "ru"
        ? "Организация корпоративных поездок на Кипре. Бронирование согласно политике компании, единый счёт, поддержка 24/7 при сбоях. Аккредитация IATA."
        : "Corporate travel management in Cyprus. Policy-compliant bookings, clean invoicing, 24/7 disruption handling, and dedicated account management for businesses. IATA accredited.",
  });
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
      <ServicesCrossLinks locale={locale} include={["visa", "hotels", "luxury"]} />
      <ServiceSchema
        name="Corporate Travel Management"
        description="Corporate travel management for Cyprus businesses. Policy-compliant bookings, clean invoicing, 24/7 rebooking, dedicated account management, and disruption support."
        url={`https://www.jetset-travel.com/${locale}/corporate-travel`}
      />
    </>
  );
}
