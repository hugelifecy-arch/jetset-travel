import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CookieConsentBanner from "@/components/cookies/CookieConsentBanner";
import { CANONICAL_ORIGIN, localizedAlternates } from "@/lib/seo";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { HtmlLangSetter } from "./HtmlLangSetter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isRussian = locale === "ru";

  return {
    title: {
      template: "%s | JetSet Travel Cyprus",
      default: isRussian
        ? "JetSet Travel Cyprus — Премиум Туристические Услуги"
        : "JetSet Travel Cyprus — Premium Travel Services",
    },
    description: isRussian
      ? "Аккредитованное IATA туристическое агентство в Пафосе, Кипр. Корпоративные путешествия, элитный отдых, визовые услуги и бронирование отелей."
      : "IATA-accredited travel agency in Paphos, Cyprus offering corporate travel management, luxury holidays, visa services, and hotel reservations.",
    openGraph: {
      type: "website",
      locale: isRussian ? "ru_RU" : "en_GB",
      siteName: "JetSet Travel Cyprus",
      url: `${CANONICAL_ORIGIN}/${locale}`,
      title: isRussian
        ? "JetSet Travel Cyprus — Премиум Туристические Услуги"
        : "JetSet Travel Cyprus — Premium Travel Services",
      description: isRussian
        ? "Аккредитованное IATA туристическое агентство в Пафосе, Кипр."
        : "IATA-accredited travel agency in Paphos, Cyprus offering corporate travel management, luxury holidays, visa services, and hotel reservations.",
      images: [
        {
          url: "https://www.jetset-travel.com/images/jetset-og-image.jpg",
          width: 1200,
          height: 630,
          alt: "JetSet Travel Cyprus",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isRussian
        ? "JetSet Travel Cyprus — Премиум Туристические Услуги"
        : "JetSet Travel Cyprus — Premium Travel Services",
      description: isRussian
        ? "Аккредитованное IATA туристическое агентство в Пафосе, Кипр."
        : "IATA-accredited travel agency in Paphos, Cyprus offering corporate travel management, luxury holidays, visa services, and hotel reservations.",
      images: ["https://www.jetset-travel.com/images/jetset-og-image.jpg"],
    },
    alternates: localizedAlternates(locale),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLangSetter locale={locale} />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BreadcrumbSchema />
      <CookieConsentBanner />
    </NextIntlClientProvider>
  );
}
