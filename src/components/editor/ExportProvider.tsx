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
import { authorizeLocalExport, createClientExportId } from "@/lib/entitlements";
import { copyPngToClipboard, exportPng } from "@/lib/export-image";
import { getExportPixelSize } from "@/lib/export-utils";
import { useEditorStore } from "@/store/editor-store";
import type { ExportScale } from "@/types/editor";
import type { ExportAction, ExportAuthorization } from "@/types/entitlements";

type ExportContextValue = {
  copyCurrentPng: () => Promise<void>;
  exportCurrentPng: () => Promise<void>;
};

const ExportContext = createContext<ExportContextValue | null>(null);

const PRO_REQUIRED_EXPORT_MESSAGE =
  "Upgrade is required to export with the selected features.";
const EXPORT_AUTHORIZATION_ERROR_MESSAGE = "Unable to authorize export.";

async function prepareExport({
  action,
  clientExportId,
  requestedScale,
}: {
  action: ExportAction;
  clientExportId: string;
  requestedScale: ExportScale;
}): Promise<ExportAuthorization> {
  const response = await fetch("/api/export/prepare", {
    body: JSON.stringify({
      action,
      clientExportId,
      requestedScale,
      usedFeatureKeys: [],
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(EXPORT_AUTHORIZATION_ERROR_MESSAGE);
  }

  const payload = (await response.json()) as {
    authorization?: ExportAuthorization;
  };

  return (
    payload.authorization ??
    authorizeLocalExport({
      action,
      clientExportId,
      requestedScale,
      usedFeatureKeys: [],
    })
  );
}

async function completeExport({
  exportAttemptId,
  failureCode,
  outputPixelHeight,
  outputPixelWidth,
  status,
}: {
  exportAttemptId: string | null;
  failureCode?: string;
  outputPixelHeight: number;
  outputPixelWidth: number;
  status: "failed" | "succeeded";
}) {
  if (!exportAttemptId) {
    return;
  }

  await fetch("/api/export/complete", {
    body: JSON.stringify({
      exportAttemptId,
      failureCode,
      outputPixelHeight,
      outputPixelWidth,
      status,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }).catch(() => undefined);
}

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
      const clientExportId = createClientExportId();
      const authorization = await prepareExport({
        action: "download",
        clientExportId,
        requestedScale: exportScale,
      });
      const outputSize = getExportPixelSize(
        canvasWidth,
        canvasHeight,
        exportScale,
      );

      if (!authorization.allowed) {
        throw new Error(PRO_REQUIRED_EXPORT_MESSAGE);
      }

      try {
        await exportPng({
          fileName: exportFileName,
          height: canvasHeight,
          node: exportNode,
          scale: exportScale,
          width: canvasWidth,
        });
        await completeExport({
          exportAttemptId: authorization.exportAttemptId,
          outputPixelHeight: outputSize.height,
          outputPixelWidth: outputSize.width,
          status: "succeeded",
        });
      } catch (error) {
        await completeExport({
          exportAttemptId: authorization.exportAttemptId,
          failureCode: error instanceof Error ? error.message : "unknown",
          outputPixelHeight: outputSize.height,
          outputPixelWidth: outputSize.width,
          status: "failed",
        });
        throw error;
      }
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
      const clientExportId = createClientExportId();
      const authorization = await prepareExport({
        action: "copy",
        clientExportId,
        requestedScale: exportScale,
      });
      const outputSize = getExportPixelSize(
        canvasWidth,
        canvasHeight,
        exportScale,
      );

      if (!authorization.allowed) {
        throw new Error(PRO_REQUIRED_EXPORT_MESSAGE);
      }

      try {
        await copyPngToClipboard({
          height: canvasHeight,
          node: exportNode,
          scale: exportScale,
          width: canvasWidth,
        });
        await completeExport({
          exportAttemptId: authorization.exportAttemptId,
          outputPixelHeight: outputSize.height,
          outputPixelWidth: outputSize.width,
          status: "succeeded",
        });
      } catch (error) {
        await completeExport({
          exportAttemptId: authorization.exportAttemptId,
          failureCode: error instanceof Error ? error.message : "unknown",
          outputPixelHeight: outputSize.height,
          outputPixelWidth: outputSize.width,
          status: "failed",
        });
        throw error;
      }
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
