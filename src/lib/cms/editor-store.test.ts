import { describe, it, expect, beforeEach } from "vitest";
import {
  useEditorStore,
  undo,
  redo,
  canUndo,
  canRedo,
  clearHistory,
} from "./editor-store";

function reset() {
  clearHistory();
  useEditorStore.setState({
    content: null,
    sha: null,
    dirty: false,
    pendingOps: [],
  });
}

describe("editor-store", () => {
  beforeEach(() => reset());

  it("applyOpToStore updates content, sets dirty, and queues the op", () => {
    useEditorStore.getState().setContent(
      { hero: { headline: "Hi" } },
      "sha1"
    );
    useEditorStore.getState().applyOpToStore({
      type: "set",
      path: "hero.headline",
      value: "Hello",
    });
    const s = useEditorStore.getState();
    expect((s.content as { hero: { headline: string } }).hero.headline).toBe(
      "Hello"
    );
    expect(s.dirty).toBe(true);
    expect(s.pendingOps).toHaveLength(1);
    expect(s.pendingOps[0].type).toBe("set");
  });

  it("supports a single undo/redo round trip", () => {
    useEditorStore.getState().setContent(
      { hero: { headline: "Hi" } },
      "sha1"
    );
    clearHistory(); // wipe the setContent history entry
    useEditorStore.getState().applyOpToStore({
      type: "set",
      path: "hero.headline",
      value: "Hello",
    });
    expect(canUndo()).toBe(true);

    undo();
    expect(
      (useEditorStore.getState().content as { hero: { headline: string } })
        .hero.headline
    ).toBe("Hi");
    expect(canRedo()).toBe(true);

    redo();
    expect(
      (useEditorStore.getState().content as { hero: { headline: string } })
        .hero.headline
    ).toBe("Hello");
  });

  it("takeSnapshot / restoreSnapshot roll back without touching history", () => {
    useEditorStore.getState().setContent(
      { hero: { headline: "Hi" } },
      "sha1"
    );
    clearHistory();
    const snap = useEditorStore.getState().takeSnapshot();

    useEditorStore.getState().applyOpToStore({
      type: "set",
      path: "hero.headline",
      value: "Changed",
    });
    expect(
      (useEditorStore.getState().content as { hero: { headline: string } })
        .hero.headline
    ).toBe("Changed");

    const undoCountBefore = canUndo();
    useEditorStore.getState().restoreSnapshot(snap);
    expect(
      (useEditorStore.getState().content as { hero: { headline: string } })
        .hero.headline
    ).toBe("Hi");
    // History should be unchanged by the restore (same past-state count).
    expect(canUndo()).toBe(undoCountBefore);
  });
});
