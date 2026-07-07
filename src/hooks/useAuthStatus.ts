"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

export function useAuthStatus() {
  const supabase = useMemo(() => createClient(), []);
  const isConfigured = Boolean(supabase);
  const [isLoading, setIsLoading] = useState(isConfigured);
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

    function refreshUser() {
      supabase?.auth.getUser().then(({ data }) => {
        if (isMounted) {
          setUser(data.user);
        }
      });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshUser();
      }
    }

    window.addEventListener("focus", refreshUser);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("focus", refreshUser);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [supabase]);

  return { isConfigured, isLoading, user };
}
