import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata, SERVICE_LAST_UPDATED, REVIEW_AGGREGATE } from "@/lib/seo";
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
        ? "Бронирование Круизов Кипр | Средиземноморские Круизы из Пафоса — JetSet Travel"
        : "Cruise Booking Cyprus | Mediterranean Cruises from Paphos — JetSet Travel",
    description:
      locale === "ru"
        ? "Бронируйте средиземноморские круизы с Кипра. Эксклюзивные предложения на люкс и семейные круизы из Лимассола и региональных портов. Аккредитация IATA."
        : "Book Mediterranean cruises from Cyprus. Exclusive deals on luxury and family cruises departing from Limassol and regional ports. IATA-accredited agency.",
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
        description="Book worldwide cruises on Royal Caribbean, MSC, Norwegian, Celebrity, Disney and 50+ cruise lines. Caribbean, Mediterranean, Alaska, Asia and beyond. IATA-accredited cruise specialists."
        url={`https://www.jetset-travel.com/${locale}/cruises`}
        serviceType="Cruise Booking Service"
        dateModified={SERVICE_LAST_UPDATED}
        aggregateRating={REVIEW_AGGREGATE}
      />
      <TouristTripSchema
        name={
          locale === "ru"
            ? "Средиземноморский круиз из Лимассола"
            : "Mediterranean Cruise from Limassol"
        }
        description={
          locale === "ru"
            ? "Круизы по Средиземному морю из порта Лимассол. Греческие острова, Италия, Святая Земля. Бронирование Royal Caribbean, MSC, Celestyal через JetSet Travel."
            : "Mediterranean cruises departing from Limassol Port. Greek Islands, Italy, Holy Land routes booked on Royal Caribbean, MSC, Celestyal via JetSet Travel Cyprus."
        }
        url={`https://www.jetset-travel.com/${locale}/cruises`}
        image="https://www.jetset-travel.com/images/destinations/med.jpg"
        touristType={["Mediterranean", "Greek Islands", "Italy", "Cyprus"]}
        itinerary={[
          { name: locale === "ru" ? "Лимассол, Кипр" : "Limassol, Cyprus" },
          { name: locale === "ru" ? "Греческие острова" : "Greek Islands" },
          { name: locale === "ru" ? "Италия" : "Italy" },
          { name: locale === "ru" ? "Святая Земля" : "Holy Land" },
        ]}
        validFrom="2026-01-01"
        validThrough="2026-12-31"
      />
    </>
  );
}
