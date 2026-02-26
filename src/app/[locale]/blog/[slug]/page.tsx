import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates, CANONICAL_ORIGIN, OG_IMAGE } from "@/lib/seo";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from "lucide-react";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    locale: post.frontmatter.locale,
    slug: post.frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: locale === "ru" ? "Запись не найдена" : "Post Not Found",
    };
  }

  const isRussian = locale === "ru";
  const ogImage = post.frontmatter.image
    ? `${CANONICAL_ORIGIN}${post.frontmatter.image}`
    : OG_IMAGE;

  return {
    title: { absolute: `${post.frontmatter.title} | JetSet Travel Cyprus` },
    description: post.frontmatter.description,
    alternates: localizedAlternates(locale, `/blog/${slug}`),
    openGraph: {
      type: "article",
      siteName: "JetSet Travel Cyprus",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${CANONICAL_ORIGIN}/${locale}/blog/${slug}`,
      locale: isRussian ? "ru_CY" : "en_CY",
      alternateLocale: isRussian ? "en_CY" : "ru_CY",
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.frontmatter.title }],
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      tags: post.frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same tags, different slug)
  const allPosts = getAllPosts(locale).filter(
    (p) => p.frontmatter.status === "published",
  );
  const related = allPosts
    .filter(
      (p) =>
        p.frontmatter.slug !== slug &&
        p.frontmatter.tags.some((tag) => post.frontmatter.tags.includes(tag)),
    )
    .slice(0, 3);

  return (
    <>
      {/* Hero / Banner Image */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-sm text-white/60 hover:text-brand-gold transition-colors mb-8"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {t("backToBlog")}
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-brand-gold font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {post.frontmatter.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.frontmatter.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.frontmatter.date).toLocaleDateString(
                locale === "ru" ? "ru-RU" : "en-GB",
                { day: "numeric", month: "long", year: "numeric" },
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} {t("minRead")}
            </span>
          </div>
        </div>
      </section>

      {/* Banner Image Area */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="aspect-[2/1] rounded-2xl bg-gradient-to-br from-brand-navy/80 to-brand-dark overflow-hidden flex items-center justify-center">
          <span className="text-white/10 text-6xl font-display font-bold">
            JetSet
          </span>
        </div>
      </div>

      {/* Post Body */}
      <article className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-brand-navy/80 leading-relaxed">
            {post.content.split("\n\n").map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              return (
                <p key={i}>{trimmed}</p>
              );
            })}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="py-16 bg-brand-light">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-brand-navy mb-8">
              {t("relatedPosts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((relatedPost) => (
                <Link
                  key={relatedPost.frontmatter.slug}
                  href={`/${locale}/blog/${relatedPost.frontmatter.slug}`}
                  className="group rounded-2xl border border-brand-navy/10 overflow-hidden bg-white hover:shadow-luxury transition-shadow"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-brand-navy/80 to-brand-dark flex items-center justify-center">
                    <span className="text-white/20 text-3xl font-display font-bold">
                      JetSet
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">
                      {relatedPost.frontmatter.title}
                    </h3>
                    <p className="text-sm text-brand-navy/60 line-clamp-2">
                      {relatedPost.frontmatter.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
