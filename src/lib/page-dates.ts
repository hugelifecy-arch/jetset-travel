/**
 * Last real CONTENT change of each static page (YYYY-MM-DD), per route
 * path after the locale. One source for the sitemap's <lastmod> and the
 * pages' structured-data `dateModified`, so the two never disagree.
 *
 * Rules (Search Console, Nov 2026):
 *  - Bump a page's date in the same commit as a change to its copy,
 *    sections, links or structured data.
 *  - Do NOT bump it for a title/meta-description-only edit or for shared
 *    chrome (header, footer, CTA banners): Google reads lastmod as "the main
 *    content changed" and stops trusting a sitemap that cries wolf.
 *  - Never one date for every page.
 *  `npm run suggest:lastmod` derives these dates from git history.
 *
 * A value is one date for both locales, or { en, ru } when they differ.
 */
import type { Locale } from "./canonical.ts";

export type LastModified = string | Record<Locale, string>;

export const PAGE_LAST_MODIFIED: Readonly<Record<string, LastModified>> = {
  "": "2026-11-01",
  "/corporate-travel": "2026-11-01",
  "/luxury-travel": "2026-11-01",
  "/vip-services": "2026-10-26",
  "/visa-services": "2026-10-26",
  "/services": "2026-11-01",
  "/hotel-reservations": "2026-11-01",
  "/cruises": "2026-10-23",
  "/about": "2026-10-23",
  "/contact": "2026-10-26",
  "/quote": "2026-10-26",
  "/faq": "2026-10-23",
  "/blog": "2026-10-26",
  "/private": "2026-10-26",
  "/privacy": "2026-10-23",
  "/terms": "2026-10-23",
  "/schengen-cyprus-2026": "2026-11-01",
  "/labour-vfr-flights-cyprus": "2026-10-31",
  "/seasonal-staff-travel-cyprus": "2026-10-31",
  "/paphos-travel-agency": "2026-11-01",
  "/turisticheskoe-agentstvo-pafos": "2026-11-01",
  "/flight-tickets-cyprus": "2026-10-31",
  "/aviabilety-kipr": "2026-10-31",
};

/** The page's last content change in `locale`. Throws for an unknown path. */
export function pageLastModified(path: string, locale: string): string {
  const value = PAGE_LAST_MODIFIED[path];
  if (value === undefined) {
    throw new Error(`No last-modified date for "${path}": add it to src/lib/page-dates.ts`);
  }
  return typeof value === "string" ? value : value[locale === "ru" ? "ru" : "en"];
}
