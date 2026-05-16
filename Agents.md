# AGENTS.md

Read this before editing. Keep it short, practical, and current when scope,
commands, dependencies, or architecture change.

## Project

Screenshot Beautifier is a fast, premium, client-side tool for turning plain
screenshots into launch-ready visuals for X, LinkedIn, landing pages, Product
Hunt, pitch decks, and marketing posts.

The product should feel simple, polished, fast, and premium. Do not turn it into
a Figma clone.

## Current Scope

Phases 1-5 are complete. Do not rebuild them unless explicitly asked:

- Upload, paste, replace, remove, preview, metadata, validation, local-only files.
- Canvas presets, backgrounds, padding, radius, shadow, scale, reset controls.
- Browser frame, text overlays, text layout presets, responsive editor polish.
- CSS-based 3D tilt, perspective, rotation, floating depth, hover movement.
- PNG export, clipboard copy, export scale, filename, toasts, hidden renderer.

Current phase: Phase 6, templates, onboarding, and launch polish:

- Built-in static design templates and one-click apply.
- Better first-run onboarding and empty state.
- Landing page polish, SEO metadata, examples, FAQ, and final UI polish.

Do not add unless explicitly requested: auth, payments, database, backend APIs,
analytics, telemetry, AI/LLM APIs, saved projects, user templates, remote
template storage, share links, Three.js/WebGL, GIF export, or video export.

## Product Principles

- Speed first: show the first successful upload instantly.
- Beautiful defaults: the app should look premium before customization.
- Privacy first: screenshots stay in the browser; keep trust copy visible.
- No LLM dependency: do not add OpenAI, Anthropic, Gemini, or similar APIs.
- Keep components focused; avoid mixing UI, state, validation, and processing.
- Keep future-phase controls out of the UI until requested.

## Stack And Package Rules

- Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui.
- lucide-react icons, `motion/react`, Zustand, react-dropzone.
- npm only. Keep `package-lock.json` as the single lockfile.
- Do not add production dependencies unless they clearly improve the task.
- Keep Next.js on a stable patched version. Never downgrade below versions safe
  for CVE-2025-29927: Next 15.2.3+, 14.2.25+, 13.5.9+, or 12.3.5+.

## Key Paths

- App routes: `src/app/page.tsx`, `src/app/editor/page.tsx`, metadata/SEO files
  in `src/app`.
- Editor UI: `src/components/editor/*` for upload, preview/artwork, template,
  style, tilt, text, export, reset, and metadata components.
- Landing UI: `src/components/landing/*` for hero, examples, features, FAQ,
  how-it-works, and CTA sections.
- Upload hooks: `src/hooks/useImageUpload.ts`, `src/hooks/useClipboardImage.ts`.
- Store: `src/store/editor-store.ts`.
- Shared types: `src/types/editor.ts`.
- Presets and helpers: `src/lib/*` for validation, image utils, presets,
  templates, defaults, export, examples, and tilt helpers.

## Data And Store

- `UploadedImage` lives in `src/types/editor.ts` and must include `id`, `file`,
  `objectUrl`, `name`, `size`, `type`, `width`, `height`, and `uploadedAt`.
- Create object URLs client-side and read natural dimensions before storing.
- Revoke old object URLs when replacing or clearing an image.
- Never persist files, image data, or object URLs to localStorage, IndexedDB,
  cookies, a backend, or a third party.
- Zustand owns uploaded image state and editor appearance state.
- Keep store actions explicit for upload, canvas, browser frame, text, tilt,
  export, and templates.
- Templates may update style settings only. They must not remove, replace,
  upload, persist, or mutate the uploaded image.
- Presets should not rewrite user-entered copy except when the user applies a
  design template intentionally.

## Upload And Clipboard

- Accept PNG, JPEG/JPG, and WebP only.
- Limit uploads to one image at a time.
- Reject empty files and files over 10 MB unless requirements change.
- Validate dropped, browsed, pasted, and replacement files through one path.
- Show clear human-readable errors.
- Global paste should work only when focus is not inside an input, textarea,
  select, or contenteditable element.
- Do not intercept normal text paste behavior.

## Preview, Tilt, And Export

- `CanvasPreview` and `CanvasArtwork` are the source of truth for final artwork:
  background, screenshot styling, browser frame, text overlays, and base tilt.
- Apply 3D tilt to the screenshot/browser mockup layer, not the whole canvas.
- Keep text overlays readable and avoid distortion where possible.
- Use CSS transforms for tilt; do not add Three.js or WebGL.
- Do not export the visually scaled preview.
- Export from a hidden full-resolution renderer at canvas size times export
  scale, using `html-to-image` or the existing equivalent.
- Export artwork only, not editor controls, panel chrome, metadata, loading UI,
  or hover-only states.
- Do not capture active hover tilt or pointer parallax offsets.

## UI, Motion, Accessibility

- Premium, calm, fast, launch-ready. Use clean spacing, restrained effects,
  sharp typography, and clear hierarchy.
- Keep the editor focused on upload, paste, replace, templates, and canvas
  beautification controls.
- Use lucide icons for button icons when available.
- Use `motion/react` for subtle transitions and respect reduced motion.
- Browse/upload controls must be keyboard reachable.
- Use accessible names for icon buttons.
- Use `aria-invalid`, `aria-describedby`, and `role="alert"` for errors where
  appropriate.
- Do not hide essential status or errors only in color or animation.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

- Run the smallest useful verification for the change.
- For UI changes, prefer at least `npm run lint` and `npm run typecheck`.
- Run `npm run build` before larger handoffs when feasible.
- Do not open localhost or inspect Chrome by default; the user will check UI
  unless they explicitly ask Codex to do it.
- Only stage, commit, or push when the user explicitly asks.

## Testing Expectations

- Upload changes: validate upload, replace, remove, paste, valid file types,
  unsupported type, oversized file, empty file, multi-file drop, and cleanup.
- Export changes: verify PNG at 1x, 2x, and 4x; filename handling; clipboard
  copy where supported; loading states; toasts; and no hover/parallax offsets.
- Visual changes: check desktop and mobile responsive layout.
- Do not add a test framework casually during the MVP.

## Maintenance

Codex may update this file when project reality changes. Remove stale guidance
instead of preserving old decisions.
