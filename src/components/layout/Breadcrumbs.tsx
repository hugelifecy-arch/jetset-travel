"use client";

import { usePathname } from "next/navigation";
import {
  PATH_DISPLAY_NAMES,
  getHomeName,
  slugToTitle,
} from "@/components/seo/breadcrumb-names";
import { isBlogPostSegments, type BreadcrumbCrumb } from "@/components/seo/breadcrumb-list";
import BreadcrumbBar from "./BreadcrumbBar";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const parts = pathname.split("/").filter(Boolean);
  const locale = parts[0] || "en";
  const segments = parts.slice(1);

  // Don't render on the homepage
  if (segments.length === 0) return null;
  // Blog posts render the same bar themselves, with the post title instead of
  // a title guessed from the slug (blog/[slug]/page.tsx).
  if (isBlogPostSegments(segments)) return null;

  const names = PATH_DISPLAY_NAMES[locale] ?? PATH_DISPLAY_NAMES.en;
  const homeName = getHomeName(locale);

  const crumbs: BreadcrumbCrumb[] = [{ name: homeName, href: `/${locale}` }];

  let cumulativePath = `/${locale}`;
  for (const segment of segments) {
    cumulativePath += `/${segment}`;
    crumbs.push({
      name: names[segment] ?? slugToTitle(segment),
      href: cumulativePath,
    });
  }

  return <BreadcrumbBar crumbs={crumbs} />;
}
