# Pitfalls Research

**Domain:** Inline visual page editor (Divi-class) on top of a Next.js 16 / React 19 marketing site with `content.json` + GitHub-API persistence
**Researched:** 2026-04-09
**Confidence:** HIGH (informed by codebase audit in `.planning/codebase/CONCERNS.md` + well-documented WYSIWYG editor failure modes)

## Critical Pitfalls

### Pitfall 1: contentEditable cursor jumping from React re-renders

**What goes wrong:**
User types in an inline-editable element. After each keystroke, React re-renders the node because state changed, replacing the DOM text node. The browser caret resets to position 0 (or to the end), and characters appear in the wrong order or get dropped. Users describe it as "the cursor jumps" or "I can't type fast."

**Why it happens:**
contentEditable is an *uncontrolled* DOM API. Treating it as a controlled React input — re-rendering `{currentValue}` on every change — destroys and recreates the text node, which invalidates the Selection/Range. The current `InlineText` component fights this by *also* imperatively writing `ref.current.textContent` in an effect (`inline-text.tsx:80-87, 111-135`), creating a dual-write race that papers over the symptom but keeps the bug latent.

**How to avoid:**
Pick one model and stick to it:
- **Uncontrolled while editing:** render the initial value once on focus, never touch the DOM during typing, read `textContent` (or a serialized fragment) on blur. Sync from external state only when *not* focused.
- Or adopt a battle-tested editor (Tiptap, Lexical, ProseMirror) that owns its own DOM and exposes a JSON model — never touch their DOM directly.
- Memoize the wrapper. Never put the live editing value in a parent component that re-renders descendants.

**Warning signs:**
- Users report "cursor jumps to start"
- `setState` called inside an `onInput` handler on a contentEditable element
- `dangerouslySetInnerHTML` + `contentEditable` on the same element
- `suppressContentEditableWarning` sprinkled around (already present in code — red flag)

**Phase to address:**
Phase 2 (Editor primitives refactor) — must be solved before adding more inline element types, or every new primitive inherits the bug.

---

### Pitfall 2: Element-delete crashing the public render (schema/component coupling)

**What goes wrong:**
Editor lets user delete `HERO_CONTENT.ctaPrimary`. Save succeeds. Next page load → `HeroSection` destructures `ctaPrimary.label` → `TypeError: Cannot read properties of undefined`. Public site goes white. Vercel just deployed it.

**Why it happens:**
`content.json` has no schema. Section components destructure fixed keys (`.planning/codebase/CONCERNS.md` §schema). The editor has no idea which fields are required vs optional. Worse, `getNestedValue` silently returns `undefined` on missing paths and the editor silently writes phantom keys when `contentKey` is mistyped.

**How to avoid:**
- Build the **block manifest** *before* enabling element-delete or rename. Each section declares `{ field, type, required, multiline, deletable }`.
- Hide the delete button on `required: true` fields (or show it disabled with a tooltip).
- Validate the post-mutation tree against the manifest in `updateContent`; reject the mutation if it would violate a required field, and surface a toast.
- Defensive rendering: every section component should fall back gracefully (`hero?.ctaPrimary?.label ?? ""`) — but this is the *seatbelt*, not the *brake*.
- Add a build-time validator (Zod schema or similar) so a bad `content.json` fails the build before deploy.

**Warning signs:**
- A section file uses naked destructuring (`const { label } = ctaPrimary`)
- "Optional" fields exist only in TypeScript via `?`, never enforced at runtime
- The editor allows delete on every field uniformly
- No schema file exists

**Phase to address:**
Phase 2 (Block manifest) — gate condition for the entire element-delete feature. Do not ship Hover-Toolbar Delete before this.

---

### Pitfall 3: Paste destroys layout (formatted HTML pasted into contentEditable)

**What goes wrong:**
User copies a heading from a Word document or another website and pastes into the inline editor. Browser pastes the source HTML — fonts, colors, `<font>` tags, `mso-` styles, base64 images, `<table>` wrappers — directly into your DOM. Save persists the soup into `content.json`. The site now has Microsoft Office styles inlined and possibly an XSS vector.

**Why it happens:**
Default contentEditable paste behavior is "paste rich HTML." Developers forget to intercept `onPaste` and use `event.clipboardData.getData("text/plain")` + `document.execCommand("insertText")` (or modern equivalent).

**How to avoid:**
- Intercept `paste` events on every editable surface: `e.preventDefault(); insertPlainText(e.clipboardData.getData("text/plain"))`.
- If rich text is needed (v3), sanitize via `isomorphic-dompurify` against an allowlist (`<br><strong><em><a>`) on the way in *and* on the way out.
- Test with: Word, Google Docs, Notion, another browser tab (lots of `<span style>`), and plain text.

**Warning signs:**
- No `onPaste` handler on the editable component
- `content.json` starts containing HTML tags after a few editor sessions
- Diff in GitHub commits shows `class="MsoNormal"` or `<span style="..."`

**Phase to address:**
Phase 2 (Editor primitives) — implement during the InlineText refactor, before any user touches the editor.

---

### Pitfall 4: IME / mobile keyboard input dropped or duplicated

**What goes wrong:**
A user typing German umlauts via dead keys, or anyone typing Chinese/Japanese/Korean via an IME, sees characters double, drop, or commit early. Mobile users on iOS/Android see autocorrect undo their words. Swipe-typing inserts garbage.

**Why it happens:**
React `onChange`/`onInput` fires *during* IME composition. If your blur-or-keystroke handler reads `textContent` mid-composition, you snapshot a half-formed character, then the IME commits the final character on top — duplication. Mobile keyboards rely on the contentEditable host preserving the DOM text node identity for autocorrect/predictive suggestions; React re-renders break this contract.

**How to avoid:**
- Listen to `compositionstart` / `compositionend`. Suppress reads of `textContent` between them.
- Read on `blur` only (not `input`) for plain-text fields.
- Test on real iOS Safari + an IME (e.g. Japanese keyboard) — emulators lie.
- Avoid `onKeyDown` Enter-trapping (the existing `inline-text.tsx:72-75` does this — incompatible with multiline + breaks IME on some Android keyboards).

**Warning signs:**
- No `compositionstart`/`compositionend` listeners anywhere
- "Read on input" pattern in editable components
- Bug reports specifically from Mac users with German layouts or any non-Latin user
- Mobile users complain "autocorrect doesn't work in the editor"

**Phase to address:**
Phase 2 (Editor primitives refactor).

---

### Pitfall 5: State desync between editor DOM and source-of-truth JSON

**What goes wrong:**
The visible DOM shows "Welcome to RubikONE" but `content.json` in memory still says "Welcome". User saves; the published site shows "Welcome" — the visible edit was lost. Or the inverse: JSON updated, DOM didn't, and the user re-edits a stale string.

**Why it happens:**
Two sources of truth — the live DOM (uncontrolled contentEditable) and the React/JSON state. Without a clear "commit point" (typically blur), they drift. Compounded by `setNestedValue` doing a full `JSON.parse(JSON.stringify(...))` clone (`admin-provider.tsx:54`) which is slow enough that fast typists can save before the clone settles.

**How to avoid:**
- Define a single commit point: blur. On blur, read `textContent` and call `updateContent`. Never write back to the DOM during editing.
- After save success, re-sync the DOM from JSON only on elements that are *not* currently focused.
- Use structural sharing (immer) instead of deep clone — both for perf and to make state transitions atomic.
- Add a "dirty element" marker so the toolbar can show "1 unsaved field" before the user clicks save.

**Warning signs:**
- Users report "I edited that, it didn't save"
- Editor shows different content than the public preview after revalidation
- `hasChanges` is true but the diff is empty (or vice versa)

**Phase to address:**
Phase 2 (Editor primitives) — same refactor that fixes Pitfall 1.

---

### Pitfall 6: Schema migration footgun on `content.json`

**What goes wrong:**
You add a new optional field `HERO_CONTENT.eyebrow` to the manifest. Existing `content.json` doesn't have it. Component renders `eyebrow.toUpperCase()` and crashes. Or you rename `ctaPrimary` → `primaryCta` in code; existing JSON still has `ctaPrimary`; whole hero blanks out. Worse: a non-technical editor opens the editor, the toolbar reflects the new shape, save writes the new shape, and the old shape is lost forever — no migration script ran.

**Why it happens:**
JSON-on-disk + code-defined shapes is a distributed-schema problem. There is no migration framework like Prisma or Rails migrations for JSON files. Renames are silent.

**How to avoid:**
- **Versioned content:** add `__schemaVersion: N` at the root of `content.json`. On load, run a chain of migration functions `migrate1to2`, `migrate2to3` … against the in-memory tree before handing it to the editor. Never rename in place — always migrate.
- **Additive-only changes** for v2: introduce new fields as optional, never delete or rename existing ones in the same release. Removals come in a later cleanup release after all data is migrated.
- Migration tests: snapshot `content.json` before and after, assert that every section still renders without throwing (tied to Pitfall 2 — manifest validation in tests).
- A `npm run content:migrate` CLI that applies migrations and commits — run it manually before the schema change ships.
- Backup discipline: every save commits to git → git is your backup. Before risky migrations, branch.

**Warning signs:**
- Renaming a field in code without a migration script in the same PR
- Manifest defines fields not present in `content.json`
- TypeScript shows `?` on a field that components access without `?.`
- No `__schemaVersion` marker

**Phase to address:**
Phase 2 (Block manifest) — design schema-versioning at the same time as the manifest, before the first migration is needed.

---

### Pitfall 7: Performance death by re-render-on-keystroke

**What goes wrong:**
User types in the hero headline. Each keystroke triggers `updateContent` → deep-clones the entire 1846-line `content.json` → updates context → every component subscribed to admin context re-renders → 30 sections re-evaluate → typing lag visible (50–200ms per character). Users describe it as "the editor is unusable on my laptop."

**Why it happens:**
- `setNestedValue` does `JSON.parse(JSON.stringify(...))` per mutation (`admin-provider.tsx:54`).
- Admin context exposes the *entire* content tree to every consumer; React context has no fine-grained subscription.
- Every `EditableSection`/`InlineText` reads from the same context, so a change anywhere re-renders everywhere.
- If you also persist on every keystroke (not just blur), GitHub PUT calls pile up and rate-limit.

**How to avoid:**
- **Local edit state:** while a contentEditable element is focused, hold its draft value in *local* component state. Only call `updateContent` on blur.
- **Debounce save**, never save on keystroke. 500–1000ms after blur is fine.
- **Structural sharing:** replace `setNestedValue`'s deep clone with immer (or a hand-rolled path-copy). Mutates only the spine from root to leaf.
- **Context selectors:** use `useSyncExternalStore` (or zustand/jotai) so components only re-render when *their* slice changes. Plain React Context will not scale to 30+ live editable elements.
- Memoize section components with `React.memo` keyed on their content slice.
- Profile with React DevTools Profiler before *and* after each refactor — assertion-driven, not vibes.

**Warning signs:**
- Typing in the editor on a mid-range laptop has visible lag
- React Profiler shows every section re-rendering on every keystroke
- `hasChanges` recomputes via deep compare on every render
- GitHub commits flooding from a single edit session

**Phase to address:**
Phase 2 (Editor primitives) for the keystroke locality fix; Phase 3 (Element-level UI) when the live count of editable elements jumps.

---

### Pitfall 8: XSS via stored content (the editor as injection vector)

**What goes wrong:**
An attacker (or a careless editor) pastes `<img src=x onerror=alert(document.cookie)>` into a "headline" field. Today this is safe because `InlineText` reads `textContent` and renders as a text child. Tomorrow you add rich text (links, bold) and switch to `dangerouslySetInnerHTML` for the public render. Now every visitor to rubikone.ch ships an XSS payload — and because `content.json` is build-time imported (`lib/constants.ts:6`), the payload is baked into the static bundle and served from CDN.

**Why it happens:**
Rich-text editors invariably need to render *some* HTML on the public site. Developers reach for `dangerouslySetInnerHTML` and forget that the data flowed from a UI that anyone with the admin password can use, and that the admin password is shared.

**How to avoid:**
- **No `dangerouslySetInnerHTML` on `content.json` data, ever, without sanitization on both write and render.** Use `isomorphic-dompurify` or `sanitize-html`.
- Maintain an explicit allowlist: tags `<br><strong><em><a><ul><ol><li>`, attributes only `href` (with `^https?://` validation) and `target` (forced to `_blank rel="noopener noreferrer"`).
- For v2 (no rich text), **stay on plain text only**. This pitfall can be deferred entirely.
- Audit existing sections: `grep -r dangerouslySetInnerHTML src/components/sections/` before any rich-text work.
- CSP header: `script-src 'self'` blocks inline `onerror` attacks even if sanitization fails. Already a good idea on a marketing site.
- SVG uploads (currently allowed) are an XSS vector if ever rendered inline — drop SVG from the user-upload allowlist (CONCERNS §SVG upload).

**Warning signs:**
- Plans to add bold/italic/link inline — pause and design sanitization first
- Any `dangerouslySetInnerHTML` whose source traces back to `content.json`
- SVG uploads enabled
- No CSP

**Phase to address:**
Phase 1 (Security hardening) — drop SVG, add CSP, audit existing render paths. Phase 4+ for any rich-text work, gated on a sanitization pipeline.

---

### Pitfall 9: Auth holes — unguarded admin APIs (already present)

**What goes wrong:**
`/api/admin/content` GET and PUT have **no auth check at all** (CONCERNS §CRITICAL). Anyone on the internet can `curl -X PUT https://rubikone.ch/api/admin/content -d '{...}'` and rewrite the entire site. Vercel auto-deploys it. Site is now defaced or phishing.

Worse: the session model doesn't even verify the cookie integrity it pretends to verify. Setting any two cookies named `admin_session=foo` and `admin_token_hash=bar` passes the middleware check.

Building the new editor on top of this means every new admin API endpoint you add inherits the same vulnerability if you copy-paste the patterns.

**Why it happens:**
- Middleware matcher only covers `/admin/:path*`, not `/api/admin/:path*`.
- The auth helper checks cookie *presence* not cookie *integrity*.
- One route remembered to call `isAuthenticated()`; the others didn't. There is no shared "protected route" wrapper to enforce the rule.

**How to avoid:**
- **Phase 1, day 1:** extend middleware matcher to `["/admin/:path*", "/api/admin/:path*"]`, exempt `/api/admin/login`.
- Implement a real `requireAuth()` higher-order function that wraps every admin route handler. Middleware is *defense in depth*, not the primary check — every API route must independently verify.
- Hash verification: `crypto.timingSafeEqual(sha256(sessionCookie), tokenHashCookie)` — constant-time comparison.
- Rate-limit `/api/admin/login` (`@upstash/ratelimit` or in-memory bucket) to prevent password brute-force.
- Add CSRF protection: custom `x-csrf-token` header on all mutating routes; SameSite=Strict alone is not enough once XSS exists anywhere on the domain.
- Add an integration test that hits each `/api/admin/*` route without cookies and asserts 401. Run in CI. This is the *only* defense against future copy-paste regressions.

**Warning signs:**
- An admin route handler exists without a call to a `requireAuth` helper
- Middleware matcher missing `/api/admin/:path*`
- No tests that assert "unauth → 401"

**Phase to address:**
Phase 1 (Security blockers) — gate condition for *everything else*. Per `PROJECT.md` Active list, this is already correctly identified as P0.

---

### Pitfall 10: GitHub token blast radius

**What goes wrong:**
The PAT used by the content API has repo-wide write. An attacker who compromises any admin session (Pitfall 9, Pitfall 8 chain) can rewrite *code* — not just content — through `/api/admin/upload` (which writes arbitrary paths if `currentPath` is fooled, see CONCERNS §path traversal). They push a malicious React component to the repo, Vercel builds and deploys it, every visitor gets compromised.

**Why it happens:**
- One long-lived PAT, classic (not fine-grained), with `repo` scope.
- Token has no rotation schedule.
- Upload route trusts client-provided `currentPath` after a `startsWith("/images/")` check that doesn't normalize `..`.
- No separation between "edit content" and "upload media" credentials.

**How to avoid:**
- Migrate to a **GitHub App** installation token, scoped to `contents: write` on the single repo (not `repo`).
- Or use a **fine-grained PAT** scoped to specific paths if GitHub App is too much overhead — note that path scoping for fine-grained PATs is repo-level, not path-level; combine with server-side path validation.
- `path.posix.normalize` on every client-supplied path; assert result starts with `/public/images/uploads/` and contains no `..` segments.
- Rotation calendar: every 90 days. Document in `CLAUDE.md`.
- Never log the token or full GitHub error responses (the upload route currently logs raw errors — verify nothing sensitive leaks).
- Long-term: separate "content writes" from "media writes" with two different installation tokens, principle of least privilege.

**Warning signs:**
- One PAT does everything
- No documented rotation
- Upload route accepts any client path that "looks right"
- Errors from GitHub API logged verbatim to Vercel logs

**Phase to address:**
Phase 1 (Security blockers) — fix path traversal and audit logs immediately. Phase 5+ (hardening) for GitHub App migration.

---

### Pitfall 11: Undo/Redo footguns — async actions in history

**What goes wrong:**
User uploads an image to a card, then types text, then hits Cmd+Z three times. The text undoes correctly. The image undo… does what? Reverts the JSON pointer but leaves the uploaded file orphaned in the GitHub repo? Re-uploads the previous image? Crashes because the previous file was deleted? Now the user hits Cmd+Y and the editor tries to redo a network call that may or may not still be valid.

Or: undo restores a deleted block, but the block referenced an image that no longer exists (was overwritten by a newer upload). The page renders with a broken image and the user blames the editor.

**Why it happens:**
History stacks model state as "snapshots of pure JSON," but the editor performs *side effects* (network uploads, GitHub commits, file overwrites). Side effects don't compose with undo cleanly. Naive implementations push every keystroke to the stack and explode memory; smarter implementations group by "transaction" but get the boundaries wrong (one transaction crosses a save).

**How to avoid:**
- **Undo only the JSON tree.** Image uploads are *commits to the asset namespace* and are not reversible from undo — make this explicit in UX (no undo on image upload; instead, "undo image" reverts the *reference* not the file).
- Use **immer + a simple `past[]`/`future[]` stack** with structural-shared snapshots. Cap at 50 entries.
- **Transaction grouping:** debounce keystrokes (300ms) into a single history entry. Explicit actions (delete element, add block) push immediately.
- **Save resets the stack** (or marks a save point). Document this clearly: undo doesn't cross a save.
- Garbage-collect orphaned images via a periodic script, not via undo.
- Test: rapid type → undo → redo → type → undo. Common bug: redo stack not cleared on new edit.

**Warning signs:**
- History array grows unbounded
- Undo triggers any network call beyond GitHub save
- Image uploads in history without a clear orphaning policy
- Cmd+Z in the middle of a long text field undoes the entire field, not character-by-character

**Phase to address:**
Phase 3 (Editor UX — undo/redo). Design the boundaries before implementing.

---

### Pitfall 12: "Null element" crashes when user deletes a required field

**What goes wrong:**
User clicks delete on the hero CTA button. JSON updates, save writes to GitHub, Vercel rebuilds, and the build *succeeds* because TypeScript thinks `ctaPrimary` is required (`?` not present) but the JSON shape no longer matches the type. At runtime, the page throws on the first visit. The error boundary catches it… or doesn't, and the whole route 500s.

**Why it happens:**
TypeScript doesn't validate runtime JSON. The compiler is lying. Section components were written assuming the JSON shape declared in `lib/constants.ts` is gospel. Element-delete in the new editor breaks that assumption.

**How to avoid:**
- Same fix as Pitfall 2: **manifest** declares which fields are deletable. UI hides delete on required fields.
- Add a **Zod schema** generated from (or aligned with) the manifest. Validate `content.json` in `updateContent` *before* committing to local state. Reject mutations that would violate it; show a toast.
- Build-time validation: a script `npm run content:validate` that runs in CI on every PR. Bad shape → red build → no deploy.
- **Per-section error boundary** so a crash in `HeroSection` doesn't take down the whole page — show a placeholder "this section failed to render, edit in admin" inline.
- Defensive optional chaining in section components (`hero?.ctaPrimary?.label`) — but as a *safety net*, not the primary defense.

**Warning signs:**
- Delete button shown on every field uniformly
- No Zod/Yup schema for `content.json`
- No error boundaries around section components
- TypeScript types use non-optional fields that JSON could legally omit

**Phase to address:**
Phase 2 (Manifest + schema validation) — gate condition for shipping element-delete.

---

### Pitfall 13: Edit-mode render diverges from public render

**What goes wrong:**
Inside the editor, the hero looks great. User saves and visits the public site in a new tab — totally different layout. The editor showed a wrapper div with hover outlines, padding from edit chrome, "(Edit)" badges in the spacing calculation, an absolute-positioned toolbar adding 40px to the section height, a different font because the editor injected its own stylesheet that overrode global CSS specificity. User loses trust: "the preview lies."

**Why it happens:**
- Edit-mode wrappers (`EditableSection`, `EditableElement`) inject DOM that's not present at public render time.
- Edit-mode CSS (toolbars, dashed outlines) leaks via global selectors.
- Hover/focus states depend on `:hover` which only exists in edit mode.
- "View as visitor" mode is missing — editors always see chrome.

**How to avoid:**
- **WYSIWYG discipline:** wrappers must use `display: contents` (or position: absolute overlays that don't affect layout) so they contribute zero box-model footprint. The hover outline is a `::after` overlay, not a wrapping `<div>` with padding.
- **Scope edit CSS** to a top-level `.is-admin` class on `<body>`, never global. Public render must never load edit CSS at all (already true via `AdminProvider` short-circuit — preserve this).
- A **"Preview" toggle** in the toolbar that hides all edit chrome — not just dims it, fully removes wrappers. Implement with a class on the root, not by re-mounting. Test it.
- A **smoke test:** screenshot the edit-mode render with chrome hidden vs. the public render. They should be pixel-identical (within anti-aliasing).
- Beware browser extensions injecting CSS in admin tabs only — test in incognito.

**Warning signs:**
- `EditableSection` adds `<div>` with padding/margin
- Edit CSS uses element selectors like `section { ... }` instead of `.is-admin section { ... }`
- No "preview" toggle
- Editors complain "it looks different live"

**Phase to address:**
Phase 3 (Hover toolbar / Editable wrappers) — design layout-neutrality up front.

---

### Pitfall 14: Git conflicts when two editors save

**What goes wrong:**
Editor A opens hero, edits headline, hasn't saved. Editor B opens testimonials, edits a quote, saves first — `content.json` is now at SHA `abc123` on GitHub. Editor A saves; the API uses Editor A's stale SHA `def456`; GitHub returns 409 Conflict. Code shows "Bitte Seite neu laden" (per CONCERNS). Editor A reloads, **loses all unsaved work**, has to retype the headline. User experience: "the CMS ate my edits."

Even worse: Editor A's session is stale by an hour (different sections), and the conflict cascades — every save fails until they reload, but reload nukes their drafts.

**Why it happens:**
- `content.json` is one monolithic file. Any edit anywhere conflicts with any other edit anywhere.
- The conflict resolution UX is "throw it all away."
- Drafts live only in component state (or local memory), not persisted between page reloads.

**How to avoid:**
- **Persist drafts to localStorage** keyed by `contentKey + path + timestamp`. On reload, offer to restore.
- **Field-level merge:** on 409, refetch the latest `content.json` from GitHub, three-way merge against the original `originalContentRef` and the local edits. Conflicts are nearly always in different sub-trees → auto-merge. Only true field-level conflicts (same path edited by both) need a manual choice.
- **Optimistic locking per section:** track which sections are "claimed" by which editor via a lightweight lockfile in the repo or KV. Show "User B is editing this section" badge. (Optional — overkill for 1–3 editors per `PROJECT.md` constraints.)
- **Smaller files** (long-term): split `content.json` into `content/hero.json`, `content/testimonials.json` … so conflicts only happen on the same section. Aligns with CONCERNS §monolithic.
- **Save more often** (debounced, non-blocking) so the window for conflict shrinks.
- **Communicate** to the team: "don't both edit at the same time" — Slack norm. With 1–3 editors, social coordination is the cheapest solution.

**Warning signs:**
- 409 errors logged in Vercel
- Editors complain about lost work
- `originalContentRef` never updates after a reload-without-saving
- No localStorage persistence

**Phase to address:**
Phase 3 or 4 (depending on how often it bites). For v2 ship, the social-coordination approach + draft persistence is enough; full three-way merge is Phase 5+.

---

### Pitfall 15: Silent phantom-field writes from typo'd paths

**What goes wrong:**
Developer writes `<InlineText contentKey="HERO_CONTENT" field="headlne" />` (typo). At read time, `getNestedValue` returns undefined and the editor shows the JSX fallback ("Welcome to RubikONE"). Editor doesn't notice anything is wrong — the page looks normal. User edits the visible text. Save writes `HERO_CONTENT.headlne = "New value"` into JSON. Now there's a phantom key that no component reads, and the real `headline` is unchanged. Public site never updates. "I edited the hero five times, why isn't it updating?"

**Why it happens:**
- `getNestedValue` silently falls back to children on missing paths (`inline-text.tsx:22-34`, CONCERNS §getNestedValue).
- No schema validation on writes.
- No dev-time console warning.

**How to avoid:**
- **Throw in development** when `getNestedValue` misses. `process.env.NODE_ENV === "development" && console.error(...)`.
- **Validate against manifest** in `updateContent` — reject paths not declared in the schema.
- TypeScript template-literal types for paths: `type ContentPath<T> = ...` so `field` autocomplete prevents typos at compile time. (Hard to get right; lower-priority polish.)
- A `npm run content:lint` script that scans all `<InlineText>` JSX and asserts every `contentKey + field` resolves in `content.json`.

**Warning signs:**
- "I edited it but it didn't save" reports where the diff is empty
- `content.json` accumulates unused top-level or nested keys over time
- No dev warnings on path miss

**Phase to address:**
Phase 2 (Editor primitives + manifest).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Deep-clone JSON on every keystroke (`JSON.parse(JSON.stringify)`) | Trivial to implement, no immer dep | Quadratic perf as content grows; visible typing lag at ~50 fields | Never beyond v2 scaffold; replace with immer in Phase 2 |
| `Record<string, any>` in admin provider | Fast to ship, no schema work | Typos silently no-op; phantom fields; no autocomplete | Acceptable in Phase 1 only; must be typed by Phase 2 manifest |
| `dangerouslySetInnerHTML` for "just one rich field" | 5-minute fix for italic support | Stored XSS, sanitization debt, audit nightmare | Never without DOMPurify on both write and render |
| Single shared `ADMIN_PASSWORD` | One env var, no user table | No audit trail, no revocation, leak = full rotation | Acceptable for 1–3 editors per `PROJECT.md`; revisit if team grows |
| Client-trusted `currentPath` in upload | Simple to wire | Path traversal → arbitrary repo write | Never; normalize and assert in Phase 1 |
| Save = full `content.json` PUT to GitHub | Simple, atomic, git history is the audit log | Two editors conflict on every save; deploy on every keystroke | Acceptable for v2; reconsider when conflict frequency > 1/week |
| Dual-write contentEditable (controlled + imperative DOM) | Looked like it worked in dev | Cursor jumping, IME bugs, races | Never; pick one model in Phase 2 |
| No schema for `content.json` | Move fast in early prototyping | Element delete crashes prod; rename = data loss | Only acceptable until element-delete ships; manifest required by Phase 2 |
| No tests | Faster v1 | Every fix is hand-tested; auth regressions invisible | Acceptable for marketing copy; never for auth/security code |
| Build-time content import (`import content from "..."`) | Static, fast, CDN-cached | Every edit = full rebuild = 1–3 min latency to live | Acceptable for v2 (matches "deploy on save" UX); reconsider if instant preview is a requirement |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Contents API | Treating SHA conflict (409) as a fatal error and discarding user edits | Refetch, three-way merge, retry; persist drafts to localStorage so reload doesn't nuke work |
| GitHub Contents API | Using a classic PAT with `repo` scope | Fine-grained PAT or GitHub App scoped to single repo + `contents: write` only |
| GitHub Contents API | Logging full error responses (may include rate-limit headers, repo metadata) | Log only `status + message`; redact headers |
| Vercel auto-deploy on commit | Assuming saves reflect instantly on the live site | Show "deploying… ETA 2 min" in the toolbar; don't promise instant updates; or move to KV for instant preview |
| Vercel build cache | Build-time `import content from "@/content/content.json"` invalidates the entire page tree on every save | Acceptable for marketing cadence; if hot, split content per page so only changed pages rebuild |
| Resend (contact form) | Not relevant to editor work, but: leaking admin email in `from` field | Use a no-reply alias |
| Tiptap / Lexical (if adopted later) | Treating the editor's JSON as the same shape as `content.json` | Serialize to a stable plain-text/Markdown representation before writing to `content.json`; never persist editor-internal node IDs |
| Next.js 16 App Router | Using `cookies()` synchronously (it's async since Next 15) | Always `await cookies()` — already done correctly in the codebase |
| React 19 contentEditable | Assuming `forwardRef` semantics from React 18 | React 19 passes refs directly; clean up `as any` casts in `inline-text.tsx` |
| Framer Motion + contentEditable | Animating an element while it's being edited resets caret | Disable animations on `[contenteditable=true]`; or wait for blur |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Deep-clone on every keystroke | Typing lag on mid-range laptop | `immer` + structural sharing | Visible at ~30 active editable elements (current trajectory) |
| Plain React Context for editor state | Every section re-renders on every keystroke | `useSyncExternalStore`, zustand, or jotai with selectors | Visible at ~10 sections; severe at 30 |
| Saving on every keystroke (vs. on blur + debounce) | GitHub rate-limit (5000/h), commit spam, deploy queue | Save on blur + debounce 500ms; batch multiple field edits into one save | Hits at ~1 edit per 2 seconds sustained |
| Editor wrappers using `<div>` instead of `display: contents` | Layout shifts between edit and public mode; CLS regressions | Position: absolute overlays for chrome | Visible immediately on any page with tight layout |
| Pulling full `content.json` (1846 lines) on every admin page load | Slow editor startup; bandwidth waste | Cache locally, fetch only sha+changed sections; or split file | Noticeable today, painful at 5000 lines |
| Re-running `setNestedValue` for every keystroke through React state | UI freezes during typing | Local component state during edit; commit to global on blur | Hits at ~3 fields edited per minute |
| Image uploads on the main thread | UI freeze during upload | `await fetch` is fine; show spinner; never block on `FileReader.readAsDataURL` for >1MB files | Hits at first 2MB+ image |
| Unbounded undo history | Memory bloat over long edit sessions | Cap at 50 entries; serialize to compact form | After ~30 minutes of editing |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Adding new `/api/admin/*` route without `requireAuth()` wrapper | Public RCE-by-content (re-instance of current bug) | Shared HOF wrapper; integration test per route asserting 401 without cookies |
| Trusting `event.clipboardData.getData("text/html")` from paste | Stored XSS via Word/HTML paste | Use `getData("text/plain")` or sanitize via DOMPurify with strict allowlist |
| Rendering any `content.json` field with `dangerouslySetInnerHTML` | Stored XSS shipped to every visitor at build time | Sanitize on write AND render; allowlist tags; never raw HTML in plain-text fields |
| Allowing SVG uploads | XSS if rendered inline; tracking via remote refs | Drop SVG from upload allowlist OR run SVGO sanitize-on-upload |
| Trusting client-supplied `currentPath` in upload | Path traversal → arbitrary file write in repo → arbitrary code deploy | `path.posix.normalize`, assert `startsWith("/public/images/uploads/")`, no `..` |
| Long-lived classic PAT with `repo` scope | Token leak = arbitrary repo write (code, not just content) | GitHub App or fine-grained PAT scoped to `contents:write` on one repo; rotate quarterly |
| `console.error` GitHub raw error responses | Leaking rate-limit headers, repo names, internal paths to Vercel logs | Log `status + sanitized message` only |
| No CSRF token on PUT routes | Once any XSS exists on the domain, full CMS takeover via authenticated cookie | Custom `x-csrf-token` double-submit; or require a header browsers can't forge cross-origin |
| No rate limit on `/api/admin/login` | Password brute-force | `@upstash/ratelimit` or in-memory bucket; lockout after 10 fails |
| Session = "presence of two cookies" instead of HMAC verification | Trivially forged session | `crypto.timingSafeEqual(sha256(session), tokenHash)` in middleware AND every route |
| `Set-Cookie: secure` only in production | Local dev cookie steal via HTTP in dev mode | Acceptable; document; never test prod creds locally |
| Storing the GitHub token in code or commits | Public repo → instant takeover | Vercel env var only; pre-commit hook to scan for `ghp_` / `github_pat_` strings |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| `alert("Gespeichert!")` for save feedback | Modal blocks workflow; feels like 2003 | Toast in corner with auto-dismiss; show "saving…" → "saved" → "deploy in ~2min" states |
| No "deploying" indicator after save | "I saved but the site doesn't update" confusion | Persistent status pill: "Vercel build in progress"; clear on next reload that succeeds |
| Hover-toolbar covers the element it edits | Can't see what you're editing | Position toolbar offset above element; reposition on viewport edge collisions |
| Click-to-edit with no visible affordance | Editors don't know what's editable | Subtle outline on hover (current dashed border is good) + cursor: text on hover |
| Delete with no confirm | Accidental destruction | Confirm modal for delete-block; inline undo toast for delete-element |
| No autosave + browser tab close | Lost edits | localStorage drafts + `beforeunload` warning when `hasChanges` |
| Modal-first editing despite "inline editor" promise | Cognitive whiplash; users don't know which path to use | Default to inline; modal only for "advanced fields" — explicit and rare |
| Cursor jumps when typing fast | Editor feels broken | See Pitfall 1 |
| Edit chrome contributes layout space | Page looks different in edit vs public | See Pitfall 13 |
| Clicking outside saves silently | Users don't know if they saved | Visible "unsaved changes" indicator; explicit save button stays primary |
| German UI for non-German fallback states (errors, tooltips) | Inconsistent with content language | Stay German per `PROJECT.md` constraint; lint for missed strings |
| Drag-handles that look like buttons | Mis-clicks | Distinct icon (⋮⋮) + cursor: grab; or skip drag entirely (Up/Down per `PROJECT.md`) |

## "Looks Done But Isn't" Checklist

- [ ] **Inline editing:** verify cursor stability while typing (no jumping); test on Chrome, Safari, Firefox, mobile Safari; test with German dead-key umlauts; test with one IME (Japanese keyboard suffices)
- [ ] **Inline editing:** verify paste from Word, Google Docs, Notion → all stripped to plain text; no `MsoNormal` in resulting JSON
- [ ] **Element delete:** verify deleting a `required: true` field is impossible from the UI; verify deleting any optional field doesn't crash the public render of any page
- [ ] **Element delete:** verify the deleted field doesn't reappear after reload (optimistic UI didn't lie)
- [ ] **Save flow:** verify GitHub commit message references the section edited; verify SHA is updated locally after save so the next edit doesn't 409
- [ ] **Save flow:** verify the user is told the live site won't update for ~2 minutes (deploy time)
- [ ] **Auth:** unauthenticated `curl` to every `/api/admin/*` route returns 401; integration test in CI
- [ ] **Auth:** forged cookies (random values for `admin_session` + `admin_token_hash`) are rejected by middleware AND by every route handler
- [ ] **Auth:** logout clears both cookies; subsequent admin page load redirects to login
- [ ] **Schema:** every section component has runtime fallback (`?.`) for every field that the manifest marks optional
- [ ] **Schema:** `npm run content:validate` exists and runs in CI on every PR
- [ ] **Schema:** schema migrations have a version marker and a tested migration script
- [ ] **Image upload:** SVGs rejected (or sanitized); path traversal attempt (`currentPath=/images/../../src/lib/constants.ts`) rejected with 400
- [ ] **Image upload:** uploaded image filename appears in `public/images/uploads/`, not somewhere else
- [ ] **Undo/redo:** Cmd+Z restores text correctly; doesn't undo across saves; doesn't trigger network calls; redo cleared after a new edit
- [ ] **Performance:** typing in any field has <16ms input latency on a 5-year-old MacBook Air
- [ ] **Performance:** opening the admin doesn't trigger more than 1 GitHub API call
- [ ] **Preview parity:** with edit chrome hidden, screenshot matches the public site within anti-aliasing
- [ ] **Conflict handling:** simulate two browser tabs editing different sections; both can save; second save doesn't lose the first
- [ ] **Conflict handling:** simulate two tabs editing the same field; second save shows a real choice, not "reload and lose everything"
- [ ] **Drafts:** close the tab mid-edit, reopen → drafts restored from localStorage
- [ ] **Error recovery:** intentionally bad JSON in a section → that section shows a placeholder, rest of page renders, edit link works

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Public site crashed by element-delete | LOW (if caught fast) | `git revert HEAD` on the content commit; redeploy; add the field to manifest as required |
| Public site defaced via unauthed API | MEDIUM | Revert content.json to previous commit; rotate `ADMIN_PASSWORD`; rotate `GITHUB_TOKEN`; ship Pitfall 9 fix immediately; audit logs for further damage |
| Stored XSS shipped to visitors | HIGH | Revert; rotate token; rotate admin password; audit visitor analytics for affected sessions; force re-deploy after sanitization shipped; consider notifying affected users if cookies were stealable |
| Cursor-jumping making editor unusable | LOW | Revert to last working commit of `inline-text.tsx`; ship the controlled/uncontrolled fix as a hotfix |
| Schema migration ate fields | MEDIUM | `git log content/content.json` → `git show <hash>` → manually merge lost fields back; ship migration test |
| Two editors conflict + lose work | LOW (if drafts persist) | Restore from localStorage drafts; if no drafts, recover from browser undo (sometimes possible); document and ship draft persistence |
| GitHub token compromised | HIGH | Revoke token in GitHub immediately; audit all recent commits to repo; rotate; consider repo audit for malicious changes |
| Image upload path-traversal exploited | HIGH | Audit `public/` and `src/` for unexpected file changes via `git log --diff-filter=A`; revert any malicious commits; ship normalize fix |
| Phantom field writes from typo'd paths | LOW | `git diff content/content.json` reveals phantom keys; remove manually; fix the typo; add lint to prevent recurrence |
| Editor loses unsaved work on conflict | LOW per incident, HIGH cumulatively for trust | Ship localStorage draft persistence; apologize; document |

## Pitfall-to-Phase Mapping

Mapping assumes a 5-phase roadmap: P1 Security blockers → P2 Editor primitives + manifest → P3 Per-element hover UX → P4 Polish/UX/Conflict → P5 Hardening + observability.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. Cursor jumping (contentEditable + React) | Phase 2 | Manual typing test in 4 browsers; React Profiler shows no re-render of editing element on `onInput` |
| 2. Element-delete crashing public render | Phase 2 (manifest) | Build-time validator + smoke test rendering every page after a synthetic delete |
| 3. Paste destroys layout | Phase 2 | Paste-from-Word test; assert resulting JSON is plain text |
| 4. IME / mobile keyboard input dropped | Phase 2 | Manual test on iOS Safari + Japanese IME; `compositionstart`/`compositionend` listeners present |
| 5. State desync DOM ↔ JSON | Phase 2 | Profiler shows single commit point on blur; integration test types-saves-reloads-asserts |
| 6. Schema migration footgun | Phase 2 | `__schemaVersion` marker; migration test suite; CI validates `content.json` against current manifest |
| 7. Performance death by re-render | Phase 2 + 3 | Profiler: <16ms keystroke; ≤1 component re-rendered per keystroke |
| 8. XSS via stored content | Phase 1 (audit + SVG) + deferred for rich text | grep for `dangerouslySetInnerHTML`; CSP header set; SVG removed from upload allowlist |
| 9. Auth holes — unguarded admin APIs | Phase 1 (already P0 in PROJECT.md) | Integration test: every `/api/admin/*` route returns 401 without cookies and 401 with forged cookies |
| 10. GitHub token blast radius | Phase 1 (path traversal, log redaction) + Phase 5 (App migration) | Path traversal attack returns 400; logs reviewed; rotation calendar in CLAUDE.md |
| 11. Undo/redo footguns | Phase 3 | Designed boundaries documented; image uploads explicitly excluded from undo; test rapid type→undo→redo |
| 12. Null-element crashes | Phase 2 (manifest) + Phase 3 (error boundaries) | Synthetic delete + render test; every section wrapped in error boundary |
| 13. Edit-mode ≠ public render | Phase 3 | Pixel-diff snapshot with chrome hidden vs public; `display: contents` audit |
| 14. Git conflicts on save | Phase 3 (drafts) + Phase 4 (merge) | localStorage draft test; two-tab conflict simulation; (later) three-way merge unit tests |
| 15. Phantom-field writes from typos | Phase 2 (manifest) | Dev console warnings on path miss; manifest validation rejects unknown paths; CI lint scan |

## Sources

- Codebase audit: `.planning/codebase/CONCERNS.md` (2026-04-09) — primary source for security and existing fragility
- Codebase architecture: `.planning/codebase/ARCHITECTURE.md` (2026-04-09) — primary source for current data flow
- Project requirements: `.planning/PROJECT.md` (2026-04-09)
- React 19 contentEditable patterns — well-documented in React docs and community post-mortems (Tiptap, Lexical, Slate.js issue trackers all catalog the cursor-jumping / IME / paste / mobile keyboard pitfalls). HIGH confidence — these are stable, decade-old failure modes.
- Divi / WordPress page builder ecosystem — schema-evolution and "delete-required-field crashes" are common in builder plugin issue trackers. HIGH confidence as a category.
- GitHub Contents API behavior — documented at docs.github.com/rest/repos/contents (409 on stale SHA, base64 encoding requirement). HIGH confidence.
- Personal experience: structured inline editors built on React 16/17/18; pitfalls 1, 5, 7, 11 are recurring across projects.

---
*Pitfalls research for: Inline visual editor on Next.js + content.json + GitHub*
*Researched: 2026-04-09*
