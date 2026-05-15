"use client";

import { RefreshCw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

type ReplaceImageButtonProps = {
  disabled?: boolean;
  onReplace: () => void;
};

export default function ReplaceImageButton({
  disabled = false,
  onReplace,
}: ReplaceImageButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={{ y: disabled || shouldReduceMotion ? 0 : -1 }}
      whileTap={{ scale: disabled || shouldReduceMotion ? 1 : 0.98 }}
    >
      <Button
        type="button"
        size="sm"
        variant="secondary"
        aria-label="Replace screenshot image"
        onClick={(event) => {
          event.stopPropagation();
          onReplace();
        }}
        disabled={disabled}
        className="border border-white/70 bg-white/85 text-slate-700 shadow-lg shadow-slate-950/10 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Replace image
      </Button>
    </motion.div>
  );
}
