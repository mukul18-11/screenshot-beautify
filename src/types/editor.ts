export type BackgroundType = "gradient" | "solid" | "mesh" | "image-blur";

export type BrowserFrameTheme = "light" | "dark";

export type BrowserFrameStyle = "macos" | "minimal";

export type TextPosition = "top" | "bottom" | "left" | "right" | "center";

export type TextAlign = "left" | "center" | "right";

export type TextLayerId = "badge" | "headline" | "subtitle";

export type TiltPresetId =
  | "flat"
  | "left-angle"
  | "right-angle"
  | "floating-card"
  | "product-hero"
  | "deep-perspective"
  | "subtle-lift"
  | "dramatic-launch";

export type ExportScale = 1 | 2 | 4;

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
  imagePadding: number;
  imageRadius: number;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
  imageCrop: ImageCrop;
  imageShadow: ImageShadow;
  imageBorderEnabled: boolean;
};

export type BrowserFrameSettings = {
  browserFrameEnabled: boolean;
  browserFrameTheme: BrowserFrameTheme;
  browserFrameStyle: BrowserFrameStyle;
  browserFrameUrl: string;
  browserFrameShowUrl: boolean;
};

export type TextOverlaySettings = {
  textOverlayEnabled: boolean;
  headlineText: string;
  subtitleText: string;
  badgeText: string;
  textPosition: TextPosition;
  textAlign: TextAlign;
  textColor: string;
  headlineSize: number;
  subtitleSize: number;
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

export type Phase3Settings = BrowserFrameSettings & TextOverlaySettings;

export type Phase4Settings = TiltSettings;

export type Phase5Settings = ExportSettings;
