import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { APP_URL, siteConfig } from "@/configs/site";
import { Providers } from "./providers";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: siteConfig.name,
  description: siteConfig.description,
  generator: "Next.js",
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    images: [siteConfig.ogImage],
    description: siteConfig.description,
    title: {
      default: siteConfig.name,
      template: `${siteConfig.name} - %s`,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.name}`,
  },
};

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mulish",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${mulish.className} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
