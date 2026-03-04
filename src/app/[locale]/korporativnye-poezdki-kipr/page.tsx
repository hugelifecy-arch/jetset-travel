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
    routePath: "/korporativnye-poezdki-kipr",
    title:
      locale === "ru"
        ? "Корпоративные Поездки Кипр | Деловой Туризм — JetSet Travel"
        : "Corporate Travel Agency Cyprus | Business Travel Management — JetSet Travel",
    description:
      locale === "ru"
        ? "Управление корпоративными поездками на Кипре. Бронирование, чистые счета, поддержка 24/7. IATA. Пафос, Лимассол, Никосия, Ларнака."
        : "Corporate travel management across Cyprus. Policy-compliant bookings, 24/7 disruption support, clean invoicing. IATA accredited.",
    languagePaths: {
      en: "/corporate-travel-cyprus",
      ru: "/korporativnye-poezdki-kipr",
    },
  });
}

export default async function KorporativnyePoezdkiKiprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  redirect(`/${locale}/corporate-travel-cyprus`);
}
