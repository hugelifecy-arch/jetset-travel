import type { Metadata } from "next";
import { CANONICAL_ORIGIN, OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_ORIGIN),
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
    yandex: "c693997a9fde5229",
  },
  openGraph: {
    type: "website",
    locale: "en_CY",
    alternateLocale: "ru_CY",
    siteName: "JetSet Travel Cyprus",
    url: CANONICAL_ORIGIN,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
