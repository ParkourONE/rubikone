"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

interface RegisteredSection {
  key: string;
  label: string;
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
  registerSection: (key: string, label: string) => void;
  unregisterSection: (key: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
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
  const originalContentRef = useRef<string>("");

  // Load content from API
  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/admin/content");
        if (!res.ok) return;
        const data = await res.json();
        setContent(data.content);
        setSha(data.sha);
        originalContentRef.current = JSON.stringify(data.content);
      } catch (err) {
        console.error("Failed to load content:", err);
      }
    }
    loadContent();
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
    },
    []
  );

  const registerSection = useCallback((key: string, label: string) => {
    setRegisteredSections((prev) => {
      if (prev.some((s) => s.key === key)) return prev;
      return [...prev, { key, label }];
    });
  }, []);

  const unregisterSection = useCallback((key: string) => {
    setRegisteredSections((prev) => prev.filter((s) => s.key !== key));
  }, []);

  const saveContent = useCallback(async () => {
    if (!content || !sha) return;
    setSaving(true);
    try {
      // Determine which section was edited for the commit message
      const sectionName = editingSectionLabel || editingSection || "Inhalt";
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          sha,
          message: `content: Update ${sectionName} via Admin-Panel`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Speichern fehlgeschlagen");
      }

      const data = await res.json();
      setSha(data.sha);
      originalContentRef.current = JSON.stringify(content);
      setHasChanges(false);
      alert("Gespeichert! Deployment wird automatisch gestartet.");
    } catch (err) {
      alert(
        "Fehler: " +
          (err instanceof Error ? err.message : "Unbekannter Fehler")
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
      }}
    >
      {children}
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
