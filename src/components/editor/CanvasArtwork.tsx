"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type MouseEvent,
  type MutableRefObject,
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

type CanvasArtworkMode = "preview" | "export";

type TextDragGuide = {
  horizontal: number | null;
  vertical: number | null;
};

type TextDragState = {
  canvasRect: DOMRect;
  moved: boolean;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startOffsetX: number;
  startOffsetY: number;
  textRect: DOMRect;
};

type CanvasArtworkProps = {
  className?: string;
  isLoading?: boolean;
  mode: CanvasArtworkMode;
  onImageLoad?: () => void;
  style?: CSSProperties;
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

function mergeRefs<T>(
  ...refs: Array<ForwardedRef<T> | MutableRefObject<T | null>>
) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
        return;
      }

      if (ref) {
        ref.current = value;
      }
    });
  };
}

const DRAG_THRESHOLD_PX = 4;
const SNAP_THRESHOLD_PX = 12;

function clampTextOffset(value: number) {
  return Math.max(-1, Math.min(1, value));
}

const CanvasArtwork = forwardRef<HTMLDivElement, CanvasArtworkProps>(
  function CanvasArtwork(
    {
      className,
      isLoading = false,
      mode,
      onImageLoad,
      style,
      uploadedImage,
    },
    forwardedRef,
  ) {
    const shouldReduceMotion = useReducedMotion();
    const canvasShellRef = useRef<HTMLDivElement | null>(null);
    const textOverlayRef = useRef<HTMLDivElement | null>(null);
    const textDragStateRef = useRef<TextDragState | null>(null);
    const suppressNextTextClickRef = useRef(false);
    const parallaxFrameRef = useRef<number | null>(null);
    const [textDragGuide, setTextDragGuide] = useState<TextDragGuide>({
      horizontal: null,
      vertical: null,
    });
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
    const textOffsetX = useEditorStore((state) => state.textOffsetX);
    const textOffsetY = useEditorStore((state) => state.textOffsetY);
    const setTextOverlayPosition = useEditorStore(
      (state) => state.setTextOverlayPosition,
    );
    const tiltEnabled = useEditorStore((state) => state.tiltEnabled);
    const perspective = useEditorStore((state) => state.perspective);
    const rotateX = useEditorStore((state) => state.rotateX);
    const rotateY = useEditorStore((state) => state.rotateY);
    const rotateZ = useEditorStore((state) => state.rotateZ);
    const translateY = useEditorStore((state) => state.translateY);
    const tiltShadowMultiplier = useEditorStore(
      (state) => state.tiltShadowMultiplier,
    );
    const hoverTiltEnabled = useEditorStore(
      (state) => state.hoverTiltEnabled,
    );
    const hoverTiltSensitivity = useEditorStore(
      (state) => state.hoverTiltSensitivity,
    );
    const backgroundParallaxEnabled = useEditorStore(
      (state) => state.backgroundParallaxEnabled,
    );
    const backgroundParallaxStrength = useEditorStore(
      (state) => state.backgroundParallaxStrength,
    );
    const isExportMode = mode === "export";
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
      !isExportMode &&
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

    function handleTextPointerDown(event: PointerEvent<HTMLDivElement>) {
      if (isExportMode || event.button !== 0) {
        return;
      }

      const canvasShell = canvasShellRef.current;
      const textOverlay = textOverlayRef.current;

      if (!canvasShell || !textOverlay) {
        return;
      }

      textDragStateRef.current = {
        canvasRect: canvasShell.getBoundingClientRect(),
        moved: false,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startOffsetX: textOffsetX,
        startOffsetY: textOffsetY,
        textRect: textOverlay.getBoundingClientRect(),
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handleTextPointerMove(event: PointerEvent<HTMLDivElement>) {
      const dragState = textDragStateRef.current;

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      let deltaX = event.clientX - dragState.startClientX;
      let deltaY = event.clientY - dragState.startClientY;
      const dragDistance = Math.hypot(deltaX, deltaY);

      if (!dragState.moved && dragDistance < DRAG_THRESHOLD_PX) {
        return;
      }

      dragState.moved = true;
      event.preventDefault();

      const guide: TextDragGuide = { horizontal: null, vertical: null };
      const movedTextRect = {
        bottom: dragState.textRect.bottom + deltaY,
        left: dragState.textRect.left + deltaX,
        right: dragState.textRect.right + deltaX,
        top: dragState.textRect.top + deltaY,
      };
      const movedTextCenterX = (movedTextRect.left + movedTextRect.right) / 2;
      const movedTextCenterY = (movedTextRect.top + movedTextRect.bottom) / 2;
      const canvasCenterX =
        dragState.canvasRect.left + dragState.canvasRect.width / 2;
      const canvasCenterY =
        dragState.canvasRect.top + dragState.canvasRect.height / 2;
      const snapCandidatesX = [
        {
          delta: dragState.canvasRect.left - movedTextRect.left,
          guide: 0,
        },
        {
          delta: canvasCenterX - movedTextCenterX,
          guide: 0.5,
        },
        {
          delta: dragState.canvasRect.right - movedTextRect.right,
          guide: 1,
        },
      ];
      const snapCandidatesY = [
        {
          delta: dragState.canvasRect.top - movedTextRect.top,
          guide: 0,
        },
        {
          delta: canvasCenterY - movedTextCenterY,
          guide: 0.5,
        },
        {
          delta: dragState.canvasRect.bottom - movedTextRect.bottom,
          guide: 1,
        },
      ];
      const snapX = snapCandidatesX.find(
        (candidate) => Math.abs(candidate.delta) <= SNAP_THRESHOLD_PX,
      );
      const snapY = snapCandidatesY.find(
        (candidate) => Math.abs(candidate.delta) <= SNAP_THRESHOLD_PX,
      );

      if (snapX) {
        deltaX += snapX.delta;
        guide.vertical = snapX.guide;
      }

      if (snapY) {
        deltaY += snapY.delta;
        guide.horizontal = snapY.guide;
      }

      setTextDragGuide(guide);
      setTextOverlayPosition(
        clampTextOffset(
          dragState.startOffsetX + (deltaX / dragState.canvasRect.width) * 2,
        ),
        clampTextOffset(
          dragState.startOffsetY + (deltaY / dragState.canvasRect.height) * 2,
        ),
      );
    }

    function handleTextPointerEnd(event: PointerEvent<HTMLDivElement>) {
      const dragState = textDragStateRef.current;

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      suppressNextTextClickRef.current = dragState.moved;
      textDragStateRef.current = null;
      setTextDragGuide({ horizontal: null, vertical: null });

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    function handleTextClickCapture(event: MouseEvent<HTMLDivElement>) {
      if (!suppressNextTextClickRef.current) {
        return;
      }

      suppressNextTextClickRef.current = false;
      event.preventDefault();
      event.stopPropagation();
    }

    const screenshotMotionProps = {
      initial: {
        opacity: isExportMode ? 1 : 0,
        scale:
          isExportMode || shouldReduceMotion
            ? screenshotScale
            : screenshotScale * 0.96,
      },
      animate: {
        opacity: isExportMode || !isLoading ? 1 : 0,
        scale:
          !isExportMode && isLoading && !shouldReduceMotion
            ? screenshotScale * 0.98
            : screenshotScale,
      },
      exit: {
        opacity: isExportMode ? 1 : 0,
        scale:
          isExportMode || shouldReduceMotion
            ? screenshotScale
            : screenshotScale * 0.98,
      },
      transition: { duration: isExportMode ? 0 : 0.26, ease: "easeOut" },
    } as const;
    const screenshotShellStyle = {
      aspectRatio: `${uploadedImage.width} / ${uploadedImage.height}`,
      border: imageBorderEnabled
        ? "1px solid rgba(255, 255, 255, 0.72)"
        : "none",
      borderRadius: `${imageRadius}px`,
      boxShadow: screenshotShadow,
    } satisfies CSSProperties;
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
    const tiltSettings = {
      tiltEnabled,
      perspective,
      rotateX,
      rotateY,
      rotateZ,
      translateY,
      hoverTiltEnabled: isExportMode ? false : hoverTiltEnabled,
      hoverTiltSensitivity,
    };
    const textPlacementStyle = {
      transform: `translate(calc(${textOffsetX} * 50cqw), calc(${textOffsetY} * 50cqh))`,
    } satisfies CSSProperties;
    const screenshotPreview = browserFrameEnabled ? (
      <motion.div
        key={`${uploadedImage.id}-browser-frame`}
        {...screenshotMotionProps}
        className={cn("inline-flex h-full overflow-hidden", screenshotShellClasses)}
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
        className={cn("block h-full object-contain", screenshotShellClasses)}
        style={screenshotShellStyle}
      />
    );
    const textOverlay = hasTextOverlay ? (
      <TextOverlay
        ref={textOverlayRef}
        badgeEnabled={badgeEnabled}
        badgeText={badgeText}
        headlineSize={headlineSize}
        headlineText={headlineText}
        isEditable={!isExportMode}
        isExportMode={isExportMode}
        isMovable={!isExportMode}
        onClickCapture={handleTextClickCapture}
        onPointerCancel={handleTextPointerEnd}
        onPointerDown={handleTextPointerDown}
        onPointerMove={handleTextPointerMove}
        onPointerUp={handleTextPointerEnd}
        placementStyle={textPlacementStyle}
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
        ref={mergeRefs(canvasShellRef, forwardedRef)}
        layout={!isExportMode}
        onPointerCancel={handleCanvasPointerLeave}
        onPointerLeave={handleCanvasPointerLeave}
        onPointerMove={handleCanvasPointerMove}
        transition={{ duration: isExportMode ? 0 : 0.28, ease: "easeOut" }}
        className={cn("relative overflow-hidden", className)}
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          containerType: "size",
          width: isExportMode ? `${canvasWidth}px` : undefined,
          height: isExportMode ? `${canvasHeight}px` : undefined,
          ...style,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={backgroundKey}
            initial={{ opacity: isExportMode || shouldReduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: isExportMode || shouldReduceMotion ? 1 : 0 }}
            transition={{ duration: isExportMode ? 0 : 0.28, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden"
            style={{
              transform:
                !isExportMode && backgroundParallaxEnabled
                  ? "translate3d(var(--bg-shift-x, 0px), var(--bg-shift-y, 0px), 0) scale(1.04)"
                  : undefined,
              transition:
                isExportMode || shouldReduceMotion
                  ? undefined
                  : "transform 280ms ease-out",
              willChange:
                !isExportMode && backgroundParallaxEnabled
                  ? "transform"
                  : undefined,
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

        {!isExportMode && textDragGuide.vertical !== null && (
          <div
            className="pointer-events-none absolute bottom-0 top-0 z-20 w-px bg-cyan-300/80 shadow-[0_0_12px_rgba(103,232,249,0.65)]"
            style={{ left: `${textDragGuide.vertical * 100}%` }}
            aria-hidden="true"
          />
        )}

        {!isExportMode && textDragGuide.horizontal !== null && (
          <div
            className="pointer-events-none absolute left-0 right-0 z-20 h-px bg-cyan-300/80 shadow-[0_0_12px_rgba(103,232,249,0.65)]"
            style={{ top: `${textDragGuide.horizontal * 100}%` }}
            aria-hidden="true"
          />
        )}

        <motion.div
          layout={!isExportMode}
          className={cn(
            "relative flex h-full w-full min-w-0 items-center justify-center overflow-hidden",
            hasTextOverlay && getContentLayoutClasses(textPosition),
          )}
          style={{ padding: `${paddingPercent}%` }}
          transition={{ duration: isExportMode ? 0 : 0.24, ease: "easeOut" }}
        >
          {hasTextOverlay && textPosition === "top" && textOverlay}
          {hasTextOverlay && textPosition === "left" && textOverlay}

          <div className={cn("relative z-[1] flex", screenshotSlotClasses)}>
            <TiltedMockupWrapper
              className={cn(
                "flex max-h-full max-w-full",
                screenshotShellClasses,
              )}
              settings={tiltSettings}
            >
              <AnimatePresence mode="wait">{screenshotPreview}</AnimatePresence>
            </TiltedMockupWrapper>
          </div>

          {hasTextOverlay && textPosition === "center" && (
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              {textOverlay}
            </div>
          )}
          {hasTextOverlay && textPosition === "right" && textOverlay}
          {hasTextOverlay && textPosition === "bottom" && textOverlay}
        </motion.div>
      </motion.div>
    );
  },
);

export default CanvasArtwork;
