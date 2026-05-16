"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import ExportRenderer from "@/components/editor/ExportRenderer";
import { copyPngToClipboard, exportPng } from "@/lib/export-image";
import { useEditorStore } from "@/store/editor-store";

type ExportContextValue = {
  copyCurrentPng: () => Promise<void>;
  exportCurrentPng: () => Promise<void>;
};

const ExportContext = createContext<ExportContextValue | null>(null);

type ExportProviderProps = {
  children: ReactNode;
};

export function ExportProvider({ children }: ExportProviderProps) {
  const exportNodeRef = useRef<HTMLDivElement | null>(null);
  const isExportInFlightRef = useRef(false);
  const uploadedImage = useEditorStore((state) => state.uploadedImage);
  const canvasWidth = useEditorStore((state) => state.canvasWidth);
  const canvasHeight = useEditorStore((state) => state.canvasHeight);
  const exportScale = useEditorStore((state) => state.exportScale);
  const exportFileName = useEditorStore((state) => state.exportFileName);
  const setIsExporting = useEditorStore((state) => state.setIsExporting);
  const markExported = useEditorStore((state) => state.markExported);

  const getExportNode = useCallback(() => {
    const exportNode = exportNodeRef.current;

    if (!uploadedImage || !exportNode) {
      throw new Error("No artwork is ready to export.");
    }

    return exportNode;
  }, [uploadedImage]);

  const runExportTask = useCallback(
    async (task: () => Promise<void>) => {
      if (isExportInFlightRef.current) {
        throw new Error("Export already in progress.");
      }

      isExportInFlightRef.current = true;
      setIsExporting(true);

      try {
        await task();
        markExported();
      } catch (error) {
        setIsExporting(false);
        throw error;
      } finally {
        isExportInFlightRef.current = false;
      }
    },
    [markExported, setIsExporting],
  );

  const exportCurrentPng = useCallback(async () => {
    const exportNode = getExportNode();

    await runExportTask(async () => {
      await exportPng({
        fileName: exportFileName,
        height: canvasHeight,
        node: exportNode,
        scale: exportScale,
        width: canvasWidth,
      });
    });
  }, [
    canvasHeight,
    canvasWidth,
    exportFileName,
    exportScale,
    getExportNode,
    runExportTask,
  ]);

  const copyCurrentPng = useCallback(async () => {
    const exportNode = getExportNode();

    await runExportTask(async () => {
      await copyPngToClipboard({
        height: canvasHeight,
        node: exportNode,
        scale: exportScale,
        width: canvasWidth,
      });
    });
  }, [
    canvasHeight,
    canvasWidth,
    exportScale,
    getExportNode,
    runExportTask,
  ]);

  const contextValue = useMemo(
    () => ({
      copyCurrentPng,
      exportCurrentPng,
    }),
    [copyCurrentPng, exportCurrentPng],
  );

  return (
    <ExportContext.Provider value={contextValue}>
      {children}
      {uploadedImage && (
        <ExportRenderer ref={exportNodeRef} uploadedImage={uploadedImage} />
      )}
    </ExportContext.Provider>
  );
}

export function useExportImage() {
  const context = useContext(ExportContext);

  if (!context) {
    throw new Error("useExportImage must be used within ExportProvider.");
  }

  return context;
}
