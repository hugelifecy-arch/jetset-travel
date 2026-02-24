import type { Metadata } from "next";

export const CANONICAL_ORIGIN = "https://www.jetset-travel.com";
export const VERCEL_HOST = "jetset-travel.vercel.app";

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
