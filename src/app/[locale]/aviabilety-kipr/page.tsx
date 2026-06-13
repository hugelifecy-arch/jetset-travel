import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
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
    keywords:
      locale === "ru"
        ? ["авиабилеты Кипр", "авиабилеты Пафос", "авиабилеты из Пафоса", "авиабилеты Ларнака", "бронирование авиабилетов"]
        : ["flights from Cyprus", "Paphos airport flights", "flight booking Paphos corporate", "Larnaca airport flights"],
    languagePaths,
  });
}

export default async function AviabiletyKiprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Off-locale visits (/en/aviabilety-kipr/) are 308-redirected at the edge
  // via next.config.ts → we always reach this page as Russian.
  return <FlightPageContent locale={locale} />;
}
