"use client";

import Link from "next/link";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";

import EditorSettingsPanel from "@/components/editor/EditorSettingsPanel";
import { ExportProvider } from "@/components/editor/ExportProvider";
import UploadZone from "@/components/editor/UploadZone";
import { useEditorStore } from "@/store/editor-store";

export default function EditorClient() {
  const uploadedImage = useEditorStore((state) => state.uploadedImage);

  return (
    <ExportProvider>
      <main className="relative min-h-screen bg-[var(--editor-bg)] text-[var(--editor-ink)]">
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--editor-border)] bg-white/90 px-4 shadow-sm shadow-slate-950/[0.04] backdrop-blur-xl sm:px-5 lg:px-6">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--editor-soft)] transition hover:bg-[var(--editor-panel-muted)] hover:text-[var(--editor-ink)]"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--editor-ink)] text-white shadow-lg shadow-slate-950/15">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-sm font-bold font-display tracking-tight text-[var(--editor-ink)]">
                    Screenshot Beautifier
                  </span>
                  <span className="hidden text-[11px] font-semibold text-[var(--editor-muted)] sm:block">
                    Launch visuals, <span className="bg-gradient-to-r from-teal-500 via-cyan-500 via-indigo-500 via-sky-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent font-bold animate-gradient-flow">made locally</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[var(--editor-border)] bg-white/70 px-3 py-1.5 text-[11px] font-bold text-[var(--editor-muted)] shadow-sm">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Local only · Private
            </div>
          </header>

          <section className="grid min-h-0 w-full flex-1 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_440px]">
            <div className="relative flex min-h-[calc(100svh-4rem)] min-w-0 items-stretch overflow-hidden bg-white">
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(9, 9, 11, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(9, 9, 11, 0.07) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
                aria-hidden="true"
              />
              <UploadZone />
            </div>

            <EditorSettingsPanel uploadedImage={uploadedImage} />
          </section>
        </div>
      </main>
    </ExportProvider>
  );
}
