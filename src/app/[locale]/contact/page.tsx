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
        ? "Контакты JetSet Travel Кипр | Бесплатная консультация | Запросить предложение"
        : "Contact JetSet Travel Cyprus | Book a Free Consultation | Get a Quote",
    description:
      locale === "ru"
        ? "Закажите бесплатную консультацию по корпоративным поездкам или запросите предложение. WhatsApp, телефон или форма. Ответ в течение 2 рабочих часов."
        : "Book a free corporate travel consultation or request a quote. WhatsApp, call, or fill out our form. Response within 2 business hours.",
  });
}

export default function ContactPage() {
  return <ContactContent />;
}
