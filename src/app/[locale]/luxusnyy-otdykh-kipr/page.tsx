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
    routePath: "/luxusnyy-otdykh-kipr",
    title:
      locale === "ru"
        ? "Люкс Отдых Кипр | Премиум Путешествия — JetSet Travel Пафос"
        : "Luxury Travel Agency Cyprus | Premium Holidays — JetSet Travel",
    description:
      locale === "ru"
        ? "Планирование люкс путешествий с Кипра. Отели высшего класса, приватные трансферы, индивидуальные маршруты. Ваш премиум партнёр с 2006 года."
        : "Luxury travel planning from Cyprus. 5-star hotels, private transfers, bespoke itineraries, honeymoon packages.",
    keywords:
      locale === "ru"
        ? ["люкс отдых Кипр Пафос", "премиальные путешествия Пафос", "VIP туры Кипр", "элитный отдых из Кипра"]
        : ["luxury travel Cyprus", "luxury holidays from Paphos", "premium holidays Paphos", "VIP tours Cyprus"],
    languagePaths: {
      en: "/luxury-travel-cyprus",
      ru: "/luxusnyy-otdykh-kipr",
    },
  });
}

export default async function LuxusnyyOtdykhKiprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  redirect(`/${locale}/luxury-travel-cyprus`);
}
