"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Lock,
  Minimize2,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
} from "lucide-react";
import { toast } from "sonner";

import CanvasPreview from "@/components/editor/CanvasPreview";
import EditorSettingsPanel from "@/components/editor/EditorSettingsPanel";
import { ExportProvider } from "@/components/editor/ExportProvider";
import UploadZone from "@/components/editor/UploadZone";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

export default function EditorClient() {
  const uploadedImage = useEditorStore((state) => state.uploadedImage);
  const isExporting = useEditorStore((state) => state.isExporting);
  const resetActiveScreenshotDesign = useEditorStore(
    (state) => state.resetActiveScreenshotDesign,
  );
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const isPreviewActive = isPreviewMode && Boolean(uploadedImage);
 
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as "light" | "dark" | null;
    const timer = window.setTimeout(() => {
      setTheme(savedTheme || "dark");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isPreviewMode) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewMode]);
 
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("app-theme", nextTheme);
  };

  function handleResetDesign() {
    resetActiveScreenshotDesign();
    toast.success("Screenshot reset to defaults");
  }

  return (
    <ExportProvider>
      <main
        className={cn(
          theme === "dark" && "dark",
          isPreviewActive
            ? "relative h-screen min-h-screen overflow-hidden bg-[#090909] text-white"
            : "relative min-h-screen bg-[var(--editor-bg)] text-[var(--editor-ink)] lg:h-screen lg:overflow-hidden",
        )}
      >
        {isPreviewActive ? (
          <div className="relative z-10 flex h-screen w-full items-center justify-center overflow-hidden px-3 py-14 sm:px-6 sm:py-16">
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className="absolute left-1/2 top-4 z-30 inline-flex h-9 -translate-x-1/2 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 text-xs font-bold text-white/85 shadow-lg shadow-black/30 backdrop-blur-xl transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              aria-label="Exit preview"
              title="Exit preview"
            >
              <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
              Exit Preview
            </button>
            <CanvasPreview
              artworkMode="export"
              showFitBadge={false}
              uploadedImage={uploadedImage}
            />
          </div>
        ) : (
        <div className="relative z-10 flex min-h-screen flex-col lg:h-full lg:min-h-0">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--editor-border)] bg-[var(--editor-panel)]/90 px-4 shadow-sm shadow-slate-950/[0.04] backdrop-blur-xl sm:px-5 lg:px-6">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--editor-soft)] transition hover:bg-[var(--editor-panel-muted)] hover:text-[var(--editor-ink)]"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg shadow-slate-950/15">
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
            <div className="flex items-center gap-2">
              {uploadedImage && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(true)}
                    disabled={isExporting}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[var(--editor-border)] bg-[var(--editor-panel-muted)] px-2.5 text-[11px] font-bold text-[var(--editor-soft)] transition hover:bg-[var(--editor-border)] hover:text-[var(--editor-ink)] disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Preview artwork"
                    title="Preview artwork"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDesign}
                    disabled={isExporting}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[var(--editor-border)] bg-[var(--editor-panel-muted)] px-2.5 text-[11px] font-bold text-[var(--editor-soft)] transition hover:bg-[var(--editor-border)] hover:text-[var(--editor-ink)] disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Reset screenshot to initial state"
                    title="Reset screenshot to initial state"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--editor-border)] bg-[var(--editor-panel-muted)] text-[var(--editor-soft)] transition hover:bg-[var(--editor-border)] hover:text-[var(--editor-ink)]"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5 text-amber-500 animate-[spin_60s_linear_infinite]" aria-hidden="true" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-indigo-500" aria-hidden="true" />
                )}
              </button>
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--editor-border)] bg-white/5 px-3 py-1.5 text-[11px] font-bold text-[var(--editor-muted)] shadow-sm">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Local only · Private
              </div>
            </div>
          </header>

          <section className="grid min-h-0 w-full flex-1 lg:grid-cols-[minmax(0,1fr)_420px] lg:overflow-hidden xl:grid-cols-[minmax(0,1fr)_440px]">
            <div className="relative flex h-[calc(100svh-4rem)] min-h-0 min-w-0 items-stretch overflow-hidden bg-[var(--editor-bg-strong)] lg:h-auto">
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
                aria-hidden="true"
              />
              <UploadZone />
            </div>

            <EditorSettingsPanel uploadedImage={uploadedImage} />
          </section>
        </div>
        )}
      </main>
    </ExportProvider>
  );
}
