import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Snapingly — turn screenshots into launch-ready visuals";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const markData = await readFile(
    join(process.cwd(), "public", "snapingly-logo.png"),
  );
  const markSrc = `data:image/png;base64,${markData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 16% 12%, rgba(45, 212, 191, 0.22), transparent 32%), radial-gradient(circle at 86% 16%, rgba(34, 211, 238, 0.18), transparent 30%), radial-gradient(circle at 78% 92%, rgba(99, 102, 241, 0.24), transparent 36%), linear-gradient(135deg, #060b16 0%, #0b1220 55%, #111827 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 64,
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 120,
            right: 120,
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(34,211,238,0.7), transparent)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 20,
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            <img src={markSrc} width={72} height={72} alt="" />
            Snapingly
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.04,
              maxWidth: 900,
            }}
          >
            Turn screenshots into launch-ready visuals
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.72)",
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              maxWidth: 860,
            }}
          >
            Quick styles, browser frames, text overlays, 3D depth, and sharp PNG
            export. Everything runs in your browser.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
