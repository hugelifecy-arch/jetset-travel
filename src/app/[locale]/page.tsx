import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import HeroSection from "@/components/sections/HeroSection";
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
        : "Travel Agency in Paphos, Cyprus | JetSet Travel — IATA Accredited",
    description:
      locale === "ru"
        ? "Аккредитованное IATA турагентство в Пафосе, Кипр. Корпоративные поездки, люкс-отдых, авиабилеты, бронирование отелей, визовые услуги. Поддержка 24/7. Более 20 лет опыта."
        : "IATA-accredited travel agency in Paphos, Cyprus. Corporate travel management, luxury holidays, flight booking, hotel reservations, and visa services. 24/7 support. 20+ years experience.",
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
