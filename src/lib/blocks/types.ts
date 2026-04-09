/**
 * Block manifest types.
 *
 * A manifest describes the editable surface of one section (= one top-level
 * key in content.json). Each FieldSpec points at a slot inside that block and
 * names its editor kind (text, image, button, ...). A zod schema guards the
 * actual shape; the FieldSpecs drive the visual editor UI.
 *
 * Important: `src/lib/blocks/**` is admin/tooling-only. Do NOT import from
 * public section components — Phase 3 will enforce this via dynamic loading.
 */
import type { ZodType } from "zod";

export type FieldKind =
  | "text"
  | "richtext"
  | "image"
  | "button"
  | "link"
  | "icon"
  | "list";

export interface FieldSpec {
  /** Editor widget type. */
  kind: FieldKind;
  /**
   * Dot/bracket path into the block root (NOT into content.json root).
   * Examples: "headline", "ctaPrimary.label", "features[0].title".
   * For list items, use the plain path to the array ("features").
   */
  path: string;
  /** If false, delete/reset controls are allowed on this field. */
  required: boolean;
  /** Human-readable label for the editor UI. */
  label?: string;
  /** Default value used by reset / new-item creation. */
  default?: unknown;
  /**
   * For kind === "list": describes the shape of a single item via nested
   * FieldSpecs with item-relative paths.
   */
  itemFields?: FieldSpec[];
}

export interface BlockManifest<T = unknown> {
  /** Stable id, matches the top-level key in content.json. */
  id: string;
  /** Short human label for the admin UI. */
  label: string;
  /** Zod schema that validates the block value. */
  schema: ZodType<T>;
  /** Editable slots declared for the visual editor. */
  fields: FieldSpec[];
}

export interface ValidationIssue {
  blockId: string;
  path: string;
  message: string;
}
