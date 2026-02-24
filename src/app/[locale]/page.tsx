import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/seo";
import HeroSection from "@/components/sections/HeroSection";
import ServicesGrid from "@/components/sections/ServicesGrid";
import TrustSection from "@/components/sections/TrustSection";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ClientLogos from "@/components/sections/ClientLogos";
import CTABanner from "@/components/sections/CTABanner";

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
    alternates: localizedAlternates(locale, ""),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "JetSet Travel Cyprus",
            url: "https://www.jetset-travel.com",
            telephone: "+357-99-478-073",
            address: {
              "@type": "PostalAddress",
              streetAddress: "26A Agapinoros",
              addressLocality: "Paphos",
              postalCode: "8049",
              addressCountry: "CY",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "13:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"],
                opens: "15:00",
                closes: "18:30",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Wednesday", "Saturday"],
                opens: "09:00",
                closes: "13:00",
              },
            ],
            hasCredential: {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "IATA Accreditation",
              name: "IATA Accredited Agent",
            },
            sameAs: [
              "https://wa.me/35799478073",
              "https://t.me/jetsetnotis",
            ],
          }),
        }}
      />
    </>
  );
}
