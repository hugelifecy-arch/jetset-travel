"use client";

import { usePathname } from "next/navigation";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import JsonLd from "./JsonLd";
import { PATH_DISPLAY_NAMES, getHomeName, slugToTitle } from "./breadcrumb-names";
import { breadcrumbListSchema, isBlogPostSegments, type BreadcrumbCrumb } from "./breadcrumb-list";

export default function BreadcrumbSchema() {
  const pathname = usePathname();

  const parts = pathname.split("/").filter(Boolean);
  const locale = parts[0] || "en";
  const segments = parts.slice(1);

  // Don't render breadcrumbs on the homepage (only one item).
  if (segments.length === 0) return null;
  // Blog posts output their own BreadcrumbList with the post title.
  if (isBlogPostSegments(segments)) return null;

  const names = PATH_DISPLAY_NAMES[locale] ?? PATH_DISPLAY_NAMES.en;
  const crumbs: BreadcrumbCrumb[] = [{ name: getHomeName(locale), href: `/${locale}` }];

  let cumulativePath = `/${locale}`;
  for (const segment of segments) {
    cumulativePath += `/${segment}`;
    crumbs.push({ name: names[segment] ?? slugToTitle(segment), href: cumulativePath });
  }

  return <JsonLd data={breadcrumbListSchema(crumbs, CANONICAL_ORIGIN)} />;
}
