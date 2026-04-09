/**
 * InlineText primitive tests.
 * Covers: no cursor jump on external re-render, IME composition,
 * paste sanitization, Enter-blur vs. multiline, plain text stripping.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { InlineText } from "./InlineText";

function setup(props: Partial<React.ComponentProps<typeof InlineText>> = {}) {
  const onChange = vi.fn();
  const utils = render(
    <InlineText value={props.value ?? "hello"} onChange={onChange} editable {...props} />
  );
  const el = utils.container.querySelector("span") as HTMLElement;
  return { ...utils, el, onChange };
}

describe("InlineText", () => {
  it("renders the initial value", () => {
    const { el } = setup({ value: "hello world" });
    expect(el.textContent).toBe("hello world");
  });

  it("does not overwrite the DOM during focus (no cursor jump)", () => {
    const { el, rerender } = setup({ value: "hello" });
    el.focus();
    // Simulate the user having typed something — DOM is ahead of the prop.
    el.textContent = "hello!";
    // Parent re-renders with the OLD value (e.g. unrelated state update).
    rerender(<InlineText value="hello" editable />);
    // DOM content must NOT have been reset — user's edit is preserved.
    expect(el.textContent).toBe("hello!");
  });

  it("syncs external value when not focused", () => {
    const { el, rerender } = setup({ value: "hello" });
    // Element is not focused.
    rerender(<InlineText value="updated" editable />);
    expect(el.textContent).toBe("updated");
  });

  it("does not emit onChange during IME composition", () => {
    const { el, onChange } = setup({ value: "" });
    el.focus();
    fireEvent.compositionStart(el);
    el.textContent = "にほ";
    fireEvent.input(el);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.compositionEnd(el);
    expect(onChange).toHaveBeenCalledWith("にほ");
  });

  it("sanitizes pasted HTML to plain text", () => {
    const { el, onChange } = setup({ value: "" });
    el.focus();
    const dt = {
      getData: (type: string) =>
        type === "text/plain" ? "<b>bold</b> <script>x</script>text" : "",
    };
    act(() => {
      fireEvent.paste(el, { clipboardData: dt });
    });
    // Must not contain any element nodes inserted via paste.
    expect(el.querySelectorAll("*").length).toBe(0);
    // onChange fired with plain text.
    const last = onChange.mock.calls.at(-1)?.[0] ?? "";
    expect(last).not.toMatch(/<script>/i);
    expect(last).not.toMatch(/<b>/i);
  });

  it("Enter blurs in single-line mode", () => {
    const { el } = setup({ value: "hello", multiline: false });
    el.focus();
    expect(document.activeElement).toBe(el);
    fireEvent.keyDown(el, { key: "Enter" });
    expect(document.activeElement).not.toBe(el);
  });

  it("Enter does NOT blur in multiline mode", () => {
    const { el } = setup({ value: "hello", multiline: true });
    el.focus();
    fireEvent.keyDown(el, { key: "Enter" });
    expect(document.activeElement).toBe(el);
  });
});
