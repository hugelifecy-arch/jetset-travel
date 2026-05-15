import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata, CANONICAL_ORIGIN } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/blog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogFilters from "@/components/blog/BlogFilters";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import JsonLd from "@/components/seo/JsonLd";

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
        ? "Блог о путешествиях | Гиды по Кипру — JetSet Travel"
        : "Travel Blog | Cyprus Tips & Guides — JetSet Travel",
    description:
      locale === "ru"
        ? "Советы по путешествиям, гиды по Кипру, визовая информация и обзоры направлений от JetSet Travel Пафос. Экспертные рекомендации для корпоративных и частных путешественников."
        : "Travel tips, Cyprus guides, visa information, and destination insights from JetSet Travel Paphos. Expert advice for corporate and leisure travelers.",
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

      {/* Blog Schema */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name:
            locale === "ru"
              ? "Блог о путешествиях — JetSet Travel"
              : "Travel Blog — JetSet Travel",
          url: `${CANONICAL_ORIGIN}/${locale}/blog`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: posts.length,
            itemListElement: posts.map((post, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${CANONICAL_ORIGIN}/${locale}/blog/${post.frontmatter.slug}`,
              name: post.frontmatter.title,
            })),
          },
        }}
      />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Popular Services — internal linking for SEO */}
      <section className="py-16 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-2">
              {locale === "ru" ? "Наши услуги" : "Our services"}
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy">
              {locale === "ru"
                ? "Готовы превратить идею в поездку?"
                : "Ready to turn inspiration into a trip?"}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { slug: "corporate-travel", en: "Corporate Travel", ru: "Корпоративные поездки" },
              { slug: "luxury-travel", en: "Luxury Travel", ru: "Премиум отдых" },
              { slug: "visa-services", en: "Visa Services", ru: "Визовые услуги" },
              { slug: "hotel-reservations", en: "Hotels", ru: "Отели" },
              { slug: "cruises", en: "Cruises", ru: "Круизы" },
              { slug: locale === "en" ? "flight-tickets-cyprus" : "aviabilety-kipr", en: "Flights", ru: "Авиабилеты" },
            ].map((svc) => (
              <Link
                key={svc.slug}
                href={`/${locale}/${svc.slug}`}
                className="flex items-center justify-center rounded-xl border border-brand-navy/10 bg-white px-4 py-3 text-sm font-semibold text-brand-navy hover:border-brand-gold hover:text-brand-gold hover:shadow-card transition-all"
              >
                {locale === "ru" ? svc.ru : svc.en}
              </Link>
            ))}
          </div>
        </div>
      </section>

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
