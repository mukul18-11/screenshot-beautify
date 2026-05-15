"use client";

import { RefreshCw } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

type ReplaceImageButtonProps = {
  disabled?: boolean;
  onReplace: () => void;
};

export default function ReplaceImageButton({
  disabled = false,
  onReplace,
}: ReplaceImageButtonProps) {
  return (
    <motion.div whileHover={{ y: disabled ? 0 : -1 }} whileTap={{ scale: 0.98 }}>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={(event) => {
          event.stopPropagation();
          onReplace();
        }}
        disabled={disabled}
        className="border border-white/70 bg-white/85 text-slate-700 shadow-lg shadow-slate-950/10 hover:bg-white hover:text-slate-950"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Replace image
      </Button>
    </motion.div>
  );
}
