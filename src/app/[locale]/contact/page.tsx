import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import ContactContent from "./ContactContent";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/contact",
    title:
      locale === "ru"
        ? "Контакты JetSet Travel Пафос | Бесплатное предложение — Турагентство Кипр"
        : "Contact JetSet Travel Paphos | Get a Free Quote — Cyprus Travel Agency",
    description:
      locale === "ru"
        ? "Свяжитесь с JetSet Travel в Пафосе, Кипр. Бесплатные предложения, поддержка WhatsApp, корпоративные консультации. Звоните +357 99 478 073 или посетите 26A Agapinoros, Пафос."
        : "Contact JetSet Travel in Paphos, Cyprus. Free travel quotes, WhatsApp support, corporate travel consultations. Call +357 99 478 073 or visit 26A Agapinoros, Paphos.",
  });
}

export default function ContactPage() {
  return <ContactContent />;
}
