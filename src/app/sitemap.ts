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
  const crossLocalePages = [
    {
      url: `${CANONICAL_ORIGIN}/en/paphos-travel-agency`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${CANONICAL_ORIGIN}/en/paphos-travel-agency`,
          ru: `${CANONICAL_ORIGIN}/ru/turisticheskoe-agentstvo-pafos`,
          "x-default": `${CANONICAL_ORIGIN}/en/paphos-travel-agency`,
        },
      },
    },
    {
      url: `${CANONICAL_ORIGIN}/ru/turisticheskoe-agentstvo-pafos`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${CANONICAL_ORIGIN}/en/paphos-travel-agency`,
          ru: `${CANONICAL_ORIGIN}/ru/turisticheskoe-agentstvo-pafos`,
          "x-default": `${CANONICAL_ORIGIN}/en/paphos-travel-agency`,
        },
      },
    },
  ];

  // Add published blog posts to sitemap
  const publishedPosts = getPublishedPosts();
  const blogPages = publishedPosts.map((post) => ({
    url: `${CANONICAL_ORIGIN}/${post.frontmatter.locale}/blog/${post.frontmatter.slug}`,
    lastModified: post.frontmatter.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    alternates: {
      languages: {
        en: `${CANONICAL_ORIGIN}/en/blog/${post.frontmatter.slug}`,
        ru: `${CANONICAL_ORIGIN}/ru/blog/${post.frontmatter.slug}`,
        "x-default": `${CANONICAL_ORIGIN}/en/blog/${post.frontmatter.slug}`,
      },
    },
  }));

  return [...staticPages, ...crossLocalePages, ...blogPages];
}
