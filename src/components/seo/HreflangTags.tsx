"use client";

import { usePathname } from "next/navigation";

const CANONICAL_ORIGIN = "https://www.jetset-travel.com";

export default function HreflangTags() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";
  const path = segments.slice(1).join("/");
  const routePath = path ? `/${path}` : "";

  const canonicalUrl = `${CANONICAL_ORIGIN}/${locale}${routePath}`;
  const enUrl = `${CANONICAL_ORIGIN}/en${routePath}`;
  const ruUrl = `${CANONICAL_ORIGIN}/ru${routePath}`;

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ru" href={ruUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
    </>
  );
}
