"use client";

/**
 * InlineText — low-level contentEditable primitive.
 *
 * Design contract:
 *  - UNCONTROLLED while focused. We never write innerText/textContent to
 *    the DOM during the user's typing. `value` is only synced into the
 *    DOM when (a) the element is NOT focused AND (b) the incoming value
 *    differs from what the DOM currently shows. This avoids the classic
 *    cursor-jump bug.
 *  - IME-safe. compositionstart/compositionend are tracked; we do NOT
 *    emit onChange while composing.
 *  - Paste is sanitized: preventDefault + insert plain text only, and
 *    DOMPurify strips any HTML on the clipboard string as a safety net.
 *  - `multiline` defaults to false. When false, Enter blurs the element.
 *    When true, Enter inserts a newline normally.
 *
 * This component has NO admin-provider coupling — it's a reusable primitive.
 */

import DOMPurify from "isomorphic-dompurify";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface InlineTextProps {
  value: string;
  onChange?: (next: string) => void;
  onCommit?: (next: string) => void;
  editable?: boolean;
  multiline?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
}

type AnyElement = HTMLElement;

function sanitizePlainText(input: string): string {
  // Strip all HTML, return plain text. DOMPurify with empty allow list.
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

export const InlineText = forwardRef<HTMLElement, InlineTextProps>(
  function InlineText(
    {
      value,
      onChange,
      onCommit,
      editable = false,
      multiline = false,
      as = "span",
      className,
      placeholder,
      ariaLabel,
    },
    forwardedRef
  ) {
    const ref = useRef<AnyElement | null>(null);
    const composingRef = useRef(false);
    const lastEmittedRef = useRef<string>(value);

    useImperativeHandle(forwardedRef, () => ref.current as HTMLElement, []);

    // Sync external value -> DOM, but only when NOT focused / composing,
    // and only when the DOM genuinely differs. This is the core safety
    // against cursor jumping during typing.
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      if (composingRef.current) return;
      const isFocused = document.activeElement === el;
      if (isFocused) return;
      if ((el.textContent ?? "") !== value) {
        el.textContent = value;
      }
      lastEmittedRef.current = value;
    }, [value]);

    // On mount, seed the DOM content if it's empty.
    useEffect(() => {
      const el = ref.current;
      if (el && el.textContent !== value) {
        el.textContent = value;
        lastEmittedRef.current = value;
      }
      // run once — subsequent updates go through the sync effect above.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const emit = useCallback(
      (next: string) => {
        if (next === lastEmittedRef.current) return;
        lastEmittedRef.current = next;
        onChange?.(next);
      },
      [onChange]
    );

    const handleInput = useCallback(() => {
      if (composingRef.current) return;
      const el = ref.current;
      if (!el) return;
      emit(el.textContent ?? "");
    }, [emit]);

    const handleCompositionStart = useCallback(() => {
      composingRef.current = true;
    }, []);

    const handleCompositionEnd = useCallback(() => {
      composingRef.current = false;
      const el = ref.current;
      if (!el) return;
      emit(el.textContent ?? "");
    }, [emit]);

    const handleBlur = useCallback(() => {
      const el = ref.current;
      if (!el) return;
      const next = el.textContent ?? "";
      emit(next);
      onCommit?.(next);
    }, [emit, onCommit]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
        if (e.key === "Escape") {
          (e.currentTarget as HTMLElement).blur();
        }
      },
      [multiline]
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        const raw = e.clipboardData.getData("text/plain");
        const clean = sanitizePlainText(raw);
        const text = multiline ? clean : clean.replace(/[\r\n]+/g, " ");

        // Insert at the current selection.
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const node = document.createTextNode(text);
        range.insertNode(node);
        // Move caret after the inserted node.
        range.setStartAfter(node);
        range.setEndAfter(node);
        selection.removeAllRanges();
        selection.addRange(range);

        // Emit the new value manually — `input` will typically fire too,
        // but we guard against inconsistent browser behaviour.
        const el = ref.current;
        if (el) emit(el.textContent ?? "");
      },
      [emit, multiline]
    );

    // Create the element dynamically based on `as`.
    const Tag = as as unknown as React.ElementType;

    return (
      <Tag
        ref={ref as unknown as React.Ref<HTMLElement>}
        className={className}
        contentEditable={editable}
        suppressContentEditableWarning
        role={editable ? "textbox" : undefined}
        aria-multiline={editable && multiline ? true : undefined}
        aria-label={ariaLabel}
        data-placeholder={placeholder}
        onInput={editable ? handleInput : undefined}
        onBlur={editable ? handleBlur : undefined}
        onKeyDown={editable ? handleKeyDown : undefined}
        onPaste={editable ? handlePaste : undefined}
        onCompositionStart={editable ? handleCompositionStart : undefined}
        onCompositionEnd={editable ? handleCompositionEnd : undefined}
      />
    );
  }
);
