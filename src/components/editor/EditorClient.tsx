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
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--editor-border)] bg-white/95 px-4 shadow-sm shadow-slate-950/[0.03] backdrop-blur-xl sm:px-5 lg:px-6">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--editor-soft)] transition hover:bg-[var(--editor-panel-muted)] hover:text-[var(--editor-ink)]"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--editor-ink)] text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <span className="text-[13px] font-semibold text-[var(--editor-ink)]">
                  Screenshot Beautifier
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--editor-muted)]">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Local only · Private
            </div>
          </header>

          <section className="grid min-h-0 w-full flex-1 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_440px]">
            <div className="relative flex min-h-[calc(100svh-3.5rem)] min-w-0 items-stretch overflow-hidden bg-[var(--editor-bg)]">
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(15, 23, 42, 0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.055) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
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
