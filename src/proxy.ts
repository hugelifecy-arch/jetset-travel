import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "www.jetset-travel.com";
const APEX_HOST = "jetset-travel.com";
const locales = ["en", "ru"] as const;
const PUBLIC_FILE = /\.(.*)$/;

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

  // Do not interfere with local dev or Vercel preview/default domains
  if (
    hostname.includes("localhost") ||
    hostname.endsWith(".vercel.app") ||
    hostname.endsWith(".vercel-preview.app")
  ) {
    return NextResponse.next();
  }

  // Force apex -> canonical www (308)
  if (hostname === APEX_HOST) {
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

  // already locale-prefixed: /en OR /en/...
  const localePrefix = new RegExp(`^/(${locales.join("|")})(/|$)`);
  if (localePrefix.test(pathname)) {
    return NextResponse.next();
  }

  // choose locale (default en)
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";

  const redirectUrl = url.clone();
  redirectUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(redirectUrl, 307);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
