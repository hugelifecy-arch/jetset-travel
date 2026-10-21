import { notFound } from "next/navigation";

/**
 * Unmatched paths under a valid locale (/en/<anything-unknown>) previously
 * fell through to the root not-found boundary, which rendered an unstyled,
 * English-only fragment with no <html>/<body>, header or footer (audit F-06).
 * Routing them here renders the localized [locale]/not-found.tsx inside the
 * normal site layout, still with HTTP 404.
 */
export default function UnknownLocalizedRoute() {
  notFound();
}
