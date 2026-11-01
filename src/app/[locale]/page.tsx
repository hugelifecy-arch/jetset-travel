import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import HeroSection from "@/components/sections/HeroSection";
import TrustCredentialsBar from "@/components/sections/TrustCredentialsBar";
import AboutBlurb from "@/components/sections/AboutBlurb";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import WebSiteSchema from "@/components/seo/WebSiteSchema";

// Below-the-fold sections are code-split so any client JS chunks they
// contain are not bundled with the initial page load.
// SSR remains enabled (default) so the HTML is still crawlable.
const ServicesGrid = dynamic(
  () => import("@/components/sections/ServicesGrid"),
);
const VipLuxurySection = dynamic(
  () => import("@/components/sections/VipLuxurySection"),
);
const TrustSection = dynamic(
  () => import("@/components/sections/TrustSection"),
);
const ComparisonSection = dynamic(
  () => import("@/components/sections/ComparisonSection"),
);
const GoogleReviews = dynamic(
  () => import("@/components/sections/GoogleReviews"),
);
const ClientLogos = dynamic(
  () => import("@/components/sections/ClientLogos"),
);
const LatestBlogStrip = dynamic(
  () => import("@/components/sections/LatestBlogStrip"),
);
const CTABanner = dynamic(
  () => import("@/components/sections/CTABanner"),
);
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // 1 Nov 2026 snippet rewrite. GSC: 3,369 impressions at an average
  // position of 13.7, and the homepage and the Paphos page both targeted
  // "travel agency in Paphos". Split the intent: the homepage owns
  // "Cyprus travel agency" (clients across Cyprus, corporate and luxury
  // private travel) and keeps "Paphos" in the title; /en/paphos-travel-agency
  // and /ru/turisticheskoe-agentstvo-pafos own the local "travel agent in
  // Paphos / visit our office" angle. The H1 (messages hero.title) follows
  // the same split. Every claim here (since 2006, Licence 7775, free quote,
  // 24/7 WhatsApp) is already stated elsewhere on the site.
  return buildPageMetadata({
    locale,
    title:
      locale === "ru"
        ? "Турагентство на Кипре с аккредитацией IATA | JetSet Travel"
        : "Cyprus Travel Agency in Paphos | IATA-Accredited | JetSet",
    description:
      locale === "ru"
        ? "JetSet Travel — турагентство на Кипре с аккредитацией IATA, офис в Пафосе с 2006 года (лицензия 7775). Командировки, премиум-отдых, визы и авиабилеты."
        : "IATA-accredited Cyprus travel agency in Paphos since 2006 (Licence 7775): corporate travel, luxury holidays, flights and visas. Free quote, 24/7 WhatsApp.",
    keywords:
      locale === "ru"
        ? ["туристическое агентство Кипр", "IATA турагентство Пафос", "авиабилеты Пафос", "туры из Кипра", "бронирование отелей Кипр", "корпоративные поездки Кипр", "JetSet Travel", "турагентство с IATA Пафос", "лучшее турагентство в Пафосе для бизнеса", "корпоративное турагентство Кипр"]
        : ["travel agency Paphos", "IATA accredited travel agent Cyprus", "corporate travel Cyprus", "luxury travel Paphos", "flight booking Cyprus", "JetSet Travel", "travel agent Paphos Cyprus", "best travel agency in Paphos", "corporate travel agency Paphos"],
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Review structured data removed (audit F-02): the three homepage quotes
  // cannot be traced to published Google reviews — repository history shows
  // the names and "Google review" labels were added to generic marketing copy.
  // Re-add Review markup only for quotes matched to a verifiable source.

  return (
    <>
      {/* Hero image preload is emitted by next/image (priority) in HeroSection;
          a manual raw-file preload here would double-download the asset. */}
      <HeroSection />
      <TrustCredentialsBar />
      <AboutBlurb />
      <ServicesGrid />
      <VipLuxurySection />
      <TrustSection />
      <ComparisonSection />
      <GoogleReviews />
      <ClientLogos />
      <LatestBlogStrip locale={locale} />
      <CTABanner />
      <LocalBusinessSchema />
      <WebSiteSchema />
    </>
  );
}
