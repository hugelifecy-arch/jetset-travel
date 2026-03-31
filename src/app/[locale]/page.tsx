import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import HeroSection from "@/components/sections/HeroSection";
import TrustCredentialsBar from "@/components/sections/TrustCredentialsBar";
import ServicesGrid from "@/components/sections/ServicesGrid";
import TrustSection from "@/components/sections/TrustSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ClientLogos from "@/components/sections/ClientLogos";
import CTABanner from "@/components/sections/CTABanner";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import WebSiteSchema from "@/components/seo/WebSiteSchema";
import ReviewSchema from "@/components/seo/ReviewSchema";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    title:
      locale === "ru"
        ? "Турагентство в Пафосе, Кипр | JetSet Travel — Аккредитация IATA"
        : "Travel Agency in Paphos | JetSet Travel — IATA Accredited",
    description:
      locale === "ru"
        ? "Аккредитованное IATA турагентство в Пафосе. Корпоративные поездки, премиальный отдых, визы. Поддержка 24/7 в WhatsApp. Бесплатное предложение за 2 часа."
        : "IATA-accredited travel agency in Paphos, Cyprus. Corporate travel, luxury holidays & visa services. 24/7 WhatsApp support. Free quote in 2 hours.",
    keywords:
      locale === "ru"
        ? ["туристическое агентство Кипр", "IATA турагентство Пафос", "авиабилеты Пафос", "туры из Кипра", "бронирование отелей Кипр", "корпоративные поездки Кипр", "JetSet Travel", "турагентство с IATA Пафос", "лучшее турагентство в Пафосе для бизнеса", "корпоративное турагентство Кипр"]
        : ["travel agency Paphos", "IATA accredited travel agent Cyprus", "corporate travel Cyprus", "luxury travel Paphos", "flight booking Cyprus", "JetSet Travel", "travel agent Paphos Cyprus", "best travel agency in Paphos", "corporate travel agency Paphos"],
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews" });

  const reviews = [
    { author: "Maria K.", reviewBody: t("review1.text"), ratingValue: 5 },
    { author: "Andreas P.", reviewBody: t("review2.text"), ratingValue: 5 },
    { author: "Dmitry S.", reviewBody: t("review3.text"), ratingValue: 5 },
  ];

  return (
    <>
      {/* Preload hero background image for faster LCP */}
      <link rel="preload" as="image" href="/images/hero-bg.jpg" />
      <HeroSection />
      <TrustCredentialsBar />
      <ServicesGrid />
      <TrustSection />
      <ComparisonSection />
      <GoogleReviews />
      <ClientLogos />
      <CTABanner />
      <LocalBusinessSchema />
      <WebSiteSchema />
      <ReviewSchema reviews={reviews} />
    </>
  );
}
