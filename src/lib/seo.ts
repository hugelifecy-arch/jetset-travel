import type { Metadata } from "next";

export const CANONICAL_ORIGIN = "https://www.jetset-travel.com";
export const VERCEL_HOST = "jetset-travel.vercel.app";
export const OG_IMAGE = `${CANONICAL_ORIGIN}/images/jetset-og-image.jpg`;

export function localizedAlternates(locale: string, routePath = ""): Metadata["alternates"] {
  return {
    canonical: `/${locale}${routePath}`,
    languages: {
      en: `${CANONICAL_ORIGIN}/en${routePath}`,
      ru: `${CANONICAL_ORIGIN}/ru${routePath}`,
      "x-default": `${CANONICAL_ORIGIN}/en${routePath}`,
    },
  };
}

export function buildPageMetadata({
  locale,
  routePath = "",
  title,
  description,
}: {
  locale: string;
  routePath?: string;
  title: string;
  description: string;
}): Metadata {
  const isRussian = locale === "ru";

  return {
    title: { absolute: title },
    description,
    // Hreflang + canonical are rendered by HreflangTags component in locale layout
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
          alt: "JetSet Travel Cyprus",
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
