/**
 * Server-side wrapper around `HeaderClient`. Resolves the cross-locale URLs
 * for the current page from the canonical alternates map (and per-post blog
 * `translationSlug` frontmatter), then hands them to the interactive client
 * header.
 *
 * Resolving server-side guarantees:
 *  - the language-switcher hrefs render in the initial HTML (no client-only
 *    "wrong link then upgrade" flash for visitors who follow them quickly);
 *  - links use the canonical no-slash form so middleware doesn't have
 *    to bounce them through a 301;
 *  - links to non-existent translations are suppressed at HTML generation
 *    time instead of relying on a 404 fallback.
 *
 * The current pathname is read from the `x-pathname` request header that
 * `src/middleware.ts` sets on every passthrough request.
 */
import { headers } from "next/headers";
import { resolveAlternateUrls } from "@/lib/i18n-route-resolver";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const reqHeaders = await headers();
  const pathname = reqHeaders.get("x-pathname") ?? "/en";
  const alternates = resolveAlternateUrls(pathname);
  return <HeaderClient alternates={alternates} />;
}
