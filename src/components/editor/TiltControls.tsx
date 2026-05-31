"use client";

import { Box, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import TiltPad from "@/components/editor/TiltPad";
import TiltPresetSelector from "@/components/editor/TiltPresetSelector";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";

export default function TiltControls() {
  const shouldReduceMotion = useReducedMotion();
  const resetTiltSettings = useEditorStore((state) => state.resetTiltSettings);

  return (
    <motion.section
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="border-b border-slate-100 py-4 dark:border-white/10"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <h3 className="text-[13px] font-semibold text-slate-700 dark:text-white">
            3D tilt
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={resetTiltSettings}
            className="h-6 gap-1 px-1.5 text-[11px] text-slate-400 hover:text-slate-600"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <TiltPresetSelector />
        <TiltPad />
      </div>
    </motion.section>
  );
}
