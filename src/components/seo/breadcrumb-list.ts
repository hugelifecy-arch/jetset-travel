/**
 * Shared pieces of the breadcrumb trail (visible bar + BreadcrumbList JSON-LD).
 *
 * The site-wide trail is derived from the URL, which only knows the slug.
 * Blog posts know their real title, so they render the trail themselves and
 * the layout-level Breadcrumbs / BreadcrumbSchema skip those paths. That
 * keeps exactly one breadcrumb nav and one BreadcrumbList per page.
 */

export interface BreadcrumbCrumb {
  name: string;
  /** Site path, starting with the locale: "/en/blog". */
  href: string;
}

/** Path segments after the locale, e.g. ["blog", "my-post"]. */
export function isBlogPostSegments(segments: readonly string[]): boolean {
  return segments.length === 2 && segments[0] === "blog" && segments[1] !== "";
}

export function breadcrumbListSchema(
  crumbs: readonly BreadcrumbCrumb[],
  origin: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${origin}${crumb.href}`,
    })),
  };
}
