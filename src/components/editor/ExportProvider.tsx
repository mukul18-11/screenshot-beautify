"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import ExportRenderer from "@/components/editor/ExportRenderer";
import { authorizeLocalExport, createClientExportId } from "@/lib/entitlements";
import { copyPngToClipboard, exportPng } from "@/lib/export-image";
import { getExportPixelSize, getSafeExportScale } from "@/lib/export-utils";
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
const EXPORT_NETWORK_ERROR_MESSAGE =
  "Could not reach the server. Check your connection and try again.";

async function prepareExport({
  action,
  clientExportId,
  requestedScale,
}: {
  action: ExportAction;
  clientExportId: string;
  requestedScale: ExportScale;
}): Promise<ExportAuthorization> {
  let response: Response;

  try {
    response = await fetch("/api/export/prepare", {
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
  } catch (error) {
    // A rejected fetch() (network drop, DNS/TLS hiccup, backgrounded tab)
    // throws a raw, unguarded TypeError that would otherwise surface as an
    // unhelpful generic "Export failed" message — far more common on
    // mobile connections than on a stable desktop connection.
    console.error("[export] prepare request failed", error);
    throw new Error(EXPORT_NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(EXPORT_AUTHORIZATION_ERROR_MESSAGE);
  }

  let payload: { authorization?: ExportAuthorization };

  try {
    payload = (await response.json()) as {
      authorization?: ExportAuthorization;
    };
  } catch (error) {
    console.error("[export] prepare response parse failed", error);
    throw new Error(EXPORT_AUTHORIZATION_ERROR_MESSAGE);
  }

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

const EXPORT_NODE_MOUNT_TIMEOUT_MS = 5000;

export function ExportProvider({ children }: ExportProviderProps) {
  const exportNodeRef = useRef<HTMLDivElement | null>(null);
  const exportNodeReadyResolversRef = useRef<
    Array<(node: HTMLDivElement) => void>
  >([]);
  const isExportInFlightRef = useRef(false);
  // The hidden full-size renderer is expensive (it repaints the whole artwork
  // on every edit and doubles image memory on mobile), so it is only mounted
  // while an export is actually running.
  const [isExportNodeActive, setIsExportNodeActive] = useState(false);
  const uploadedImage = useEditorStore((state) => state.uploadedImage);
  const canvasWidth = useEditorStore((state) => state.canvasWidth);
  const canvasHeight = useEditorStore((state) => state.canvasHeight);
  const exportScale = useEditorStore((state) => state.exportScale);
  const exportFileName = useEditorStore((state) => state.exportFileName);
  const setIsExporting = useEditorStore((state) => state.setIsExporting);
  const markExported = useEditorStore((state) => state.markExported);

  const handleExportNodeRef = useCallback((node: HTMLDivElement | null) => {
    exportNodeRef.current = node;

    if (!node) {
      return;
    }

    const resolvers = exportNodeReadyResolversRef.current;

    exportNodeReadyResolversRef.current = [];
    resolvers.forEach((resolve) => resolve(node));
  }, []);

  const acquireExportNode = useCallback(() => {
    const exportNode = exportNodeRef.current;

    if (exportNode) {
      return Promise.resolve(exportNode);
    }

    return new Promise<HTMLDivElement>((resolve, reject) => {
      const handleNodeReady = (node: HTMLDivElement) => {
        window.clearTimeout(timeoutId);
        resolve(node);
      };
      const timeoutId = window.setTimeout(() => {
        exportNodeReadyResolversRef.current =
          exportNodeReadyResolversRef.current.filter(
            (resolver) => resolver !== handleNodeReady,
          );
        reject(new Error("No artwork is ready to export."));
      }, EXPORT_NODE_MOUNT_TIMEOUT_MS);

      exportNodeReadyResolversRef.current.push(handleNodeReady);
    });
  }, []);

  const runExportTask = useCallback(
    async (task: (exportNode: HTMLDivElement) => Promise<void>) => {
      if (isExportInFlightRef.current) {
        throw new Error("Export already in progress.");
      }

      if (!uploadedImage) {
        throw new Error("No artwork is ready to export.");
      }

      isExportInFlightRef.current = true;
      setIsExporting(true);
      setIsExportNodeActive(true);

      try {
        const exportNode = await acquireExportNode();

        await task(exportNode);
        markExported();
      } catch (error) {
        setIsExporting(false);
        throw error;
      } finally {
        setIsExportNodeActive(false);
        isExportInFlightRef.current = false;
      }
    },
    [acquireExportNode, markExported, setIsExporting, uploadedImage],
  );

  const exportCurrentPng = useCallback(async () => {
    await runExportTask(async (exportNode) => {
      const clientExportId = createClientExportId();
      const authorization = await prepareExport({
        action: "download",
        clientExportId,
        requestedScale: exportScale,
      });
      const outputScale =
        getSafeExportScale(canvasWidth, canvasHeight, exportScale) ??
        exportScale;
      const outputSize = getExportPixelSize(
        canvasWidth,
        canvasHeight,
        outputScale,
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
    runExportTask,
  ]);

  const copyCurrentPng = useCallback(async () => {
    await runExportTask(async (exportNode) => {
      const clientExportId = createClientExportId();
      const authorization = await prepareExport({
        action: "copy",
        clientExportId,
        requestedScale: exportScale,
      });
      const outputScale =
        getSafeExportScale(canvasWidth, canvasHeight, exportScale) ??
        exportScale;
      const outputSize = getExportPixelSize(
        canvasWidth,
        canvasHeight,
        outputScale,
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
      {uploadedImage && isExportNodeActive && (
        <ExportRenderer
          ref={handleExportNodeRef}
          uploadedImage={uploadedImage}
        />
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
