import { describe, it, expect, beforeAll } from "vitest";
import { validateTree, countIssues } from "./validate-tree";
import { registerAllManifests } from "@/lib/blocks/manifests";
import { getManifest } from "@/lib/blocks/registry";
import content from "@/content/content.json";

beforeAll(() => {
  registerAllManifests();
});

describe("validateTree", () => {
  it("returns an empty map for a valid tree", () => {
    const map = validateTree(content as Record<string, unknown>);
    expect(countIssues(map)).toBe(0);
    expect(Object.keys(map)).toHaveLength(0);
  });

  it("returns {} for null input", () => {
    expect(validateTree(null)).toEqual({});
  });

  it("returns a populated map for an invalid tree", () => {
    // Pick any registered block and corrupt it.
    const tree = JSON.parse(JSON.stringify(content)) as Record<string, unknown>;
    // Find the first block whose manifest exists.
    let blockId: string | null = null;
    for (const k of Object.keys(tree)) {
      if (getManifest(k)) {
        blockId = k;
        break;
      }
    }
    expect(blockId).not.toBeNull();
    // Replace with a clearly invalid shape.
    tree[blockId as string] = { __broken: true };
    const map = validateTree(tree);
    expect(map[blockId as string]).toBeDefined();
    expect(map[blockId as string].length).toBeGreaterThan(0);
    expect(countIssues(map)).toBeGreaterThan(0);
  });
});
