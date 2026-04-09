/**
 * Immutable helpers for navigating/editing a JSON content tree using
 * dot/bracket notation paths like `hero.ctas[0].label`.
 */

export type PathSegment = string | number;
export type Path = PathSegment[];
export type Tree = unknown;

/**
 * Parse a path string into segments.
 * Accepts: "a.b", "a[0].b", "a.0.b", "a[0][1]".
 * Numeric bracket segments and numeric dot segments become numbers.
 */
export function parsePath(input: string | Path): Path {
  if (Array.isArray(input)) return input.slice();
  if (typeof input !== "string") {
    throw new TypeError("parsePath: path must be a string or array");
  }
  if (input.length === 0) return [];
  const out: Path = [];
  const re = /([^.[\]]+)|\[(\d+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    if (m[2] !== undefined) {
      out.push(Number(m[2]));
    } else {
      const seg = m[1];
      // Bare numeric dot-segments become numbers (e.g. "list.0.name")
      if (/^\d+$/.test(seg)) out.push(Number(seg));
      else out.push(seg);
    }
  }
  return out;
}

function clone<T>(v: T): T {
  return structuredClone(v);
}

function isIndex(v: PathSegment): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

export function getAt(tree: Tree, path: string | Path): unknown {
  const parts = parsePath(path);
  let cur: unknown = tree;
  for (const p of parts) {
    if (cur == null) return undefined;
    if (isIndex(p)) {
      if (!Array.isArray(cur)) return undefined;
      cur = cur[p];
    } else {
      if (typeof cur !== "object") return undefined;
      cur = (cur as Record<string, unknown>)[p];
    }
  }
  return cur;
}

export function setAt(tree: Tree, path: string | Path, value: unknown): Tree {
  const parts = parsePath(path);
  if (parts.length === 0) return value;
  const root = clone(tree);
  let cur: unknown = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const next = parts[i + 1];
    if (isIndex(p)) {
      if (!Array.isArray(cur)) throw new Error(`setAt: expected array at segment ${i}`);
      if (cur[p] == null) {
        cur[p] = isIndex(next) ? [] : {};
      }
      cur = cur[p];
    } else {
      if (cur == null || typeof cur !== "object" || Array.isArray(cur)) {
        throw new Error(`setAt: expected object at segment ${i}`);
      }
      const obj = cur as Record<string, unknown>;
      if (obj[p] == null) {
        obj[p] = isIndex(next) ? [] : {};
      }
      cur = obj[p];
    }
  }
  const last = parts[parts.length - 1];
  if (isIndex(last)) {
    if (!Array.isArray(cur)) throw new Error("setAt: expected array at final segment");
    cur[last] = value;
  } else {
    if (cur == null || typeof cur !== "object" || Array.isArray(cur)) {
      throw new Error("setAt: expected object at final segment");
    }
    (cur as Record<string, unknown>)[last] = value;
  }
  return root;
}

/**
 * Insert `value` into the array at `path`. If `index` is undefined, append.
 * The path must resolve to an array.
 */
export function insertAt(
  tree: Tree,
  path: string | Path,
  value: unknown,
  index?: number
): Tree {
  const parts = parsePath(path);
  const root = clone(tree);
  const target =
    parts.length === 0 ? root : (getAt(root, parts) as unknown);
  if (!Array.isArray(target)) {
    throw new Error("insertAt: target is not an array");
  }
  const i =
    index === undefined
      ? target.length
      : Math.max(0, Math.min(index, target.length));
  target.splice(i, 0, value);
  if (parts.length === 0) return target;
  return setAt(root, parts, target);
}

/**
 * Delete the value at `path`. If the parent is an array, splices it out.
 * If the parent is an object, deletes the key.
 * Deleting the root returns undefined.
 */
export function deleteAt(tree: Tree, path: string | Path): Tree {
  const parts = parsePath(path);
  if (parts.length === 0) return undefined;
  const root = clone(tree);
  const parentPath = parts.slice(0, -1);
  const last = parts[parts.length - 1];
  const parent =
    parentPath.length === 0 ? root : (getAt(root, parentPath) as unknown);
  if (parent == null) return root;
  if (Array.isArray(parent)) {
    if (!isIndex(last)) throw new Error("deleteAt: array parent requires numeric index");
    if (last < 0 || last >= parent.length) return root;
    parent.splice(last, 1);
  } else if (typeof parent === "object") {
    delete (parent as Record<string, unknown>)[String(last)];
  } else {
    throw new Error("deleteAt: parent is not object or array");
  }
  return root;
}

/**
 * Move an element from fromPath to a new index within the SAME parent array.
 */
export function moveAt(
  tree: Tree,
  fromPath: string | Path,
  toIndex: number
): Tree {
  const parts = parsePath(fromPath);
  if (parts.length === 0) throw new Error("moveAt: cannot move root");
  const root = clone(tree);
  const parentPath = parts.slice(0, -1);
  const last = parts[parts.length - 1];
  if (!isIndex(last)) throw new Error("moveAt: fromPath must end in array index");
  const parent =
    parentPath.length === 0 ? root : (getAt(root, parentPath) as unknown);
  if (!Array.isArray(parent)) throw new Error("moveAt: parent is not an array");
  if (last < 0 || last >= parent.length) return root;
  const clamped = Math.max(0, Math.min(toIndex, parent.length - 1));
  const [item] = parent.splice(last, 1);
  parent.splice(clamped, 0, item);
  return root;
}
