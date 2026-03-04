import JsonLd from "./JsonLd";

export default function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JetSet Travel Cyprus",
    alternateName: "JetSet K&K Travel Ltd",
    url: "https://www.jetset-travel.com",
    inLanguage: ["en", "ru"],
    publisher: {
      "@type": "Organization",
      name: "JetSet Travel Cyprus",
      url: "https://www.jetset-travel.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.jetset-travel.com/images/jetset-logo.svg",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.jetset-travel.com/en/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={schema} />;
}
