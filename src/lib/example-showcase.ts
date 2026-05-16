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
};

export const EXAMPLE_SHOWCASE_ITEMS = [
  {
    id: "product-hunt-launch",
    title: "Product Hunt launch",
    badge: "PRODUCT HUNT",
    description: "A bold launch graphic with warm gradients and browser chrome.",
    background:
      "linear-gradient(135deg, #ff6154 0%, #ff8a3d 52%, #fff1d6 100%)",
    textColor: "dark",
    frameTheme: "light",
    layout: "launch",
    tilt: "left",
  },
  {
    id: "saas-dashboard",
    title: "SaaS dashboard",
    badge: "DASHBOARD",
    description: "Dark, premium depth for analytics and admin product shots.",
    background:
      "radial-gradient(circle at 20% 16%, #6366f1 0%, transparent 28%), radial-gradient(circle at 80% 72%, #ec4899 0%, transparent 30%), linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    textColor: "light",
    frameTheme: "dark",
    layout: "dashboard",
    tilt: "right",
  },
  {
    id: "founder-update",
    title: "Founder update",
    badge: "BUILD LOG",
    description: "A story-led post for weekly progress and public shipping.",
    background:
      "radial-gradient(circle at 16% 18%, #22d3ee 0%, transparent 30%), linear-gradient(135deg, #111827 0%, #312e81 100%)",
    textColor: "light",
    frameTheme: "dark",
    layout: "post",
    tilt: "left",
  },
  {
    id: "linkedin-product-post",
    title: "LinkedIn product post",
    badge: "PRODUCT UPDATE",
    description: "A clean professional post with readable headline space.",
    background:
      "linear-gradient(135deg, #fff7ed 0%, #fed7aa 52%, #fbcfe8 100%)",
    textColor: "dark",
    frameTheme: "light",
    layout: "post",
    tilt: "flat",
  },
  {
    id: "mobile-app-story",
    title: "Mobile app story",
    badge: "STORY",
    description: "Vertical app-style composition for story and reel formats.",
    background:
      "radial-gradient(circle at 18% 18%, #bef264 0%, transparent 32%), radial-gradient(circle at 82% 20%, #22d3ee 0%, transparent 30%), linear-gradient(135deg, #052e16 0%, #111827 100%)",
    textColor: "light",
    frameTheme: "dark",
    layout: "mobile",
    tilt: "right",
  },
  {
    id: "changelog-announcement",
    title: "Changelog announcement",
    badge: "CHANGELOG",
    description: "A release-note visual for new features and product fixes.",
    background:
      "linear-gradient(135deg, #082f49 0%, #0284c7 46%, #bae6fd 100%)",
    textColor: "light",
    frameTheme: "light",
    layout: "changelog",
    tilt: "left",
  },
] as const satisfies readonly ExampleShowcaseItem[];
