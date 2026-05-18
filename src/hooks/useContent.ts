"use client";

import { createContext, createElement, useContext, type ReactNode } from "react";
import { useAdmin } from "@/providers/admin-provider";

// Override context — when a dynamic block renders, it wraps its children in
// `<BlockContentOverrideProvider value={{[CANONICAL_KEY]: blockContent}}>`.
// useContent consults this first so existing section components read the
// per-block content without any prop refactor.
export const BlockContentOverrideContext = createContext<Record<string, unknown> | null>(null);

export function BlockContentOverrideProvider({
  value,
  children,
}: {
  value: Record<string, unknown>;
  children: ReactNode;
}) {
  return createElement(BlockContentOverrideContext.Provider, { value }, children);
}

export function useContent<T>(key: string, staticValue: T): T {
  const override = useContext(BlockContentOverrideContext);
  const { isAdmin, content } = useAdmin();
  if (override && key in override) {
    return override[key] as T;
  }
  if (isAdmin && content && key in content) {
    return content[key] as T;
  }
  return staticValue;
}
