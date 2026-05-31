"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthModalProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

function getAuthCallbackUrl() {
  return `${window.location.origin}/auth/callback?next=/editor`;
}

export default function AuthModal({ onOpenChange, open }: AuthModalProps) {
  const descriptionId = useId();
  const titleId = useId();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [hasSentOtp, setHasSentOtp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const isConfigured = Boolean(supabase);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  async function handleGoogleSignIn() {
    if (!supabase) {
      toast.error("Supabase is not configured yet.");
      return;
    }

    setIsGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthCallbackUrl(),
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      setIsGoogleLoading(false);
      toast.error(error.message);
    }
  }

  async function handleSendOtp() {
    if (!supabase) {
      toast.error("Supabase is not configured yet.");
      return;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Enter your email first.");
      return;
    }

    setIsEmailLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });

    setIsEmailLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setHasSentOtp(true);
    toast.success("Check your email for the sign-in code.");
  }

  async function handleVerifyOtp() {
    if (!supabase) {
      toast.error("Supabase is not configured yet.");
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp) {
      toast.error("Enter your email and code.");
      return;
    }

    setIsEmailLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: trimmedOtp,
      type: "email",
    });

    setIsEmailLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed in");
    onOpenChange(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-white/12 bg-white p-5 text-slate-950 shadow-2xl shadow-slate-950/25 dark:bg-slate-950 dark:text-white"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-bold tracking-tight">
              Sign in to Snapingly
            </h2>
            <p
              id={descriptionId}
              className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-300"
            >
              Keep editing local. Your screenshots stay in this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-white/25"
            aria-label="Close sign-in dialog"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {!isConfigured && (
          <p
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
            role="alert"
          >
            Supabase env vars are not configured yet. Add your Supabase URL and
            publishable key to enable sign-in.
          </p>
        )}

        <div className="mt-5 space-y-3">
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={!isConfigured || isGoogleLoading || isEmailLoading}
            className="h-11 w-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white text-[11px] font-black text-slate-950 dark:bg-slate-950 dark:text-white">
                G
              </span>
            )}
            Continue with Google
          </Button>

          <div className="grid gap-2">
            <label
              htmlFor="auth-email"
              className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-300"
            >
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white/25 dark:focus:ring-white/10"
            />
          </div>

          {hasSentOtp && (
            <div className="grid gap-2">
              <label
                htmlFor="auth-otp"
                className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-300"
              >
                Email code
              </label>
              <input
                id="auth-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="123456"
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white/25 dark:focus:ring-white/10"
              />
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={hasSentOtp ? handleVerifyOtp : handleSendOtp}
            disabled={!isConfigured || isGoogleLoading || isEmailLoading}
            className={cn(
              "h-10 w-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15",
            )}
          >
            {isEmailLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Mail className="h-4 w-4" aria-hidden="true" />
            )}
            {hasSentOtp ? "Verify email code" : "Send email code"}
          </Button>
        </div>

        <div className="mt-5 rounded-xl border border-emerald-200/70 bg-emerald-50/80 px-3 py-2 text-xs leading-5 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Privacy note
          </span>
          <span className="mt-1 block">
            We use essential auth cookies to keep you signed in. We store basic
            account details only, not screenshots. Read the{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/cookies" className="underline underline-offset-2">
              Cookies
            </Link>
            , and{" "}
            <Link href="/terms" className="underline underline-offset-2">
              Terms
            </Link>
            .
          </span>
        </div>
      </section>
    </div>
  );
}
