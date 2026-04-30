import { getLocale } from "next-intl/server";
import JsonLd from "./JsonLd";

interface ReviewData {
  author: string;
  reviewBody: string;
  ratingValue: number;
}

export default async function LocalBusinessSchema({
  reviews,
}: {
  reviews?: ReviewData[];
} = {}) {
  const locale = await getLocale();
  const isRussian = locale === "ru";

  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://www.jetset-travel.com/#organization",
    name: "JetSet Travel Cyprus",
    legalName: "JetSet K&K Travel Ltd",
    alternateName: [
      "JetSet K&K Travel Ltd",
      "ДжетСет Трэвел Кипр",
      "JetSet Travel",
    ],
    url: "https://www.jetset-travel.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.jetset-travel.com/images/jetset-logo.svg",
      width: 300,
      height: 60,
    },
    image: "https://www.jetset-travel.com/images/hero-bg.jpg",
    description: isRussian
      ? "Аккредитованное IATA корпоративное и премиальное туристическое агентство в Пафосе, Кипр. Бронирование авиабилетов, отелей, визовые услуги и управление корпоративными командировками 24/7. С 2006 года. Лицензия №7775."
      : "IATA-accredited corporate and luxury travel agency in Paphos, Cyprus. Flight booking, hotel reservations, visa services, and 24/7 corporate travel management. Established 2006. Tourism Licence 7775.",
    telephone: ["+357-99-478-073", "+357-99-310-993"],
    email: "info@jetset.com.cy",
    foundingDate: "2006",
    founder: [
      { "@type": "Person", name: "Nontari Kalaitsidis" },
      { "@type": "Person", name: "Maro Kokkinou" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: isRussian ? "Агапинорос 26А" : "26A Agapinoros",
      addressLocality: isRussian ? "Пафос" : "Paphos",
      postalCode: "8049",
      addressRegion: isRussian ? "Район Пафоса" : "Paphos District",
      addressCountry: "CY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.7604,
      longitude: 32.4224,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+357-99-478-073",
        contactType: "customer service",
        availableLanguage: ["English", "Russian", "Greek"],
        areaServed: ["CY", "GR", "RU", "AE", "GB"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+357-99-310-993",
        contactType: "reservations",
        availableLanguage: ["English", "Russian", "Greek"],
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "13:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"],
        opens: "15:00",
        closes: "18:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Wednesday", "Saturday"],
        opens: "09:00",
        closes: "13:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "65",
      bestRating: "5",
      worstRating: "1",
    },
    ...(reviews && reviews.length > 0
      ? {
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.ratingValue,
              bestRating: 5,
            },
            reviewBody: r.reviewBody,
            publisher: { "@type": "Organization", name: "Google Reviews" },
          })),
        }
      : {}),
    priceRange: "$$",
    paymentAccepted: isRussian
      ? "Банковский перевод, Кредитная карта, Дебетовая карта"
      : "Bank Transfer, Credit Card, Debit Card",
    currenciesAccepted: "EUR, USD, GBP, RUB",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 10 },
    knowsLanguage: ["en", "ru", "el"],
    areaServed: [
      { "@type": "City", name: isRussian ? "Пафос" : "Paphos" },
      { "@type": "City", name: isRussian ? "Лимассол" : "Limassol" },
      { "@type": "City", name: isRussian ? "Никосия" : "Nicosia" },
      { "@type": "City", name: isRussian ? "Ларнака" : "Larnaca" },
      { "@type": "Country", name: isRussian ? "Кипр" : "Cyprus" },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "IATA Accreditation",
        recognizedBy: {
          "@type": "Organization",
          name: "International Air Transport Association",
        },
        identifier: "14200130",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: isRussian ? "Туристическая лицензия Кипра" : "Cyprus Tourism Licence",
        recognizedBy: {
          "@type": "Organization",
          name: isRussian
            ? "Кипрская организация по туризму"
            : "Cyprus Tourism Organisation",
        },
        identifier: "7775",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isRussian ? "Туристические услуги" : "Travel Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Управление корпоративными командировками" : "Corporate Travel Management",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Бронирование авиабилетов" : "Flight Booking",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Бронирование отелей" : "Hotel Reservations",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Визовые услуги" : "Visa Services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Планирование премиального отдыха" : "Luxury Travel Planning",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Бронирование круизов" : "Cruise Booking",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Трансферы из аэропорта" : "Airport Transfers",
          },
        },
      ],
    },
    sameAs: [
      "https://www.facebook.com/JETSETCYPRUS/",
      "https://www.instagram.com/jetsetcyprus",
      "https://www.linkedin.com/company/jetsetcyprus",
      "https://wa.me/35799478073",
      "https://t.me/jetsetnotis",
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
  };

  return <JsonLd data={schema} />;
}
