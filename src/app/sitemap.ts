import type { MetadataRoute } from "next";

const BASE_URL = "https://www.jetset-travel.com";

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
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page.priority,
      });
    }
  }

  return entries;
}
