"use client";

import { usePathname } from "next/navigation";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import JsonLd from "./JsonLd";
import { PATH_DISPLAY_NAMES, getHomeName, slugToTitle } from "./breadcrumb-names";

export default function BreadcrumbSchema() {
  const pathname = usePathname();

  const parts = pathname.split("/").filter(Boolean);
  const locale = parts[0] || "en";
  const segments = parts.slice(1);

  const names = PATH_DISPLAY_NAMES[locale] ?? PATH_DISPLAY_NAMES.en;
  const homeName = getHomeName(locale);

  const items: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeName,
      item: `${CANONICAL_ORIGIN}/${locale}`,
    },
  ];

  let cumulativePath = `/${locale}`;
  for (let i = 0; i < segments.length; i++) {
    cumulativePath += `/${segments[i]}`;
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: names[segments[i]] ?? slugToTitle(segments[i]),
      item: `${CANONICAL_ORIGIN}${cumulativePath}`,
    });
  }

  // Don't render breadcrumbs if we're on the homepage (only one item)
  if (items.length < 2) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };

  return <JsonLd data={schema} />;
}
