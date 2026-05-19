"use client";

import { useAdmin } from "@/providers/admin-provider";

export function useContent<T>(key: string, staticValue: T): T {
  const { isAdmin, content } = useAdmin();
  if (isAdmin && content && key in content) {
    return content[key] as T;
  }
  return staticValue;
}
