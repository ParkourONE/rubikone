# Stack Research — Inline Visual Editor Additions

**Domain:** Divi/Elementor-class inline visual page builder inside Next.js 16 / React 19 App Router (brownfield, stack locked)
**Researched:** 2026-04-09
**Confidence:** MEDIUM-HIGH (library choices verified against official docs / GitHub; React 19 compat verified for the load-bearing picks; some niche picks LOW)

> Scope note: framework, styling, deployment are LOCKED (Next 16.1.1 / React 19.2 / TS strict / Tailwind 4 / shadcn/ui). This file recommends ONLY the additive editor-side libraries needed for v2 of the CMS. No framework swaps. No new CSS system. No state-mgmt rewrite of public pages — editor state lives in admin-only providers.

---

## Recommended Stack

### Core Editor Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **zustand** | ^5.0.x | Editor state store (current draft tree, dirty flags, selection, hover element id, save status) | Tiny (~1.2 kB), works cleanly with React 19 + RSC (client-only store), avoids Context re-render storms that the current `admin-provider.tsx` will hit once you add per-element wrappers across 30 sections. Pmndrs maintained, mature on React 19. |
| **zundo** | ^2.3.x | Undo/redo middleware for zustand (temporal store) | <1 kB, purpose-built `temporal()` middleware. Gives you `undo()`, `redo()`, `pastStates`, `clear()`, `pause/resume` (critical: pause during programmatic loads, group keystrokes). Charkour-maintained, the de-facto choice in 2026. v2 rewrite is smaller and exposes `partialize`/`limit`/`equality` — exactly what you need to avoid recording every keystroke. |
| **immer** | ^10.1.x | Structural-sharing patches for path-based mutations | Replaces the `JSON.parse(JSON.stringify(...))` deep clone in `setNestedValue` (CONCERNS.md flagged this on the 1846-line tree). `produceWithPatches` emits JSON Patch-compatible ops you can pipe straight to debounced persistence. Zustand has first-class immer middleware. |
| **valibot** | ^1.0.x | Block manifest schemas + discriminated unions for `content.json` | The block manifest is THE central enabler (PROJECT.md line 37, CONCERNS.md "P1 — Define block manifest"). Valibot is ~90% smaller bundle than Zod, modular (tree-shakes per-schema), discriminated-union-first, and shipping admin-only means even ~5 kB matters less but the modular API maps perfectly to one schema-per-block. Zod is the safe alt — see below. |
| **@dnd-kit/core** + **@dnd-kit/sortable** | ^6.x core / ^8.x sortable | Drag-reorder primitive (block-level + later element-level) | clauderic/dnd-kit is the only seriously maintained, accessible (keyboard + screen-reader), zero-dep React DnD lib in 2026. React 19 compatible (see Version Compatibility note re: `"use client"`). PROJECT.md "Out of Scope: Drag-and-Drop auf Element-Ebene — Up/Down-Buttons reichen für v2" — so for v2 you only need this for **section reorder**, not element reorder. Install now anyway; the API is the same. |
| **isomorphic-dompurify** | ^2.x | Sanitize any HTML you ever write back to `content.json` | CONCERNS.md "XSS via editable HTML — future risk". Even though v2 is plain-text only, you must sanitize on write the moment anything becomes pasteable (browser paste injects HTML). Cheap insurance, isomorphic so it runs in your Route Handlers. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **fast-json-patch** | ^3.1.x | RFC 6902 JSON Patch generate + apply | Debounced persistence: instead of PUT-ing the entire 1846-line tree on every save (current behaviour, CONCERNS.md "Content is build-time imported"), generate patches against last-saved baseline and PATCH only the diff. Also enables conflict-aware merges with the GitHub SHA flow. Pair with immer's `produceWithPatches` (immer emits its own patch shape — convert or pick one; recommendation: emit immer patches in-memory for undo, convert to RFC 6902 only at the network boundary). |
| **browser-image-compression** | ^2.0.x | Client-side image resize/compress before upload | The current `/api/admin/upload` route accepts files up to whatever Vercel allows, then commits straight to `/public/images/`. Resizing client-side (max 2400px, 0.85 quality, target ~300 KB) before posting saves repo bloat and Vercel build minutes. Pure client lib, no canvas plumbing required. |
| **react-dropzone** | ^14.x | Drag-drop image upload zone | Inline image element editor needs a dropzone overlay. react-dropzone is the standard, React 19 compat confirmed via maintained issues, ~10 kB. Alt: native HTML drag-drop API (zero deps but you re-implement file validation). |
| **emoji-picker-react** | ^4.12.x | Emoji insertion for plain-text fields | PROJECT.md mentions emoji support implicitly via "plain-text mit emoji". Native `<input>` already accepts OS emoji picker, so this is OPTIONAL — only add if non-technical editors complain about discoverability. Lazy-load (admin-only). |
| **use-debounce** | ^10.x | Debounce per-element saves | Fire PATCH after 800ms of typing inactivity. ~1 kB hook. Alt: hand-roll with `setTimeout` in zustand action — fine, no dep needed. Recommendation: skip the dep, write 10 lines. |
| **ulid** or **nanoid** | nanoid ^5.x | Stable IDs for new content nodes | When inserting a duplicated element, you need a stable id for React keys + drag-reorder + the `NINE_MOVEMENTS` image-zip fix (CONCERNS.md "key by id"). nanoid is 130 bytes, URL-safe, sufficient. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **vitest** | Unit tests for `content-path.ts`, schema validators, undo/redo logic | CONCERNS.md "Missing Tests" — start with the path helpers and middleware. Vitest is the React 19 / Next 16 standard; faster than Jest, native ESM, zero-config with Vite. |
| **@testing-library/react** | Component tests for `EditableElement` hover toolbar, inline editing | React 19 compat in current versions (>=16.x). |
| **@valibot/to-json-schema** | Optional: convert Valibot schemas → JSON Schema for tooling/docs | Only if you ever want to publish the block manifest schema externally. Skip for v2. |

---

## Installation

```bash
# Core editor state + schema
npm install zustand zundo immer valibot

# Drag-reorder (sections in v2; elements later)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Persistence + diffing
npm install fast-json-patch nanoid

# Image upload UX
npm install react-dropzone browser-image-compression

# Security
npm install isomorphic-dompurify

# Dev
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Total runtime weight added (admin-only chunk, gzipped, rough): ~22 kB. Public bundle untouched if you keep all of this behind a dynamic import in `/admin` and inside the `EditableElement` wrapper guarded by `isEditMode`.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **zustand + zundo** | Redux Toolkit + redux-undo | RTK if you already had Redux infra (you don't) or needed time-travel devtools heavily. Zustand's bundle and ergonomics are better fit for a single-app admin editor. |
| **zustand + zundo** | useReducer + custom history stack | Fine for a 1-screen prototype. Breaks down once selection state, hover state, save status, dirty paths, and undo all coexist. Don't. |
| **immer patches for in-memory** | Mutative | Mutative claims 2-6x speed over immer. For a 1846-line JSON edited by 1-3 people, immer is fast enough and has wider ecosystem (zustand middleware ships with it). Re-evaluate only if profiling shows immer as a hot path. |
| **valibot** | **zod ^4** | Use Zod if (a) the team already knows it cold, (b) you want first-class `.openapi()` adapters, or (c) you find Valibot's pipe-based API harder to read. Zod 4 closed much of the bundle gap with `zod/mini`. Either is correct. Valibot wins on size; Zod wins on familiarity. |
| **valibot** | ArkType | ArkType is fastest at runtime and has the slickest TS inference. Less mature ecosystem, smaller community. Pick if you're schema-validation-curious; otherwise stick with Valibot/Zod. |
| **@dnd-kit** | hello-pangea/dnd (react-beautiful-dnd fork) | Only if you need react-beautiful-dnd's specific list-only API. Less flexible than dnd-kit, larger, no element-grain dragging. |
| **@dnd-kit** | react-dnd | Older, HTML5-backend-coupled, accessibility weaker, React 19 support lagged through 2025. Avoid. |
| **fast-json-patch** | rfc6902 | rfc6902 is also fine and slightly smaller. fast-json-patch has more downloads and observable-mode for live diff. Either works. |
| **browser-image-compression** | compressorjs | compressorjs is jQuery-flavoured API. Avoid. |
| **react-dropzone** | uploadthing / UploadThing | UploadThing is great for S3-style flows but you're committing to GitHub. Overkill. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Tiptap / Lexical / Slate** for v2 | PROJECT.md explicitly: "WYSIWYG Rich-Text — v2 = Plain-Text inline; Rich-Text v3". A rich-text editor changes your `content.json` schema to a doc tree (ProseMirror JSON / Lexical state) and is a 50-200 kB dep. v2 needs plain `string` fields. Defer to v3. | Plain `contentEditable` with `textContent` write-back, OR a `<textarea>` auto-grow component. The current `InlineText` approach is correct in spirit — just fix the imperative DOM bug (CONCERNS.md). |
| **react-contenteditable** (lovasoa) | Unmaintained, fights React 19's controlled-input model, well-documented bugs around cursor jumping. The current `InlineText` is already a better hand-rolled version. | Hand-rolled `contentEditable` span with uncontrolled-during-edit + sync-on-blur (matches CONCERNS.md fix for `inline-text.tsx`). |
| **react-dnd** | See Alternatives. Accessibility, React 19 support, and maintenance all weaker than dnd-kit. | @dnd-kit |
| **react-beautiful-dnd** (atlassian, original) | Officially deprecated by Atlassian. | hello-pangea fork OR (preferred) dnd-kit |
| **redux + redux-persist** for editor state | Overkill, more boilerplate, persist middleware will fight your GitHub-backed source-of-truth | zustand + zundo, persistence handled by your existing PUT/PATCH route |
| **lodash** for cloneDeep / set / get | The whole point of immer + a `content-path.ts` helper is to avoid lodash bloat (24 kB) for two functions. CONCERNS.md already calls out the deep-clone problem. | immer `produce`, custom `parsePath/getAt/setAt/insertAt/deleteAt` (already in CONCERNS.md "P1" list) |
| **JSON Schema (ajv)** for the block manifest | Heavier, weaker TS inference, no native discriminated-union DX. You're not interop-ing with external systems. | Valibot or Zod |
| **react-hook-form** for inline editing | RHF shines for traditional forms with submit buttons. Inline-editing + per-element autosave is the opposite paradigm — RHF would just sit in the way. | Direct zustand store updates with debounced persistence |
| **Yjs / Liveblocks / Automerge** | PROJECT.md "Out of Scope: Multi-User-Editing / Realtime-Kollaboration". CRDTs add 50-100 kB and a whole sync protocol you don't need for 1-3 editors. | None — last-write-wins with GitHub SHA-conflict handling (already in place) |
| **react-color / rc-color-picker** | No color editing in scope for v2. | Defer |
| **fuse.js / cmdk** for icon picker | cmdk (shadcn already supports it via Command) is reasonable IF you build the icon picker. Lucide has ~1500 icons — picker UX needs search. **Recommendation:** use shadcn's existing `<Command>` + filter Lucide's exported icon names client-side. No new dep. | shadcn `<Command>` |

---

## Stack Patterns by Variant

**If element-level drag-reorder is added in v2.5 (currently Out of Scope):**
- Add `@dnd-kit/sortable` `<SortableContext>` per parent collection (already installed above)
- Each `EditableElement` becomes a `useSortable()` consumer
- Requires: stable ids on every element (the nanoid recommendation above) and a `parentPath` prop
- No new deps

**If image storage moves off the repo (recommended after v2):**
- Vercel Blob or Cloudflare R2 instead of `/public/images/` commits
- Replaces only the `/api/admin/upload` handler, not the editor UI
- Drops the `currentPath` traversal risk (CONCERNS.md) entirely
- Adds: `@vercel/blob` (~5 kB)

**If draft/publish workflow is added (CONCERNS.md "Every content save triggers a production deploy"):**
- Add Vercel KV (`@vercel/kv`) or Upstash Redis as the draft store
- Editor writes to KV on every patch; explicit "Publish" button writes the full tree to GitHub
- Deploys then happen on publish only, not on keystroke. Massive UX win.
- Pair with `revalidatePath()` after KV writes for instant preview without rebuilds

**If rich text becomes required in v3:**
- **Tiptap 2.x** is the standard 2026 pick (ProseMirror under the hood, React 19 compat solid, modular extensions). Avoid Lexical (Meta-driven, more opinionated, larger).
- Schema migration: any rich-text field becomes a `TiptapJSON` discriminator in the Valibot block manifest. Plain-text fields stay strings.
- Sanitize on write with isomorphic-dompurify (already installed).

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| zustand@^5 | React 19.2 ✓ | v5 explicitly added React 19 support; v4 also works but v5 is the current line. |
| zundo@^2.3 | zustand@^5 ✓ | v2 rewrite is the one to use. v1 is legacy. |
| immer@^10 | React 19.2 ✓, zustand@^5 ✓ | zustand `immer` middleware is in the main package. |
| valibot@^1.0 | TS 5 strict ✓ | v1 is stable as of 2025 — pin to ^1, not 0.x. |
| @dnd-kit/core@^6 + sortable@^8 | React 19.2 ✓ with caveats | The legacy `@dnd-kit/core` works in React 19. The newer `@dnd-kit/react` package (v0.3.x) has had `"use client"` issues in App Router (GitHub issue #1654) — **stick with `@dnd-kit/core` + `@dnd-kit/sortable`**, NOT `@dnd-kit/react`, until 0.4+. Wrap your DnD provider in a `"use client"` boundary explicitly. |
| react-dropzone@^14 | React 19.2 ✓ | Confirmed in maintainer issues. |
| isomorphic-dompurify@^2 | Node 20+ ✓ | Works in Next Route Handlers (Node runtime, not Edge — your existing admin routes already use Node runtime). |
| browser-image-compression@^2 | Browser only | Client component only — never import in a Server Component. |
| fast-json-patch@^3 | Universal | Pure JS, no React dep. |
| Next.js 16.1.1 | Above all | Confirmed. The only thing to watch: when wrapping `EditableElement` instances in client components, ensure `"use client"` is at the leaf, not the page root, to keep RSC benefits on public pages. |

---

## Sources

- https://github.com/clauderic/dnd-kit — React 19 compatibility status; `@dnd-kit/react` vs `@dnd-kit/core` discussion #1842; issue #1654 on `"use client"` (HIGH for legacy core, MEDIUM for new react package)
- https://github.com/charkour/zundo — v2 rewrite, API surface, bundle claim (HIGH)
- https://valibot.dev/guides/comparison/ — bundle size vs Zod, discriminated union support (HIGH)
- https://www.builder.io/blog/valibot-bundle-size — third-party bundle benchmark, ~90% reduction (MEDIUM, vendor blog)
- https://pockit.tools/blog/zod-valibot-arktype-comparison-2026/ — 2026 comparison (MEDIUM, single source)
- https://github.com/pmndrs/zustand — React 19 support (HIGH)
- https://immerjs.github.io/immer/patches — produceWithPatches API (HIGH)
- https://github.com/Starcounter-Jack/JSON-Patch — fast-json-patch RFC 6902 implementation (HIGH)
- https://puckeditor.com/blog/top-5-drag-and-drop-libraries-for-react — 2026 DnD landscape (MEDIUM, competitor blog but useful survey)
- Internal: `.planning/PROJECT.md`, `.planning/codebase/STACK.md`, `.planning/codebase/CONCERNS.md` — project constraints, security debt, fix priorities (HIGH, ground truth)

**Confidence caveats:**
- LOW confidence on exact `@dnd-kit/core` semver behaviour with React 19 strict-mode double-invoke effects — verify with a small spike before committing the section-reorder feature.
- LOW confidence that `emoji-picker-react` is the best emoji lib in 2026 — recommendation is to skip it entirely and rely on OS pickers.
- MEDIUM on Valibot vs Zod call. Both are correct. The recommendation tilts Valibot because the block manifest will have ~30 schemas (one per section) and modular tree-shaking compounds. If team familiarity with Zod is high, switch — no architecture changes required.

---
*Stack research for: Next.js 16 inline visual editor additions*
*Researched: 2026-04-09*
