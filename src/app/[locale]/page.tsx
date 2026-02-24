import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ServicesGrid from "@/components/sections/ServicesGrid";
import TrustSection from "@/components/sections/TrustSection";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ClientLogos from "@/components/sections/ClientLogos";
import CTABanner from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Corporate & Luxury Travel Management in Paphos, Cyprus",
  description:
    "IATA-accredited corporate and luxury travel management in Paphos, Cyprus. Fast quotes, clean invoicing, 24/7 support, visa services, and hotel reservations.",
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
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:00",
                closes: "18:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Saturday",
                opens: "10:00",
                closes: "14:00",
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
