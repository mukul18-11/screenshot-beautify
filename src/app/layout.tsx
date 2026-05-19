import type { Metadata } from "next";
import { Toaster } from "sonner";

import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site-metadata";

import "./globals.css";

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
  keywords: [
    "screenshot beautifier",
    "screenshot mockup",
    "product screenshot",
    "SaaS screenshot",
    "browser mockup",
    "Product Hunt image",
    "launch graphics",
  ],
  applicationName: "Screenshot Beautifier",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: "Screenshot Beautifier",
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
      <body>
        {children}
        <Toaster richColors closeButton position="top-center" />
      </body>
    </html>
  );
}
