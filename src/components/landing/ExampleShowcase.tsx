import Link from "next/link";

import { ArrowRight } from "lucide-react";

import ExampleCard from "@/components/landing/ExampleCard";
import { Button } from "@/components/ui/button";
import { EXAMPLE_SHOWCASE_ITEMS } from "@/lib/example-showcase";

export default function ExampleShowcase() {
  return (
    <section
      id="examples"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-cyan-700">Examples</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
          Polished examples built from simple CSS mockups
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600">
          These are illustrative layouts showing the kinds of visuals you can
          create with quick styles, frames, text overlays, and depth.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {EXAMPLE_SHOWCASE_ITEMS.map((example, index) => (
          <ExampleCard key={example.id} example={example} index={index} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          asChild
          size="lg"
          className="bg-slate-950 text-center text-white shadow-2xl shadow-slate-950/20 hover:bg-slate-800"
        >
          <Link href="/editor">
            Create your own screenshot
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
