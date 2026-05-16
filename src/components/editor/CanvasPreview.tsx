"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent,
} from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import BrowserFrame from "@/components/editor/BrowserFrame";
import TextOverlay from "@/components/editor/TextOverlay";
import TiltedMockupWrapper from "@/components/editor/TiltedMockupWrapper";
import { createImageShadowCss } from "@/lib/editor-defaults";
import { multiplyTiltShadow } from "@/lib/tilt-utils";
import { cn } from "@/lib/utils";
import { useEditorStore, type UploadedImage } from "@/store/editor-store";
import type { TextPosition } from "@/types/editor";

type CanvasPreviewProps = {
  isLoading?: boolean;
  onImageLoad?: () => void;
  uploadedImage: UploadedImage;
};

function getContentLayoutClasses(textPosition: TextPosition) {
  if (textPosition === "left" || textPosition === "right") {
    return "flex-row gap-4 sm:gap-6";
  }

  if (textPosition === "center") {
    return "flex-col gap-4 sm:gap-5";
  }

  return "flex-col gap-4 sm:gap-6";
}

function getScreenshotSlotClasses(
  textOverlayEnabled: boolean,
  textPosition: TextPosition,
) {
  if (!textOverlayEnabled) {
    return "h-full w-full items-center justify-center";
  }

  if (textPosition === "left" || textPosition === "right") {
    return "min-h-0 min-w-0 flex-1 items-center justify-center";
  }

  if (textPosition === "center") {
    return "absolute inset-0 items-center justify-center";
  }

  return "min-h-0 w-full flex-1 items-center justify-center";
}

function getScreenshotShellClasses(
  textOverlayEnabled: boolean,
  textPosition: TextPosition,
) {
  if (!textOverlayEnabled || textPosition === "center") {
    return "max-h-full max-w-full";
  }

  if (textPosition === "left" || textPosition === "right") {
    return "max-h-full max-w-full";
  }

  return "max-h-full max-w-[92%]";
}

export default function CanvasPreview({
  isLoading = false,
  onImageLoad,
  uploadedImage,
}: CanvasPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const canvasShellRef = useRef<HTMLDivElement | null>(null);
  const parallaxFrameRef = useRef<number | null>(null);
  const canvasWidth = useEditorStore((state) => state.canvasWidth);
  const canvasHeight = useEditorStore((state) => state.canvasHeight);
  const backgroundType = useEditorStore((state) => state.backgroundType);
  const backgroundValue = useEditorStore((state) => state.backgroundValue);
  const imagePadding = useEditorStore((state) => state.imagePadding);
  const imageRadius = useEditorStore((state) => state.imageRadius);
  const imageScale = useEditorStore((state) => state.imageScale);
  const imageShadow = useEditorStore((state) => state.imageShadow);
  const imageBorderEnabled = useEditorStore(
    (state) => state.imageBorderEnabled,
  );
  const browserFrameEnabled = useEditorStore(
    (state) => state.browserFrameEnabled,
  );
  const browserFrameTheme = useEditorStore(
    (state) => state.browserFrameTheme,
  );
  const browserFrameStyle = useEditorStore(
    (state) => state.browserFrameStyle,
  );
  const browserFrameUrl = useEditorStore((state) => state.browserFrameUrl);
  const browserFrameShowUrl = useEditorStore(
    (state) => state.browserFrameShowUrl,
  );
  const textOverlayEnabled = useEditorStore(
    (state) => state.textOverlayEnabled,
  );
  const headlineText = useEditorStore((state) => state.headlineText);
  const subtitleText = useEditorStore((state) => state.subtitleText);
  const badgeText = useEditorStore((state) => state.badgeText);
  const textPosition = useEditorStore((state) => state.textPosition);
  const textAlign = useEditorStore((state) => state.textAlign);
  const textColor = useEditorStore((state) => state.textColor);
  const headlineSize = useEditorStore((state) => state.headlineSize);
  const subtitleSize = useEditorStore((state) => state.subtitleSize);
  const badgeEnabled = useEditorStore((state) => state.badgeEnabled);
  const tiltEnabled = useEditorStore((state) => state.tiltEnabled);
  const tiltShadowMultiplier = useEditorStore(
    (state) => state.tiltShadowMultiplier,
  );
  const backgroundParallaxEnabled = useEditorStore(
    (state) => state.backgroundParallaxEnabled,
  );
  const backgroundParallaxStrength = useEditorStore(
    (state) => state.backgroundParallaxStrength,
  );
  const aspectRatio = canvasWidth / canvasHeight;
  const previewWidth = `min(100%, 1040px, calc(70vh * ${aspectRatio}))`;
  const paddingPercent =
    (imagePadding / Math.min(canvasWidth, canvasHeight)) * 100;
  const screenshotScale = imageScale / 100;
  const screenshotShadow = createImageShadowCss({
    ...imageShadow,
    blur: tiltEnabled
      ? multiplyTiltShadow(imageShadow.blur, tiltShadowMultiplier)
      : imageShadow.blur,
    offsetY: tiltEnabled
      ? multiplyTiltShadow(imageShadow.offsetY, tiltShadowMultiplier)
      : imageShadow.offsetY,
  });
  const backgroundKey = `${backgroundType}-${backgroundValue}-${
    backgroundType === "image-blur" ? uploadedImage.id : "static"
  }`;
  const canParallaxBackground =
    backgroundParallaxEnabled &&
    backgroundParallaxStrength > 0 &&
    !shouldReduceMotion;
  const applyBackgroundParallax = useCallback((x = 0, y = 0) => {
    const canvasShell = canvasShellRef.current;

    if (!canvasShell) {
      return;
    }

    canvasShell.style.setProperty("--bg-shift-x", `${x}px`);
    canvasShell.style.setProperty("--bg-shift-y", `${y}px`);
  }, []);
  const scheduleBackgroundParallax = useCallback(
    (x = 0, y = 0) => {
      if (parallaxFrameRef.current !== null) {
        cancelAnimationFrame(parallaxFrameRef.current);
      }

      parallaxFrameRef.current = requestAnimationFrame(() => {
        applyBackgroundParallax(x, y);
        parallaxFrameRef.current = null;
      });
    },
    [applyBackgroundParallax],
  );

  useEffect(() => {
    if (!canParallaxBackground) {
      applyBackgroundParallax();
    }

    return () => {
      if (parallaxFrameRef.current !== null) {
        cancelAnimationFrame(parallaxFrameRef.current);
      }
    };
  }, [applyBackgroundParallax, canParallaxBackground]);

  function handleCanvasPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!canParallaxBackground || event.pointerType === "touch") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width;
    const offsetY = (event.clientY - bounds.top) / bounds.height;
    const normalizedX = offsetX * 2 - 1;
    const normalizedY = offsetY * 2 - 1;
    const shiftX = -normalizedX * backgroundParallaxStrength * 0.45;
    const shiftY = -normalizedY * backgroundParallaxStrength * 0.35;

    scheduleBackgroundParallax(shiftX, shiftY);
  }

  function handleCanvasPointerLeave() {
    if (!canParallaxBackground) {
      return;
    }

    scheduleBackgroundParallax();
  }

  const screenshotMotionProps = {
    initial: {
      opacity: 0,
      scale: shouldReduceMotion ? screenshotScale : screenshotScale * 0.96,
    },
    animate: {
      opacity: isLoading ? 0 : 1,
      scale:
        isLoading && !shouldReduceMotion
          ? screenshotScale * 0.98
          : screenshotScale,
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? screenshotScale : screenshotScale * 0.98,
    },
    transition: { duration: 0.26, ease: "easeOut" },
  } as const;
  const screenshotShellStyle = {
    border: imageBorderEnabled
      ? "1px solid rgba(255, 255, 255, 0.72)"
      : "none",
    borderRadius: `${imageRadius}px`,
    boxShadow: screenshotShadow,
  };
  const hasTextOverlay =
    textOverlayEnabled &&
    ((badgeEnabled && badgeText.trim().length > 0) ||
      headlineText.trim().length > 0 ||
      subtitleText.trim().length > 0);
  const screenshotSlotClasses = getScreenshotSlotClasses(
    hasTextOverlay,
    textPosition,
  );
  const screenshotShellClasses = getScreenshotShellClasses(
    hasTextOverlay,
    textPosition,
  );
  const screenshotPreview = browserFrameEnabled ? (
    <motion.div
      key={`${uploadedImage.id}-browser-frame`}
      {...screenshotMotionProps}
      className={cn("overflow-hidden", screenshotShellClasses)}
      style={screenshotShellStyle}
    >
      <BrowserFrame
        imageAlt={uploadedImage.name}
        imageSrc={uploadedImage.objectUrl}
        onImageLoad={onImageLoad}
        radius={imageRadius}
        showUrl={browserFrameShowUrl}
        theme={browserFrameTheme}
        url={browserFrameUrl}
        variant={browserFrameStyle}
      />
    </motion.div>
  ) : (
    <motion.img
      key={`${uploadedImage.id}-screenshot`}
      src={uploadedImage.objectUrl}
      alt={uploadedImage.name}
      onLoad={onImageLoad}
      {...screenshotMotionProps}
      className={cn("object-contain", screenshotShellClasses)}
      style={screenshotShellStyle}
    />
  );
  const textOverlay = hasTextOverlay ? (
    <TextOverlay
      badgeEnabled={badgeEnabled}
      badgeText={badgeText}
      headlineSize={headlineSize}
      headlineText={headlineText}
      subtitleSize={subtitleSize}
      subtitleText={subtitleText}
      textAlign={textAlign}
      textColor={textColor}
      textPosition={textPosition}
      className={cn(textPosition === "center" && "max-w-[72%]")}
    />
  ) : null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 12,
        scale: shouldReduceMotion ? 1 : 0.985,
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : -8,
        scale: shouldReduceMotion ? 1 : 0.99,
      }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex w-full items-center justify-center px-2 py-3 sm:px-4 sm:py-5"
    >
      <motion.div
        ref={canvasShellRef}
        layout
        onPointerCancel={handleCanvasPointerLeave}
        onPointerLeave={handleCanvasPointerLeave}
        onPointerMove={handleCanvasPointerMove}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-slate-950/[0.03] dark:border-white/10 dark:bg-slate-950 dark:ring-white/10"
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          width: previewWidth,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={backgroundKey}
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden"
            style={{
              transform: backgroundParallaxEnabled
                ? "translate3d(var(--bg-shift-x, 0px), var(--bg-shift-y, 0px), 0) scale(1.04)"
                : undefined,
              transition: shouldReduceMotion
                ? undefined
                : "transform 280ms ease-out",
              willChange: backgroundParallaxEnabled ? "transform" : undefined,
            }}
          >
            {backgroundType === "image-blur" ? (
              <>
                <div
                  className="absolute inset-0 h-full w-full scale-110 opacity-75 blur-3xl saturate-125"
                  style={{
                    backgroundImage: `url(${uploadedImage.objectUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: backgroundValue }}
                />
              </>
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: backgroundValue }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0 opacity-25 mix-blend-soft-light"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.32) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <motion.div
          layout
          className={cn(
            "relative flex h-full w-full min-w-0 items-center justify-center overflow-hidden",
            hasTextOverlay && getContentLayoutClasses(textPosition),
          )}
          style={{ padding: `${paddingPercent}%` }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          {hasTextOverlay && textPosition === "top" && textOverlay}
          {hasTextOverlay && textPosition === "left" && textOverlay}

          <div className={cn("relative z-[1] flex", screenshotSlotClasses)}>
            <TiltedMockupWrapper
              className={cn(
                "flex max-h-full max-w-full",
                screenshotShellClasses,
              )}
            >
              <AnimatePresence mode="wait">{screenshotPreview}</AnimatePresence>
            </TiltedMockupWrapper>
          </div>

          {hasTextOverlay && textPosition === "center" && (
            <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center">
              {textOverlay}
            </div>
          )}
          {hasTextOverlay && textPosition === "right" && textOverlay}
          {hasTextOverlay && textPosition === "bottom" && textOverlay}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
