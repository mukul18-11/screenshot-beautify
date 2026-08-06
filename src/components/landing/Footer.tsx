"use client";

import Link from "next/link";
import { Shield, Heart, Globe, BookOpen } from "lucide-react";

import { SnapinglyLogo } from "@/components/brand/SnapinglyLogo";

export default function Footer() {
  const CURRENT_YEAR = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden border-t border-slate-100 bg-white text-slate-600 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">
      {/* Gradient hairline along the top edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        aria-hidden="true"
      />
      {/* Oversized ghost wordmark */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-10 hidden select-none justify-center overflow-hidden lg:flex"
        aria-hidden="true"
      >
        <span className="whitespace-nowrap font-display text-[11rem] font-black leading-none tracking-[-0.05em] text-slate-950/[0.025] dark:text-white/[0.025]">
          Snapingly
        </span>
      </div>

      {/* Primary Footer Directory */}
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-5">
          
          {/* Column 1: Brand Profile & Security Trust */}
          <div className="flex flex-col gap-4 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="text-slate-950 dark:text-slate-100"
              aria-label="Snapingly home"
            >
              <SnapinglyLogo size="sm" />
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              The premium, local-first utility for turning raw screenshots into high-impact launch creatives in one click.
            </p>
            
            {/* Privacy Trust Badge */}
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/50 p-2 text-[10px] font-semibold text-slate-500 dark:border-white/5 dark:bg-white/5 dark:text-slate-400">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              <span>Local editing. No screenshot uploads.</span>
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
                href="https://www.linkedin.com/in/mukul1811/"
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
                href="https://www.instagram.com/mukul_ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-slate-900 dark:hover:text-white"
                aria-label="Follow on Instagram"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://mukulbuilds.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-slate-900 dark:hover:text-white"
                aria-label="Founder website — mukulbuilds.com"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="mailto:support@snapingly.com"
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
                <Link href="/compare/figma-mockups" className="transition hover:text-slate-950 dark:hover:text-white">
                  vs Figma Mockups
                </Link>
              </li>
              <li>
                <Link href="/compare/canva-templates" className="transition hover:text-slate-950 dark:hover:text-white">
                  vs Canva Templates
                </Link>
              </li>
              <li>
                <Link href="/compare/cloud-generators" className="transition hover:text-slate-950 dark:hover:text-white">
                  vs Cloud Generators
                </Link>
              </li>
              <li>
                <Link href="/compare/manual-crop-tools" className="transition hover:text-slate-950 dark:hover:text-white">
                  vs Manual Crop Tools
                </Link>
              </li>
              <li>
                <Link href="/compare/browser-devtools" className="transition hover:text-slate-950 dark:hover:text-white">
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
              <Globe className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
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
            <span>© {CURRENT_YEAR} Snapingly. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <Link href="/privacy" className="transition hover:text-slate-900 dark:hover:text-white">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="transition hover:text-slate-900 dark:hover:text-white">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/cookies" className="transition hover:text-slate-900 dark:hover:text-white">
              Cookies
            </Link>
            <span>•</span>
            <Link href="/privacy" className="transition hover:text-slate-900 dark:hover:text-white">
              Data Rights
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
            <span>by</span>
            <a
              href="https://mukulbuilds.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Mukul Kumar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
