/**
 * Path → FieldSpec resolver.
 *
 * Given a fully-qualified content path like
 * `HERO_CONTENT.ctaPrimary.label` or `TESTIMONIALS[0].quote`, walk the
 * registered block manifest for the root-level key and return the best
 * matching FieldSpec.
 *
 * Matching rules:
 *  - The first path segment is the block id (top-level key in content.json).
 *  - The remaining "block-relative" path is matched against the manifest's
 *    FieldSpecs. Array indices in the block-relative path are normalised to
 *    the list item's relative path (the segment inside `itemFields`).
 *  - Exact matches win; otherwise the longest suffix match wins.
 *
 * Admin-only module. Do not import from public code.
 */
// Import the block registry entry point (not registry.ts directly) so the
// side-effect import of manifests.ts runs and every section is registered
// on the client. Importing only `@/lib/blocks/registry` gave us an empty
// registry and resolvePathToField always returned null.
import { getManifest } from "@/lib/blocks";
import type { FieldSpec } from "@/lib/blocks/types";
import { parsePath, type Path } from "@/lib/content-path";

export interface ResolvedField {
  blockId: string;
  field: FieldSpec;
  /** True when the path points at a list item scalar (e.g. `TEAM[0].name`). */
  insideList: boolean;
  /** The enclosing list FieldSpec when `insideList` is true. */
  parentList?: FieldSpec;
  /** The index of the list item the path refers to, when inside a list. */
  listIndex?: number;
  /** Path of the enclosing array (block-root-relative). */
  listPath?: string;
}

function pathKey(parts: Path): string {
  // Produce a canonical "label[0].foo" string form for matching.
  let out = "";
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (typeof p === "number") {
      out += `[${p}]`;
    } else {
      if (i > 0) out += ".";
      out += p;
    }
  }
  return out;
}

/** Strip numeric segments to produce a structural key used for manifest match. */
function structuralKey(parts: Path): string {
  return parts.filter((p) => typeof p !== "number").join(".");
}

export function resolvePathToField(fullPath: string): ResolvedField | null {
  const parts = parsePath(fullPath);
  if (parts.length === 0) return null;
  const blockId = String(parts[0]);
  const manifest = getManifest(blockId);
  if (!manifest) return null;

  const rel = parts.slice(1);
  if (rel.length === 0) return null;

  const relStruct = structuralKey(rel);
  const relStr = pathKey(rel);

  // 1. exact structural match on a top-level field.
  for (const field of manifest.fields) {
    if (field.kind === "list") continue;
    if (field.path === relStruct || field.path === relStr) {
      return { blockId, field, insideList: false };
    }
  }

  // 2. list-scoped match: find a list field whose path is a prefix of rel
  //    (accounting for the numeric index of the list item).
  for (const field of manifest.fields) {
    if (field.kind !== "list" || !field.itemFields) continue;
    // The list's `path` is the array path relative to the block root.
    // For top-level arrays (e.g. NAVIGATION_ITEMS) the stored path is "".
    const listPath = field.path;
    // Determine whether the first non-empty segments of `rel` match listPath.
    let remainder: Path;
    let matchedListIndex: number | null = null;
    if (listPath === "") {
      // rel must start with [index]...
      if (rel.length < 1 || typeof rel[0] !== "number") continue;
      matchedListIndex = rel[0] as number;
      remainder = rel.slice(1);
    } else {
      const listParts = parsePath(listPath);
      if (rel.length <= listParts.length) continue;
      let ok = true;
      for (let i = 0; i < listParts.length; i++) {
        if (rel[i] !== listParts[i]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      const afterList = rel.slice(listParts.length);
      if (afterList.length < 1 || typeof afterList[0] !== "number") continue;
      matchedListIndex = afterList[0] as number;
      remainder = afterList.slice(1);
    }

    // If remainder is empty the path points at the list item itself.
    if (remainder.length === 0) {
      return {
        blockId,
        field,
        insideList: true,
        parentList: field,
        listIndex: matchedListIndex,
        listPath,
      };
    }
    const remainderStruct = structuralKey(remainder);
    for (const itemField of field.itemFields) {
      if (itemField.path === remainderStruct || itemField.path === pathKey(remainder)) {
        return {
          blockId,
          field: itemField,
          insideList: true,
          parentList: field,
          listIndex: matchedListIndex,
          listPath,
        };
      }
    }
  }

  // 3. longest-suffix fallback over all top-level non-list fields.
  let best: FieldSpec | null = null;
  for (const field of manifest.fields) {
    if (field.kind === "list") continue;
    if (relStruct.endsWith(field.path) || relStr.endsWith(field.path)) {
      if (!best || field.path.length > best.path.length) best = field;
    }
  }
  if (best) return { blockId, field: best, insideList: false };
  return null;
}
