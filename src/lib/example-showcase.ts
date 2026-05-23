export type ExampleShowcaseItem = {
  id: string;
  title: string;
  badge: string;
  description: string;
  background: string;
  textColor: "dark" | "light";
  frameTheme: "dark" | "light";
  layout: "dashboard" | "launch" | "post" | "mobile" | "changelog";
  tilt: "left" | "right" | "flat";
  imagePath: string;
  showBrowserBar: boolean;
  browserTheme: "light" | "dark";
  overlayText?: string;
  overlayColor?: string;
  overlayClass?: string;
};

export const EXAMPLE_SHOWCASE_ITEMS = [
  {
    id: "payment-analytics",
    title: "SaaS Stripe-like Analytics",
    badge: "FINANCIAL DASHBOARD",
    description: "Vibrant sunset mesh gradient mockup presenting premium gross volume growth metrics in a large flat frame.",
    background:
      "radial-gradient(circle at 15% 15%, rgba(244, 63, 94, 0.95) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(251, 191, 36, 0.95) 0%, transparent 60%), linear-gradient(135deg, #6366f1 0%, #d946ef 100%)",
    textColor: "light",
    frameTheme: "light",
    layout: "dashboard",
    tilt: "right",
    imagePath: "/examples/payment_analytics.png",
    showBrowserBar: true,
    browserTheme: "light",
  },
  {
    id: "ride-camper",
    title: "Travel Retro Poster",
    badge: "PINTEREST EDIT",
    description: "Orange VW camper van with solid bold white lowercase typography and clean tall full-bleed light browser bar.",
    background:
      "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
    textColor: "dark",
    frameTheme: "light",
    layout: "mobile",
    tilt: "left",
    imagePath: "/examples/ride.png",
    showBrowserBar: true,
    browserTheme: "light",
    overlayText: "ride",
    overlayColor: "text-white",
    overlayClass: "font-black tracking-tighter text-6xl opacity-90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] select-none",
  },
  {
    id: "neon-urban-life",
    title: "Psychological Escape",
    badge: "LUSH OUTDOORS",
    description: "A serene, gorgeous photograph of a vintage bicycle on a grassy green field under a vast clear blue sky.",
    background:
      "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 65%), linear-gradient(135deg, #0f172a 0%, #020617 100%)",
    textColor: "light",
    frameTheme: "light",
    layout: "mobile",
    tilt: "flat",
    imagePath: "/examples/cycle.png",
    showBrowserBar: true,
    browserTheme: "light",
    overlayText: "Life",
    overlayColor: "text-white",
    overlayClass: "font-serif font-black tracking-tight text-7xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] select-none",
  },
  {
    id: "new-york-statue",
    title: "Classic Landmark Mockup",
    badge: "CITY TOURISM",
    description: "Bright blue New York postcard featuring custom readable sans-serif titles under light macOS window bar.",
    background:
      "linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 60%, #38bdf8 100%)",
    textColor: "dark",
    frameTheme: "light",
    layout: "mobile",
    tilt: "right",
    imagePath: "/examples/new_york.png",
    showBrowserBar: true,
    browserTheme: "light",
    overlayText: "New York",
    overlayColor: "text-white",
    overlayClass: "font-sans font-bold tracking-tight text-5xl opacity-95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] select-none",
  },
  {
    id: "breaking-bad-desert",
    title: "Cinematic Film Cover",
    badge: "PRODUCT HUNT BANNER",
    description: "Dramatically styled desert scene inside high-resolution full-length mockups with warm amber-yellow titles.",
    background:
      "linear-gradient(135deg, #111827 0%, #1f2937 40%, #030712 100%)",
    textColor: "light",
    frameTheme: "dark",
    layout: "mobile",
    tilt: "left",
    imagePath: "/examples/breaking_bad.png",
    showBrowserBar: false,
    browserTheme: "dark",
    overlayText: "Breaking Bad",
    overlayColor: "text-amber-500",
    overlayClass: "font-display font-extrabold tracking-tight text-4xl drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)] select-none",
  },
  {
    id: "x-analytics",
    title: "Twitter X Creator Analytics",
    badge: "CREATOR DASHBOARD",
    description: "Light-mode creator performance metrics and barchart dashboard framed on a soft peach gradient.",
    background:
      "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)",
    textColor: "dark",
    frameTheme: "light",
    layout: "dashboard",
    tilt: "flat",
    imagePath: "/examples/x_analytics.png",
    showBrowserBar: true,
    browserTheme: "light",
  },
  {
    id: "developer-code",
    title: "VS Code Snips",
    badge: "DEVELOPER snip",
    description: "Sleek VS Code dark editor snip with React code formatted on a soft mint gradient.",
    background:
      "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
    textColor: "dark",
    frameTheme: "dark",
    layout: "dashboard",
    tilt: "flat",
    imagePath: "/examples/code.png",
    showBrowserBar: true,
    browserTheme: "dark",
  },
] as const satisfies readonly ExampleShowcaseItem[];
