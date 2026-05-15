import type { MetadataRoute } from "next";
import { SERVICE_LAST_UPDATED } from "../lib/seo.ts";
import {
  CANONICAL_ORIGIN,
  LOCALE_ALTERNATES,
  getCanonicalUrl,
  type Locale,
} from "../lib/canonical.ts";
import { getPublishedPosts } from "../lib/blog.ts";

const locales = ["en", "ru"] as const satisfies readonly Locale[];

type StaticPage = {
  /** route path AFTER the locale (e.g. "" for locale root, "/about") */
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

/**
 * Bare paths the middleware 301-redirects to a different canonical URL.
 * Keep this in sync with `BARE_PATH_SPECIALS` in `src/lib/canonicalize.ts`.
 * Anything matching is rejected before it can be emitted as a <loc>.
 */
const REDIRECTED_ROUTE_PATHS: ReadonlySet<string> = new Set([
  "/luxury",
]);

const pages: StaticPage[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/corporate-travel", priority: 0.8, changeFrequency: "monthly" },
  { path: "/luxury-travel", priority: 0.8, changeFrequency: "monthly" },
  { path: "/visa-services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hotel-reservations", priority: 0.8, changeFrequency: "monthly" },
  { path: "/cruises", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/quote", priority: 0.8, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  // The four "*-cyprus" SEO landing pages share one Latin slug across both
  // locales (their transliterated Russian counterparts were retired — see
  // canonical.ts and next.config.ts). The two genuinely-bilingual cross-locale
  // pairs (paphos / flight-tickets) live in `crossLocalePageDefs` below.
  { path: "/corporate-travel-cyprus", priority: 0.8, changeFrequency: "monthly" },
  { path: "/luxury-travel-cyprus", priority: 0.8, changeFrequency: "monthly" },
  { path: "/visa-services-cyprus", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hotel-booking-cyprus", priority: 0.8, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
];

/**
 * Cross-locale pages with different slugs per locale. Each entry emits
 * BOTH /en/<def.en>/ and /ru/<def.ru>/ and wires them together via
 * `alternates.languages` (which Next.js renders as <xhtml:link>).
 */
const crossLocalePageDefs: Array<{ en: string; ru: string }> = [
  { en: "paphos-travel-agency", ru: "turisticheskoe-agentstvo-pafos" },
  { en: "flight-tickets-cyprus", ru: "aviabilety-kipr" },
];

/**
 * Build the `alternates.languages` map for a canonical locale-prefixed path
 * by reading from LOCALE_ALTERNATES. If the URL isn't registered there we
 * fall back to self-referencing the single locale.
 */
function alternatesFor(localePath: string) {
  const entry = LOCALE_ALTERNATES[localePath];
  const languages: Record<string, string> = {};
  if (entry?.en) languages.en = `${CANONICAL_ORIGIN}${entry.en}`;
  if (entry?.ru) languages.ru = `${CANONICAL_ORIGIN}${entry.ru}`;
  languages["x-default"] =
    languages.en ?? languages.ru ?? `${CANONICAL_ORIGIN}${localePath}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Use a STABLE lastmod for unchanged static pages so Google doesn't
  // dismiss the signal (GSC flags sitemaps whose every URL always reports
  // today's date). Bump SERVICE_LAST_UPDATED in lib/seo.ts when service
  // content is materially edited.
  const staticLastMod = SERVICE_LAST_UPDATED;

  const staticPages = locales.flatMap((locale) =>
    pages
      .filter((page) => !REDIRECTED_ROUTE_PATHS.has(page.path))
      .map((page) => {
        const url = getCanonicalUrl(page.path, locale);
        const localePath = new URL(url).pathname;
        return {
          url,
          lastModified: staticLastMod,
          changeFrequency: page.changeFrequency,
          priority: page.priority,
          alternates: alternatesFor(localePath),
        };
      }),
  );

  const crossLocalePages = crossLocalePageDefs
    .filter(
      (def) =>
        !REDIRECTED_ROUTE_PATHS.has(`/${def.en}`) &&
        !REDIRECTED_ROUTE_PATHS.has(`/${def.ru}`),
    )
    .flatMap((def) => {
      const enUrl = getCanonicalUrl(`/${def.en}`, "en");
      const ruUrl = getCanonicalUrl(`/${def.ru}`, "ru");
      const enPath = new URL(enUrl).pathname;
      const ruPath = new URL(ruUrl).pathname;
      return [
        {
          url: enUrl,
          lastModified: staticLastMod,
          changeFrequency: "monthly" as const,
          priority: 0.8,
          alternates: alternatesFor(enPath),
        },
        {
          url: ruUrl,
          lastModified: staticLastMod,
          changeFrequency: "monthly" as const,
          priority: 0.8,
          alternates: alternatesFor(ruPath),
        },
      ];
    });

  // Add published blog posts to sitemap. Each post uses its own
  // frontmatter `date` as the lastmod (no blanket today-for-everything).
  const publishedPosts = getPublishedPosts();
  const blogPages = publishedPosts.map((post) => {
    const { locale: postLocale, slug, translationSlug } = post.frontmatter;
    const loc = (postLocale === "ru" ? "ru" : "en") as Locale;
    const url = getCanonicalUrl(`/blog/${slug}`, loc);

    // Build hreflang alternates based on whether a translation exists.
    const languages: Record<string, string> = {};
    if (translationSlug) {
      const enSlug = loc === "en" ? slug : translationSlug;
      const ruSlug = loc === "ru" ? slug : translationSlug;
      languages.en = getCanonicalUrl(`/blog/${enSlug}`, "en");
      languages.ru = getCanonicalUrl(`/blog/${ruSlug}`, "ru");
      languages["x-default"] = languages.en;
    } else if (loc === "en") {
      languages.en = url;
      languages["x-default"] = url;
    } else {
      languages.ru = url;
      languages["x-default"] = url;
    }

    return {
      url,
      lastModified: post.frontmatter.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages },
    };
  });

  return [...staticPages, ...crossLocalePages, ...blogPages];
}
