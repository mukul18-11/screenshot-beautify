"use client";

import { Clock3, FileImage, FileType2, HardDrive, Ruler } from "lucide-react";
import { motion } from "motion/react";

import { formatFileSize } from "@/lib/format-file-size";
import type { UploadedImage } from "@/store/editor-store";

type ImageMetaCardProps = {
  uploadedImage: UploadedImage;
};

function getUploadedTimeLabel(uploadedAt: number) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - uploadedAt) / 1000));

  if (elapsedSeconds < 60) {
    return "Just now";
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  return `${elapsedHours} hr ago`;
}

function getReadableFileType(type: string) {
  if (type === "image/jpeg") {
    return "JPEG";
  }

  return type.replace("image/", "").toUpperCase();
}

export default function ImageMetaCard({ uploadedImage }: ImageMetaCardProps) {
  const metaItems = [
    {
      icon: HardDrive,
      label: "File size",
      value: formatFileSize(uploadedImage.size),
    },
    {
      icon: Ruler,
      label: "Dimensions",
      value: `${uploadedImage.width} × ${uploadedImage.height}`,
    },
    {
      icon: FileType2,
      label: "File type",
      value: getReadableFileType(uploadedImage.type),
    },
    {
      icon: Clock3,
      label: "Uploaded",
      value: getUploadedTimeLabel(uploadedImage.uploadedAt),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="pt-5"
    >
      <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-slate-900/10 backdrop-blur-xl">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <FileImage className="h-6 w-6" aria-hidden="true" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Screenshot loaded
        </p>
        <h3 className="mt-2 break-words text-lg font-semibold leading-6 text-slate-950">
          {uploadedImage.name}
        </h3>

        <div className="mt-5 space-y-3">
          {metaItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-white/65 px-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                </div>
                <p className="shrink-0 text-right text-sm font-semibold text-slate-800">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
