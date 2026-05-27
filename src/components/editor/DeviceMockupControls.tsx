"use client";

import { useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import BrowserFrame from "@/components/editor/BrowserFrame";
import DeviceFrame from "@/components/editor/DeviceFrame";
import {
  DEVICE_MOCKUPS,
  DEVICE_MOCKUP_TABS,
  getDeviceMockupVariant,
  type DeviceMockupTabId,
} from "@/lib/device-mockups";
import { cn } from "@/lib/utils";
import { useEditorStore, type UploadedImage } from "@/store/editor-store";
import type { DeviceMockup, DeviceMockupCategory } from "@/types/editor";

type DeviceMockupControlsProps = {
  uploadedImage: UploadedImage;
};

type MockupGroup = {
  id: string;
  title: string;
  mockups: readonly DeviceMockup[];
};

const TAB_LABELS: Record<DeviceMockupTabId, string> = {
  all: "All",
  phone: "Phone",
  tablet: "Tablet",
  laptop: "Laptop",
  desktop: "Desktop",
  wearable: "Wearable",
};

const TAB_ICONS = {
  all: ImageIcon,
  phone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  desktop: Monitor,
  wearable: Watch,
} as const;

const GROUP_TITLES: Record<DeviceMockupCategory, string> = {
  essentials: "Essentials",
  phone: "iPhone Lineup",
  tablet: "iPad & Tablet",
  laptop: "MacBook",
  desktop: "Desktop",
  wearable: "Wearable",
};

function getMockupGroups(activeTab: DeviceMockupTabId): MockupGroup[] {
  if (activeTab !== "all") {
    return [
      {
        id: activeTab,
        title: GROUP_TITLES[activeTab],
        mockups: DEVICE_MOCKUPS.filter((mockup) => mockup.category === activeTab),
      },
    ];
  }

  return [
    "essentials",
    "phone",
    "tablet",
    "laptop",
    "desktop",
    "wearable",
  ].map((category) => ({
    id: category,
    title: GROUP_TITLES[category as DeviceMockupCategory],
    mockups: DEVICE_MOCKUPS.filter(
      (mockup) => mockup.category === category,
    ),
  }));
}

function ScreenshotPreview({ uploadedImage }: { uploadedImage: UploadedImage }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-white/15 bg-slate-950 shadow-sm">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `url(${uploadedImage.objectUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
    </div>
  );
}

function BrowserPreview({ uploadedImage }: { uploadedImage: UploadedImage }) {
  return (
    <div className="w-[86%] overflow-hidden rounded-md shadow-lg shadow-slate-950/20">
      <BrowserFrame
        radius={10}
        showUrl={false}
        theme="light"
        url="yourproduct.com"
        variant="macos"
      >
        <div
          className="aspect-[16/10] w-full"
          style={{
            backgroundImage: `url(${uploadedImage.objectUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      </BrowserFrame>
    </div>
  );
}

function DevicePreview({
  mockup,
  uploadedImage,
  variantId,
}: {
  mockup: DeviceMockup;
  uploadedImage: UploadedImage;
  variantId: string | null;
}) {
  return (
    <DeviceFrame
      mockupId={mockup.id}
      variantId={variantId}
      shadow="0 12px 24px rgba(15, 23, 42, 0.28)"
      className={cn(
        "mx-auto",
        mockup.category === "phone" && "w-[42%]",
        mockup.category === "tablet" && "w-[48%]",
        mockup.category === "laptop" && "w-[86%]",
        mockup.category === "desktop" && "w-[78%]",
        mockup.category === "wearable" && "w-[56%]",
      )}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `url(${uploadedImage.objectUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
    </DeviceFrame>
  );
}

export default function DeviceMockupControls({
  uploadedImage,
}: DeviceMockupControlsProps) {
  const shouldReduceMotion = useReducedMotion();
  const browserFrameEnabled = useEditorStore(
    (state) => state.browserFrameEnabled,
  );
  const deviceMockupId = useEditorStore((state) => state.deviceMockupId);
  const deviceMockupVariantId = useEditorStore(
    (state) => state.deviceMockupVariantId,
  );
  const setDeviceMockup = useEditorStore((state) => state.setDeviceMockup);
  const setDeviceMockupVariant = useEditorStore(
    (state) => state.setDeviceMockupVariant,
  );
  const [activeTab, setActiveTab] =
    useState<DeviceMockupTabId>("all");
  const groups = getMockupGroups(activeTab);

  return (
    <section className="border-b border-slate-200/70 py-5 dark:border-white/10">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0f172a,#14b8a6)] text-white shadow-sm">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            Mockup
          </h3>
        </div>
        <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-300">
          Wrap the active screenshot in a launch-ready device frame.
        </p>
      </div>

      <div className="-mx-1 mb-4 overflow-x-auto pb-1">
        <div
          role="tablist"
          aria-label="Mockup categories"
          className="flex min-w-max gap-1 px-1"
        >
          {DEVICE_MOCKUP_TABS.map((tabId) => {
            const Icon = TAB_ICONS[tabId];
            const isActive = activeTab === tabId;

            return (
              <button
                key={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tabId)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/25",
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-slate-200 bg-white/65 text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-800 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {TAB_LABELS[tabId]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.id}>
            {activeTab === "all" && (
              <div className="mb-2 flex items-center justify-between gap-3">
                <h4 className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                  {group.title}
                </h4>
                <span className="text-[11px] font-medium text-slate-400">
                  {group.mockups.length}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {group.mockups.map((mockup) => {
                const isScreenshot = mockup.id === "none";
                const isBrowser = mockup.id === "browser";
                const isSelected = isScreenshot
                  ? deviceMockupId === "none" && !browserFrameEnabled
                  : isBrowser
                    ? deviceMockupId === "none" && browserFrameEnabled
                    : deviceMockupId === mockup.id;
                const selectedVariantId = isSelected
                  ? deviceMockupVariantId
                  : null;

                return (
                  <motion.div
                    key={mockup.id}
                    whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                    className={cn(
                      "group relative min-w-0 overflow-hidden rounded-xl border p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                      isSelected
                        ? "border-teal-500 bg-[linear-gradient(135deg,#0f172a,#0f766e)] text-white shadow-lg shadow-teal-500/15"
                        : "border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10",
                    )}
                  >
                    <button
                      type="button"
                      aria-label={`Select ${mockup.name} mockup`}
                      aria-pressed={isSelected}
                      onClick={() => setDeviceMockup(mockup.id)}
                      className="block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30"
                    >
                      <div
                        className={cn(
                          "relative mb-2 flex h-28 items-center justify-center overflow-hidden rounded-lg border",
                          isSelected
                            ? "border-white/15 bg-white/10"
                            : "border-slate-200/70 bg-[radial-gradient(circle_at_22%_20%,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc,#e2e8f0)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_22%_20%,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#020617,#111827)]",
                        )}
                        aria-hidden="true"
                      >
                        {isScreenshot ? (
                          <div className="h-[72%] w-[76%]">
                            <ScreenshotPreview uploadedImage={uploadedImage} />
                          </div>
                        ) : isBrowser ? (
                          <BrowserPreview uploadedImage={uploadedImage} />
                        ) : (
                          <DevicePreview
                            mockup={mockup}
                            uploadedImage={uploadedImage}
                            variantId={
                              selectedVariantId ??
                              getDeviceMockupVariant(mockup.id, null).id
                            }
                          />
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold leading-5">
                            {mockup.name}
                          </p>
                          <p
                            className={cn(
                              "mt-0.5 text-[11px] font-medium",
                              isSelected
                                ? "text-white/70"
                                : "text-slate-400 dark:text-slate-500",
                            )}
                          >
                            {mockup.screenWidth} x {mockup.screenHeight}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                            <Check className="h-3 w-3" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    </button>

                    {!isScreenshot && !isBrowser && (
                      <div className="mt-2 flex items-center gap-1.5">
                        {mockup.variants.slice(0, 4).map((variant) => {
                          const isVariantSelected =
                            isSelected &&
                            getDeviceMockupVariant(
                              mockup.id,
                              deviceMockupVariantId,
                            ).id === variant.id;

                          return (
                            <button
                              key={variant.id}
                              type="button"
                              aria-label={`Use ${variant.name} ${mockup.name}`}
                              aria-pressed={isVariantSelected}
                              onClick={(event) => {
                                event.stopPropagation();
                                if (isSelected) {
                                  setDeviceMockupVariant(variant.id);
                                  return;
                                }

                                setDeviceMockup(mockup.id, variant.id);
                              }}
                              className={cn(
                                "h-6 w-6 rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                                isVariantSelected
                                  ? "border-white ring-1 ring-white/60"
                                  : "border-white/20 hover:scale-105",
                              )}
                              style={{ background: variant.accent }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
