import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "www.jetset-travel.com";
const APEX_HOST = "jetset-travel.com";
const locales = ["en", "ru"] as const;
type Locale = (typeof locales)[number];
const PUBLIC_FILE = /\.(.*)$/;
const LOCALE_PREFIX_RE = new RegExp(`^/(${locales.join("|")})(/|$)`);

// Paths on the apex that must stay reachable (search engine verification).
const APEX_BYPASS = /^\/(robots\.txt|sitemap\.xml|yandex_[a-f0-9]+\.html|mailru-verification[a-f0-9]+\.html)$/i;

// Special-case bare-path redirects that don't map 1:1 to /<locale>/<path>
const BARE_PATH_SPECIALS: Record<
  string,
  { pathname: string; extraSearch?: Record<string, string> }
> = {
  "/luxury": { pathname: "/luxury-travel" },
  "/luxury-travel": { pathname: "/luxury-travel" },
  "/quote": { pathname: "/contact", extraSearch: { type: "quote" } },
};

function getPreferredLocale(req: NextRequest): Locale {
  const acceptLang = req.headers.get("accept-language") || "";
  const ruIndex = acceptLang.search(/\bru\b/i);
  if (ruIndex !== -1) {
    const enIndex = acceptLang.search(/\ben\b/i);
    if (enIndex === -1 || ruIndex < enIndex) {
      return "ru";
    }
  }
  return "en";
}

function getHostname(req: NextRequest) {
  const urlHost = req.nextUrl?.hostname;
  if (urlHost) {
    return urlHost.toLowerCase();
  }
  const hostHeader = req.headers.get("host") || "";
  return hostHeader.split(":")[0].trim().toLowerCase();
}

/**
 * Collapse repeated locale segments: /en/en/foo → /en/foo, /ru/ru → /ru.
 * Runs until stable so /en/en/en/x also collapses in one pass.
 */
function collapseDoubleLocalePrefix(pathname: string): string {
  let out = pathname;
  for (const loc of locales) {
    const re = new RegExp(`^/${loc}/${loc}(?=/|$)`, "i");
    while (re.test(out)) {
      out = out.replace(re, `/${loc}`);
    }
  }
  return out;
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = getHostname(req);
  const originalPathname = url.pathname;
  const originalSearch = url.search;

  const isLocalOrPreview =
    hostname.includes("localhost") ||
    hostname.endsWith(".vercel.app") ||
    hostname.endsWith(".vercel-preview.app");

  const isInternal =
    originalPathname.startsWith("/_next") ||
    originalPathname.startsWith("/api") ||
    PUBLIC_FILE.test(originalPathname);

  // Decide the canonical hostname. Apex → www in production, with search-engine
  // verification files bypassed so they remain fetchable on the apex.
  const shouldCanonicalizeHost =
    !isLocalOrPreview &&
    hostname === APEX_HOST &&
    !APEX_BYPASS.test(originalPathname);
  const targetHost = shouldCanonicalizeHost ? CANONICAL_HOST : hostname;
  const hostChanged = targetHost !== hostname;

  // Internal / static requests: redirect only if the host needs canonicalizing,
  // otherwise pass through untouched.
  if (isInternal) {
    if (hostChanged) {
      const redirectUrl = url.clone();
      redirectUrl.hostname = targetHost;
      return NextResponse.redirect(redirectUrl, 301);
    }
    return NextResponse.next();
  }

  // --- Compute the canonical pathname in a single pass ---
  let pathname = originalPathname;

  // 1. Strip trailing slash (except bare root).
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/, "");
  }

  // 2. Collapse /en/en/... → /en/...
  pathname = collapseDoubleLocalePrefix(pathname);

  // 3. Handle ?lang= query: strip it and reconcile with the path prefix.
  const searchParams = new URLSearchParams(url.search);
  const lang = searchParams.get("lang");
  let queryChanged = false;
  if (lang === "en" || lang === "ru") {
    searchParams.delete("lang");
    queryChanged = true;
    const prefixMatch = pathname.match(LOCALE_PREFIX_RE);
    if (prefixMatch) {
      // Already locale-prefixed: if it doesn't match lang, swap; else keep.
      const existingLocale = prefixMatch[1] as Locale;
      if (existingLocale !== lang) {
        pathname = `/${lang}${pathname.slice(existingLocale.length + 1)}`;
      }
    } else {
      // Bare path: add the requested locale prefix.
      pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
    }
  }

  // 4. Special-case bare paths (e.g. /luxury → /en/luxury-travel).
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

  // 5. Bare path (not root, not locale-prefixed) → default to /en.
  if (pathname !== "/" && !LOCALE_PREFIX_RE.test(pathname)) {
    pathname = `/en${pathname}`;
  }

  // --- Decide: redirect, rewrite (root), or pass through ---
  const newSearch = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const pathChanged = pathname !== originalPathname;
  const searchStringChanged = queryChanged && newSearch !== originalSearch;

  if (hostChanged || pathChanged || searchStringChanged) {
    const redirectUrl = url.clone();
    redirectUrl.hostname = targetHost;
    redirectUrl.pathname = pathname;
    redirectUrl.search = newSearch;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Root "/" — rewrite (200, not a redirect) to the preferred locale so GSC
  // doesn't flag the homepage as "Page with redirect".
  if (pathname === "/") {
    const preferredLocale = getPreferredLocale(req);
    const rewriteUrl = url.clone();
    rewriteUrl.pathname = `/${preferredLocale}`;
    const res = NextResponse.rewrite(rewriteUrl);
    res.headers.set("Vary", "Accept-Language");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|sitemap\\.xml|robots\\.txt|favicon\\.ico|yandex_).*)"],
};
