import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canonicalize, pickPreferredLocale } from "./lib/canonicalize";

/**
 * Thin adapter: resolves the canonical target for each incoming request and
 * emits a single 301 redirect when needed. All URL logic lives in
 * `src/lib/canonicalize.ts` so it can be unit tested without Next internals.
 *
 * The root "/" redirect carries `Vary: Accept-Language` so shared caches
 * don't serve a wrong-locale redirect to another visitor.
 */
export default function middleware(req: NextRequest) {
  const preferredLocale = pickPreferredLocale(
    req.headers.get("accept-language"),
  );

  const inputUrl = req.nextUrl.toString();
  const result = canonicalize(inputUrl, { preferredLocale });

  if (result.action === "passthrough") {
    // Expose the request pathname to server components (the language
    // switcher reads it via `headers()` so it can resolve the
    // cross-locale URL of the current page).
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", req.nextUrl.pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const target = new URL(result.url);
  const isRootLocaleRedirect =
    req.nextUrl.pathname === "/" && target.pathname === `/${preferredLocale}/`;

  const redirectUrl = req.nextUrl.clone();
  redirectUrl.hostname = target.hostname;
  redirectUrl.pathname = target.pathname;
  redirectUrl.search = target.search;

  const res = NextResponse.redirect(redirectUrl, 301);
  if (isRootLocaleRedirect) {
    res.headers.set("Vary", "Accept-Language");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|sitemap\\.xml|robots\\.txt|favicon\\.ico|yandex_).*)"],
};
