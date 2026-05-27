import type {
  DeviceMockup,
  DeviceMockupCategory,
  DeviceMockupId,
  DeviceMockupVariant,
  ImageCrop,
  UploadedImage,
} from "@/types/editor";

export type DeviceMockupTabId = "all" | Exclude<DeviceMockupCategory, "essentials">;

export const DEVICE_MOCKUP_TABS = [
  "all",
  "phone",
  "tablet",
  "laptop",
  "desktop",
  "wearable",
] as const satisfies readonly DeviceMockupTabId[];

const GRAPHITE_VARIANT = {
  id: "graphite",
  name: "Graphite",
  accent: "#111827",
  edge: "#020617",
  frame: "linear-gradient(145deg, #2f343d 0%, #05070b 48%, #3f4650 100%)",
  screenBorder: "#020617",
} as const satisfies DeviceMockupVariant;

const SILVER_VARIANT = {
  id: "silver",
  name: "Silver",
  accent: "#d8dee8",
  edge: "#94a3b8",
  frame: "linear-gradient(145deg, #f8fafc 0%, #b6c0cc 45%, #eef2f7 100%)",
  screenBorder: "#0f172a",
} as const satisfies DeviceMockupVariant;

const NATURAL_VARIANT = {
  id: "natural",
  name: "Natural",
  accent: "#c9b8a0",
  edge: "#8f7f6b",
  frame: "linear-gradient(145deg, #f1e7d8 0%, #b8a891 48%, #fff8ed 100%)",
  screenBorder: "#171717",
} as const satisfies DeviceMockupVariant;

const BLUE_VARIANT = {
  id: "blue",
  name: "Blue",
  accent: "#9fb8cf",
  edge: "#526d86",
  frame: "linear-gradient(145deg, #e4f1fb 0%, #94aeca 45%, #f5fbff 100%)",
  screenBorder: "#0f172a",
} as const satisfies DeviceMockupVariant;

const ULTRA_VARIANT = {
  id: "titanium",
  name: "Titanium",
  accent: "#d8d1c4",
  edge: "#8b8175",
  frame: "linear-gradient(145deg, #f1e7d8 0%, #a79c8e 48%, #fff8ed 100%)",
  screenBorder: "#111111",
} as const satisfies DeviceMockupVariant;

const WATCH_DARK_VARIANT = {
  id: "midnight",
  name: "Midnight",
  accent: "#171b22",
  edge: "#050608",
  frame: "linear-gradient(145deg, #3b414c 0%, #050608 50%, #454b56 100%)",
  screenBorder: "#030303",
} as const satisfies DeviceMockupVariant;

const WATCH_LIGHT_VARIANT = {
  id: "starlight",
  name: "Starlight",
  accent: "#efe6d5",
  edge: "#b6a994",
  frame: "linear-gradient(145deg, #fff6e6 0%, #c8bda8 48%, #fffaf0 100%)",
  screenBorder: "#101010",
} as const satisfies DeviceMockupVariant;

const PHONE_VARIANTS = [
  GRAPHITE_VARIANT,
  SILVER_VARIANT,
  NATURAL_VARIANT,
  BLUE_VARIANT,
] as const satisfies readonly DeviceMockupVariant[];

const COMPUTER_VARIANTS = [
  SILVER_VARIANT,
  GRAPHITE_VARIANT,
  BLUE_VARIANT,
] as const satisfies readonly DeviceMockupVariant[];

const WATCH_VARIANTS = [
  WATCH_DARK_VARIANT,
  WATCH_LIGHT_VARIANT,
] as const satisfies readonly DeviceMockupVariant[];

export const DEVICE_MOCKUPS = [
  {
    id: "none",
    name: "Screenshot",
    category: "essentials",
    screenWidth: 1200,
    screenHeight: 900,
    defaultScale: 92,
    variants: [SILVER_VARIANT],
  },
  {
    id: "browser",
    name: "Browser",
    category: "essentials",
    screenWidth: 1440,
    screenHeight: 900,
    defaultScale: 92,
    variants: [SILVER_VARIANT, GRAPHITE_VARIANT],
  },
  {
    id: "iphone-17",
    name: "iPhone 17",
    category: "phone",
    screenWidth: 402,
    screenHeight: 874,
    defaultScale: 86,
    variants: PHONE_VARIANTS,
  },
  {
    id: "iphone-17-air",
    name: "iPhone 17 Air",
    category: "phone",
    screenWidth: 420,
    screenHeight: 912,
    defaultScale: 86,
    variants: PHONE_VARIANTS,
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    category: "phone",
    screenWidth: 402,
    screenHeight: 874,
    defaultScale: 86,
    variants: [NATURAL_VARIANT, GRAPHITE_VARIANT, SILVER_VARIANT],
  },
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    category: "phone",
    screenWidth: 440,
    screenHeight: 956,
    defaultScale: 84,
    variants: [NATURAL_VARIANT, GRAPHITE_VARIANT, SILVER_VARIANT],
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    category: "phone",
    screenWidth: 393,
    screenHeight: 852,
    defaultScale: 87,
    variants: PHONE_VARIANTS,
  },
  {
    id: "iphone-16-plus",
    name: "iPhone 16 Plus",
    category: "phone",
    screenWidth: 430,
    screenHeight: 932,
    defaultScale: 84,
    variants: PHONE_VARIANTS,
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    category: "phone",
    screenWidth: 402,
    screenHeight: 874,
    defaultScale: 86,
    variants: [NATURAL_VARIANT, GRAPHITE_VARIANT, SILVER_VARIANT],
  },
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    category: "phone",
    screenWidth: 440,
    screenHeight: 956,
    defaultScale: 84,
    variants: [NATURAL_VARIANT, GRAPHITE_VARIANT, SILVER_VARIANT],
  },
  {
    id: "ipad-pro-13",
    name: "iPad Pro 13",
    category: "tablet",
    screenWidth: 2048,
    screenHeight: 2732,
    defaultScale: 84,
    variants: [GRAPHITE_VARIANT, SILVER_VARIANT],
  },
  {
    id: "ipad-pro-11",
    name: "iPad Pro 11",
    category: "tablet",
    screenWidth: 1668,
    screenHeight: 2388,
    defaultScale: 86,
    variants: [GRAPHITE_VARIANT, SILVER_VARIANT],
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "tablet",
    screenWidth: 1640,
    screenHeight: 2360,
    defaultScale: 86,
    variants: [BLUE_VARIANT, SILVER_VARIANT, GRAPHITE_VARIANT],
  },
  {
    id: "ipad-mini",
    name: "iPad Mini",
    category: "tablet",
    screenWidth: 1488,
    screenHeight: 2266,
    defaultScale: 88,
    variants: [GRAPHITE_VARIANT, SILVER_VARIANT, BLUE_VARIANT],
  },
  {
    id: "macbook-pro-16",
    name: "MacBook Pro 16",
    category: "laptop",
    screenWidth: 3456,
    screenHeight: 2234,
    defaultScale: 94,
    variants: COMPUTER_VARIANTS,
  },
  {
    id: "macbook-air-m2",
    name: "MacBook Air M2",
    category: "laptop",
    screenWidth: 2560,
    screenHeight: 1664,
    defaultScale: 96,
    variants: COMPUTER_VARIANTS,
  },
  {
    id: "macbook-air-13",
    name: "MacBook Air 13",
    category: "laptop",
    screenWidth: 2560,
    screenHeight: 1600,
    defaultScale: 96,
    variants: COMPUTER_VARIANTS,
  },
  {
    id: "imac-24",
    name: "iMac 24",
    category: "desktop",
    screenWidth: 4480,
    screenHeight: 2520,
    defaultScale: 92,
    variants: [SILVER_VARIANT, BLUE_VARIANT, GRAPHITE_VARIANT],
  },
  {
    id: "pro-display-xdr",
    name: "Pro Display XDR",
    category: "desktop",
    screenWidth: 6016,
    screenHeight: 3384,
    defaultScale: 92,
    variants: [GRAPHITE_VARIANT, SILVER_VARIANT],
  },
  {
    id: "imac-pro",
    name: "iMac Pro",
    category: "desktop",
    screenWidth: 5120,
    screenHeight: 2880,
    defaultScale: 92,
    variants: [GRAPHITE_VARIANT, SILVER_VARIANT],
  },
  {
    id: "apple-watch-ultra",
    name: "Apple Watch Ultra",
    category: "wearable",
    screenWidth: 410,
    screenHeight: 502,
    defaultScale: 82,
    variants: [ULTRA_VARIANT, WATCH_DARK_VARIANT],
  },
  {
    id: "apple-watch-10-46",
    name: "Apple Watch 10 46mm",
    category: "wearable",
    screenWidth: 416,
    screenHeight: 496,
    defaultScale: 84,
    variants: WATCH_VARIANTS,
  },
  {
    id: "apple-watch-10-42",
    name: "Apple Watch 10 42mm",
    category: "wearable",
    screenWidth: 374,
    screenHeight: 446,
    defaultScale: 86,
    variants: WATCH_VARIANTS,
  },
] as const satisfies readonly DeviceMockup[];

export function getDeviceMockup(mockupId: DeviceMockupId) {
  return DEVICE_MOCKUPS.find((mockup) => mockup.id === mockupId) ?? DEVICE_MOCKUPS[0];
}

export function isPhysicalDeviceMockup(mockupId: DeviceMockupId) {
  return mockupId !== "none" && mockupId !== "browser";
}

export function getDeviceMockupVariant(
  mockupId: DeviceMockupId,
  variantId: string | null,
) {
  const mockup = getDeviceMockup(mockupId);

  return (
    mockup.variants.find((variant) => variant.id === variantId) ??
    mockup.variants[0]
  );
}

export function createCenteredCropForMockup(
  uploadedImage: UploadedImage,
  mockup: DeviceMockup,
): ImageCrop {
  const imageAspectRatio = uploadedImage.width / uploadedImage.height;
  const targetAspectRatio = mockup.screenWidth / mockup.screenHeight;

  if (!Number.isFinite(imageAspectRatio) || imageAspectRatio <= 0) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  if (imageAspectRatio > targetAspectRatio) {
    const widthRatio = targetAspectRatio / imageAspectRatio;
    const inset = Math.max(0, (1 - widthRatio) / 2);

    return {
      top: 0,
      right: inset,
      bottom: 0,
      left: inset,
    };
  }

  const heightRatio = imageAspectRatio / targetAspectRatio;
  const inset = Math.max(0, (1 - heightRatio) / 2);

  return {
    top: inset,
    right: 0,
    bottom: inset,
    left: 0,
  };
}
