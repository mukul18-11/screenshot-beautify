import { Suspense } from "react";
import type { Metadata } from "next";

import LoginClient from "@/components/auth/LoginClient";

export const metadata: Metadata = {
  title: "Log in or Sign up",
  description:
    "Log in or create a Snapingly account with Google, Microsoft, GitHub, or email and password.",
  alternates: {
    canonical: "/login",
  },
};

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101010] px-4 text-white">
      <p className="text-sm font-bold text-white/60">Loading sign in...</p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginClient />
    </Suspense>
  );
}
