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
  "/luxury-travel": { pathname: "/luxury-travel" },
  "/quote": { pathname: "/contact", extraSearch: { type: "quote" } },
};

function getHostname(req: NextRequest) {
  const urlHost = req.nextUrl?.hostname;
  if (urlHost) {
    return urlHost.toLowerCase();
  }

  const hostHeader = req.headers.get("host") || "";
  return hostHeader.split(":")[0].trim().toLowerCase();
}

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = getHostname(req);
  const { pathname } = url;
  const lang = url.searchParams.get("lang");

  const isLocalOrPreview =
    hostname.includes("localhost") ||
    hostname.endsWith(".vercel.app") ||
    hostname.endsWith(".vercel-preview.app");

  // Force apex -> canonical www (308) — production only
  if (!isLocalOrPreview && hostname === APEX_HOST) {
    const redirectUrl = url.clone();
    redirectUrl.hostname = CANONICAL_HOST;
    return NextResponse.redirect(redirectUrl, 308);
  }

  // ignore Next.js internals / APIs / static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Canonicalize query-param language into path-based locale
  if (lang === "ru" || lang === "en") {
    url.searchParams.delete("lang");
    url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 308);
  }

  // already locale-prefixed: /en OR /en/... OR /ru OR /ru/...  → pass through
  const localePrefix = new RegExp(`^/(${locales.join("|")})(/|$)`);
  if (localePrefix.test(pathname)) {
    return NextResponse.next();
  }

  // Special-case bare paths that need a non-trivial destination
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

  // All remaining bare paths → /en/<path> (301 permanent, query string preserved)
  const redirectUrl = url.clone();
  redirectUrl.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(redirectUrl, 301);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
