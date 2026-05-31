"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  getDeviceMockup,
  getDeviceMockupVariant,
  isPhysicalDeviceMockup,
} from "@/lib/device-mockups";
import { cn } from "@/lib/utils";
import type { DeviceMockup, DeviceMockupId } from "@/types/editor";

type DeviceFrameProps = {
  children: ReactNode;
  className?: string;
  mockupId: DeviceMockupId;
  shadow?: string;
  variantId: string | null;
};

type DeviceScreenProps = {
  children: ReactNode;
  className?: string;
  mockup: DeviceMockup;
  radius: string;
  style?: CSSProperties;
  variantId: string | null;
};

function combineShadow(shadow: string | undefined, frameShadow: string) {
  if (!shadow || shadow === "none") {
    return frameShadow;
  }

  return `${shadow}, ${frameShadow}`;
}

function DeviceScreen({
  children,
  className,
  mockup,
  radius,
  style,
  variantId,
}: DeviceScreenProps) {
  const variant = getDeviceMockupVariant(mockup.id, variantId);

  return (
    <div
      className={cn("relative overflow-hidden bg-black", className)}
      style={{
        aspectRatio: `${mockup.screenWidth} / ${mockup.screenHeight}`,
        border: `1px solid ${variant.screenBorder}`,
        borderRadius: radius,
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 28px rgba(0,0,0,0.38)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PhoneFrame({
  children,
  className,
  mockup,
  shadow,
  variantId,
}: DeviceFrameProps & { mockup: DeviceMockup }) {
  const variant = getDeviceMockupVariant(mockup.id, variantId);

  return (
    <div className={cn("relative w-full", className)}>
      <span
        aria-hidden="true"
        className="absolute left-[-1.8%] top-[18%] h-[12%] w-[1.2%] rounded-l-full"
        style={{ background: variant.edge }}
      />
      <span
        aria-hidden="true"
        className="absolute right-[-1.8%] top-[28%] h-[18%] w-[1.2%] rounded-r-full"
        style={{ background: variant.edge }}
      />
      <div
        className="relative overflow-hidden p-[3.4%]"
        style={{
          background: variant.frame,
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "13.5% / 6.1%",
          boxShadow: combineShadow(
            shadow,
            "inset 0 0 0 1px rgba(255,255,255,0.14), inset 0 -24px 42px rgba(0,0,0,0.22)",
          ),
        }}
      >
        <div
          className="pointer-events-none absolute inset-[1.4%] rounded-[inherit]"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.28), transparent 22%, transparent 72%, rgba(255,255,255,0.12))",
          }}
          aria-hidden="true"
        />
        <DeviceScreen
          mockup={mockup}
          radius="10.5% / 4.8%"
          variantId={variantId}
        >
          {children}
        </DeviceScreen>
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[5.5%] z-20 h-[3.2%] w-[28%] -translate-x-1/2 rounded-full bg-black/92 shadow-[0_2px_7px_rgba(255,255,255,0.12)]"
        />
      </div>
    </div>
  );
}

function TabletFrame({
  children,
  className,
  mockup,
  shadow,
  variantId,
}: DeviceFrameProps & { mockup: DeviceMockup }) {
  const variant = getDeviceMockupVariant(mockup.id, variantId);

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="relative overflow-hidden p-[3.1%]"
        style={{
          background: variant.frame,
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "7.2% / 5.2%",
          boxShadow: combineShadow(
            shadow,
            "inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 -28px 52px rgba(0,0,0,0.24)",
          ),
        }}
      >
        <DeviceScreen
          mockup={mockup}
          radius="4.8% / 3.6%"
          variantId={variantId}
        >
          {children}
        </DeviceScreen>
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[2.1%] z-20 h-[1.2%] w-[1.8%] -translate-x-1/2 rounded-full bg-black/80 ring-1 ring-white/15"
        />
      </div>
    </div>
  );
}

function LaptopFrame({
  children,
  className,
  mockup,
  shadow,
  variantId,
}: DeviceFrameProps & { mockup: DeviceMockup }) {
  const variant = getDeviceMockupVariant(mockup.id, variantId);

  // Dynamic metallic base gradients and shadow colors matching specific Apple laptop finishes
  const getBaseColors = (id: string) => {
    switch (id) {
      case "midnight":
        return {
          baseBg: "linear-gradient(180deg, #3d4659 0%, #151a24 15%, #0f1115 50%, #060709 100%)",
          grooveBg: "rgba(0, 0, 0, 0.48)",
          shadow: "rgba(0, 0, 0, 0.55)",
          highlight: "rgba(255, 255, 255, 0.08)",
        };
      case "space-gray":
      case "graphite":
        return {
          baseBg: "linear-gradient(180deg, #7c8188 0%, #46484c 15%, #303135 50%, #17181a 100%)",
          grooveBg: "rgba(0, 0, 0, 0.42)",
          shadow: "rgba(0, 0, 0, 0.45)",
          highlight: "rgba(255, 255, 255, 0.15)",
        };
      case "starlight":
        return {
          baseBg: "linear-gradient(180deg, #f4eee2 0%, #c9c0b0 15%, #a69e90 50%, #6f685a 100%)",
          grooveBg: "rgba(0, 0, 0, 0.35)",
          shadow: "rgba(42, 35, 25, 0.35)",
          highlight: "rgba(255, 255, 255, 0.25)",
        };
      case "blue":
        return {
          baseBg: "linear-gradient(180deg, #dce8f5 0%, #a2b8cc 15%, #778ea2 50%, #425262 100%)",
          grooveBg: "rgba(0, 0, 0, 0.38)",
          shadow: "rgba(10, 20, 35, 0.4)",
          highlight: "rgba(255, 255, 255, 0.28)",
        };
      case "silver":
      default:
        return {
          baseBg: "linear-gradient(180deg, #ffffff 0%, #bdc3cc 15%, #9ba1a9 50%, #5f636a 100%)",
          grooveBg: "rgba(0, 0, 0, 0.25)",
          shadow: "rgba(0, 0, 0, 0.25)",
          highlight: "rgba(255, 255, 255, 0.5)",
        };
    }
  };

  const colors = getBaseColors(variant.id);

  return (
    <div className={cn("relative w-full pb-[5.8%]", className)}>
      {/* Premium MacBook display lid featuring high-end thin metallic border and pure black glass bezel */}
      <div
        className="relative mx-auto w-[88%] overflow-hidden p-[1.8%]"
        style={{
          backgroundColor: "#09090b", // Gorgeous premium black glass bezel
          border: `2px solid ${variant.edge}`, // Thin colored metallic outer edge matching laptop finish
          outline: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "2.4% / 3.6%", // Sleeker, more precise modern laptop display corners
          boxShadow: combineShadow(
            shadow,
            "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -12px 24px rgba(0,0,0,0.45)",
          ),
        }}
      >
        <DeviceScreen
          mockup={mockup}
          radius="1.2% / 1.8%" // Matching the screen's rounded corners inside the glass bezel
          variantId={variantId}
        >
          {children}
        </DeviceScreen>

        {/* Premium Integrated Notch */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[1.8%] z-30 h-[3.2%] w-[12%] -translate-x-1/2 rounded-b-[5px] bg-[#09090b]"
          style={{
            boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Subtle camera lens reflection dot */}
          <span className="absolute left-1/2 top-[40%] h-[1.5px] w-[1.5px] -translate-x-1/2 rounded-full bg-[#1e293b] ring-[0.5px] ring-white/10" />
        </div>
      </div>

      {/* Exquisite Color-Matched MacBook Base Deck */}
      <div
        aria-hidden="true"
        className="absolute bottom-[1.2%] left-1/2 h-[5.4%] w-full -translate-x-1/2"
      >
        {/* Color-matched curved aluminum body */}
        <div
          className="absolute inset-x-0 top-0 h-[48%] rounded-t-[999px]"
          style={{
            background: colors.baseBg,
            boxShadow: `0 2px 1px ${colors.highlight} inset, 0 16px 28px ${colors.shadow}`,
          }}
        />
        {/* Clean hinge recess line behind base */}
        <div
          className="absolute inset-x-[12%] top-0 h-[1px]"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
          }}
        />
        {/* Precise lid opening thumb indentation cutout */}
        <div
          className="absolute left-1/2 top-0 h-[28%] w-[16%] -translate-x-1/2 rounded-b-[999px]"
          style={{
            background: colors.grooveBg,
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.4)",
          }}
        />
      </div>
    </div>
  );
}

function DesktopFrame({
  children,
  className,
  mockup,
  shadow,
  variantId,
}: DeviceFrameProps & { mockup: DeviceMockup }) {
  const variant = getDeviceMockupVariant(mockup.id, variantId);

  return (
    <div className={cn("relative w-full pb-[18%]", className)}>
      <div
        className="relative overflow-hidden p-[1.8%]"
        style={{
          background: variant.frame,
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "2.8% / 5%",
          boxShadow: combineShadow(
            shadow,
            "inset 0 0 0 1px rgba(255,255,255,0.13), inset 0 -26px 52px rgba(0,0,0,0.2)",
          ),
        }}
      >
        <DeviceScreen
          mockup={mockup}
          radius="1.5% / 2.8%"
          variantId={variantId}
        >
          {children}
        </DeviceScreen>
        <div
          aria-hidden="true"
          className="absolute inset-x-[1.8%] bottom-[1.8%] h-[8%] rounded-b-[inherit]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(15,23,42,0.22))",
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-[7.5%] left-1/2 h-[11%] w-[13%] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, rgba(100,116,139,0.75), rgba(226,232,240,0.92), rgba(100,116,139,0.75))",
          clipPath: "polygon(32% 0, 68% 0, 88% 100%, 12% 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[4.2%] left-1/2 h-[4.5%] w-[34%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(226,232,240,0.92), rgba(71,85,105,0.72))",
          boxShadow: "0 14px 22px rgba(2,6,23,0.24)",
        }}
      />
    </div>
  );
}

function WatchFrame({
  children,
  className,
  mockup,
  shadow,
  variantId,
}: DeviceFrameProps & { mockup: DeviceMockup }) {
  const variant = getDeviceMockupVariant(mockup.id, variantId);

  return (
    <div className={cn("relative w-full py-[20%]", className)}>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[31%] w-[44%] -translate-x-1/2 rounded-t-[30%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(15,23,42,0.98), rgba(75,85,99,0.92), rgba(15,23,42,0.98))",
          boxShadow: "inset 0 10px 20px rgba(255,255,255,0.08)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-[31%] w-[44%] -translate-x-1/2 rounded-b-[30%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(15,23,42,0.98), rgba(75,85,99,0.92), rgba(15,23,42,0.98))",
          boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.22)",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute right-[14%] top-1/2 z-10 h-[12%] w-[4%] -translate-y-1/2 rounded-r-full"
        style={{ background: variant.edge }}
      />
      <div
        className="relative mx-auto w-[62%] overflow-hidden p-[4.7%]"
        style={{
          background: variant.frame,
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "27% / 23%",
          boxShadow: combineShadow(
            shadow,
            "inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 -24px 40px rgba(0,0,0,0.28)",
          ),
        }}
      >
        <DeviceScreen
          mockup={mockup}
          radius="21% / 18%"
          variantId={variantId}
        >
          {children}
        </DeviceScreen>
      </div>
    </div>
  );
}

export default function DeviceFrame({
  children,
  className,
  mockupId,
  shadow,
  variantId,
}: DeviceFrameProps) {
  if (!isPhysicalDeviceMockup(mockupId)) {
    return <>{children}</>;
  }

  const mockup = getDeviceMockup(mockupId);

  if (mockup.category === "phone") {
    return (
      <PhoneFrame
        className={className}
        mockup={mockup}
        mockupId={mockupId}
        shadow={shadow}
        variantId={variantId}
      >
        {children}
      </PhoneFrame>
    );
  }

  if (mockup.category === "tablet") {
    return (
      <TabletFrame
        className={className}
        mockup={mockup}
        mockupId={mockupId}
        shadow={shadow}
        variantId={variantId}
      >
        {children}
      </TabletFrame>
    );
  }

  if (mockup.category === "laptop") {
    return (
      <LaptopFrame
        className={className}
        mockup={mockup}
        mockupId={mockupId}
        shadow={shadow}
        variantId={variantId}
      >
        {children}
      </LaptopFrame>
    );
  }

  if (mockup.category === "desktop") {
    return (
      <DesktopFrame
        className={className}
        mockup={mockup}
        mockupId={mockupId}
        shadow={shadow}
        variantId={variantId}
      >
        {children}
      </DesktopFrame>
    );
  }

  return (
    <WatchFrame
      className={className}
      mockup={mockup}
      mockupId={mockupId}
      shadow={shadow}
      variantId={variantId}
    >
      {children}
    </WatchFrame>
  );
}
