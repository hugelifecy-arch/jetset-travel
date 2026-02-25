import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/seo";
import ContactContent from "./ContactContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      absolute:
        locale === "ru"
          ? "Контакты JetSet Travel Пафос | Ответ в течение 24 часов"
          : "Contact JetSet Travel Paphos | Get a Quote Within 24 Hours",
    },
    description:
      locale === "ru"
        ? "Запросите предложение на корпоративные или частные поездки. WhatsApp, телефон, email или форма на сайте. 26A Agapinoros, Пафос, Кипр."
        : "Request a corporate or leisure travel quote. Reach us via WhatsApp, phone, email, or our contact form. 26A Agapinoros, Paphos, Cyprus.",
    alternates: localizedAlternates(locale, "/contact"),
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
