import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Editor",
  description:
    "Upload a screenshot, apply quick styles, customize frames, text, and 3D tilt, then export a sharp PNG.",
  alternates: {
    canonical: "/editor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "dark",
  themeColor: "#090909",
};

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
