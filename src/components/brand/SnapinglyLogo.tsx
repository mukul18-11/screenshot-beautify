import Image from "next/image";

import { cn } from "@/lib/utils";

type SnapinglyMarkProps = {
  size?: number;
  /** Retained for API compatibility; the brand illustration carries its own styling. */
  withTile?: boolean;
  className?: string;
};

export function SnapinglyMark({ size = 36, className }: SnapinglyMarkProps) {
  return (
    <Image
      src="/snapingly-logo.png"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      priority
    />
  );
}

type SnapinglyLogoProps = {
  size?: "sm" | "md";
  className?: string;
};

export function SnapinglyLogo({ size = "sm", className }: SnapinglyLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center",
        size === "sm" ? "gap-2.5" : "gap-3",
        className,
      )}
    >
      <SnapinglyMark
        size={size === "sm" ? 32 : 36}
        className="shrink-0 drop-shadow-[0_2px_8px_rgba(2,6,23,0.22)]"
      />
      <span
        className={cn(
          "truncate font-display font-bold tracking-tight",
          size === "sm" ? "text-[15px]" : "text-base",
        )}
      >
        Snapingly
      </span>
    </span>
  );
}
