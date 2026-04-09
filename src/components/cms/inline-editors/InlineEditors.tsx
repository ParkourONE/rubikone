"use client";

/**
 * InlineEditors host — EDIT-03..07.
 *
 * Single component mounted once inside the admin shell. It registers a
 * dispatcher so the hover toolbar can open the right popover editor for
 * the currently selected field (image, button, link, icon).
 *
 * Text editing is handled inline in the HoverToolbar (focus contenteditable),
 * not here.
 */

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useEditorStore } from "@/lib/cms/editor-store";
import type { FieldKind } from "@/lib/blocks/types";
import {
  setInlineEditorDispatcher,
  type OpenEditorArgs,
} from "./editor-dispatch";
import { ImageEditor } from "./ImageEditor";
import { ButtonEditor } from "./ButtonEditor";
import { LinkEditor } from "./LinkEditor";
import { IconEditor } from "./IconEditor";

interface OpenState {
  kind: FieldKind;
  path: string;
  anchor: OpenEditorArgs["anchor"];
}

export function InlineEditors() {
  const [open, setOpen] = useState<OpenState | null>(null);

  useEffect(() => {
    setInlineEditorDispatcher((kind, path, anchor) => {
      setOpen({ kind, path, anchor });
    });
    return () => setInlineEditorDispatcher(null);
  }, []);

  const close = useCallback(() => setOpen(null), []);

  const applyOpToStore = useEditorStore((s) => s.applyOpToStore);
  const getValueAtPath = useEditorStore((s) => s.getValueAtPath);

  if (!open || typeof document === "undefined") return null;

  const { kind, path, anchor } = open;

  const top = Math.min(
    window.innerHeight - 40,
    anchor.top + anchor.height + 8
  );
  const left = Math.max(
    8,
    Math.min(window.innerWidth - 360, anchor.left)
  );

  const current = getValueAtPath(path);

  let body: React.ReactNode = null;
  if (kind === "image") {
    body = (
      <ImageEditor
        value={typeof current === "string" ? current : ""}
        onSave={(url) => {
          applyOpToStore({ type: "set", path, value: url });
          close();
        }}
        onCancel={close}
      />
    );
  } else if (kind === "button") {
    const val = (current as { label?: string; href?: string }) ?? {};
    body = (
      <ButtonEditor
        initialLabel={val.label ?? ""}
        initialHref={val.href ?? ""}
        onSave={(label, href) => {
          applyOpToStore({ type: "set", path: `${path}.label`, value: label });
          applyOpToStore({ type: "set", path: `${path}.href`, value: href });
          close();
        }}
        onCancel={close}
      />
    );
  } else if (kind === "link") {
    const val = (current as { label?: string; href?: string; target?: string }) ?? {};
    body = (
      <LinkEditor
        initialLabel={val.label ?? ""}
        initialHref={val.href ?? ""}
        initialTarget={val.target ?? ""}
        onSave={(label, href, target) => {
          applyOpToStore({ type: "set", path: `${path}.label`, value: label });
          applyOpToStore({ type: "set", path: `${path}.href`, value: href });
          applyOpToStore({ type: "set", path: `${path}.target`, value: target });
          close();
        }}
        onCancel={close}
      />
    );
  } else if (kind === "icon") {
    body = (
      <IconEditor
        value={typeof current === "string" ? current : ""}
        onSelect={(name) => {
          applyOpToStore({ type: "set", path, value: name });
          close();
        }}
        onCancel={close}
      />
    );
  } else {
    body = (
      <div className="p-4 text-sm text-gray-500">
        No inline editor for kind <code>{kind}</code>.
      </div>
    );
  }

  return createPortal(
    <div
      data-cms-overlay="popover"
      className="fixed z-[2147483002] w-[340px] rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
      style={{ top, left }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
          {kind}
        </span>
        <button
          type="button"
          onClick={close}
          className="p-1 rounded hover:bg-gray-200"
          aria-label="Schließen"
        >
          <X size={14} />
        </button>
      </div>
      <div>{body}</div>
    </div>,
    document.body
  );
}
