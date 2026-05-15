import JsonLd from "./JsonLd";

export default function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.jetset-travel.com/#website",
    name: "JetSet Travel Cyprus",
    alternateName: ["JetSet K&K Travel Ltd", "ДжетСет Трэвел Кипр"],
    url: "https://www.jetset-travel.com/",
    description:
      "IATA-accredited corporate and luxury travel agency in Paphos, Cyprus. Flights, hotels, visas, cruises, and corporate travel management.",
    inLanguage: ["en", "ru"],
    publisher: {
      "@id": "https://www.jetset-travel.com/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.jetset-travel.com/en/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={schema} />;
}
