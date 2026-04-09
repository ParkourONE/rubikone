# Feature Research

**Domain:** Divi-class native inline visual editor for a small-team marketing CMS (Next.js + content.json + GitHub-sync)
**Researched:** 2026-04-09
**Confidence:** MEDIUM-HIGH (Divi/Elementor/Webflow patterns verified via official docs and current reviews; mapping to RubikONE constraints is opinionated)

## Scope Note

This document describes the **feature set of a Divi-class inline visual editor**, scoped explicitly to the RubikONE constraints from `.planning/PROJECT.md`:

- 1-3 non-technical editors, no realtime collaboration
- Storage = `content.json` in repo, write-through GitHub API (no DB, no draft store yet)
- Only existing code-defined block types are editable; no in-browser block-builder
- Page routes stay code-defined (Next App Router)
- v2 = plain text inline; rich text deferred to v3

The Core Value (PROJECT.md) is uncompromising: **every visible element must be edit/delete/duplicate-able in place via hover toolbar, no modal-zwang.** Every "table stakes" entry below is judged against that yardstick.

## Feature Landscape

### Table Stakes (Divi-Parity Minimum)

Missing any of these = the editor does not feel like a visual builder. These are non-negotiable for v2.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Per-element hover outline** (dashed border on hover, only inside edit mode) | Divi/Elementor/Webflow all do this; signals "this is editable" without click | LOW | Needs `EditableElement` wrapper analog to existing `EditableSection`. Outline must NOT shift layout (use outline, not border). |
| **Per-element hover toolbar** with Edit / Delete / Duplicate / Move-Up / Move-Down | Divi's "Click Mode" toolbar is the explicit UX benchmark from PROJECT.md | MEDIUM | Absolute-positioned overlay anchored to element rect. Must handle small elements (icons), nested elements (button inside card), and toolbar overflow at viewport edges. Divi specifically called out "small modules + button overlap" as a known pain point — design for it. |
| **Inline text editing** (click → contentEditable, blur → save) | Already partly exists via `InlineText`; users expect to click headline and type | LOW-MEDIUM | Existing `InlineText` is dual-write fragile (CONCERNS.md). Refactor to single source of truth before extending. Plain text only in v2 — no Bold/Italic/Links inside text. |
| **Inline image swap** (click image → upload dropzone or media picker, no modal) | Divi/Elementor allow click-image → swap-in-place | MEDIUM | Reuse existing `/api/admin/upload`. Drag-drop replace UX. Fall back to file picker. Show upload progress overlay on the image itself. |
| **Inline button editing** (label inline, href via tiny popover, not full modal) | Buttons are the highest-leverage CTA element on a marketing site | MEDIUM | Label = `InlineText`; href + target = small popover anchored to button. Validate URL on blur. |
| **Inline icon picker** (click icon → grid of Lucide icons in popover) | RubikONE uses `lucide-react` heavily; icons are content, not decoration | MEDIUM | Searchable Lucide grid in popover. Icon name stored as string in JSON; mapped at render via `lib/constants.ts` icon map. |
| **Inline link editing** (text + href together via small popover) | All competitors do this | LOW | Same popover pattern as button href. |
| **List item operations** (add item, delete item, reorder items inline within a list) | Lists/grids (`NINE_MOVEMENTS`, `TESTIMONIALS`, `TRUST_STATS`, `FAQ`) are the most-edited content shape on this site | MEDIUM-HIGH | Hover toolbar on each item + an "Add item below" affordance. Move up/down buttons (NOT drag — out-of-scope per PROJECT.md). |
| **Block-level operations distinct from element-level** (delete entire section vs delete one heading inside it) | Without this, users can't tell what they're about to delete | MEDIUM | Section-level toolbar already exists (`EditableSection`). Element-level wrapper must visually nest inside it without competing on hover. Use Z-index + "innermost wins" hover detection. |
| **Save/autosave** with debounced PATCH and visible save state | Divi has explicit save; Elementor autosaves; users expect "I won't lose my work" | MEDIUM | RubikONE constraint: every save = git commit = Vercel rebuild (~1-3 min). Cannot autosave on every keystroke. Pattern: keep `hasChanges` dirty flag (already exists), debounce in-memory only, **explicit Save button** as canonical commit. Show "Ungespeicherte Änderungen" pill. |
| **Undo/Redo** (Cmd-Z / Cmd-Shift-Z) within session, ≥20 steps | Universal expectation; Divi/Elementor/Webflow all ship this | MEDIUM | In-memory stack of `content` snapshots (or patches via immer). 20-50 steps. Resets on save (since save = redeploy = "committed"). Shortcuts: Cmd/Ctrl-Z, Cmd/Ctrl-Shift-Z. |
| **Keyboard shortcuts**: Cmd-Z undo, Cmd-Shift-Z redo, Cmd-S save, Esc exit current edit, Delete on selected element | Divi/Elementor/Webflow standard. Editors with even moderate volume rely on these. | LOW | Single global key handler in `AdminProvider`. Suppress when contentEditable focused (except Esc). |
| **Responsive preview toggle** (Desktop / Tablet / Mobile widths) | Divi has this front-and-center in the toolbar; marketing sites must look right on phones | MEDIUM | Iframe trick OR CSS-driven viewport simulation by constraining body width. Iframe is cleaner but loses inline editing. Recommend CSS-constrained body wrapper that animates width — keeps editor live. Three preset widths: 1440 / 834 / 390. |
| **Explicit Edit-mode toggle** (button to enter/exit edit mode) | Without this, public preview is impossible without logging out | LOW | Toggle in `AdminToolbar`. When OFF, all overlays/outlines hide and the page renders exactly as a public visitor sees it (with live in-memory edits applied). Critical for "does this look right?" check before save. |
| **Optimistic UI with error toast on save failure** | GitHub 409 (SHA conflict) is real and already handled at API level; UX must surface it | LOW | Replace existing `alert()` with shadcn `Sonner` toast. On 409 → "Bitte Seite neu laden" + reload button. |
| **Schema-safe delete** (delete button only appears for elements the block manifest marks `optional: true`) | Without this, deleting `HERO_CONTENT.ctaPrimary` crashes the public render — see CONCERNS.md | HIGH | Block-manifest system from PROJECT.md `Active`. The single most important safety feature. Delete-button visibility is gated per element on a per-block basis. Required fields show no delete affordance, only edit. |
| **"What am I editing?" breadcrumb** (small label showing `HERO_CONTENT > ctaPrimary > label` when an element is focused) | Helps editors orient on dense pages and debug "where did this go?" | LOW | Bottom-left status bar in edit mode. Reads from focused element's `contentKey` + `path`. |
| **Section-level Add Block** (already exists, commit `3fe5231`) — must be reachable from same hover overlay system | Editors need to add new sections to a page. Already shipped — re-integrate with new overlay so two systems don't compete | LOW | Re-skin existing add-block flow into the new overlay style. |

### Differentiators (Beyond Divi-Parity, High Leverage for This Project)

These are not in Divi but make sense given RubikONE's specific constraints (small team, git-backed, marketing focus).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Git-history "blame" on hover** ("Last edited by Maria, 3 days ago, commit `b00555c`") | Tiny team, git is the audit log — surface it in the editor for free accountability | LOW-MEDIUM | Read commit history for `content.json` line range via GitHub API on element focus. Cache per session. |
| **Diff preview before save** (show old → new content tree as a readable diff before committing) | Save = production deploy. Editors should see exactly what they're about to ship. | MEDIUM | Render a JSON-diff or pretty side-by-side of changed sections in a "Vor dem Speichern" panel. Reuses `originalContentRef` already in `AdminProvider`. |
| **Validation badges** (block-manifest validates required fields are non-empty; warn before save) | Crash prevention — required field deleted/blanked → public site breaks | LOW (once manifest exists) | Red dot on toolbar count when validation fails. Disable Save until resolved. |
| **"Reset element"** (revert one element to its `originalContentRef` value) | Per-element undo without using the global undo stack | LOW | Reuse `originalContentRef` already in provider; reset by path. |
| **Edit-mode visible only after intentional toggle**, even when logged in | Allows admins to browse the live site as visitors without logout | LOW | Already implied by Edit-Mode toggle above; explicit because it's a small-team UX win Divi doesn't ship cleanly. |
| **Image alt-text inline** (alt is editable as a sibling popover when image is focused) | SEO + accessibility, often forgotten | LOW | Tiny popover field below image hover toolbar. |
| **Per-element "duplicate to sibling list"** for repeating blocks | One-click "add another testimonial just like this one" with content pre-filled | LOW | Wraps existing array-duplicate logic from `field-editor.tsx`. |
| **Wireframe / Outline mode** (à la Divi's Wireframe Mode — show only block boundaries + labels, no styles) | Useful for restructuring long pages without visual noise | MEDIUM | Hide all visual styles, show only labeled block rectangles. Toggle in toolbar. |
| **Section-jump sidebar** (already exists per ARCHITECTURE.md) — extended to element-level table of contents | Long pages need navigation; existing sidebar is a great base | LOW | Extend `AdminSidebar` to expand sections into their editable elements. |

### Anti-Features (Confirmed Out-of-Scope from PROJECT.md, Justified Here)

| Feature | Why Tempting | Why Problematic | Better Approach |
|---------|--------------|-----------------|-----------------|
| **Realtime multi-user collaboration** (cursors, presence, OT/CRDT) | Notion/Figma/Webflow ship this; sounds modern | RubikONE has 1-3 editors, no concurrent editing pressure. CRDT/OT adds enormous complexity (sync server, conflict resolution, infra). Storage backend is GitHub — every save is a commit; concurrent saves already get a 409 SHA-conflict. | Keep current 409-handling. Show "wer hat zuletzt bearbeitet" via git blame. Document "ein Editor zur Zeit" as a team norm. |
| **In-browser block builder** (build new section types from primitives, like Webflow) | "Editors could build any layout" | Block types map 1:1 to React components (`HeroSection`, `Testimonials`, …). Letting users compose new types in the browser means the JSON schema becomes recursive and the React layer needs a generic renderer — full Webflow-class engine. Massive scope explosion for a marketing site with ~30 fixed block types. | New block types are added by developers in code; editors choose from the existing palette. Existing add-block flow is enough. |
| **Page routing in CMS** (create new `/foo` page from the editor) | "Editors could launch landing pages without devs" | Routes are Next App Router files. Creating a route in the editor = generating files in the repo or building a dynamic catch-all route + DB. Either path is a separate product. | Devs scaffold new pages (one-line `app/foo/page.tsx` composing existing sections); editors fill content. Document the workflow. |
| **Element-level drag-and-drop reorder** | Modern, expected | PROJECT.md explicitly defers this. Drag-drop on a long page with sticky headers, smooth scroll (Lenis), and absolute-positioned overlays is fragile. Up/Down arrow buttons cover 95% of cases. | Up/Down buttons in v2; revisit drag in v3 if editors actually ask. |
| **Rich text** (Bold/Italic/Links/Lists inline within a paragraph) | "I want to bold one word" | Requires either a real RTE (tiptap/lexical) or careful HTML sanitization. content.json is rendered into the build, so XSS payloads ship to every visitor. PROJECT.md correctly defers to v3. | v2 = plain text. If a paragraph needs emphasis, split it into separate fields or use designer-controlled component variants. Document the constraint. |
| **CMS-managed media library** (Asset browser, tag, search, replace-everywhere) | Convenient | Adds DB, new UI, image processing. RubikONE's existing flow (upload-on-edit to `public/images/uploads/`) is fine for the volume. | Keep upload-on-replace. Optionally list recently-uploaded images in the image-swap popover. |
| **Versioning/rollback UI inside CMS** | "Undo a deploy" | Git already has this. Vercel deployments page already lets you instant-rollback any commit. Building a CMS-internal version browser duplicates infra. | Document "Rollback = Vercel Dashboard or `git revert`." Surface commit URL in save-success toast. |
| **Per-keystroke autosave to GitHub** | "I never lose work" | Every save = production deploy = ~1-3 min build. Per-keystroke would mean dozens of deploys per editing session. Burns CI minutes, pollutes git history, and shows users a half-finished page mid-edit. | Explicit Save button (already constrained by PROJECT.md). Strong dirty-state indicator + browser `beforeunload` warning. Eventually: KV-backed draft store (out-of-scope for v2). |
| **WYSIWYG style editing** (font size pickers, color pickers, spacing controls in the toolbar) | Divi/Elementor go deep here | RubikONE has a defined Design System (`DESIGN-SYSTEM.md`, fixed primary `#00a8ab`, Inter font, Tailwind tokens). Letting editors pick fonts/colors *destroys the brand*. | Style is code-controlled. Editors edit content only. Variants (e.g. "primary vs secondary button") are exposed as discrete dropdowns, never freeform CSS. |
| **A/B testing / personalization built-in** | Marketing-team flex | Out of scope for v2; better delivered via Vercel Edge Config or a dedicated tool. | Defer; revisit if marketing actually asks. |

## Feature Dependencies

```
Security Fixes (P0 from CONCERNS.md)
    └─required-by─> [everything below]

content-path.ts helpers (parse/get/set/insert/delete/move)
    └─required-by─> EditableElement wrapper
                        └─required-by─> Hover Toolbar (edit/delete/duplicate/move)
                                            └─required-by─> Schema-safe Delete
                                                                └─required-by─> List item operations

Block Manifest (src/lib/blocks.ts)
    └─required-by─> Schema-safe Delete
    └─required-by─> Validation Badges
    └─required-by─> "What am I editing?" breadcrumb (block-aware labels)

Section refactor (split 30 sections into Header/Body/CTA/Image primitives)
    └─enables─> Inline button editing
    └─enables─> Inline icon picker
    └─enables─> Element-level reuse across blocks

Refactored InlineText (single source of truth)
    └─required-by─> All other inline editors (Image, Button, Icon, Link, List)

Undo/Redo stack
    └─enhances─> Schema-safe Delete (safety net)
    └─required-by─> Keyboard shortcuts (Cmd-Z)

Edit-mode toggle
    └─required-by─> Responsive Preview (preview = edit-mode-off + width constraint)

NINE_MOVEMENTS image-zip fix (CONCERNS.md fragile area)
    └─required-by─> List item operations on NINE_MOVEMENTS
```

### Critical Dependency Notes

- **Block Manifest is the central enabler.** Without it, every "delete" affordance is a potential public-site crash. Build manifest before any element-level destructive operation.
- **Security fixes (P0/P1 from CONCERNS.md) gate everything.** Adding more editor surface to an unauthenticated API = enlarging attack surface. PROJECT.md `Active` already lists these as Phase 1.
- **Refactoring `InlineText` is upstream of every other inline editor.** The dual-write contentEditable bug compounds across primitives if not fixed first.
- **`content-path.ts` extraction is upstream of element-level operations.** Insert/delete/move helpers don't exist today and are needed by the toolbar.

## MVP Definition

### Launch With (v2.0 — Divi-Parity Floor)

The minimum that delivers PROJECT.md's Core Value: "every visible element edit/delete/duplicate-able in place."

- [ ] **Security fixes** (CONCERNS.md P0/P1) — auth + session hash verify + path traversal
- [ ] **Block manifest system** with required/optional field declarations
- [ ] **`content-path.ts` helpers** (parse/get/set/insert/delete/move)
- [ ] **Refactored `InlineText`** (single source of truth, multiline variant for textarea fields)
- [ ] **`EditableElement` wrapper** with hover outline + toolbar
- [ ] **Hover toolbar:** Edit / Delete (manifest-gated) / Duplicate / Move-Up / Move-Down
- [ ] **Inline editors:** Text, Image (swap-in-place), Button (label + href popover), Link (popover), Icon (Lucide picker)
- [ ] **List item operations** (add/delete/reorder within array blocks)
- [ ] **Save flow:** explicit Save button, dirty pill, optimistic UI with error toast (Sonner), `beforeunload` warning
- [ ] **Undo/Redo** (≥20 steps in-session, Cmd-Z / Cmd-Shift-Z)
- [ ] **Edit-mode toggle** (preview-as-visitor without logout)
- [ ] **Responsive preview toggle** (Desktop / Tablet / Mobile widths via CSS-constrained wrapper)
- [ ] **Keyboard shortcuts:** Cmd-Z, Cmd-Shift-Z, Cmd-S, Esc, Delete-on-selection
- [ ] **NINE_MOVEMENTS image-zip fix** (decouple from positional array)
- [ ] **Sonner-based toasts** replacing all `alert()` calls

### Add After Validation (v2.1 — Polish)

- [ ] **Diff preview before save** (show JSON diff of changed sections)
- [ ] **Git-blame on hover** (last editor + commit URL)
- [ ] **Image alt-text inline popover**
- [ ] **Section-jump sidebar extended to element TOC**
- [ ] **"Reset element" per-element revert**
- [ ] **Validation badges** (block-manifest required-field warnings)
- [ ] **Wireframe / Outline mode**
- [ ] **Vitest coverage** for path helpers, manifest validation, auth middleware

### Future Consideration (v3+)

- [ ] **Rich text** (tiptap/lexical with sanitization on write + render)
- [ ] **Drag-and-drop element reorder** (only if v2 up/down feedback is "drag would be better")
- [ ] **KV-backed draft store** for instant-preview WYSIWYG without per-edit deploys
- [ ] **GitHub OAuth login** (per-editor identity, real audit attribution)
- [ ] **Split content.json into per-page files** (reduce save-conflict surface, faster builds)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Security fixes | HIGH | LOW | P0 |
| Block manifest | HIGH | MEDIUM | P0 |
| content-path.ts helpers | HIGH | LOW | P0 |
| Refactor InlineText | HIGH | MEDIUM | P0 |
| EditableElement + hover toolbar | HIGH | HIGH | P1 |
| Inline image/button/link/icon editors | HIGH | MEDIUM | P1 |
| List item operations | HIGH | MEDIUM | P1 |
| Schema-safe delete | HIGH | LOW (given manifest) | P1 |
| Save with dirty state + toast | HIGH | LOW | P1 |
| Undo/redo | HIGH | MEDIUM | P1 |
| Keyboard shortcuts | MEDIUM | LOW | P1 |
| Edit-mode toggle | HIGH | LOW | P1 |
| Responsive preview | MEDIUM | MEDIUM | P1 |
| Diff preview before save | MEDIUM | MEDIUM | P2 |
| Git-blame on hover | MEDIUM | LOW | P2 |
| Validation badges | MEDIUM | LOW | P2 |
| Wireframe mode | LOW | MEDIUM | P2 |
| Reset-element | MEDIUM | LOW | P2 |
| Element TOC sidebar | LOW | LOW | P2 |
| Rich text | MEDIUM | HIGH | P3 |
| Drag-drop reorder | LOW | HIGH | P3 |
| KV draft store | HIGH | HIGH | P3 |

**Priority key:**
- P0: Foundational, blocks everything else
- P1: Must ship in v2 to deliver Core Value
- P2: Polish, post-validation
- P3: Future, defer

## Competitor Feature Analysis

| Feature | Divi 5 | Elementor | Webflow | Framer | Builder.io | RubikONE Approach |
|---------|--------|-----------|---------|--------|------------|-------------------|
| **Hover toolbar with edit/delete/duplicate/move** | Yes (Click/Hover/Grid modes) | Yes (Navigator + right-click; per-element handles) | Yes (canvas handles + Navigator) | Yes | Yes | **Yes** — `EditableElement` wrapper, hover-triggered toolbar |
| **Inline text edit (click → type)** | Yes | Yes | Yes (double-click) | Yes | Yes | **Yes** — refactored `InlineText` |
| **Modal-first editing** | Optional fallback | Sidebar panel (not modal) | Right panel (not modal) | Right panel | Right panel | **Demoted to "advanced fields" fallback** (PROJECT.md) |
| **Inline image swap** | Yes | Yes | Yes (asset panel + drag) | Yes | Yes | **Yes** — click-to-replace via existing upload API |
| **Responsive preview toggle** | Yes (Desktop/Tablet/Phone, customizable) | Yes (Desktop/Tablet/Mobile) | Yes (breakpoints) | Yes | Yes | **Yes** — CSS-constrained wrapper, three preset widths |
| **Undo/Redo** | Yes (history panel) | Yes (Cmd-Z + history) | Yes (Cmd-Z + History panel) | Yes | Yes | **Yes** — in-memory stack ≥20, Cmd-Z/Cmd-Shift-Z |
| **Keyboard shortcuts** | Customizable in v5 | Yes | Extensive | Extensive | Yes | **Limited set:** undo/redo/save/esc/delete |
| **Save model** | Explicit save | Autosave + revisions | Autosave + publish | Autosave + publish | Autosave + publish | **Explicit save** (constraint: every save = git commit = deploy) |
| **Realtime collab** | No | No (revisions only) | Yes (paid) | Yes | Yes | **No** — explicitly out of scope |
| **Block builder (compose new types in browser)** | Yes | Yes | Yes (full) | Yes | Yes | **No** — block types are React components, code-defined |
| **Page routing in CMS** | Yes (WP-managed) | Yes (WP-managed) | Yes | Yes | Yes (CMS) | **No** — Next App Router files, code-defined |
| **Style controls (color/font pickers)** | Extensive | Extensive | Extensive | Extensive | Some | **No** — design system locks style; editors edit content only |
| **Versioning/rollback UI** | Yes (revisions) | Yes (revisions) | Yes (Backups) | Yes | Yes | **No** — Git history + Vercel rollback are the audit trail |
| **Wireframe / outline mode** | Yes (Wireframe Mode) | Yes (Navigator) | Yes (Navigator) | Yes | Partial | **v2.1 differentiator** |

## Confidence & Open Questions

**HIGH confidence:**
- Divi/Elementor/Webflow ship hover toolbars with edit/delete/duplicate; Cmd-Z/Cmd-Shift-Z is universal; responsive previews are universal. (Verified across multiple official sources.)
- Block manifest is required for safe element-delete given the current `content.json` schema. (Verified by reading CONCERNS.md and the existing schema patterns.)
- Realtime collab, in-browser block-builder, and CMS routing are correctly out-of-scope for a 1-3-editor marketing site with code-defined blocks.

**MEDIUM confidence:**
- Specific complexity ratings (LOW/MEDIUM/HIGH) — depend on how cleanly the section refactor lands.
- Whether responsive preview works without iframe — needs prototyping (Lenis smooth scroll + sticky headers may behave oddly under CSS width constraint).
- Whether the existing `add-block` flow can be re-skinned cleanly into the new overlay system without rewrite.

**Open questions for the roadmap phase:**
1. Does the block manifest need to be hand-authored or can it be derived from TypeScript types via a build-step? (Affects developer ergonomics for adding new section types.)
2. How long should the undo stack be before memory becomes an issue? (Each snapshot = ~50KB of `content.json`; 50 steps = ~2.5 MB in memory — fine.)
3. Should "save" be one button or split into "Save Draft (KV)" + "Publish (commit)"? — answered NO for v2 (no KV), but worth re-asking for v3.
4. How are nested editable elements handled when the outer one is in "click-to-edit" focus? Innermost-wins via z-index, or focus trap?
5. What's the smallest practical hover target for the toolbar on icon-sized elements (16-24px)?

## Sources

- [Divi 5 Visual Builder Interface — Elegant Themes Help Center](https://help.elegantthemes.com/en/articles/12991185-divi-5-visual-builder-interface)
- [Divi Feature Update: Customizable Visual Builder — Elegant Themes Blog](https://www.elegantthemes.com/blog/theme-releases/divi-feature-update-introducing-the-new-customizable-visual-builder)
- [Getting Started With The Divi Builder — Elegant Themes Documentation](https://www.elegantthemes.com/documentation/divi/visual-builder/)
- [Divi Hover Options — Elegant Themes Blog](https://www.elegantthemes.com/blog/theme-releases/divi-hover-options-have-arrived)
- [Is Divi Builder Still Worth It in 2025? — WPNext Review](https://wpnext.org/divi-builder-review/)
- [Divi Visual Builder: 8 features you should use — astucesdivi.com](https://astucesdivi.com/en/fonctionnalites-cachees-divi-visual-builder/)
- [Elementor Hotkeys — official help](https://elementor.com/help/hotkeys/)
- [Elementor Keyboard Shortcuts Complete List — element.how](https://element.how/elementor-keyboard-shortcuts/)
- [Bring Back Delete & Duplicate Buttons — elementor/elementor #4981 (GitHub)](https://github.com/elementor/elementor/issues/4981)
- [How to Undo Changes in Elementor — Elfsight](https://elfsight.com/tutorials/how-to-undo-changes-in-elementor/)
- [Keyboard shortcuts in Webflow — Webflow Help Center](https://help.webflow.com/hc/en-us/articles/33961359609875-Keyboard-shortcuts-in-Webflow)
- [How to Undo in Webflow — wpdean](https://wpdean.com/how-to-undo-in-webflow/)
- [Keyboard shortcuts for Webflow — UseTheKeyboard](https://usethekeyboard.com/webflow/)
- Project context: `.planning/PROJECT.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONCERNS.md`

---
*Feature research for: Divi-class inline visual editor — RubikONE CMS v2*
*Researched: 2026-04-09*
