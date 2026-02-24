import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "www.jetset-travel.com";
const APEX_HOST = "jetset-travel.com";

const intlMiddleware = createMiddleware({
  locales: ["en", "ru"],
  defaultLocale: "en",
});

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

  // Canonicalize query-param language into path-based locale
  if (lang === "ru") {
    url.searchParams.delete("lang");
    url.pathname = "/ru" + (url.pathname === "/" ? "" : url.pathname);
    return NextResponse.redirect(url, 308);
  }

  if (lang === "en") {
    url.searchParams.delete("lang");
    url.pathname = "/en" + (url.pathname === "/" ? "" : url.pathname);
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
