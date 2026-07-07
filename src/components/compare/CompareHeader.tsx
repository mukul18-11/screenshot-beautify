import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CompareHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-950/5 bg-white/72 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/72">
      <nav
        className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-slate-950 dark:text-white"
          aria-label="Snapingly home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-white dark:text-slate-950 dark:shadow-white/5">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-display font-bold tracking-tight text-slate-950 dark:text-white">
            Snapingly
          </span>
        </Link>

        <Button
          asChild
          size="sm"
          className="bg-slate-950 text-white hover:bg-slate-900 flex items-center gap-1.5 rounded-lg shadow-sm dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
        >
          <Link href="/editor">
            Open editor
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
