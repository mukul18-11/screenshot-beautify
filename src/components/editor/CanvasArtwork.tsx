"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type ForwardedRef,
  type MouseEvent,
  type MutableRefObject,
  type PointerEvent,
  type SyntheticEvent,
} from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCw, Trash2 } from "lucide-react";

import BrowserFrame, {
  MACOS_TOP_BAR_HEIGHT,
  MINIMAL_TOP_BAR_HEIGHT,
} from "@/components/editor/BrowserFrame";
import TextOverlay, {
  type TextResizeHandleId,
} from "@/components/editor/TextOverlay";
import TiltedMockupWrapper from "@/components/editor/TiltedMockupWrapper";
import {
  createBackgroundPatternStyle,
  getBackgroundPattern,
} from "@/lib/background-patterns";
import { SCREENSHOT_TRAY_DRAG_TYPE } from "@/lib/editor-drag";
import {
  BEAUTIFY_SETTING_LIMITS,
  createImageShadowCss,
} from "@/lib/editor-defaults";
import {
  clampCropInset,
  clampTextLayerOffset,
  clampTextLayerWidth,
  clampUnitOffset,
  clampValue,
  getCropRatios,
  MIN_CROP_RATIO,
} from "@/lib/editor-geometry";
import { createImageBorderCss } from "@/lib/image-border-styles";
import { multiplyTiltShadow } from "@/lib/tilt-utils";
import { createShadowSceneStyle } from "@/lib/shadow-scenes";
import { cn } from "@/lib/utils";
import {
  useEditorStore,
  type ScreenshotDesign,
  type UploadedImage,
} from "@/store/editor-store";
import type {
  DefaultTextLayerId,
  EditorDesignSettings,
  ImageCrop,
  TextLayerId,
  TextPosition,
} from "@/types/editor";

type CanvasArtworkMode = "preview" | "export";

type TextDragGuide = {
  horizontal: number | null;
  vertical: number | null;
};

type ScreenshotSlotSize = {
  height: number;
  width: number;
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

type TextLayerResizeState = {
  anchorX: number;
  anchorY: number;
  canvasRect: DOMRect;
  handleId: TextResizeHandleId;
  layerId: TextLayerId;
  moved: boolean;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startOffsetX: number;
  startOffsetY: number;
  startSize: number;
  startWidth: number;
};

type TextLayerRotateState = {
  centerX: number;
  centerY: number;
  lastPointerAngle: number;
  layerId: TextLayerId;
  moved: boolean;
  pointerId: number;
  rotationDelta: number;
  startClientX: number;
  startClientY: number;
  startRotation: number;
};

type MockupDragState = {
  canvasRect: DOMRect;
  mockupRect: DOMRect;
  moved: boolean;
  pointerId: number;
  screenshotId: string;
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

type MockupRotateState = {
  centerX: number;
  centerY: number;
  lastPointerAngle: number;
  moved: boolean;
  pointerId: number;
  rotationDelta: number;
  screenshotId: string;
  startClientX: number;
  startClientY: number;
  startRotation: number;
};

type MockupTransformControlsProps = {
  imageRadius: number;
  onRemoveFromCanvas: () => void;
  onRotatePointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
  onRotatePointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onRotatePointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onRotatePointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onResizePointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
  onResizePointerDown: (
    handleId: ResizeHandleId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onResizePointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onResizePointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
};

type CanvasArtworkProps = {
  className?: string;
  isLoading?: boolean;
  mode: CanvasArtworkMode;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  style?: CSSProperties;
  uploadedImage?: UploadedImage | null;
};

type ScreenshotWheelEvent = {
  clientX: number;
  clientY: number;
  ctrlKey?: boolean;
  deltaY: number;
  metaKey?: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
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

function getFlowTextOverlaySlotClasses(textPosition: TextPosition) {
  if (textPosition === "left" || textPosition === "right") {
    return "w-[34%] basis-[34%] max-w-[34%] justify-center";
  }

  if (textPosition === "center") {
    return "max-w-[72%]";
  }

  return "h-[20%] basis-[20%] max-h-[20%] justify-center";
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
    return "max-w-full";
  }

  if (textPosition === "left" || textPosition === "right") {
    return "max-w-full";
  }

  return "max-w-[92%]";
}

function getScreenshotMaxWidthRatio(
  textOverlayEnabled: boolean,
  textPosition: TextPosition,
) {
  if (
    textOverlayEnabled &&
    textPosition !== "left" &&
    textPosition !== "right" &&
    textPosition !== "center"
  ) {
    return 0.92;
  }

  return 1;
}

function getFallbackScreenshotSlotSize({
  canvasHeight,
  canvasWidth,
  imagePadding,
  textOverlayEnabled,
  textPosition,
}: {
  canvasHeight: number;
  canvasWidth: number;
  imagePadding: number;
  textOverlayEnabled: boolean;
  textPosition: TextPosition;
}) {
  const contentWidth = Math.max(1, canvasWidth - imagePadding * 2);
  const contentHeight = Math.max(1, canvasHeight - imagePadding * 2);

  if (
    textOverlayEnabled &&
    (textPosition === "left" || textPosition === "right")
  ) {
    return {
      height: contentHeight,
      width: Math.max(1, contentWidth * 0.62),
    };
  }

  if (
    textOverlayEnabled &&
    textPosition !== "left" &&
    textPosition !== "right" &&
    textPosition !== "center"
  ) {
    return {
      height: Math.max(1, contentHeight * 0.8),
      width: contentWidth,
    };
  }

  return {
    height: contentHeight,
    width: contentWidth,
  };
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
const MIN_VISIBLE_MOCKUP_PX = 48;
const MIN_RESIZED_MOCKUP_HEIGHT_PX = 96;
const MIN_RESIZED_MOCKUP_WIDTH_PX = 144;
const REMOVE_FROM_CANVAS_OUTSET_PX = 24;
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
const EXPAND_CROP_DIRECTIONS = { x: 1, y: 1 };

function getDraggedScreenshotId(event: DragEvent<HTMLDivElement>) {
  return (
    event.dataTransfer.getData(SCREENSHOT_TRAY_DRAG_TYPE) ||
    event.dataTransfer.getData("text/plain") ||
    null
  );
}

function hasScreenshotTrayDrag(event: DragEvent<HTMLDivElement>) {
  return Array.from(event.dataTransfer.types).includes(
    SCREENSHOT_TRAY_DRAG_TYPE,
  );
}

function isEditableKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  const editableParent = target.closest("[contenteditable]");

  return (
    target.isContentEditable ||
    (editableParent instanceof HTMLElement &&
      editableParent.contentEditable !== "false") ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

function blurEditableTextOnOutsidePointer(target: EventTarget | null) {
  if (!(target instanceof HTMLElement) || target.closest("[data-text-layer-id]")) {
    return;
  }

  const activeElement = document.activeElement;

  if (
    activeElement instanceof HTMLElement &&
    activeElement.closest("[data-editor-editable-text='true']")
  ) {
    activeElement.blur();
  }
}

function isPointOutsideRect(
  rect: DOMRect,
  clientX: number,
  clientY: number,
  outset = 0,
) {
  return (
    clientX < rect.left - outset ||
    clientX > rect.right + outset ||
    clientY < rect.top - outset ||
    clientY > rect.bottom + outset
  );
}

function isCornerResizeHandle(handleId: ResizeHandleId) {
  const directions = getResizeHandleDirections(handleId);

  return directions.x !== 0 && directions.y !== 0;
}

function clampDeltaToVisibleBounds(
  delta: number,
  elementStart: number,
  elementEnd: number,
  boundsStart: number,
  boundsEnd: number,
) {
  const elementSize = elementEnd - elementStart;
  const minVisible = Math.min(MIN_VISIBLE_MOCKUP_PX, elementSize);
  const minStart = boundsStart + minVisible - elementSize;
  const maxStart = boundsEnd - minVisible;
  const nextStart = clampValue(elementStart + delta, minStart, maxStart);

  return delta + nextStart - (elementStart + delta);
}

function clampCenterToVisibleBounds(
  center: number,
  elementSize: number,
  boundsStart: number,
  boundsEnd: number,
) {
  const minVisible = Math.min(MIN_VISIBLE_MOCKUP_PX, elementSize);
  const minCenter = boundsStart + minVisible - elementSize / 2;
  const maxCenter = boundsEnd - minVisible + elementSize / 2;

  return clampValue(center, minCenter, maxCenter);
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

function getTextResizeHandleDirections(handleId: TextResizeHandleId) {
  return {
    x: handleId.includes("e") ? 1 : -1,
    y: handleId.includes("s") ? 1 : -1,
  };
}

function isTextWidthResizeHandle(handleId: TextResizeHandleId) {
  return handleId === "e" || handleId === "w";
}

function getTextResizeHandleAnchor(
  handleId: TextResizeHandleId,
  rect: DOMRect,
) {
  const directions = getTextResizeHandleDirections(handleId);

  return {
    x: directions.x > 0 ? rect.left : rect.right,
    y: directions.y > 0 ? rect.top : rect.bottom,
  };
}

function constrainCropToRenderedSize(
  crop: ImageCrop,
  directions: ReturnType<typeof getResizeHandleDirections>,
  fullWidth: number,
  fullHeight: number,
) {
  const nextCrop = { ...crop };
  const minWidthRatio = clampValue(
    MIN_RESIZED_MOCKUP_WIDTH_PX / fullWidth,
    MIN_CROP_RATIO,
    1,
  );
  const minHeightRatio = clampValue(
    MIN_RESIZED_MOCKUP_HEIGHT_PX / fullHeight,
    MIN_CROP_RATIO,
    1,
  );

  const maxHorizontalCrop = Math.max(0, 1 - minWidthRatio);
  const maxVerticalCrop = Math.max(0, 1 - minHeightRatio);

  if (nextCrop.left + nextCrop.right > maxHorizontalCrop) {
    if (directions.x > 0) {
      nextCrop.right = clampValue(
        maxHorizontalCrop - nextCrop.left,
        0,
        maxHorizontalCrop,
      );
    } else if (directions.x < 0) {
      nextCrop.left = clampValue(
        maxHorizontalCrop - nextCrop.right,
        0,
        maxHorizontalCrop,
      );
    }
  }

  if (nextCrop.top + nextCrop.bottom > maxVerticalCrop) {
    if (directions.y > 0) {
      nextCrop.bottom = clampValue(
        maxVerticalCrop - nextCrop.top,
        0,
        maxVerticalCrop,
      );
    } else if (directions.y < 0) {
      nextCrop.top = clampValue(
        maxVerticalCrop - nextCrop.bottom,
        0,
        maxVerticalCrop,
      );
    }
  }

  return nextCrop;
}

function getResizeHandleTargetClass(handleId: ResizeHandleId) {
  const positionClasses = {
    e: "right-0 top-1/2 h-16 w-10 -translate-y-1/2 translate-x-1/2 cursor-ew-resize",
    n: "left-1/2 top-0 h-10 w-16 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize",
    ne: "right-0 top-0 h-10 w-10 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize",
    nw: "left-0 top-0 h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
    s: "bottom-0 left-1/2 h-10 w-16 -translate-x-1/2 translate-y-1/2 cursor-ns-resize",
    se: "bottom-0 right-0 h-10 w-10 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
    sw: "bottom-0 left-0 h-10 w-10 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
    w: "left-0 top-1/2 h-16 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
  } satisfies Record<ResizeHandleId, string>;

  return positionClasses[handleId];
}

function getResizeHandleVisualClass(handleId: ResizeHandleId) {
  if (handleId === "e" || handleId === "w") {
    return "h-7 w-2 rounded-full";
  }

  if (handleId === "n" || handleId === "s") {
    return "h-2 w-7 rounded-full";
  }

  return "h-3 w-3 rounded-full";
}

function MockupTransformControls({
  imageRadius,
  onRemoveFromCanvas,
  onRotatePointerCancel,
  onRotatePointerDown,
  onRotatePointerMove,
  onRotatePointerUp,
  onResizePointerCancel,
  onResizePointerDown,
  onResizePointerMove,
  onResizePointerUp,
}: MockupTransformControlsProps) {
  return (
    <div
      data-export-ignore="true"
      data-editor-live-overlay="mockup-transform"
      className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] ring-2 ring-blue-400/80 ring-offset-1 ring-offset-white/25"
      style={{ borderRadius: `${imageRadius}px` }}
    >
      <button
        type="button"
        aria-label="Rotate screenshot"
        title="Rotate screenshot"
        className="pointer-events-auto absolute left-1/2 top-0 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-[calc(100%+10px)] touch-none items-center justify-center rounded-full border border-blue-500/60 bg-white text-slate-700 shadow-sm shadow-slate-950/20 outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-300"
        onPointerCancel={onRotatePointerCancel}
        onPointerDown={onRotatePointerDown}
        onPointerMove={onRotatePointerMove}
        onPointerUp={onRotatePointerUp}
      >
        <RotateCw className="h-8 w-8" aria-hidden="true" />
      </button>
      {RESIZE_HANDLES.map((handleId) => (
        <button
          key={handleId}
          type="button"
          aria-label={`Resize screenshot ${handleId}`}
          className={cn(
            "group pointer-events-auto absolute flex touch-none items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
            getResizeHandleTargetClass(handleId),
          )}
          onPointerCancel={onResizePointerCancel}
          onPointerDown={(event) => onResizePointerDown(handleId, event)}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
        >
          <span
            aria-hidden="true"
            className={cn(
              "block border border-blue-500/60 bg-white shadow-sm shadow-slate-950/20 transition group-hover:scale-110",
              getResizeHandleVisualClass(handleId),
            )}
          />
        </button>
      ))}
      <button
        type="button"
        aria-label="Remove screenshot from canvas"
        title="Remove from artwork"
        className="pointer-events-auto absolute bottom-0 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 translate-y-[calc(100%+10px)] items-center justify-center rounded-full border border-white/80 bg-slate-950 text-white shadow-lg shadow-slate-950/20 outline-none transition hover:bg-rose-600 focus-visible:ring-2 focus-visible:ring-blue-300"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onRemoveFromCanvas();
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <Trash2 className="h-7 w-7" aria-hidden="true" />
      </button>
    </div>
  );
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

function calculateTextResizeRatio(
  dragState: TextLayerResizeState,
  clientX: number,
  clientY: number,
) {
  const startVectorX = dragState.startClientX - dragState.anchorX;
  const startVectorY = dragState.startClientY - dragState.anchorY;
  const currentVectorX = clientX - dragState.anchorX;
  const currentVectorY = clientY - dragState.anchorY;
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

function getTextLayerSizeLimits(layerId: TextLayerId) {
  if (layerId.startsWith("custom-")) {
    return BEAUTIFY_SETTING_LIMITS.headlineSize;
  }

  if (layerId === "headline") {
    return BEAUTIFY_SETTING_LIMITS.headlineSize;
  }

  if (layerId === "subtitle") {
    return BEAUTIFY_SETTING_LIMITS.subtitleSize;
  }

  return BEAUTIFY_SETTING_LIMITS.badgeSize;
}

function getPointerAngleDegrees(
  centerX: number,
  centerY: number,
  clientX: number,
  clientY: number,
) {
  return (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
}

function getShortestAngleDelta(fromAngle: number, toAngle: number) {
  return ((((toAngle - fromAngle + 180) % 360) + 360) % 360) - 180;
}

function normalizeRotationDegrees(rotation: number) {
  const normalized = ((((rotation + 180) % 360) + 360) % 360) - 180;

  return normalized === -180 ? 180 : normalized;
}

function getCircularDragRotation(
  dragState: Pick<
    TextLayerRotateState | MockupRotateState,
    | "centerX"
    | "centerY"
    | "lastPointerAngle"
    | "rotationDelta"
    | "startRotation"
  >,
  clientX: number,
  clientY: number,
) {
  const pointerAngle = getPointerAngleDegrees(
    dragState.centerX,
    dragState.centerY,
    clientX,
    clientY,
  );
  const angleDelta = getShortestAngleDelta(
    dragState.lastPointerAngle,
    pointerAngle,
  );

  dragState.lastPointerAngle = pointerAngle;
  dragState.rotationDelta += angleDelta;

  return normalizeRotationDegrees(
    Math.round(dragState.startRotation + dragState.rotationDelta),
  );
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
    const screenshotSlotRef = useRef<HTMLDivElement | null>(null);
    const screenshotZoomTargetRef = useRef<HTMLDivElement | null>(null);
    const textDragStateRef = useRef<TextLayerDragState | null>(null);
    const textResizeStateRef = useRef<TextLayerResizeState | null>(null);
    const textRotateStateRef = useRef<TextLayerRotateState | null>(null);
    const mockupDragStateRef = useRef<MockupDragState | null>(null);
    const mockupResizeStateRef = useRef<MockupResizeState | null>(null);
    const mockupRotateStateRef = useRef<MockupRotateState | null>(null);
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
    const [screenshotSlotSize, setScreenshotSlotSize] =
      useState<ScreenshotSlotSize | null>(null);
    const activeTextLayerId = useEditorStore((state) => state.activeTextLayerId);
    const setActiveTextLayerId = useEditorStore(
      (state) => state.setActiveTextLayerId,
    );
    const removeTextLayer = useEditorStore((state) => state.removeTextLayer);
    const [textDragGuide, setTextDragGuide] = useState<TextDragGuide>({
      horizontal: null,
      vertical: null,
    });
    const canvasWidth = useEditorStore((state) => state.canvasWidth);
    const canvasHeight = useEditorStore((state) => state.canvasHeight);
    const screenshots = useEditorStore((state) => state.screenshots);
    const activeScreenshotId = useEditorStore(
      (state) => state.activeScreenshotId,
    );
    const backgroundType = useEditorStore((state) => state.backgroundType);
    const backgroundValue = useEditorStore((state) => state.backgroundValue);
    const backgroundPatternId = useEditorStore(
      (state) => state.backgroundPatternId,
    );
    const backgroundPatternColor = useEditorStore(
      (state) => state.backgroundPatternColor,
    );
    const backgroundPatternIntensity = useEditorStore(
      (state) => state.backgroundPatternIntensity,
    );
    const imagePadding = useEditorStore((state) => state.imagePadding);
    const imageRadius = useEditorStore((state) => state.imageRadius);
    const imageScale = useEditorStore((state) => state.imageScale);
    const imageOffsetX = useEditorStore((state) => state.imageOffsetX);
    const imageOffsetY = useEditorStore((state) => state.imageOffsetY);
    const imageCrop = useEditorStore((state) => state.imageCrop);
    const imageShadow = useEditorStore((state) => state.imageShadow);
    const imageBorder = useEditorStore((state) => state.imageBorder);
    const imageZoom = useEditorStore((state) => state.imageZoom);
    const imageZoomOffsetX = useEditorStore(
      (state) => state.imageZoomOffsetX,
    );
    const imageZoomOffsetY = useEditorStore(
      (state) => state.imageZoomOffsetY,
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
    const shadowSceneEnabled = useEditorStore(
      (state) => state.shadowSceneEnabled,
    );
    const shadowScenePresetId = useEditorStore(
      (state) => state.shadowScenePresetId,
    );
    const shadowSceneOpacity = useEditorStore(
      (state) => state.shadowSceneOpacity,
    );
    const shadowScenePlacement = useEditorStore(
      (state) => state.shadowScenePlacement,
    );
    const textOverlayEnabled = useEditorStore(
      (state) => state.textOverlayEnabled,
    );
    const customTextLayers = useEditorStore((state) => state.customTextLayers);
    const textLayerStyles = useEditorStore((state) => state.textLayerStyles);
    const headlineText = useEditorStore((state) => state.headlineText);
    const subtitleText = useEditorStore((state) => state.subtitleText);
    const badgeText = useEditorStore((state) => state.badgeText);
    const textPosition = useEditorStore((state) => state.textPosition);
    const textAlign = useEditorStore((state) => state.textAlign);
    const textColor = useEditorStore((state) => state.textColor);
    const textFontId = useEditorStore((state) => state.textFontId);
    const textFontWeight = useEditorStore((state) => state.textFontWeight);
    const textItalic = useEditorStore((state) => state.textItalic);
    const textUnderline = useEditorStore((state) => state.textUnderline);
    const textLetterSpacing = useEditorStore(
      (state) => state.textLetterSpacing,
    );
    const textLineHeight = useEditorStore((state) => state.textLineHeight);
    const textOpacity = useEditorStore((state) => state.textOpacity);
    const textShadowEnabled = useEditorStore(
      (state) => state.textShadowEnabled,
    );
    const textShadowMode = useEditorStore((state) => state.textShadowMode);
    const textShadowColor = useEditorStore((state) => state.textShadowColor);
    const textShadowBlur = useEditorStore((state) => state.textShadowBlur);
    const textShadowOffsetX = useEditorStore(
      (state) => state.textShadowOffsetX,
    );
    const textShadowOffsetY = useEditorStore(
      (state) => state.textShadowOffsetY,
    );
    const textShadowOpacity = useEditorStore(
      (state) => state.textShadowOpacity,
    );
    const textShadowDepth = useEditorStore((state) => state.textShadowDepth);
    const headlineSize = useEditorStore((state) => state.headlineSize);
    const subtitleSize = useEditorStore((state) => state.subtitleSize);
    const badgeSize = useEditorStore((state) => state.badgeSize);
    const badgeRotation = useEditorStore((state) => state.badgeRotation);
    const headlineRotation = useEditorStore(
      (state) => state.headlineRotation,
    );
    const subtitleRotation = useEditorStore(
      (state) => state.subtitleRotation,
    );
    const badgeEnabled = useEditorStore((state) => state.badgeEnabled);
    const badgeOffsetX = useEditorStore((state) => state.badgeOffsetX);
    const badgeOffsetY = useEditorStore((state) => state.badgeOffsetY);
    const headlineOffsetX = useEditorStore((state) => state.headlineOffsetX);
    const headlineOffsetY = useEditorStore((state) => state.headlineOffsetY);
    const subtitleOffsetX = useEditorStore((state) => state.subtitleOffsetX);
    const subtitleOffsetY = useEditorStore((state) => state.subtitleOffsetY);
    const badgeWidth = useEditorStore((state) => state.badgeWidth);
    const headlineWidth = useEditorStore((state) => state.headlineWidth);
    const subtitleWidth = useEditorStore((state) => state.subtitleWidth);
    const placeScreenshot = useEditorStore((state) => state.placeScreenshot);
    const removeScreenshotFromCanvas = useEditorStore(
      (state) => state.removeScreenshotFromCanvas,
    );
    const setImageTransform = useEditorStore(
      (state) => state.setImageTransform,
    );
    const selectScreenshot = useEditorStore((state) => state.selectScreenshot);
    const setTextLayerPosition = useEditorStore(
      (state) => state.setTextLayerPosition,
    );
    const setTextLayerBox = useEditorStore((state) => state.setTextLayerBox);
    const setTextLayerSize = useEditorStore(
      (state) => state.setTextLayerSize,
    );
    const setTextLayerRotation = useEditorStore(
      (state) => state.setTextLayerRotation,
    );
    const setImageZoom = useEditorStore((state) => state.setImageZoom);
    const setImageZoomOffset = useEditorStore(
      (state) => state.setImageZoomOffset,
    );
    const setRotateZ = useEditorStore((state) => state.setRotateZ);
    const tiltEnabled = useEditorStore((state) => state.tiltEnabled);
    const tiltPresetId = useEditorStore((state) => state.tiltPresetId);
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
    const canvasPadding = isExportMode
      ? `${imagePadding}px`
      : `${(imagePadding / canvasWidth) * 100}cqw`;
    const screenshotScale = imageScale / 100;
    const activeScreenshot = screenshots.find(
      (screenshot) =>
        screenshot.id === activeScreenshotId && screenshot.isPlaced,
    );
    const activeLayerImage = activeScreenshot?.uploadedImage ?? null;
    const canvasBackgroundImage =
      uploadedImage ??
      activeLayerImage ??
      screenshots.find((screenshot) => screenshot.isPlaced)?.uploadedImage ??
      screenshots[0]?.uploadedImage ??
      null;
    const backgroundPattern = getBackgroundPattern(backgroundPatternId);
    const backgroundPatternStyle = createBackgroundPatternStyle({
      color: backgroundPatternColor,
      intensity: backgroundPatternIntensity,
      patternId: backgroundPattern.id,
    });
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

    const applyScreenshotWheelZoom = useCallback(
      (event: ScreenshotWheelEvent, targetElement: HTMLElement) => {
        if (isExportMode || event.ctrlKey || event.metaKey) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const delta = -event.deltaY;
        const step = delta > 0 ? 10 : -10;
        const currentZoom = useEditorStore.getState().imageZoom;
        const nextZoom = Math.max(100, Math.min(400, currentZoom + step));

        if (nextZoom === currentZoom) {
          return;
        }

        const rect = targetElement.getBoundingClientRect();
        const cursorFracX = (event.clientX - rect.left) / rect.width;
        const cursorFracY = (event.clientY - rect.top) / rect.height;
        const cursorNormX = (cursorFracX - 0.5) * 2;
        const cursorNormY = (cursorFracY - 0.5) * 2;

        const oldZoom = currentZoom / 100;
        const newZoom = nextZoom / 100;
        const state = useEditorStore.getState();

        let nextOffsetX = state.imageZoomOffsetX;
        let nextOffsetY = state.imageZoomOffsetY;

        if (newZoom > 1) {
          const zoomRatio = oldZoom / newZoom;
          const maxOffset = 1 - 1 / newZoom;

          nextOffsetX =
            state.imageZoomOffsetX * zoomRatio +
            cursorNormX * (1 - zoomRatio) * maxOffset;
          nextOffsetY =
            state.imageZoomOffsetY * zoomRatio +
            cursorNormY * (1 - zoomRatio) * maxOffset;
          nextOffsetX = Math.max(-maxOffset, Math.min(maxOffset, nextOffsetX));
          nextOffsetY = Math.max(-maxOffset, Math.min(maxOffset, nextOffsetY));
        } else {
          nextOffsetX = 0;
          nextOffsetY = 0;
        }

        setImageZoom(nextZoom);
        setImageZoomOffset(nextOffsetX, nextOffsetY);
      },
      [isExportMode, setImageZoom, setImageZoomOffset],
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

    useLayoutEffect(() => {
      const screenshotSlot = screenshotSlotRef.current;

      if (!screenshotSlot) {
        return;
      }

      const updateScreenshotSlotSize = (entry?: ResizeObserverEntry) => {
        setScreenshotSlotSize((currentSize) => {
          const observedWidth = entry?.contentRect.width;
          const observedHeight = entry?.contentRect.height;
          const nextWidth =
            observedWidth && observedWidth > 0
              ? observedWidth
              : screenshotSlot.clientWidth;
          const nextHeight =
            observedHeight && observedHeight > 0
              ? observedHeight
              : screenshotSlot.clientHeight;

          if (
            currentSize !== null &&
            Math.abs(currentSize.width - nextWidth) < 0.5 &&
            Math.abs(currentSize.height - nextHeight) < 0.5
          ) {
            return currentSize;
          }

          return {
            height: nextHeight,
            width: nextWidth,
          };
        });
      };

      updateScreenshotSlotSize();

      const resizeObserver = new ResizeObserver((entries) => {
        updateScreenshotSlotSize(entries[0]);
      });
      resizeObserver.observe(screenshotSlot);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useEffect(() => {
      return () => {
        textDragActiveRef.current = false;
        transformDragActiveRef.current = false;
        textResizeStateRef.current = null;
        textRotateStateRef.current = null;
        mockupRotateStateRef.current = null;

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

    useEffect(() => {
      if (isExportMode || !activeLayerImage) {
        return;
      }

      const screenshotZoomTarget = screenshotZoomTargetRef.current;

      if (!screenshotZoomTarget) {
        return;
      }

      const handleNativeWheel = (event: globalThis.WheelEvent) => {
        applyScreenshotWheelZoom(event, screenshotZoomTarget);
      };

      screenshotZoomTarget.addEventListener("wheel", handleNativeWheel, {
        passive: false,
      });

      return () => {
        screenshotZoomTarget.removeEventListener("wheel", handleNativeWheel);
      };
    }, [
      activeLayerImage,
      applyScreenshotWheelZoom,
      browserFrameEnabled,
      isExportMode,
    ]);

    useEffect(() => {
      if (isExportMode || !activeLayerImage) {
        return;
      }

      const cropRatios = getCropRatios(imageCrop);
      const renderedWidth =
        activeLayerImage.width * screenshotScale * cropRatios.width;
      const renderedHeight =
        activeLayerImage.height * screenshotScale * cropRatios.height;

      if (
        renderedWidth >= MIN_RESIZED_MOCKUP_WIDTH_PX &&
        renderedHeight >= MIN_RESIZED_MOCKUP_HEIGHT_PX
      ) {
        return;
      }

      const nextCrop = constrainCropToRenderedSize(
        imageCrop,
        EXPAND_CROP_DIRECTIONS,
        activeLayerImage.width * screenshotScale,
        activeLayerImage.height * screenshotScale,
      );

      if (
        nextCrop.top === imageCrop.top &&
        nextCrop.right === imageCrop.right &&
        nextCrop.bottom === imageCrop.bottom &&
        nextCrop.left === imageCrop.left
      ) {
        return;
      }

      setImageTransform({ crop: nextCrop, markLayoutManual: false });
    }, [
      activeLayerImage,
      imageCrop,
      isExportMode,
      screenshotScale,
      setImageTransform,
    ]);

    useEffect(() => {
      if (isExportMode || !activeScreenshotId || !isMockupSelected) {
        return;
      }

      const selectedScreenshotId = activeScreenshotId;

      function handleKeyDown(event: globalThis.KeyboardEvent) {
        if (event.key !== "Delete" && event.key !== "Backspace") {
          return;
        }

        if (isEditableKeyboardTarget(event.target)) {
          return;
        }

        event.preventDefault();
        removeScreenshotFromCanvas(selectedScreenshotId);
        setIsMockupSelected(false);
      }

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [
      activeScreenshotId,
      isExportMode,
      isMockupSelected,
      removeScreenshotFromCanvas,
    ]);

    useEffect(() => {
      if (isExportMode || !activeTextLayerId) {
        return;
      }

      const selectedTextLayerId = activeTextLayerId;

      function handleKeyDown(event: globalThis.KeyboardEvent) {
        if (event.key !== "Delete" && event.key !== "Backspace") {
          return;
        }

        if (isEditableKeyboardTarget(event.target)) {
          return;
        }

        event.preventDefault();
        removeTextLayer(selectedTextLayerId);
      }

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [
      activeTextLayerId,
      isExportMode,
      removeTextLayer,
    ]);

    function handleCanvasPointerMove(event: PointerEvent<HTMLDivElement>) {
      if (
        !canParallaxBackground ||
        event.pointerType === "touch" ||
        textDragStateRef.current ||
        textResizeStateRef.current ||
        textRotateStateRef.current ||
        mockupDragStateRef.current ||
        mockupResizeStateRef.current ||
        mockupRotateStateRef.current
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

    function handleCanvasDragOver(event: DragEvent<HTMLDivElement>) {
      if (isExportMode || !hasScreenshotTrayDrag(event)) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    }

    function handleCanvasDrop(event: DragEvent<HTMLDivElement>) {
      if (isExportMode) {
        return;
      }

      const screenshotId = getDraggedScreenshotId(event);

      if (!screenshotId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const canvasRect = event.currentTarget.getBoundingClientRect();
      const offsetX = (event.clientX - canvasRect.left) / canvasRect.width;
      const offsetY = (event.clientY - canvasRect.top) / canvasRect.height;

      placeScreenshot(screenshotId, {
        offsetX: offsetX * 2 - 1,
        offsetY: offsetY * 2 - 1,
      });
      setIsMockupSelected(true);
      setActiveTextLayerId(null);
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

      if (
        eventTarget instanceof HTMLElement &&
        !eventTarget.closest("[data-screenshot-mockup-visual]")
      ) {
        setIsMockupSelected(false);
      }

      if (
        eventTarget instanceof HTMLElement &&
        !eventTarget.closest("[data-text-layer-id]")
      ) {
        blurEditableTextOnOutsidePointer(eventTarget);
        setActiveTextLayerId(null);
      }
    }

    function handleImageLoad(event: SyntheticEvent<HTMLImageElement>) {
      onImageLoad?.(event);
    }

    const textLayerOffsets = {
      badge: { x: badgeOffsetX, y: badgeOffsetY },
      headline: { x: headlineOffsetX, y: headlineOffsetY },
      subtitle: { x: subtitleOffsetX, y: subtitleOffsetY },
    } satisfies Record<DefaultTextLayerId, { x: number; y: number }>;
    const textLayerSizes = {
      badge: badgeSize,
      headline: headlineSize,
      subtitle: subtitleSize,
    } satisfies Record<DefaultTextLayerId, number>;
    const textLayerWidths = {
      badge: badgeWidth,
      headline: headlineWidth,
      subtitle: subtitleWidth,
    } satisfies Record<DefaultTextLayerId, number>;
    const textLayerRotations = {
      badge: badgeRotation,
      headline: headlineRotation,
      subtitle: subtitleRotation,
    } satisfies Record<DefaultTextLayerId, number>;

    function getTextLayerOffset(layerId: TextLayerId) {
      if (
        layerId === "badge" ||
        layerId === "headline" ||
        layerId === "subtitle"
      ) {
        return textLayerOffsets[layerId];
      }

      const customLayer = customTextLayers.find((layer) => layer.id === layerId);

      return {
        x: customLayer?.offsetX ?? 0,
        y: customLayer?.offsetY ?? 0,
      };
    }

    function getTextLayerSize(layerId: TextLayerId) {
      if (
        layerId === "badge" ||
        layerId === "headline" ||
        layerId === "subtitle"
      ) {
        return textLayerSizes[layerId];
      }

      return (
        customTextLayers.find((layer) => layer.id === layerId)?.size ??
        headlineSize
      );
    }

    function getTextLayerWidth(layerId: TextLayerId) {
      if (
        layerId === "badge" ||
        layerId === "headline" ||
        layerId === "subtitle"
      ) {
        return textLayerWidths[layerId];
      }

      return (
        customTextLayers.find((layer) => layer.id === layerId)?.width ??
        headlineWidth
      );
    }

    function getTextLayerRotation(layerId: TextLayerId) {
      if (
        layerId === "badge" ||
        layerId === "headline" ||
        layerId === "subtitle"
      ) {
        return textLayerRotations[layerId];
      }

      return (
        customTextLayers.find((layer) => layer.id === layerId)?.rotation ?? 0
      );
    }

    function startTextLayerDrag(
      layerId: TextLayerId,
      event: PointerEvent<HTMLElement>,
      layerElement: HTMLElement,
      captureElement: HTMLElement,
    ) {
      if (isExportMode || event.button !== 0) {
        return;
      }

      const canvasShell = canvasShellRef.current;

      if (!canvasShell) {
        return;
      }

      setActiveTextLayerId(layerId);
      setIsMockupSelected(false);

      const eventTarget = event.target;

      if (
        event.detail >= 2 &&
        eventTarget instanceof HTMLElement &&
        eventTarget.closest("[data-editor-editable-text='true']")
      ) {
        return;
      }

      if (
        eventTarget instanceof HTMLElement &&
        eventTarget.closest("[contenteditable='true']")
      ) {
        return;
      }

      textDragActiveRef.current = false;
      cancelTextDragUpdate();
      const layerOffset = getTextLayerOffset(layerId);

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
        textRect: layerElement.getBoundingClientRect(),
      };

      setIsDraggingCanvasItem(true);
      captureElement.setPointerCapture(event.pointerId);
    }

    function handleTextLayerPointerDown(
      layerId: TextLayerId,
      event: PointerEvent<HTMLDivElement>,
    ) {
      startTextLayerDrag(
        layerId,
        event,
        event.currentTarget,
        event.currentTarget,
      );
    }

    function handleTextMovePointerDown(
      layerId: TextLayerId,
      event: PointerEvent<HTMLButtonElement>,
    ) {
      const textLayerElement = event.currentTarget.closest(
        "[data-text-layer-id]",
      );

      if (!(textLayerElement instanceof HTMLElement)) {
        return;
      }

      startTextLayerDrag(
        layerId,
        event,
        textLayerElement,
        event.currentTarget,
      );
    }

    function handleTextLayerPointerMove(
      layerId: TextLayerId,
      event: PointerEvent<HTMLElement>,
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

      const nextOffsetX = clampTextLayerOffset(
        dragState.startOffsetX + (deltaX / dragState.canvasRect.width) * 2,
      );
      const nextOffsetY = clampTextLayerOffset(
        dragState.startOffsetY + (deltaY / dragState.canvasRect.height) * 2,
      );

      scheduleTextDragUpdate(() => {
        setTextDragGuide(guide);
        setTextLayerPosition(dragState.layerId, nextOffsetX, nextOffsetY);
      });
    }

    function handleTextLayerPointerEnd(
      layerId: TextLayerId,
      event: PointerEvent<HTMLElement>,
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

    function handleTextResizePointerDown(
      layerId: TextLayerId,
      handleId: TextResizeHandleId,
      event: PointerEvent<HTMLButtonElement>,
    ) {
      if (isExportMode || event.button !== 0) {
        return;
      }

      const textLayerElement = event.currentTarget.closest(
        "[data-text-layer-id]",
      );
      const canvasShell = canvasShellRef.current;

      if (!(textLayerElement instanceof HTMLElement) || !canvasShell) {
        return;
      }

      const textRect = textLayerElement.getBoundingClientRect();
      const anchor = isTextWidthResizeHandle(handleId)
        ? {
            x: handleId === "e" ? textRect.left : textRect.right,
            y: textRect.top + textRect.height / 2,
          }
        : getTextResizeHandleAnchor(handleId, textRect);
      const layerOffset = getTextLayerOffset(layerId);

      event.preventDefault();
      event.stopPropagation();
      setActiveTextLayerId(layerId);
      setIsMockupSelected(false);
      setIsDraggingCanvasItem(true);
      textDragActiveRef.current = false;
      cancelTextDragUpdate();
      textDragActiveRef.current = true;
      textResizeStateRef.current = {
        anchorX: anchor.x,
        anchorY: anchor.y,
        canvasRect: canvasShell.getBoundingClientRect(),
        handleId,
        layerId,
        moved: false,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startOffsetX: layerOffset.x,
        startOffsetY: layerOffset.y,
        startSize: getTextLayerSize(layerId),
        startWidth: getTextLayerWidth(layerId),
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handleTextResizePointerMove(
      layerId: TextLayerId,
      event: PointerEvent<HTMLButtonElement>,
    ) {
      const dragState = textResizeStateRef.current;

      if (
        !dragState ||
        dragState.pointerId !== event.pointerId ||
        dragState.layerId !== layerId
      ) {
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

      if (isTextWidthResizeHandle(dragState.handleId)) {
        const direction = dragState.handleId === "e" ? 1 : -1;
        const startWidthPx = dragState.startWidth * dragState.canvasRect.width;
        const nextWidth = clampTextLayerWidth(
          (startWidthPx + deltaX * direction) / dragState.canvasRect.width,
        );
        const appliedDeltaWidthPx =
          (nextWidth - dragState.startWidth) * dragState.canvasRect.width;
        const nextOffsetX = clampTextLayerOffset(
          dragState.startOffsetX +
            (appliedDeltaWidthPx * direction) / dragState.canvasRect.width,
        );

        scheduleTextDragUpdate(() => {
          setTextLayerBox(layerId, {
            offsetX: nextOffsetX,
            offsetY: dragState.startOffsetY,
            width: nextWidth,
          });
        });
        return;
      }

      const rawRatio = calculateTextResizeRatio(
        dragState,
        event.clientX,
        event.clientY,
      );
      const limits = getTextLayerSizeLimits(layerId);
      const nextSize = clampValue(
        Math.round(dragState.startSize * Math.max(0.2, rawRatio)),
        limits.min,
        limits.max,
      );

      scheduleTextDragUpdate(() => {
        setTextLayerSize(layerId, nextSize);
      });
    }

    function handleTextResizePointerEnd(
      layerId: TextLayerId,
      event: PointerEvent<HTMLButtonElement>,
    ) {
      const dragState = textResizeStateRef.current;
      textDragActiveRef.current = false;
      cancelTextDragUpdate();

      if (
        !dragState ||
        dragState.pointerId !== event.pointerId ||
        dragState.layerId !== layerId
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      suppressNextTextClickRef.current = dragState.moved
        ? dragState.layerId
        : null;
      textResizeStateRef.current = null;
      setIsDraggingCanvasItem(false);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    function handleTextRotatePointerDown(
      layerId: TextLayerId,
      event: PointerEvent<HTMLButtonElement>,
    ) {
      if (isExportMode || event.button !== 0) {
        return;
      }

      const textLayerElement = event.currentTarget.closest(
        "[data-text-layer-id]",
      );

      if (!(textLayerElement instanceof HTMLElement)) {
        return;
      }

      const textRect = textLayerElement.getBoundingClientRect();
      const centerX = textRect.left + textRect.width / 2;
      const centerY = textRect.top + textRect.height / 2;
      const pointerAngle = getPointerAngleDegrees(
        centerX,
        centerY,
        event.clientX,
        event.clientY,
      );

      event.preventDefault();
      event.stopPropagation();
      setActiveTextLayerId(layerId);
      setIsMockupSelected(false);
      setIsDraggingCanvasItem(true);
      textDragActiveRef.current = false;
      cancelTextDragUpdate();
      textDragActiveRef.current = true;
      textRotateStateRef.current = {
        centerX,
        centerY,
        lastPointerAngle: pointerAngle,
        layerId,
        moved: false,
        pointerId: event.pointerId,
        rotationDelta: 0,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startRotation: getTextLayerRotation(layerId),
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handleTextRotatePointerMove(
      layerId: TextLayerId,
      event: PointerEvent<HTMLButtonElement>,
    ) {
      const dragState = textRotateStateRef.current;

      if (
        !dragState ||
        dragState.pointerId !== event.pointerId ||
        dragState.layerId !== layerId
      ) {
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

      const nextRotation = getCircularDragRotation(
        dragState,
        event.clientX,
        event.clientY,
      );

      scheduleTextDragUpdate(() => {
        setTextLayerRotation(layerId, nextRotation);
      });
    }

    function handleTextRotatePointerEnd(
      layerId: TextLayerId,
      event: PointerEvent<HTMLButtonElement>,
    ) {
      const dragState = textRotateStateRef.current;
      textDragActiveRef.current = false;
      cancelTextDragUpdate();

      if (
        !dragState ||
        dragState.pointerId !== event.pointerId ||
        dragState.layerId !== layerId
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      suppressNextTextClickRef.current = dragState.moved
        ? dragState.layerId
        : null;
      textRotateStateRef.current = null;
      setIsDraggingCanvasItem(false);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    function getScreenshotLayerElementAtPoint(clientX: number, clientY: number) {
      const canvasShell = canvasShellRef.current;

      if (!canvasShell || typeof document === "undefined") {
        return null;
      }

      for (const element of document.elementsFromPoint(clientX, clientY)) {
        if (!(element instanceof HTMLElement) || !canvasShell.contains(element)) {
          continue;
        }

        const mockupVisual = element.closest("[data-screenshot-mockup-visual]");
        const layerElement = element.closest("[data-screenshot-layer-id]");

        if (
          mockupVisual instanceof HTMLElement &&
          layerElement instanceof HTMLElement &&
          canvasShell.contains(layerElement)
        ) {
          return layerElement;
        }
      }

      return null;
    }

    function handleMockupPointerDown(
      screenshotId: string,
      event: PointerEvent<HTMLDivElement>,
    ) {
      if (isExportMode || event.button !== 0) {
        return;
      }

      const canvasShell = canvasShellRef.current;
      const targetLayerElement = getScreenshotLayerElementAtPoint(
        event.clientX,
        event.clientY,
      ) ?? event.currentTarget;

      if (!targetLayerElement) {
        return;
      }

      blurEditableTextOnOutsidePointer(event.target);

      const targetScreenshotId =
        targetLayerElement.dataset.screenshotLayerId ?? screenshotId;
      const mockupVisual = targetLayerElement.querySelector<HTMLElement>(
        "[data-screenshot-mockup-visual]",
      );

      if (!canvasShell || !mockupVisual) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      if (targetScreenshotId !== activeScreenshotId) {
        selectScreenshot(targetScreenshotId);
      }

      const state = useEditorStore.getState();
      const selectedScreenshot = state.screenshots.find(
        (screenshot) =>
          screenshot.id === targetScreenshotId && screenshot.isPlaced,
      );

      if (!selectedScreenshot) {
        return;
      }

      setIsMockupSelected(true);
      setActiveTextLayerId(null);
      transformDragActiveRef.current = false;
      cancelTransformUpdate();
      transformDragActiveRef.current = true;
      mockupDragStateRef.current = {
        canvasRect: canvasShell.getBoundingClientRect(),
        mockupRect: mockupVisual.getBoundingClientRect(),
        moved: false,
        pointerId: event.pointerId,
        screenshotId: targetScreenshotId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startOffsetX: state.imageOffsetX,
        startOffsetY: state.imageOffsetY,
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

      deltaX = clampDeltaToVisibleBounds(
        deltaX,
        dragState.mockupRect.left,
        dragState.mockupRect.right,
        dragState.canvasRect.left,
        dragState.canvasRect.right,
      );
      deltaY = clampDeltaToVisibleBounds(
        deltaY,
        dragState.mockupRect.top,
        dragState.mockupRect.bottom,
        dragState.canvasRect.top,
        dragState.canvasRect.bottom,
      );

      const nextOffsetX = clampUnitOffset(
        dragState.startOffsetX + (deltaX / dragState.canvasRect.width) * 2,
      );
      const nextOffsetY = clampUnitOffset(
        dragState.startOffsetY + (deltaY / dragState.canvasRect.height) * 2,
      );

      scheduleTransformUpdate(() => {
        if (
          useEditorStore.getState().activeScreenshotId !==
          dragState.screenshotId
        ) {
          return;
        }

        setImageTransform({
          offsetX: nextOffsetX,
          offsetY: nextOffsetY,
        });
      });
    }

    function handleMockupPointerEnd(event: PointerEvent<HTMLDivElement>) {
      const dragState = mockupDragStateRef.current;

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      transformDragActiveRef.current = false;
      cancelTransformUpdate();
      event.preventDefault();
      event.stopPropagation();

      const shouldRemoveFromCanvas =
        dragState.moved &&
        isPointOutsideRect(
          dragState.canvasRect,
          event.clientX,
          event.clientY,
          REMOVE_FROM_CANVAS_OUTSET_PX,
        );

      mockupDragStateRef.current = null;
      setIsDraggingCanvasItem(false);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      if (shouldRemoveFromCanvas) {
        removeScreenshotFromCanvas(dragState.screenshotId);
        setIsMockupSelected(false);
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

        const constrainedCrop = constrainCropToRenderedSize(
          nextCrop,
          directions,
          fullWidth,
          fullHeight,
        );

        const nextCropRatios = getCropRatios(constrainedCrop);
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

        nextCenterX = clampCenterToVisibleBounds(
          nextCenterX,
          nextWidth,
          dragState.canvasRect.left,
          dragState.canvasRect.right,
        );
        nextCenterY = clampCenterToVisibleBounds(
          nextCenterY,
          nextHeight,
          dragState.canvasRect.top,
          dragState.canvasRect.bottom,
        );

        const nextOffsetX = clampUnitOffset(
          dragState.startOffsetX +
            ((nextCenterX - startCenterX) / dragState.canvasRect.width) * 2,
        );
        const nextOffsetY = clampUnitOffset(
          dragState.startOffsetY +
            ((nextCenterY - startCenterY) / dragState.canvasRect.height) * 2,
        );

        scheduleTransformUpdate(() => {
          setImageTransform({
            crop: constrainedCrop,
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
      const maxScale = BEAUTIFY_SETTING_LIMITS.imageScale.max;
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

      nextCenterX = clampCenterToVisibleBounds(
        nextCenterX,
        nextWidth,
        dragState.canvasRect.left,
        dragState.canvasRect.right,
      );
      nextCenterY = clampCenterToVisibleBounds(
        nextCenterY,
        nextHeight,
        dragState.canvasRect.top,
        dragState.canvasRect.bottom,
      );

      const nextOffsetX = clampUnitOffset(
        dragState.startOffsetX +
          ((nextCenterX - startCenterX) / dragState.canvasRect.width) * 2,
      );
      const nextOffsetY = clampUnitOffset(
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

    function handleMockupRotatePointerDown(
      event: PointerEvent<HTMLButtonElement>,
    ) {
      if (isExportMode || event.button !== 0 || !activeScreenshotId) {
        return;
      }

      const mockupVisual = mockupVisualRef.current;

      if (!mockupVisual) {
        return;
      }

      const mockupRect = mockupVisual.getBoundingClientRect();
      const centerX = mockupRect.left + mockupRect.width / 2;
      const centerY = mockupRect.top + mockupRect.height / 2;
      const pointerAngle = getPointerAngleDegrees(
        centerX,
        centerY,
        event.clientX,
        event.clientY,
      );

      event.preventDefault();
      event.stopPropagation();
      setIsMockupSelected(true);
      setActiveTextLayerId(null);
      setIsDraggingCanvasItem(true);
      transformDragActiveRef.current = false;
      cancelTransformUpdate();
      transformDragActiveRef.current = true;
      mockupRotateStateRef.current = {
        centerX,
        centerY,
        lastPointerAngle: pointerAngle,
        moved: false,
        pointerId: event.pointerId,
        rotationDelta: 0,
        screenshotId: activeScreenshotId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startRotation: rotateZ,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handleMockupRotatePointerMove(
      event: PointerEvent<HTMLButtonElement>,
    ) {
      const dragState = mockupRotateStateRef.current;

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

      const nextRotation = getCircularDragRotation(
        dragState,
        event.clientX,
        event.clientY,
      );

      scheduleTransformUpdate(() => {
        if (
          useEditorStore.getState().activeScreenshotId !==
          dragState.screenshotId
        ) {
          return;
        }

        setRotateZ(nextRotation);
      });
    }

    function handleMockupRotatePointerEnd(
      event: PointerEvent<HTMLButtonElement>,
    ) {
      const dragState = mockupRotateStateRef.current;
      transformDragActiveRef.current = false;
      cancelTransformUpdate();

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      mockupRotateStateRef.current = null;
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
    const hasFlowTextOverlay =
      textOverlayEnabled &&
      ((badgeEnabled && badgeText.trim().length > 0) ||
        headlineText.trim().length > 0 ||
        subtitleText.trim().length > 0);
    const hasCustomTextOverlay =
      textOverlayEnabled &&
      customTextLayers.some((layer) => layer.text.trim().length > 0);
    const screenshotSlotClasses = getScreenshotSlotClasses(
      hasFlowTextOverlay,
      textPosition,
    );
    const screenshotShellClasses = getScreenshotShellClasses(
      hasFlowTextOverlay,
      textPosition,
    );
    const fallbackScreenshotSlotSize = getFallbackScreenshotSlotSize({
      canvasHeight,
      canvasWidth,
      imagePadding,
      textOverlayEnabled: hasFlowTextOverlay,
      textPosition,
    });
    const resolvedScreenshotSlotSize =
      screenshotSlotSize !== null &&
      screenshotSlotSize.width > 0 &&
      screenshotSlotSize.height > 0
        ? screenshotSlotSize
        : fallbackScreenshotSlotSize;
    const activeLayerSettings = activeScreenshot
      ? ({
          ...activeScreenshot.settings,
          imageRadius,
          imageScale,
          imageOffsetX,
          imageOffsetY,
          imageCrop,
          imageShadow,
          imageBorder,
          imageZoom,
          imageZoomOffsetX,
          imageZoomOffsetY,
          browserFrameEnabled,
          browserFrameTheme,
          browserFrameStyle,
          browserFrameUrl,
          browserFrameShowUrl,
          shadowSceneEnabled,
          shadowScenePresetId,
          shadowSceneOpacity,
          shadowScenePlacement,
          tiltEnabled,
          tiltPresetId,
          perspective,
          rotateX,
          rotateY,
          rotateZ,
          translateY,
          tiltShadowMultiplier,
          hoverTiltEnabled,
          hoverTiltSensitivity,
        } satisfies EditorDesignSettings)
      : null;
    const screenshotLayers = screenshots
      .filter((screenshot) => screenshot.isPlaced)
      .map((screenshot) =>
        screenshot.id === activeScreenshotId && activeLayerSettings
          ? {
              ...screenshot,
              settings: activeLayerSettings,
            }
          : screenshot,
      );
    const sortedScreenshotLayers = [...screenshotLayers].sort((a, b) => {
      if (a.id === activeScreenshotId) {
        return 1;
      }

      if (b.id === activeScreenshotId) {
        return -1;
      }

      return 0;
    });

    function renderScreenshotLayer(
      screenshot: ScreenshotDesign,
      layerIndex: number,
    ) {
      const layerSettings = screenshot.settings;
      const isActiveLayer = screenshot.id === activeScreenshotId;
      const layerCropRatios = getCropRatios(layerSettings.imageCrop);
      const croppedImageWidth =
        screenshot.uploadedImage.width * layerCropRatios.width;
      const croppedImageHeight =
        screenshot.uploadedImage.height * layerCropRatios.height;
      const maxScreenshotWidth =
        resolvedScreenshotSlotSize.width *
        getScreenshotMaxWidthRatio(hasFlowTextOverlay, textPosition);
      const frameChromeHeight = layerSettings.browserFrameEnabled
        ? layerSettings.browserFrameStyle === "macos"
          ? MACOS_TOP_BAR_HEIGHT
          : MINIMAL_TOP_BAR_HEIGHT
        : 0;
      const maxScreenshotHeight = Math.max(
        1,
        resolvedScreenshotSlotSize.height - frameChromeHeight,
      );
      const cropAspectRatio = croppedImageWidth / croppedImageHeight;
      const screenshotCropWidth =
        Math.max(
          1,
          Math.min(
            croppedImageWidth,
            maxScreenshotWidth * layerCropRatios.width,
            maxScreenshotHeight * layerCropRatios.height * cropAspectRatio,
          ),
        );
      const layerTiltEnabled = layerSettings.tiltEnabled;
      const layerScreenshotShadow = createImageShadowCss({
        ...layerSettings.imageShadow,
        blur: layerTiltEnabled
          ? multiplyTiltShadow(
              layerSettings.imageShadow.blur,
              layerSettings.tiltShadowMultiplier,
            )
          : layerSettings.imageShadow.blur,
        offsetY: layerTiltEnabled
          ? multiplyTiltShadow(
              layerSettings.imageShadow.offsetY,
              layerSettings.tiltShadowMultiplier,
            )
          : layerSettings.imageShadow.offsetY,
      });
      const screenshotCropStyle = {
        aspectRatio: `${croppedImageWidth} / ${croppedImageHeight}`,
        width: `${screenshotCropWidth}px`,
      } satisfies CSSProperties;
      const mockupDecorationStyle = {
        ...createImageBorderCss(layerSettings.imageBorder, layerScreenshotShadow),
        borderRadius: `${layerSettings.imageRadius}px`,
      } satisfies CSSProperties;
      const shadowSceneStyle = createShadowSceneStyle({
        borderRadius: layerSettings.imageRadius,
        opacity: layerSettings.shadowSceneOpacity,
        placement: layerSettings.shadowScenePlacement,
        presetId: layerSettings.shadowScenePresetId,
      });
      const showShadowScene =
        layerSettings.shadowSceneEnabled && layerSettings.shadowSceneOpacity > 0;
      const cropContentStyle = {
        height: `${100 / layerCropRatios.height}%`,
        left: `${(-layerSettings.imageCrop.left / layerCropRatios.width) * 100}%`,
        position: "absolute",
        top: `${(-layerSettings.imageCrop.top / layerCropRatios.height) * 100}%`,
        width: `${100 / layerCropRatios.width}%`,
        willChange: "transform",
      } satisfies CSSProperties;
      const layerZoomScale = layerSettings.imageZoom / 100;
      const isLayerZoomed = layerSettings.imageZoom > 100;
      const zoomTransformStyle = {
        transform: isLayerZoomed
          ? `scale(${layerZoomScale}) translate(${-layerSettings.imageZoomOffsetX * 100}%, ${-layerSettings.imageZoomOffsetY * 100}%)`
          : undefined,
        transformOrigin: "center",
        willChange: isLayerZoomed ? "transform" : undefined,
      } satisfies CSSProperties;
      const tiltSettings = {
        tiltEnabled: layerSettings.tiltEnabled,
        perspective: layerSettings.perspective,
        rotateX: layerSettings.rotateX,
        rotateY: layerSettings.rotateY,
        rotateZ: layerSettings.rotateZ,
        translateY: layerSettings.translateY,
        hoverTiltEnabled:
          isExportMode || isDraggingCanvasItem
            ? false
            : layerSettings.hoverTiltEnabled,
        hoverTiltSensitivity: layerSettings.hoverTiltSensitivity,
      };
      const imageOffsetTranslate = isExportMode
        ? `translate(${layerSettings.imageOffsetX * canvasWidth * 0.5}px, ${
            layerSettings.imageOffsetY * canvasHeight * 0.5
          }px)`
        : `translate(calc(${layerSettings.imageOffsetX} * 50cqw), calc(${layerSettings.imageOffsetY} * 50cqh))`;
      const imagePlacementStyle = {
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) ${imageOffsetTranslate}`,
        willChange: isExportMode ? undefined : "transform",
        zIndex: layerIndex + 1,
      } satisfies CSSProperties;
      const mockupScaleStyle = {
        transform: `scale(${layerSettings.imageScale / 100})`,
        transformOrigin: "center",
        transition:
          isExportMode || shouldReduceMotion || isDraggingCanvasItem
            ? undefined
            : "transform 180ms ease-out",
        willChange: "transform",
      } satisfies CSSProperties;
      const mockupVisualStyle = {
        ...mockupScaleStyle,
        width: `${screenshotCropWidth}px`,
      } satisfies CSSProperties;
      const screenshotPreview = (
        <motion.img
          key={`${screenshot.uploadedImage.id}-screenshot`}
          src={screenshot.uploadedImage.objectUrl}
          alt={screenshot.uploadedImage.name}
          onLoad={isActiveLayer ? handleImageLoad : undefined}
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          {...screenshotMotionProps}
          className={cn(
            "block h-full w-full select-none object-cover [-webkit-user-drag:none]",
            isLayerZoomed ? "will-change-transform" : "will-change-auto",
          )}
          style={zoomTransformStyle}
        />
      );
      const showMockupControls =
        !isExportMode && isActiveLayer && isMockupSelected;
      const renderShadowSceneLayer = (
        placement: typeof layerSettings.shadowScenePlacement,
      ) => {
        if (!showShadowScene || layerSettings.shadowScenePlacement !== placement) {
          return null;
        }

        return (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute",
              placement === "overlay"
                ? "inset-0 z-20 overflow-hidden"
                : "-inset-x-[7%] -inset-y-[9%] z-0",
            )}
            style={shadowSceneStyle}
          />
        );
      };

      return (
        <div
          key={screenshot.id}
          ref={isActiveLayer ? mockupFrameRef : undefined}
          data-screenshot-layer-id={screenshot.id}
          className={cn(
            "absolute flex touch-none select-none",
            screenshotShellClasses,
            !isExportMode && "cursor-grab active:cursor-grabbing",
          )}
          aria-selected={!isExportMode ? isActiveLayer : undefined}
          onPointerCancel={handleMockupPointerEnd}
          onPointerDown={(event) => handleMockupPointerDown(screenshot.id, event)}
          onPointerMove={handleMockupPointerMove}
          onPointerUp={handleMockupPointerEnd}
          style={imagePlacementStyle}
        >
          <div
            ref={isActiveLayer ? mockupVisualRef : undefined}
            data-screenshot-mockup-visual="true"
            className="relative flex"
            style={mockupVisualStyle}
          >
            <TiltedMockupWrapper
              className="flex w-full"
              isTransforming={isDraggingCanvasItem}
              settings={tiltSettings}
            >
              <div className="relative flex w-full">
                {renderShadowSceneLayer("underlay")}
                {layerSettings.browserFrameEnabled ? (
                  <div
                    className="relative z-10 w-full overflow-hidden"
                    style={mockupDecorationStyle}
                  >
                    <BrowserFrame
                      radius={0}
                      showUrl={layerSettings.browserFrameShowUrl}
                      theme={layerSettings.browserFrameTheme}
                      url={layerSettings.browserFrameUrl}
                      variant={layerSettings.browserFrameStyle}
                    >
                      <motion.div
                        ref={isActiveLayer ? screenshotZoomTargetRef : undefined}
                        className="relative overflow-hidden"
                        style={{
                          ...screenshotCropStyle,
                          touchAction: "pan-y",
                        }}
                      >
                        <div style={cropContentStyle}>
                          <AnimatePresence mode="wait">
                            {screenshotPreview}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </BrowserFrame>
                  </div>
                ) : (
                  <motion.div
                    ref={isActiveLayer ? screenshotZoomTargetRef : undefined}
                    className="relative z-10 overflow-hidden"
                    style={{
                      ...screenshotCropStyle,
                      ...mockupDecorationStyle,
                      touchAction: "pan-y",
                    }}
                  >
                    <div style={cropContentStyle}>
                      <AnimatePresence mode="wait">
                        {screenshotPreview}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
                {renderShadowSceneLayer("overlay")}

                {showMockupControls && (
                  <MockupTransformControls
                    imageRadius={layerSettings.imageRadius}
                    onRemoveFromCanvas={() => {
                      removeScreenshotFromCanvas(screenshot.id);
                      setIsMockupSelected(false);
                    }}
                    onRotatePointerCancel={handleMockupRotatePointerEnd}
                    onRotatePointerDown={handleMockupRotatePointerDown}
                    onRotatePointerMove={handleMockupRotatePointerMove}
                    onRotatePointerUp={handleMockupRotatePointerEnd}
                    onResizePointerCancel={handleResizePointerEnd}
                    onResizePointerDown={handleResizePointerDown}
                    onResizePointerMove={handleResizePointerMove}
                    onResizePointerUp={handleResizePointerEnd}
                  />
                )}
              </div>
            </TiltedMockupWrapper>
          </div>
        </div>
      );
    }
    const textOverlay = hasFlowTextOverlay ? (
      <TextOverlay
        activeLayerId={activeTextLayerId}
        badgeEnabled={badgeEnabled}
        badgeOffsetX={badgeOffsetX}
        badgeOffsetY={badgeOffsetY}
        badgeRotation={badgeRotation}
        badgeSize={badgeSize}
        badgeText={badgeText}
        badgeWidth={badgeWidth}
        customTextLayers={customTextLayers}
        textLayerStyles={textLayerStyles}
        headlineOffsetX={headlineOffsetX}
        headlineOffsetY={headlineOffsetY}
        headlineRotation={headlineRotation}
        headlineSize={headlineSize}
        headlineText={headlineText}
        headlineWidth={headlineWidth}
        isEditable={!isExportMode}
        isExportMode={isExportMode}
        isMovable={!isExportMode}
        layerScope="default"
        onLayerClickCapture={handleTextLayerClickCapture}
        onLayerEditStart={setActiveTextLayerId}
        onLayerPointerCancel={handleTextLayerPointerEnd}
        onLayerPointerDown={handleTextLayerPointerDown}
        onLayerPointerMove={handleTextLayerPointerMove}
        onLayerPointerUp={handleTextLayerPointerEnd}
        onLayerResizePointerCancel={handleTextResizePointerEnd}
        onLayerResizePointerDown={handleTextResizePointerDown}
        onLayerResizePointerMove={handleTextResizePointerMove}
        onLayerResizePointerUp={handleTextResizePointerEnd}
        onLayerMovePointerCancel={handleTextLayerPointerEnd}
        onLayerMovePointerDown={handleTextMovePointerDown}
        onLayerMovePointerMove={handleTextLayerPointerMove}
        onLayerMovePointerUp={handleTextLayerPointerEnd}
        onLayerRotatePointerCancel={handleTextRotatePointerEnd}
        onLayerRotatePointerDown={handleTextRotatePointerDown}
        onLayerRotatePointerMove={handleTextRotatePointerMove}
        onLayerRotatePointerUp={handleTextRotatePointerEnd}
        subtitleOffsetX={subtitleOffsetX}
        subtitleOffsetY={subtitleOffsetY}
        subtitleRotation={subtitleRotation}
        subtitleSize={subtitleSize}
        subtitleText={subtitleText}
        subtitleWidth={subtitleWidth}
        textAlign={textAlign}
        textColor={textColor}
        textFontId={textFontId}
        textFontWeight={textFontWeight}
        textItalic={textItalic}
        textLetterSpacing={textLetterSpacing}
        textLineHeight={textLineHeight}
        textOpacity={textOpacity}
        textPosition={textPosition}
        textShadowBlur={textShadowBlur}
        textShadowColor={textShadowColor}
        textShadowDepth={textShadowDepth}
        textShadowEnabled={textShadowEnabled}
        textShadowMode={textShadowMode}
        textShadowOffsetX={textShadowOffsetX}
        textShadowOffsetY={textShadowOffsetY}
        textShadowOpacity={textShadowOpacity}
        textUnderline={textUnderline}
        className={getFlowTextOverlaySlotClasses(textPosition)}
        placementBounds={
          isExportMode
            ? {
                height: canvasHeight,
                width: canvasWidth,
              }
            : undefined
        }
      />
    ) : null;
    const customTextOverlay = hasCustomTextOverlay ? (
      <TextOverlay
        activeLayerId={activeTextLayerId}
        badgeEnabled={badgeEnabled}
        badgeOffsetX={badgeOffsetX}
        badgeOffsetY={badgeOffsetY}
        badgeRotation={badgeRotation}
        badgeSize={badgeSize}
        badgeText={badgeText}
        badgeWidth={badgeWidth}
        customTextLayers={customTextLayers}
        textLayerStyles={textLayerStyles}
        headlineOffsetX={headlineOffsetX}
        headlineOffsetY={headlineOffsetY}
        headlineRotation={headlineRotation}
        headlineSize={headlineSize}
        headlineText={headlineText}
        headlineWidth={headlineWidth}
        isCanvasOverlay
        isEditable={!isExportMode}
        isExportMode={isExportMode}
        isMovable={!isExportMode}
        layerScope="custom"
        onLayerClickCapture={handleTextLayerClickCapture}
        onLayerEditStart={setActiveTextLayerId}
        onLayerPointerCancel={handleTextLayerPointerEnd}
        onLayerPointerDown={handleTextLayerPointerDown}
        onLayerPointerMove={handleTextLayerPointerMove}
        onLayerPointerUp={handleTextLayerPointerEnd}
        onLayerResizePointerCancel={handleTextResizePointerEnd}
        onLayerResizePointerDown={handleTextResizePointerDown}
        onLayerResizePointerMove={handleTextResizePointerMove}
        onLayerResizePointerUp={handleTextResizePointerEnd}
        onLayerMovePointerCancel={handleTextLayerPointerEnd}
        onLayerMovePointerDown={handleTextMovePointerDown}
        onLayerMovePointerMove={handleTextLayerPointerMove}
        onLayerMovePointerUp={handleTextLayerPointerEnd}
        onLayerRotatePointerCancel={handleTextRotatePointerEnd}
        onLayerRotatePointerDown={handleTextRotatePointerDown}
        onLayerRotatePointerMove={handleTextRotatePointerMove}
        onLayerRotatePointerUp={handleTextRotatePointerEnd}
        subtitleOffsetX={subtitleOffsetX}
        subtitleOffsetY={subtitleOffsetY}
        subtitleRotation={subtitleRotation}
        subtitleSize={subtitleSize}
        subtitleText={subtitleText}
        subtitleWidth={subtitleWidth}
        textAlign={textAlign}
        textColor={textColor}
        textFontId={textFontId}
        textFontWeight={textFontWeight}
        textItalic={textItalic}
        textLetterSpacing={textLetterSpacing}
        textLineHeight={textLineHeight}
        textOpacity={textOpacity}
        textPosition={textPosition}
        textShadowBlur={textShadowBlur}
        textShadowColor={textShadowColor}
        textShadowDepth={textShadowDepth}
        textShadowEnabled={textShadowEnabled}
        textShadowMode={textShadowMode}
        textShadowOffsetX={textShadowOffsetX}
        textShadowOffsetY={textShadowOffsetY}
        textShadowOpacity={textShadowOpacity}
        textUnderline={textUnderline}
        placementBounds={
          isExportMode
            ? {
                height: canvasHeight,
                width: canvasWidth,
              }
            : undefined
        }
      />
    ) : null;
    return (
      <div
        ref={mergeRefs(canvasShellRef, forwardedRef)}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        onPointerCancel={handleCanvasPointerLeave}
        onPointerDown={handleCanvasPointerDown}
        onPointerLeave={handleCanvasPointerLeave}
        onPointerMove={handleCanvasPointerMove}
        className={cn(
          "relative overflow-hidden",
          className,
        )}
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          containerType: "size",
          width: isExportMode ? `${canvasWidth}px` : undefined,
          height: isExportMode ? `${canvasHeight}px` : undefined,
          ...style,
        }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <div
            className="absolute inset-0"
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
            {backgroundType === "image-blur" && canvasBackgroundImage ? (
              <>
                <div
                  className="absolute inset-0 h-full w-full scale-110 opacity-75 blur-3xl saturate-125"
                  style={{
                    backgroundImage: `url(${canvasBackgroundImage.objectUrl})`,
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
          </div>
        </div>

        {backgroundPattern.id !== "none" && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] mix-blend-soft-light"
            style={backgroundPatternStyle}
            aria-hidden="true"
          />
        )}

        {!isExportMode && textDragGuide.vertical !== null && (
          <div
            data-export-ignore="true"
            className="pointer-events-none absolute bottom-0 top-0 z-20 w-px bg-blue-400/80 shadow-[0_0_12px_rgba(37,99,235,0.45)]"
            style={{ left: `${textDragGuide.vertical * 100}%` }}
            aria-hidden="true"
          />
        )}

        {!isExportMode && textDragGuide.horizontal !== null && (
          <div
            data-export-ignore="true"
            className="pointer-events-none absolute left-0 right-0 z-20 h-px bg-blue-400/80 shadow-[0_0_12px_rgba(37,99,235,0.45)]"
            style={{ top: `${textDragGuide.horizontal * 100}%` }}
            aria-hidden="true"
          />
        )}

        <div
          className={cn(
            "relative flex h-full w-full min-w-0 items-center justify-center overflow-hidden",
            hasFlowTextOverlay && getContentLayoutClasses(textPosition),
          )}
          style={{ padding: canvasPadding }}
        >
          {hasFlowTextOverlay && textPosition === "top" && textOverlay}
          {hasFlowTextOverlay && textPosition === "left" && textOverlay}

          <div
            ref={screenshotSlotRef}
            className={cn("relative z-[1] flex", screenshotSlotClasses)}
          >
            {sortedScreenshotLayers.map(renderScreenshotLayer)}
          </div>

          {hasFlowTextOverlay && textPosition === "center" && (
            <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center">
              {textOverlay}
            </div>
          )}
          {hasFlowTextOverlay && textPosition === "right" && textOverlay}
          {hasFlowTextOverlay && textPosition === "bottom" && textOverlay}
        </div>
        {customTextOverlay}
      </div>
    );
  },
);

export default CanvasArtwork;
