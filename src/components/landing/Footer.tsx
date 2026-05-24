"use client";

import Link from "next/link";
import { Sparkles, Shield, Heart, Globe, BookOpen } from "lucide-react";

export default function Footer() {
  const CURRENT_YEAR = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-white text-slate-600 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">
      {/* Primary Footer Directory */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-5">
          
          {/* Column 1: Brand Profile & Security Trust */}
          <div className="flex flex-col gap-4 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-slate-950 dark:text-slate-100"
              aria-label="Screenshot Beautifier home"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-md dark:bg-white dark:text-slate-950">
                <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-display font-bold tracking-tight text-slate-950 dark:text-white">
                Screenshot Beautifier
              </span>
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              The premium, local-first utility for turning raw screenshots into high-impact launch creatives in one click.
            </p>
            
            {/* Privacy Trust Badge */}
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/50 p-2 text-[10px] font-semibold text-slate-500 dark:border-white/5 dark:bg-white/5 dark:text-slate-400">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              <span>100% Client-side. Privacy guaranteed.</span>
            </div>

            {/* Social & Contact Links */}
            <div className="mt-1 flex items-center gap-4 text-slate-400">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-slate-900 dark:hover:text-white"
                aria-label="Follow on X (Twitter)"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-slate-900 dark:hover:text-white"
                aria-label="Connect on LinkedIn"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="mailto:support@screenshotbeautifier.com"
                className="transition hover:text-slate-900 dark:hover:text-white"
                aria-label="Send an Email"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Capabilities & High-Intent Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Product
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  Browser Frames
                </Link>
              </li>
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  3D Perspective Tilt
                </Link>
              </li>
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  Canvas Presets
                </Link>
              </li>
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  Text Annotations
                </Link>
              </li>
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  High-Res PNG Export
                </Link>
              </li>
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  Clipboard Copy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Use Cases / Segments */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Use Cases
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  SaaS Product Launches
                </Link>
              </li>
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  Social Media Marketing
                </Link>
              </li>
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  Mobile App Mockups
                </Link>
              </li>
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  Pitch Decks & Demos
                </Link>
              </li>
              <li>
                <Link href="/editor" className="transition hover:text-slate-950 dark:hover:text-white">
                  Indie Hacking Builders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources & Guides (Natural Blog SEO Anchors) */}
          <div>
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              <BookOpen className="h-3.5 w-3.5 text-slate-500" />
              Resources
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/#faq" className="transition hover:text-slate-950 hover:underline dark:hover:text-white">
                  Product Hunt Launch Kit
                </Link>
              </li>
              <li>
                <Link href="/#examples" className="transition hover:text-slate-950 hover:underline dark:hover:text-white">
                  Optimal Twitter Image Sizes
                </Link>
              </li>
              <li>
                <Link href="/#features" className="transition hover:text-slate-950 hover:underline dark:hover:text-white">
                  Designing for Conversion
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition hover:text-slate-950 hover:underline dark:hover:text-white">
                  Client-side Privacy Guide
                </Link>
              </li>
              <li>
                <Link href="/#workflow" className="transition hover:text-slate-950 hover:underline dark:hover:text-white">
                  SaaS Screenshot Mockup Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Comparisons (Organic Comparative Search Targets) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Compare
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/#features" className="transition hover:text-slate-950 dark:hover:text-white">
                  vs Figma Mockups
                </Link>
              </li>
              <li>
                <Link href="/#features" className="transition hover:text-slate-950 dark:hover:text-white">
                  vs Canva Templates
                </Link>
              </li>
              <li>
                <Link href="/#features" className="transition hover:text-slate-950 dark:hover:text-white">
                  vs Cloud Generators
                </Link>
              </li>
              <li>
                <Link href="/#features" className="transition hover:text-slate-950 dark:hover:text-white">
                  vs Manual Crop Tools
                </Link>
              </li>
              <li>
                <Link href="/#features" className="transition hover:text-slate-950 dark:hover:text-white">
                  vs Browser DevTools
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Natural Geo-adaptivity Section */}
        <div className="mt-12 border-t border-slate-100 pt-8 dark:border-white/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <Globe className="h-3.5 w-3.5 text-slate-300 dark:text-slate-650" />
              <span>Designed for Builders Worldwide</span>
            </div>
            <p className="max-w-2xl text-[11px] leading-relaxed text-slate-400 font-medium dark:text-slate-500">
              Empowering remote startup founders, software builders, and designers globally — from tech hubs in Silicon Valley, London, and Austin, to developers in Bangalore, Tokyo, Berlin, Paris, Singapore, Toronto, and Sydney.
            </p>
          </div>
        </div>

        {/* Footer Base Legal & Credits */}
        <div className="mt-8 border-t border-slate-100 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[11px] font-medium text-slate-400 dark:border-white/10 dark:text-slate-500">
          <div>
            <span>© {CURRENT_YEAR} Screenshot Beautifier. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <Link href="/#faq" className="transition hover:text-slate-900 dark:hover:text-white">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/#faq" className="transition hover:text-slate-900 dark:hover:text-white">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/#faq" className="transition hover:text-slate-900 dark:hover:text-white">
              Security
            </Link>
            <span>•</span>
            <Link href="/#faq" className="transition hover:text-slate-900 dark:hover:text-white">
              GDPR Compliance
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
            <span>for founders globally.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
