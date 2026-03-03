"use client";

import { usePathname } from "next/navigation";

const CANONICAL_ORIGIN = "https://www.jetset-travel.com";

// Cross-locale route mappings for pages with different slugs per locale
const CROSS_LOCALE_ROUTES: Record<string, { en: string; ru: string }> = {
  "/paphos-travel-agency": {
    en: "/paphos-travel-agency",
    ru: "/turisticheskoe-agentstvo-pafos",
  },
  "/turisticheskoe-agentstvo-pafos": {
    en: "/paphos-travel-agency",
    ru: "/turisticheskoe-agentstvo-pafos",
  },
};

export default function HreflangTags() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";
  const path = segments.slice(1).join("/");
  const routePath = path ? `/${path}` : "";

  const mapping = CROSS_LOCALE_ROUTES[routePath];

  const canonicalUrl = `${CANONICAL_ORIGIN}/${locale}${routePath}`;
  const enUrl = mapping
    ? `${CANONICAL_ORIGIN}/en${mapping.en}`
    : `${CANONICAL_ORIGIN}/en${routePath}`;
  const ruUrl = mapping
    ? `${CANONICAL_ORIGIN}/ru${mapping.ru}`
    : `${CANONICAL_ORIGIN}/ru${routePath}`;

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ru" href={ruUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
    </>
  );
}
