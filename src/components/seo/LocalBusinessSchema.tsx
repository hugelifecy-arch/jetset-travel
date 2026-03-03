import { getLocale } from "next-intl/server";
import JsonLd from "./JsonLd";

export default async function LocalBusinessSchema() {
  const locale = await getLocale();
  const isRussian = locale === "ru";

  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "JetSet Travel Cyprus",
    alternateName: ["JetSet K&K Travel Ltd", "\u0414\u0436\u0435\u0442\u0421\u0435\u0442 \u0422\u0440\u044D\u0432\u0435\u043B \u041A\u0438\u043F\u0440"],
    url: "https://www.jetset-travel.com",
    logo: "https://www.jetset-travel.com/images/jetset-logo.svg",
    image: "https://www.jetset-travel.com/images/hero-bg.jpg",
    description: isRussian
      ? "\u0410\u043A\u043A\u0440\u0435\u0434\u0438\u0442\u043E\u0432\u0430\u043D\u043D\u043E\u0435 IATA \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u0435 \u0438 \u043F\u0440\u0435\u043C\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u0442\u0443\u0440\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0430\u0433\u0435\u043D\u0442\u0441\u0442\u0432\u043E \u0432 \u041F\u0430\u0444\u043E\u0441\u0435, \u041A\u0438\u043F\u0440. \u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0430\u0432\u0438\u0430\u0431\u0438\u043B\u0435\u0442\u043E\u0432, \u043E\u0442\u0435\u043B\u0435\u0439, \u0432\u0438\u0437\u043E\u0432\u044B\u0435 \u0443\u0441\u043B\u0443\u0433\u0438 \u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u043C\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u0438\u0440\u043E\u0432\u043A\u0430\u043C\u0438 24/7."
      : "IATA-accredited corporate and luxury travel agency in Paphos, Cyprus. Flight booking, hotel reservations, visa services, and 24/7 corporate travel management.",
    telephone: ["+357-99-478-073", "+357-99-310-993"],
    email: "info@jetset.com.cy",
    address: {
      "@type": "PostalAddress",
      streetAddress: "26A Agapinoros",
      addressLocality: "Paphos",
      postalCode: "8049",
      addressRegion: "Paphos District",
      addressCountry: "CY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.7604,
      longitude: 32.4224,
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
    ],
    priceRange: "$$",
    foundingDate: "2006",
    numberOfEmployees: { "@type": "QuantitativeValue", value: "10+" },
    areaServed: [
      { "@type": "City", name: "Paphos" },
      { "@type": "City", name: "Limassol" },
      { "@type": "City", name: "Nicosia" },
      { "@type": "City", name: "Larnaca" },
      { "@type": "Country", name: "Cyprus" },
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
            name: "Flight Booking",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hotel Reservations",
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
            name: "Luxury Travel Planning",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Cruise Booking",
          },
        },
      ],
    },
    sameAs: [
      "https://wa.me/35799478073",
      "https://t.me/jetsetnotis",
    ],
  };

  return <JsonLd data={schema} />;
}
