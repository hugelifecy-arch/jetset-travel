import JsonLd from "./JsonLd";

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "JetSet Travel Cyprus",
    legalName: "JetSet K&K Travel Ltd",
    url: "https://www.jetset-travel.com",
    logo: "https://www.jetset-travel.com/images/jetset-logo.svg",
    description:
      "IATA-accredited corporate and luxury travel management agency based in Paphos, Cyprus.",
    telephone: ["+357-99-478-073", "+357-99-310-993"],
    email: "info@jetset.com.cy",
    address: {
      "@type": "PostalAddress",
      streetAddress: "26A Agapinoros",
      addressLocality: "Paphos",
      postalCode: "8049",
      addressCountry: "CY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.772,
      longitude: 32.4246,
    },
    openingHours: "Mo-Fr 09:00-18:30",
    sameAs: ["https://wa.me/35799478073", "https://t.me/jetsetnotis"],
  };

  return <JsonLd data={schema} />;
}
