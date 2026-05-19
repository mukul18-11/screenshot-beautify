import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor",
  description:
    "Upload a screenshot, apply quick styles, customize frames, text, and 3D tilt, then export a sharp PNG.",
  alternates: {
    canonical: "/editor",
  },
};

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
