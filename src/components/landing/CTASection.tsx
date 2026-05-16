import Link from "next/link";

import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.28),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(244,114,182,0.24),transparent_30%),linear-gradient(135deg,#0f172a_0%,#312e81_58%,#111827_100%)] px-6 py-12 text-center text-white shadow-2xl shadow-slate-950/20 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Local-first screenshot polish
          </div>
          <h2 className="text-3xl font-semibold sm:text-5xl">
            Make your next product screenshot launch-ready
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            Open the editor, paste a screenshot, pick a template, and export a
            sharp PNG without sending the image anywhere.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-950 shadow-2xl shadow-slate-950/25 hover:bg-slate-100"
            >
              <Link href="/editor">
                Start beautifying
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
