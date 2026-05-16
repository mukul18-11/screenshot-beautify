"use client";

import { forwardRef } from "react";

import CanvasArtwork from "@/components/editor/CanvasArtwork";
import type { UploadedImage } from "@/store/editor-store";

type ExportRendererProps = {
  uploadedImage: UploadedImage;
};

const ExportRenderer = forwardRef<HTMLDivElement, ExportRendererProps>(
  function ExportRenderer({ uploadedImage }, ref) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-100000px] top-0 z-[-1] overflow-hidden opacity-0"
      >
        <CanvasArtwork
          ref={ref}
          mode="export"
          uploadedImage={uploadedImage}
          className="bg-white"
        />
      </div>
    );
  },
);

export default ExportRenderer;
