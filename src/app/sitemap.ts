import type { MetadataRoute } from "next";
import { NOINDEX_LOCALE_PATHS } from "../lib/seo.ts";
import {
  CANONICAL_ORIGIN,
  LOCALE_ALTERNATES,
  getCanonicalUrl,
  type Locale,
} from "../lib/canonical.ts";
import { getPublishedPosts } from "../lib/blog.ts";

const locales = ["en", "ru"] as const satisfies readonly Locale[];

/**
 * <lastmod> rules (Search Console, Nov 2026): a date changes ONLY when the
 * page's content changes — its copy, sections, links or structured data.
 * A metadata-only edit (title, meta description) or a change to shared
 * chrome (header, footer, CTA banners) does not count. Never one date for
 * every URL: Google then stops trusting lastmod for the whole sitemap.
 *
 * Bump a page's date in the same commit as its content change.
 * `npm run suggest:lastmod` derives the dates from git history.
 */
type LastModified = string | Record<Locale, string>;

type StaticPage = {
  /** route path AFTER the locale (e.g. "" for locale root, "/about") */
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  /** YYYY-MM-DD of the last content change (one date, or one per locale). */
  lastModified: LastModified;
  /**
   * The page lists blog posts, so a new or edited post changes it too:
   * the homepage strip shows the newest 3 posts, /blog shows all of them.
   */
  listsPosts?: number | "all";
};

const pages: StaticPage[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly", lastModified: "2026-11-01", listsPosts: 3 },
  { path: "/corporate-travel", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-11-01" },
  { path: "/luxury-travel", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-11-01" },
  { path: "/vip-services", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-26" },
  { path: "/visa-services", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-26" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-11-01" },
  { path: "/hotel-reservations", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-11-01" },
  { path: "/cruises", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-23" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-23" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-26" },
  { path: "/quote", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-26" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-10-23" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly", lastModified: "2026-10-26", listsPosts: "all" },
  // Private & Family Office Travel — discovery is deliberately quiet
  // (nav/footer/direct URL only), hence the lower priority.
  { path: "/private", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-10-26" },
  // The two cross-locale pairs with different slugs per locale (paphos /
  // flight-tickets) live in `crossLocalePageDefs` below.
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly", lastModified: "2026-10-23" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly", lastModified: "2026-10-23" },
  // Phase 7 — Schengen 2026 topic hub. Higher priority than the service
  // pages because it consolidates the cluster the GSC data shows is
  // currently winning impressions (+143% on the Schengen guide post).
  { path: "/schengen-cyprus-2026", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-11-01" },
  // Labour & VFR flights campaign (Oct 2026): the main service page and the
  // employer page for hotels/restaurants arranging seasonal staff flights.
  { path: "/labour-vfr-flights-cyprus", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-31" },
  { path: "/seasonal-staff-travel-cyprus", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-31" },
];

/**
 * Cross-locale pages with different slugs per locale. Each entry emits
 * BOTH /en/<def.en> and /ru/<def.ru> and wires them together via
 * `alternates.languages` (which Next.js renders as <xhtml:link>).
 */
const crossLocalePageDefs: Array<{ en: string; ru: string; lastModified: LastModified }> = [
  { en: "paphos-travel-agency", ru: "turisticheskoe-agentstvo-pafos", lastModified: "2026-11-01" },
  { en: "flight-tickets-cyprus", ru: "aviabilety-kipr", lastModified: "2026-10-31" },
];

const dateIn = (lastModified: LastModified, locale: Locale) =>
  typeof lastModified === "string" ? lastModified : lastModified[locale];

const postDate = (post: ReturnType<typeof getPublishedPosts>[number]) =>
  post.frontmatter.dateModified ?? post.frontmatter.date;

/** The page's own date, or a newer date of a post it lists. */
function pageDate(page: StaticPage, locale: Locale): string {
  const own = dateIn(page.lastModified, locale);
  if (!page.listsPosts) return own;
  const posts = getPublishedPosts(locale);
  const listed = page.listsPosts === "all" ? posts : posts.slice(0, page.listsPosts);
  return [own, ...listed.map(postDate)].sort().at(-1)!;
}

/**
 * Build the `alternates.languages` map for a canonical locale-prefixed path
 * by reading from LOCALE_ALTERNATES. If the URL isn't registered there we
 * fall back to self-referencing the single locale.
 */
function alternatesFor(localePath: string) {
  // LOCALE_ALTERNATES keys are no-slash form; strip a stray trailing slash
  // before lookup so callers can pass either.
  const key =
    localePath.length > 1 && localePath.endsWith("/")
      ? localePath.replace(/\/+$/, "")
      : localePath;
  const entry = LOCALE_ALTERNATES[key];
  const languages: Record<string, string> = {};
  // Noindexed locale versions are not valid hreflang targets (see
  // localizedAlternates in lib/seo.ts), so they are left out here too.
  if (entry?.en && !NOINDEX_LOCALE_PATHS.has(entry.en)) languages.en = `${CANONICAL_ORIGIN}${entry.en}`;
  if (entry?.ru && !NOINDEX_LOCALE_PATHS.has(entry.ru)) languages.ru = `${CANONICAL_ORIGIN}${entry.ru}`;
  // Phase 5: emit explicit regional codes alongside the bare language codes.
  if (languages.en) languages["en-GB"] = languages.en;
  if (languages.ru) languages["ru-RU"] = languages.ru;
  languages["x-default"] =
    languages.en ?? languages.ru ?? `${CANONICAL_ORIGIN}${localePath}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = locales.flatMap((locale) =>
    pages
      .map((page) => {
        const url = getCanonicalUrl(page.path, locale);
        const localePath = new URL(url).pathname;
        return {
          url,
          lastModified: pageDate(page, locale),
          changeFrequency: page.changeFrequency,
          priority: page.priority,
          alternates: alternatesFor(localePath),
        };
      })
      // A sitemap must list only indexable URLs; noindexed stubs stay out.
      .filter((entry) => !NOINDEX_LOCALE_PATHS.has(new URL(entry.url).pathname)),
  );

  const crossLocalePages = crossLocalePageDefs.flatMap((def) =>
    locales.map((locale) => {
      const url = getCanonicalUrl(`/${def[locale]}`, locale);
      return {
        url,
        lastModified: dateIn(def.lastModified, locale),
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: alternatesFor(new URL(url).pathname),
      };
    }),
  );

  // Add published blog posts to sitemap. Each post uses its own
  // frontmatter `dateModified` (falling back to `date`) as the lastmod, so
  // a corrected post tells Google it changed (no blanket today-for-everything).
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
    // Phase 5: emit explicit regional codes alongside language-only ones.
    if (languages.en) languages["en-GB"] = languages.en;
    if (languages.ru) languages["ru-RU"] = languages.ru;

    return {
      url,
      lastModified: postDate(post),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages },
    };
  });

  return [...staticPages, ...crossLocalePages, ...blogPages];
}
