"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import AuthInput from "@/components/auth/AuthInput";

type Notice = {
  tone: "error" | "success";
  text: string;
} | null;

const MIN_PASSWORD_LENGTH = 8;

function validatePassword(value: string) {
  if (!value) {
    return "Enter your new password.";
  }

  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return null;
}

export default function ResetPasswordClient() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      router.replace("/login");
      return;
    }

    // The middleware guards this page server-side; this covers stale tabs
    // where the session expired after the page was served.
    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      if (!data.user) {
        router.replace("/login");
        return;
      }

      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      setNotice({ tone: "error", text: passwordError });
      return;
    }

    if (password !== confirmPassword) {
      setNotice({ tone: "error", text: "Passwords do not match." });
      return;
    }

    setNotice(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);

    if (error) {
      setNotice({ tone: "error", text: error.message });
      return;
    }

    toast.success("Password updated");
    router.replace("/editor");
  }

  const isBusy = isCheckingSession || isSubmitting;

  return (
    <main className="min-h-screen bg-[#101010] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col">
        <header className="flex h-12 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-black text-white"
            aria-label="Snapingly home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-orange-400 to-teal-400 text-slate-950 shadow-lg shadow-black/20">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">Snapingly</span>
          </Link>
        </header>

        <section className="flex flex-1 items-start justify-center pt-20 sm:pt-28">
          <div className="w-full max-w-[30rem]">
            <div className="rounded-[1.75rem] border border-white/[0.08] bg-[#151515] p-5 shadow-2xl shadow-black/35 sm:p-6">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Reset Password
              </h1>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/55">
                Choose a new password for your account.
              </p>

              {notice && (
                <p
                  className={cn(
                    "mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold leading-5",
                    notice.tone === "error"
                      ? "border-rose-400/25 bg-rose-400/10 text-rose-100"
                      : "border-teal-300/25 bg-teal-300/10 text-teal-100",
                  )}
                  role="alert"
                >
                  {notice.text}
                </p>
              )}

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <AuthInput
                  id="reset-new-password"
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={setPassword}
                  placeholder="New password"
                />
                <AuthInput
                  id="reset-confirm-password"
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm password"
                />
                <button
                  type="submit"
                  disabled={isBusy}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-[1.35rem] bg-teal-500/70 px-5 text-base font-bold text-white shadow-lg shadow-teal-950/25 transition hover:bg-teal-400/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/20 disabled:pointer-events-none disabled:opacity-55"
                >
                  {isSubmitting && (
                    <Loader2
                      className="h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
