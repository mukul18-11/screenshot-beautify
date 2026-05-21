"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type FileRejection,
  useDropzone,
  type DropzoneOptions,
} from "react-dropzone";
import { toast } from "sonner";

import { formatFileSize } from "@/lib/format-file-size";
import { createUploadedImage } from "@/lib/image-utils";
import {
  ACCEPTED_IMAGE_DROPZONE,
  MAX_IMAGE_SIZE_BYTES,
  validateImageFile,
} from "@/lib/image-validation";
import { useEditorStore } from "@/store/editor-store";

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
    return `${fileName} is ${formatFileSize(rejection.file.size)}. Choose an image under 10 MB.`;
  }

  if (errorCode === "too-many-files") {
    return "Upload one screenshot at a time.";
  }

  return "That file could not be uploaded. Choose a PNG, JPEG, or WebP screenshot under 10 MB.";
}

export function useImageUpload() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isMountedRef = useRef(false);
  const uploadRequestIdRef = useRef(0);
  const uploadedImage = useEditorStore((state) => state.uploadedImage);
  const replaceUploadedImage = useEditorStore(
    (state) => state.replaceUploadedImage,
  );
  const clearUploadedImage = useEditorStore((state) => state.clearUploadedImage);
  const resetEditorForNewUpload = useEditorStore(
    (state) => state.resetEditorForNewUpload,
  );

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

  const uploadFile = useCallback(
    async (file: File) => {
      if (!isMountedRef.current) {
        return;
      }

      clearError();

      const validation = validateImageFile(file);

      if (!validation.valid) {
        showError(validation.message);
        return;
      }

      const requestId = uploadRequestIdRef.current + 1;
      uploadRequestIdRef.current = requestId;
      setIsUploading(true);

      try {
        const image = await createUploadedImage(file);

        if (
          !isMountedRef.current ||
          requestId !== uploadRequestIdRef.current
        ) {
          URL.revokeObjectURL(image.objectUrl);
          return;
        }

        // Read current image from the store imperatively to avoid adding
        // uploadedImage to the dependency array (which would recreate this
        // callback on every upload and cascade re-renders).
        const currentImage = useEditorStore.getState().uploadedImage;

        if (!currentImage) {
          resetEditorForNewUpload();
        }

        replaceUploadedImage(image);
      } catch (error) {
        if (requestId === uploadRequestIdRef.current) {
          showError(getErrorMessage(error));
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
    [clearError, replaceUploadedImage, resetEditorForNewUpload, showError],
  );

  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    (acceptedFiles) => {
      const [file] = acceptedFiles;

      if (file) {
        void uploadFile(file);
      }
    },
    [uploadFile],
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const [rejection] = fileRejections;

    if (rejection) {
      showError(getRejectionMessage(rejection));
    }
  }, [showError]);

  const dropzone = useDropzone({
    accept: ACCEPTED_IMAGE_DROPZONE,
    maxFiles: 1,
    maxSize: MAX_IMAGE_SIZE_BYTES,
    multiple: false,
    noClick: true,
    onDrop,
    onDropRejected,
  });

  return useMemo(
    () => ({
      ...dropzone,
      clearError,
      clearUploadedImage,
      errorMessage,
      isUploading,
      uploadFile,
      uploadedImage,
    }),
    [
      clearUploadedImage,
      clearError,
      dropzone,
      errorMessage,
      isUploading,
      uploadFile,
      uploadedImage,
    ],
  );
}
