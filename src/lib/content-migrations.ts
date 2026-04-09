/**
 * Content schema migration chain.
 * Each migration takes the tree at version N and returns the tree at N+1.
 * Add new migrations by pushing to `migrations` — never mutate existing ones.
 */

export const CURRENT_SCHEMA_VERSION = 1;

type Migration = (tree: Record<string, unknown>) => Record<string, unknown>;

// v1 is the baseline: stable _id on array blocks + __schemaVersion root key.
// No migrations needed yet — future versions append here.
const migrations: Record<number, Migration> = {};

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
