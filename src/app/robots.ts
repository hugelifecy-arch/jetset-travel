import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
        crawlDelay: 2,
      },
    ],
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: CANONICAL_ORIGIN,
  };
}
