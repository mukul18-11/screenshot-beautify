"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type FileRejection,
  useDropzone,
  type DropzoneOptions,
} from "react-dropzone";
import { toast } from "sonner";

import { createUploadedImage } from "@/lib/image-utils";
import {
  ACCEPTED_IMAGE_TYPES,
  validateImageFile,
} from "@/lib/image-validation";
import {
  MAX_SCREENSHOT_UPLOADS,
  useEditorStore,
  type UploadedImage,
} from "@/store/editor-store";
import { MAX_SCREENSHOT_LAYOUT_COUNT } from "@/lib/screenshot-layouts";

type UploadMode = "add" | "replace";

type UseImageUploadOptions = {
  mode?: UploadMode;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong while reading that image.";
}

function getRejectionMessage(rejection: FileRejection) {
  const fileName = rejection.file.name || "That file";
  const errorCode = rejection.errors[0]?.code;

  if (errorCode === "file-invalid-type") {
    return `${fileName} is not supported. Upload a PNG, JPEG, or WebP screenshot.`;
  }

  if (errorCode === "file-too-large") {
    return `${fileName} is too large. Choose an image under 10 MB.`;
  }

  if (errorCode === "too-many-files") {
    return `You can keep up to ${MAX_SCREENSHOT_UPLOADS} screenshots.`;
  }

  return "That file could not be uploaded. Choose a PNG, JPEG, or WebP screenshot under 10 MB.";
}

function pluralizeScreenshot(count: number) {
  return count === 1 ? "screenshot" : "screenshots";
}

function pluralizeFile(count: number) {
  return count === 1 ? "file" : "files";
}

function createSkippedMessage({
  addedCount,
  failedCount,
  limitSkippedCount,
  mode,
  replaced,
}: {
  addedCount: number;
  failedCount: number;
  limitSkippedCount: number;
  mode: UploadMode;
  replaced: boolean;
}) {
  const parts: string[] = [];

  if (replaced) {
    parts.push("Replaced the active screenshot.");
  } else if (addedCount > 0) {
    parts.push(`Added ${addedCount} ${pluralizeScreenshot(addedCount)}.`);
  }

  if (failedCount > 0) {
    parts.push(
      `Skipped ${failedCount} ${pluralizeFile(
        failedCount,
      )}: upload PNG, JPEG, or WebP images under 10 MB.`,
    );
  }

  if (limitSkippedCount > 0) {
    parts.push(
      `Skipped ${limitSkippedCount} ${pluralizeFile(
        limitSkippedCount,
      )} because this session can keep up to ${MAX_SCREENSHOT_UPLOADS} screenshots.`,
    );
  }

  if (mode === "replace" && addedCount === 0 && failedCount === 0) {
    parts.push("Choose one PNG, JPEG, or WebP image to replace the active screenshot.");
  }

  return parts.join(" ");
}

function createLayoutLimitMessage(totalCount: number) {
  if (totalCount <= MAX_SCREENSHOT_LAYOUT_COUNT) {
    return "";
  }

  return `Auto layouts support up to ${MAX_SCREENSHOT_LAYOUT_COUNT} screenshots. The rest are kept in the tray for manual placement.`;
}

export function useImageUpload({ mode = "add" }: UseImageUploadOptions = {}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isMountedRef = useRef(false);
  const uploadRequestIdRef = useRef(0);
  const screenshots = useEditorStore((state) => state.screenshots);
  const activeScreenshotId = useEditorStore((state) => state.activeScreenshotId);
  const uploadedImage = useEditorStore((state) => state.uploadedImage);
  const addUploadedImages = useEditorStore((state) => state.addUploadedImages);
  const replaceUploadedImage = useEditorStore(
    (state) => state.replaceUploadedImage,
  );
  const clearUploadedImage = useEditorStore((state) => state.clearUploadedImage);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const showError = useCallback((message: string) => {
    if (!isMountedRef.current) {
      return;
    }

    setErrorMessage(message);
    toast.error(message);
  }, []);

  const clearError = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }

    setErrorMessage(null);
  }, []);

  const uploadFiles = useCallback(
    async (files: File[] | FileList) => {
      if (!isMountedRef.current) {
        return;
      }

      clearError();

      const fileList = Array.from(files);

      if (!fileList.length) {
        return;
      }

      const state = useEditorStore.getState();
      const availableSlots =
        mode === "add"
          ? Math.max(0, MAX_SCREENSHOT_UPLOADS - state.screenshots.length)
          : 1;

      if (availableSlots <= 0) {
        showError(
          `You can keep up to ${MAX_SCREENSHOT_UPLOADS} screenshots. Remove one before adding another.`,
        );
        return;
      }

      const validFiles: File[] = [];
      let failedCount = 0;

      fileList.forEach((file) => {
        const validation = validateImageFile(file);

        if (validation.valid) {
          validFiles.push(file);
        } else {
          failedCount += 1;
        }
      });

      const filesToRead =
        mode === "replace"
          ? validFiles.slice(0, 1)
          : validFiles.slice(0, availableSlots);
      const limitSkippedCount =
        mode === "add" ? Math.max(0, validFiles.length - filesToRead.length) : 0;

      if (!filesToRead.length) {
        const message = createSkippedMessage({
          addedCount: 0,
          failedCount,
          limitSkippedCount,
          mode,
          replaced: false,
        });

        showError(
          message ||
            "Choose a PNG, JPEG, or WebP screenshot under 10 MB.",
        );
        return;
      }

      const requestId = uploadRequestIdRef.current + 1;
      uploadRequestIdRef.current = requestId;
      setIsUploading(true);

      const uploadedImages: UploadedImage[] = [];
      let unreadableCount = 0;

      try {
        for (const file of filesToRead) {
          try {
            const image = await createUploadedImage(file);

            if (
              !isMountedRef.current ||
              requestId !== uploadRequestIdRef.current
            ) {
              URL.revokeObjectURL(image.objectUrl);
              return;
            }

            uploadedImages.push(image);
          } catch (error) {
            unreadableCount += 1;

            if (mode === "replace") {
              showError(getErrorMessage(error));
              return;
            }
          }
        }

        if (!isMountedRef.current || requestId !== uploadRequestIdRef.current) {
          uploadedImages.forEach((image) => {
            URL.revokeObjectURL(image.objectUrl);
          });
          return;
        }

        const previousScreenshotCount = state.screenshots.length;

        if (mode === "replace") {
          const [image] = uploadedImages;

          if (image) {
            replaceUploadedImage(image);
          }
        } else {
          addUploadedImages(uploadedImages);
        }

        const layoutLimitMessage =
          mode === "add"
            ? createLayoutLimitMessage(
                previousScreenshotCount + uploadedImages.length,
              )
            : "";
        const skippedMessage = createSkippedMessage({
          addedCount: mode === "add" ? uploadedImages.length : 0,
          failedCount: failedCount + unreadableCount,
          limitSkippedCount,
          mode,
          replaced: mode === "replace" && uploadedImages.length > 0,
        });

        if (skippedMessage && (failedCount > 0 || unreadableCount > 0 || limitSkippedCount > 0)) {
          showError(skippedMessage);
        }

        if (layoutLimitMessage) {
          toast.info(layoutLimitMessage);
        }
      } finally {
        if (
          isMountedRef.current &&
          requestId === uploadRequestIdRef.current
        ) {
          setIsUploading(false);
        }
      }
    },
    [
      addUploadedImages,
      clearError,
      mode,
      replaceUploadedImage,
      showError,
    ],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      await uploadFiles([file]);
    },
    [uploadFiles],
  );

  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    (acceptedFiles) => {
      void uploadFiles(acceptedFiles);
    },
    [uploadFiles],
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (!fileRejections.length) {
        return;
      }

      if (fileRejections.length === 1) {
        const [rejection] = fileRejections;

        if (rejection) {
          showError(getRejectionMessage(rejection));
        }
        return;
      }

      showError(
        `Skipped ${fileRejections.length} ${pluralizeFile(
          fileRejections.length,
        )}. Upload PNG, JPEG, or WebP screenshots under 10 MB.`,
      );
    },
    [showError],
  );

  const dropzone = useDropzone({
    multiple: mode === "add",
    noClick: true,
    onDrop,
    onDropRejected,
  });

  return useMemo(
    () => ({
      ...dropzone,
      accept: ACCEPTED_IMAGE_TYPES.join(","),
      activeScreenshotId,
      clearError,
      clearUploadedImage,
      errorMessage,
      isUploading,
      screenshots,
      uploadFile,
      uploadFiles,
      uploadedImage,
    }),
    [
      activeScreenshotId,
      clearUploadedImage,
      clearError,
      dropzone,
      errorMessage,
      isUploading,
      screenshots,
      uploadFile,
      uploadFiles,
      uploadedImage,
    ],
  );
}
