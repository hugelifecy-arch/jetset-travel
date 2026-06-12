/**
 * Client-safe resolver that maps a locale-prefixed pathname (e.g.
 * `/en/about/`, `/ru/blog/digital-nomads-cyprus-guide/`) to the canonical
 * URL of the same content in the OTHER locale.
 *
 * Used by the language switcher in the header so it links only to real
 * 200-OK destinations instead of guessing by string substitution.
 *
 * Combines two sources of truth:
 *   1. `LOCALE_ALTERNATES` in `lib/canonical.ts` — static service pages.
 *   2. `BLOG_SLUG_PAIRS_EN_TO_RU` in `lib/blog-translation-pairs.ts` — the
 *      checked-in mirror of per-post `translationSlug` frontmatter (guarded
 *      against drift by tests/blog-translation-pairs.test.js).
 *
 * Both sources are plain objects, so this module runs in client components.
 * That matters: the header previously resolved the pathname server-side via
 * `headers()`, which opted every page on the site out of static rendering.
 *
 * Returns absolute canonical URLs (origin + locale + path, NO trailing slash),
 * or `null` for a locale when no counterpart exists.
 */
import {
  CANONICAL_ORIGIN,
  getAlternateLocalePath,
  getCanonicalUrl,
  LOCALES,
  type Locale,
} from "./canonical.ts";
import { getPairedBlogSlug } from "./blog-translation-pairs.ts";

export interface AlternateUrls {
  en: string | null;
  ru: string | null;
}

const LOCALE_PREFIX_RE = new RegExp(`^/(${LOCALES.join("|")})(?:/|$)`);
const BLOG_POST_RE = new RegExp(
  `^/(${LOCALES.join("|")})/blog/([^/]+)/?$`,
);

function normalizePath(p: string): string {
  let out = p.trim();
  if (!out.startsWith("/")) out = `/${out}`;
  out = out.replace(/\/+/g, "/");
  if (out.length > 1 && out.endsWith("/")) out = out.replace(/\/+$/, "");
  return out;
}

function extractLocale(p: string): Locale | null {
  const m = p.match(LOCALE_PREFIX_RE);
  return m ? (m[1] as Locale) : null;
}

/**
 * Resolve the canonical URLs for the EN and RU equivalents of `localePath`.
 *
 * For the current page's own locale, returns its self-canonical URL. For the
 * other locale, returns the equivalent URL if one exists, else `null`.
 *
 * Examples:
 *   resolveAlternateUrls("/en/about")
 *     → { en: ".../en/about", ru: ".../ru/about" }
 *   resolveAlternateUrls("/en/blog/digital-nomads-cyprus-guide")
 *     → { en: ".../en/blog/digital-nomads-cyprus-guide",
 *         ru: ".../ru/blog/digital-nomady-kipr-gid" }
 *   resolveAlternateUrls("/en/blog/some-untranslated-post")
 *     → { en: ".../en/blog/some-untranslated-post",
 *         ru: null }   // no Russian translation of this post
 */
export function resolveAlternateUrls(localePath: string): AlternateUrls {
  const path = normalizePath(localePath);

  // Blog post detail page: resolve via the checked-in slug-pair map.
  const blogMatch = path.match(BLOG_POST_RE);
  if (blogMatch) {
    const currentLocale = blogMatch[1] as Locale;
    const slug = blogMatch[2];

    const selfUrl = getCanonicalUrl(`/blog/${slug}`, currentLocale);
    const otherLocale: Locale = currentLocale === "en" ? "ru" : "en";
    const pairedSlug = getPairedBlogSlug(slug, otherLocale);
    // Untranslated or unknown slug — self-link the current locale only;
    // we can't fabricate a translated post URL that might 404.
    const otherUrl =
      pairedSlug && pairedSlug !== slug
        ? getCanonicalUrl(`/blog/${pairedSlug}`, otherLocale)
        : null;

    return currentLocale === "en"
      ? { en: selfUrl, ru: otherUrl }
      : { en: otherUrl, ru: selfUrl };
  }

  // Static / service page: look up in LOCALE_ALTERNATES.
  const currentLocale = extractLocale(path);
  if (!currentLocale) {
    // Path doesn't have a locale prefix — caller is responsible. Send them
    // to the locale roots, which always exist.
    return {
      en: getCanonicalUrl("/", "en"),
      ru: getCanonicalUrl("/", "ru"),
    };
  }

  const enPath = getAlternateLocalePath(path, "en");
  const ruPath = getAlternateLocalePath(path, "ru");

  // If the path isn't registered in LOCALE_ALTERNATES at all, fall back to
  // self-linking the current locale and hiding the other (rather than
  // emitting a guess that could 404).
  if (enPath === null && ruPath === null) {
    return {
      en: currentLocale === "en" ? `${CANONICAL_ORIGIN}${path}` : null,
      ru: currentLocale === "ru" ? `${CANONICAL_ORIGIN}${path}` : null,
    };
  }

  return {
    en: enPath ? `${CANONICAL_ORIGIN}${enPath}` : null,
    ru: ruPath ? `${CANONICAL_ORIGIN}${ruPath}` : null,
  };
}
