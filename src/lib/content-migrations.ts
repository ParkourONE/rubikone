/**
 * Content schema migration chain.
 * Each migration takes the tree at version N and returns the tree at N+1.
 * Add new migrations by pushing to `migrations` — never mutate existing ones.
 */

export const CURRENT_SCHEMA_VERSION = 2;

type Migration = (tree: Record<string, unknown>) => Record<string, unknown>;

// v1 is the baseline: stable _id on array blocks + __schemaVersion root key.
// v2 (MAN-05): move NINE_MOVEMENTS images out of the positional zip in
// constants.ts into the content entries themselves so reorder/delete is safe.
const NINE_MOVEMENTS_IMAGES_V2: Record<string, string> = {
  greifen: "/images/posten/greifen.jpg",
  hangeln: "/images/posten/hangeln.jpg",
  stuetzen: "/images/posten/stuetzen.jpg",
  springen: "/images/posten/springen.jpg",
  balancieren: "/images/posten/balancieren.jpg",
  landen: "/images/posten/landen.jpg",
  klettern: "/images/posten/klettern.jpg",
  rollen: "/images/posten/rollen.jpg",
  laufen: "/images/posten/laufen.jpg",
};

// Positional fallback (mirrors the old zip order in constants.ts) for entries
// whose `id` field is not in the map above.
const NINE_MOVEMENTS_POSITIONAL_V2 = [
  "/images/posten/greifen.jpg",
  "/images/posten/hangeln.jpg",
  "/images/posten/stuetzen.jpg",
  "/images/posten/springen.jpg",
  "/images/posten/balancieren.jpg",
  "/images/posten/landen.jpg",
  "/images/posten/klettern.jpg",
  "/images/posten/rollen.jpg",
  "/images/posten/laufen.jpg",
];

const migrations: Record<number, Migration> = {
  1: (tree) => {
    const raw = tree.NINE_MOVEMENTS;
    if (!Array.isArray(raw)) return tree;
    const next = raw.map((entry, i) => {
      if (!entry || typeof entry !== "object") return entry;
      const e = entry as Record<string, unknown>;
      if (typeof e.image === "string" && e.image.length > 0) return e;
      const byId =
        typeof e.id === "string"
          ? NINE_MOVEMENTS_IMAGES_V2[e.id]
          : undefined;
      return {
        ...e,
        image: byId ?? NINE_MOVEMENTS_POSITIONAL_V2[i] ?? "",
      };
    });
    return { ...tree, NINE_MOVEMENTS: next };
  },
};

export function migrateContent<T extends Record<string, unknown>>(raw: T): T {
  if (!raw || typeof raw !== "object") return raw;
  let current: Record<string, unknown> = raw;
  let version =
    typeof current.__schemaVersion === "number" ? current.__schemaVersion : 0;

  while (version < CURRENT_SCHEMA_VERSION) {
    const mig = migrations[version];
    if (!mig) {
      // No migration registered: bump version and move on.
      current = { ...current, __schemaVersion: version + 1 };
      version += 1;
      continue;
    }
    current = mig(current);
    version += 1;
    current = { ...current, __schemaVersion: version };
  }
  return current as T;
}
