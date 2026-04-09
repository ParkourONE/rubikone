/**
 * UX-03 — validate-tree helper.
 *
 * Runs `validateContent(tree)` against the block registry and groups the
 * resulting issues by block id. The shape is optimised for the overlay
 * consumer: `validationByBlock[blockId]` → list of {path, message}.
 *
 * Admin-only module.
 */
import { validateContent } from "@/lib/blocks/registry";

export interface BlockIssue {
  path: string;
  message: string;
}

export type ValidationMap = Record<string, BlockIssue[]>;

export function validateTree(
  tree: Record<string, unknown> | null | undefined
): ValidationMap {
  if (!tree) return {};
  const issues = validateContent(tree);
  const map: ValidationMap = {};
  for (const issue of issues) {
    // Skip "block missing from content.json" noise — that's a migration
    // concern, not something we want to flag on every page render.
    if (issue.path === "" && issue.message.includes("missing from content.json")) {
      continue;
    }
    if (!map[issue.blockId]) map[issue.blockId] = [];
    map[issue.blockId].push({ path: issue.path, message: issue.message });
  }
  return map;
}

export function countIssues(map: ValidationMap): number {
  let n = 0;
  for (const k in map) n += map[k].length;
  return n;
}
