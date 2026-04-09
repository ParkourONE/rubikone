"use client";

/**
 * TextEditor — floating textarea popover for inline text editing.
 *
 * The HoverToolbar used to promote the rendered element into
 * `contenteditable`, but React still owns the text content via JSX expressions
 * like `{heroContent.headline}`. On any re-render (which happens for every
 * store update) React would overwrite the user's typing. This popover avoids
 * the conflict by letting the user type into a fully React-controlled
 * textarea anchored to the element's visual position.
 */

import { useEffect, useRef, useState } from "react";

interface Props {
  initial: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export function TextEditor({ initial, onSave, onCancel }: Props) {
  const [value, setValue] = useState(initial);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.focus();
    ta.select();
  }, []);

  return (
    <div className="p-3 space-y-3">
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={Math.min(10, Math.max(2, value.split("\n").length + 1))}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00a8ab]"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
            return;
          }
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onSave(value);
          }
        }}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-gray-500">
          ⌘⏎ speichern · Esc verwerfen
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={() => onSave(value)}
            className="px-3 py-1.5 text-xs rounded-md bg-[#00a8ab] text-white hover:bg-[#008f91]"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
