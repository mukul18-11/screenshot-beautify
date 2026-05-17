import { getBackgroundPreset } from "@/lib/background-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import type {
  BeautifySettings,
  BrowserFrameSettings,
  DesignTemplate,
  DesignTemplateCategory,
  DesignTemplateImageStyle,
  ImageShadow,
  TextAlign,
  TextOverlaySettings,
  TextPosition,
  TiltSettings,
} from "@/types/editor";

export type DesignTemplateSettings = BeautifySettings &
  BrowserFrameSettings &
  TiltSettings;

export const DESIGN_TEMPLATE_FILTERS = [
  "All",
  "Social",
  "Launch",
  "SaaS",
  "Founder",
  "Mobile",
  "Minimal",
] as const;

export type DesignTemplateFilter = (typeof DESIGN_TEMPLATE_FILTERS)[number];

type CreateDesignTemplateInput = {
  id: string;
  name: string;
  description: string;
  category: DesignTemplateCategory;
  canvasPresetId: string;
  backgroundPresetId: string;
  imageStyle: DesignTemplateImageStyle;
  browserFrame: BrowserFrameSettings;
  textOverlay: TextOverlaySettings;
  tilt: TiltSettings;
  previewLabel: string;
};

function shadow(
  blur: number,
  opacity: number,
  offsetY: number,
  enabled = true,
): ImageShadow {
  return {
    enabled,
    blur,
    opacity,
    offsetY,
  };
}

function browserFrame(
  enabled: boolean,
  theme: BrowserFrameSettings["browserFrameTheme"],
  style: BrowserFrameSettings["browserFrameStyle"],
  url: string,
  showUrl = true,
): BrowserFrameSettings {
  return {
    browserFrameEnabled: enabled,
    browserFrameTheme: theme,
    browserFrameStyle: style,
    browserFrameUrl: url,
    browserFrameShowUrl: showUrl,
  };
}

function textOverlay(
  enabled: boolean,
  headlineText: string,
  subtitleText: string,
  badgeText: string,
  textPosition: TextPosition,
  textAlign: TextAlign,
  textColor: string,
  headlineSize: number,
  subtitleSize: number,
  badgeEnabled = true,
): TextOverlaySettings {
  return {
    textOverlayEnabled: enabled,
    headlineText,
    subtitleText,
    badgeText,
    textLayoutPreset: "custom",
    textPosition,
    textAlign,
    textColor,
    headlineSize,
    subtitleSize,
    badgeEnabled,
    badgeOffsetX: 0,
    badgeOffsetY: 0,
    headlineOffsetX: 0,
    headlineOffsetY: 0,
    subtitleOffsetX: 0,
    subtitleOffsetY: 0,
  };
}

function tilt(
  enabled: boolean,
  presetId: string,
  perspective: number,
  rotateX: number,
  rotateY: number,
  rotateZ: number,
  translateY: number,
  tiltShadowMultiplier: number,
  hoverTiltEnabled = false,
  backgroundParallaxEnabled = false,
): TiltSettings {
  return {
    tiltEnabled: enabled,
    tiltPresetId: presetId,
    perspective,
    rotateX,
    rotateY,
    rotateZ,
    translateY,
    tiltShadowMultiplier,
    hoverTiltEnabled,
    hoverTiltSensitivity: 8,
    backgroundParallaxEnabled,
    backgroundParallaxStrength: backgroundParallaxEnabled ? 10 : 8,
  };
}

function createDesignTemplate(
  input: CreateDesignTemplateInput,
): DesignTemplate {
  const canvasPreset = getCanvasPreset(input.canvasPresetId);
  const backgroundPreset = getBackgroundPreset(input.backgroundPresetId);

  return {
    id: input.id,
    name: input.name,
    description: input.description,
    category: input.category,
    canvas: {
      canvasPreset: canvasPreset.id,
      canvasWidth: canvasPreset.width,
      canvasHeight: canvasPreset.height,
    },
    background: {
      backgroundType: backgroundPreset.type,
      backgroundValue: backgroundPreset.cssValue,
      backgroundPresetId: backgroundPreset.id,
    },
    imageStyle: {
      ...input.imageStyle,
      imageShadow: {
        ...input.imageStyle.imageShadow,
      },
    },
    browserFrame: {
      ...input.browserFrame,
    },
    textOverlay: {
      ...input.textOverlay,
    },
    tilt: {
      ...input.tilt,
    },
    previewLabel: input.previewLabel,
  };
}

export const DESIGN_TEMPLATES = [
  createDesignTemplate({
    id: "saas-launch-hero",
    name: "SaaS Launch Hero",
    description: "Wide launch-page visual with a polished product mockup.",
    category: "SaaS",
    canvasPresetId: "wide-hero",
    backgroundPresetId: "midnight-purple",
    imageStyle: {
      imagePadding: 80,
      imageRadius: 26,
      imageScale: 94,
      imageShadow: shadow(72, 0.42, 34),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(true, "dark", "macos", "acmeapp.com"),
    textOverlay: textOverlay(
      true,
      "Launch-ready product visuals",
      "Turn your screenshot into a premium hero asset in seconds.",
      "SaaS LAUNCH",
      "top",
      "center",
      "#ffffff",
      46,
      20,
    ),
    tilt: tilt(true, "product-hero", 1100, 8, -12, 0, 0, 1.2, true, true),
    previewLabel: "Hero",
  }),
  createDesignTemplate({
    id: "product-hunt-launch",
    name: "Product Hunt Launch",
    description: "High-energy Product Hunt format for launch announcements.",
    category: "Launch",
    canvasPresetId: "product-hunt",
    backgroundPresetId: "product-hunt-orange",
    imageStyle: {
      imagePadding: 90,
      imageRadius: 22,
      imageScale: 93,
      imageShadow: shadow(50, 0.28, 24),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(true, "light", "macos", "producthunt.com"),
    textOverlay: textOverlay(
      true,
      "We are live on Product Hunt",
      "A cleaner way to share polished product screenshots.",
      "PRODUCT HUNT",
      "top",
      "left",
      "#ffffff",
      42,
      19,
    ),
    tilt: tilt(true, "subtle-lift", 1200, 4, -6, 0, -4, 1.12, true),
    previewLabel: "Launch",
  }),
  createDesignTemplate({
    id: "founder-update",
    name: "Founder Update",
    description: "Story-driven visual for founder notes and progress posts.",
    category: "Founder",
    canvasPresetId: "square-post",
    backgroundPresetId: "founder-dark",
    imageStyle: {
      imagePadding: 130,
      imageRadius: 28,
      imageScale: 90,
      imageShadow: shadow(76, 0.46, 36),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(true, "dark", "minimal", "building.today"),
    textOverlay: textOverlay(
      true,
      "What changed this week",
      "A quick product update from the build log.",
      "BUILDING IN PUBLIC",
      "bottom",
      "left",
      "#ffffff",
      42,
      19,
    ),
    tilt: tilt(true, "floating-card", 1200, 10, -10, -1, -8, 1.3, true, true),
    previewLabel: "Founder",
  }),
  createDesignTemplate({
    id: "linkedin-product-post",
    name: "LinkedIn Product Post",
    description: "Tall professional layout for product updates on LinkedIn.",
    category: "Social",
    canvasPresetId: "linkedin-post",
    backgroundPresetId: "soft-peach",
    imageStyle: {
      imagePadding: 96,
      imageRadius: 20,
      imageScale: 92,
      imageShadow: shadow(38, 0.2, 18),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(true, "light", "macos", "yourproduct.com"),
    textOverlay: textOverlay(
      true,
      "New product experience is live",
      "A clearer workflow, sharper UI, and faster setup.",
      "PRODUCT UPDATE",
      "top",
      "center",
      "#0f172a",
      42,
      19,
    ),
    tilt: tilt(false, "flat", 1200, 0, 0, 0, 0, 1),
    previewLabel: "LinkedIn",
  }),
  createDesignTemplate({
    id: "x-build-in-public",
    name: "X Build in Public",
    description: "Compact square post for shipping updates and demos.",
    category: "Social",
    canvasPresetId: "square-post",
    backgroundPresetId: "deep-space",
    imageStyle: {
      imagePadding: 104,
      imageRadius: 24,
      imageScale: 91,
      imageShadow: shadow(68, 0.4, 30),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(true, "dark", "minimal", "localhost:3000"),
    textOverlay: textOverlay(
      true,
      "Shipped a cleaner dashboard",
      "Small details, better defaults, faster path to value.",
      "BUILD LOG",
      "bottom",
      "left",
      "#ffffff",
      40,
      18,
    ),
    tilt: tilt(true, "left-angle", 1200, 8, -16, 0, 0, 1.18, true, true),
    previewLabel: "X Post",
  }),
  createDesignTemplate({
    id: "app-store-style",
    name: "App Store Style",
    description: "Bright app showcase layout for polished mobile-style promos.",
    category: "Mobile",
    canvasPresetId: "story-reel",
    backgroundPresetId: "mint-glass",
    imageStyle: {
      imagePadding: 146,
      imageRadius: 32,
      imageScale: 88,
      imageShadow: shadow(52, 0.22, 24),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(false, "light", "minimal", "app.example.com"),
    textOverlay: textOverlay(
      true,
      "Designed for daily focus",
      "A cleaner app experience for getting important work done.",
      "APP PREVIEW",
      "top",
      "center",
      "#0f172a",
      46,
      21,
    ),
    tilt: tilt(true, "subtle-lift", 1200, 4, -6, 0, -4, 1.12, true),
    previewLabel: "App",
  }),
  createDesignTemplate({
    id: "dark-dashboard",
    name: "Dark Dashboard",
    description: "Deep, premium dashboard frame for analytics and admin UIs.",
    category: "SaaS",
    canvasPresetId: "wide-hero",
    backgroundPresetId: "deep-space",
    imageStyle: {
      imagePadding: 112,
      imageRadius: 28,
      imageScale: 92,
      imageShadow: shadow(80, 0.48, 38),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(true, "dark", "macos", "dashboard.app"),
    textOverlay: textOverlay(
      true,
      "Everything important, in one dashboard",
      "Show complex product surfaces with depth and clarity.",
      "DASHBOARD",
      "top",
      "center",
      "#ffffff",
      44,
      20,
    ),
    tilt: tilt(true, "deep-perspective", 800, 18, -24, 1, 0, 1.55, true, true),
    previewLabel: "Dark",
  }),
  createDesignTemplate({
    id: "clean-minimal",
    name: "Clean Minimal",
    description: "Quiet, editorial layout for crisp product screenshots.",
    category: "Minimal",
    canvasPresetId: "square-post",
    backgroundPresetId: "clean-gray",
    imageStyle: {
      imagePadding: 100,
      imageRadius: 18,
      imageScale: 94,
      imageShadow: shadow(30, 0.14, 14),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(true, "light", "minimal", "yourproduct.com"),
    textOverlay: textOverlay(
      true,
      "A cleaner product screenshot",
      "Simple composition for docs, posts, and updates.",
      "",
      "top",
      "center",
      "#0f172a",
      40,
      18,
      false,
    ),
    tilt: tilt(false, "flat", 1200, 0, 0, 0, 0, 1),
    previewLabel: "Minimal",
  }),
  createDesignTemplate({
    id: "feature-announcement",
    name: "Feature Announcement",
    description: "Bold visual for announcing new product capabilities.",
    category: "Launch",
    canvasPresetId: "og-image",
    backgroundPresetId: "sunset-glow",
    imageStyle: {
      imagePadding: 88,
      imageRadius: 24,
      imageScale: 92,
      imageShadow: shadow(54, 0.3, 26),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(true, "light", "macos", "yourproduct.com/new"),
    textOverlay: textOverlay(
      true,
      "Introducing smarter workflows",
      "A faster way to move from idea to shipped product.",
      "NEW FEATURE",
      "left",
      "left",
      "#ffffff",
      42,
      19,
    ),
    tilt: tilt(true, "right-angle", 1200, 8, 16, 0, 0, 1.18, true),
    previewLabel: "Feature",
  }),
  createDesignTemplate({
    id: "mobile-story",
    name: "Mobile Story",
    description: "Vertical social story layout with a dramatic app mockup.",
    category: "Mobile",
    canvasPresetId: "story-reel",
    backgroundPresetId: "cyber-lime",
    imageStyle: {
      imagePadding: 138,
      imageRadius: 34,
      imageScale: 88,
      imageShadow: shadow(78, 0.44, 36),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(false, "dark", "minimal", "mobile.app"),
    textOverlay: textOverlay(
      true,
      "Your product, story-ready",
      "Vertical visuals for launches, demos, and quick updates.",
      "STORY",
      "bottom",
      "center",
      "#ffffff",
      48,
      21,
    ),
    tilt: tilt(true, "dramatic-launch", 900, 16, 22, -2, 0, 1.65, true, true),
    previewLabel: "Story",
  }),
  createDesignTemplate({
    id: "changelog-update",
    name: "Changelog Update",
    description: "Clear release-note visual for small but meaningful changes.",
    category: "SaaS",
    canvasPresetId: "linkedin-post",
    backgroundPresetId: "ocean-blue",
    imageStyle: {
      imagePadding: 104,
      imageRadius: 22,
      imageScale: 91,
      imageShadow: shadow(44, 0.24, 22),
      imageBorderEnabled: true,
    },
    browserFrame: browserFrame(true, "light", "minimal", "changelog.app"),
    textOverlay: textOverlay(
      true,
      "This week's product updates",
      "Cleaner navigation, faster search, and refined empty states.",
      "CHANGELOG",
      "top",
      "left",
      "#ffffff",
      40,
      18,
    ),
    tilt: tilt(true, "subtle-lift", 1200, 4, -6, 0, -4, 1.12, false),
    previewLabel: "Update",
  }),
] as const satisfies readonly DesignTemplate[];

export type DesignTemplateId = (typeof DESIGN_TEMPLATES)[number]["id"];

export function getDesignTemplate(templateId: string) {
  return (
    DESIGN_TEMPLATES.find((template) => template.id === templateId) ??
    DESIGN_TEMPLATES[0]
  );
}

export function createDesignTemplateSettings(
  templateId: string,
): DesignTemplateSettings {
  const template = getDesignTemplate(templateId);

  return {
    ...template.canvas,
    ...template.background,
    ...template.imageStyle,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageShadow: {
      ...template.imageStyle.imageShadow,
    },
    ...template.browserFrame,
    ...template.tilt,
  };
}
