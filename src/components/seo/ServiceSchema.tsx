import JsonLd from "./JsonLd";

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  locale?: string;
  serviceType?: string;
  dateModified?: string;
}

export default function ServiceSchema({
  name,
  description,
  url,
  locale = "en",
  serviceType,
  dateModified,
}: ServiceSchemaProps) {
  const isRussian = locale === "ru";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    ...(serviceType && { serviceType }),
    ...(dateModified && { dateModified }),
    provider: {
      "@id": "https://www.jetset-travel.com/#organization",
    },
    areaServed: [
      { "@type": "City", name: isRussian ? "Пафос" : "Paphos" },
      { "@type": "City", name: isRussian ? "Лимассол" : "Limassol" },
      { "@type": "City", name: isRussian ? "Никосия" : "Nicosia" },
      { "@type": "City", name: isRussian ? "Ларнака" : "Larnaca" },
      { "@type": "Country", name: isRussian ? "Кипр" : "Cyprus" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://www.jetset-travel.com",
      servicePhone: "+357-99-478-073",
      availableLanguage: [
        { "@type": "Language", name: "English" },
        { "@type": "Language", name: "Russian" },
      ],
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        description: isRussian
          ? "Индивидуальное предложение — запросите бесплатную смету"
          : "Custom quote — request a free, no-obligation estimate",
      },
      availability: "https://schema.org/InStock",
      url,
    },
  };

  return <JsonLd data={schema} />;
}
