/**
 * Destination-specific redirects: retired, merged and wrong-locale URLs.
 *
 * Single source of truth, consumed by `canonicalize()` (src/lib/canonicalize.ts)
 * so every variant of a retired URL — trailing slash, apex host, wrong-case
 * locale, missing locale, `?lang=` — reaches its final page in ONE 301.
 *
 * Why not `next.config.ts` `redirects()`: those run before the proxy, use
 * 308 for `permanent: true`, and only match the exact source. A request for
 * `/en/visa-services-cyprus/` used to take two hops (Next's built-in
 * trailing-slash 308, then the config 308) — Search Console counts each hop.
 *
 * Rules:
 *  - Keys and values are locale-prefixed, lower-case, NO trailing slash.
 *  - A destination must be a live page, never another source (no chains;
 *    `tests/redirects.test.js` enforces both).
 *  - When a page is merged or renamed, add BOTH locales here and point any
 *    older entry that targeted it straight at the new destination.
 */
import { BLOG_SLUG_PAIRS_EN_TO_RU } from "./blog-translation-pairs.ts";

type Pair = readonly [from: string, to: string];

/** The same retired slug → the same destination slug, in both locales. */
const bothLocales = (from: string, to: string): Pair[] => [
  [`/en/${from}`, `/en/${to}`],
  [`/ru/${from}`, `/ru/${to}`],
];

const STATIC_REDIRECTS: Pair[] = [
  // Legacy short path from before the locale split.
  ...bothLocales("luxury", "luxury-travel"),

  // Cross-locale slug bridges: each locale has its own slug for these.
  ["/ru/paphos-travel-agency", "/ru/turisticheskoe-agentstvo-pafos"],
  ["/en/turisticheskoe-agentstvo-pafos", "/en/paphos-travel-agency"],
  ["/ru/flight-tickets-cyprus", "/ru/aviabilety-kipr"],
  ["/en/aviabilety-kipr", "/en/flight-tickets-cyprus"],

  // Retired transliterated slugs (redirect-only stubs, retired May 2026).
  ...bothLocales("vizovye-uslugi-kipr", "visa-services"),
  ...bothLocales("luxusnyy-otdykh-kipr", "luxury-travel"),
  ...bothLocales("korporativnye-poezdki-kipr", "corporate-travel"),
  ...bothLocales("bronirovanie-otelej-kipr", "hotel-reservations"),

  // 22 Oct 2026: /visa-services-cyprus merged into /visa-services (same
  // service, same searches; Google had never indexed it).
  ...bothLocales("visa-services-cyprus", "visa-services"),

  // 1 Nov 2026: the "*-cyprus" duplicates were merged into the main
  // service pages (Search Console cannibalisation); their unique sections
  // moved over. The main pages carry the nav, footer, blog and backlinks.
  ...bothLocales("hotel-booking-cyprus", "hotel-reservations"),
  ...bothLocales("luxury-travel-cyprus", "luxury-travel"),
  ...bothLocales("corporate-travel-cyprus", "corporate-travel"),
];

/**
 * Wrong-locale blog slugs (/en/blog/<ru-slug>, /ru/blog/<en-slug>) → the
 * translated article in the requested locale (never the blog index).
 * Bing Webmaster indexed some of these (Oct 2026).
 */
function wrongLocaleBlogPairs(): Pair[] {
  return Object.entries(BLOG_SLUG_PAIRS_EN_TO_RU).flatMap(([en, ru]): Pair[] => [
    [`/en/blog/${ru}`, `/en/blog/${en}`],
    [`/ru/blog/${en}`, `/ru/blog/${ru}`],
  ]);
}

/** Source path → destination path. Lower-case, no trailing slash. */
export const PATH_REDIRECTS: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries([...STATIC_REDIRECTS, ...wrongLocaleBlogPairs()]),
);

/**
 * Destination for a canonical-form pathname (locale-prefixed, no trailing
 * slash), or `null` when it is not a retired URL. Matching ignores case,
 * like Next.js `redirects()` did.
 */
export function resolvePathRedirect(pathname: string): string | null {
  return PATH_REDIRECTS[pathname.toLowerCase()] ?? null;
}
