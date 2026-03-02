import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/blog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogFilters from "@/components/blog/BlogFilters";
import NewsletterSignup from "@/components/blog/NewsletterSignup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/blog",
    title:
      locale === "ru"
        ? "Блог | Корпоративные и премиальные путешествия из Кипра | JetSet Travel"
        : "Travel Blog | Corporate & Luxury Travel Insights from Cyprus | JetSet Travel",
    description:
      locale === "ru"
        ? "Экспертные материалы об организации корпоративных командировок, деловых поездках с Кипра, визовых гидах и обзорах премиальных направлений."
        : "Expert insights on corporate travel management, Cyprus business travel tips, visa guides, and luxury destination reviews from JetSet Travel.",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const posts = getPublishedPosts(locale);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
            {t("heroLabel")}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Blog Grid with Filters */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogFilters posts={posts} />
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* CTA Banner */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            {t("ctaSubtitle")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
          >
            {t("ctaContact")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
