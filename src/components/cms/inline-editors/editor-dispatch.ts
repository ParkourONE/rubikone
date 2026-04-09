/**
 * Lightweight dispatcher that lets the HoverToolbar request a popover
 * editor for a given field kind. The `InlineEditors` component registers
 * itself on mount so the dispatcher can route the request.
 */
import type { FieldKind } from "@/lib/blocks/types";

export interface OpenEditorArgs {
  kind: FieldKind;
  path: string;
  anchor: { top: number; left: number; width: number; height: number };
}

type Dispatcher = (
  kind: FieldKind,
  path: string,
  anchor: OpenEditorArgs["anchor"]
) => void;

let currentDispatcher: Dispatcher | null = null;

export function setInlineEditorDispatcher(fn: Dispatcher | null): void {
  currentDispatcher = fn;
}

export function getInlineEditorDispatcher(): Dispatcher | null {
  return currentDispatcher;
}
