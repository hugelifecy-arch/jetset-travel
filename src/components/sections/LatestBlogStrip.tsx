import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";

export default async function LatestBlogStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "blogStrip" });
  const posts = getPublishedPosts(locale).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-brand-light py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
              {t("label")}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy md:text-4xl">
              {t("title")}
            </h2>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="hidden items-center gap-1 text-sm font-semibold text-brand-gold hover:underline sm:inline-flex"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.frontmatter.slug}
              className="group overflow-hidden rounded-2xl border border-brand-navy/10 bg-white transition-shadow hover:shadow-luxury"
            >
              <Link
                href={`/${locale}/blog/${post.frontmatter.slug}`}
                className="block"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-navy/80 to-brand-dark">
                  {post.frontmatter.image && (
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs text-brand-navy/50">
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
                  <h3 className="mb-2 text-lg font-bold text-brand-navy transition-colors group-hover:text-brand-gold line-clamp-2">
                    {post.frontmatter.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-navy/60 line-clamp-2">
                    {post.frontmatter.description}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-gold">
                    {t("readMore")}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gold hover:underline"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
