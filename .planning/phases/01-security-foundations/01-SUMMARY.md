# Phase 1 — Security + Foundations — Summary

All 10 v1 requirements shipped. Build passes. 24/24 vitest tests green.

## Requirement → Commit

| ID | Requirement | Commit |
|----|-------------|--------|
| SEC-01 | isAuthenticated() in every admin API handler | `c6d9b76`, `0e04ff1` |
| SEC-02 | Middleware verifies HMAC-signed session | `c6d9b76` |
| SEC-03 | Upload path-traversal hardening | `0e04ff1` |
| SEC-04 | SVG upload rejected | `0e04ff1` |
| SEC-05 | Login rate-limit (5 / 15 min / IP) | `c6d9b76` |
| FND-01 | src/lib/content-path.ts helpers | `1e3b7d9` |
| FND-02 | Vitest + @testing-library/* | `ceb04d4` |
| FND-03 | Sonner Toaster in admin shell | `660bfbd` |
| FND-04 | Stable nanoid _id via migration | `4458dab` |
| FND-05 | __schemaVersion + migrateContent chain | `4458dab` |

## Key Decisions

- **HMAC session**: Stateless `base64url(ts).base64url(HMAC-SHA256(ADMIN_PASSWORD, ts))`, 7-day max age, constant-time verify. Node `crypto` in API routes, Web Crypto in Edge middleware.
- **Middleware matcher now covers `/api/admin/:path*`** in addition to `/admin/:path*`.
- **Upload**: SVG hard-rejected (DOMPurify explicitly skipped per instructions default). `path.posix.normalize` against a virtual root prevents traversal.
- **Rate limit**: in-memory Map keyed by IP. Good enough for single-instance Vercel; noted for future Redis migration.
- **Toaster**: mounted inside `AdminProviderInner` (admin-only) AND inside `src/app/admin/layout.tsx` (for login page). Never on public pages.
- **schemaVersion**: v1 is baseline, migration map is empty — future versions append.
- **Content migration**: idempotent, gives every array-item object an `_id` while preserving existing ones.

## Discoveries

- Untracked `get-shit-done/` directory contains SDK code with missing deps that breaks `tsc`. Added to `tsconfig.json` excludes.
- Root `layout.tsx` previously gated admin UI on the old `admin_token_hash` cookie; now uses `verifySession()`.
- NINE_MOVEMENTS image coupling (MAN-05) left for Phase 2 per scope.

## For Phase 2

- Migration chain infra is in place — register new migrations in `content-migrations.ts`.
- `_id` on all array items is ready for use by block manifests.
- `content-path.ts` is the canonical tree editor — use from the patch endpoint.
- Login page still uses `alert()` — swap to sonner toast when visiting PERS-04.
- Rate-limit Map lives in module scope; if Phase 3 introduces edge runtime for login, this needs a rethink.
