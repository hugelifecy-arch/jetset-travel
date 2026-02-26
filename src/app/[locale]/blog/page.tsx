import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

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
          ? "Блог — Путешествия: советы и гиды | JetSet Travel Cyprus"
          : "Blog — Travel Insights & Guides | JetSet Travel Cyprus",
    },
    description:
      locale === "ru"
        ? "Экспертные советы, гиды по направлениям и аналитика индустрии путешествий от команды JetSet Travel."
        : "Expert tips, destination guides, and travel industry insights from the JetSet Travel team.",
    alternates: localizedAlternates(locale, "/blog"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const posts = getAllPosts(locale).filter(
    (p) => p.frontmatter.status === "published",
  );

  // Placeholder data for "coming soon" state
  const placeholders = [
    {
      title:
        locale === "ru"
          ? "5 советов для эффективных корпоративных поездок с Кипра"
          : "5 Tips for Efficient Corporate Travel from Cyprus",
      excerpt:
        locale === "ru"
          ? "Практические советы для компаний на Кипре по оптимизации корпоративных поездок и снижению расходов."
          : "Practical advice for businesses based in Cyprus to streamline corporate travel and reduce costs.",
      date: "2026-03-01",
      readTime: 5,
      tags: ["corporate", "tips"],
    },
    {
      title:
        locale === "ru"
          ? "Полный гид по шенгенской визе для жителей Кипра"
          : "Complete Schengen Visa Guide for Cyprus Residents",
      excerpt:
        locale === "ru"
          ? "Всё, что нужно знать о подаче на шенгенскую визу — документы, сроки и типичные ошибки."
          : "Everything you need to know about applying for a Schengen visa — documents, timelines, and common mistakes.",
      date: "2026-03-10",
      readTime: 8,
      tags: ["visas", "guide"],
    },
    {
      title:
        locale === "ru"
          ? "Лучшие премиальные направления Средиземноморья на 2026 год"
          : "Top Luxury Destinations in the Mediterranean for 2026",
      excerpt:
        locale === "ru"
          ? "Откройте для себя самые востребованные премиальные направления Средиземноморья на 2026 год."
          : "Discover the most sought-after luxury Mediterranean destinations for 2026.",
      date: "2026-03-15",
      readTime: 6,
      tags: ["luxury", "destinations"],
    },
  ];

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

      {/* Blog Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.frontmatter.slug}
                  href={`/${locale}/blog/${post.frontmatter.slug}`}
                  className="group rounded-2xl border border-brand-navy/10 overflow-hidden hover:shadow-luxury transition-shadow"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-brand-navy/80 to-brand-dark flex items-center justify-center">
                    <span className="text-white/20 text-4xl font-display font-bold">
                      JetSet
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-brand-navy/50 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.frontmatter.date).toLocaleDateString(
                          locale === "ru" ? "ru-RU" : "en-GB",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime} {t("minRead")}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">
                      {post.frontmatter.title}
                    </h2>
                    <p className="text-sm text-brand-navy/60 leading-relaxed line-clamp-3">
                      {post.frontmatter.description}
                    </p>
                    <span className="inline-flex items-center mt-4 text-sm font-semibold text-brand-gold">
                      {t("readMore")}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Coming soon state with placeholder cards */
            <div>
              <div className="text-center mb-12">
                <span className="inline-block rounded-full bg-brand-gold/10 px-4 py-1.5 text-sm font-semibold text-brand-gold mb-4">
                  {t("comingSoon")}
                </span>
                <p className="text-brand-navy/60 max-w-lg mx-auto">
                  {t("comingSoonDesc")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {placeholders.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-brand-navy/10 overflow-hidden opacity-75"
                  >
                    <div className="aspect-[16/9] bg-gradient-to-br from-brand-navy/60 to-brand-dark/60 flex items-center justify-center">
                      <span className="text-white/10 text-4xl font-display font-bold">
                        JetSet
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-brand-navy/40 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(card.date).toLocaleDateString(
                            locale === "ru" ? "ru-RU" : "en-GB",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {card.readTime} {t("minRead")}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-brand-navy/70 mb-2">
                        {card.title}
                      </h2>
                      <p className="text-sm text-brand-navy/40 leading-relaxed">
                        {card.excerpt}
                      </p>
                      <div className="flex gap-2 mt-4">
                        {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-brand-navy/5 text-brand-navy/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
