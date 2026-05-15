import type { Metadata } from "next";
import {
  CANONICAL_ORIGIN,
  getCanonicalUrl,
  getHreflangAlternates,
  type Locale,
} from "@/lib/canonical";

export { CANONICAL_ORIGIN };
export const VERCEL_HOST = "jetset-travel.vercel.app";
export const OG_IMAGE = `${CANONICAL_ORIGIN}/images/jetset-og-image.jpg`;

/** Last-reviewed date for static service pages. Bump when service content is materially updated. */
export const SERVICE_LAST_UPDATED = "2026-04-14";

/**
 * Build the Metadata `alternates` object for a page.
 *
 * `routePath` is the path AFTER the locale segment (e.g. "/about", "/blog/foo").
 * Pass "" or "/" for the locale root.
 *
 * If the EN and RU variants live at DIFFERENT localised slugs (e.g.
 * /en/paphos-travel-agency vs /ru/turisticheskoe-agentstvo-pafos), pass
 * `languagePaths` to provide both — otherwise the same `routePath` is used
 * for both locales.
 *
 * Every URL emitted carries a trailing slash so it matches the sitemap <loc>
 * byte-for-byte.
 */
export function localizedAlternates(
  locale: string,
  routePath = "",
  languagePaths?: { en: string; ru: string },
): Metadata["alternates"] {
  const loc = (locale === "ru" ? "ru" : "en") as Locale;
  const enPath = languagePaths?.en ?? routePath;
  const ruPath = languagePaths?.ru ?? routePath;

  const canonical = getCanonicalUrl(loc === "en" ? enPath : ruPath, loc);

  return {
    canonical,
    languages: {
      en: getCanonicalUrl(enPath, "en"),
      ru: getCanonicalUrl(ruPath, "ru"),
      "x-default": getCanonicalUrl(enPath, "en"),
    },
  };
}

/**
 * Convenience: get the hreflang map for the canonical locale-prefixed path
 * (e.g. "/en/corporate-travel-cyprus/"). Delegates to the LOCALE_ALTERNATES
 * source of truth so sitemap and pages can't drift.
 */
export { getHreflangAlternates };

export function buildPageMetadata({
  locale,
  routePath = "",
  title,
  description,
  keywords,
  languagePaths,
}: {
  locale: string;
  routePath?: string;
  title: string;
  description: string;
  keywords?: string[];
  languagePaths?: { en: string; ru: string };
}): Metadata {
  const isRussian = locale === "ru";
  const loc = (isRussian ? "ru" : "en") as Locale;
  const selfPath =
    languagePaths ? (isRussian ? languagePaths.ru : languagePaths.en) : routePath;
  const canonicalUrl = getCanonicalUrl(selfPath, loc);

  return {
    title: { absolute: title },
    description,
    ...(keywords && { keywords }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: localizedAlternates(locale, routePath, languagePaths),
    openGraph: {
      type: "website",
      siteName: "JetSet Travel Cyprus",
      title,
      description,
      url: canonicalUrl,
      locale: isRussian ? "ru_RU" : "en_CY",
      alternateLocale: isRussian ? "en_CY" : "ru_RU",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: isRussian
            ? "JetSet Travel Cyprus — Туристическое агентство в Пафосе, Кипр"
            : "JetSet Travel Cyprus — Travel Agency in Paphos, Cyprus",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
