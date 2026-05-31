import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export default function LegalPage({
  children,
  description,
  title,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
        >
          Back to Snapingly
        </Link>
        <header className="mt-8 border-b border-slate-200 pb-8">
          <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
            Snapingly legal
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {description}
          </p>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Last updated: May 31, 2026
          </p>
        </header>
        <div className="mt-8 max-w-none space-y-6 text-slate-700 [&_h2]:pt-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-950 [&_p]:leading-7">
          {children}
        </div>
      </div>
    </main>
  );
}
