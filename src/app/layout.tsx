import type { Metadata, Viewport } from "next";
import { CANONICAL_ORIGIN, OG_IMAGE } from "@/lib/seo";
import { DEFAULT_LOCALE, getCanonicalUrl } from "@/lib/canonical";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Default canonical (used only if a child route forgets to set its own).
// Must derive from getCanonicalUrl so it carries the trailing slash and
// matches sitemap.xml byte-for-byte.
const DEFAULT_CANONICAL = getCanonicalUrl("", DEFAULT_LOCALE);

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_ORIGIN),
  alternates: {
    canonical: DEFAULT_CANONICAL,
    languages: {
      en: getCanonicalUrl("", "en"),
      ru: getCanonicalUrl("", "ru"),
      "x-default": getCanonicalUrl("", "en"),
    },
  },
  title: {
    template: "%s | JetSet Travel Cyprus",
    default: "JetSet Travel Cyprus — Premium Travel Services",
  },
  description:
    "IATA-accredited travel agency in Paphos, Cyprus offering corporate travel management, luxury holidays, visa services, and hotel reservations.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    }),
    yandex: "c693997a9fde5229",
  },
  openGraph: {
    type: "website",
    locale: "en_CY",
    alternateLocale: "ru_CY",
    siteName: "JetSet Travel Cyprus",
    url: DEFAULT_CANONICAL,
    title: "JetSet Travel Cyprus — Premium Travel Services",
    description:
      "IATA-accredited travel agency in Paphos, Cyprus offering corporate travel management, luxury holidays, visa services, and hotel reservations.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "JetSet Travel Cyprus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JetSet Travel Cyprus — Premium Travel Services",
    description:
      "IATA-accredited travel agency in Paphos, Cyprus offering corporate travel management, luxury holidays, visa services, and hotel reservations.",
    images: [OG_IMAGE],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "mailru-verification": "2bfc57c56602f741",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
