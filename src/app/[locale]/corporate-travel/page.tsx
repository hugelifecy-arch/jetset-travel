import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import CorporateTravelContent from "./CorporateTravelContent";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import ServiceSchema from "@/components/seo/ServiceSchema";
import JsonLd from "@/components/seo/JsonLd";
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
        ? "Корпоративные поездки на Кипре. Прозрачная отчётность, бесплатная консультация, поддержка 24/7 при сбоях. Аккредитация IATA."
        : "Corporate travel management in Cyprus. Free consultation, clean invoicing, 24/7 disruption support. IATA accredited, dedicated account manager for your business.",
  });
}

export default async function CorporateTravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "corporatePage" });

  const faqItems = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
    { q: t("faq6Q"), a: t("faq6A") },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <CorporateTravelContent />
      <ServicesCrossLinks locale={locale} include={["visa", "hotels", "luxury"]} />
      <ServiceSchema
        name="Corporate Travel Management"
        description="Corporate travel management for Cyprus businesses. Policy-compliant bookings, clean invoicing, 24/7 rebooking, dedicated account management, and disruption support."
        url={`https://www.jetset-travel.com/${locale}/corporate-travel`}
      />
      <JsonLd data={faqSchema} />
    </>
  );
}
