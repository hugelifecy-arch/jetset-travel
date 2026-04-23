import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CANONICAL_ORIGIN, OG_IMAGE, localizedAlternates } from "@/lib/seo";
import { getAllPosts, getPostBySlug, getPostTranslationSlug } from "@/lib/blog";
import { markdownToHtml } from "@/lib/markdown";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowRight, ChevronRight, Home } from "lucide-react";
import { PATH_DISPLAY_NAMES, getHomeName } from "@/components/seo/breadcrumb-names";
import SocialShare from "@/components/blog/SocialShare";

export async function generateStaticParams() {
  // Only pre-render published posts. Drafts must not emit a public URL Google
  // can crawl — thin draft pages compete with real articles and drag down the
  // site's indexing signal (root cause of "Crawled - currently not indexed").
  const posts = getAllPosts().filter(
    (p) => p.frontmatter.status === "published",
  );
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
    robots: { index: true, follow: true },
    alternates: (() => {
      const slugs = getPostTranslationSlug(slug);
      return slugs.en && slugs.ru
        ? localizedAlternates(locale, `/blog/${slug}`, {
            en: `/blog/${slugs.en}`,
            ru: `/blog/${slugs.ru}`,
          })
        : { canonical: `${CANONICAL_ORIGIN}/${locale}/blog/${slug}/` };
    })(),
    openGraph: {
      type: "article",
      siteName: "JetSet Travel Cyprus",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${CANONICAL_ORIGIN}/${locale}/blog/${slug}/`,
      locale: isRussian ? "ru_RU" : "en_CY",
      alternateLocale: isRussian ? "en_CY" : "ru_RU",
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

  if (!post || post.frontmatter.status !== "published") {
    notFound();
  }

  const htmlContent = await markdownToHtml(post.content);
  const wordCount = post.content.trim().split(/\s+/).length;

  // Map blog tags -> relevant service pages for inline interlinking (E-E-A-T + SEO)
  const TAG_TO_SERVICES: Record<string, Array<{ slug: string; labelEn: string; labelRu: string }>> = {
    visa: [{ slug: "visa-services", labelEn: "Visa Services", labelRu: "Визовые услуги" }],
    "digital-nomad": [{ slug: "visa-services", labelEn: "Visa Services", labelRu: "Визовые услуги" }],
    schengen: [{ slug: "visa-services", labelEn: "Visa Services", labelRu: "Визовые услуги" }],
    corporate: [
      { slug: "corporate-travel", labelEn: "Corporate Travel", labelRu: "Корпоративные поездки" },
      { slug: "hotel-reservations", labelEn: "Hotel Reservations", labelRu: "Бронирование отелей" },
    ],
    business: [
      { slug: "corporate-travel", labelEn: "Corporate Travel", labelRu: "Корпоративные поездки" },
    ],
    hotel: [{ slug: "hotel-reservations", labelEn: "Hotel Reservations", labelRu: "Бронирование отелей" }],
    hotels: [{ slug: "hotel-reservations", labelEn: "Hotel Reservations", labelRu: "Бронирование отелей" }],
    luxury: [{ slug: "luxury-travel", labelEn: "Luxury Travel", labelRu: "Премиум отдых" }],
    cruise: [{ slug: "cruises", labelEn: "Cruise Booking", labelRu: "Круизы" }],
    cruises: [{ slug: "cruises", labelEn: "Cruise Booking", labelRu: "Круизы" }],
    flight: [
      { slug: locale === "en" ? "flight-tickets-cyprus" : "aviabilety-kipr", labelEn: "Flights from Cyprus", labelRu: "Авиабилеты из Кипра" },
    ],
    flights: [
      { slug: locale === "en" ? "flight-tickets-cyprus" : "aviabilety-kipr", labelEn: "Flights from Cyprus", labelRu: "Авиабилеты из Кипра" },
    ],
    paphos: [
      { slug: locale === "en" ? "paphos-travel-agency" : "turisticheskoe-agentstvo-pafos", labelEn: "Paphos Travel Agency", labelRu: "Турагентство в Пафосе" },
    ],
  };
  const relatedServices = Array.from(
    new Map(
      (post.frontmatter.tags ?? [])
        .flatMap((tag) => TAG_TO_SERVICES[String(tag).toLowerCase()] || [])
        .map((s) => [s.slug, s]),
    ).values(),
  ).slice(0, 3);

  // Get related posts — rank by number of overlapping tags so topically-close
  // posts win over posts that merely share a weak tag like a year or "cyprus".
  // Weak matching here was pushing on-topic posts out of the related list,
  // weakening internal linking for pages that need index signal.
  const allPosts = getAllPosts(locale).filter(
    (p) => p.frontmatter.status === "published",
  );
  const currentTags = (post.frontmatter.tags ?? []).map((t) =>
    String(t).toLowerCase(),
  );
  const related = allPosts
    .filter((p) => p.frontmatter.slug !== slug)
    .map((p) => {
      const overlap = (p.frontmatter.tags ?? [])
        .map((t) => String(t).toLowerCase())
        .filter((t) => currentTags.includes(t)).length;
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
    .slice(0, 3)
    .map((m) => m.post);

  const articleUrl = `${CANONICAL_ORIGIN}/${locale}/blog/${slug}/`;
  const ogImage = post.frontmatter.image
    ? `${CANONICAL_ORIGIN}${post.frontmatter.image}`
    : OG_IMAGE;

  // Article JSON-LD schema. `image` is an ImageObject with explicit
  // dimensions so Google Search Console's Article rich result requirement
  // ("Image width and height are required") is satisfied.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.dateModified ?? post.frontmatter.date,
    author: {
      "@type": "Person",
      name: post.frontmatter.author,
      url: `${CANONICAL_ORIGIN}/en/about/`,
    },
    publisher: {
      "@type": "Organization",
      name: "JetSet Travel Cyprus",
      logo: {
        "@type": "ImageObject",
        url: `${CANONICAL_ORIGIN}/images/jetset-logo.svg`,
        width: 300,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: post.frontmatter.tags.join(", "),
    wordCount,
    ...(post.frontmatter.tags[0] && { articleSection: post.frontmatter.tags[0] }),
    // Entity mentions for AI/LLM citation and Google entity SEO
    about: [
      { "@id": "https://www.jetset-travel.com/#organization" },
      ...((post.frontmatter.tags ?? []).some((t) => { const s = String(t).toLowerCase(); return s.includes("cyprus") || s.includes("paphos") || s.includes("limassol"); })
        ? [{ "@type": "Place", name: "Cyprus" }]
        : []),
    ],
    isPartOf: {
      "@type": "Blog",
      "@id": `${CANONICAL_ORIGIN}/${locale}/blog/`,
      name: locale === "ru" ? "Блог JetSet Travel" : "JetSet Travel Blog",
    },
    // Speakable: identifies content suitable for voice assistants (Google Assistant, Alexa)
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".prose p:first-of-type"],
    },
  };

  return (
    <>
      {/* JSON-LD Schema (breadcrumb schema handled by layout BreadcrumbSchema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero / Banner */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-white/50">
              <li>
                <Link
                  href={`/${locale}`}
                  className="flex items-center gap-1 hover:text-brand-gold transition-colors"
                >
                  <Home className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">{getHomeName(locale)}</span>
                </Link>
              </li>
              <li className="flex items-center"><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="hover:text-brand-gold transition-colors"
                >
                  {(PATH_DISPLAY_NAMES[locale] ?? PATH_DISPLAY_NAMES.en).blog}
                </Link>
              </li>
              <li className="flex items-center"><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></li>
              <li className="text-white/70 truncate max-w-[180px] sm:max-w-[300px] md:max-w-none" title={post.frontmatter.title}>
                {post.frontmatter.title}
              </li>
            </ol>
          </nav>

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
        <div className="aspect-[2/1] relative rounded-2xl bg-gradient-to-br from-brand-navy/80 to-brand-dark overflow-hidden">
          {post.frontmatter.image && (
            <Image
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          )}
        </div>
      </div>

      {/* Post Body */}
      <article className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none text-brand-navy/80 leading-relaxed prose-headings:text-brand-navy prose-headings:font-display prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-a:text-brand-gold prose-a:underline hover:prose-a:text-brand-gold/80 prose-strong:text-brand-navy prose-li:text-brand-navy/80 prose-table:text-sm prose-th:bg-brand-navy/5 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-td:border-brand-navy/10 prose-hr:border-brand-navy/10"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Related Services — interlink blog topics to service pages */}
          {relatedServices.length > 0 && (
            <div className="mt-12 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold mb-2">
                {locale === "ru" ? "Связанные услуги" : "Related services"}
              </p>
              <h3 className="text-lg font-bold text-brand-navy mb-4">
                {locale === "ru"
                  ? "Планируете подобное путешествие? Мы поможем."
                  : "Planning a trip like this? We can help."}
              </h3>
              <ul className="flex flex-wrap gap-3">
                {relatedServices.map((svc) => (
                  <li key={svc.slug}>
                    <Link
                      href={`/${locale}/${svc.slug}`}
                      className="inline-flex items-center rounded-full border border-brand-navy/10 bg-white px-4 py-2 text-sm font-semibold text-brand-navy hover:border-brand-gold hover:text-brand-gold transition-colors"
                    >
                      {locale === "ru" ? svc.labelRu : svc.labelEn}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Author Bio */}
          <aside className="mt-12 rounded-2xl border border-brand-navy/10 bg-brand-light p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold mb-2">
                  {locale === "ru" ? "Об авторе" : "About the author"}
                </p>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {post.frontmatter.author}
                </h3>
                <p className="text-sm text-brand-navy/70 mb-3">
                  {locale === "ru"
                    ? "Часть команды JetSet Travel Cyprus — аккредитованного IATA турагентства в Пафосе (лицензия 7775, IATA 14200130). Более 20 лет опыта в корпоративных и премиальных путешествиях."
                    : "Part of the JetSet Travel Cyprus team — an IATA-accredited travel agency in Paphos (License 7775, IATA 14200130) with 20+ years of corporate and luxury travel experience."}
                </p>
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex items-center text-sm font-semibold text-brand-gold hover:text-brand-gold/80"
                >
                  {locale === "ru" ? "Больше о команде" : "More about our team"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Social Sharing */}
          <div className="mt-12 pt-8 border-t border-brand-navy/10">
            <SocialShare
              url={articleUrl}
              title={post.frontmatter.title}
            />
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
                <article
                  key={relatedPost.frontmatter.slug}
                  className="group rounded-2xl border border-brand-navy/10 overflow-hidden bg-white hover:shadow-luxury transition-shadow"
                >
                  <Link
                    href={`/${locale}/blog/${relatedPost.frontmatter.slug}`}
                    className="block"
                  >
                    <div className="aspect-[16/9] relative bg-gradient-to-br from-brand-navy/80 to-brand-dark overflow-hidden">
                      {relatedPost.frontmatter.image && (
                        <Image
                          src={relatedPost.frontmatter.image}
                          alt={relatedPost.frontmatter.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
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
                </article>
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
