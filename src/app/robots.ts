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
      // AI search engine crawlers — explicitly allowed
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
      // Russian search engines
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
        crawlDelay: 2,
      },
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
        crawlDelay: 2,
      },
      {
        userAgent: "Mail.RU_Bot",
        allow: "/",
        disallow: ["/api/", "/_next/static/"],
      },
    ],
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: CANONICAL_ORIGIN,
  };
}
