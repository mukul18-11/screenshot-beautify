"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthView = "forgot" | "options" | "password";
type PasswordMode = "login" | "signup";
type RecoveryStep = "code" | "email" | "password";
type OAuthProvider = "azure" | "github" | "google";
type ActiveAction =
  | "login"
  | "recovery-code"
  | "recovery-email"
  | "recovery-password"
  | "signup"
  | OAuthProvider
  | null;
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

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/editor";
  }

  try {
    const url = new URL(value, "https://snapingly.local");

    if (url.origin !== "https://snapingly.local") {
      return "/editor";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/editor";
  }
}

function getAuthCallbackUrl(nextPath: string) {
  const params = new URLSearchParams({
    next: nextPath,
  });

  return `${window.location.origin}/auth/callback?${params.toString()}`;
}

function getRecoveryReturnPath(nextPath: string) {
  const params = new URLSearchParams({
    next: nextPath,
    view: "recovery",
  });

  return `/login?${params.toString()}`;
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

function ProviderIcon({ provider }: { provider: OAuthProvider }) {
  if (provider === "github") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#101010]"
        aria-hidden="true"
      >
        GH
      </span>
    );
  }

  if (provider === "azure") {
    return (
      <span
        className="grid h-5 w-5 grid-cols-2 gap-0.5 overflow-hidden rounded-[3px]"
        aria-hidden="true"
      >
        <span className="bg-[#f25022]" />
        <span className="bg-[#7fba00]" />
        <span className="bg-[#00a4ef]" />
        <span className="bg-[#ffb900]" />
      </span>
    );
  }

  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-black text-[#4285f4]"
      aria-hidden="true"
    >
      G
    </span>
  );
}

function AuthInput({
  autoComplete,
  id,
  label,
  onChange,
  placeholder,
  type,
  value,
}: {
  autoComplete: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-14 rounded-[1.35rem] border border-white/[0.06] bg-white/[0.10] px-5 text-base font-semibold text-white outline-none transition placeholder:text-white/45 focus:border-teal-300/40 focus:bg-white/[0.13] focus:ring-4 focus:ring-teal-400/10"
      />
    </div>
  );
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get("next")),
    [searchParams],
  );
  const isRecoveryReturn = searchParams.get("view") === "recovery";
  const [authView, setAuthView] = useState<AuthView>(() =>
    isRecoveryReturn ? "forgot" : "options",
  );
  const [passwordMode, setPasswordMode] = useState<PasswordMode>("login");
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>(() =>
    isRecoveryReturn ? "password" : "email",
  );
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(() =>
    Boolean(supabase),
  );
  const [notice, setNotice] = useState<Notice>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState("");
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

      if (data.user && !isRecoveryReturn) {
        router.replace(nextPath);
        return;
      }

      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isRecoveryReturn, nextPath, router, supabase]);

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

  async function handleSendRecoveryCode(event: FormEvent<HTMLFormElement>) {
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

    // Supabase must use a recovery email template that exposes the OTP token.
    const { error } = await client.auth.resetPasswordForEmail(
      recoveryEmail.trim(),
      {
        redirectTo: getAuthCallbackUrl(getRecoveryReturnPath(nextPath)),
      },
    );

    setActiveAction(null);

    if (error) {
      setNotice({ tone: "error", text: error.message });
      return;
    }

    setRecoveryStep("code");
    setNotice({
      tone: "success",
      text: "Check your email and enter the verification code.",
    });
  }

  async function handleVerifyRecoveryCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const client = requireSupabase();

    if (!client) {
      return;
    }

    if (!recoveryCode.trim()) {
      setNotice({ tone: "error", text: "Enter the verification code." });
      return;
    }

    setNotice(null);
    setActiveAction("recovery-code");

    const { error } = await client.auth.verifyOtp({
      email: recoveryEmail.trim(),
      token: recoveryCode.trim(),
      type: "recovery",
    });

    setActiveAction(null);

    if (error) {
      setNotice({ tone: "error", text: error.message });
      return;
    }

    setRecoveryStep("password");
    setNotice({
      tone: "success",
      text: "Code verified. Set a new password.",
    });
  }

  async function handleUpdateRecoveredPassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const client = requireSupabase();

    if (!client) {
      return;
    }

    const passwordError = validatePassword(recoveryPassword);

    if (passwordError) {
      setNotice({ tone: "error", text: passwordError });
      return;
    }

    if (recoveryPassword !== recoveryConfirmPassword) {
      setNotice({ tone: "error", text: "Passwords do not match." });
      return;
    }

    setNotice(null);
    setActiveAction("recovery-password");

    const { error } = await client.auth.updateUser({
      password: recoveryPassword,
    });

    setActiveAction(null);

    if (error) {
      setNotice({ tone: "error", text: error.message });
      return;
    }

    toast.success("Password updated");
    router.replace(nextPath);
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
              setRecoveryStep("email");
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
    const isEmailStep = recoveryStep === "email";
    const isCodeStep = recoveryStep === "code";

    return (
      <div className="rounded-[1.75rem] border border-white/[0.08] bg-[#151515] p-5 shadow-2xl shadow-black/35 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Forgot Password
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/55">
              {isEmailStep
                ? "Enter your email address and we will send you a verification code."
                : isCodeStep
                  ? "Enter the verification code from your email."
                  : "Choose a new password for your account."}
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
          {isEmailStep && (
            <form className="space-y-4" onSubmit={handleSendRecoveryCode}>
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
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Send Verification Code
              </button>
            </form>
          )}

          {isCodeStep && (
            <form className="space-y-4" onSubmit={handleVerifyRecoveryCode}>
              <AuthInput
                id="recovery-code"
                label="Verification code"
                type="text"
                autoComplete="one-time-code"
                value={recoveryCode}
                onChange={setRecoveryCode}
                placeholder="Verification code"
              />
              <button
                type="submit"
                disabled={!isConfigured || isBusy}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-[1.35rem] bg-teal-500/70 px-5 text-base font-bold text-white shadow-lg shadow-teal-950/25 transition hover:bg-teal-400/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/20 disabled:pointer-events-none disabled:opacity-55"
              >
                {activeAction === "recovery-code" && (
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Verify Code
              </button>
            </form>
          )}

          {recoveryStep === "password" && (
            <form
              className="space-y-4"
              onSubmit={handleUpdateRecoveredPassword}
            >
              <AuthInput
                id="recovery-new-password"
                label="New password"
                type="password"
                autoComplete="new-password"
                value={recoveryPassword}
                onChange={setRecoveryPassword}
                placeholder="New password"
              />
              <AuthInput
                id="recovery-confirm-password"
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                value={recoveryConfirmPassword}
                onChange={setRecoveryConfirmPassword}
                placeholder="Confirm password"
              />
              <button
                type="submit"
                disabled={!isConfigured || isBusy}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-[1.35rem] bg-teal-500/70 px-5 text-base font-bold text-white shadow-lg shadow-teal-950/25 transition hover:bg-teal-400/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/20 disabled:pointer-events-none disabled:opacity-55"
              >
                {activeAction === "recovery-password" && (
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Update Password
              </button>
            </form>
          )}
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
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-orange-400 to-teal-400 text-slate-950 shadow-lg shadow-black/20">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            </span>
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
