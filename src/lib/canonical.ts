/**
 * Single source of truth for canonical URL construction and hreflang
 * alternates across the codebase.
 *
 * Canonical URL form (Phase 3 — confirmed by GSC Performance data):
 *  - Origin:         https://www.jetset-travel.com
 *  - Locale root:    /en , /ru   (NO trailing slash)
 *  - Section pages:  /en/corporate-travel , /ru/blog   (NO trailing slash)
 *  - Blog posts:     /en/blog/<slug>    (NO trailing slash)
 *
 * Google's selected canonical on this site is the no-slash form for almost
 * every page (see docs/seo/phase-3-performance-report.md). Every consumer
 * (Metadata `alternates`, sitemap `<loc>`, hand-rolled JSON-LD / og:url /
 * BreadcrumbList links) MUST derive its URLs from `getCanonicalUrl` so the
 * <link rel="canonical"> rendered in HTML always matches the URL listed in
 * sitemap.xml byte-for-byte.
 */
export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const CANONICAL_ORIGIN = "https://www.jetset-travel.com";

/**
 * Normalise a route path to the canonical form:
 *  - always leading slash
 *  - NO trailing slash (except for the empty/root path which is "/")
 *  - no duplicated slashes
 *
 * Input examples accepted:  ""  "/"  "/about"  "/about/"  "blog/foo"
 */
function normalizeRoutePath(path: string): string {
  let p = path.trim();
  if (!p || p === "/") return "/";
  if (!p.startsWith("/")) p = `/${p}`;
  p = p.replace(/\/+/g, "/");
  if (p.length > 1 && p.endsWith("/")) p = p.replace(/\/+$/, "");
  return p;
}

/**
 * Build an absolute canonical URL for a given locale + route-relative path.
 *
 * @param routePath  path AFTER the locale segment (e.g. "/about", "/blog/foo").
 *                   Pass "" or "/" for the locale root.
 * @param locale     "en" | "ru"
 */
export function getCanonicalUrl(routePath: string, locale: Locale): string {
  const suffix = normalizeRoutePath(routePath);
  // locale root: /en  — no trailing slash
  if (suffix === "/") {
    return `${CANONICAL_ORIGIN}/${locale}`;
  }
  return `${CANONICAL_ORIGIN}/${locale}${suffix}`;
}

/**
 * Build an absolute canonical URL from a locale-prefixed path
 * (e.g. "/en/about" or "ru/blog/foo").
 */
export function getCanonicalUrlFromLocalePath(localePath: string): string {
  let p = localePath.trim();
  if (!p.startsWith("/")) p = `/${p}`;
  p = p.replace(/\/+/g, "/");
  if (p.length > 1 && p.endsWith("/")) p = p.replace(/\/+$/, "");
  return `${CANONICAL_ORIGIN}${p}`;
}

/**
 * Hreflang alternates source of truth.
 *
 * Keys are canonical locale-prefixed paths (NO trailing slash).
 * Values list the equivalent path in EACH locale (NO trailing slash).
 *
 * Rules:
 *  - Every URL that ships in sitemap.xml with an xhtml:link alternate MUST
 *    appear here.
 *  - Every entry must include BOTH an `en` and a `ru` key if a translation
 *    exists; otherwise only include the locales that have real content.
 *  - Blog posts are NOT listed here — they are derived dynamically from
 *    frontmatter `translationSlug` in src/lib/blog.ts.
 */
export const LOCALE_ALTERNATES: Record<
  string,
  Partial<Record<Locale, string>>
> = {
  // --- Language roots ---
  "/en": { en: "/en", ru: "/ru" },
  "/ru": { en: "/en", ru: "/ru" },

  // --- Section/service pages with identical paths in both locales ---
  "/en/corporate-travel": {
    en: "/en/corporate-travel",
    ru: "/ru/corporate-travel",
  },
  "/ru/corporate-travel": {
    en: "/en/corporate-travel",
    ru: "/ru/corporate-travel",
  },
  "/en/luxury-travel": {
    en: "/en/luxury-travel",
    ru: "/ru/luxury-travel",
  },
  "/ru/luxury-travel": {
    en: "/en/luxury-travel",
    ru: "/ru/luxury-travel",
  },
  "/en/visa-services": {
    en: "/en/visa-services",
    ru: "/ru/visa-services",
  },
  "/ru/visa-services": {
    en: "/en/visa-services",
    ru: "/ru/visa-services",
  },
  "/en/hotel-reservations": {
    en: "/en/hotel-reservations",
    ru: "/ru/hotel-reservations",
  },
  "/ru/hotel-reservations": {
    en: "/en/hotel-reservations",
    ru: "/ru/hotel-reservations",
  },
  "/en/services": { en: "/en/services", ru: "/ru/services" },
  "/ru/services": { en: "/en/services", ru: "/ru/services" },
  "/en/cruises": { en: "/en/cruises", ru: "/ru/cruises" },
  "/ru/cruises": { en: "/en/cruises", ru: "/ru/cruises" },
  "/en/about": { en: "/en/about", ru: "/ru/about" },
  "/ru/about": { en: "/en/about", ru: "/ru/about" },
  "/en/contact": { en: "/en/contact", ru: "/ru/contact" },
  "/ru/contact": { en: "/en/contact", ru: "/ru/contact" },
  "/en/quote": { en: "/en/quote", ru: "/ru/quote" },
  "/ru/quote": { en: "/en/quote", ru: "/ru/quote" },
  "/en/faq": { en: "/en/faq", ru: "/ru/faq" },
  "/ru/faq": { en: "/en/faq", ru: "/ru/faq" },
  "/en/blog": { en: "/en/blog", ru: "/ru/blog" },
  "/ru/blog": { en: "/en/blog", ru: "/ru/blog" },
  "/en/privacy": { en: "/en/privacy", ru: "/ru/privacy" },
  "/ru/privacy": { en: "/en/privacy", ru: "/ru/privacy" },
  "/en/terms": { en: "/en/terms", ru: "/ru/terms" },
  "/ru/terms": { en: "/en/terms", ru: "/ru/terms" },

  // --- Cross-locale pages with localised slugs ---
  "/en/paphos-travel-agency": {
    en: "/en/paphos-travel-agency",
    ru: "/ru/turisticheskoe-agentstvo-pafos",
  },
  "/ru/turisticheskoe-agentstvo-pafos": {
    en: "/en/paphos-travel-agency",
    ru: "/ru/turisticheskoe-agentstvo-pafos",
  },
  // The four "cyprus" landing pages below use the SAME Latin slug in both
  // locales. Their transliterated Russian counterparts (vizovye-uslugi-kipr,
  // luxusnyy-otdykh-kipr, korporativnye-poezdki-kipr, bronirovanie-otelej-kipr)
  // were retired because they were redirect-only stubs that looped against
  // the EN page's locale guard — see next.config.ts for the retiring 308s.
  "/en/corporate-travel-cyprus": {
    en: "/en/corporate-travel-cyprus",
    ru: "/ru/corporate-travel-cyprus",
  },
  "/ru/corporate-travel-cyprus": {
    en: "/en/corporate-travel-cyprus",
    ru: "/ru/corporate-travel-cyprus",
  },
  "/en/visa-services-cyprus": {
    en: "/en/visa-services-cyprus",
    ru: "/ru/visa-services-cyprus",
  },
  "/ru/visa-services-cyprus": {
    en: "/en/visa-services-cyprus",
    ru: "/ru/visa-services-cyprus",
  },
  "/en/luxury-travel-cyprus": {
    en: "/en/luxury-travel-cyprus",
    ru: "/ru/luxury-travel-cyprus",
  },
  "/ru/luxury-travel-cyprus": {
    en: "/en/luxury-travel-cyprus",
    ru: "/ru/luxury-travel-cyprus",
  },
  "/en/hotel-booking-cyprus": {
    en: "/en/hotel-booking-cyprus",
    ru: "/ru/hotel-booking-cyprus",
  },
  "/ru/hotel-booking-cyprus": {
    en: "/en/hotel-booking-cyprus",
    ru: "/ru/hotel-booking-cyprus",
  },
  // flight-tickets-cyprus / aviabilety-kipr keeps the per-locale slug pair
  // because both locales have full standalone content pages (see
  // src/app/[locale]/aviabilety-kipr/page.tsx) and edge 308s in next.config.ts.
  "/en/flight-tickets-cyprus": {
    en: "/en/flight-tickets-cyprus",
    ru: "/ru/aviabilety-kipr",
  },
  "/ru/aviabilety-kipr": {
    en: "/en/flight-tickets-cyprus",
    ru: "/ru/aviabilety-kipr",
  },
};

/**
 * Returns the hreflang language map (absolute URLs) for a canonical
 * locale-prefixed path. Always includes an `x-default` pointing at the
 * English variant if available, else the path itself.
 */
export function getHreflangAlternates(
  localePath: string,
): Record<string, string> {
  const key = normalizeLocalePath(localePath);
  const entry = LOCALE_ALTERNATES[key];
  const out: Record<string, string> = {};
  if (entry) {
    for (const [loc, path] of Object.entries(entry)) {
      if (path) out[loc] = `${CANONICAL_ORIGIN}${path}`;
    }
  } else {
    // Fallback: assume the URL has no translated alternate. Emit itself only.
    out[extractLocaleFromPath(key) ?? DEFAULT_LOCALE] =
      `${CANONICAL_ORIGIN}${key}`;
  }
  if (!out["x-default"]) {
    out["x-default"] = out.en ?? Object.values(out)[0]!;
  }
  return out;
}

function normalizeLocalePath(p: string): string {
  let out = p.trim();
  if (!out.startsWith("/")) out = `/${out}`;
  out = out.replace(/\/+/g, "/");
  if (out.length > 1 && out.endsWith("/")) out = out.replace(/\/+$/, "");
  return out;
}

function extractLocaleFromPath(p: string): Locale | null {
  const m = p.match(/^\/(en|ru)(?:\/|$)/);
  return m ? (m[1] as Locale) : null;
}

/**
 * Resolve the canonical path for the same content in the other locale.
 *
 * Used by the language switcher in the header so it points at a real
 * 200-OK URL instead of guessing one by string substitution. Returns
 * `null` when no counterpart exists (the caller should hide the link).
 *
 * Blog posts are NOT covered here — they have per-post translation
 * metadata; see `src/lib/i18n-route-resolver.ts` for the combined map.
 */
export function getAlternateLocalePath(
  currentLocalePath: string,
  targetLocale: Locale,
): string | null {
  const key = normalizeLocalePath(currentLocalePath);
  const entry = LOCALE_ALTERNATES[key];
  if (!entry) return null;
  const target = entry[targetLocale];
  return target ?? null;
}
