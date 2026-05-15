every llm should read this.

update this everytime accordingly 

# AGENTS.md

## Project name

Screenshot Beautifier

## Product goal

Build a fast, premium screenshot beautifier for founders, builders, indie hackers, SaaS makers, and creators.

The core promise:

> Upload or paste a boring screenshot, make it look launch-ready in seconds, then export it for X, LinkedIn, landing pages, Product Hunt, pitch decks, and marketing posts.

This product should feel simple, polished, fast, and premium. Avoid turning it into a complex Figma clone.

---

## Current build phase

We are currently building Phase 1:

### Phase 1: Upload / Paste / Replace Screenshot

Implement only:

- Drag and drop image upload
- Browse file upload
- Paste screenshot from clipboard
- Replace image
- Remove image
- Preview uploaded image
- Show image metadata
- Clean animated upload UI
- Client-side only image handling

Do not build these yet unless explicitly asked:

- Canvas editor
- Background editor
- Text editor
- 3D tilt controls
- Export system
- User accounts
- Payments
- Backend APIs
- AI features
- LLM API integrations

---

## Non-negotiable product principles

1. Speed first.
   - The first successful upload should feel instant.
   - Do not add unnecessary steps before showing the preview.

2. Beautiful defaults.
   - The default UI should already look premium.
   - Avoid plain unstyled upload boxes.

3. Privacy first.
   - Uploaded screenshots must stay in the browser during MVP.
   - Do not send images to a server.
   - Do not store screenshots remotely.
   - Show trust copy like: "Your screenshot never leaves your browser."

4. No LLM dependency.
   - Do not add OpenAI, Anthropic, Gemini, or any LLM API.
   - This product should work without any AI key.

5. Keep the codebase clean.
   - Build small components.
   - Avoid giant files.
   - Avoid mixing UI, state, validation, and file processing in one component.

---

## Tech stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- Motion for React using `motion/react`
- Zustand for editor state
- react-dropzone for drag/drop and browse upload

Package manager:

- Prefer `pnpm`.

Do not add a new production dependency unless it clearly improves the current task.

---

## Next.js security rule

Use the latest stable patched Next.js version available in the project.

Do not downgrade Next.js.

Never use versions affected by the middleware authorization bypass vulnerability CVE-2025-29927.

Safe minimum versions for that vulnerability include:

- Next.js 12.3.5+
- Next.js 13.5.9+
- Next.js 14.2.25+
- Next.js 15.2.3+
- Any newer maintained major version with security patches

Do not rely on Next.js middleware as the only protection for private routes or sensitive actions.

For this MVP, keep screenshot processing client-side and avoid backend auth unless explicitly requested.

---

## Recommended project structure

Use this structure for Phase 1:

```txt
src/
  app/
    page.tsx
    editor/
      page.tsx

  components/
    editor/
      UploadZone.tsx
      EmptyUploadState.tsx
      ImagePreview.tsx
      ImageMetaCard.tsx
      ReplaceImageButton.tsx
      PasteHint.tsx

  hooks/
    useImageUpload.ts
    useClipboardImage.ts

  store/
    editor-store.ts

  lib/
    image-validation.ts
    image-utils.ts
    format-file-size.ts