import type { Metadata } from "next";
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
    title: "Corporate & Luxury Travel Management in Paphos, Cyprus",
    description:
      "IATA-accredited corporate and luxury travel management in Paphos, Cyprus. Fast quotes, clean invoicing, 24/7 support, visa services, and hotel reservations.",
  };
}

export default function HomePage() {
  return (
    <>
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
