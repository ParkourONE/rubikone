#!/usr/bin/env node
/**
 * One-shot migration:
 *  - Adds stable `_id` (nanoid) to every object inside an array in content.json
 *  - Adds root `__schemaVersion: 1` if missing
 *
 * Idempotent: existing `_id` values are preserved.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = resolve(__dirname, "../src/content/content.json");

function walk(node) {
  if (Array.isArray(node)) {
    for (const item of node) {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        if (typeof item._id !== "string" || item._id.length === 0) {
          item._id = nanoid(10);
        }
      }
      walk(item);
    }
    return;
  }
  if (node && typeof node === "object") {
    for (const key of Object.keys(node)) {
      walk(node[key]);
    }
  }
}

const raw = readFileSync(CONTENT_PATH, "utf-8");
const tree = JSON.parse(raw);

walk(tree);

if (typeof tree.__schemaVersion !== "number") {
  // Put __schemaVersion at the top by rebuilding the object
  const withVersion = { __schemaVersion: 1, ...tree };
  // Remove any duplicated key and re-add at top
  delete withVersion.__schemaVersion;
  const out = { __schemaVersion: 1, ...withVersion };
  writeFileSync(CONTENT_PATH, JSON.stringify(out, null, 2) + "\n", "utf-8");
} else {
  writeFileSync(CONTENT_PATH, JSON.stringify(tree, null, 2) + "\n", "utf-8");
}

console.log("Migrated content.json: added _id to array items and __schemaVersion.");
