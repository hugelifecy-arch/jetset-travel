import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { getPostBySlug } from "@/lib/blog";

interface FeaturedBlogPostProps {
  locale: string;
  /** Slug of the EN post; used when locale === "en" or as fallback. */
  enSlug: string;
  /** Slug of the RU post; used when locale === "ru". */
  ruSlug?: string;
}

/**
 * Prominent, SSR-rendered link to a specific blog post from a service page.
 *
 * Purpose: give GSC-flagged "Crawled – currently not indexed" articles a
 * strong, topically-aligned internal link from their most relevant service
 * page. The generic RelatedArticles block ranks by tag overlap and can drop
 * a single post on any given render — this component is a permanent,
 * deterministic anchor that guarantees the article is always linked.
 */
export default function FeaturedBlogPost({
  locale,
  enSlug,
  ruSlug,
}: FeaturedBlogPostProps) {
  const slug = locale === "ru" && ruSlug ? ruSlug : enSlug;
  const post = getPostBySlug(slug);
  if (!post || post.frontmatter.status !== "published") return null;

  const readLabel = locale === "ru" ? "Читать гид" : "Read the guide";
  const label = locale === "ru" ? "Из блога" : "From the blog";

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/blog/${slug}`}
          className="group grid grid-cols-1 md:grid-cols-5 gap-6 rounded-2xl border border-brand-navy/10 bg-brand-light overflow-hidden hover:shadow-luxury transition-shadow"
        >
          <div className="relative aspect-[16/10] md:aspect-auto md:col-span-2 bg-gradient-to-br from-brand-navy/80 to-brand-dark">
            {post.frontmatter.image && (
              <Image
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            )}
          </div>
          <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-gold mb-3">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-navy group-hover:text-brand-gold transition-colors mb-3">
              {post.frontmatter.title}
            </h3>
            <p className="text-sm sm:text-base text-brand-navy/70 leading-relaxed mb-4 line-clamp-3">
              {post.frontmatter.description}
            </p>
            <span className="inline-flex items-center text-sm font-semibold text-brand-gold">
              {readLabel}
              <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
