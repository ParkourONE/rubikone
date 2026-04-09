# Codebase Concerns

**Analysis Date:** 2026-04-09
**Focus:** CMS visual editor extensibility, content schema, auth, security

## Executive Summary

The inline visual editor is a hybrid: a section-level **modal edit panel** (`EditPanel` using `FieldEditor`) plus a nascent **inline contentEditable** primitive (`InlineText`) for headlines/paragraphs. True Divi-style per-element hover controls (edit/delete/reorder at the element level, in-place, no modal) do not yet exist — only at the section-block level, and element-level delete exists only inside the modal's array editor.

Several serious issues should be addressed **before** expanding the editor:

1. **CRITICAL: `/api/admin/content` GET and PUT have no auth check** — anyone can read and write `content.json` via GitHub.
2. The `InlineText` component uses `textContent`, which strips rich formatting — incompatible with a "click-any-element, edit-freely" model.
3. `content.json` has no schema/discriminator — blocks are free-form objects, making generic per-element delete/reorder unsafe without conventions.
4. No automated tests of any kind for the app (only GSD harness tests in `get-shit-done/`).

---

## Tech Debt

### Inline editor is section-scoped, not element-scoped

- Files: `src/components/admin/editable-section.tsx`, `src/components/admin/edit-panel.tsx`, `src/components/admin/inline-text.tsx`
- Current model:
  - `EditableSection` wraps a section, shows a dashed hover outline + single "Edit" button top-right, opens the modal `EditPanel`.
  - `EditPanel` is a centered modal sheet that renders the whole section subtree via `FieldEditor` (the same generic JSON tree editor used historically in the admin dashboard).
  - `InlineText` is a separate primitive (contentEditable span/h1/p) that writes a single string field directly to `content.json` without opening the modal.
- Gap vs. target: no per-element hover controls, no per-element delete in-place, no add-element-below button, no drag-reorder at element granularity on the real page. All element-level operations (duplicate/reorder/delete) live inside the modal's array UI in `field-editor.tsx` lines 188–294.
- Fix approach: introduce an `EditableElement` wrapper (analog to `EditableSection`) that registers its `contentKey + path` with the provider, renders absolute-positioned hover controls (edit/delete/move/duplicate/add-below), and dispatches to `updateContent` using the existing path-based mutator in `admin-provider.tsx` (`setNestedValue`).

### Modal-first UX contradicts "inline editing" goal

- Files: `src/components/admin/edit-panel.tsx` (entire file), `src/components/admin/editable-section.tsx:44-62`
- Issue: "Bearbeiten" button unconditionally opens a modal. `InlineText` is the only inline path and is not wired into `EditableSection` — they compete rather than compose.
- Fix approach: make the modal a secondary ("advanced fields") path. Default click should focus/activate inline controls on the clicked element.

### `InlineText` uses `textContent`, loses whitespace and rich content

- File: `src/components/admin/inline-text.tsx:52-60`
- Issue: On blur, `ref.current.textContent` is read back and written to JSON. Any inline markup (line breaks via `<br>`, `<strong>`, links, `&nbsp;`) is stripped. `Enter` is hijacked to blur (line 72–75), so multiline textarea-style fields (e.g. `subheadline`) cannot be edited inline.
- Fix approach: either (a) restrict `InlineText` to single-line plain text and use a textarea/contenteditable-with-newlines variant for multiline, or (b) move to a minimal rich-text model (tiptap/lexical) with a serializer — but that changes the schema.

### `InlineText` writes DOM imperatively, fights React

- File: `src/components/admin/inline-text.tsx:80-87, 111-135`
- Issue: Renders `{currentValue !== undefined ? currentValue : children}` and *also* imperatively sets `ref.current.textContent` in an effect. This dual-write pattern is fragile — external content updates can race with user typing, and `suppressContentEditableWarning` masks the bug.
- Fix approach: adopt a single source of truth — render as uncontrolled contentEditable and only sync on blur, OR render controlled and diff via `ref` only during non-editing states.

### Path parsing regex is duplicated

- Files: `src/providers/admin-provider.tsx:57-62`, `src/components/admin/inline-text.tsx:16-21`
- Issue: Both define the same regex `/([^.\[\]]+)|\[(\d+)\]/g` for parsing paths like `HERO_CONTENT.ctaPrimary.label` and `TESTIMONIALS[0].quote`. Drift risk when adding new path shapes (e.g., dynamic page keys).
- Fix approach: extract to `src/lib/content-path.ts` with `parsePath`, `getAt`, `setAt`, `deleteAt`, `insertAt` helpers. Element-level delete/reorder will need `deleteAt` and `insertAt`, which don't exist today.

### `admin-provider.tsx` uses `any` extensively

- File: `src/providers/admin-provider.tsx:19, 53, 91`
- Issue: `Record<string, any>`, `setNestedValue(obj: any, ...)`. No type safety on content mutations — a typo in a content path silently no-ops or writes `undefined` into the tree.
- Fix approach: generate a `ContentSchema` type from `content.json` (or author it), type `updateContent` to that schema.

### `setNestedValue` does full `JSON.parse(JSON.stringify(...))` clone on every keystroke

- File: `src/providers/admin-provider.tsx:54`
- Issue: `content.json` is 1846 lines. Every character typed in an `InlineText` on blur, and every keystroke in `FieldEditor`, clones the entire tree. With the planned "per-element edit" (likely many more `InlineText` instances), this becomes noticeable.
- Fix approach: use a structural-sharing helper (immer or hand-rolled path-copy) when implementing new editors.

### `content.json` is a single monolithic file

- File: `src/content/content.json` (1846 lines)
- Issue: Every save rewrites the entire file via a single GitHub commit. Concurrent edits race on SHA (handled via 409), but two admins editing different sections still conflict. Deployment is triggered on every text tweak.
- Fix approach: eventually split by page/section into multiple files; or batch saves via a "pending changes" queue in the provider (already partially there via `hasChanges`).

### Admin dashboard shell is dead code

- File: `src/app/admin/page.tsx` (6 lines)
- Issue: `/admin` redirects to `/`. `src/app/admin/components/{block-preview,field-editor,section-card}.tsx` still exist and appear unused by any route. `field-editor.tsx` in `admin/components/` is 453 lines, duplicated (functionally) with the one imported by `EditPanel` from `src/components/admin/field-editor.tsx` (confirm import path — two field-editors exist).
- Fix approach: audit imports, delete unused copies. Confirm which `field-editor.tsx` is canonical (the `EditPanel` import resolves to `./field-editor` i.e. `src/components/admin/field-editor.tsx` which I did not read; the 453-line one in `admin/components/` is orphaned).

---

## content.json Schema Flexibility (for element-level delete)

- File: `src/content/content.json`
- Current shape (observed): a flat top-level object keyed by `SCREAMING_SNAKE_CASE` block names (`SITE_CONFIG`, `HERO_CONTENT`, `TRUST_STATS`, `NAVIGATION_ITEMS`, `NINE_MOVEMENTS`, `PROBLEM_CONTENT`, `SOLUTION_CONTENT`, ...). Each value is either:
  - An **object** with fixed keys the React component destructures directly (e.g. `HERO_CONTENT.headline`, `HERO_CONTENT.ctaPrimary.label`).
  - An **array of homogeneous objects** (`TRUST_STATS`, `NAVIGATION_ITEMS`, `NINE_MOVEMENTS`, testimonials, FAQ).
- Import pattern: `src/lib/constants.ts` re-exports each top-level key as a named constant, sometimes merging with hardcoded arrays (images, icons) — see `NINE_MOVEMENTS` at `src/lib/constants.ts:30-48` where `image` is positionally zipped by index.
- **Element-level delete implications:**
  - Arrays: safe to delete (existing modal does this at `field-editor.tsx:267-279`). BUT `NINE_MOVEMENTS` deletion will misalign the hardcoded `image` array in `constants.ts` — positional zip breaks when an entry is removed.
  - Objects with fixed keys: **deleting a field is unsafe** because the consuming component destructures it (e.g. `HeroSection` reads `HERO_CONTENT.ctaPrimary.label` — if `ctaPrimary` is removed, the component crashes). The schema has no "optional" marker, no discriminated union, no "block type" field.
  - There is no block-type registry mapping `HERO_CONTENT` → `HeroSection` → `{allowedChildElements, deletableFields}`. Per-element delete needs this metadata to be safe.
- Fix approach: introduce a block manifest `src/lib/blocks.ts` declaring `{ key, component, schema: { fields: [{name, type, required, multiline}] } }`. Inline editor consults this manifest to show/hide delete on a per-element basis and to validate shape post-mutation.

---

## Admin Auth Model

### CRITICAL: Content API has no auth check

- Files: `src/app/api/admin/content/route.ts` (entire file), `src/middleware.ts`
- Issue: `middleware.ts` only matches `/admin/:path*`, NOT `/api/admin/*`. `route.ts` does not call any `isAuthenticated()` helper. **Unauthenticated users can GET and PUT the entire site content** via `fetch('/api/admin/content', { method: 'PUT', body: ... })`.
- Contrast: `src/app/api/admin/upload/route.ts:9-18` DOES check the session cookie. The content route was forgotten.
- Impact: full site defacement, SEO poisoning, phishing content injection — anyone can rewrite `content.json` to anything and it gets committed to the main branch and auto-deployed.
- **Fix immediately:**
  - Extend `middleware.ts` matcher to `["/admin/:path*", "/api/admin/:path*"]` and exempt `/api/admin/login`.
  - Add `isAuthenticated()` check at the top of both GET and PUT handlers in `route.ts`.

### Session model is weak

- File: `src/app/api/admin/login/route.ts:23-44`
- Issue: "Session" is two cookies: `admin_session` = random 32-byte token, `admin_token_hash` = SHA-256 of that token. Both set by the server. Middleware only checks **presence** of both cookies, not that the hash actually matches the session. An attacker who sets any two cookies named `admin_session=foo` and `admin_token_hash=bar` passes the middleware check.
- File: `src/middleware.ts:9-15` — no hash verification.
- File: `src/app/api/admin/upload/route.ts:9-14` — same, just checks presence.
- Impact: trivially bypassable. The cookie design pretends to verify integrity but never does.
- Fix: verify `sha256(admin_session) === admin_token_hash` in middleware AND in every protected API route. Better: switch to a signed JWT or a server-side session store (KV, Upstash).

### Single shared password, no per-user identity

- File: `src/app/api/admin/login/route.ts:16`
- Issue: `ADMIN_PASSWORD` env-based single credential. No rate limit on `/api/admin/login`. No audit log of who edited what — GitHub commits are all attributed to the bot token user.
- Impact: if password leaks (shared by multiple editors), full rotation required; no forensics.
- Fix: add per-editor credentials or OAuth (GitHub) login — commits can then be attributed; add basic rate limiting (e.g., `@upstash/ratelimit`).

### No CSRF protection on PUT endpoints

- Files: `src/app/api/admin/content/route.ts`, `src/app/api/admin/upload/route.ts`
- Issue: `sameSite: "strict"` on the cookie mitigates basic CSRF, but there is no explicit CSRF token. Plus, once content API auth is added, any XSS on `rubikone.ch` pivots to full CMS takeover because the session cookie is sent automatically.
- Fix: add an `x-csrf-token` double-submit pattern OR require a custom header that browsers can't set cross-origin without CORS preflight.

### Session duration 8h with no refresh/idle timeout

- File: `src/app/api/admin/login/route.ts:32`
- Minor: 8h fixed lifetime. Acceptable for a small team.

---

## Security Concerns for the Visual Editor

### XSS via editable HTML — future risk

- File: `src/components/admin/inline-text.tsx:133`
- Current: renders `{currentValue}` as text child, NOT via `dangerouslySetInnerHTML` — safe today because contentEditable reads `textContent`, not `innerHTML`.
- Risk when extending: if the visual editor moves to rich-text (links, bold, embedded video), writing `innerHTML` back and rendering it unsanitised will expose stored XSS. Because admin writes go straight to `content.json` which is **imported at build time** and rendered into every page (`src/lib/constants.ts:6`), an XSS payload ships to every visitor on the next deploy.
- Fix approach: if rich text is needed, sanitise on write (isomorphic-dompurify) AND on render. Maintain an allowlist of tags (`<br>`, `<strong>`, `<em>`, `<a href>`), strip `on*` attributes, validate `href` against `https?:`.

### Rendered HTML from content.json

- I did not grep every section for `dangerouslySetInnerHTML` — worth a sweep before expanding the editor. Action: `grep -r dangerouslySetInnerHTML src/components/sections/` before shipping rich text.

### GitHub token exposure

- Files: `src/app/api/admin/content/route.ts:5-12`, `src/app/api/admin/upload/route.ts:5-6`
- Good: token stays server-side, never sent to the client; errors don't leak it.
- Concerning: token is a single long-lived PAT with repo-wide write. If compromised, attacker can push arbitrary code (not just content). Vercel env var storage is OK, but:
  - No scope narrowing — consider a fine-grained PAT scoped to `contents:write` on a single repo.
  - No rotation policy documented.
  - `console.error("GitHub API error:", error)` at `content/route.ts:37` logs raw GitHub error text to server logs — verify Vercel logs don't echo headers.
- Fix: migrate to a GitHub App with least-privilege installation; rotate quarterly.

### Image upload allows SVG

- File: `src/app/api/admin/upload/route.ts:38`
- Issue: `image/svg+xml` in allowlist. SVGs can embed `<script>` and execute when rendered via `<img>`? (no — `<img>` blocks script). BUT if SVGs are ever served inline (e.g. `dangerouslySetInnerHTML` or `<object>`) → XSS. Also SVGs can `<foreignObject>` HTML and can reference external resources for tracking.
- Fix: either strip scripts via SVGO-sanitise on upload, or drop SVG from the allowlist for user uploads (keep designer-committed SVGs only).

### Upload path traversal — mitigated but fragile

- File: `src/app/api/admin/upload/route.ts:55-69`
- Good: filename sanitised via `.replace(/[^a-z0-9-]/gi, "-")`.
- Concerning: `currentPath` from the client is trusted if it starts with `/images/` — an attacker with admin access could pass `currentPath=/images/../../src/lib/constants.ts` to overwrite arbitrary files. The `startsWith("/images/")` check does NOT normalise `..`.
- Impact: privilege-escalation from CMS edit to arbitrary repo write (admin already has that via tokens, but the extra attack surface is unnecessary).
- Fix: `path.posix.normalize` and assert result still starts with `/images/` AND has no `..` segments.

### No file-content validation

- File: `src/app/api/admin/upload/route.ts:38`
- Issue: only `file.type` (client-supplied MIME) is checked. An attacker can upload a PHP webshell with `Content-Type: image/png`. Low impact because Vercel doesn't execute files from the public dir, but still — validate magic bytes.

---

## Performance & Architecture Concerns

### Every content save triggers a production deploy

- Files: `src/app/api/admin/content/route.ts:63-128`, `src/providers/admin-provider.tsx:170`
- Issue: PUT to GitHub → new commit → Vercel auto-deploy → cold build (~1-3 min for Next 16). User sees `alert("Gespeichert! Deployment wird automatisch gestartet.")` but the site doesn't update until the build finishes.
- For a "live inline editor" UX, this is a major limitation — you cannot WYSIWYG edit and see the result instantly.
- Fix approach: either (a) move content to a runtime store (Vercel KV / Upstash Redis / Vercel Blob) and re-validate with `revalidatePath`, or (b) introduce a draft/publish workflow where drafts live in KV and publishing writes to GitHub.

### Content is build-time imported

- File: `src/lib/constants.ts:6` — `import content from "@/content/content.json";`
- Consequence: content is inlined into the client bundle. Admin edits require a rebuild. This is fine for marketing-site cadence but blocks true inline WYSIWYG.

### `content.json` clients get full tree

- File: `src/app/api/admin/content/route.ts:23-60` — GET returns the entire 1846-line file. For admins editing one paragraph, the whole tree goes over the wire AND the whole tree gets re-serialised on every mutation in memory.

---

## Missing Tests

- Files: none found under `src/**`. Only the GSD workflow-tool tests under `get-shit-done/tests/*.cjs` which are unrelated.
- Impact: no regression safety for any of the fixes recommended here. Changes to the path parser, schema, or auth must be hand-tested.
- Priority: **High for auth/security fixes** (unit test `isAuthenticated`, middleware, path traversal), **Medium for editor logic** (path parse/set/delete helpers, `setNestedValue`).
- Fix approach: add Vitest + Testing Library. Start with:
  - `lib/content-path.test.ts` — the path parser (once extracted).
  - `middleware.test.ts` — session-cookie verification.
  - `api/admin/content.test.ts` — auth enforcement.

---

## Framework Version Concerns

### Next.js 16.1.1 — brand new

- File: `package.json:23` — `"next": "16.1.1"`
- Concern: Next 16 is very recent (released ~ late 2025/early 2026). Some ecosystem packages may lag. Key items to verify before editor work:
  - App Router middleware behaviour unchanged — matcher syntax stable.
  - `cookies()` is async in Next 15+ — already adopted (see `login/route.ts:27` `await cookies()`).
  - Server Actions: not currently used — the editor uses fetch API routes. Consider Server Actions for mutation ergonomics but beware RSC/client split.

### React 19.2 compatibility

- File: `package.json:24` — `"react": "19.2.3"`
- Concern: `ref` forwarding semantics changed in React 19 (no more `forwardRef` required for function components). `inline-text.tsx:113` uses `ref={ref as any}` — works but the cast hides a type error from the `as Tag` polymorphic pattern. Clean up when extending.
- Framer Motion 12.23 is React 19 compatible.
- Radix UI versions look current.

### Tailwind CSS 4

- `@tailwindcss/postcss` v4 alpha — stable enough but config patterns differ from v3; any new admin UI styling should follow the existing v4 conventions (`globals.css` uses CSS vars, not `tailwind.config.js`).

---

## Fragile Areas (for the editor work specifically)

### `NINE_MOVEMENTS` positional image zip

- File: `src/lib/constants.ts:30-48`
- Issue: images are hardcoded as a parallel array zipped by index. Any reordering/deletion of entries in `content.json` via the editor will shuffle images. Already a latent bug in the existing modal "reorder" UI at `field-editor.tsx:225-253`.
- Fix: move `image` into the JSON entry itself, or key by `id`.

### Section registration effect dependencies

- File: `src/components/admin/editable-section.tsx:19-23`
- Issue: `registerSection` and `unregisterSection` are in the effect deps. They're memoised with `useCallback` in the provider so it's OK, but if the provider is ever refactored to not memoise, this will infinite-loop.

### `getNestedValue` silent undefined

- File: `src/components/admin/inline-text.tsx:22-34`
- Issue: returns `undefined` on any missing path, falls back to `children`. A typo in `contentKey`/`field` props silently shows the hardcoded JSX instead of the JSON value — editing the element then writes a NEW path into the JSON, creating phantom fields.
- Fix: in development, `console.warn` when path misses. Validate against schema once manifest exists.

---

## Recommended Priority Order

**Before any editor extension work:**
1. **P0 — Fix `/api/admin/content` auth hole.** Extend middleware matcher and add `isAuthenticated()` to route handlers. ~15 minutes.
2. **P0 — Fix session verification to actually compare hash.** Middleware and all protected routes. ~30 minutes.
3. **P1 — Path traversal fix on upload `currentPath`.** ~10 minutes.

**Editor foundation (before Divi-style UI):**
4. **P1 — Extract `content-path.ts` helpers** (parse, get, set, insert, delete, move). Enables element-level operations.
5. **P1 — Define block manifest** (`src/lib/blocks.ts`) mapping each top-level key to a schema describing editable/deletable elements. Prevents crashes from deleting required fields.
6. **P2 — Replace `InlineText` single-write imperative DOM model** with a cleaner controlled/uncontrolled split before adding more primitives.
7. **P2 — Fix `NINE_MOVEMENTS` image zip** before enabling reorder/delete on that block.

**Editor UX:**
8. Build `EditableElement` wrapper with hover toolbar (edit/delete/duplicate/move-up/move-down/add-below).
9. Demote modal to "advanced fields" fallback.

**Quality gates:**
10. Add Vitest + tests for path helpers and auth middleware.
11. Consider moving content to runtime store (KV) to unblock instant-preview WYSIWYG.

---

*Concerns audit: 2026-04-09*
