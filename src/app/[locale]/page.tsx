import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/seo";
import HeroSection from "@/components/sections/HeroSection";
import ServicesGrid from "@/components/sections/ServicesGrid";
import TrustSection from "@/components/sections/TrustSection";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ClientLogos from "@/components/sections/ClientLogos";
import CTABanner from "@/components/sections/CTABanner";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

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
          ? "Корпоративное и премиальное турагентство в Пафосе, Кипр | JetSet Travel"
          : "Corporate & Luxury Travel Agency in Paphos, Cyprus | JetSet Travel",
    },
    description:
      locale === "ru"
        ? "Аккредитованное IATA турагентство: корпоративные поездки и элитный отдых. Быстрые предложения, поддержка 24/7, прозрачная отчётность. Пафос, Кипр с 2006."
        : "IATA-accredited travel management for corporate teams and luxury leisure. Fast quotes, 24/7 support, compliant invoicing. Based in Paphos, Cyprus since 2006.",
    alternates: localizedAlternates(locale),
  };
}

export default function HomePage() {
  return (
    <>
      {/* Preload hero background image for faster LCP */}
      <link rel="preload" as="image" href="/images/hero-bg.jpg" />
      <HeroSection />
      <ServicesGrid />
      <TrustSection />
      <GoogleReviews />
      <ClientLogos />
      <CTABanner />
      <LocalBusinessSchema />
    </>
  );
}
