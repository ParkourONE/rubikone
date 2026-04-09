# Phase 1 — Security + Foundations — Plan

## Approach

### SEC-01 / SEC-02: Admin auth hardening
- Create `src/lib/admin-auth.ts` exporting:
  - `createSession(): string` — HMAC-signed cookie value `base64(ts).hmac_sha256(ADMIN_PASSWORD, base64(ts))`.
  - `verifySession(value: string | undefined): boolean` — verifies HMAC + 7d max age (constant-time compare).
  - `isAuthenticated(req?: NextRequest): Promise<boolean>` — reads `admin_session` cookie from either a passed request or `next/headers` cookies.
  - `SESSION_COOKIE = "admin_session"`, `SESSION_MAX_AGE_SECONDS = 7*24*3600`.
- Login route: replaces random token + hash-cookie with single HMAC cookie, drops `admin_token_hash`.
- Middleware: Edge runtime uses Web Crypto for HMAC verify (no node `crypto`). Matcher extended to `/api/admin/:path*`. Login + content + upload routes all call `isAuthenticated()` top of handler.
- Root `layout.tsx` updated to detect admin via new cookie (not `admin_token_hash`).

### SEC-03: Upload path traversal
- `path.normalize` + `path.resolve(publicDir, currentPath)`; reject if not `startsWith(publicDir + sep)` or contains `..`.

### SEC-04: SVG rejected
- Remove `image/svg+xml` from allowed list. Clear German error. No DOMPurify yet (YAGNI).

### SEC-05: Login rate limit
- Module-level `Map<ip, {count, resetAt}>`. 5 attempts / 15 min per IP. IP from `x-forwarded-for` fallback `request.headers.get('x-real-ip')`.

### FND-01: content-path helpers
- Zero-dep impl in `src/lib/content-path.ts`, uses `structuredClone`. Ops: parsePath, getAt, setAt, insertAt, deleteAt, moveAt.

### FND-02: Vitest
- devDeps: vitest, @vitest/ui, @testing-library/react, @testing-library/jest-dom, jsdom.
- `vitest.config.ts` with jsdom + alias, `src/test/setup.ts` importing jest-dom.
- Tests in `src/lib/content-path.test.ts`.

### FND-03: Sonner Toaster
- Install `sonner`. Mount `<Toaster />` inside `AdminProviderInner` (admin-only; not on public pages).
- `src/app/admin/layout.tsx` also gets Toaster for the `/admin/login` page since it lives outside AdminProvider. (Minimal; admin-scoped.)

### FND-04 / FND-05: Migration + schemaVersion
- `scripts/migrate-content-ids.mjs`: walks content.json, adds `_id: nanoid(10)` to objects in array contexts. Sets `__schemaVersion: 1`. Writes back.
- `src/lib/content-migrations.ts`: `migrateContent(raw)` reads `__schemaVersion`, runs chain (empty at v1), returns content. Wired into `src/lib/constants.ts` as `const content = migrateContent(rawContent as any)`.

## Decisions / Gotchas
- Middleware runs in Edge runtime → must use Web Crypto (`crypto.subtle`) not Node `crypto`. API routes (Node runtime) use Node crypto.
- `isAuthenticated()` in API routes uses `next/headers` cookies (Node runtime async). Middleware uses its own inline verify.
- Toaster duplicated (admin layout + provider) is acceptable; public site never renders either.
- Rate limiter is in-memory — OK for single Vercel instance, noted for future.
- NINE_MOVEMENTS decoupling (MAN-05) is Phase 2 scope.
