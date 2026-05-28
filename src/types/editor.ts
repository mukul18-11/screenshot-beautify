export type BackgroundType = "gradient" | "solid" | "mesh" | "image-blur";

export type BackgroundPatternId =
  | "none"
  | "soft-grid"
  | "dot-grid"
  | "diagonal-lines"
  | "micro-grain";

export type BrowserFrameTheme = "light" | "dark";

export type BrowserFrameStyle = "macos" | "minimal" | "safari" | "chrome" | "arc";

export type DeviceMockupCategory =
  | "essentials"
  | "phone"
  | "tablet"
  | "laptop"
  | "desktop"
  | "wearable";

export type DeviceMockupId =
  | "none"
  | "browser"
  | "iphone-17"
  | "iphone-17-air"
  | "iphone-17-pro"
  | "iphone-17-pro-max"
  | "iphone-16"
  | "iphone-16-plus"
  | "iphone-16-pro"
  | "iphone-16-pro-max"
  | "ipad-pro-13"
  | "ipad-pro-11"
  | "ipad-air"
  | "ipad-mini"
  | "macbook-pro-16"
  | "macbook-air-m2"
  | "macbook-air-13"
  | "imac-24"
  | "pro-display-xdr"
  | "imac-pro"
  | "apple-watch-ultra"
  | "apple-watch-10-46"
  | "apple-watch-10-42";

export type DeviceMockupVariant = {
  id: string;
  name: string;
  accent: string;
  edge: string;
  frame: string;
  screenBorder: string;
};

export type DeviceMockup = {
  id: DeviceMockupId;
  name: string;
  category: DeviceMockupCategory;
  screenWidth: number;
  screenHeight: number;
  defaultScale: number;
  variants: readonly DeviceMockupVariant[];
};

export type DeviceMockupSettings = {
  deviceMockupId: DeviceMockupId;
  deviceMockupVariantId: string | null;
};

export type ShadowScenePresetId =
  | "none"
  | "soft-bars"
  | "window-light"
  | "leaf-dapple"
  | "spotlight"
  | "silk-sweep"
  | "mesh-depth";

export type ShadowScenePlacement = "underlay" | "overlay";

export type TextPosition = "top" | "bottom" | "left" | "right" | "center";

export type TextAlign = "left" | "center" | "right";

export type DefaultTextLayerId = "badge" | "headline" | "subtitle";

export type CustomTextLayerId = `custom-${string}`;

export type TextLayerId = DefaultTextLayerId | CustomTextLayerId;

export type TextFontId =
  | "inter"
  | "orbitron"
  | "audiowide"
  | "righteous"
  | "russo-one"
  | "syncopate"
  | "rajdhani"
  | "bungee"
  | "pixelify-sans"
  | "playfair-display"
  | "bebas-neue"
  | "anton"
  | "oswald"
  | "montserrat"
  | "poppins"
  | "abril-fatface"
  | "system"
  | "sans-serif"
  | "serif"
  | "monospace"
  | "impact";

export type TextFontWeight =
  | "auto"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "black";

export type TextShadowMode = "drop" | "depth" | "glow" | "fire";

export type TextShadowPresetId =
  | "soft-depth"
  | "deep-3d"
  | "long-shadow"
  | "neon"
  | "fire"
  | "ice-glow"
  | "custom";

export type TextLayerStyle = {
  textAlign: TextAlign;
  textColor: string;
  textFontId: TextFontId;
  textFontWeight: TextFontWeight;
  textItalic: boolean;
  textUnderline: boolean;
  textLetterSpacing: number;
  textLineHeight: number;
  textOpacity: number;
  textShadowEnabled: boolean;
  textShadowMode: TextShadowMode;
  textShadowPresetId: TextShadowPresetId;
  textShadowColor: string;
  textShadowBlur: number;
  textShadowOffsetX: number;
  textShadowOffsetY: number;
  textShadowOpacity: number;
  textShadowDepth: number;
};

export type CustomTextLayer = {
  id: CustomTextLayerId;
  offsetX: number;
  offsetY: number;
  rotation: number;
  size: number;
  style: TextLayerStyle;
  text: string;
  width: number;
};

export type TiltPresetId =
  | "flat"
  | "left-angle"
  | "right-angle"
  | "floating-card"
  | "product-hero"
  | "deep-perspective"
  | "subtle-lift"
  | "dramatic-launch";

export type ScreenshotLayoutPresetId =
  | "manual"
  | "deck"
  | "spotlight"
  | "bento"
  | "compare"
  | "staggered-rows"
  | "grid";

export type ExportScale = 1 | 2 | 4 | 6;

export type UploadedImage = {
  id: string;
  file: File;
  objectUrl: string;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  uploadedAt: number;
};

export type CanvasPreset = {
  id: string;
  name: string;
  width: number;
  height: number;
};

export type BackgroundPreset = {
  id: string;
  name: string;
  type: BackgroundType;
  cssValue: string;
};

export type ImageShadow = {
  enabled: boolean;
  blur: number;
  opacity: number;
  offsetY: number;
};

export type ImageBorderPreset =
  | "none"
  | "solid"
  | "glass-light"
  | "glass-dark"
  | "liquid"
  | "inset-light"
  | "inset-dark"
  | "outline"
  | "retro"
  | "card"
  | "stack"
  | "stack-2";

export type ImageBorder = {
  enabled: boolean;
  preset: ImageBorderPreset;
  width: number;
  color: string;
};

export type ImageCrop = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type BeautifySettings = {
  canvasPreset: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundType: BackgroundType;
  backgroundValue: string;
  backgroundPresetId: string;
  backgroundPatternId: BackgroundPatternId;
  backgroundPatternColor: string;
  backgroundPatternIntensity: number;
  backgroundNoise: number;
  backgroundBlur: number;
  imagePadding: number;
  imageRadius: number;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
  imageCrop: ImageCrop;
  imageShadow: ImageShadow;
  imageBorder: ImageBorder;
  imageZoom: number;
  imageZoomOffsetX: number;
  imageZoomOffsetY: number;
};

export type BrowserFrameSettings = {
  browserFrameEnabled: boolean;
  browserFrameTheme: BrowserFrameTheme;
  browserFrameStyle: BrowserFrameStyle;
  browserFrameUrl: string;
  browserFrameShowUrl: boolean;
  browserFrameUrlBold: boolean;
  shadowSceneEnabled: boolean;
  shadowScenePresetId: ShadowScenePresetId;
  shadowSceneOpacity: number;
  shadowScenePlacement: ShadowScenePlacement;
};

export type TextOverlaySettings = {
  textOverlayEnabled: boolean;
  headlineText: string;
  subtitleText: string;
  badgeText: string;
  customTextLayers: CustomTextLayer[];
  textLayerStyles: Record<DefaultTextLayerId, TextLayerStyle>;
  textPosition: TextPosition;
  textAlign: TextAlign;
  textColor: string;
  textFontId: TextFontId;
  textFontWeight: TextFontWeight;
  textItalic: boolean;
  textUnderline: boolean;
  textLetterSpacing: number;
  textLineHeight: number;
  textOpacity: number;
  textShadowEnabled: boolean;
  textShadowMode: TextShadowMode;
  textShadowPresetId: TextShadowPresetId;
  textShadowColor: string;
  textShadowBlur: number;
  textShadowOffsetX: number;
  textShadowOffsetY: number;
  textShadowOpacity: number;
  textShadowDepth: number;
  headlineSize: number;
  subtitleSize: number;
  badgeSize: number;
  badgeWidth: number;
  badgeRotation: number;
  headlineRotation: number;
  headlineWidth: number;
  subtitleRotation: number;
  subtitleWidth: number;
  badgeEnabled: boolean;
  badgeOffsetX: number;
  badgeOffsetY: number;
  headlineOffsetX: number;
  headlineOffsetY: number;
  subtitleOffsetX: number;
  subtitleOffsetY: number;
};

export type TiltSettings = {
  tiltEnabled: boolean;
  tiltPresetId: string;
  perspective: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  translateY: number;
  tiltShadowMultiplier: number;
  hoverTiltEnabled: boolean;
  hoverTiltSensitivity: number;
  backgroundParallaxEnabled: boolean;
  backgroundParallaxStrength: number;
};

export type TiltPreset = {
  id: TiltPresetId;
  name: string;
  description: string;
  perspective: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  translateY: number;
  tiltShadowMultiplier: number;
};

export type ExportSettings = {
  exportScale: ExportScale;
  exportFileName: string;
  isExporting: boolean;
  lastExportedAt: number | null;
};

export type Phase3Settings = BrowserFrameSettings &
  DeviceMockupSettings &
  TextOverlaySettings;

export type Phase4Settings = TiltSettings;

export type Phase5Settings = ExportSettings;

export type EditorDesignSettings = BeautifySettings &
  Phase3Settings &
  Phase4Settings &
  Phase5Settings & {
    lastBeautifyPresetId: string | null;
  };

export type ScreenshotDesign = {
  id: string;
  isPlaced: boolean;
  uploadedImage: UploadedImage;
  settings: EditorDesignSettings;
};
