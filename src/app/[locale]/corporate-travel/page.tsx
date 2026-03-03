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
        ? "Управление корпоративными командировками на Кипре | JetSet Travel"
        : "Corporate Travel Management Cyprus | Policy-Compliant Bookings | JetSet Travel",
    description:
      locale === "ru"
        ? "Организация корпоративных командировок для компаний на Кипре. Прозрачная отчётность, соблюдение корпоративной политики, перебронирование 24/7 и персональный менеджер."
        : "Corporate travel management for Cyprus businesses. Clean invoicing, policy compliance, 24/7 rebooking, and dedicated account management. Get a free quote today.",
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
      <ServicesCrossLinks locale={locale} exclude="corporate" />
      <ServiceSchema
        name="Corporate Travel Management"
        description="Corporate travel management for Cyprus businesses. Policy-compliant bookings, clean invoicing, 24/7 rebooking, dedicated account management, and disruption support."
        url={`https://www.jetset-travel.com/${locale}/corporate-travel`}
      />
    </>
  );
}
