import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbCrumb } from "@/components/seo/breadcrumb-list";

/**
 * The grey breadcrumb bar under the header. Rendered by the layout-level
 * <Breadcrumbs /> from the URL, and by blog posts with their real title.
 */
export default function BreadcrumbBar({ crumbs }: { crumbs: readonly BreadcrumbCrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-brand-light/60 border-b border-brand-navy/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 py-3 text-sm text-brand-navy/70">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const isHome = index === 0;
            return (
              <li
                key={crumb.href}
                // Middle crumbs are hidden on mobile as a whole item: a visible-less
                // link would stay focusable but unnamed (audit F-16, WCAG 2.4.4).
                className={`${!isHome && !isLast ? "hidden sm:flex" : "flex"} items-center gap-1.5 min-w-0`}
              >
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                )}
                {isLast ? (
                  <span
                    className="font-medium text-brand-navy truncate max-w-[180px] sm:max-w-[300px] md:max-w-none"
                    aria-current="page"
                    title={crumb.name}
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="flex items-center gap-1 transition-colors hover:text-brand-gold whitespace-nowrap"
                  >
                    {isHome && (
                      <Home className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    )}
                    {/* sr-only (not display:none) keeps the Home link named on mobile */}
                    <span className={isHome ? "sr-only sm:not-sr-only" : undefined}>{crumb.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
