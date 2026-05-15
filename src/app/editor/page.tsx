"use client";

import Link from "next/link";
import { ArrowLeft, Layers3, SlidersHorizontal, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import ImageMetaCard from "@/components/editor/ImageMetaCard";
import UploadZone from "@/components/editor/UploadZone";
import { useEditorStore } from "@/store/editor-store";

export default function EditorPage() {
  const uploadedImage = useEditorStore((state) => state.uploadedImage);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_16%,rgba(45,212,191,0.24),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_76%_88%,rgba(244,114,182,0.20),transparent_30%),linear-gradient(135deg,#f8fafc_0%,#edf4ff_44%,#fff7ed_100%)] text-slate-950">
      <div className="flex min-h-screen flex-col px-5 py-5 sm:px-6 lg:px-8">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/45 px-4 py-3 shadow-soft backdrop-blur-2xl">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/70 hover:text-slate-950"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-5 text-slate-950">
                Screenshot Beautifier
              </p>
              <p className="text-xs text-slate-500">Editor preview</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-white/70 bg-white/50 px-3 py-2 text-xs font-medium text-slate-500 sm:flex">
            <Layers3 className="h-4 w-4" aria-hidden="true" />
            Local only
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-7xl flex-1 gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-h-[560px] items-stretch">
            <UploadZone />
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            className="rounded-2xl border border-white/60 bg-white/50 p-5 shadow-soft backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-200/70 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Settings
                </h2>
                <p className="text-sm text-slate-500">Canvas controls</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {uploadedImage ? (
                <ImageMetaCard
                  key={uploadedImage.id}
                  uploadedImage={uploadedImage}
                />
              ) : (
                <motion.div
                  key="empty-settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="flex min-h-[420px] items-center justify-center text-center"
                >
                  <div className="max-w-[260px]">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white/70">
                      <SlidersHorizontal
                        className="h-6 w-6 text-slate-400"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-sm font-medium leading-6 text-slate-600">
                      Upload or paste a screenshot to start editing.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </section>
      </div>
    </main>
  );
}
