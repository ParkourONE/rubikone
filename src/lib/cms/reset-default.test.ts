/**
 * UX-04 — reset-to-default visibility.
 *
 * The HoverToolbar shows the Reset button only when the resolved
 * FieldSpec has a `default` value. We assert that by inspecting the
 * resolved field for both a defaulted path and a listless edge case.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { resolvePathToField } from "./path-to-field";
import { registerAllManifests } from "@/lib/blocks/manifests";

beforeAll(() => {
  registerAllManifests();
});

describe("reset-to-default (UX-04)", () => {
  it("text fields expose a default value for Reset", () => {
    const r = resolvePathToField("HERO_CONTENT.headline");
    expect(r).not.toBeNull();
    expect(r!.field.kind).toBe("text");
    expect(r!.field.default).toBeDefined();
  });

  it("button fields expose a button default", () => {
    const r = resolvePathToField("HERO_CONTENT.ctaPrimary");
    expect(r).not.toBeNull();
    expect(r!.field.kind).toBe("button");
    expect(r!.field.default).toEqual({ label: "", href: "" });
  });

  it("unknown path resolves to null (no Reset visible)", () => {
    const r = resolvePathToField("UNKNOWN_BLOCK.nope");
    expect(r).toBeNull();
  });
});
