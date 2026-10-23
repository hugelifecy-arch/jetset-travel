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
        ? "Круизы с Кипра: круизы с перелётом из Афин, Венеции, Рима и Барселоны с вылетом из Ларнаки или Пафоса и лайнеры с заходом в Лимассол. Аккредитация IATA."
        : "Book cruises from Cyprus: fly-cruises from Athens, Venice, Rome and Barcelona with flights from Larnaca or Paphos, and ships that call at Limassol.",
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
            ? "Круиз по греческим островам с перелётом с Кипра"
            : "Greek Islands Fly-Cruise from Cyprus"
        }
        description={
          locale === "ru"
            ? "Перелёт из Ларнаки или Пафоса в Афины и круиз по греческим островам из Пирея (например, 3- и 4-ночные круизы Celestyal, март–ноябрь) — через JetSet Travel. В 2026 году Marella Discovery также выполняла круизы из Лимассола (апрель — начало ноября); на 2027 год такие круизы пока не объявлены."
            : "Flights from Larnaca or Paphos to Athens with a Greek islands cruise from Piraeus (for example Celestyal's 3- and 4-night cruises, March–November), booked through JetSet Travel. In 2026 Marella Discovery also ran round trips from Limassol (April to early November); none have been announced for 2027 yet."
        }
        url={`https://www.jetset-travel.com/${locale}/cruises`}
        image="https://www.jetset-travel.com/images/destinations/med.jpg"
        touristType={["Mediterranean", "Greek Islands", "Cyprus"]}
        itinerary={[
          {
            name: locale === "ru" ? "Ларнака или Пафос, Кипр" : "Larnaca or Paphos, Cyprus",
            description: locale === "ru" ? "Перелёт в Афины" : "Flight to Athens",
          },
          { name: locale === "ru" ? "Афины (Пирей)" : "Athens (Piraeus)" },
          {
            name: locale === "ru" ? "Греческие острова" : "Greek Islands",
            description: locale === "ru" ? "Например, Миконос, Санторини, Крит" : "For example Mykonos, Santorini, Crete",
          },
          { name: locale === "ru" ? "Афины (Пирей)" : "Athens (Piraeus)" },
        ]}
      />
    </>
  );
}
