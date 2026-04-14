import type { Metadata } from "next";

export const CANONICAL_ORIGIN = "https://www.jetset-travel.com";
export const VERCEL_HOST = "jetset-travel.vercel.app";
export const OG_IMAGE = `${CANONICAL_ORIGIN}/images/jetset-og-image.jpg`;

export function localizedAlternates(
  locale: string,
  routePath = "",
  languagePaths?: { en: string; ru: string },
): Metadata["alternates"] {
  const enPath = languagePaths?.en ?? routePath;
  const ruPath = languagePaths?.ru ?? routePath;

  return {
    canonical: `${CANONICAL_ORIGIN}/${locale}${locale === "en" ? enPath : locale === "ru" ? ruPath : routePath}`,
    languages: {
      en: `${CANONICAL_ORIGIN}/en${enPath}`,
      ru: `${CANONICAL_ORIGIN}/ru${ruPath}`,
      "x-default": `${CANONICAL_ORIGIN}/en${enPath}`,
    },
  };
}

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
      url: `${CANONICAL_ORIGIN}/${locale}${routePath}`,
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
