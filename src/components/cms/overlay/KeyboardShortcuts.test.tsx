/**
 * EDIT-12 — Keyboard shortcut gating tests.
 *
 * Verifies shortcuts are ignored when focus is inside an input, textarea,
 * or contenteditable — so text editing inside the overlay keeps working.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import {
  EditModeProvider,
  SelectionProvider,
} from "@/components/cms/edit-mode-context";
import { useEditorStore, clearHistory } from "@/lib/cms/editor-store";

// Mock sonner (useSave imports it transitively)
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function Harness() {
  return (
    <EditModeProvider initial={true}>
      <SelectionProvider>
        <KeyboardShortcuts />
        <input data-testid="input" />
        <div
          data-testid="editable"
          contentEditable
          suppressContentEditableWarning
        >
          hello
        </div>
      </SelectionProvider>
    </EditModeProvider>
  );
}

describe("KeyboardShortcuts gating", () => {
  beforeEach(() => {
    clearHistory();
    useEditorStore.setState({
      content: { hero: { headline: "Hi" } },
      sha: "sha1",
      dirty: false,
      pendingOps: [],
    });
    useEditorStore.getState().applyOpToStore({
      type: "set",
      path: "hero.headline",
      value: "A",
    });
    useEditorStore.getState().applyOpToStore({
      type: "set",
      path: "hero.headline",
      value: "B",
    });
  });

  it("Cmd+Z on the window triggers undo", () => {
    render(<Harness />);
    expect(
      (useEditorStore.getState().content as { hero: { headline: string } })
        .hero.headline
    ).toBe("B");
    fireEvent.keyDown(window, { key: "z", metaKey: true });
    expect(
      (useEditorStore.getState().content as { hero: { headline: string } })
        .hero.headline
    ).toBe("A");
  });

  it("Cmd+Z is ignored when target is an input", () => {
    const { getByTestId } = render(<Harness />);
    const input = getByTestId("input") as HTMLInputElement;
    input.focus();
    fireEvent.keyDown(input, { key: "z", metaKey: true, bubbles: true });
    // Still at "B" — no undo
    expect(
      (useEditorStore.getState().content as { hero: { headline: string } })
        .hero.headline
    ).toBe("B");
  });

  it("Cmd+Z is ignored when target is contenteditable", () => {
    const { getByTestId } = render(<Harness />);
    const editable = getByTestId("editable") as HTMLElement;
    editable.focus();
    fireEvent.keyDown(editable, { key: "z", metaKey: true, bubbles: true });
    expect(
      (useEditorStore.getState().content as { hero: { headline: string } })
        .hero.headline
    ).toBe("B");
  });
});
