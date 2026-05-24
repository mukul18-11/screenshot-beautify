"use client";

import { forwardRef } from "react";

import CanvasArtwork from "@/components/editor/CanvasArtwork";
import { useEditorStore, type UploadedImage } from "@/store/editor-store";

type ExportRendererProps = {
  uploadedImage: UploadedImage;
};

const ExportRenderer = forwardRef<HTMLDivElement, ExportRendererProps>(
  function ExportRenderer({ uploadedImage }, ref) {
    const canvasWidth = useEditorStore((state) => state.canvasWidth);
    const canvasHeight = useEditorStore((state) => state.canvasHeight);

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-100000px] top-0 z-[-1] overflow-hidden opacity-0"
        style={{
          height: `${canvasHeight}px`,
          width: `${canvasWidth}px`,
        }}
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
