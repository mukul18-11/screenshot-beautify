"use client";

import Link from "next/link";
import { ArrowLeft, Layers3, Sparkles } from "lucide-react";

import EditorSettingsPanel from "@/components/editor/EditorSettingsPanel";
import { ExportProvider } from "@/components/editor/ExportProvider";
import UploadZone from "@/components/editor/UploadZone";
import { useEditorStore } from "@/store/editor-store";

export default function EditorPage() {
  const uploadedImage = useEditorStore((state) => state.uploadedImage);

  return (
    <ExportProvider>
      <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_12%,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(99,102,241,0.20),transparent_32%),radial-gradient(circle_at_76%_92%,rgba(244,114,182,0.18),transparent_28%),linear-gradient(135deg,#f8fafc_0%,#eff6ff_46%,#fff7ed_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_10%_12%,rgba(45,212,191,0.12),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(99,102,241,0.16),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_50%,#111827_100%)] dark:text-white">
        <div className="flex min-h-screen flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-3xl border border-white/60 bg-white/50 px-4 py-3 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
            <Link
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-600 transition hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-white dark:text-slate-950">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-5 text-slate-950 dark:text-white">
                  Screenshot Beautifier
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Editor preview
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-2xl border border-white/70 bg-white/50 px-3 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-slate-300 sm:flex">
              <Layers3 className="h-4 w-4" aria-hidden="true" />
              Local only
            </div>
          </header>

          <section className="mx-auto grid w-full max-w-7xl flex-1 gap-4 py-4 sm:gap-5 sm:py-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex min-h-[560px] min-w-0 items-stretch">
              <UploadZone />
            </div>

            <EditorSettingsPanel uploadedImage={uploadedImage} />
          </section>
        </div>
      </main>
    </ExportProvider>
  );
}
