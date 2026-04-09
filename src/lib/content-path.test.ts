import { describe, it, expect } from "vitest";
import {
  parsePath,
  getAt,
  setAt,
  insertAt,
  deleteAt,
  moveAt,
} from "./content-path";

describe("parsePath", () => {
  it("parses dot notation", () => {
    expect(parsePath("a.b.c")).toEqual(["a", "b", "c"]);
  });
  it("parses bracket indices as numbers", () => {
    expect(parsePath("a[0].b")).toEqual(["a", 0, "b"]);
  });
  it("parses dotted numeric segments as numbers", () => {
    expect(parsePath("list.0.name")).toEqual(["list", 0, "name"]);
  });
  it("handles nested brackets", () => {
    expect(parsePath("a[0][1].x")).toEqual(["a", 0, 1, "x"]);
  });
  it("handles empty string", () => {
    expect(parsePath("")).toEqual([]);
  });
  it("accepts array passthrough", () => {
    expect(parsePath(["a", 0])).toEqual(["a", 0]);
  });
});

describe("getAt", () => {
  const tree = { a: { b: [{ c: 1 }, { c: 2 }] } };
  it("reads nested value", () => {
    expect(getAt(tree, "a.b[0].c")).toBe(1);
    expect(getAt(tree, "a.b[1].c")).toBe(2);
  });
  it("returns undefined for missing keys", () => {
    expect(getAt(tree, "a.x")).toBeUndefined();
    expect(getAt(tree, "a.b[9].c")).toBeUndefined();
  });
  it("returns tree for empty path", () => {
    expect(getAt(tree, "")).toBe(tree);
  });
});

describe("setAt", () => {
  it("is immutable", () => {
    const tree = { a: { b: 1 } };
    const next = setAt(tree, "a.b", 2) as { a: { b: number } };
    expect(next.a.b).toBe(2);
    expect(tree.a.b).toBe(1);
  });
  it("sets nested array index", () => {
    const tree = { list: [{ name: "x" }, { name: "y" }] };
    const next = setAt(tree, "list[1].name", "z") as typeof tree;
    expect(next.list[1].name).toBe("z");
  });
  it("replaces root on empty path", () => {
    expect(setAt({ a: 1 }, "", { b: 2 })).toEqual({ b: 2 });
  });
});

describe("insertAt", () => {
  it("appends by default", () => {
    const tree = { list: [1, 2] };
    const next = insertAt(tree, "list", 3) as typeof tree;
    expect(next.list).toEqual([1, 2, 3]);
    expect(tree.list).toEqual([1, 2]);
  });
  it("inserts at index", () => {
    const tree = { list: [1, 3] };
    const next = insertAt(tree, "list", 2, 1) as typeof tree;
    expect(next.list).toEqual([1, 2, 3]);
  });
  it("clamps out-of-bounds index", () => {
    const tree = { list: [1, 2] };
    const next = insertAt(tree, "list", 9, 99) as typeof tree;
    expect(next.list).toEqual([1, 2, 9]);
  });
  it("throws if target is not array", () => {
    expect(() => insertAt({ a: 1 }, "a", 0)).toThrow();
  });
});

describe("deleteAt", () => {
  it("removes array element", () => {
    const tree = { list: [1, 2, 3] };
    const next = deleteAt(tree, "list[1]") as typeof tree;
    expect(next.list).toEqual([1, 3]);
    expect(tree.list).toEqual([1, 2, 3]);
  });
  it("removes object key", () => {
    const next = deleteAt({ a: 1, b: 2 }, "b") as Record<string, number>;
    expect(next).toEqual({ a: 1 });
  });
  it("no-op on out-of-bounds array index", () => {
    const tree = { list: [1] };
    const next = deleteAt(tree, "list[5]") as typeof tree;
    expect(next.list).toEqual([1]);
  });
  it("root delete returns undefined", () => {
    expect(deleteAt({ a: 1 }, "")).toBeUndefined();
  });
});

describe("moveAt", () => {
  it("moves within an array", () => {
    const tree = { list: ["a", "b", "c", "d"] };
    const next = moveAt(tree, "list[0]", 2) as typeof tree;
    expect(next.list).toEqual(["b", "c", "a", "d"]);
    expect(tree.list).toEqual(["a", "b", "c", "d"]);
  });
  it("clamps toIndex", () => {
    const tree = { list: [1, 2, 3] };
    const next = moveAt(tree, "list[0]", 99) as typeof tree;
    expect(next.list).toEqual([2, 3, 1]);
  });
  it("no-op for out-of-range from", () => {
    const tree = { list: [1, 2] };
    const next = moveAt(tree, "list[5]", 0) as typeof tree;
    expect(next.list).toEqual([1, 2]);
  });
  it("throws on root", () => {
    expect(() => moveAt([1, 2], "", 0)).toThrow();
  });
});
