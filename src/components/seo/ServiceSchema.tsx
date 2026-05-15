import JsonLd from "./JsonLd";

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  locale?: string;
  serviceType?: string;
  dateModified?: string;
  /**
   * Optional aggregateRating attached directly to this Service so the page
   * is eligible for Review-snippet rich results on its own URL (rather than
   * relying on the homepage TravelAgency rating, which Google scopes to /).
   * Source must be a real published rating (Google Business Profile total)
   * — never invent numbers. Phase 6 Step 50.
   */
  aggregateRating?: {
    ratingValue: number | string;
    reviewCount: number | string;
    bestRating?: number | string;
    worstRating?: number | string;
  };
}

export default function ServiceSchema({
  name,
  description,
  url,
  locale = "en",
  serviceType,
  dateModified,
  aggregateRating,
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
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: String(aggregateRating.ratingValue),
        reviewCount: String(aggregateRating.reviewCount),
        bestRating: String(aggregateRating.bestRating ?? 5),
        worstRating: String(aggregateRating.worstRating ?? 1),
      },
    }),
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
