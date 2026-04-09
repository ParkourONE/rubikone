#!/usr/bin/env node
/**
 * Build-time content validator (MAN-03).
 * Runs under tsx so .ts imports work directly.
 * Exits non-zero with a clear report on any schema violation.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");

const blocks = await import(
  path.join(projectRoot, "src/lib/blocks/index.ts")
);
const migrations = await import(
  path.join(projectRoot, "src/lib/content-migrations.ts")
);

const contentPath = path.join(projectRoot, "src/content/content.json");
const raw = require(contentPath);
const migrated = migrations.migrateContent(raw);

const issues = blocks.validateContent(migrated);
if (issues.length === 0) {
  console.log(
    `content.json OK — validated ${blocks.listBlocks().length} blocks.`
  );
  process.exit(0);
}

console.error(`content.json FAILED validation — ${issues.length} issue(s):`);
for (const issue of issues) {
  const loc = issue.path ? " " + issue.path : "";
  console.error(`  [${issue.blockId}]${loc}: ${issue.message}`);
}
process.exit(1);
