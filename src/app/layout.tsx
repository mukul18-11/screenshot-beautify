import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { Toaster } from "sonner";

import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site-metadata";

import "./globals.css";

const appSans = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-app-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const appDisplay = Outfit({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-app-display",
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Snapingly",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Snapingly" }],
  creator: "Snapingly",
  publisher: "Snapingly",
  category: "Design tool",
  keywords: [
    "snapingly",
    "screenshot beautifier",
    "screenshot mockup",
    "screenshot mockup generator",
    "product screenshot",
    "product screenshot generator",
    "SaaS screenshot",
    "browser mockup",
    "browser frame screenshot",
    "social media screenshot tool",
    "Product Hunt image",
    "LinkedIn product screenshot",
    "X product screenshot",
    "client-side screenshot editor",
    "launch graphics",
  ],
  applicationName: "Snapingly",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: "Snapingly",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Snapingly — turn screenshots into launch-ready visuals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${appSans.variable} ${appDisplay.variable} antialiased`}>
        {children}
        <Toaster richColors closeButton position="top-center" />
      </body>
    </html>
  );
}
