import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/bronirovanie-otelej-kipr",
    title:
      locale === "ru"
        ? "Бронирование Отелей Кипр | Корпоративные Тарифы — JetSet Travel"
        : "Hotel Booking Cyprus | Corporate & Leisure Rates — JetSet Travel",
    description:
      locale === "ru"
        ? "Бронирование отелей на Кипре и по всему миру. Корпоративные тарифы, люкс отели. Чистые счета. JetSet Travel Пафос."
        : "Hotel reservations in Cyprus and worldwide. Negotiated corporate rates, luxury hotel partners. Clean invoicing.",
    languagePaths: {
      en: "/hotel-booking-cyprus",
      ru: "/bronirovanie-otelej-kipr",
    },
  });
}

export default async function BronirovanieOtelejKiprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  redirect(`/${locale}/hotel-booking-cyprus`);
}
