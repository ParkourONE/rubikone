import { describe, it, expect, beforeAll } from "vitest";
import { resolvePathToField } from "./path-to-field";
import { registerAllManifests } from "@/lib/blocks/manifests";

beforeAll(() => {
  registerAllManifests();
});

describe("resolvePathToField", () => {
  it("resolves a top-level scalar field", () => {
    const r = resolvePathToField("HERO_CONTENT.headline");
    expect(r).not.toBeNull();
    expect(r?.blockId).toBe("HERO_CONTENT");
    expect(r?.field.kind).toBe("text");
    expect(r?.field.path).toBe("headline");
    expect(r?.insideList).toBe(false);
  });

  it("resolves a nested scalar (ctaPrimary.label is a button field)", () => {
    const r = resolvePathToField("HERO_CONTENT.ctaPrimary");
    expect(r?.field.kind).toBe("button");
    expect(r?.field.path).toBe("ctaPrimary");
  });

  it("resolves inside a named list", () => {
    const r = resolvePathToField("FAQ_ITEMS[0].question");
    expect(r?.blockId).toBe("FAQ_ITEMS");
    expect(r?.insideList).toBe(true);
    expect(r?.field.path).toBe("question");
    expect(r?.listIndex).toBe(0);
  });

  it("resolves inside a dotted list path", () => {
    const r = resolvePathToField("FOOTER_LINKS.hauptseiten[2].label");
    expect(r?.insideList).toBe(true);
    expect(r?.field.path).toBe("label");
    expect(r?.listPath).toBe("hauptseiten");
  });

  it("returns null for unknown block id", () => {
    expect(resolvePathToField("UNKNOWN_BLOCK.foo")).toBeNull();
  });

  it("flags required fields", () => {
    const r = resolvePathToField("HERO_CONTENT.headline");
    expect(r?.field.required).toBe(true);
  });
});
