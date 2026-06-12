import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import FlightPageContent from "./FlightPageContent";

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
    routePath: "/flight-tickets-cyprus",
    title:
      locale === "ru"
        ? "Авиабилеты Кипр | Пафос и Ларнака — JetSet Travel"
        : "Flights from Cyprus | Paphos & Larnaca — JetSet",
    description:
      locale === "ru"
        ? "Бронируйте авиабилеты из Кипра с IATA-аккредитованным агентством JetSet Travel. Лучшие тарифы из аэропортов Пафоса (PFO) и Ларнаки (LCA). Бизнес-класс, групповые бронирования."
        : "Book flights from Cyprus with IATA-accredited JetSet Travel. Best fares from Paphos (PFO) and Larnaca (LCA) airports. Business class deals, group bookings.",
    keywords:
      locale === "ru"
        ? ["авиабилеты Кипр", "авиабилеты из Пафоса", "авиабилеты Ларнака", "дешёвые билеты Кипр", "бронирование авиабилетов", "авиабилеты Пафос"]
        : ["flights from Cyprus", "Paphos airport flights", "Larnaca airport flights", "cheap flights Cyprus", "flight booking", "flight booking Paphos corporate"],
    languagePaths,
  });
}

export default async function FlightTicketsCyprusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Off-locale visits (/ru/flight-tickets-cyprus/) are 308-redirected at the
  // edge via next.config.ts → we always reach this page as English.
  return <FlightPageContent locale={locale} />;
}
