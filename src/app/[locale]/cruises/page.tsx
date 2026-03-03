import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import CruisesContent from "./CruisesContent";

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
        ? "Круизы по всему миру | Все круизные линии, все направления | JetSet Travel Кипр"
        : "Worldwide Cruises | Book Any Cruise Line, Any Destination | JetSet Travel Cyprus",
    description:
      locale === "ru"
        ? "Бронирование круизов по всему миру на Royal Caribbean, MSC, Norwegian, Celebrity, Disney и 50+ круизных линиях. Карибы, Средиземноморье, Аляска, Азия. Аккредитация IATA. Бесплатные предложения."
        : "Book worldwide cruises on Royal Caribbean, MSC, Norwegian, Celebrity, Disney and 50+ cruise lines. Caribbean, Mediterranean, Alaska, Asia and beyond. IATA-accredited cruise specialists. Free quotes.",
  });
}

export default async function CruisesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <CruisesContent locale={locale} />;
}
