/**
 * Static page routes, discovered from the file system so a new page under
 * src/app/[locale]/ reaches sitemap.xml without editing a hand-kept list.
 *
 * Build-time only (node:fs). sitemap.ts is force-static, so this runs during
 * `next build`, where the source tree is present — the same assumption
 * lib/blog.ts makes for content/blog.
 *
 * A route is a directory under src/app/[locale]/ that holds a page file.
 * Dynamic segments ([slug], [...rest]) are skipped: blog posts come from
 * content/blog, and the catch-all only renders 404s. Route groups "(name)"
 * add no URL segment; private "_name" and parallel "@name" folders are not
 * routes.
 */
import fs from "node:fs";
import path from "node:path";
import { LOCALES, type Locale } from "./canonical.ts";
import { resolvePathRedirect } from "./redirects.ts";
import { NOINDEX_LOCALE_PATHS } from "./seo.ts";

const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;

export const LOCALE_APP_DIR = path.join(process.cwd(), "src", "app", "[locale]");

/** Route paths after the locale ("" for the locale root, "/about", ...), sorted. */
export function discoverPageRoutes(dir: string = LOCALE_APP_DIR): string[] {
  // turbopackIgnore: build-time read of source folders; don't trace the
  // whole project into the (force-static) sitemap route's server bundle.
  if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
    throw new Error(`Page route directory not found: ${dir} (sitemap must be generated at build time)`);
  }
  const routes: string[] = [];
  const walk = (current: string, route: string) => {
    const entries = fs.readdirSync(/*turbopackIgnore: true*/ current, { withFileTypes: true });
    if (entries.some((e) => e.isFile() && PAGE_FILE.test(e.name))) routes.push(route);
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const name = e.name;
      if (name.startsWith("[") || name.startsWith("_") || name.startsWith("@")) continue;
      const isGroup = name.startsWith("(") && name.endsWith(")");
      walk(path.join(current, name), isGroup ? route : `${route}/${name}`);
    }
  };
  walk(dir, "");
  return [...new Set(routes)].sort();
}

export interface LocalizedPage {
  /** Route folder path after the locale, e.g. "/paphos-travel-agency". */
  route: string;
  locale: Locale;
  /** Canonical locale-prefixed path, e.g. "/en/paphos-travel-agency". */
  path: string;
}

/**
 * Every (route, locale) that answers 200 with its own canonical: skips
 * locale variants that 301 elsewhere (per-locale slugs such as
 * /ru/paphos-travel-agency → /ru/turisticheskoe-agentstvo-pafos, retired
 * URLs) and noindexed stubs.
 */
export function indexableStaticPages(routes: string[] = discoverPageRoutes()): LocalizedPage[] {
  return routes.flatMap((route) =>
    LOCALES.flatMap((locale): LocalizedPage[] => {
      const p = `/${locale}${route}`;
      if (resolvePathRedirect(p) || NOINDEX_LOCALE_PATHS.has(p)) return [];
      return [{ route, locale, path: p }];
    }),
  );
}

/**
 * The same page in `locale`: the same route folder, or — when that locale
 * variant 301s (per-locale slug) — the redirect's destination. Returns the
 * path only if it is itself an indexable page, so hreflang never points at
 * a redirect, a 404 or a noindexed stub.
 */
export function counterpartPath(
  route: string,
  locale: Locale,
  indexable: ReadonlySet<string>,
): string | null {
  const direct = `/${locale}${route}`;
  const target = resolvePathRedirect(direct) ?? direct;
  return indexable.has(target) ? target : null;
}
