import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/blog";

const locales = ["en", "ru"] as const;

const pages = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/corporate-travel", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/luxury-travel", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/visa-services", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/hotel-reservations", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/cruises", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/quote", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/faq", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" as const },
  // /paphos-travel-agency is handled separately in crossLocalePages below
  { path: "/privacy", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.4, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString().split("T")[0];

  const staticPages = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${CANONICAL_ORIGIN}/${locale}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          en: `${CANONICAL_ORIGIN}/en${page.path}`,
          ru: `${CANONICAL_ORIGIN}/ru${page.path}`,
          "x-default": `${CANONICAL_ORIGIN}/en${page.path}`,
        },
      },
    })),
  );

  // Cross-locale pages with different slugs per locale
  const crossLocalePageDefs = [
    { en: "paphos-travel-agency", ru: "turisticheskoe-agentstvo-pafos" },
    { en: "corporate-travel-cyprus", ru: "korporativnye-poezdki-kipr" },
    { en: "visa-services-cyprus", ru: "vizovye-uslugi-kipr" },
    { en: "luxury-travel-cyprus", ru: "luxusnyy-otdykh-kipr" },
    { en: "flight-tickets-cyprus", ru: "aviabilety-kipr" },
    { en: "hotel-booking-cyprus", ru: "bronirovanie-otelej-kipr" },
  ];

  const crossLocalePages = crossLocalePageDefs.flatMap((def) => [
    {
      url: `${CANONICAL_ORIGIN}/en/${def.en}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${CANONICAL_ORIGIN}/en/${def.en}`,
          ru: `${CANONICAL_ORIGIN}/ru/${def.ru}`,
          "x-default": `${CANONICAL_ORIGIN}/en/${def.en}`,
        },
      },
    },
    {
      url: `${CANONICAL_ORIGIN}/ru/${def.ru}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${CANONICAL_ORIGIN}/en/${def.en}`,
          ru: `${CANONICAL_ORIGIN}/ru/${def.ru}`,
          "x-default": `${CANONICAL_ORIGIN}/en/${def.en}`,
        },
      },
    },
  ]);

  // Add published blog posts to sitemap
  const publishedPosts = getPublishedPosts();
  const blogPages = publishedPosts.map((post) => {
    const { locale, slug, translationSlug } = post.frontmatter;

    // Build hreflang alternates based on whether a translation exists
    const languages: Record<string, string> = {};
    if (translationSlug) {
      // Paired post — include both locales
      const enSlug = locale === "en" ? slug : translationSlug;
      const ruSlug = locale === "ru" ? slug : translationSlug;
      languages.en = `${CANONICAL_ORIGIN}/en/blog/${enSlug}`;
      languages.ru = `${CANONICAL_ORIGIN}/ru/blog/${ruSlug}`;
      languages["x-default"] = `${CANONICAL_ORIGIN}/en/blog/${enSlug}`;
    } else if (locale === "en") {
      // EN-only post
      languages.en = `${CANONICAL_ORIGIN}/en/blog/${slug}`;
      languages["x-default"] = `${CANONICAL_ORIGIN}/en/blog/${slug}`;
    } else {
      // RU-only post
      languages.ru = `${CANONICAL_ORIGIN}/ru/blog/${slug}`;
    }

    return {
      url: `${CANONICAL_ORIGIN}/${locale}/blog/${slug}`,
      lastModified: post.frontmatter.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages },
    };
  });

  return [...staticPages, ...crossLocalePages, ...blogPages];
}
