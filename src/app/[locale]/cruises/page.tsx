import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata, SERVICE_LAST_UPDATED } from "@/lib/seo";
import CruisesContent from "./CruisesContent";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import RelatedArticles from "@/components/sections/RelatedArticles";
import FeaturedBlogPost from "@/components/sections/FeaturedBlogPost";
import ServiceSchema from "@/components/seo/ServiceSchema";
import TouristTripSchema from "@/components/seo/TouristTripSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/cruises",
    title:
      locale === "ru"
        ? "Бронирование Круизов Кипр | Средиземноморские и Мировые Круизы — JetSet Travel"
        : "Cruise Booking Cyprus | Mediterranean & World Cruises — JetSet Travel",
    description:
      locale === "ru"
        ? "Круизы с Кипра: летние круизы из Лимассола или круизы с перелётом из Афин, Рима и Барселоны с вылетом из Ларнаки или Пафоса. Аккредитация IATA."
        : "Book cruises from Cyprus: summer round trips from Limassol, or fly-cruises from Athens, Rome and Barcelona with flights from Larnaca or Paphos.",
    keywords:
      locale === "ru"
        ? ["круизы из Кипра", "средиземноморские круизы", "бронирование круизов Лимассол", "морские круизы Кипр", "круизы из Лимассола 2026"]
        : ["cruise booking Cyprus", "Mediterranean cruises", "cruise from Limassol", "cruise holidays Cyprus", "cruises from Limassol 2026"],
  });
}

export default async function CruisesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CruisesContent locale={locale} />
      <FeaturedBlogPost
        locale={locale}
        enSlug="cruises-from-limassol-2026"
        ruSlug="luchshie-kruizy-iz-limassola-2026"
      />
      <RelatedArticles locale={locale} tags={["cruise", "cruises", "limassol", "luxury"]} />
      <ServicesCrossLinks locale={locale} include={["luxury", "hotels"]} />
      <ServiceSchema
        locale={locale}
        name="Cruise Booking"
        description="Cruise bookings with major lines including Royal Caribbean, MSC, Norwegian, Celebrity and Disney, with flights from Larnaca or Paphos and hotels arranged by JetSet Travel, an IATA-accredited travel agency in Paphos."
        url={`https://www.jetset-travel.com/${locale}/cruises`}
        serviceType="Cruise Booking Service"
        dateModified={SERVICE_LAST_UPDATED}
      />
      <TouristTripSchema
        name={
          locale === "ru"
            ? "Средиземноморский круиз из Лимассола"
            : "Mediterranean Cruise from Limassol"
        }
        description={
          locale === "ru"
            ? "Летние круизы из Лимассола (в 2026 году — Marella Discovery II, апрель–ноябрь) к греческим островам, в Афины (Пирей) и Кушадасы (Турция), а также круизы с перелётом из Афин и других портов Средиземноморья — через JetSet Travel."
            : "Summer round-trip cruises from Limassol (in 2026 on Marella Discovery II, April–November) to the Greek islands, Athens (Piraeus) and Kusadasi in Turkey, plus fly-cruises from Athens and other Mediterranean ports, booked through JetSet Travel."
        }
        url={`https://www.jetset-travel.com/${locale}/cruises`}
        image="https://www.jetset-travel.com/images/destinations/med.jpg"
        touristType={["Mediterranean", "Greek Islands", "Cyprus"]}
        itinerary={[
          { name: locale === "ru" ? "Лимассол, Кипр" : "Limassol, Cyprus" },
          {
            name: locale === "ru" ? "Греческие острова" : "Greek Islands",
            description: locale === "ru" ? "Родос, Крит, Миконос" : "Rhodes, Crete, Mykonos",
          },
          { name: locale === "ru" ? "Афины (Пирей)" : "Athens (Piraeus)" },
          { name: locale === "ru" ? "Кушадасы, Турция" : "Kusadasi, Turkey" },
        ]}
      />
    </>
  );
}
