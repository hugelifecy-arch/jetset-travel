import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/lib/seo";

// Common allow/disallow rules shared by every user-agent block.
const COMMON_ALLOW = ["/", "/_next/static/"];
const COMMON_DISALLOW = ["/api/", "/_next/data/"];

// AI search / LLM crawlers — kept as an explicit opt-in list (functionally
// covered by the `*` wildcard, but the explicit allow is a public signal
// that the site welcomes AI-assisted search and citation).
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "Claude-Web",
  "anthropic-ai",
  "ClaudeBot",
  "Amazonbot",
  "CCBot",
  "Google-Extended",
  "PerplexityBot",
  "Applebot-Extended",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule — covers every bot not explicitly listed below.
      {
        userAgent: "*",
        allow: COMMON_ALLOW,
        disallow: COMMON_DISALLOW,
      },
      // AI search engine crawlers — explicitly welcomed.
      {
        userAgent: AI_CRAWLERS,
        allow: COMMON_ALLOW,
        disallow: COMMON_DISALLOW,
      },
      // Russian-market crawlers with a polite crawl delay.
      {
        userAgent: ["Yandex", "YandexBot", "Mail.RU_Bot"],
        allow: COMMON_ALLOW,
        disallow: COMMON_DISALLOW,
        crawlDelay: 2,
      },
    ],
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: CANONICAL_ORIGIN,
  };
}
