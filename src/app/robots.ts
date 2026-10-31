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
      // Russian-market crawlers. No Crawl-delay and no Host: Yandex ignores
      // both (crawl rate is set in Yandex Webmaster; the main mirror comes
      // from the 301/308 redirects), and Webmaster flags them as obsolete.
      {
        userAgent: ["Yandex", "YandexBot", "Mail.RU_Bot"],
        allow: COMMON_ALLOW,
        disallow: COMMON_DISALLOW,
      },
    ],
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
  };
}
