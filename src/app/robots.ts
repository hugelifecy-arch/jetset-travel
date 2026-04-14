import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      // AI search engine crawlers — explicitly allowed
      {
        userAgent: "GPTBot",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "Amazonbot",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "CCBot",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      {
        userAgent: "cohere-ai",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
      // Russian search engines
      {
        userAgent: "Yandex",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
        crawlDelay: 2,
      },
      {
        userAgent: "YandexBot",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
        crawlDelay: 2,
      },
      {
        userAgent: "Mail.RU_Bot",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/_next/data/"],
      },
    ],
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: CANONICAL_ORIGIN,
  };
}
