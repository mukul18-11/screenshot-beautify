"use client";

import { useCallback, useMemo, useRef, useState } from "react";

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
  const listRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<
    Partial<Record<Exclude<DesignTemplateFilter, "All">, HTMLDivElement | null>>
  >({});
  const activeTemplateId = useEditorStore((state) => state.activeTemplateId);
  const applyDesignTemplate = useEditorStore(
    (state) => state.applyDesignTemplate,
  );
  const templateCategories = useMemo(
    () =>
      DESIGN_TEMPLATE_FILTERS.filter(
        (filter): filter is Exclude<DesignTemplateFilter, "All"> =>
          filter !== "All" &&
          DESIGN_TEMPLATES.some((template) => template.category === filter),
      ),
    [],
  );
  const groupedTemplates = useMemo(
    () =>
      templateCategories.map((category) => ({
        category,
        templates: DESIGN_TEMPLATES.filter(
          (template) => template.category === category,
        ),
      })),
    [templateCategories],
  );

  const handleTemplateScroll = useCallback(() => {
    const listElement = listRef.current;

    if (!listElement) {
      return;
    }

    if (listElement.scrollTop < 24) {
      setActiveFilter("All");
      return;
    }

    const nextActiveCategory = templateCategories.reduce<DesignTemplateFilter>(
      (activeCategory, category) => {
        const sectionElement = sectionRefs.current[category];

        if (!sectionElement) {
          return activeCategory;
        }

        const sectionTop = sectionElement.offsetTop - listElement.scrollTop;

        return sectionTop <= 72 ? category : activeCategory;
      },
      "All",
    );

    setActiveFilter(nextActiveCategory);
  }, [templateCategories]);

  function handleFilterClick(filter: DesignTemplateFilter) {
    const listElement = listRef.current;

    setActiveFilter(filter);

    if (!listElement) {
      return;
    }

    if (filter === "All") {
      listElement.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const sectionElement = sectionRefs.current[filter];

    if (sectionElement) {
      listElement.scrollTo({
        top: sectionElement.offsetTop,
        behavior: "smooth",
      });
    }
  }

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
                onClick={() => handleFilterClick(filter)}
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

      <div
        ref={listRef}
        onScroll={handleTemplateScroll}
        className="max-h-[360px] space-y-4 overflow-y-auto pr-1"
      >
        {groupedTemplates.map(({ category, templates }) => (
          <div
            key={category}
            ref={(element) => {
              sectionRefs.current[category] = element;
            }}
            className="scroll-mt-2"
          >
            <div className="sticky top-0 z-10 mb-2 bg-white/95 py-1 backdrop-blur-sm dark:bg-slate-950/95">
              <p className="text-[11px] font-bold uppercase tracking-normal text-slate-400 dark:text-slate-500">
                {category}
              </p>
            </div>
            <div className="space-y-2">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  isActive={activeTemplateId === template.id}
                  template={template}
                  onApply={() => applyDesignTemplate(template.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
