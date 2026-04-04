import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "www.jetset-travel.com";
const APEX_HOST = "jetset-travel.com";
const locales = ["en", "ru"] as const;
const PUBLIC_FILE = /\.(.*)$/;

// Special-case bare-path redirects that don't map 1:1 to /<locale>/<path>
const BARE_PATH_SPECIALS: Record<
  string,
  { pathname: string; extraSearch?: Record<string, string> }
> = {
  "/luxury": { pathname: "/luxury-travel" },
  "/luxury-travel": { pathname: "/luxury-travel" },
  "/quote": { pathname: "/contact", extraSearch: { type: "quote" } },
};

function getPreferredLocale(req: NextRequest): (typeof locales)[number] {
  const acceptLang = req.headers.get("accept-language") || "";
  // Check if Russian appears before English in the Accept-Language header
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

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = getHostname(req);
  const { pathname } = url;
  const lang = url.searchParams.get("lang");

  const isLocalOrPreview =
    hostname.includes("localhost") ||
    hostname.endsWith(".vercel.app") ||
    hostname.endsWith(".vercel-preview.app");

  // 1. Force apex → canonical www (301) — production only
  //    Skip robots.txt, sitemap.xml, and Yandex verification files so
  //    search engines can access them on the apex domain.
  if (!isLocalOrPreview && hostname === APEX_HOST) {
    const apexBypass =
      /^\/(robots\.txt|sitemap\.xml|yandex_[a-f0-9]+\.html)$/i;
    if (!apexBypass.test(pathname)) {
      const redirectUrl = url.clone();
      redirectUrl.hostname = CANONICAL_HOST;
      return NextResponse.redirect(redirectUrl, 301);
    }
  }

  // Ignore Next.js internals / APIs / static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Strip trailing slashes (except root "/") for URL consistency
  if (pathname !== "/" && pathname.endsWith("/")) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 3. Canonicalize query-param language into path-based locale
  if (lang === "ru" || lang === "en") {
    url.searchParams.delete("lang");
    url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 301);
  }

  // 4. Already locale-prefixed: /en OR /en/... OR /ru OR /ru/... → pass through
  const localePrefix = new RegExp(`^/(${locales.join("|")})(/|$)`);
  if (localePrefix.test(pathname)) {
    return NextResponse.next();
  }

  // 5. Special-case bare paths that need a non-trivial destination
  const special = BARE_PATH_SPECIALS[pathname];
  if (special) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = `/en${special.pathname}`;
    if (special.extraSearch) {
      for (const [key, value] of Object.entries(special.extraSearch)) {
        redirectUrl.searchParams.set(key, value);
      }
    }
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 6. Detect preferred locale from Accept-Language for root path
  const preferredLocale = pathname === "/" ? getPreferredLocale(req) : "en";

  // All remaining bare paths → /<locale>/<path> (301, query string preserved)
  const redirectUrl = url.clone();
  redirectUrl.pathname = `/${preferredLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(redirectUrl, 301);
}

export const config = {
  matcher: ["/((?!_next|api|sitemap\\.xml|robots\\.txt|favicon\\.ico|yandex_).*)"],
};
