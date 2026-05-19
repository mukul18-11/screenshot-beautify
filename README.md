# Screenshot Beautifier

<p align="center">
  <strong>Turn plain screenshots into launch-ready visuals for X, LinkedIn, Product Hunt, landing pages, and pitch decks.</strong>
</p>

<p align="center">
  <a href="#features">Features</a>
  ·
  <a href="#quick-start">Quick Start</a>
  ·
  <a href="#project-structure">Project Structure</a>
  ·
  <a href="#privacy-first">Privacy</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white">
</p>

---

## Overview

Screenshot Beautifier is a fast, premium, client-side editor for transforming raw product screenshots into polished marketing graphics. Upload or paste a screenshot, apply a quick style, tune the frame, background, depth, text, and export a sharp PNG.

The goal is simple: make screenshots feel shipped without turning the product into a design tool.

## Features

- **Instant upload flow**: drag, browse, replace, remove, or paste screenshots.
- **Local-first image handling**: screenshots stay in the browser during the MVP.
- **Quick styles**: polished presets for canvas, background, and screenshot styling.
- **Canvas presets**: create visuals for social posts, launches, decks, and hero graphics.
- **Premium backgrounds**: gradients, mesh-style looks, solids, and screenshot blur.
- **Browser frames**: macOS and minimal browser chrome options.
- **Text overlays**: add launch headlines, badges, and supporting copy.
- **CSS 3D tilt**: tasteful depth, perspective, rotation, and hover movement without WebGL.
- **PNG export**: export clean, high-resolution artwork at multiple scales.
- **Responsive editor**: built for a focused desktop workflow with polished mobile behavior.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and start beautifying.

## Scripts

```bash
npm run dev        # Start the local development server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
npm run build      # Create a production build
```

## Tech Stack

- **Framework**: Next.js App Router
- **Language**: TypeScript
- **UI**: Tailwind CSS, shadcn/ui, lucide-react
- **Motion**: `motion/react`
- **State**: Zustand
- **Upload**: react-dropzone plus clipboard paste handling
- **Export**: hidden high-resolution renderer with browser-side PNG generation

## Project Structure

```text
src/
  app/
    page.tsx              # Landing page
    editor/page.tsx       # Editor route
    layout.tsx            # Global metadata and shell
  components/
    editor/               # Upload, preview, quick styles, tilt, text, export
    landing/              # Hero, examples, features, FAQ, CTA
    ui/                   # Shared UI primitives
  hooks/                  # Upload and clipboard hooks
  lib/                    # Presets, defaults, validation, export helpers
  store/                  # Zustand editor store
  types/                  # Shared editor types
```

## Privacy First

Screenshot Beautifier is designed around a local-first workflow:

- No account required.
- No backend upload flow.
- No analytics or telemetry required for the editor.
- No AI or LLM dependency.
- Uploaded image data and object URLs are not persisted to localStorage, IndexedDB, cookies, or third-party services.

## Supported Images

- PNG
- JPEG / JPG
- WebP

Maximum upload size: **10 MB**.

## Product Direction

This project is intentionally focused. It should feel fast, polished, and premium, not like a full design suite.

Current polish areas include:

- stronger onboarding and empty states
- refined quick styles
- landing page examples and FAQ
- final launch-ready UI details

Out of scope unless explicitly added later:

- authentication
- payments
- databases
- backend APIs
- saved projects
- share links
- analytics
- AI image generation
- GIF or video export
- Three.js or WebGL rendering

## Development Notes

- Use npm as the package manager.
- Keep `package-lock.json` as the single lockfile.
- Keep edits scoped to the feature being changed.
- Prefer existing presets, helpers, and store actions before adding new abstractions.
- Run the smallest useful verification for each change.

## License

Private project.
