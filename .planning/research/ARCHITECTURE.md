# Architecture Patterns

**Domain:** Inline visual page builder (Divi-class) on top of Next.js 16 App Router + JSON-in-Git CMS
**Researched:** 2026-04-09
**Confidence:** MEDIUM (synthesis from established editor patterns: Builder.io, Plasmic, Puck, TinaCMS, Sanity Visual Editing, Tiptap, BlockNote, Editor.js, Craft.js, WordPress Gutenberg, Divi)

## Recommended Architecture

```
                       ┌─────────────────────────────────────────┐
                       │  content.json  (Single Source of Truth) │
                       └────────────────┬────────────────────────┘
                                        │ build-time import (public)
                                        │ runtime fetch (admin)
                                        ▼
                            ┌───────────────────────┐
                            │   Schema Registry     │  src/lib/blocks/
                            │   (Zod discriminated  │  - manifests per block
                            │    unions per block)  │  - parse() validates tree
                            └───────────┬───────────┘
                                        │ validated tree
                                        ▼
        ┌──────────────────────────────────────────────────────────┐
        │                  Render Path  (always)                   │
        │  Page → Section primitives (Header/Body/CTA/Image/List)  │
        │         each renders from a typed slice of the tree      │
        └────────────┬─────────────────────────────────┬───────────┘
                     │ public mode                     │ admin mode
                     │ (no editor code)                │
                     ▼                                 ▼
              static HTML            ┌────────────────────────────────┐
                                     │  Edit Overlay Layer            │
                                     │  - <Editable> wrapper (HOC)    │
                                     │  - data-edit-path attributes   │
                                     │  - HoverToolbar (portal)       │
                                     │  - SelectionContext            │
                                     └─────────────┬──────────────────┘
                                                   │ ops: edit/delete/dup/move
                                                   ▼
                                     ┌────────────────────────────────┐
                                     │  Operation Reducer (immer)     │
                                     │  - applies to in-memory tree   │
                                     │  - emits diff (RFC 6902 JSON   │
                                     │    Patch) + undo inverse       │
                                     └─────────────┬──────────────────┘
                                                   │ debounced
                                                   ▼
                                     ┌────────────────────────────────┐
                                     │  Persistence Layer             │
                                     │  PATCH /api/admin/content      │
                                     │  - validates patch             │
                                     │  - re-validates resulting tree │
                                     │  - GitHub commit (with sha)    │
                                     │  - 409 → conflict resolver     │
                                     └────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Schema Registry** (`src/lib/blocks/*`) | Per-block manifest: Zod discriminated union, default values, allowed children, deletable/required field flags, React component reference | Render path, Operation Reducer, Persistence validator |
| **Section Primitives** (`src/components/sections/primitives/`) | Small, typed render-only components (Heading, Body, CTA, Image, List, Icon, Link). Take a slice of tree + a `path` prop. Render `data-edit-path` and `data-edit-type` only when `EditModeContext` says so. | Schema Registry (types), Editable wrapper |
| **Editable Wrapper** (`src/components/admin/editable.tsx`) | HOC/component that wraps any primitive. In public mode it's a transparent passthrough (compiled-out via dynamic import). In admin mode it attaches `data-edit-*`, registers with SelectionContext, and renders absolute-positioned hover hit-area. | EditModeContext, SelectionContext |
| **Hover Toolbar** (`src/components/admin/hover-toolbar.tsx`) | Single floating toolbar rendered via React portal at `document.body`. Subscribes to SelectionContext, positions itself over the hovered/selected element via `getBoundingClientRect`. Buttons dispatch operations to the reducer. | SelectionContext, Operation Reducer |
| **Inline Editors** (`src/components/admin/inline/{text,image,link,icon}.tsx`) | Per-type in-place editors: Text = controlled contentEditable, Image = drop-zone overlay, Link = popover with href+label, Icon = lucide picker. Each receives `path` and dispatches `update` ops. | Operation Reducer |
| **Operation Reducer** (`src/lib/editor/reducer.ts`) | Pure function `(tree, op) → {tree, inverse}`. Operations: `update`, `delete`, `insert`, `duplicate`, `move`. Uses immer for structural sharing. Emits inverse op for undo stack. | Editor Store |
| **Editor Store** (`src/providers/editor-store.tsx`) | Replaces `AdminProvider` content state. Holds `tree`, `sha`, `undoStack`, `redoStack`, `pendingPatches`, `saveState`. Uses Zustand or `useSyncExternalStore` to avoid the full-tree-rerender problem on every keystroke. | Reducer, Persistence |
| **Persistence Layer** (`src/lib/editor/persist.ts` + `/api/admin/content/patch/route.ts`) | Debounced flush of pending JSON Patch to server. Server applies, re-validates against schema, commits to GitHub with sha. Returns new sha or 409. | GitHub API |
| **Conflict Resolver** | On 409, fetches latest tree, re-applies pending patches via 3-way merge (last-write-wins per path). | Editor Store |
| **Path Helpers** (`src/lib/content-path.ts`) | `parsePath`, `getAt`, `setAt`, `deleteAt`, `insertAt`, `moveAt`. Single source for path parsing — eliminates the duplication noted in CONCERNS. | Reducer, Inline editors |

---

## Patterns to Follow

### Pattern 1: Block Manifest with Zod Discriminated Unions

**What:** Each block type is declared once as a manifest pairing a Zod schema (discriminated by `_type`) with a React component and edit metadata.

**When:** Always — this is the central enabler. Without it, element-delete crashes consumers.

**Example:**
```typescript
// src/lib/blocks/hero.ts
import { z } from "zod";
import { HeroSection } from "@/components/sections/hero-section";

export const HeroBlockSchema = z.object({
  _type: z.literal("hero"),
  headline: z.string(),
  subheadline: z.string().optional(),     // optional → element-delete allowed
  ctaPrimary: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
  ctaSecondary: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
});

export type HeroBlock = z.infer<typeof HeroBlockSchema>;

export const heroManifest = {
  type: "hero" as const,
  label: "Hero",
  schema: HeroBlockSchema,
  component: HeroSection,
  defaults: { _type: "hero", headline: "Neuer Hero", ctaPrimary: { label: "Mehr", href: "/" } },
  fields: {
    headline:    { type: "text",   required: true,  multiline: false },
    subheadline: { type: "text",   required: false, multiline: true  },
    ctaPrimary:  { type: "button", required: false },
    ctaSecondary:{ type: "button", required: false },
  },
} as const;
```

```typescript
// src/lib/blocks/index.ts
export const blockRegistry = {
  hero:           heroManifest,
  testimonials:   testimonialsManifest,
  movementsGrid:  movementsGridManifest,
  // …30 entries
};

export const PageSchema = z.array(
  z.discriminatedUnion("_type", [
    HeroBlockSchema,
    TestimonialsBlockSchema,
    // …
  ])
);
```

The discriminated union is the *type-safe element-delete enabler*: deleting a field is only offered in the toolbar when `manifest.fields[name].required === false`, and the resulting tree is re-validated before persistence.

This pattern is used by Plasmic, Builder.io, Puck, and TinaCMS. Confidence: HIGH for the pattern itself, MEDIUM that Zod discriminated unions are the cleanest TS expression (alternatives: JSON Schema + ajv, or Effect Schema).

### Pattern 2: Element Tree as Nested Arrays of Tagged Blocks (NOT flat)

**What:** Represent the page as `Page = Block[]`, with each `Block` being a discriminated object that may contain nested `Block[]` slots (e.g. a `Columns` block has `children: Block[]`).

**When:** For a Divi-style builder that ultimately wants nested layouts. Even if v2 is flat, design the schema for nesting from day one.

**Why nested over flat-with-parent-refs:**
- Tree traversal/render maps 1:1 with React reconciliation — no extra index/lookup table to maintain.
- JSON Patch paths align naturally (`/0/children/2/headline`).
- The codebase already thinks in nested objects (current `content.json` shape).
- Flat + parent refs only wins when you need O(1) random access by id at scale (1000s of elements). RubikONE has dozens.

**Identity:** Add a stable `_id: string` (nanoid) to every block when migrating, so move/duplicate operations can reference elements without relying on positional paths that shift mid-edit.

**Example:**
```typescript
type Block =
  | { _id: string; _type: "hero"; headline: string; ctaPrimary?: {...} }
  | { _id: string; _type: "columns"; children: Block[] }
  | { _id: string; _type: "testimonials"; items: TestimonialItem[] };

type Page = Block[];
```

### Pattern 3: Edit Overlay via Context + data-attribute Scan (NOT HOC, NOT mutation)

**What:** Section components remain pure render functions. The edit overlay works by:
1. An `EditModeContext` flag set only inside `<AdminShell>`.
2. Primitives consult the context and conditionally render `data-edit-path="HERO.0.headline"` and `data-edit-type="text"` attributes.
3. A single document-level `mousemove` listener finds the closest `[data-edit-path]` ancestor and pushes it into `SelectionContext`.
4. A portal-rendered `HoverToolbar` positions itself over the selected DOM node via `getBoundingClientRect` + `ResizeObserver`.

**Why this beats alternatives:**

| Approach | Pros | Cons | Verdict |
|---|---|---|---|
| **HOC wrapper per component** | Type-safe, explicit | Touches every section, doubles component count, breaks Server Components | Reject |
| **Render-prop / children-as-function** | Flexible | Forces every section to know about the editor | Reject |
| **Mutation / monkey-patch** | Zero refactor | Fragile, fights React | Reject |
| **Context + data-attribute scan** | Sections stay pure, single overlay component, easy to compile out | Slight DOM coupling | **Accept** |

This is the pattern Builder.io's Visual Editor and Sanity Visual Editing use. Confidence: HIGH.

**Compile-out for production:** the toolbar component is imported via `dynamic(() => import("./hover-toolbar"), { ssr: false })` inside an `if (isAdmin)` branch, so the public bundle never includes it. Tree-shaking + Next.js code-splitting handles the rest. The `data-edit-*` attributes are only emitted when `useContext(EditModeContext) === true`, which is only true under `AdminShell` — public visitors get the same primitives but with no extra DOM.

### Pattern 4: JSON Patch (RFC 6902) over Full PUT

**What:** Each operation produces a `JsonPatch[]` document (e.g. `[{op:"replace", path:"/0/headline", value:"New"}]`). The client buffers patches and POSTs them to a new `PATCH /api/admin/content` endpoint. The server applies the patches to the latest content, re-validates against the Zod schema, and commits.

**Why patch over full PUT:**
- 1846-line file vs. ~50-byte patch on every keystroke debounce → orders of magnitude less wire traffic.
- Server-side validation can reject invalid ops without losing the rest.
- Conflict resolution: when two admins edit different fields, server can apply both patch sets sequentially without 409 (only true overlaps conflict).
- Natural undo: `fast-json-patch` library generates inverse patches for free.

**Trade-off:** GitHub Contents API requires the full file blob anyway, so the *commit* is still a full file write. But the *client→server* hop and the *validation surface* are both per-patch. Server still needs to fetch latest content, apply patch, validate, then PUT to GitHub.

**Library:** `fast-json-patch` (battle-tested, ~10kB) or `mutative` (faster successor to immer with built-in patches).

**Optimistic UI + rollback:**
1. Apply op locally → UI updates instantly.
2. Push patch to debounced queue.
3. Server responds OK → mark patch as committed, advance sha.
4. Server responds 409 → fetch latest tree, attempt 3-way merge (apply our pending patches to fresh base), if any patch fails Zod validation → roll back that op + toast error + restore from undo stack.
5. Network failure → keep in queue, retry with backoff.

Confidence: HIGH on patches as wire format, MEDIUM on the specific 3-way merge strategy (depends on actual editor concurrency in practice — RubikONE has 1-3 editors so simple last-write-wins on the path is acceptable).

### Pattern 5: Single In-Place Edit Mode, No Separate Preview Route

**What:** Don't build `/admin/preview` or a separate edit URL. Edit mode is a flag in the existing `/admin`-cookied session that turns the *real* page into an editor. This is what the current architecture already does — keep it.

**Why:**
- WYSIWYG fidelity is automatic — editor view IS the production view, no drift.
- Routing stays simple (no duplicate route trees).
- All 20+ subpages get edit support for free; no extra plumbing per page.
- Matches Divi/Elementor UX exactly.

**How:**
- `AdminShell` is mounted in root `layout.tsx` only when `isAdmin === true` (already done).
- A separate "Vorschau" toggle button in the toolbar lets the editor temporarily hide overlays without leaving the page (`previewMode = true` → `EditModeContext` returns false but cookie/auth stays).
- The public render path is fully unaffected — no editor code is imported when `isAdmin === false` because `AdminShell` is conditionally rendered behind a server-side check in `layout.tsx`.

### Pattern 6: Operations as First-Class Values

**What:** Define operations as a closed sum type and centralize all mutations through a reducer.

```typescript
type EditorOp =
  | { type: "update";   path: string; value: unknown }
  | { type: "delete";   path: string }
  | { type: "insert";   path: string; index: number; block: Block }
  | { type: "duplicate";path: string }
  | { type: "move";     path: string; direction: "up" | "down" };

function applyOp(tree: Page, op: EditorOp): { tree: Page; inverse: EditorOp; patches: JsonPatch[] };
```

**Why:** Single chokepoint enables undo/redo, schema validation, telemetry, and conflict resolution — all in one place. Avoids the current scatter where `setNestedValue`, `field-editor.tsx`'s array splice, and `inline-text.tsx` blur handlers all mutate independently.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Imperative DOM writes in contentEditable
**What:** The current `inline-text.tsx` reads `ref.current.textContent` on blur and also imperatively writes to it in an effect.
**Why bad:** Race conditions, fights React's reconciler, masks bugs with `suppressContentEditableWarning`. Already flagged in CONCERNS.
**Instead:** Use a controlled-on-blur model: render plain text in JSX while not editing; on focus, swap to an uncontrolled contentEditable; on blur, read once and dispatch an `update` op. Or adopt **BlockNote** / **Tiptap** for the text primitive (overkill for plain-text v2; reconsider for v3 rich text).

### Anti-Pattern 2: Free-form JSON without discriminator
**What:** Current `content.json` has fixed-shape objects with no `_type` tag and no schema validation.
**Why bad:** Element-delete crashes consumers; typos create phantom fields.
**Instead:** Schema-first migration. Add `_type` and `_id` to every block in a one-time migration script.

### Anti-Pattern 3: Build-time import as the only render path during admin
**What:** `src/lib/constants.ts` does `import content from "@/content/content.json"` — admin edits don't reflect until rebuild.
**Why bad:** Breaks WYSIWYG promise; user sees stale page after save until Vercel redeploy completes (1-3 min).
**Instead:** In admin mode, sections read from the in-memory editor store via a `useBlock(id)` hook that falls back to the static constant in public mode. Public path still uses build-time import — zero overhead, zero hydration mismatch.

### Anti-Pattern 4: Full JSON.parse(JSON.stringify) clone on every keystroke
**What:** Current `setNestedValue` deep-clones the entire 1846-line tree per mutation.
**Why bad:** O(n) per keystroke, will get sluggish as content grows.
**Instead:** `immer` or `mutative` for structural sharing. Free with the reducer pattern above.

### Anti-Pattern 5: Editor code shipped to public bundle
**What:** Importing admin components unconditionally from layout.
**Why bad:** Inflates bundle, slows public TTI.
**Instead:** `dynamic(() => import("@/components/admin/admin-shell"), { ssr: false })` *and* gate the entire dynamic import behind the server-side `isAdmin` cookie check in `layout.tsx`. Verify with `next build` bundle analyzer.

### Anti-Pattern 6: Mixing presentation assets into JSON or constants
**What:** `NINE_MOVEMENTS` zips images positionally in `constants.ts`.
**Why bad:** Reorder/delete misaligns. Already flagged.
**Instead:** Move asset paths into the JSON entry (`{_id, image, title, ...}`). Migration: one-shot script.

---

## Scalability Considerations

| Concern | At current scale (30 sections, ~50 elements/page) | If scaled (200+ blocks, 10+ pages) | Future (multi-tenant) |
|---|---|---|---|
| **State updates** | useReducer + immer fine | Zustand with selector subscriptions | Same; Zustand scales |
| **Persistence** | Debounced PATCH to GitHub | Split content.json per page | Move to KV/DB; GitHub becomes archival |
| **Conflict resolution** | Last-write-wins per path is enough | Per-page locking or operational transform | OT or CRDT |
| **Bundle size (admin)** | ~50kB editor + tiptap if added | Lazy-load per block type | Same |
| **Schema validation** | Validate full tree on save (cheap) | Validate only patched paths | Same |

Single-tenant, 1-3 editors, ~30 blocks: the simple end of every column. No Yjs/CRDT, no OT. Don't over-engineer.

---

## Suggested Build Order

1. **Foundations (no UI changes)**
   - Extract `src/lib/content-path.ts` (parse/get/set/insert/delete/move). Unit-tested.
   - Define block manifest interface in `src/lib/blocks/types.ts`.
   - Stub a manifest for ONE block (Hero) end-to-end as a vertical slice.

2. **Schema migration (one-shot)**
   - Write a migration script that adds `_type` and `_id` to every block in `content.json`.
   - Generate Zod schemas for all 30 blocks (can be incremental — start with Hero, validate the rest as `z.unknown()`).
   - Validate `content.json` against `PageSchema` in CI to prevent regressions.

3. **Section refactor**
   - Split section components into smaller primitives (Header/Body/CTA/Image/List). Each primitive takes `path` and a typed slice.
   - Public render path unchanged in behavior — same DOM, same styles.
   - Acceptance: site renders identically with no admin code loaded.

4. **Edit overlay scaffold**
   - `EditModeContext`, `SelectionContext`, `<AdminShell>` (lazy-loaded).
   - Primitives emit `data-edit-path` only inside admin mode.
   - HoverToolbar portal that highlights the hovered element with an outline.

5. **Operation reducer + editor store**
   - Replace `AdminProvider`'s ad-hoc setters with the reducer.
   - Wire undo/redo stack (Cmd+Z / Cmd+Shift+Z).

6. **Inline editors per type**
   - Text (controlled contentEditable, plain text first).
   - Image (drop-zone overlay reusing existing upload route).
   - Button (inline label + href popover).
   - Link, Icon, List-item operations.

7. **Persistence v2**
   - New `PATCH /api/admin/content/patch` route. Server fetches latest, applies patches, re-validates, commits.
   - Debounced flush from store. Optimistic UI + 409 reconciler.
   - Keep the old PUT route during transition for the modal fallback.

8. **Toolbar operations**
   - Delete (only if `manifest.fields[name].required === false`).
   - Duplicate, Move Up/Down (array context only).
   - Add-block-below (consults manifest for allowed block types in this slot).

9. **Modal demotion**
   - Keep `EditPanel` as "Erweiterte Felder" fallback for fields the inline editor doesn't yet cover.
   - Eventually retire when inline coverage is 100%.

10. **Quality & cleanup**
    - Vitest for path helpers, reducer, schema validators, auth middleware.
    - Delete legacy `src/app/admin/components/`.
    - Bundle analyzer pass to confirm zero editor code in public route chunks.

---

## Sources

- Builder.io Visual Editor architecture (data-attribute selection, schema-driven blocks): MEDIUM confidence — pattern observed in their open SDK and docs.
- Plasmic component metadata registry pattern: MEDIUM.
- Puck (measuredco/puck) — open-source React page builder using JSON tree + per-component config schemas: HIGH (directly applicable model).
- TinaCMS visual editing + JSON-in-Git workflow: HIGH (closest analog to RubikONE's storage model).
- Sanity Visual Editing (overlay via stega + data-attributes): MEDIUM.
- WordPress Gutenberg block.json manifests: HIGH (industry-standard pattern for declarative block schemas).
- Divi (target UX reference per PROJECT.md): structural pattern only — closed source.
- `fast-json-patch` (RFC 6902) and `mutative`/`immer` for structural sharing + inverse patches: HIGH.
- BlockNote / Tiptap for future rich-text path: HIGH (well-documented React rich-text editors built on ProseMirror).
- Existing codebase analysis: `.planning/codebase/ARCHITECTURE.md`, `STRUCTURE.md`, `CONCERNS.md` — HIGH.

**Confidence summary:** HIGH on the overall shape (manifest registry + nested tree + overlay context + reducer + JSON Patch persistence) — these are convergent patterns across every major React page builder. MEDIUM on specific library choices (Zod vs. Effect Schema, immer vs. mutative, Zustand vs. useReducer) — all viable; pick by team familiarity.
