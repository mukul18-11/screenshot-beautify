# AGENTS.md

Every LLM/Codex agent working in this repo should read this file before editing.
Keep it current as the product, structure, commands, dependencies, or conventions change.

## Project Name

Screenshot Beautifier

## Product Goal

Build a fast, premium screenshot beautifier for founders, builders, indie hackers, SaaS makers, and creators.

Core promise:

> Upload or paste a boring screenshot, make it look launch-ready in seconds, then export it for X, LinkedIn, landing pages, Product Hunt, pitch decks, and marketing posts.

The product should feel simple, polished, fast, and premium. Avoid turning it into a complex Figma clone.

## Current Build Phase

Phase 1 is completed and should not be rebuilt unless explicitly requested. It includes:

- Drag and drop image upload
- Browse file upload
- Paste screenshot from clipboard
- Replace image
- Remove image
- Preview uploaded image
- Show image metadata
- Clean animated upload UI
- Client-side only image handling

Phase 2 is completed and should not be rebuilt unless explicitly requested. It includes:

- Canvas size presets
- Background presets
- Padding control
- Border radius control
- Shadow controls
- Screenshot scale control
- Reset controls
- Premium responsive editor UI

We are currently building Phase 3: Browser Frame and Text Overlays. Phase 3 scope:

- Browser frame
- Browser frame toggle
- Browser frame style controls
- Text overlays
- Headline, subtitle, and badge text
- Text position controls
- Text layout presets
- Premium responsive editor UI polish

Do not build these yet unless explicitly asked:

- Export
- 3D tilt
- Video/GIF export
- Auth
- Payments
- Backend APIs
- LLM APIs

## Non-Negotiable Product Principles

1. Speed first: the first successful upload should feel instant. Do not add unnecessary steps before showing the preview.
2. Beautiful defaults: the default UI should already look premium. Avoid plain unstyled upload boxes.
3. Privacy first: uploaded screenshots must stay in the browser during the MVP. Show trust copy such as "Your screenshot never leaves your browser."
4. No LLM dependency: do not add OpenAI, Anthropic, Gemini, or any other LLM API. The product must work without an AI key.
5. Keep the codebase clean: build small components and avoid mixing UI, state, validation, and file processing in one component.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- Motion for React using `motion/react`
- Zustand for editor state
- react-dropzone for drag/drop and browse upload
- npm as the package manager

Keep `package-lock.json` as the single lockfile unless the project is intentionally migrated later. Do not mix npm and pnpm installs in this working tree. Do not add a production dependency unless it clearly improves the current task.

## Next.js Security Rule

Use the latest stable patched Next.js version available in the project and do not downgrade Next.js.

Never use versions affected by the middleware authorization bypass vulnerability CVE-2025-29927. Safe minimum versions include:

- Next.js 12.3.5+
- Next.js 13.5.9+
- Next.js 14.2.25+
- Next.js 15.2.3+
- Any newer maintained major version with security patches

Do not rely on Next.js middleware as the only protection for private routes or sensitive actions. For this MVP, keep screenshot processing client-side and avoid backend auth unless explicitly requested.

## Recommended Project Structure

Use this structure for the current upload, canvas controls, and Phase 3 controls:

```txt
src/
  app/
    page.tsx
    editor/
      page.tsx

  components/
    editor/
      BeautifyPresetBar.tsx
      BrowserFrameControls.tsx
      BackgroundControls.tsx
      CanvasPreview.tsx
      UploadZone.tsx
      EmptyUploadState.tsx
      ImagePreview.tsx
      ImageMetaCard.tsx
      ImageStyleControls.tsx
      ResetControls.tsx
      ReplaceImageButton.tsx
      PasteHint.tsx
      TextOverlayControls.tsx

  hooks/
    useImageUpload.ts
    useClipboardImage.ts

  store/
    editor-store.ts

  lib/
    beautify-presets.ts
    background-presets.ts
    browser-frame-presets.ts
    canvas-presets.ts
    image-validation.ts
    image-utils.ts
    text-layout-presets.ts
    format-file-size.ts
```

## UploadedImage Data Model

The uploaded image state should use this shape:

```ts
type UploadedImage = {
  id: string;
  file: File;
  objectUrl: string;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  uploadedAt: number;
};
```

Create object URLs client-side, read natural image dimensions before storing the image, and revoke old object URLs when replacing or clearing an image.

## Zustand Store Expectations

Keep editor state small and explicit. It owns uploaded image state and editor appearance state:

- `uploadedImage: UploadedImage | null`
- `setUploadedImage(uploadedImage | null)`
- `replaceUploadedImage(uploadedImage)`
- `clearUploadedImage()`
- Phase 2 canvas state fields: `canvasPreset`, `canvasWidth`, `canvasHeight`, `background`, `imagePadding`, `imageRadius`, `imageScale`, `imageShadow`, `imageBorderEnabled`
- Canvas setting actions for preset, dimensions, background, padding, radius, scale, shadow, border, and reset
- Phase 3 browser frame state fields: `browserFrameEnabled`, `browserFrameTheme`, `browserFrameUrl`, `browserFrameShowUrl`
- Phase 3 text overlay state fields: `textOverlayEnabled`, `headlineText`, `subtitleText`, `badgeText`, `textLayoutPreset`, `textPosition`, `textAlign`, `textColor`, `headlineSize`, `subtitleSize`
- Browser frame and text overlay actions should be explicit and predictable; avoid deriving user-entered text from presets.

The store should own object URL cleanup when replacing or clearing the current image. Avoid persisting screenshot files, object URLs, or image data to local storage.

## Upload Validation Rules

- Accept PNG, JPEG/JPG, and WebP only.
- Limit uploads to one image at a time.
- Reject empty files.
- Keep the current max image size at 10 MB unless product requirements change.
- Validate dropped, browsed, pasted, and replacement files through the same shared validation path.
- Show clear, human-readable errors without exposing noisy technical details.

## Clipboard Paste Behavior

- Support paste from the global window when the user is not focused inside an input, textarea, select, or contenteditable element.
- If the clipboard contains an image file, validate and upload it immediately.
- If the clipboard has no image, show a quiet toast/message.
- Do not intercept normal text editing paste behavior.

## UI Direction

- Premium, calm, fast, and launch-ready.
- Keep the editor focused on upload/paste/replace and canvas beautification controls, not a full Figma-style editor.
- Use clean spacing, restrained glass/blur effects, sharp typography, and clear hierarchy.
- Show metadata after upload: file name, size, type, dimensions, and uploaded time.
- Keep trust/privacy copy visible near the upload action.
- Do not introduce future-phase controls until explicitly asked.
- Render browser frames and text overlays inside `CanvasPreview`, so the live preview is the source of truth rather than a separate export-only layer.

## Animation Guidelines

- Use `motion/react` for lightweight transitions.
- Animate upload state changes, drag states, preview entry, and metadata entry.
- Prefer subtle opacity, scale, and small movement transitions.
- Respect reduced motion with `useReducedMotion`.
- Avoid slow, decorative, or distracting animation that delays the preview.

## Accessibility Rules

- Browse/upload controls must be keyboard reachable.
- The upload zone should have a clear label and helper text.
- Use `aria-invalid`, `aria-describedby`, and `role="alert"` for errors where appropriate.
- Buttons need accessible names, especially icon buttons.
- Do not hide essential status or error information only in animation or color.
- Preserve normal browser behavior for inputs and editable fields.

## Component Responsibilities

- `UploadZone`: orchestrates drag/drop, browse, paste, preview/empty state switching, and error display.
- `EmptyUploadState`: presentational empty/uploading state with browse CTA and paste hint.
- `ImagePreview`: renders the canvas preview shell plus replace/remove actions.
- `CanvasPreview`: renders the uploaded image, configured canvas, browser frame, and text overlays.
- `BeautifyPresetBar`: renders one-click Phase 2 style presets that update canvas, background, and screenshot styling without changing the uploaded image.
- `CanvasPresetSelector`: renders canvas size presets.
- `BackgroundControls`: renders background presets and custom solid color controls.
- `ImageStyleControls`: renders padding, radius, scale, shadow, and border controls.
- `BrowserFrameControls`: renders Phase 3 browser frame toggle, theme, URL, and URL visibility controls.
- `TextOverlayControls`: renders Phase 3 headline, subtitle, badge, layout, position, alignment, color, and size controls.
- `ResetControls`: renders reset style controls that restore beautification defaults without changing the uploaded image.
- `ImageMetaCard`: renders uploaded image metadata only.
- `ReplaceImageButton`: small focused replace action.
- `PasteHint`: presentational clipboard hint.
- `useImageUpload`: shared upload flow, validation, dropzone wiring, loading/error state, and store updates.
- `useClipboardImage`: clipboard event handling only.
- `beautify-presets.ts`: one-click style preset data and helpers.
- `background-presets.ts`: background preset data and helpers.
- `canvas-presets.ts`: canvas size preset data and helpers.
- `browser-frame-presets.ts`: browser frame theme/style data and helpers.
- `text-layout-presets.ts`: text overlay layout preset data and helpers.
- `image-validation.ts`: accepted types, size limits, and validation messages.
- `image-utils.ts`: object URL creation, image dimension reading, and `UploadedImage` creation.
- `editor-store.ts`: uploaded image state, canvas settings state, and object URL cleanup.

## Commands

Use npm:

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

Run the smallest useful verification for the change. For UI changes, prefer at least `npm run lint` and `npm run typecheck`; run `npm run build` before larger handoffs when feasible.

Only stage, commit, or push changes when the user explicitly asks for it.


## Testing Expectations

- Validate upload, replace, remove, and paste flows manually when touching upload behavior.
- Check accepted formats: PNG, JPEG/JPG, and WebP.
- Check rejection states for unsupported type, too-large file, empty file, and multiple-file drops.
- Confirm old previews are cleaned up when images are replaced or removed.
- For visual/UI changes, test desktop and mobile responsive layouts.
- Do not open localhost or inspect Chrome by default for visual checks; the user will check the local UI unless they explicitly ask Codex to do it.
- Keep automated tests focused if a test framework is added later; do not introduce one casually during the MVP.

## Security and Privacy Rules

- Screenshot files must remain in the browser during the MVP.
- Do not upload, store, log, or send screenshot data to any backend or third-party service.
- Do not add analytics, telemetry, auth, payments, or AI integrations unless explicitly requested.
- Do not store screenshots in local storage, IndexedDB, cookies, or remote storage.
- Keep file handling client-side and avoid backend APIs for the MVP.

## Current Product Roadmap Memory

- Phase 1 completed: upload, paste, replace, remove, preview, metadata, validation, and local-only handling.
- Phase 2 completed: canvas size presets, background presets, padding, border radius, shadow controls, screenshot scale, reset controls, and premium responsive editor UI.
- Phase 3 current: browser frame, browser frame controls, text overlays, text layout presets, and premium responsive UI polish.
- Future phases may include export presets, social formats, 3D tilt, templates, and export.
- Keep future-phase UI out of the product until the user explicitly asks for it.

## AGENTS.md Maintenance Rule

Codex is allowed to update `AGENTS.md` when project structure, commands, dependencies, architecture, product phase, or conventions change. Keep updates practical and concise.

When instructions become stale, inaccurate, or unnecessary, Codex should remove them instead of preserving outdated guidance. This file should describe the current project reality, not old decisions.
