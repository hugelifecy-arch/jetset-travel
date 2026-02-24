export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "JetSet Travel Cyprus",
    image: "https://www.jetset-travel.com/logo.png",
    telephone: "+357 99478073",
    address: {
      "@type": "PostalAddress",
      streetAddress: "26A Agapinoros Street",
      addressLocality: "Paphos",
      postalCode: "8049",
      addressCountry: "CY",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
