"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import {
  PATH_DISPLAY_NAMES,
  getHomeName,
  slugToTitle,
} from "@/components/seo/breadcrumb-names";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const parts = pathname.split("/").filter(Boolean);
  const locale = parts[0] || "en";
  const segments = parts.slice(1);

  // Don't render on the homepage
  if (segments.length === 0) return null;

  const names = PATH_DISPLAY_NAMES[locale] ?? PATH_DISPLAY_NAMES.en;
  const homeName = getHomeName(locale);

  const crumbs: Array<{ name: string; href: string }> = [
    { name: homeName, href: `/${locale}` },
  ];

  let cumulativePath = `/${locale}`;
  for (const segment of segments) {
    cumulativePath += `/${segment}`;
    crumbs.push({
      name: names[segment] ?? slugToTitle(segment),
      href: cumulativePath,
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="bg-brand-light/60 border-b border-brand-navy/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 py-3 text-sm text-brand-navy/60">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const isHome = index === 0;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5 min-w-0">
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
                    <span className="hidden sm:inline">{crumb.name}</span>
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
