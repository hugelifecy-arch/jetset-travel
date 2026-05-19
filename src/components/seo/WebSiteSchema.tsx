import JsonLd from "./JsonLd";

export default function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.jetset-travel.com/#website",
    name: "JetSet Travel Cyprus",
    alternateName: ["JetSet K&K Travel Ltd", "ДжетСет Трэвел Кипр"],
    url: "https://www.jetset-travel.com/en",
    description:
      "IATA-accredited corporate and luxury travel agency in Paphos, Cyprus. Flights, hotels, visas, cruises, and corporate travel management.",
    inLanguage: ["en", "ru"],
    publisher: {
      "@id": "https://www.jetset-travel.com/#organization",
    },
    // Sitelinks search box. The `target` MUST be an EntryPoint object — when
    // emitted as a bare string Google fetches the literal placeholder URL
    // ".../blog?q={search_term_string}" as a real crawl, surfacing as a 5xx
    // or "Page with redirect" entry in GSC. See:
    // https://developers.google.com/search/docs/appearance/sitelinks-search-box
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://www.jetset-travel.com/en/blog?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={schema} />;
}
