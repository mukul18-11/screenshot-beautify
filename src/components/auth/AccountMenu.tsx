"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { toast } from "sonner";

import AuthModal from "@/components/auth/AuthModal";
import { getUserDisplayName } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/client";

export default function AccountMenu() {
  const supabase = useMemo(() => createClient(), []);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(() => Boolean(supabase));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setUser(data.user);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    setIsMenuOpen(false);
    toast.success("Signed out");
  }

  if (!user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsAuthOpen(true)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[var(--editor-border)] bg-[var(--editor-panel-muted)] px-2.5 text-[11px] font-bold text-[var(--editor-soft)] transition hover:bg-[var(--editor-border)] hover:text-[var(--editor-ink)] disabled:pointer-events-none disabled:opacity-55"
          disabled={isLoading}
        >
          <UserCircle className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Sign in</span>
        </button>
        <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      </>
    );
  }

  const displayName = getUserDisplayName(user);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsMenuOpen((current) => !current)}
        className="inline-flex h-9 max-w-[180px] items-center justify-center gap-1.5 rounded-xl border border-[var(--editor-border)] bg-[var(--editor-panel-muted)] px-2.5 text-[11px] font-bold text-[var(--editor-soft)] transition hover:bg-[var(--editor-border)] hover:text-[var(--editor-ink)]"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        <UserCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="hidden truncate sm:inline">{displayName}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>

      {isMenuOpen && (
        <div
          className="absolute right-0 top-11 z-30 w-72 rounded-2xl border border-[var(--editor-border)] bg-[var(--editor-panel)] p-3 text-[var(--editor-ink)] shadow-2xl shadow-slate-950/20"
          role="menu"
        >
          <div className="rounded-xl bg-[var(--editor-panel-muted)] px-3 py-2">
            <p className="truncate text-xs font-bold">{displayName}</p>
            <p className="mt-1 truncate text-[11px] font-semibold text-[var(--editor-muted)]">
              {user.email}
            </p>
            <p className="mt-2 inline-flex rounded-full border border-[var(--editor-border)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-normal text-[var(--editor-muted)]">
              Free plan
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex h-9 w-full items-center justify-start gap-2 rounded-xl px-3 text-xs font-bold text-[var(--editor-soft)] transition hover:bg-[var(--editor-panel-muted)] hover:text-[var(--editor-ink)]"
            role="menuitem"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
