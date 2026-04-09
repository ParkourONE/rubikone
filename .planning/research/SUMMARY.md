# Project Research Summary

**Project:** RubikONE CMS — Visual Editor v2
**Domain:** Divi-class inline visual page builder on Next.js 16 / React 19 with content.json + GitHub-API persistence
**Researched:** 2026-04-09
**Confidence:** MEDIUM-HIGH

## Executive Summary

RubikONE needs a native Divi-class inline visual page builder bolted onto an existing Next.js 16 marketing site whose content lives in a 1846-line `content.json` synced to GitHub. Research converges on a clear shape: a **schema-first block manifest** (discriminated unions per block type) is the central enabler — without it, every "delete" affordance is a potential public-site crash. On top of that manifest sits an **edit-overlay architecture** (EditModeContext + `data-edit-path` attributes + portal HoverToolbar), a **pure operation reducer** using immer + JSON Patch for undo/redo and debounced persistence, and a small set of **inline primitives** (Text, Image, Button, Link, Icon, List) that replace modal-first editing.

The recommended additive stack is lean and admin-only (~22 kB gzipped): **zustand + zundo**, **immer + fast-json-patch**, **valibot (or zod)**, **@dnd-kit**, **isomorphic-dompurify**, **browser-image-compression + react-dropzone**, **nanoid**. No Tiptap/Lexical in v2 (plain text only), no Realtime/CRDT, no in-browser block builder.

Dominant risks: (1) security debt — admin API effectively open; (2) contentEditable dual-write race in `InlineText`; (3) schema-less content → element-delete crashes renderers; (4) every save triggers a production deploy, constraining autosave.

## Key Findings

### Recommended Stack
- **zustand ^5 + zundo ^2.3** — editor store with temporal undo
- **immer ^10 + fast-json-patch ^3** — structural sharing + RFC 6902 wire format
- **valibot ^1 (or zod ^4)** — block manifest schemas with discriminated unions
- **@dnd-kit/core + /sortable** — stick with `/core`, NOT `@dnd-kit/react`
- **isomorphic-dompurify ^2** — XSS insurance for paste
- **nanoid ^5** — stable `_id` on every block
- **browser-image-compression + react-dropzone** — inline image swap
- **vitest + @testing-library/react** — path helpers, reducer, manifest, auth

NOT in v2: Tiptap/Lexical/Slate, react-dnd, lodash, Yjs/Liveblocks, react-hook-form, redux.

### Expected Features

**Must have (v2):**
- Per-element hover outline + floating toolbar (Edit / Delete / Duplicate / Move Up/Down)
- Inline editors: Text, Image swap-in-place, Button (label + href popover), Link, Icon (Lucide picker), List item ops
- Schema-safe delete gated by manifest `optional: true`
- Block manifest with required/optional declarations
- Explicit Save + dirty pill + Sonner toasts + `beforeunload`
- Undo/Redo ≥20 steps, Cmd-Z/Cmd-Shift-Z/Cmd-S/Esc/Delete
- Edit-mode toggle, responsive preview (Desktop/Tablet/Mobile via CSS wrapper)
- NINE_MOVEMENTS image-zip fix

**Should have (v2.1):** Diff preview before save, git-blame on hover, validation badges, reset-element, alt-text popover, wireframe mode, element TOC sidebar.

**Defer (v3+):** Rich text (Tiptap), element-level drag-drop, KV draft store.
**Out-of-scope:** realtime collab, in-browser block builder, CMS routes, style/color pickers.

### Architecture Approach

Schema-first block registry + nested tagged-block tree + overlay-via-context + pure operation reducer + JSON Patch persistence. All editor code lazy-loads under `AdminShell` behind a server-side `isAdmin` check.

**Major components:**
1. **Schema Registry** (`src/lib/blocks/*`) — manifest per block: discriminated union + defaults + field flags + component ref
2. **Section Primitives** — pure render-only, emit `data-edit-path` in admin mode
3. **Editable Overlay** (EditModeContext + SelectionContext + portal HoverToolbar)
4. **Operation Reducer** — pure `(tree, op) → {tree, inverse, patches}` via immer; closed sum type
5. **Editor Store** (zustand) — tree, sha, undo/redo, pending patches, save state
6. **Persistence** — new `PATCH /api/admin/content/patch`: fetch→apply→validate→commit with sha, 3-way merge on 409
7. **Path Helpers** (`src/lib/content-path.ts`) — parse/get/set/insert/delete/move

### Critical Pitfalls

1. **Security debt** on `/api/admin/*` — close in Phase 1 before expanding surface.
2. **contentEditable cursor jumping + dual-write race** — uncontrolled-while-editing, compositionstart/end, paste-as-plain-text.
3. **Element-delete crashing public render** — manifest gate BEFORE enabling delete; build-time validator in CI.
4. **Schema migration footgun** — `__schemaVersion` root + additive-only changes + migration chain.
5. **Save = production deploy (1-3 min)** — explicit Save button, strong dirty indicator; defer KV draft store.
6. **Editor code leaking into public bundle** — dynamic import + bundle analyzer.
7. **NINE_MOVEMENTS positional zip** — move paths into JSON entry, key by `_id`.
8. **Full JSON.parse/stringify clone on every keystroke** — immer.

## Implications for Roadmap

### Phase 1: Security + Foundations
Hardened admin API (real `isAuthenticated()`, sha256 session hash verify, upload path-traversal fix, SVG sanitize), `content-path.ts` with Vitest, nanoid `_id` migration, `__schemaVersion`, Sonner toast infra.

### Phase 2: Block Manifest + Schema Migration
30 Valibot/Zod manifests, discriminated `PageSchema`, build-time validator in CI, NINE_MOVEMENTS fix, manifest-validated save path.

### Phase 3: Editor Primitives Refactor
Refactored InlineText (uncontrolled, IME-safe, paste-sanitize), 30 sections split into Header/Body/CTA/Image/List primitives, EditModeContext + SelectionContext, zustand store replacing AdminProvider content state, immer.

### Phase 4: Edit Overlay + Hover Toolbar + Inline Editors (Core Value)
Portal HoverToolbar, manifest-gated delete, inline editors (Text/Image/Button/Link/Icon), list ops, operation reducer, zundo undo/redo, keyboard shortcuts, edit-mode toggle, responsive preview, debounced PATCH with optimistic UI + 409 resolver, re-skinned add-block flow.

### Phase 5: Polish + Differentiators (v2.1)
Diff preview before save, git-blame on hover, validation badges, reset-element, alt-text popover, wireframe mode, element TOC, expanded Vitest, bundle analyzer pass.

### Phase Ordering Rationale
- Security + path helpers first (unblock everything)
- Manifest before overlay (delete/validation need schema)
- InlineText refactor before new primitives (bug would compound)
- Overlay + reducer co-designed as one phase
- Polish last (needs real usage to validate)

## Confidence Assessment

| Area | Confidence | Notes |
|---|---|---|
| Stack | MEDIUM-HIGH | React 19 compat verified; LOW on `@dnd-kit` strict-mode behavior |
| Features | MEDIUM-HIGH | Divi/Elementor/Webflow patterns verified |
| Architecture | MEDIUM-HIGH | Convergent across Puck/TinaCMS/Builder.io/Gutenberg/Sanity |
| Pitfalls | HIGH | Documented editor failure modes + codebase audit |

**Overall: MEDIUM-HIGH.**
