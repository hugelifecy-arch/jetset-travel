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

  // Phase 5 — Step 35/37: rewrite EN title + meta description to lead with
  // the licensing/credibility signal UK B2B searchers expect and to
  // disambiguate the homepage from a generic "JetSet Travel" brand match.
  // Targets: "cyprus travel agency" (UK, pos 29.9, 0 CTR) and
  // "travel agency paphos" (UK, pos 2.3, 0 CTR). Mobile brand CTR (25.6%)
  // must not regress, so RU title kept close to the previous version.
  return buildPageMetadata({
    locale,
    title:
      locale === "ru"
        ? "Турагентство в Пафосе, Кипр 2026 | JetSet — Аккредитация IATA"
        : "Travel Agency in Cyprus — Paphos | JetSet Travel",
    description:
      locale === "ru"
        ? "JetSet Travel — аккредитованное IATA турагентство в Пафосе, Кипр (лицензия 7775). Корпоративные поездки, премиальный отдых, визы, авиабилеты. Поддержка 24/7."
        : "IATA-accredited Cyprus travel agency in Paphos (Licence 7775). Corporate trips, luxury holidays, visa & flights for UK, EU and local travellers in 2026.",
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
