"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "#examples", label: "Examples" },
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: "#faq", label: "FAQ" },
] as const;

export default function LandingNav() {
  const shouldReduceMotion = useReducedMotion();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  function handleSectionClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    event.preventDefault();

    const section = document.querySelector(href);

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });

    window.history.pushState(null, "", href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-950/5 bg-white/72 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/72">
      <nav
        className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-slate-950 dark:text-white"
          aria-label="Screenshot Beautifier home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition-transform duration-300 hover:scale-105 dark:bg-white dark:text-slate-950 dark:shadow-white/5">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-display font-bold tracking-tight text-slate-950 dark:text-white">
            Screenshot Beautifier
          </span>
        </Link>

        <div
          className="hidden items-center gap-1.5 md:flex"
          onMouseLeave={() => setActiveItem(null)}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => handleSectionClick(event, item.href)}
              onBlur={() => setActiveItem(null)}
              onFocus={() => setActiveItem(item.href)}
              onMouseEnter={() => setActiveItem(item.href)}
              className="group relative isolate rounded-full px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:text-slate-300 dark:hover:text-white dark:focus-visible:ring-white/20"
            >
              {activeItem === item.href ? (
                <motion.span
                  className="absolute inset-0 -z-10 rounded-full bg-slate-950/[0.06] dark:bg-white/[0.06]"
                  layoutId="landing-nav-hover"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </Link>
          ))}
        </div>

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
