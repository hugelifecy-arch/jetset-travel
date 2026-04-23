import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";

interface RelatedArticlesProps {
  locale: string;
  /** Match posts that include ANY of these tags (case-insensitive). */
  tags: string[];
  /** Max number of articles to show. Default 3. */
  limit?: number;
}

/**
 * Shows related blog articles for a service page. Matches posts by tag
 * overlap and renders a compact grid. This is the reverse of the
 * blog -> service interlinking we added on blog posts — together they
 * form bidirectional internal links that improve crawl depth and E-E-A-T.
 */
export default async function RelatedArticles({
  locale,
  tags,
  limit = 3,
}: RelatedArticlesProps) {
  const posts = getPublishedPosts(locale);
  const wantedTags = tags.map((t) => t.toLowerCase());

  // Rank by tag-overlap strength so topically-on-point posts win over recent
  // posts whose only match is a weak tag (year, "cyprus"). Weak matches on the
  // service pages were burying the very posts GSC flagged as "Crawled -
  // currently not indexed".
  const matches = posts
    .map((p) => {
      const postTags = (p.frontmatter.tags ?? []).map((t) =>
        String(t).toLowerCase(),
      );
      const overlap = postTags.filter((t) => wantedTags.includes(t)).length;
      return { post: p, overlap };
    })
    .filter((m) => m.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return (
        new Date(b.post.frontmatter.date).getTime() -
        new Date(a.post.frontmatter.date).getTime()
      );
    })
    .slice(0, limit)
    .map((m) => m.post);

  if (matches.length === 0) return null;

  const heading = locale === "ru" ? "Читайте также в нашем блоге" : "Related reading from our blog";
  const subtitle =
    locale === "ru"
      ? "Экспертные гиды и советы от IATA-аккредитованного агентства"
      : "Expert guides and advice from an IATA-accredited agency";
  const readLabel = locale === "ru" ? "мин чтения" : "min read";
  const readMoreLabel = locale === "ru" ? "Читать" : "Read article";

  return (
    <section className="py-16 sm:py-20 bg-brand-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-2">
            {locale === "ru" ? "Блог" : "From the blog"}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy">
            {heading}
          </h2>
          <p className="mt-3 text-brand-navy/60 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((post) => (
            <article
              key={post.frontmatter.slug}
              className="group rounded-2xl border border-brand-navy/10 overflow-hidden bg-white hover:shadow-luxury transition-shadow"
            >
              <Link
                href={`/${locale}/blog/${post.frontmatter.slug}`}
                className="block"
              >
                <div className="aspect-[16/9] relative bg-gradient-to-br from-brand-navy/80 to-brand-dark overflow-hidden">
                  {post.frontmatter.image && (
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-brand-navy/60 mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} {readLabel}
                    </span>
                  </div>
                  <h3 className="font-bold text-brand-navy mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
                    {post.frontmatter.title}
                  </h3>
                  <p className="text-sm text-brand-navy/70 line-clamp-2 mb-4">
                    {post.frontmatter.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-brand-gold">
                    {readMoreLabel}
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
