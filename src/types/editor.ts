export type BackgroundType = "gradient" | "solid" | "mesh" | "image-blur";

export type BrowserFrameTheme = "light" | "dark";

export type BrowserFrameStyle = "macos" | "minimal";

export type TextPosition = "top" | "bottom" | "left" | "right" | "center";

export type TextAlign = "left" | "center" | "right";

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
  textLayoutPreset: string;
  textPosition: TextPosition;
  textAlign: TextAlign;
  textColor: string;
  headlineSize: number;
  subtitleSize: number;
  badgeEnabled: boolean;
};

export type TextLayoutPreset = {
  id: string;
  name: string;
  headlineText: string;
  subtitleText: string;
  badgeText: string;
  textPosition: TextPosition;
  textAlign: TextAlign;
  textColor: string;
  headlineSize: number;
  subtitleSize: number;
  badgeEnabled: boolean;
};

export type Phase3Settings = BrowserFrameSettings & TextOverlaySettings;
