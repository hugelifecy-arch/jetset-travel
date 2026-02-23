import HeroSection from "@/components/sections/HeroSection";
import ServicesGrid from "@/components/sections/ServicesGrid";
import TrustSection from "@/components/sections/TrustSection";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ClientLogos from "@/components/sections/ClientLogos";
import CTABanner from "@/components/sections/CTABanner";

export const metadata = {
  title: "JetSet Travel Cyprus — Corporate & Luxury Travel Management",
  description:
    "IATA-accredited corporate and luxury travel management in Paphos, Cyprus. Fast quotes, clean invoicing, 24/7 support.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <TrustSection />
      <GoogleReviews />
      <ClientLogos />
      <CTABanner />
    </>
  );
}
