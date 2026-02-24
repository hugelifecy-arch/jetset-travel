import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "JetSet Travel Cyprus — Premium Travel Services",
  description:
    "Your trusted travel partner in Cyprus. Premium corporate and leisure travel, visa assistance, and luxury concierge services.",
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
