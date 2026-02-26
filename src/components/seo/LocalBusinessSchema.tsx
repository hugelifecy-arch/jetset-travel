// TODO: Set up Google Business Profile at business.google.com
// - Claim listing, add services/hours/photos
// - Enable and respond to reviews
// - This is critical for local SEO

import JsonLd from "./JsonLd";

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "JetSet Travel Cyprus",
    alternateName: "JetSet K&K Travel Ltd",
    url: "https://www.jetset-travel.com",
    logo: "https://www.jetset-travel.com/images/jetset-logo.svg",
    image: "https://www.jetset-travel.com/images/jetset-og-image.jpg",
    description:
      "IATA-accredited corporate and luxury travel management agency in Paphos, Cyprus. Specializing in corporate travel, luxury leisure, visa services, and hotel bookings.",
    telephone: ["+357-99-478-073", "+357-99-310-993", "+357-26-911-095"],
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
      latitude: 34.7553,
      longitude: 32.4225,
    },
    openingHours: "Mo-Fr 09:00-18:30",
    priceRange: "$$",
    currenciesAccepted: "EUR, USD, GBP, RUB",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    areaServed: [
      { "@type": "Country", name: "Cyprus" },
      { "@type": "City", name: "Paphos" },
      { "@type": "City", name: "Limassol" },
      { "@type": "City", name: "Nicosia" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Travel Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Corporate Travel Management",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Luxury Leisure Travel",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Visa Services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hotel Reservations",
          },
        },
      ],
    },
    sameAs: [
      "https://www.facebook.com/jetsettravelcyprus",
      "https://wa.me/35799478073",
    ],
    foundingDate: "2006",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 5,
      maxValue: 15,
    },
    memberOf: [
      {
        "@type": "Organization",
        name: "IATA",
        url: "https://www.iata.org",
      },
      {
        "@type": "Organization",
        name: "Cyprus Tourism Organisation",
      },
    ],
  };

  return <JsonLd data={schema} />;
}
