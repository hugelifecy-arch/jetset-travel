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
    routePath: "/vizovye-uslugi-kipr",
    title:
      locale === "ru"
        ? "Визовые Услуги Кипр | Шенгенская Виза Пафос — JetSet Travel"
        : "Visa Services Cyprus | Schengen & Business Visa Assistance — JetSet Travel",
    description:
      locale === "ru"
        ? "Профессиональные визовые услуги в Пафосе, Кипр. Шенгенская виза, UK, US, бизнес виза. Подготовка документов. Бесплатная консультация."
        : "Professional visa services in Paphos, Cyprus. Schengen visa, UK visa, US visa, business & tourist visa assistance.",
    keywords:
      locale === "ru"
        ? ["визовые услуги Кипр", "виза на Кипр для россиян 2026", "шенгенская виза Пафос", "как оформить визу на Кипр из России 2026", "визовая помощь Пафос"]
        : ["visa services Cyprus Paphos", "visa support for business trips to Cyprus", "Schengen visa application", "business visa Cyprus"],
    languagePaths: {
      en: "/visa-services-cyprus",
      ru: "/vizovye-uslugi-kipr",
    },
  });
}

export default async function VizovyeUslugiKiprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  redirect(`/${locale}/visa-services-cyprus`);
}
