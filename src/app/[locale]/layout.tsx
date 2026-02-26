import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/layout/Header";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileActionBar from "@/components/layout/MobileActionBar";
import CookieConsentBanner from "@/components/cookies/CookieConsentBanner";
import { CANONICAL_ORIGIN, OG_IMAGE } from "@/lib/seo";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import "../globals.css";

const dmSans = localFont({
  src: [
    {
      path: "../../fonts/dm-sans-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = localFont({
  src: [
    {
      path: "../../fonts/playfair-display-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../../fonts/playfair-display-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }];
}

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
      locale: isRussian ? "ru_CY" : "en_CY",
      alternateLocale: isRussian ? "en_CY" : "ru_CY",
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
          url: OG_IMAGE,
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
      images: [OG_IMAGE],
    },
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://maps.google.com" />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-md focus-visible:bg-brand-navy focus-visible:px-4 focus-visible:py-2 focus-visible:text-white focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E86C1]"
          >
            {locale === "ru" ? "Перейти к основному содержанию" : "Skip to main content"}
          </a>
          <Header />
          <Breadcrumbs />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <MobileActionBar />
          <BreadcrumbSchema />
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
