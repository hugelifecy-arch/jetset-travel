import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CANONICAL_ORIGIN } from "@/lib/seo";

const dmSans = localFont({
  src: [
    {
      path: "../fonts/dm-sans-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../fonts/dm-sans-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = localFont({
  src: [
    {
      path: "../fonts/playfair-display-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../fonts/playfair-display-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_ORIGIN),
  title: {
    template: "%s | JetSet Travel Cyprus",
    default: "JetSet Travel Cyprus — Premium Travel Services",
  },
  description:
    "IATA-accredited travel agency in Paphos, Cyprus offering corporate travel management, luxury holidays, visa services, and hotel reservations.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "JetSet Travel Cyprus",
    url: "https://www.jetset-travel.com",
    title: "JetSet Travel Cyprus — Premium Travel Services",
    description:
      "IATA-accredited travel agency in Paphos, Cyprus offering corporate travel management, luxury holidays, visa services, and hotel reservations.",
    images: [
      {
        url: "https://www.jetset-travel.com/images/jetset-og-image.jpg",
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
    images: ["https://www.jetset-travel.com/images/jetset-og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
