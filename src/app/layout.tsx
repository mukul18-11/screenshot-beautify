import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

const siteTitle =
  "Screenshot Beautifier — Turn Screenshots into Launch-Ready Visuals";
const siteDescription =
  "Create beautiful product screenshots with quick styles, browser frames, text overlays, 3D tilt, and sharp PNG export. Everything runs in your browser.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://screenshot-beautifier.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s — Screenshot Beautifier",
  },
  description: siteDescription,
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
    title: siteTitle,
    description: siteDescription,
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
    title: siteTitle,
    description: siteDescription,
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
