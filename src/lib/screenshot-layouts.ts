import type {
  EditorDesignSettings,
  ImageShadow,
  ScreenshotLayoutPresetId,
} from "@/types/editor";

export const MIN_SCREENSHOT_LAYOUT_COUNT = 2;
export const MAX_SCREENSHOT_LAYOUT_COUNT = 8;

export type ScreenshotLayoutPreset = {
  id: ScreenshotLayoutPresetId;
  name: string;
  description: string;
};

type ScreenshotLayoutPatch = Pick<
  EditorDesignSettings,
  | "imageOffsetX"
  | "imageOffsetY"
  | "imageScale"
  | "imageShadow"
  | "tiltEnabled"
  | "tiltPresetId"
  | "perspective"
  | "rotateX"
  | "rotateY"
  | "rotateZ"
  | "translateY"
  | "tiltShadowMultiplier"
  | "hoverTiltEnabled"
>;

type LayoutPoint = {
  offsetX: number;
  offsetY: number;
  rotateZ: number;
  scale: number;
};

const DEFAULT_LAYOUT_SHADOW: ImageShadow = {
  enabled: true,
  blur: 60,
  opacity: 0.34,
  offsetY: 28,
};

export const SCREENSHOT_LAYOUT_PRESETS = [
  {
    id: "deck",
    name: "Deck",
    description: "Fanned cards with premium depth.",
  },
  {
    id: "spotlight",
    name: "Spotlight",
    description: "One hero card with supporting shots.",
  },
  {
    id: "bento",
    name: "Bento",
    description: "Magazine-style feature collage.",
  },
  {
    id: "compare",
    name: "Compare",
    description: "Ordered splits for clear comparisons.",
  },
  {
    id: "staggered-rows",
    name: "Shuffle",
    description: "Two staggered rows for launch collages.",
  },
  {
    id: "grid",
    name: "Grid",
    description: "Clean rows for readable comparisons.",
  },
] as const satisfies readonly ScreenshotLayoutPreset[];

export function canApplyScreenshotLayout(count: number) {
  return (
    count >= MIN_SCREENSHOT_LAYOUT_COUNT &&
    count <= MAX_SCREENSHOT_LAYOUT_COUNT
  );
}

function createTiltPatch(point: LayoutPoint): ScreenshotLayoutPatch {
  return {
    imageOffsetX: point.offsetX,
    imageOffsetY: point.offsetY,
    imageScale: point.scale,
    imageShadow: { ...DEFAULT_LAYOUT_SHADOW },
    tiltEnabled: point.rotateZ !== 0,
    tiltPresetId: "custom",
    perspective: 1400,
    rotateX: -2,
    rotateY: point.rotateZ > 0 ? -4 : point.rotateZ < 0 ? 4 : 0,
    rotateZ: point.rotateZ,
    translateY: -8,
    tiltShadowMultiplier: 1.25,
    hoverTiltEnabled: false,
  };
}

function normalizeColumns(count: number) {
  if (count <= 2) {
    return 2;
  }

  if (count <= 4) {
    return 2;
  }

  return Math.ceil(count / 2);
}

function createGridPoints(count: number): LayoutPoint[] {
  const columns = normalizeColumns(count);
  const rows = Math.ceil(count / columns);
  const scale = count <= 2 ? 58 : count <= 4 ? 44 : count <= 6 ? 34 : 27;
  const xSpread = count <= 2 ? 0.72 : count <= 4 ? 0.76 : count <= 6 ? 0.9 : 0.82;
  const ySpread = rows <= 1 ? 0 : count <= 4 ? 0.58 : count <= 6 ? 0.68 : 0.62;

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);

    return {
      offsetX:
        columns <= 1 ? 0 : (column / (columns - 1) - 0.5) * xSpread,
      offsetY: rows <= 1 ? 0 : (row / (rows - 1) - 0.5) * ySpread,
      rotateZ: 0,
      scale,
    };
  });
}

function createStaggeredRowPoints(count: number): LayoutPoint[] {
  const columns = Math.ceil(count / 2);
  const scale = count <= 5 ? 36 : count <= 6 ? 33 : count <= 7 ? 27 : 25;
  const rotations = [-4.5, 3.5, -2.5, 4, -3, 2.5, -4, 3];
  const xSpread = count >= 7 ? 0.84 : 0.95;
  const rowShift = count >= 7 ? 0.05 : 0.07;

  return Array.from({ length: count }, (_, index) => {
    const row = index < columns ? 0 : 1;
    const column = row === 0 ? index : index - columns;
    const itemsInRow = row === 0 ? columns : count - columns;
    const xBase =
      itemsInRow <= 1 ? 0 : (column / (itemsInRow - 1) - 0.5) * xSpread;
    const offsetY =
      count >= 7
        ? row === 0
          ? -0.24
          : 0.27
        : row === 0
          ? -0.28
          : 0.32;

    return {
      offsetX: xBase + (row === 0 ? -rowShift : rowShift),
      offsetY,
      rotateZ: rotations[index] ?? 0,
      scale,
    };
  });
}

function createDeckPoints(count: number): LayoutPoint[] {
  if (count <= 4) {
    const grid = createGridPoints(count);
    const rotations = [-5, 4, 3, -4];

    return grid.map((point, index) => ({
      ...point,
      offsetX: point.offsetX * 0.9,
      offsetY: point.offsetY * 0.82,
      rotateZ: rotations[index] ?? 0,
      scale: point.scale + (count <= 2 ? 4 : 2),
    }));
  }

  return createStaggeredRowPoints(count).map((point, index) => ({
    ...point,
    offsetX: point.offsetX * (count >= 7 ? 0.86 : 0.9),
    offsetY: point.offsetY * (count >= 7 ? 0.86 : 0.92),
    scale: point.scale + (count >= 7 ? 0 : index % 3 === 0 ? 2 : 0),
  }));
}

function createSpotlightPoints(count: number): LayoutPoint[] {
  if (count <= 2) {
    return [
      { offsetX: -0.18, offsetY: 0, rotateZ: -3, scale: 64 },
      { offsetX: 0.28, offsetY: 0.08, rotateZ: 4, scale: 52 },
    ].slice(0, count);
  }

  const support = createStaggeredRowPoints(count - 1);

  return [
    { offsetX: -0.18, offsetY: 0.02, rotateZ: -2.5, scale: 58 },
    ...support.map((point) => ({
      ...point,
      offsetX: 0.34 + point.offsetX * 0.45,
      offsetY: point.offsetY * 0.92,
      rotateZ: point.rotateZ * 0.8,
      scale: count <= 4 ? 35 : 27,
    })),
  ];
}

function createBentoPoints(count: number): LayoutPoint[] {
  const layouts: Record<number, LayoutPoint[]> = {
    2: [
      { offsetX: -0.18, offsetY: -0.02, rotateZ: -2, scale: 66 },
      { offsetX: 0.34, offsetY: 0.16, rotateZ: 3, scale: 46 },
    ],
    3: [
      { offsetX: -0.24, offsetY: 0.02, rotateZ: -2.5, scale: 58 },
      { offsetX: 0.34, offsetY: -0.22, rotateZ: 2.5, scale: 35 },
      { offsetX: 0.38, offsetY: 0.25, rotateZ: -2, scale: 35 },
    ],
    4: [
      { offsetX: -0.28, offsetY: 0, rotateZ: -2.5, scale: 55 },
      { offsetX: 0.3, offsetY: -0.26, rotateZ: 2.5, scale: 32 },
      { offsetX: 0.4, offsetY: 0.03, rotateZ: -1, scale: 32 },
      { offsetX: 0.28, offsetY: 0.31, rotateZ: 3, scale: 32 },
    ],
    5: [
      { offsetX: -0.32, offsetY: -0.12, rotateZ: -2.5, scale: 45 },
      { offsetX: 0.24, offsetY: 0.14, rotateZ: 2.5, scale: 43 },
      { offsetX: 0.14, offsetY: -0.3, rotateZ: -1.5, scale: 29 },
      { offsetX: 0.54, offsetY: -0.15, rotateZ: 3, scale: 27 },
      { offsetX: -0.08, offsetY: 0.34, rotateZ: -3, scale: 28 },
    ],
    6: [
      { offsetX: -0.36, offsetY: -0.12, rotateZ: -2.5, scale: 43 },
      { offsetX: 0.2, offsetY: 0.16, rotateZ: 2.5, scale: 41 },
      { offsetX: 0.06, offsetY: -0.34, rotateZ: -2, scale: 27 },
      { offsetX: 0.46, offsetY: -0.26, rotateZ: 3, scale: 27 },
      { offsetX: -0.12, offsetY: 0.34, rotateZ: -3, scale: 27 },
      { offsetX: 0.56, offsetY: 0.32, rotateZ: 2, scale: 27 },
    ],
    7: [
      { offsetX: -0.34, offsetY: -0.08, rotateZ: -2.5, scale: 37 },
      { offsetX: 0.16, offsetY: 0.12, rotateZ: 2.5, scale: 36 },
      { offsetX: -0.02, offsetY: -0.32, rotateZ: -2, scale: 23 },
      { offsetX: 0.27, offsetY: -0.3, rotateZ: 2, scale: 23 },
      { offsetX: 0.52, offsetY: -0.1, rotateZ: -2.5, scale: 23 },
      { offsetX: -0.12, offsetY: 0.31, rotateZ: 3, scale: 23 },
      { offsetX: 0.48, offsetY: 0.3, rotateZ: -2, scale: 23 },
    ],
    8: [
      { offsetX: -0.34, offsetY: -0.1, rotateZ: -2.5, scale: 35 },
      { offsetX: 0.16, offsetY: 0.12, rotateZ: 2.5, scale: 34 },
      { offsetX: -0.05, offsetY: -0.33, rotateZ: -2, scale: 21 },
      { offsetX: 0.21, offsetY: -0.31, rotateZ: 2, scale: 21 },
      { offsetX: 0.47, offsetY: -0.2, rotateZ: -2.5, scale: 21 },
      { offsetX: -0.14, offsetY: 0.3, rotateZ: 3, scale: 21 },
      { offsetX: 0.4, offsetY: 0.32, rotateZ: -2, scale: 21 },
      { offsetX: 0.56, offsetY: 0.08, rotateZ: 2.5, scale: 21 },
    ],
  };

  return layouts[count] ?? createSpotlightPoints(count);
}

function createComparePoints(count: number): LayoutPoint[] {
  if (count <= 3) {
    const scale = count === 2 ? 58 : 43;
    const xSpread = count === 2 ? 0.72 : 0.92;

    return Array.from({ length: count }, (_, index) => ({
      offsetX: count === 1 ? 0 : (index / (count - 1) - 0.5) * xSpread,
      offsetY: index % 2 === 0 ? -0.02 : 0.04,
      rotateZ: 0,
      scale,
    }));
  }

  const columns = Math.ceil(count / 2);
  const scale = count <= 4 ? 39 : count <= 6 ? 31 : 25;
  const xSpread = count >= 7 ? 0.84 : 0.92;

  return Array.from({ length: count }, (_, index) => {
    const row = index < columns ? 0 : 1;
    const column = row === 0 ? index : index - columns;
    const itemsInRow = row === 0 ? columns : count - columns;

    return {
      offsetX:
        itemsInRow <= 1 ? 0 : (column / (itemsInRow - 1) - 0.5) * xSpread,
      offsetY: row === 0 ? -0.22 : 0.25,
      rotateZ: 0,
      scale,
    };
  });
}

function getLayoutPoints(
  presetId: ScreenshotLayoutPresetId,
  count: number,
): LayoutPoint[] {
  if (presetId === "bento") {
    return createBentoPoints(count);
  }

  if (presetId === "compare") {
    return createComparePoints(count);
  }

  if (presetId === "grid") {
    return createGridPoints(count);
  }

  if (presetId === "spotlight") {
    return createSpotlightPoints(count);
  }

  if (presetId === "staggered-rows") {
    return createStaggeredRowPoints(count);
  }

  return createDeckPoints(count);
}

export function createScreenshotLayoutPatches(
  presetId: ScreenshotLayoutPresetId,
  count: number,
): ScreenshotLayoutPatch[] {
  if (presetId === "manual" || !canApplyScreenshotLayout(count)) {
    return [];
  }

  return getLayoutPoints(presetId, count).map(createTiltPatch);
}
