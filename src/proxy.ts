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
export default function proxy(req: NextRequest) {
  const preferredLocale = pickPreferredLocale(
    req.headers.get("accept-language"),
  );

  const inputUrl = req.nextUrl.toString();
  const result = canonicalize(inputUrl, { preferredLocale });

  if (result.action === "passthrough") {
    // No request mutation on passthrough. (The language switcher used to
    // read an injected `x-pathname` header server-side, which forced every
    // page into per-request SSR; it now resolves from `usePathname()` on
    // the client — see `lib/i18n-route-resolver.ts`.)
    return NextResponse.next();
  }

  const target = new URL(result.url);
  const isRootLocaleRedirect =
    req.nextUrl.pathname === "/" && target.pathname === `/${preferredLocale}`;

  // Redirect to the plain absolute URL. Do NOT clone `req.nextUrl`: a
  // NextURL remembers that the incoming path ended in "/" and re-appends it
  // when formatted, so /en/about/ would 301 back to /en/about/ forever (Next's
  // own slash redirect, which used to hide this, is off — see next.config.ts).
  const res = NextResponse.redirect(target, 301);
  if (isRootLocaleRedirect) {
    res.headers.set("Vary", "Accept-Language");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|sitemap\\.xml|robots\\.txt|favicon\\.ico|yandex_).*)"],
};
