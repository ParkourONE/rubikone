/**
 * Operation reducer — admin-only.
 *
 * Pure functions that transform a content tree via discrete editor operations.
 * Uses immer's `produceWithPatches` so every `applyOp` returns RFC-6902 style
 * forward + inverse patches alongside the next tree. Phase 4b/4c will wire
 * these into the PATCH endpoint and the undo/redo stack.
 *
 * IMPORTANT: keep this module admin-gated. It must not be imported by any
 * public-page code path. The Phase 3 dynamic-import boundary in
 * `admin-provider.tsx` still applies.
 */
import { produceWithPatches, enablePatches, current, isDraft, type Patch } from "immer";
import { nanoid } from "nanoid";
import { parsePath, getAt, type Path, type PathSegment } from "@/lib/content-path";

enablePatches();

export type Op =
  | { type: "set"; path: string; value: unknown }
  | { type: "insert"; path: string; value: unknown; index?: number }
  | { type: "delete"; path: string }
  | { type: "move"; path: string; toIndex: number }
  | { type: "duplicate"; path: string };

export interface ApplyOpResult<T> {
  next: T;
  patches: Patch[];
  inversePatches: Patch[];
}

function isIndex(v: PathSegment): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

/** Walk a parsed path against a mutable immer draft, returning the resolved
 *  parent container plus the final segment. Throws if the path is invalid. */
function resolveParent(
  draft: unknown,
  parts: Path
): { parent: Record<string, unknown> | unknown[]; last: PathSegment } {
  if (parts.length === 0) throw new Error("operations: empty path");
  let cur: unknown = draft;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur == null || typeof cur !== "object") {
      throw new Error(`operations: cannot descend into null at segment ${i}`);
    }
    if (isIndex(p)) {
      if (!Array.isArray(cur)) {
        throw new Error(`operations: expected array at segment ${i}`);
      }
      cur = cur[p];
    } else {
      cur = (cur as Record<string, unknown>)[p as string];
    }
  }
  if (cur == null || typeof cur !== "object") {
    throw new Error("operations: parent is not an object or array");
  }
  return {
    parent: cur as Record<string, unknown> | unknown[],
    last: parts[parts.length - 1],
  };
}

function deepCloneWithFreshIds(value: unknown): unknown {
  // `value` may be an immer draft (when called from inside produceWithPatches);
  // structuredClone can't handle draft proxies, so unwrap via `current()` first.
  const plain = isDraft(value) ? current(value as object) : value;
  const cloned = structuredClone(plain);
  // Only rewrite the top-level _id (stable identity of the duplicated item).
  // Nested arrays of blocks keep their ids — Phase 4b/4c can revisit if needed.
  if (
    cloned &&
    typeof cloned === "object" &&
    !Array.isArray(cloned) &&
    "_id" in (cloned as Record<string, unknown>)
  ) {
    (cloned as Record<string, unknown>)._id = nanoid();
  }
  return cloned;
}

/**
 * Apply a single operation against `tree`, returning the next tree plus the
 * forward + inverse immer patches.
 */
export function applyOp<T>(tree: T, op: Op): ApplyOpResult<T> {
  const [next, patches, inversePatches] = produceWithPatches(tree, (draft) => {
    switch (op.type) {
      case "set": {
        const parts = parsePath(op.path);
        if (parts.length === 0) {
          throw new Error("operations.set: cannot set root");
        }
        const { parent, last } = resolveParent(draft, parts);
        if (Array.isArray(parent)) {
          if (!isIndex(last)) {
            throw new Error("operations.set: array parent requires numeric index");
          }
          parent[last] = op.value;
        } else {
          parent[last as string] = op.value;
        }
        break;
      }

      case "insert": {
        const parts = parsePath(op.path);
        // Path resolves to the target array itself.
        let target: unknown = draft;
        for (const p of parts) {
          if (target == null || typeof target !== "object") {
            throw new Error("operations.insert: invalid path");
          }
          target = isIndex(p)
            ? (target as unknown[])[p]
            : (target as Record<string, unknown>)[p as string];
        }
        if (!Array.isArray(target)) {
          throw new Error("operations.insert: target is not an array");
        }
        const i =
          op.index === undefined
            ? target.length
            : Math.max(0, Math.min(op.index, target.length));
        target.splice(i, 0, op.value);
        break;
      }

      case "delete": {
        const parts = parsePath(op.path);
        if (parts.length === 0) {
          throw new Error("operations.delete: cannot delete root");
        }
        const { parent, last } = resolveParent(draft, parts);
        if (Array.isArray(parent)) {
          if (!isIndex(last)) {
            throw new Error("operations.delete: array parent requires numeric index");
          }
          if (last >= 0 && last < parent.length) parent.splice(last, 1);
        } else {
          delete parent[last as string];
        }
        break;
      }

      case "move": {
        const parts = parsePath(op.path);
        if (parts.length === 0) throw new Error("operations.move: cannot move root");
        const { parent, last } = resolveParent(draft, parts);
        if (!Array.isArray(parent)) {
          throw new Error("operations.move: parent is not an array");
        }
        if (!isIndex(last)) {
          throw new Error("operations.move: path must end in array index");
        }
        if (last < 0 || last >= parent.length) break;
        const clamped = Math.max(0, Math.min(op.toIndex, parent.length - 1));
        const [item] = parent.splice(last, 1);
        parent.splice(clamped, 0, item);
        break;
      }

      case "duplicate": {
        const parts = parsePath(op.path);
        if (parts.length === 0) {
          throw new Error("operations.duplicate: cannot duplicate root");
        }
        const { parent, last } = resolveParent(draft, parts);
        if (!Array.isArray(parent)) {
          throw new Error("operations.duplicate: parent is not an array");
        }
        if (!isIndex(last)) {
          throw new Error("operations.duplicate: path must end in array index");
        }
        if (last < 0 || last >= parent.length) break;
        // Read from the original tree (current draft value is fine — it's
        // identical to tree at this point because we haven't mutated the
        // target index yet).
        const original = parent[last];
        const copy = deepCloneWithFreshIds(original);
        parent.splice(last + 1, 0, copy);
        break;
      }

      default: {
        const _exhaustive: never = op;
        throw new Error(`operations: unknown op type: ${JSON.stringify(_exhaustive)}`);
      }
    }
  });
  return { next: next as T, patches, inversePatches };
}

/**
 * Apply an ordered list of ops. Returns the final tree plus the concatenated
 * forward + inverse patches (inverse patches are returned in reverse order so
 * `applyPatches(tree, inversePatches)` undoes the whole batch).
 */
export function applyOps<T>(tree: T, ops: Op[]): ApplyOpResult<T> {
  let next = tree;
  const patches: Patch[] = [];
  const inversePatches: Patch[] = [];
  for (const op of ops) {
    const res = applyOp(next, op);
    next = res.next;
    patches.push(...res.patches);
    // Prepend so that applying the inverse list in order undoes last-first.
    inversePatches.unshift(...res.inversePatches);
  }
  return { next, patches, inversePatches };
}

// Re-export for consumers that want to read values alongside an op.
export { getAt };
