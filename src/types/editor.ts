export type BackgroundType = "gradient" | "solid" | "mesh" | "image-blur";

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
