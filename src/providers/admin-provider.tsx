"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Toaster, toast } from "sonner";
import {
  EditModeProvider,
  SelectionProvider,
} from "@/components/cms/edit-mode-context";
import { CmsOverlayHost } from "@/components/cms/overlay/CmsOverlayHost";
import { BlockPicker } from "@/components/admin/block-picker";

interface RegisteredSection {
  key: string;
  label: string;
  /** Present iff this section was registered by a dynamic block (DynamicBlocks
   *  renderer). Hardcoded `<EditableSection>` registrations leave this unset
   *  so the sidebar can disable the delete button on them. */
  dynamic?: { pageKey: string; index: number };
}

interface AdminContextType {
  isAdmin: boolean;
  content: Record<string, any> | null;
  editingSection: string | null;
  editingSectionLabel: string | null;
  setEditingSection: (key: string | null, label?: string | null) => void;
  updateContent: (path: string, value: unknown) => void;
  saveContent: () => Promise<void>;
  saving: boolean;
  hasChanges: boolean;
  logout: () => Promise<void>;
  registeredSections: RegisteredSection[];
  registerSection: (
    key: string,
    label: string,
    meta?: { dynamic?: { pageKey: string; index: number } }
  ) => void;
  unregisterSection: (key: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  pickerOpen: boolean;
  setPickerOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  content: null,
  editingSection: null,
  editingSectionLabel: null,
  setEditingSection: () => {},
  updateContent: () => {},
  saveContent: async () => {},
  saving: false,
  hasChanges: false,
  logout: async () => {},
  registeredSections: [],
  registerSection: () => {},
  unregisterSection: () => {},
  sidebarOpen: false,
  setSidebarOpen: () => {},
  pickerOpen: false,
  setPickerOpen: () => {},
});

function setNestedValue(obj: any, path: string, value: unknown): any {
  const clone = JSON.parse(JSON.stringify(obj));
  const parts: string[] = [];

  // Parse path like "HERO_CONTENT.ctaPrimary.label" or "TESTIMONIALS[0].quote"
  const regex = /([^.\[\]]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    parts.push(match[1] ?? match[2]);
  }

  let current = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const index = Number(key);
    if (!isNaN(index) && Array.isArray(current)) {
      current = current[index];
    } else {
      current = current[key];
    }
  }

  const lastKey = parts[parts.length - 1];
  const lastIndex = Number(lastKey);
  if (!isNaN(lastIndex) && Array.isArray(current)) {
    current[lastIndex] = value;
  } else {
    current[lastKey] = value;
  }

  return clone;
}

function AdminProviderInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<Record<string, any> | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [editingSection, setEditingSectionState] = useState<string | null>(null);
  const [editingSectionLabel, setEditingSectionLabel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [registeredSections, setRegisteredSections] = useState<RegisteredSection[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const originalContentRef = useRef<string>("");

  // Load content from API and bridge the editor store (new inline editor) →
  // AdminProvider state (consumed by useContent). Without this bridge the
  // inline editor writes into the zustand store and the DOM never re-renders
  // because the rendered content is still the AdminProvider snapshot.
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;

    async function loadContent() {
      try {
        const res = await fetch("/api/admin/content");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setContent(data.content);
        setSha(data.sha);
        originalContentRef.current = JSON.stringify(data.content);
        const { useEditorStore } = await import("@/lib/cms/editor-store");
        if (cancelled) return;
        useEditorStore.getState().setContent(data.content, data.sha);
        // Mirror every subsequent editor-store content/sha change back into
        // AdminProvider so useContent-consumers re-render and so the legacy
        // saveContent path uses a fresh SHA.
        unsubscribe = useEditorStore.subscribe((state, prevState) => {
          if (state.sha !== prevState.sha && state.sha) {
            setSha(state.sha);
          }
          if (state.content === prevState.content) return;
          if (!state.content) return;
          setContent(state.content as Record<string, any>);
          setHasChanges(
            JSON.stringify(state.content) !== originalContentRef.current
          );
        });
      } catch (err) {
        console.error("Failed to load content:", err);
      }
    }
    loadContent();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const setEditingSection = useCallback(
    (key: string | null, label?: string | null) => {
      setEditingSectionState(key);
      setEditingSectionLabel(label ?? null);
    },
    []
  );

  const updateContent = useCallback(
    (path: string, value: unknown) => {
      setContent((prev) => {
        if (!prev) return prev;
        const updated = setNestedValue(prev, path, value);
        setHasChanges(
          JSON.stringify(updated) !== originalContentRef.current
        );
        return updated;
      });
      // Mirror legacy edits into the editor-store so the picker / other op-
      // based features read fresh content. Fire-and-forget — the subscribe
      // bridge in loadContent() will dedupe redundant re-renders.
      import("@/lib/cms/editor-store").then(({ useEditorStore }) => {
        try {
          useEditorStore.getState().applyOpToStore({
            type: "set",
            path,
            value,
          });
        } catch {
          /* path may not yet exist in the store snapshot — safe to ignore;
             admin context is the source of truth for save. */
        }
      });
    },
    []
  );

  const registerSection = useCallback(
    (
      key: string,
      label: string,
      meta?: { dynamic?: { pageKey: string; index: number } }
    ) => {
      setRegisteredSections((prev) => {
        const existing = prev.findIndex((s) => s.key === key);
        const next: RegisteredSection = { key, label, ...(meta ?? {}) };
        if (existing >= 0) {
          // Re-register with updated metadata (e.g. index shift after a delete).
          const copy = prev.slice();
          copy[existing] = next;
          return copy;
        }
        return [...prev, next];
      });
    },
    []
  );

  const unregisterSection = useCallback((key: string) => {
    setRegisteredSections((prev) => prev.filter((s) => s.key !== key));
  }, []);

  const saveContent = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    const sectionName = editingSectionLabel || editingSection || "Inhalt";
    const commitMessage = `content: Update ${sectionName} via Admin-Panel`;

    async function attempt(currentSha: string | null) {
      return fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          sha: currentSha,
          message: commitMessage,
        }),
      });
    }

    try {
      let res = await attempt(sha);
      // Auto-recover on stale SHA: refetch latest SHA once and retry.
      if (res.status === 409) {
        try {
          const freshRes = await fetch("/api/admin/content");
          if (freshRes.ok) {
            const fresh = await freshRes.json();
            setSha(fresh.sha);
            res = await attempt(fresh.sha);
          }
        } catch {
          /* fall through to error handling */
        }
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Speichern fehlgeschlagen");
      }
      const data = await res.json();
      setSha(data.sha);
      try {
        const { useEditorStore } = await import("@/lib/cms/editor-store");
        const s = useEditorStore.getState();
        s.setContent(content, data.sha);
      } catch {
        /* ignore */
      }
      originalContentRef.current = JSON.stringify(content);
      setHasChanges(false);
      toast.success("Gespeichert! Deployment wird automatisch gestartet.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unbekannter Fehler"
      );
    } finally {
      setSaving(false);
    }
  }, [content, sha, editingSection, editingSectionLabel]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAdmin: true,
        content,
        editingSection,
        editingSectionLabel,
        setEditingSection,
        updateContent,
        saveContent,
        saving,
        hasChanges,
        logout,
        registeredSections,
        registerSection,
        unregisterSection,
        sidebarOpen,
        setSidebarOpen,
        pickerOpen,
        setPickerOpen,
      }}
    >
      <EditModeProvider initial={true}>
        <SelectionProvider>
          {children}
          <CmsOverlayHost />
          <BlockPicker />
        </SelectionProvider>
      </EditModeProvider>
      <Toaster position="bottom-right" richColors closeButton />
    </AdminContext.Provider>
  );
}

export function AdminProvider({
  children,
  isAdmin,
}: {
  children: React.ReactNode;
  isAdmin: boolean;
}) {
  if (!isAdmin) {
    return <>{children}</>;
  }

  return <AdminProviderInner>{children}</AdminProviderInner>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
