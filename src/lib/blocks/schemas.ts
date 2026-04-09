/**
 * Shared zod schema helpers for block manifests.
 *
 * Every manifest top-level is a `blockObject()` which allows extra keys (for
 * forward-compatibility) and tolerates the nanoid `_id` migration field on
 * array items via `withId()`.
 */
import { z } from "zod";

/** Base object with unknown passthrough — migrations may add fields. */
export const blockObject = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).loose();

/** Array item: allow (and expect) a stable _id added by Phase 1 migration. */
export const withId = <T extends z.ZodRawShape>(shape: T) =>
  z
    .object({ _id: z.string().optional(), ...shape })
    .loose();

/** Standard CTA button shape {label, href}. */
export const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
}).loose();

/** Simple {label, href} nav link. */
export const linkSchema = ctaSchema;

export const nonEmptyString = z.string().min(1);
export const anyString = z.string();
