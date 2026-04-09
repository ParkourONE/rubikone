import { describe, it, expect } from "vitest";
import { migrateContent, CURRENT_SCHEMA_VERSION } from "./content-migrations";

describe("migrateContent", () => {
  it("bumps __schemaVersion to current", () => {
    const out = migrateContent({
      __schemaVersion: 0,
      NINE_MOVEMENTS: [],
    });
    expect(out.__schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  });

  it("v1->v2 adds image by id to NINE_MOVEMENTS entries", () => {
    const out = migrateContent({
      __schemaVersion: 1,
      NINE_MOVEMENTS: [
        { id: "greifen", name: "Greifen", description: "d" },
        { id: "hangeln", name: "Hangeln", description: "d" },
      ],
    }) as unknown as {
      NINE_MOVEMENTS: Array<{ id: string; image: string }>;
    };
    expect(out.NINE_MOVEMENTS[0].image).toBe("/images/posten/greifen.jpg");
    expect(out.NINE_MOVEMENTS[1].image).toBe("/images/posten/hangeln.jpg");
  });

  it("v1->v2 preserves existing images", () => {
    const out = migrateContent({
      __schemaVersion: 1,
      NINE_MOVEMENTS: [
        { id: "greifen", name: "g", description: "d", image: "/custom.jpg" },
      ],
    }) as unknown as { NINE_MOVEMENTS: Array<{ image: string }> };
    expect(out.NINE_MOVEMENTS[0].image).toBe("/custom.jpg");
  });

  it("v1->v2 falls back to positional when id is unknown", () => {
    const out = migrateContent({
      __schemaVersion: 1,
      NINE_MOVEMENTS: [
        { id: "xyz", name: "x", description: "d" },
      ],
    }) as unknown as { NINE_MOVEMENTS: Array<{ image: string }> };
    expect(out.NINE_MOVEMENTS[0].image).toBe("/images/posten/greifen.jpg");
  });
});
