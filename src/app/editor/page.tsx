"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Layers3,
  MousePointer2,
  Sparkles,
  Wand2,
} from "lucide-react";

import EditorSettingsPanel from "@/components/editor/EditorSettingsPanel";
import { ExportProvider } from "@/components/editor/ExportProvider";
import UploadZone from "@/components/editor/UploadZone";
import { useEditorStore } from "@/store/editor-store";

export default function EditorPage() {
  const uploadedImage = useEditorStore((state) => state.uploadedImage);

  return (
    <ExportProvider>
      <main className="relative min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(115deg,rgba(20,184,166,0.16),rgba(99,102,241,0.12)_42%,rgba(249,115,22,0.13)_74%,transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />
          <div className="absolute left-[-12%] top-28 h-24 w-[42rem] rotate-[-13deg] rounded-full bg-[linear-gradient(90deg,rgba(45,212,191,0),rgba(45,212,191,0.22),rgba(99,102,241,0.16),rgba(45,212,191,0))] blur-xl [animation:editor-scanline_9s_ease-in-out_infinite_alternate]" />
          <div className="absolute right-10 top-28 hidden h-28 w-48 rounded-[1.75rem] border border-white/80 bg-white/55 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl [animation:editor-float-card_7s_ease-in-out_infinite] lg:block">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-white">
                <Wand2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="h-2.5 w-24 rounded-full bg-slate-200" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <span className="h-9 rounded-xl bg-[#14b8a6]" />
              <span className="h-9 rounded-xl bg-[#6366f1]" />
              <span className="h-9 rounded-xl bg-[#fb923c]" />
            </div>
          </div>
          <div className="absolute bottom-16 left-8 hidden h-20 w-40 rounded-[1.5rem] border border-white/80 bg-white/60 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl [animation:editor-float-card_8s_ease-in-out_infinite_reverse] xl:block">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <MousePointer2 className="h-4 w-4 text-indigo-500" aria-hidden="true" />
              Drag, paste, export
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200">
              <div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,#14b8a6,#6366f1)]" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[1.75rem] border border-white/80 bg-white/85 px-4 py-3 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <Link
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#14b8a6,#6366f1)] text-white shadow-lg shadow-indigo-500/20">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-5 text-slate-950">
                  Screenshot Beautifier
                </p>
                <p className="text-xs text-slate-500">
                  Editor preview
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm sm:flex">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Browser private
            </div>
            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm lg:flex">
              <Layers3 className="h-4 w-4" aria-hidden="true" />
              Local only
            </div>
          </header>

          <section className="mx-auto grid w-full max-w-7xl flex-1 gap-4 py-4 sm:gap-5 sm:py-5 lg:grid-cols-[minmax(0,1fr)_380px]">
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
