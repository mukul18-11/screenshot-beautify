import { Suspense } from "react";
import type { Metadata } from "next";

import ResetPasswordClient from "@/components/auth/ResetPasswordClient";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new password for your Snapingly account.",
  robots: {
    follow: false,
    index: false,
  },
};

function ResetPasswordFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101010] px-4 text-white">
      <p className="text-sm font-bold text-white/60">Loading...</p>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
