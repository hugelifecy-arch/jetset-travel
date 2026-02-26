import type { Metadata } from "next";
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
        ? "Корпоративное турагентство в Пафосе, Кипр | JetSet Travel — Аккредитация IATA"
        : "Corporate Travel Agency in Paphos, Cyprus | JetSet Travel — IATA Accredited",
    description:
      locale === "ru"
        ? "Аккредитованное IATA агентство: корпоративные и премиальные путешествия на Кипре. Быстрые предложения, прозрачная отчётность, поддержка 24/7. Более 500 корпоративных клиентов с 2006 года."
        : "IATA-accredited corporate & luxury travel management in Cyprus. Fast quotes, compliant invoicing, 24/7 disruption support. Serving 500+ corporate clients since 2006.",
  });
}

export default function HomePage() {
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
    </>
  );
}
