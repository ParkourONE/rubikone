"use client";

/**
 * UX-02 — Responsive preview toggle.
 *
 * Segmented control (Desktop / Tablet / Mobile) mounted next to the
 * EditModeToggle in the admin toolbar. Selection persists to localStorage
 * (`cms:responsive-preview`).
 *
 * Implementation: stamp `data-cms-preview="desktop|tablet|mobile"` on the
 * <html> element and inject a <style> tag that constrains `body > *` to a
 * max-width when the attribute is not `desktop`. Only active while
 * `editMode === true`.
 */
import { useEffect, useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { useEditMode } from "@/components/cms/edit-mode-context";

export type PreviewSize = "desktop" | "tablet" | "mobile";

const LS_KEY = "cms:responsive-preview";
const STYLE_ID = "cms-responsive-preview-style";

const STYLE_CSS = `
html[data-cms-preview="tablet"] body > *:not([data-cms-overlay]):not(script):not(style) {
  max-width: 768px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
html[data-cms-preview="mobile"] body > *:not([data-cms-overlay]):not(script):not(style) {
  max-width: 375px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
html[data-cms-preview="tablet"] body,
html[data-cms-preview="mobile"] body {
  background-color: #0a0a0a !important;
}
`;

function ensureStyleTag(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = STYLE_CSS;
  document.head.appendChild(tag);
}

function applyPreview(size: PreviewSize, active: boolean): void {
  if (typeof document === "undefined") return;
  ensureStyleTag();
  const attr = active ? size : "desktop";
  document.documentElement.setAttribute("data-cms-preview", attr);
}

export function ResponsivePreviewToggle() {
  const { editMode } = useEditMode();
  const [size, setSize] = useState<PreviewSize>("desktop");

  // Hydrate once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw === "tablet" || raw === "mobile" || raw === "desktop") {
        setSize(raw);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist + apply.
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, size);
    } catch {
      /* ignore */
    }
    applyPreview(size, editMode);
    return () => {
      // On unmount or toggle off, reset to desktop.
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-cms-preview", "desktop");
      }
    };
  }, [size, editMode]);

  if (!editMode) return null;

  const items: Array<{ key: PreviewSize; icon: React.ReactNode; label: string }> = [
    { key: "desktop", icon: <Monitor size={12} />, label: "Desktop" },
    { key: "tablet", icon: <Tablet size={12} />, label: "Tablet" },
    { key: "mobile", icon: <Smartphone size={12} />, label: "Mobile" },
  ];

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-white/20 bg-white/10 p-0.5">
      {items.map((it) => {
        const active = size === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => setSize(it.key)}
            title={it.label}
            className={
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors " +
              (active
                ? "bg-white text-[#1D1D1F]"
                : "text-white/70 hover:text-white hover:bg-white/10")
            }
          >
            {it.icon}
          </button>
        );
      })}
    </div>
  );
}
