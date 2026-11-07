import type { MetadataRoute } from "next";
import { getCanonicalUrl, getCanonicalUrlFromLocalePath, LOCALES, type Locale } from "../lib/canonical.ts";
import { getPostBySlug, getPublishedPosts } from "../lib/blog.ts";
import { pageLastModified } from "../lib/page-dates.ts";
import { counterpartPath, indexableStaticPages } from "../lib/page-routes.ts";

/**
 * sitemap.xml, built entirely from source so nothing is hand-listed:
 *  - static pages: every route folder under src/app/[locale]/ (lib/page-routes.ts),
 *    minus locale variants that redirect and noindexed stubs;
 *  - blog posts: every published post in content/blog.
 *
 * Every <loc> is the page's own canonical (lib/canonical.ts): https://www,
 * locale-prefixed, no trailing slash, no query string.
 *
 * <lastmod> = each page's last real content change, from
 * src/lib/page-dates.ts (shared with the pages' structured-data
 * dateModified; a new route folder without a date fails the build and the
 * tests). Never one date for every URL; never bumped for a
 * title/description-only edit. Blog posts use their frontmatter.
 */
export const dynamic = "force-static";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

type PageHints = {
  priority?: number;
  changeFrequency?: ChangeFrequency;
  /**
   * The page lists blog posts, so a new or edited post changes it too:
   * the homepage strip shows the newest 3 posts, /blog shows all of them.
   */
  listsPosts?: number | "all";
};

/** Defaults for any route folder not listed in PAGE_HINTS. */
const DEFAULT_HINTS = { priority: 0.8, changeFrequency: "monthly" } as const;

/**
 * Optional per-route hints. A route does NOT need an entry here to be in the
 * sitemap — only to differ from DEFAULT_HINTS.
 */
const PAGE_HINTS: Record<string, PageHints> = {
  "": { priority: 1.0, changeFrequency: "weekly", listsPosts: 3 },
  "/faq": { priority: 0.6 },
  "/blog": { priority: 0.6, changeFrequency: "weekly", listsPosts: "all" },
  // Private & Family Office Travel — discovery is deliberately quiet
  // (nav/footer/direct URL only), hence the lower priority.
  "/private": { priority: 0.7 },
  "/privacy": { priority: 0.4, changeFrequency: "yearly" },
  "/terms": { priority: 0.4, changeFrequency: "yearly" },
  // Phase 7 — Schengen 2026 topic hub: consolidates the cluster winning
  // impressions in Search Console.
  "/schengen-cyprus-2026": { priority: 0.9 },
  // Labour & VFR flights campaign (Oct 2026) main service page.
  "/labour-vfr-flights-cyprus": { priority: 0.9 },
};

type Post = ReturnType<typeof getPublishedPosts>[number];

const postDate = (post: Post) => post.frontmatter.dateModified ?? post.frontmatter.date;

/** The page's own date, or a newer date of a post it lists. */
function pageDate(route: string, locale: Locale, hints: PageHints): string {
  const own = pageLastModified(route, locale);
  if (!hints.listsPosts) return own;
  const posts = getPublishedPosts(locale);
  const listed = hints.listsPosts === "all" ? posts : posts.slice(0, hints.listsPosts);
  return [own, ...listed.map(postDate)].sort().at(-1)!;
}

/**
 * hreflang map from per-locale URLs. Phase 5: explicit en-GB / ru-RU codes
 * alongside the bare language codes, matching the <link rel="alternate">
 * tags the pages render (lib/seo.ts localizedAlternates). x-default is the
 * English page, else the only version that exists.
 */
function hreflang(urls: Partial<Record<Locale, string>>): Record<string, string> {
  const languages: Record<string, string> = {};
  if (urls.en) languages.en = urls.en;
  if (urls.ru) languages.ru = urls.ru;
  if (urls.en) languages["en-GB"] = urls.en;
  if (urls.ru) languages["ru-RU"] = urls.ru;
  languages["x-default"] = (urls.en ?? urls.ru)!;
  return languages;
}

function staticEntries(): MetadataRoute.Sitemap {
  const pages = indexableStaticPages();
  const indexable = new Set(pages.map((p) => p.path));
  return pages.map(({ route, locale, path }) => {
    const hints = PAGE_HINTS[route] ?? {};
    const urls: Partial<Record<Locale, string>> = {};
    for (const l of LOCALES) {
      const counterpart = l === locale ? path : counterpartPath(route, l, indexable);
      if (counterpart) urls[l] = getCanonicalUrlFromLocalePath(counterpart);
    }
    return {
      url: getCanonicalUrlFromLocalePath(path),
      lastModified: pageDate(route, locale, hints),
      changeFrequency: hints.changeFrequency ?? DEFAULT_HINTS.changeFrequency,
      priority: hints.priority ?? DEFAULT_HINTS.priority,
      alternates: { languages: hreflang(urls) },
    };
  });
}

/**
 * Published posts. Each uses its own frontmatter `dateModified` (falling back
 * to `date`) as lastmod. The translation is an hreflang alternate only if it
 * is itself a published post in the other locale.
 */
function blogEntries(): MetadataRoute.Sitemap {
  return getPublishedPosts().map((post) => {
    const { slug, translationSlug } = post.frontmatter;
    const locale: Locale = post.frontmatter.locale === "ru" ? "ru" : "en";
    const other: Locale = locale === "en" ? "ru" : "en";
    const urls: Partial<Record<Locale, string>> = {
      [locale]: getCanonicalUrl(`/blog/${slug}`, locale),
    };
    const translation = translationSlug ? getPostBySlug(translationSlug) : null;
    if (translation?.frontmatter.status === "published" && translation.frontmatter.locale === other) {
      urls[other] = getCanonicalUrl(`/blog/${translationSlug}`, other);
    }
    return {
      url: urls[locale]!,
      lastModified: postDate(post),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: hreflang(urls) },
    };
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticEntries(), ...blogEntries()];
}
