/**
 * In-memory block manifest registry.
 *
 * Call `registerBlock()` from per-section manifest files; `src/lib/blocks/index.ts`
 * imports all of them for side-effects so that `getManifest` / `listBlocks`
 * return a fully-populated registry.
 */
import type { BlockManifest, ValidationIssue } from "./types";

const REGISTRY = new Map<string, BlockManifest<unknown>>();

export function registerBlock<T>(manifest: BlockManifest<T>): void {
  REGISTRY.set(manifest.id, manifest as BlockManifest<unknown>);
}

export function getManifest(id: string): BlockManifest<unknown> | undefined {
  return REGISTRY.get(id);
}

export function listBlocks(): BlockManifest<unknown>[] {
  return Array.from(REGISTRY.values());
}

export function clearRegistry(): void {
  REGISTRY.clear();
}

/**
 * Validate a single block against its manifest. Returns a list of issues;
 * empty array means valid.
 */
export function validateBlock(
  blockId: string,
  value: unknown
): ValidationIssue[] {
  const manifest = REGISTRY.get(blockId);
  if (!manifest) {
    return [
      {
        blockId,
        path: "",
        message: `No manifest registered for block "${blockId}".`,
      },
    ];
  }
  const result = manifest.schema.safeParse(value);
  if (result.success) return [];
  return result.error.issues.map((issue) => ({
    blockId,
    path: issue.path.join("."),
    message: issue.message,
  }));
}

/**
 * Validate an entire content.json tree against every registered manifest.
 * Keys not in the registry are ignored (e.g. __schemaVersion, PAGE_BLOCKS).
 */
export function validateContent(
  tree: Record<string, unknown>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const manifest of REGISTRY.values()) {
    if (!(manifest.id in tree)) {
      issues.push({
        blockId: manifest.id,
        path: "",
        message: "Block missing from content.json.",
      });
      continue;
    }
    issues.push(...validateBlock(manifest.id, tree[manifest.id]));
  }
  return issues;
}
