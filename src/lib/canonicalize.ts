/**
 * Pure URL canonicalization used by `src/proxy.ts`.
 *
 * Kept framework-free (no `next/server` imports) so unit tests can import
 * it directly without needing the Next.js runtime. The proxy is a
 * thin wrapper that converts {@link CanonicalAction} into `NextResponse`.
 *
 * Canonical form: `https://www.jetset-travel.com/<locale>/<path>`
 * (NO trailing slash — Phase 3, locked in by GSC Performance data showing
 * Google selects the no-slash variant for nearly every ranking URL). Every
 * variant — apex host, missing/duplicate locale prefix, `?lang=`, bare paths,
 * any trailing slash — resolves to that form in a single redirect hop.
 */

export const CANONICAL_HOST = "www.jetset-travel.com";
export const APEX_HOST = "jetset-travel.com";
export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

const LOCALE_PREFIX_RE = new RegExp(`^/(${LOCALES.join("|")})(/|$)`);

// Paths on the apex that must stay reachable (search engine verification).
const APEX_BYPASS =
  /^\/(robots\.txt|sitemap\.xml|yandex_[a-f0-9]+\.html|mailru-verification[a-f0-9]+\.html)$/i;

const PUBLIC_FILE = /\.(.*)$/;

// Special-case bare-path redirects that don't map 1:1 to /<locale>/<path>.
// Values are the path WITHOUT the locale prefix — the /en prefix is added
// below so the final URL is /en/<pathname> (no trailing slash).
const BARE_PATH_SPECIALS: Record<
  string,
  { pathname: string; extraSearch?: Record<string, string> }
> = {
  "/luxury": { pathname: "/luxury-travel" },
  "/luxury-travel": { pathname: "/luxury-travel" },
  "/quote": { pathname: "/contact", extraSearch: { type: "quote" } },
};

/**
 * Collapse repeated locale segments: /en/en/foo → /en/foo, /ru/ru → /ru.
 * Runs until stable so /en/en/en/x also collapses in one pass.
 */
function collapseDoubleLocalePrefix(pathname: string): string {
  let out = pathname;
  for (const loc of LOCALES) {
    const re = new RegExp(`^/${loc}/${loc}(?=/|$)`, "i");
    while (re.test(out)) {
      out = out.replace(re, `/${loc}`);
    }
  }
  return out;
}

/**
 * Canonical form has NO trailing slash. Strips trailing slashes (and
 * collapses duplicate inner slashes), but leaves the root "/" untouched.
 */
function stripTrailingSlash(pathname: string): string {
  if (!pathname) return "/";
  const collapsed = pathname.replace(/\/{2,}/g, "/");
  if (collapsed === "/") return "/";
  return collapsed.replace(/\/+$/, "") || "/";
}

export type CanonicalAction =
  | { action: "redirect"; url: string }
  | { action: "passthrough" };

export interface CanonicalizeOptions {
  /** Locale used when redirecting the bare root "/" (driven by Accept-Language). */
  preferredLocale?: Locale;
}

/**
 * Resolve a request URL to its canonical form.
 *
 * @param inputUrl  absolute URL of the incoming request
 * @returns         `{ action: "redirect", url }` with the single-hop target,
 *                  or `{ action: "passthrough" }` if already canonical
 */
export function canonicalize(
  inputUrl: string,
  { preferredLocale = "en" }: CanonicalizeOptions = {},
): CanonicalAction {
  const u = new URL(inputUrl);
  const hostname = u.hostname.toLowerCase();
  const originalPathname = u.pathname;
  const originalSearch = u.search;

  const isLocalOrPreview =
    hostname.includes("localhost") ||
    hostname.endsWith(".vercel.app") ||
    hostname.endsWith(".vercel-preview.app");

  const isInternal =
    originalPathname.startsWith("/_next") ||
    originalPathname.startsWith("/api") ||
    PUBLIC_FILE.test(originalPathname);

  const shouldCanonicalizeHost =
    !isLocalOrPreview &&
    hostname === APEX_HOST &&
    !APEX_BYPASS.test(originalPathname);
  const targetHost = shouldCanonicalizeHost ? CANONICAL_HOST : hostname;
  const hostChanged = targetHost !== hostname;

  if (isInternal) {
    if (hostChanged) {
      const r = new URL(inputUrl);
      r.hostname = targetHost;
      return { action: "redirect", url: r.toString() };
    }
    return { action: "passthrough" };
  }

  let pathname = originalPathname;

  // 1. Collapse /en/en/... → /en/... (runs before trailing-slash normalization
  //    so "/en/en/" and "/en/en" reduce to the same intermediate form).
  pathname = collapseDoubleLocalePrefix(
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.replace(/\/+$/, "")
      : pathname,
  );

  // 2. Handle ?lang= query: strip it and reconcile with the path prefix.
  const searchParams = new URLSearchParams(originalSearch);
  const lang = searchParams.get("lang");
  let queryChanged = false;
  if (lang === "en" || lang === "ru") {
    searchParams.delete("lang");
    queryChanged = true;
    const prefixMatch = pathname.match(LOCALE_PREFIX_RE);
    if (prefixMatch) {
      const existing = prefixMatch[1] as Locale;
      if (existing !== lang) {
        pathname = `/${lang}${pathname.slice(existing.length + 1)}`;
      }
    } else {
      pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
    }
  }

  // 3. Special-case bare paths (e.g. /luxury → /en/luxury-travel).
  const special = BARE_PATH_SPECIALS[pathname];
  if (special) {
    pathname = `/en${special.pathname}`;
    if (special.extraSearch) {
      for (const [k, v] of Object.entries(special.extraSearch)) {
        if (searchParams.get(k) !== v) {
          searchParams.set(k, v);
          queryChanged = true;
        }
      }
    }
  }

  // 4. Bare path (not root, not locale-prefixed) → default to /en.
  if (pathname !== "/" && !LOCALE_PREFIX_RE.test(pathname)) {
    pathname = `/en${pathname}`;
  }

  // 5. Canonical form has NO trailing slash.
  pathname = stripTrailingSlash(pathname);

  const newSearch = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";
  const pathChanged = pathname !== originalPathname;
  const searchStringChanged = queryChanged && newSearch !== originalSearch;

  if (hostChanged || pathChanged || searchStringChanged) {
    const r = new URL(inputUrl);
    r.hostname = targetHost;
    r.pathname = pathname;
    r.search = newSearch;
    return { action: "redirect", url: r.toString() };
  }

  if (pathname === "/") {
    const r = new URL(inputUrl);
    r.pathname = `/${preferredLocale}`;
    return { action: "redirect", url: r.toString() };
  }

  return { action: "passthrough" };
}

/**
 * Pick the preferred locale from an Accept-Language header.
 * Defaults to English unless Russian ranks higher.
 */
export function pickPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "en";
  const ruIndex = acceptLanguage.search(/\bru\b/i);
  if (ruIndex !== -1) {
    const enIndex = acceptLanguage.search(/\ben\b/i);
    if (enIndex === -1 || ruIndex < enIndex) {
      return "ru";
    }
  }
  return "en";
}
