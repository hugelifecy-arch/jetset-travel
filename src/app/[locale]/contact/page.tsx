import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata, CANONICAL_ORIGIN, REVIEW_AGGREGATE } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import ContactContent from "./ContactContent";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/contact",
    title:
      locale === "ru"
        ? "Контакты JetSet Travel Пафос | Бесплатная Заявка"
        : "Contact JetSet Travel Paphos | Free Quote",
    description:
      locale === "ru"
        ? "Свяжитесь с JetSet Travel в Пафосе, Кипр. Бесплатные предложения, поддержка WhatsApp, корпоративные консультации. Звоните +357 99 478 073 или посетите 26A Agapinoros, Пафос."
        : "Contact JetSet Travel in Paphos, Cyprus. Free travel quotes, WhatsApp support, corporate travel consultations. Call +357 99 478 073 or visit 26A Agapinoros, Paphos.",
    keywords:
      locale === "ru"
        ? ["контакты JetSet Travel", "турагентство Пафос адрес", "связаться с турагентством Кипр", "бесплатная консультация"]
        : ["contact JetSet Travel", "travel agency Paphos address", "contact travel agent Cyprus", "free consultation"],
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name:
      locale === "ru"
        ? "Контакты JetSet Travel"
        : "Contact JetSet Travel",
    url: `${CANONICAL_ORIGIN}/${locale}/contact`,
    mainEntity: {
      "@type": "TravelAgency",
      name: "JetSet Travel Cyprus",
      url: "https://www.jetset-travel.com",
      telephone: ["+357-99-478-073", "+357-99-310-993"],
      email: "info@jetset.com.cy",
      address: {
        "@type": "PostalAddress",
        streetAddress: "26A Agapinoros",
        addressLocality: "Paphos",
        postalCode: "8049",
        addressCountry: "CY",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+357-99-478-073",
          contactType: "customer service",
          areaServed: ["CY", "GR", "RU", "AE", "GB"],
          availableLanguage: ["English", "Russian", "Greek"],
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
        },
        {
          "@type": "ContactPoint",
          telephone: "+357-99-478-073",
          contactType: "emergency",
          contactOption: "TollFree",
          description: "24/7 WhatsApp support for travel disruptions",
          availableLanguage: ["English", "Russian"],
        },
      ],
      openingHoursSpecification: {
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
      // Phase 6 Step 50: aggregateRating on /contact so the page becomes
      // eligible for Review-snippet rich results on its own URL. Sourced
      // from the same Google Business Profile total as LocalBusinessSchema.
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: REVIEW_AGGREGATE.ratingValue,
        reviewCount: REVIEW_AGGREGATE.reviewCount,
        bestRating: "5",
        worstRating: "1",
      },
    },
  };

  return (
    <>
      <JsonLd data={contactPageSchema} />
      <ContactContent />
    </>
  );
}
