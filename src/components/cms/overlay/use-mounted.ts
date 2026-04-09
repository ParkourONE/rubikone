"use client";

import { useEffect, useState } from "react";

/**
 * Returns `false` during SSR and the first client render, `true` after
 * `useEffect` has run. Use this to gate any DOM-touching overlay render so
 * React hydration sees the same output on server and client (avoids #418).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
