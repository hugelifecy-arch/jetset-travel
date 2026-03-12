import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { redirect } from "next/navigation";
import FlightPageContent from "../flight-tickets-cyprus/FlightPageContent";

const languagePaths = {
  en: "/flight-tickets-cyprus",
  ru: "/aviabilety-kipr",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/aviabilety-kipr",
    title:
      locale === "ru"
        ? "Авиабилеты из Кипра | Рейсы из Пафоса и Ларнаки — JetSet Travel"
        : "Flight Tickets from Cyprus | Paphos & Larnaca Flights — JetSet Travel",
    description:
      locale === "ru"
        ? "Бронирование авиабилетов из Кипра с аккредитацией IATA. Лучшие цены из Пафоса (PFO) и Ларнаки (LCA). Бизнес-класс, групповое бронирование."
        : "Book flights from Cyprus with IATA-accredited JetSet Travel. Best fares from Paphos (PFO) and Larnaca (LCA) airports.",
    languagePaths,
  });
}

export default async function AviabiletyKiprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== "ru") {
    redirect(`/${locale}/flight-tickets-cyprus`);
  }

  return <FlightPageContent locale={locale} />;
}
