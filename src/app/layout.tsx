import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Screenshot Beautifier",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Screenshot Beautifier" }],
  creator: "Screenshot Beautifier",
  publisher: "Screenshot Beautifier",
  category: "Design tool",
  keywords: [
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
  applicationName: "Screenshot Beautifier",
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
    siteName: "Screenshot Beautifier",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Screenshot Beautifier product mockup",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={appSans.variable}>
        {children}
        <Toaster richColors closeButton position="top-center" />
      </body>
    </html>
  );
}
