"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type SVGProps,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { SnapinglyMark } from "@/components/brand/SnapinglyLogo";
import { getSafeNextPath } from "@/lib/auth/next-path";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import AuthInput from "@/components/auth/AuthInput";

type AuthView = "forgot" | "options" | "password";
type PasswordMode = "login" | "signup";
type OAuthProvider = "azure" | "github" | "google";
type ActiveAction = "login" | "recovery-email" | "signup" | OAuthProvider | null;
type Notice = {
  tone: "error" | "success";
  text: string;
} | null;

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OAUTH_OPTIONS: Array<{
  label: string;
  provider: OAuthProvider;
}> = [
  {
    label: "Continue with Google",
    provider: "google",
  },
  {
    label: "Continue with Microsoft",
    provider: "azure",
  },
  {
    label: "Continue with GitHub",
    provider: "github",
  },
];

function getAuthCallbackUrl(nextPath: string) {
  const params = new URLSearchParams({
    next: nextPath,
  });

  return `${window.location.origin}/auth/callback?${params.toString()}`;
}

function validateEmail(value: string) {
  const email = value.trim();

  if (!email) {
    return "Enter your email address.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }

  return null;
}

function validatePassword(value: string) {
  if (!value) {
    return "Enter your password.";
  }

  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return null;
}

function GoogleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.84c2.25-2.07 3.58-5.12 3.58-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.84-2.98c-1.08.72-2.45 1.15-4.09 1.15-3.14 0-5.8-2.12-6.75-4.97H1.29v3.07C3.26 21.26 7.3 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.25 14.27A7.17 7.17 0 0 1 4.87 12c0-.79.14-1.55.38-2.27V6.66H1.29A11.93 11.93 0 0 0 0 12c0 1.93.46 3.76 1.29 5.34l3.96-3.07z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.21 15.24 0 12 0 7.3 0 3.26 2.74 1.29 6.66l3.96 3.07C6.2 6.88 8.86 4.76 12 4.76z"
      />
    </svg>
  );
}

function MicrosoftLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  );
}

function GitHubLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .3C5.37.3 0 5.67 0 12.3c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.08 1.83 2.82 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.57A12.02 12.02 0 0 0 24 12.3C24 5.67 18.63.3 12 .3z" />
    </svg>
  );
}

function ProviderIcon({ provider }: { provider: OAuthProvider }) {
  if (provider === "github") {
    return <GitHubLogo className="h-5 w-5 text-white" />;
  }

  if (provider === "azure") {
    return <MicrosoftLogo className="h-5 w-5" />;
  }

  return <GoogleLogo className="h-5 w-5" />;
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get("next")),
    [searchParams],
  );
  const [authView, setAuthView] = useState<AuthView>("options");
  const [passwordMode, setPasswordMode] = useState<PasswordMode>("login");
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(() =>
    Boolean(supabase),
  );
  const [notice, setNotice] = useState<Notice>(() =>
    searchParams.get("auth") === "error"
      ? {
          tone: "error",
          text: "Sign-in failed or the link expired. Please try again.",
        }
      : null,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const isConfigured = Boolean(supabase);
  const isBusy = isCheckingSession || activeAction !== null;

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      if (data.user) {
        router.replace(nextPath);
        return;
      }

      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, [nextPath, router, supabase]);

  function requireSupabase() {
    if (!supabase) {
      setNotice({
        tone: "error",
        text: "Supabase is not configured yet. Add the public URL and publishable key to enable sign-in.",
      });
      return null;
    }

    return supabase;
  }

  async function handleOAuthSignIn(provider: OAuthProvider) {
    const client = requireSupabase();

    if (!client) {
      return;
    }

    setNotice(null);
    setActiveAction(provider);

    const redirectTo = getAuthCallbackUrl(nextPath);
    const options =
      provider === "google"
        ? {
            queryParams: {
              prompt: "select_account",
            },
            redirectTo,
          }
        : {
            redirectTo,
          };
    const { error } = await client.auth.signInWithOAuth({
      options,
      provider,
    });

    if (error) {
      setActiveAction(null);
      setNotice({ tone: "error", text: error.message });
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const client = requireSupabase();

    if (!client) {
      return;
    }

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setNotice({ tone: "error", text: emailError ?? passwordError ?? "" });
      return;
    }

    if (passwordMode === "signup" && password !== confirmPassword) {
      setNotice({ tone: "error", text: "Passwords do not match." });
      return;
    }

    setNotice(null);

    if (passwordMode === "login") {
      setActiveAction("login");

      const { error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setActiveAction(null);

      if (error) {
        setNotice({ tone: "error", text: error.message });
        return;
      }

      toast.success("Signed in");
      router.replace(nextPath);
      return;
    }

    setActiveAction("signup");

    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      options: {
        emailRedirectTo: getAuthCallbackUrl(nextPath),
      },
      password,
    });

    setActiveAction(null);

    if (error) {
      setNotice({ tone: "error", text: error.message });
      return;
    }

    if (data.session) {
      toast.success("Account created");
      router.replace(nextPath);
      return;
    }

    setNotice({
      tone: "success",
      text: "Check your email to confirm your account, then log in.",
    });
  }

  async function handleSendResetLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const client = requireSupabase();

    if (!client) {
      return;
    }

    const emailError = validateEmail(recoveryEmail);

    if (emailError) {
      setNotice({ tone: "error", text: emailError });
      return;
    }

    setNotice(null);
    setActiveAction("recovery-email");

    const { error } = await client.auth.resetPasswordForEmail(
      recoveryEmail.trim(),
      {
        redirectTo: getAuthCallbackUrl("/reset-password"),
      },
    );

    setActiveAction(null);

    if (error) {
      setNotice({ tone: "error", text: error.message });
      return;
    }

    setNotice({
      tone: "success",
      text: "Check your email for a password reset link.",
    });
  }

  function renderNotice() {
    if (!notice) {
      return null;
    }

    return (
      <p
        className={cn(
          "rounded-2xl border px-4 py-3 text-sm font-semibold leading-5",
          notice.tone === "error"
            ? "border-rose-400/25 bg-rose-400/10 text-rose-100"
            : "border-teal-300/25 bg-teal-300/10 text-teal-100",
        )}
        role="alert"
      >
        {notice.text}
      </p>
    );
  }

  function renderOptions() {
    return (
      <div className="space-y-3">
        {OAUTH_OPTIONS.map((option) => (
          <button
            key={option.provider}
            type="button"
            onClick={() => handleOAuthSignIn(option.provider)}
            disabled={!isConfigured || isBusy}
            className="relative flex h-14 w-full items-center justify-center gap-3 rounded-[1.35rem] bg-white/[0.13] px-5 text-base font-bold text-white transition hover:bg-white/[0.18] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/20 disabled:pointer-events-none disabled:opacity-50"
          >
            {activeAction === option.provider ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <ProviderIcon provider={option.provider} />
            )}
            {option.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setAuthView("password");
            setNotice(null);
          }}
          disabled={isBusy}
          className="relative flex h-14 w-full items-center justify-center gap-3 rounded-[1.35rem] bg-white/[0.13] px-5 text-base font-bold text-white transition hover:bg-white/[0.18] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/20 disabled:pointer-events-none disabled:opacity-50"
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          Email / Password
        </button>
      </div>
    );
  }

  function renderPasswordForm() {
    const isLogin = passwordMode === "login";

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            setAuthView("options");
            setNotice(null);
          }}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[1.35rem] bg-white/[0.13] px-5 text-sm font-bold text-white transition hover:bg-white/[0.18] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/20"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        <div className="grid h-14 grid-cols-2 rounded-[1.35rem] bg-white/[0.13] p-1">
          {(["login", "signup"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setPasswordMode(mode);
                setNotice(null);
              }}
              className={cn(
                "rounded-[1.1rem] text-sm font-bold text-white/65 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/20",
                passwordMode === mode && "bg-white/[0.12] text-white shadow-lg",
              )}
              aria-pressed={passwordMode === mode}
            >
              {mode === "login" ? "Login" : "Sign up"}
            </button>
          ))}
        </div>

        <form className="space-y-3" onSubmit={handlePasswordSubmit}>
          <AuthInput
            id="auth-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            placeholder="Email"
          />
          <AuthInput
            id="auth-password"
            label="Password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={setPassword}
            placeholder="Password"
          />
          {!isLogin && (
            <AuthInput
              id="auth-confirm-password"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm Password"
            />
          )}
          <button
            type="submit"
            disabled={!isConfigured || isBusy}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-[1.35rem] bg-teal-500/70 px-5 text-base font-bold text-white shadow-lg shadow-teal-950/25 transition hover:bg-teal-400/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/20 disabled:pointer-events-none disabled:opacity-55"
          >
            {activeAction === (isLogin ? "login" : "signup") && (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            )}
            {isLogin ? "Login" : "Sign up"}
          </button>
        </form>

        {isLogin && (
          <button
            type="button"
            onClick={() => {
              setAuthView("forgot");
              setRecoveryEmail(email);
              setNotice(null);
            }}
            className="text-sm font-bold text-teal-300 transition hover:text-teal-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/20"
          >
            Forgot Password?
          </button>
        )}
      </div>
    );
  }

  function renderRecoveryForm() {
    return (
      <div className="rounded-[1.75rem] border border-white/[0.08] bg-[#151515] p-5 shadow-2xl shadow-black/35 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Forgot Password
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/55">
              Enter your email address and we will send you a password reset
              link.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAuthView("password");
              setNotice(null);
            }}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/50 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/20"
            aria-label="Close password recovery"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6">
          <form className="space-y-4" onSubmit={handleSendResetLink}>
            <AuthInput
              id="recovery-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={recoveryEmail}
              onChange={setRecoveryEmail}
              placeholder="username@example.com"
            />
            <button
              type="submit"
              disabled={!isConfigured || isBusy}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[1.35rem] bg-teal-500/70 px-5 text-base font-bold text-white shadow-lg shadow-teal-950/25 transition hover:bg-teal-400/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/20 disabled:pointer-events-none disabled:opacity-55"
            >
              {activeAction === "recovery-email" && (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              )}
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101010] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col">
        <header className="flex h-12 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-black text-white"
            aria-label="Snapingly home"
          >
            <SnapinglyMark
              size={36}
              className="shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
            />
            <span className="hidden sm:inline">Snapingly</span>
          </Link>
          <Link
            href="/editor"
            className="inline-flex h-11 items-center justify-center rounded-full bg-teal-500/80 px-5 text-sm font-black text-white shadow-lg shadow-teal-950/20 transition hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/20"
          >
            Open editor
          </Link>
        </header>

        <section className="flex flex-1 items-start justify-center pt-20 sm:pt-28">
          <div className="w-full max-w-[30rem]">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Log in or Sign up
            </h1>
            <div className="mt-6 border-t border-white/10 pt-5">
              {!isConfigured && (
                <p
                  className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-semibold leading-5 text-amber-100"
                  role="alert"
                >
                  Supabase env vars are not configured yet. Add the public URL
                  and publishable key to enable sign-in.
                </p>
              )}
              {renderNotice()}
              <div className={notice ? "mt-4" : undefined}>
                {authView === "options" && renderOptions()}
                {authView === "password" && renderPasswordForm()}
                {authView === "forgot" && renderRecoveryForm()}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
