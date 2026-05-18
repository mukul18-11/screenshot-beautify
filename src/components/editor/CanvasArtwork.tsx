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
  type SyntheticEvent,
} from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import BrowserFrame from "@/components/editor/BrowserFrame";
import TextOverlay from "@/components/editor/TextOverlay";
import TiltedMockupWrapper from "@/components/editor/TiltedMockupWrapper";
import {
  BEAUTIFY_SETTING_LIMITS,
  createImageShadowCss,
} from "@/lib/editor-defaults";
import { multiplyTiltShadow } from "@/lib/tilt-utils";
import { cn } from "@/lib/utils";
import { useEditorStore, type UploadedImage } from "@/store/editor-store";
import type { ImageCrop, TextLayerId, TextPosition } from "@/types/editor";

type CanvasArtworkMode = "preview" | "export";

type TextDragGuide = {
  horizontal: number | null;
  vertical: number | null;
};

type TextLayerDragState = {
  canvasRect: DOMRect;
  layerId: TextLayerId;
  moved: boolean;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startOffsetX: number;
  startOffsetY: number;
  textRect: DOMRect;
};

type MockupDragState = {
  canvasRect: DOMRect;
  mockupRect: DOMRect;
  moved: boolean;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startOffsetX: number;
  startOffsetY: number;
};

type ResizeHandleId = "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";

type MockupResizeState = {
  anchorX: number;
  anchorY: number;
  canvasRect: DOMRect;
  handleId: ResizeHandleId;
  mockupRect: DOMRect;
  moved: boolean;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startCrop: ImageCrop;
  startOffsetX: number;
  startOffsetY: number;
  startScale: number;
};

type CanvasArtworkProps = {
  className?: string;
  isLoading?: boolean;
  mode: CanvasArtworkMode;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
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
const FIT_ON_UPLOAD_PADDING_PX = 80;
const MIN_CROP_RATIO = 0.18;
const SNAP_THRESHOLD_PX = 12;
const RESIZE_HANDLES = [
  "nw",
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
] as const satisfies readonly ResizeHandleId[];

function clampTextOffset(value: number) {
  return Math.max(-1, Math.min(1, value));
}

function clampCropInset(value: number) {
  return Math.max(0, Math.min(1 - MIN_CROP_RATIO, value));
}

function clampValue(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function calculateFitScale(
  availableWidth: number,
  availableHeight: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number,
) {
  if (
    availableWidth <= 0 ||
    availableHeight <= 0 ||
    imageNaturalWidth <= 0 ||
    imageNaturalHeight <= 0
  ) {
    return 1;
  }

  return Math.min(
    availableWidth / imageNaturalWidth,
    availableHeight / imageNaturalHeight,
    1,
  );
}

function calculateFitOnUploadScalePercent(
  canvasWidth: number,
  canvasHeight: number,
  imagePadding: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number,
) {
  const targetScale = calculateFitScale(
    canvasWidth - FIT_ON_UPLOAD_PADDING_PX * 2,
    canvasHeight - FIT_ON_UPLOAD_PADDING_PX * 2,
    imageNaturalWidth,
    imageNaturalHeight,
  );
  const paddingRatio = imagePadding / Math.min(canvasWidth, canvasHeight);
  const layoutScale = calculateFitScale(
    canvasWidth - canvasWidth * paddingRatio * 2,
    canvasHeight - canvasHeight * paddingRatio * 2,
    imageNaturalWidth,
    imageNaturalHeight,
  );

  if (layoutScale <= 0) {
    return targetScale * 100;
  }

  return (targetScale / layoutScale) * 100;
}

function getCropRatios(crop: ImageCrop) {
  return {
    width: Math.max(MIN_CROP_RATIO, 1 - crop.left - crop.right),
    height: Math.max(MIN_CROP_RATIO, 1 - crop.top - crop.bottom),
  };
}

function isCornerResizeHandle(handleId: ResizeHandleId) {
  const directions = getResizeHandleDirections(handleId);

  return directions.x !== 0 && directions.y !== 0;
}

function clampDeltaToBounds(
  delta: number,
  elementStart: number,
  elementEnd: number,
  boundsStart: number,
  boundsEnd: number,
) {
  const elementSize = elementEnd - elementStart;
  const boundsSize = boundsEnd - boundsStart;

  if (elementSize >= boundsSize) {
    const elementCenter = elementStart + elementSize / 2 + delta;
    const boundsCenter = boundsStart + boundsSize / 2;

    return delta + boundsCenter - elementCenter;
  }

  let clampedDelta = delta;

  if (elementStart + clampedDelta < boundsStart) {
    clampedDelta += boundsStart - (elementStart + clampedDelta);
  }

  if (elementEnd + clampedDelta > boundsEnd) {
    clampedDelta += boundsEnd - (elementEnd + clampedDelta);
  }

  return clampedDelta;
}

function getResizeHandleDirections(handleId: ResizeHandleId) {
  return {
    x: handleId.includes("e") ? 1 : handleId.includes("w") ? -1 : 0,
    y: handleId.includes("s") ? 1 : handleId.includes("n") ? -1 : 0,
  };
}

function getResizeHandleAnchor(handleId: ResizeHandleId, rect: DOMRect) {
  const directions = getResizeHandleDirections(handleId);
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return {
    x: directions.x > 0 ? rect.left : directions.x < 0 ? rect.right : centerX,
    y: directions.y > 0 ? rect.top : directions.y < 0 ? rect.bottom : centerY,
  };
}

function getResizeHandlePositionClass(handleId: ResizeHandleId) {
  const positionClasses = {
    e: "right-0 top-1/2 h-7 w-2 -translate-y-1/2 translate-x-1/2 cursor-ew-resize",
    n: "left-1/2 top-0 h-2 w-7 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize",
    ne: "right-0 top-0 h-3 w-3 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize",
    nw: "left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
    s: "bottom-0 left-1/2 h-2 w-7 -translate-x-1/2 translate-y-1/2 cursor-ns-resize",
    se: "bottom-0 right-0 h-3 w-3 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
    sw: "bottom-0 left-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
    w: "left-0 top-1/2 h-7 w-2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
  } satisfies Record<ResizeHandleId, string>;

  return positionClasses[handleId];
}

function calculateResizeRatio(
  dragState: MockupResizeState,
  clientX: number,
  clientY: number,
) {
  const directions = getResizeHandleDirections(dragState.handleId);
  const startVectorX = dragState.startClientX - dragState.anchorX;
  const startVectorY = dragState.startClientY - dragState.anchorY;
  const currentVectorX = clientX - dragState.anchorX;
  const currentVectorY = clientY - dragState.anchorY;

  if (directions.x !== 0 && directions.y !== 0) {
    const startLengthSquared =
      startVectorX * startVectorX + startVectorY * startVectorY;

    if (startLengthSquared <= 0) {
      return 1;
    }

    return (
      (currentVectorX * startVectorX + currentVectorY * startVectorY) /
      startLengthSquared
    );
  }

  if (directions.x !== 0 && Math.abs(startVectorX) > 0) {
    return currentVectorX / startVectorX;
  }

  if (directions.y !== 0 && Math.abs(startVectorY) > 0) {
    return currentVectorY / startVectorY;
  }

  return 1;
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
    const mockupFrameRef = useRef<HTMLDivElement | null>(null);
    const mockupVisualRef = useRef<HTMLDivElement | null>(null);
    const textDragStateRef = useRef<TextLayerDragState | null>(null);
    const mockupDragStateRef = useRef<MockupDragState | null>(null);
    const mockupResizeStateRef = useRef<MockupResizeState | null>(null);
    const fittedImageIdRef = useRef<string | null>(null);
    const suppressNextTextClickRef = useRef<TextLayerId | null>(null);
    const parallaxFrameRef = useRef<number | null>(null);
    const textDragFrameRef = useRef<number | null>(null);
    const textDragActiveRef = useRef(false);
    const textDragUpdateRef = useRef<(() => void) | null>(null);
    const transformFrameRef = useRef<number | null>(null);
    const transformDragActiveRef = useRef(false);
    const transformUpdateRef = useRef<(() => void) | null>(null);
    const [isDraggingCanvasItem, setIsDraggingCanvasItem] = useState(false);
    const [isMockupSelected, setIsMockupSelected] = useState(false);
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
    const imageOffsetX = useEditorStore((state) => state.imageOffsetX);
    const imageOffsetY = useEditorStore((state) => state.imageOffsetY);
    const imageCrop = useEditorStore((state) => state.imageCrop);
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
    const badgeOffsetX = useEditorStore((state) => state.badgeOffsetX);
    const badgeOffsetY = useEditorStore((state) => state.badgeOffsetY);
    const headlineOffsetX = useEditorStore((state) => state.headlineOffsetX);
    const headlineOffsetY = useEditorStore((state) => state.headlineOffsetY);
    const subtitleOffsetX = useEditorStore((state) => state.subtitleOffsetX);
    const subtitleOffsetY = useEditorStore((state) => state.subtitleOffsetY);
    const setImageTransform = useEditorStore(
      (state) => state.setImageTransform,
    );
    const fitUploadedImage = useEditorStore(
      (state) => state.fitUploadedImage,
    );
    const setTextLayerPosition = useEditorStore(
      (state) => state.setTextLayerPosition,
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
      !isDraggingCanvasItem &&
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
    const scheduleTextDragUpdate = useCallback((update: () => void) => {
      if (!textDragActiveRef.current) {
        return;
      }

      textDragUpdateRef.current = update;

      if (textDragFrameRef.current !== null) {
        return;
      }

      textDragFrameRef.current = requestAnimationFrame(() => {
        if (!textDragActiveRef.current) {
          textDragFrameRef.current = null;
          textDragUpdateRef.current = null;
          return;
        }

        textDragFrameRef.current = null;
        const pendingUpdate = textDragUpdateRef.current;
        textDragUpdateRef.current = null;
        pendingUpdate?.();
      });
    }, []);
    const cancelTextDragUpdate = useCallback(() => {
      if (textDragFrameRef.current !== null) {
        cancelAnimationFrame(textDragFrameRef.current);
        textDragFrameRef.current = null;
      }

      textDragUpdateRef.current = null;
    }, []);
    const scheduleTransformUpdate = useCallback((update: () => void) => {
      if (!transformDragActiveRef.current) {
        return;
      }

      transformUpdateRef.current = update;

      if (transformFrameRef.current !== null) {
        return;
      }

      transformFrameRef.current = requestAnimationFrame(() => {
        if (!transformDragActiveRef.current) {
          transformFrameRef.current = null;
          transformUpdateRef.current = null;
          return;
        }

        transformFrameRef.current = null;
        const pendingUpdate = transformUpdateRef.current;
        transformUpdateRef.current = null;
        pendingUpdate?.();
      });
    }, []);
    const cancelTransformUpdate = useCallback(() => {
      if (transformFrameRef.current !== null) {
        cancelAnimationFrame(transformFrameRef.current);
        transformFrameRef.current = null;
      }

      transformUpdateRef.current = null;
    }, []);

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

    useEffect(() => {
      return () => {
        textDragActiveRef.current = false;
        transformDragActiveRef.current = false;

        if (textDragFrameRef.current !== null) {
          cancelAnimationFrame(textDragFrameRef.current);
          textDragFrameRef.current = null;
        }

        if (transformFrameRef.current !== null) {
          cancelAnimationFrame(transformFrameRef.current);
          transformFrameRef.current = null;
        }

        textDragUpdateRef.current = null;
        transformUpdateRef.current = null;
      };
    }, []);

    function handleCanvasPointerMove(event: PointerEvent<HTMLDivElement>) {
      if (
        !canParallaxBackground ||
        event.pointerType === "touch" ||
        textDragStateRef.current ||
        mockupDragStateRef.current ||
        mockupResizeStateRef.current
      ) {
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

    function handleCanvasPointerDown(event: PointerEvent<HTMLDivElement>) {
      if (isExportMode) {
        return;
      }

      const eventTarget = event.target;
      const mockupFrame = mockupFrameRef.current;

      if (
        eventTarget instanceof Node &&
        mockupFrame &&
        !mockupFrame.contains(eventTarget)
      ) {
        setIsMockupSelected(false);
      }
    }

    function handleImageLoad(event: SyntheticEvent<HTMLImageElement>) {
      onImageLoad?.(event);

      if (isExportMode || fittedImageIdRef.current === uploadedImage.id) {
        return;
      }

      const imageElement = event.currentTarget;
      const initialScalePercent = calculateFitOnUploadScalePercent(
        canvasWidth,
        canvasHeight,
        imagePadding,
        imageElement.naturalWidth,
        imageElement.naturalHeight,
      );

      fittedImageIdRef.current = uploadedImage.id;
      fitUploadedImage(initialScalePercent);
    }

    const textLayerOffsets = {
      badge: { x: badgeOffsetX, y: badgeOffsetY },
      headline: { x: headlineOffsetX, y: headlineOffsetY },
      subtitle: { x: subtitleOffsetX, y: subtitleOffsetY },
    } satisfies Record<TextLayerId, { x: number; y: number }>;

    function handleTextLayerPointerDown(
      layerId: TextLayerId,
      event: PointerEvent<HTMLDivElement>,
    ) {
      if (isExportMode || event.button !== 0) {
        return;
      }

      const canvasShell = canvasShellRef.current;

      if (!canvasShell) {
        return;
      }

      const eventTarget = event.target;

      if (
        eventTarget instanceof HTMLElement &&
        eventTarget.closest("[contenteditable='true']")
      ) {
        return;
      }

      textDragActiveRef.current = false;
      cancelTextDragUpdate();
      const layerOffset = textLayerOffsets[layerId];

      textDragActiveRef.current = true;
      textDragStateRef.current = {
        canvasRect: canvasShell.getBoundingClientRect(),
        layerId,
        moved: false,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startOffsetX: layerOffset.x,
        startOffsetY: layerOffset.y,
        textRect: event.currentTarget.getBoundingClientRect(),
      };

      setIsDraggingCanvasItem(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handleTextLayerPointerMove(
      layerId: TextLayerId,
      event: PointerEvent<HTMLDivElement>,
    ) {
      const dragState = textDragStateRef.current;

      if (
        !dragState ||
        dragState.pointerId !== event.pointerId ||
        dragState.layerId !== layerId
      ) {
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

      deltaX = clampDeltaToBounds(
        deltaX,
        dragState.textRect.left,
        dragState.textRect.right,
        dragState.canvasRect.left,
        dragState.canvasRect.right,
      );
      deltaY = clampDeltaToBounds(
        deltaY,
        dragState.textRect.top,
        dragState.textRect.bottom,
        dragState.canvasRect.top,
        dragState.canvasRect.bottom,
      );

      const nextOffsetX = clampTextOffset(
        dragState.startOffsetX + (deltaX / dragState.canvasRect.width) * 2,
      );
      const nextOffsetY = clampTextOffset(
        dragState.startOffsetY + (deltaY / dragState.canvasRect.height) * 2,
      );

      scheduleTextDragUpdate(() => {
        setTextDragGuide(guide);
        setTextLayerPosition(dragState.layerId, nextOffsetX, nextOffsetY);
      });
    }

    function handleTextLayerPointerEnd(
      layerId: TextLayerId,
      event: PointerEvent<HTMLDivElement>,
    ) {
      const dragState = textDragStateRef.current;
      textDragActiveRef.current = false;
      cancelTextDragUpdate();

      if (
        !dragState ||
        dragState.pointerId !== event.pointerId ||
        dragState.layerId !== layerId
      ) {
        return;
      }

      suppressNextTextClickRef.current = dragState.moved
        ? dragState.layerId
        : null;
      textDragStateRef.current = null;
      setIsDraggingCanvasItem(false);
      setTextDragGuide({ horizontal: null, vertical: null });

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    function handleTextLayerClickCapture(
      layerId: TextLayerId,
      event: MouseEvent<HTMLDivElement>,
    ) {
      if (suppressNextTextClickRef.current !== layerId) {
        return;
      }

      suppressNextTextClickRef.current = null;
      event.preventDefault();
      event.stopPropagation();
    }

    function handleMockupPointerDown(event: PointerEvent<HTMLDivElement>) {
      if (isExportMode || event.button !== 0) {
        return;
      }

      const canvasShell = canvasShellRef.current;
      const mockupVisual = mockupVisualRef.current;

      if (!canvasShell || !mockupVisual) {
        return;
      }

      event.preventDefault();
      setIsMockupSelected(true);
      transformDragActiveRef.current = false;
      cancelTransformUpdate();
      transformDragActiveRef.current = true;
      mockupDragStateRef.current = {
        canvasRect: canvasShell.getBoundingClientRect(),
        mockupRect: mockupVisual.getBoundingClientRect(),
        moved: false,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startOffsetX: imageOffsetX,
        startOffsetY: imageOffsetY,
      };

      setIsDraggingCanvasItem(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handleMockupPointerMove(event: PointerEvent<HTMLDivElement>) {
      const dragState = mockupDragStateRef.current;

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

      deltaX = clampDeltaToBounds(
        deltaX,
        dragState.mockupRect.left,
        dragState.mockupRect.right,
        dragState.canvasRect.left,
        dragState.canvasRect.right,
      );
      deltaY = clampDeltaToBounds(
        deltaY,
        dragState.mockupRect.top,
        dragState.mockupRect.bottom,
        dragState.canvasRect.top,
        dragState.canvasRect.bottom,
      );

      const nextOffsetX = clampTextOffset(
        dragState.startOffsetX + (deltaX / dragState.canvasRect.width) * 2,
      );
      const nextOffsetY = clampTextOffset(
        dragState.startOffsetY + (deltaY / dragState.canvasRect.height) * 2,
      );

      scheduleTransformUpdate(() => {
        setImageTransform({
          offsetX: nextOffsetX,
          offsetY: nextOffsetY,
        });
      });
    }

    function handleMockupPointerEnd(event: PointerEvent<HTMLDivElement>) {
      const dragState = mockupDragStateRef.current;
      transformDragActiveRef.current = false;
      cancelTransformUpdate();

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      mockupDragStateRef.current = null;
      setIsDraggingCanvasItem(false);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    function handleResizePointerDown(
      handleId: ResizeHandleId,
      event: PointerEvent<HTMLButtonElement>,
    ) {
      if (isExportMode || event.button !== 0) {
        return;
      }

      const canvasShell = canvasShellRef.current;
      const mockupVisual = mockupVisualRef.current;

      if (!canvasShell || !mockupVisual) {
        return;
      }

      const mockupRect = mockupVisual.getBoundingClientRect();
      const anchor = getResizeHandleAnchor(handleId, mockupRect);

      event.preventDefault();
      event.stopPropagation();
      setIsMockupSelected(true);
      setIsDraggingCanvasItem(true);
      transformDragActiveRef.current = false;
      cancelTransformUpdate();
      transformDragActiveRef.current = true;
      mockupResizeStateRef.current = {
        anchorX: anchor.x,
        anchorY: anchor.y,
        canvasRect: canvasShell.getBoundingClientRect(),
        handleId,
        mockupRect,
        moved: false,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startCrop: imageCrop,
        startOffsetX: imageOffsetX,
        startOffsetY: imageOffsetY,
        startScale: imageScale,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handleResizePointerMove(
      event: PointerEvent<HTMLButtonElement>,
    ) {
      const dragState = mockupResizeStateRef.current;

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - dragState.startClientX;
      const deltaY = event.clientY - dragState.startClientY;
      const dragDistance = Math.hypot(deltaX, deltaY);

      if (!dragState.moved && dragDistance < DRAG_THRESHOLD_PX) {
        return;
      }

      dragState.moved = true;
      event.preventDefault();
      event.stopPropagation();

      const directions = getResizeHandleDirections(dragState.handleId);
      const startCenterX =
        dragState.mockupRect.left + dragState.mockupRect.width / 2;
      const startCenterY =
        dragState.mockupRect.top + dragState.mockupRect.height / 2;

      if (!isCornerResizeHandle(dragState.handleId)) {
        const startCropRatios = getCropRatios(dragState.startCrop);
        const fullWidth = dragState.mockupRect.width / startCropRatios.width;
        const fullHeight = dragState.mockupRect.height / startCropRatios.height;
        const nextCrop = { ...dragState.startCrop };

        if (directions.x > 0) {
          nextCrop.right = clampCropInset(
            dragState.startCrop.right - deltaX / fullWidth,
          );
        } else if (directions.x < 0) {
          nextCrop.left = clampCropInset(
            dragState.startCrop.left + deltaX / fullWidth,
          );
        }

        if (directions.y > 0) {
          nextCrop.bottom = clampCropInset(
            dragState.startCrop.bottom - deltaY / fullHeight,
          );
        } else if (directions.y < 0) {
          nextCrop.top = clampCropInset(
            dragState.startCrop.top + deltaY / fullHeight,
          );
        }

        if (nextCrop.left + nextCrop.right > 1 - MIN_CROP_RATIO) {
          if (directions.x > 0) {
            nextCrop.right = 1 - MIN_CROP_RATIO - nextCrop.left;
          } else if (directions.x < 0) {
            nextCrop.left = 1 - MIN_CROP_RATIO - nextCrop.right;
          }
        }

        if (nextCrop.top + nextCrop.bottom > 1 - MIN_CROP_RATIO) {
          if (directions.y > 0) {
            nextCrop.bottom = 1 - MIN_CROP_RATIO - nextCrop.top;
          } else if (directions.y < 0) {
            nextCrop.top = 1 - MIN_CROP_RATIO - nextCrop.bottom;
          }
        }

        const nextCropRatios = getCropRatios(nextCrop);
        const nextWidth = fullWidth * nextCropRatios.width;
        const nextHeight = fullHeight * nextCropRatios.height;
        let nextCenterX = startCenterX;
        let nextCenterY = startCenterY;

        if (directions.x > 0) {
          nextCenterX = dragState.mockupRect.left + nextWidth / 2;
        } else if (directions.x < 0) {
          nextCenterX = dragState.mockupRect.right - nextWidth / 2;
        }

        if (directions.y > 0) {
          nextCenterY = dragState.mockupRect.top + nextHeight / 2;
        } else if (directions.y < 0) {
          nextCenterY = dragState.mockupRect.bottom - nextHeight / 2;
        }

        nextCenterX = clampValue(
          nextCenterX,
          dragState.canvasRect.left + nextWidth / 2,
          dragState.canvasRect.right - nextWidth / 2,
        );
        nextCenterY = clampValue(
          nextCenterY,
          dragState.canvasRect.top + nextHeight / 2,
          dragState.canvasRect.bottom - nextHeight / 2,
        );

        const nextOffsetX = clampTextOffset(
          dragState.startOffsetX +
            ((nextCenterX - startCenterX) / dragState.canvasRect.width) * 2,
        );
        const nextOffsetY = clampTextOffset(
          dragState.startOffsetY +
            ((nextCenterY - startCenterY) / dragState.canvasRect.height) * 2,
        );

        scheduleTransformUpdate(() => {
          setImageTransform({
            crop: nextCrop,
            offsetX: nextOffsetX,
            offsetY: nextOffsetY,
          });
        });
        return;
      }

      const rawRatio = calculateResizeRatio(
        dragState,
        event.clientX,
        event.clientY,
      );
      const fitScale =
        dragState.startScale *
        Math.min(
          dragState.canvasRect.width / dragState.mockupRect.width,
          dragState.canvasRect.height / dragState.mockupRect.height,
        );
      const maxScale = Math.max(
        BEAUTIFY_SETTING_LIMITS.imageScale.min,
        Math.min(BEAUTIFY_SETTING_LIMITS.imageScale.max, fitScale),
      );
      const constrainedScale = clampValue(
        dragState.startScale * rawRatio,
        BEAUTIFY_SETTING_LIMITS.imageScale.min,
        maxScale,
      );
      const nextScale = clampValue(
        Math.round(constrainedScale),
        BEAUTIFY_SETTING_LIMITS.imageScale.min,
        Math.floor(maxScale),
      );
      const scaleRatio = nextScale / dragState.startScale;
      const nextWidth = dragState.mockupRect.width * scaleRatio;
      const nextHeight = dragState.mockupRect.height * scaleRatio;
      let nextCenterX = startCenterX;
      let nextCenterY = startCenterY;

      if (directions.x > 0) {
        nextCenterX = dragState.anchorX + nextWidth / 2;
      } else if (directions.x < 0) {
        nextCenterX = dragState.anchorX - nextWidth / 2;
      }

      if (directions.y > 0) {
        nextCenterY = dragState.anchorY + nextHeight / 2;
      } else if (directions.y < 0) {
        nextCenterY = dragState.anchorY - nextHeight / 2;
      }

      nextCenterX = clampValue(
        nextCenterX,
        dragState.canvasRect.left + nextWidth / 2,
        dragState.canvasRect.right - nextWidth / 2,
      );
      nextCenterY = clampValue(
        nextCenterY,
        dragState.canvasRect.top + nextHeight / 2,
        dragState.canvasRect.bottom - nextHeight / 2,
      );

      const nextOffsetX = clampTextOffset(
        dragState.startOffsetX +
          ((nextCenterX - startCenterX) / dragState.canvasRect.width) * 2,
      );
      const nextOffsetY = clampTextOffset(
        dragState.startOffsetY +
          ((nextCenterY - startCenterY) / dragState.canvasRect.height) * 2,
      );

      scheduleTransformUpdate(() => {
        setImageTransform({
          offsetX: nextOffsetX,
          offsetY: nextOffsetY,
          scale: Math.round(nextScale),
        });
      });
    }

    function handleResizePointerEnd(
      event: PointerEvent<HTMLButtonElement>,
    ) {
      const dragState = mockupResizeStateRef.current;
      transformDragActiveRef.current = false;
      cancelTransformUpdate();

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      mockupResizeStateRef.current = null;
      setIsDraggingCanvasItem(false);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    const screenshotMotionProps = {
      initial: {
        opacity: isExportMode ? 1 : 0,
      },
      animate: {
        opacity: isExportMode || !isLoading ? 1 : 0,
      },
      exit: {
        opacity: isExportMode ? 1 : 0,
      },
      transition: { duration: isExportMode ? 0 : 0.26, ease: "easeOut" },
    } as const;
    const cropRatios = getCropRatios(imageCrop);
    const screenshotCropStyle = {
      aspectRatio: `${uploadedImage.width * cropRatios.width} / ${
        uploadedImage.height * cropRatios.height
      }`,
      border: imageBorderEnabled
        ? "1px solid rgba(255, 255, 255, 0.72)"
        : "none",
      borderRadius: `${imageRadius}px`,
      boxShadow: screenshotShadow,
      width: `${uploadedImage.width * cropRatios.width}px`,
    } satisfies CSSProperties;
    const cropContentStyle = {
      height: `${100 / cropRatios.height}%`,
      left: `${(-imageCrop.left / cropRatios.width) * 100}%`,
      position: "absolute",
      top: `${(-imageCrop.top / cropRatios.height) * 100}%`,
      width: `${100 / cropRatios.width}%`,
      willChange: "transform",
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
      hoverTiltEnabled:
        isExportMode || isDraggingCanvasItem ? false : hoverTiltEnabled,
      hoverTiltSensitivity,
    };
    const imagePlacementStyle = {
      transform: `translate(calc(${imageOffsetX} * 50cqw), calc(${imageOffsetY} * 50cqh))`,
      willChange: "transform",
    } satisfies CSSProperties;
    const mockupScaleStyle = {
      transform: `scale(${screenshotScale})`,
      transformOrigin: "center",
      transition:
        isExportMode || shouldReduceMotion || isDraggingCanvasItem
          ? undefined
          : "transform 180ms ease-out",
      willChange: "transform",
    } satisfies CSSProperties;
    const screenshotPreview = browserFrameEnabled ? (
      <motion.div
        key={`${uploadedImage.id}-browser-frame`}
        {...screenshotMotionProps}
        className="inline-flex h-full w-full overflow-hidden"
      >
        <BrowserFrame
          imageAlt={uploadedImage.name}
          imageSrc={uploadedImage.objectUrl}
          onImageLoad={handleImageLoad}
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
        onLoad={handleImageLoad}
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        {...screenshotMotionProps}
        className={cn(
          "block h-full w-full select-none object-cover will-change-transform [-webkit-user-drag:none]",
        )}
      />
    );
    const textOverlay = hasTextOverlay ? (
      <TextOverlay
        badgeEnabled={badgeEnabled}
        badgeOffsetX={badgeOffsetX}
        badgeOffsetY={badgeOffsetY}
        badgeText={badgeText}
        headlineOffsetX={headlineOffsetX}
        headlineOffsetY={headlineOffsetY}
        headlineSize={headlineSize}
        headlineText={headlineText}
        isEditable={!isExportMode}
        isExportMode={isExportMode}
        isMovable={!isExportMode}
        onLayerClickCapture={handleTextLayerClickCapture}
        onLayerPointerCancel={handleTextLayerPointerEnd}
        onLayerPointerDown={handleTextLayerPointerDown}
        onLayerPointerMove={handleTextLayerPointerMove}
        onLayerPointerUp={handleTextLayerPointerEnd}
        subtitleOffsetX={subtitleOffsetX}
        subtitleOffsetY={subtitleOffsetY}
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
        onPointerDown={handleCanvasPointerDown}
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
            <div
              ref={mockupFrameRef}
              className={cn(
                "flex max-h-full max-w-full touch-none select-none",
                screenshotShellClasses,
                !isExportMode && "cursor-grab active:cursor-grabbing",
              )}
              aria-selected={!isExportMode ? isMockupSelected : undefined}
              onPointerCancel={handleMockupPointerEnd}
              onPointerDown={handleMockupPointerDown}
              onPointerMove={handleMockupPointerMove}
              onPointerUp={handleMockupPointerEnd}
              style={imagePlacementStyle}
            >
              <div
                ref={mockupVisualRef}
                className="relative flex max-h-full max-w-full"
                style={mockupScaleStyle}
              >
                <TiltedMockupWrapper
                  className="flex max-h-full max-w-full"
                  settings={tiltSettings}
                >
                  <motion.div
                    className={cn(
                      "relative max-h-full max-w-full overflow-hidden",
                      screenshotShellClasses,
                    )}
                    style={screenshotCropStyle}
                  >
                    <div style={cropContentStyle}>
                      <AnimatePresence mode="wait">
                        {screenshotPreview}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </TiltedMockupWrapper>

                {!isExportMode && isMockupSelected && (
                  <div
                    className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] ring-2 ring-cyan-300/80 ring-offset-1 ring-offset-white/20"
                    style={{ borderRadius: `${imageRadius}px` }}
                  >
                    {RESIZE_HANDLES.map((handleId) => (
                      <button
                        key={handleId}
                        type="button"
                        aria-label={`Resize screenshot ${handleId}`}
                        className={cn(
                          "pointer-events-auto absolute rounded-full border border-cyan-500/60 bg-white shadow-sm shadow-slate-950/20 outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-cyan-300",
                          getResizeHandlePositionClass(handleId),
                        )}
                        onPointerCancel={handleResizePointerEnd}
                        onPointerDown={(event) =>
                          handleResizePointerDown(handleId, event)
                        }
                        onPointerMove={handleResizePointerMove}
                        onPointerUp={handleResizePointerEnd}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
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
