import { ImageResponse } from "next/og";

export const alt = "Screenshot Beautifier product mockup";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 18% 18%, rgba(45, 212, 191, 0.32), transparent 28%), radial-gradient(circle at 84% 18%, rgba(244, 114, 182, 0.28), transparent 30%), linear-gradient(135deg, #0f172a 0%, #312e81 58%, #111827 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 64,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 16,
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "white",
                borderRadius: 24,
                color: "#0f172a",
                display: "flex",
                height: 64,
                justifyContent: "center",
                width: 64,
              }}
            >
              SB
            </div>
            Screenshot Beautifier
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1.02,
              maxWidth: 880,
            }}
          >
            Turn boring screenshots into launch-ready visuals
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.78)",
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
