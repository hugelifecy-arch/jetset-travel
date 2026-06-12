import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import HeaderClient from "@/components/layout/HeaderClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileActionBar from "@/components/layout/MobileActionBar";
import CookieConsentBanner from "@/components/cookies/CookieConsentBanner";
import ExitIntentPopup from "@/components/layout/ExitIntentPopup";
import { CANONICAL_ORIGIN, OG_IMAGE, localizedAlternates } from "@/lib/seo";
import { pickClientMessages } from "@/lib/client-messages";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import VercelAnalytics from "@/components/analytics/VercelAnalytics";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import YandexMetrica from "@/components/analytics/YandexMetrica";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";
import "../globals.css";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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
    verification: {
      yandex: "c693997a9fde5229",
    },
    alternates: localizedAlternates(locale),
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
      locale: isRussian ? "ru_RU" : "en_CY",
      alternateLocale: isRussian ? "en_CY" : "ru_RU",
      siteName: "JetSet Travel Cyprus",
      url: `${CANONICAL_ORIGIN}/${locale}`,
      title: isRussian
        ? "JetSet Travel Cyprus — Премиум Туристические Услуги"
        : "JetSet Travel Cyprus — Premium Travel Services",
      description: isRussian
        ? "Аккредитованное IATA туристическое агентство в Пафосе, Кипр. Корпоративные путешествия, элитный отдых, визовые услуги и бронирование отелей."
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
        ? "Аккредитованное IATA туристическое агентство в Пафосе, Кипр. Корпоративные путешествия, элитный отдых, визовые услуги и бронирование отелей."
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
  setRequestLocale(locale);
  const messages = (await import(`../../messages/${locale}.json`)).default;
  // Only the namespaces client components consume are serialized into the
  // page payload; server components read the full catalog via next-intl's
  // request config. Guarded by tests/client-messages.test.js.
  const clientMessages = pickClientMessages(messages);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Analytics connection hints live inside the consent-gated analytics
            components (GoogleAnalytics, YandexMetrica, FacebookPixel,
            MicrosoftClarity) so we don't open connections to trackers before
            the visitor grants consent. */}
        {/* Maps */}
        <link rel="dns-prefetch" href="https://maps.google.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        {/* Messaging */}
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://wa.me" />
        {/* AI search / LLM discovery — point crawlers at the
            machine-readable summary and AI usage policy from any page. */}
        <link
          rel="alternate"
          type="text/markdown"
          title="JetSet Travel Cyprus — LLM-friendly summary"
          href="/llms.txt"
        />
        <link
          rel="alternate"
          type="text/markdown"
          title="JetSet Travel Cyprus — full AI knowledge file"
          href="/llms-full.txt"
        />
        <link rel="ai-policy" href="/ai.txt" />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-md focus-visible:bg-brand-navy focus-visible:px-4 focus-visible:py-2 focus-visible:text-white focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E86C1]"
          >
            {locale === "ru" ? "Перейти к основному содержанию" : "Skip to main content"}
          </a>
          <HeaderClient />
          <Breadcrumbs />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <MobileActionBar />
          <BreadcrumbSchema />
          <CookieConsentBanner />
          <ExitIntentPopup />
          <VercelAnalytics />
          <GoogleAnalytics />
          <YandexMetrica />
          <FacebookPixel />
          <MicrosoftClarity />
          {recaptchaSiteKey &&
            recaptchaSiteKey !== "your_recaptcha_site_key" && (
              <Script
                src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
                strategy="lazyOnload"
              />
            )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
