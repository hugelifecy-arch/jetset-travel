import JsonLd from "./JsonLd";

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
}

export default function ServiceSchema({
  name,
  description,
  url,
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "TravelAgency",
      name: "JetSet Travel Cyprus",
      url: "https://www.jetset-travel.com",
      telephone: ["+357-99-478-073", "+357-99-310-993"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "26A Agapinoros",
        addressLocality: "Paphos",
        postalCode: "8049",
        addressRegion: "Paphos District",
        addressCountry: "CY",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Cyprus",
    },
  };

  return <JsonLd data={schema} />;
}
