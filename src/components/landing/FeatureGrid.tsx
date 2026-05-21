"use client";

import { useState } from "react";
import {
  Box,
  Download,
  Frame,
  Palette,
  ShieldCheck,
  Type,
  Lock,
  Sparkles,
  MousePointer,
  ArrowRight,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export default function FeatureGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [activePreset, setActivePreset] = useState<number>(0);

  const presets = [
    { name: "Sunset Mesh", bg: "linear-gradient(135deg, #ff6154 0%, #ff8a3d 52%, #fff1d6 100%)" },
    { name: "Oceanic", bg: "linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #0f172a 100%)" },
    { name: "Neon Dark", bg: "radial-gradient(circle at 10% 10%, #6366f1 0%, transparent 40%), radial-gradient(circle at 90% 90%, #ec4899 0%, transparent 40%), #0f172a" },
  ];

  return (
    <section
      id="features"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-18"
    >
      <div className="mx-auto max-w-xl text-center mb-12">
        <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wider">Features</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-[2.5rem] tracking-tight leading-tight">
          Everything you need to make screenshots feel <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 bg-clip-text text-transparent font-black tracking-tighter drop-shadow-[0_2px_10px_rgba(236,72,153,0.1)]">shipped</span>
        </h2>
        <p className="mt-3 text-base text-slate-600">
          Screenshot Beautifier bundles layout controls, backgrounds, text overlays, 
          and depth into one fast browser-based tool.
        </p>
      </div>

      {/* Advanced Bento Grid */}
      <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-6">
        
        {/* Card 1: Upload & Styles (col-span-4) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:col-span-4 flex flex-col justify-between min-h-[300px]"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-orange-400/10 blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:bg-orange-400/15" />
          
          <div>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <Palette className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-bold font-display tracking-tight text-slate-950">
              One-click quick styles
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Upload, drop, or paste a screenshot, and instantly apply beautiful background 
              gradients, padding configurations, browser chrome, and drop shadows.
            </p>
          </div>

          {/* Interactive CSS Mockup */}
          <div className="mt-6 grid gap-4 sm:grid-cols-[1.2fr_0.8fr] items-center rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <div className="relative h-28 rounded-lg overflow-hidden border border-white bg-slate-100 flex items-center justify-center transition-all duration-500"
                 style={{ background: presets[activePreset].bg }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:12px_12px] opacity-40" />
              <motion.div 
                layout
                className="w-[75%] h-[60%] rounded border border-white/20 bg-slate-950/90 shadow-lg p-1.5 flex flex-col gap-1 z-10"
              >
                <div className="flex gap-1">
                  <span className="h-1 w-1 rounded-full bg-rose-400" />
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                </div>
                <div className="h-1 w-[40%] rounded-full bg-white/20" />
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <div className="h-6 rounded bg-cyan-300/60" />
                  <div className="h-6 rounded bg-white/10" />
                </div>
              </motion.div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Interactive presets</span>
              {presets.map((p, index) => (
                <button
                  key={p.name}
                  onClick={() => setActivePreset(index)}
                  className={cn(
                    "w-full text-left px-2.5 py-1 text-xs rounded-lg font-medium border transition-all flex items-center justify-between",
                    activePreset === index 
                      ? "bg-slate-950 text-white border-slate-950 shadow-sm" 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  <span>{p.name}</span>
                  {activePreset === index && <Sparkles className="h-3 w-3 text-cyan-300 animate-pulse" />}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Card 2: Interactive 3D Depth (col-span-2) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.05 }}
          className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:col-span-2 flex flex-col justify-between min-h-[300px]"
        >
          <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:bg-cyan-400/15" />
          
          <div>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <Box className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-bold font-display tracking-tight text-slate-950">
              CSS 3D tilt
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Apply structural depth. Hover over this card to watch the screenshot mockup tilt in 3D.
            </p>
          </div>

          {/* Interactive 3D Mockup */}
          <div 
            className="mt-6 flex h-28 items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 p-2 cursor-pointer [perspective:800px]"
            aria-hidden="true"
          >
            <motion.div
              style={{ transformStyle: "preserve-3d" }}
              whileHover={shouldReduceMotion ? undefined : {
                rotateX: 18,
                rotateY: -22,
                rotateZ: 2,
                scale: 1.05,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="relative w-36 h-20 rounded-lg border border-white bg-slate-950 shadow-2xl p-2 flex flex-col gap-1.5"
            >
              {/* Simulated 3D Depth Layers */}
              <div className="flex gap-1">
                <span className="h-1 w-1 rounded-full bg-rose-400" />
                <span className="h-1 w-1 rounded-full bg-amber-400" />
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
              </div>
              <div className="h-1 w-[40%] rounded-full bg-white/20" />
              <div 
                style={{ transform: "translateZ(14px)" }}
                className="mt-1 h-7 rounded border border-white/20 bg-cyan-300/80 shadow-lg flex items-center justify-center text-[8px] font-bold text-slate-950"
              >
                Hover to tilt
              </div>
              <motion.div 
                animate={shouldReduceMotion ? undefined : { x: [0, 6, 0], y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translateZ(25px)" }}
                className="absolute -right-2 -bottom-2 h-7 w-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shadow-lg"
              >
                <MousePointer className="h-3 w-3 text-cyan-300" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Card 3: Browser Frames (col-span-3) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
          className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:col-span-3 flex flex-col justify-between min-h-[300px]"
        >
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:bg-indigo-400/15" />
          
          <div>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <Frame className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-bold font-display tracking-tight text-slate-950">
              Browser frames
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Wrap your screens in clean macOS-style dark/light browser borders, 
              or choose minimal chrome structures for professional landing page mockups.
            </p>
          </div>

          {/* Interactive Browser Mockup */}
          <div className="mt-6 h-28 rounded-xl border border-slate-100 bg-slate-50/50 p-2 flex items-end overflow-hidden justify-center">
            <div className="w-[90%] h-24 rounded-t-xl border-t border-x border-slate-200 bg-white shadow-md flex flex-col">
              <div className="h-6 rounded-t-xl bg-slate-100/80 border-b border-slate-200 px-2.5 flex items-center justify-between">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="h-3 w-32 rounded bg-white border border-slate-200/50 flex items-center justify-center text-[7px] text-slate-400">
                  yourproduct.com
                </div>
                <div className="w-4" />
              </div>
              <div className="flex-1 bg-slate-50 p-2 space-y-1.5">
                <div className="h-2 w-14 rounded-full bg-slate-300" />
                <div className="h-1.5 w-24 rounded-full bg-slate-200" />
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <div className="h-8 rounded bg-slate-200/40" />
                  <div className="h-8 rounded bg-cyan-300/40" />
                  <div className="h-8 rounded bg-slate-200/40" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Text Overlays (col-span-3) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.15 }}
          className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:col-span-3 flex flex-col justify-between min-h-[300px]"
        >
          <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:bg-emerald-400/15" />
          
          <div>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <Type className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-bold font-display tracking-tight text-slate-950">
              Text overlays
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explain changes directly in the image. Add badges, large bold titles, 
              and secondary support captions with custom fonts and positions.
            </p>
          </div>

          {/* Text Mockup Display */}
          <div className="mt-6 h-28 rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex flex-col justify-center items-center">
            <div className="text-center space-y-1.5 max-w-[200px]">
              <span className="inline-block rounded-full bg-slate-950 px-2 py-0.5 text-[8px] font-semibold text-cyan-300">
                PRODUCT HUNT
              </span>
              <p className="text-xs font-bold text-slate-950 leading-tight">
                Introducing Version 2.0
              </p>
              <p className="text-[9px] text-slate-600 leading-tight">
                Designed to make shipping look professional.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 5: Local Privacy (col-span-2) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
          className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:col-span-2 flex flex-col justify-between min-h-[300px]"
        >
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:bg-teal-400/15" />
          
          <div>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-bold font-display tracking-tight text-slate-950">
              Local-first privacy
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your screenshots stay securely on your computer. No accounts required, no uploads, and no tracking.
            </p>
          </div>

          {/* Secure Shield Mockup */}
          <div className="mt-6 flex h-28 items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 p-2">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <motion.div 
                animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-slate-300"
              />
              <motion.div 
                animate={shouldReduceMotion ? undefined : { scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-12 w-12 rounded-full bg-emerald-100/50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-200/20"
              >
                <Lock className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Card 6: Custom Canvas & Export (col-span-4) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.25 }}
          className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:col-span-4 flex flex-col justify-between min-h-[300px]"
        >
          <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-pink-400/10 blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:bg-pink-400/15" />
          
          <div>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <Download className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-bold font-display tracking-tight text-slate-950">
              Sharp export scale
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Configure background grids, padding sizes, and export crystal-clear PNG 
              visuals. Upscale by 2x or 4x to ensure sharp displays on High-DPI screens.
            </p>
          </div>

          {/* Export Controls Mockup */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 items-center rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <div className="flex justify-center gap-1.5 p-2 bg-white rounded-lg border border-slate-200/50 shadow-sm">
              {["1x", "2x", "4x"].map((sc) => (
                <div 
                  key={sc} 
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-md border",
                    sc === "2x" 
                      ? "bg-slate-950 text-white border-slate-950 shadow-sm" 
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  )}
                >
                  {sc}
                </div>
              ))}
            </div>
            <motion.div 
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              className="w-full flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 text-white text-xs font-semibold shadow-md cursor-pointer group/btn"
            >
              <span>Download High-Res</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
