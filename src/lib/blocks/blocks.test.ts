/**
 * Tests for the block manifest registry and validator (MAN-01..04).
 */
import { describe, it, expect, beforeEach } from "vitest";
import { z } from "zod";
import {
  registerBlock,
  getManifest,
  listBlocks,
  clearRegistry,
  validateBlock,
  validateContent,
} from "./registry";
import type { BlockManifest } from "./types";

describe("block registry", () => {
  beforeEach(() => clearRegistry());

  it("registers, retrieves and lists blocks", () => {
    const m: BlockManifest<{ headline: string }> = {
      id: "TEST_BLOCK",
      label: "Test",
      schema: z.object({ headline: z.string() }),
      fields: [{ kind: "text", path: "headline", required: true }],
    };
    registerBlock(m);
    expect(getManifest("TEST_BLOCK")).toBe(m);
    expect(listBlocks()).toHaveLength(1);
  });

  it("returns undefined for unknown blocks", () => {
    expect(getManifest("NOPE")).toBeUndefined();
  });

  it("validateBlock accepts valid values", () => {
    registerBlock({
      id: "A",
      label: "A",
      schema: z.object({ x: z.string() }),
      fields: [],
    });
    expect(validateBlock("A", { x: "ok" })).toEqual([]);
  });

  it("validateBlock rejects missing required", () => {
    registerBlock({
      id: "A",
      label: "A",
      schema: z.object({ x: z.string() }),
      fields: [],
    });
    const issues = validateBlock("A", {});
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].blockId).toBe("A");
  });

  it("validateBlock accepts missing optional", () => {
    registerBlock({
      id: "A",
      label: "A",
      schema: z.object({ x: z.string(), y: z.string().optional() }),
      fields: [],
    });
    expect(validateBlock("A", { x: "ok" })).toEqual([]);
  });

  it("validateBlock errors on unknown block id", () => {
    const issues = validateBlock("MISSING", {});
    expect(issues[0].message).toMatch(/No manifest/);
  });
});

describe("validateContent against real manifests", () => {
  beforeEach(async () => {
    clearRegistry();
    const { registerAllManifests } = await import("./manifests");
    registerAllManifests();
  });

  it("happy path: full content.json passes", async () => {
    const tree: Record<string, unknown> = {};
    // Seed a minimal valid tree for every manifest by relying on the real
    // content.json fixture exported via require.
    const content = (await import("@/content/content.json")).default as Record<
      string,
      unknown
    >;
    Object.assign(tree, content);
    const issues = validateContent(tree);
    expect(issues).toEqual([]);
  });

  it("rejects HERO_CONTENT missing required headline", async () => {
    await import("./manifests");
    const issues = validateBlock("HERO_CONTENT", {
      headlineAccent: "x",
      subheadline: "x",
      videoUrl: "x",
      ctaPrimary: { label: "a", href: "b" },
      ctaSecondary: { label: "a", href: "b" },
    });
    expect(issues.length).toBeGreaterThan(0);
  });

  it("rejects TESTIMONIALS when shape is wrong", async () => {
    await import("./manifests");
    const issues = validateBlock("TESTIMONIALS", [{ quote: 123 }]);
    expect(issues.length).toBeGreaterThan(0);
  });

  it("rejects NINE_MOVEMENTS entry missing image", async () => {
    await import("./manifests");
    const issues = validateBlock("NINE_MOVEMENTS", [
      { id: "greifen", name: "Greifen", description: "desc" },
    ]);
    expect(issues.some((i) => i.path.includes("image"))).toBe(true);
  });
});
