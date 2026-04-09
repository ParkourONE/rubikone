"use client";

/**
 * PERS-06 — Autosave scaffold.
 *
 * Debounced (5s idle) trigger of `save()`. Disabled by default via the
 * `cms.autosave` config flag; flipping it on is a v2.1 decision.
 *
 * To enable during development:
 *   localStorage.setItem("cms:autosave", "1")
 *
 * This hook is intentionally not mounted yet — import it behind the flag
 * in a future phase.
 */
import { useEffect, useRef } from "react";
import { useEditorStore } from "./editor-store";
import type { UseSaveReturn } from "./use-save";

const AUTOSAVE_DEBOUNCE_MS = 5000;

function isAutosaveEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("cms:autosave") === "1";
  } catch {
    return false;
  }
}

export function useAutosave(saveApi: UseSaveReturn): void {
  const pendingOps = useEditorStore((s) => s.pendingOps);
  const dirty = useEditorStore((s) => s.dirty);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(saveApi.saving);
  savingRef.current = saveApi.saving;

  useEffect(() => {
    if (!isAutosaveEnabled()) return;
    if (!dirty || pendingOps.length === 0) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (savingRef.current) return;
      void saveApi.save();
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pendingOps, dirty, saveApi]);
}
