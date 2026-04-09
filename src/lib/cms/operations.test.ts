import { describe, it, expect } from "vitest";
import { applyPatches } from "immer";
import { applyOp, applyOps, type Op } from "./operations";

function seed() {
  return {
    hero: { headline: "Hi", sub: "there" },
    items: [
      { _id: "a", label: "One" },
      { _id: "b", label: "Two" },
      { _id: "c", label: "Three" },
    ],
  };
}

describe("applyOp", () => {
  it("set updates a scalar and round-trips via inversePatches", () => {
    const tree = seed();
    const op: Op = { type: "set", path: "hero.headline", value: "Hello" };
    const { next, patches, inversePatches } = applyOp(tree, op);
    expect(next.hero.headline).toBe("Hello");
    expect(patches.length).toBeGreaterThan(0);
    const undone = applyPatches(next, inversePatches);
    expect(undone).toEqual(tree);
  });

  it("insert appends by default and inserts at index when given", () => {
    const tree = seed();
    const appended = applyOp(tree, {
      type: "insert",
      path: "items",
      value: { _id: "z", label: "Z" },
    }).next;
    expect(appended.items).toHaveLength(4);
    expect(appended.items[3]).toEqual({ _id: "z", label: "Z" });

    const inserted = applyOp(tree, {
      type: "insert",
      path: "items",
      value: { _id: "x", label: "X" },
      index: 1,
    });
    expect(inserted.next.items[1]).toEqual({ _id: "x", label: "X" });
    const undone = applyPatches(inserted.next, inserted.inversePatches);
    expect(undone).toEqual(tree);
  });

  it("delete removes an array element and round-trips", () => {
    const tree = seed();
    const { next, inversePatches } = applyOp(tree, {
      type: "delete",
      path: "items[1]",
    });
    expect(next.items).toHaveLength(2);
    expect(next.items.map((i) => i._id)).toEqual(["a", "c"]);
    const undone = applyPatches(next, inversePatches);
    expect(undone).toEqual(tree);
  });

  it("move reorders within the same parent array and round-trips", () => {
    const tree = seed();
    const { next, inversePatches } = applyOp(tree, {
      type: "move",
      path: "items[0]",
      toIndex: 2,
    });
    expect(next.items.map((i) => i._id)).toEqual(["b", "c", "a"]);
    const undone = applyPatches(next, inversePatches);
    expect(undone).toEqual(tree);
  });

  it("duplicate inserts a deep clone with a fresh _id at index+1", () => {
    const tree = seed();
    const { next, inversePatches } = applyOp(tree, {
      type: "duplicate",
      path: "items[1]",
    });
    expect(next.items).toHaveLength(4);
    expect(next.items[1]._id).toBe("b");
    expect(next.items[2].label).toBe("Two");
    expect(next.items[2]._id).not.toBe("b");
    expect(typeof next.items[2]._id).toBe("string");

    // Source and duplicate are distinct object identities.
    expect(next.items[2]).not.toBe(next.items[1]);

    const undone = applyPatches(next, inversePatches);
    expect(undone.items).toHaveLength(3);
  });
});

describe("applyOps", () => {
  it("applies a batch and the inverse undoes the whole batch", () => {
    const tree = seed();
    const ops: Op[] = [
      { type: "set", path: "hero.headline", value: "A" },
      { type: "set", path: "hero.sub", value: "B" },
      { type: "insert", path: "items", value: { _id: "d", label: "Four" } },
    ];
    const { next, inversePatches } = applyOps(tree, ops);
    expect(next.hero.headline).toBe("A");
    expect(next.hero.sub).toBe("B");
    expect(next.items).toHaveLength(4);

    const undone = applyPatches(next, inversePatches);
    expect(undone).toEqual(tree);
  });
});
