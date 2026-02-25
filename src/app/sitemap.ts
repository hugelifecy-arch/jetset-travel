import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/lib/seo";

const locales = ["en", "ru"] as const;

const pages = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/corporate-travel", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/luxury-travel", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/visa-services", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/hotel-reservations", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/quote", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.6, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = "2026-02-25";

  return locales.flatMap((locale) =>
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
}
