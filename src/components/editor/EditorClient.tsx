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
      <main className="relative min-h-screen bg-[#f7f8fa] text-slate-950">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-100/80 to-transparent" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col px-4 py-3 sm:px-6 lg:px-8">
          <header className="mx-auto flex w-full max-w-7xl items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <span className="text-[13px] font-semibold text-slate-700">
                  Screenshot Beautifier
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Local only · Private
            </div>
          </header>

          <section className="mx-auto grid w-full max-w-7xl flex-1 gap-5 py-4 lg:grid-cols-[minmax(0,1fr)_360px]">
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
