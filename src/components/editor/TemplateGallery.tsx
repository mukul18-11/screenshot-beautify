"use client";

import { useMemo, useState } from "react";

import { Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import TemplateCard from "@/components/editor/TemplateCard";
import {
  DESIGN_TEMPLATE_FILTERS,
  DESIGN_TEMPLATES,
  type DesignTemplateFilter,
} from "@/lib/design-templates";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

export default function TemplateGallery() {
  const [activeFilter, setActiveFilter] = useState<DesignTemplateFilter>("All");
  const shouldReduceMotion = useReducedMotion();
  const activeTemplateId = useEditorStore((state) => state.activeTemplateId);
  const applyDesignTemplate = useEditorStore(
    (state) => state.applyDesignTemplate,
  );
  const filteredTemplates = useMemo(() => {
    if (activeFilter === "All") {
      return DESIGN_TEMPLATES;
    }

    return DESIGN_TEMPLATES.filter(
      (template) => template.category === activeFilter,
    );
  }, [activeFilter]);

  return (
    <section className="border-b border-slate-200/70 py-5 dark:border-white/10">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#14b8a6,#6366f1)] text-white shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            Templates
          </h3>
        </div>
        <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-300">
          Start with a launch-ready design, then customize it.
        </p>
      </div>

      <div className="-mx-1 overflow-x-auto pb-2">
        <div className="flex gap-2 px-1">
          {DESIGN_TEMPLATE_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <motion.button
                key={filter}
                type="button"
                whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                  isActive
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-sm"
                    : "border-slate-200 bg-white/65 text-slate-600 shadow-sm hover:border-slate-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                )}
              >
                {filter}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            isActive={activeTemplateId === template.id}
            template={template}
            onApply={() => applyDesignTemplate(template.id)}
          />
        ))}
      </div>
    </section>
  );
}
