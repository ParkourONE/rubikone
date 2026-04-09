/**
 * Block registry entry point.
 *
 * Importing this module has the side-effect of registering every section
 * manifest defined under `src/lib/blocks/manifests.ts`. Admin/tooling code
 * should import from here; public section components MUST NOT import
 * anything under `src/lib/blocks/**`.
 */
import "./manifests";

export { registerBlock, getManifest, listBlocks, validateBlock, validateContent } from "./registry";
export type { BlockManifest, FieldSpec, FieldKind, ValidationIssue } from "./types";
