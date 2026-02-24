import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "ru"],
  defaultLocale: "en",
});

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const lang = url.searchParams.get("lang");

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
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
