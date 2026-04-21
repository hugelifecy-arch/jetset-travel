import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import HeroSection from "@/components/sections/HeroSection";
import TrustCredentialsBar from "@/components/sections/TrustCredentialsBar";
import ComparisonSection from "@/components/sections/ComparisonSection";
import ClientLogos from "@/components/sections/ClientLogos";
import CTABanner from "@/components/sections/CTABanner";
import LatestBlogStrip from "@/components/sections/LatestBlogStrip";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import WebSiteSchema from "@/components/seo/WebSiteSchema";

// Below-the-fold sections are code-split so their client JS chunks
// (including framer-motion) are not bundled with the initial page load.
// SSR remains enabled (default) so the HTML is still crawlable.
const ServicesGrid = dynamic(
  () => import("@/components/sections/ServicesGrid"),
);
const TrustSection = dynamic(
  () => import("@/components/sections/TrustSection"),
);
const GoogleReviews = dynamic(
  () => import("@/components/sections/GoogleReviews"),
);
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
      <LatestBlogStrip locale={locale} />
      <CTABanner />
      <LocalBusinessSchema reviews={reviews} />
      <WebSiteSchema />
    </>
  );
}
