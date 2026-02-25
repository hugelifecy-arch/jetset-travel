import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/lib/seo";

const locales = ["en", "ru"] as const;

const pages = [
  { path: "", priority: 1.0 },
  { path: "/corporate-travel", priority: 0.9 },
  { path: "/luxury-travel", priority: 0.9 },
  { path: "/visa-services", priority: 0.9 },
  { path: "/hotel-reservations", priority: 0.9 },
  { path: "/about", priority: 0.7 },
  { path: "/contact", priority: 0.7 },
  { path: "/quote", priority: 0.7 },
  { path: "/privacy", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${CANONICAL_ORIGIN}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
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
