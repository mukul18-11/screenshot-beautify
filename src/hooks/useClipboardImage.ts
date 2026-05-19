"use client";

import { useEffect } from "react";

type UploadClipboardFile = (
  file: File,
  options?: { successMessage?: string },
) => Promise<void>;

type UseClipboardImageOptions = {
  enabled?: boolean;
  uploadFile: UploadClipboardFile;
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  const editableParent = target.closest("[contenteditable]");

  return (
    target.isContentEditable ||
    (editableParent instanceof HTMLElement &&
      editableParent.contentEditable !== "false") ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

function getImageFileFromClipboard(event: ClipboardEvent) {
  const items = event.clipboardData?.items;

  if (!items?.length) {
    return null;
  }

  const imageItem = Array.from(items).find(
    (item) => item.kind === "file" && item.type.startsWith("image/"),
  );

  return imageItem?.getAsFile() ?? null;
}

export function useClipboardImage({
  enabled = true,
  uploadFile,
}: UseClipboardImageOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handlePaste = (event: ClipboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      const file = getImageFileFromClipboard(event);

      if (!file) {
        return;
      }

      void uploadFile(file, { successMessage: "Screenshot pasted" });
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [enabled, uploadFile]);
}
