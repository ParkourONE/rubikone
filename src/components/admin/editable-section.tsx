"use client";

import { useEffect } from "react";
import { useAdmin } from "@/providers/admin-provider";

interface EditableSectionProps {
  contentKey: string;
  label: string;
  children: React.ReactNode;
}

export function EditableSection({
  contentKey,
  label,
  children,
}: EditableSectionProps) {
  const { isAdmin, editingSection, setEditingSection, registerSection, unregisterSection } = useAdmin();

  useEffect(() => {
    if (!isAdmin) return;
    registerSection(contentKey, label);
    return () => unregisterSection(contentKey);
  }, [isAdmin, contentKey, label, registerSection, unregisterSection]);

  if (!isAdmin) return <>{children}</>;

  const isActive = editingSection === contentKey;

  return (
    <div
      id={`section-${contentKey}`}
      className="relative group/edit"
    >
      {children}
      {/* Hover overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-200 border-2 border-dashed rounded-lg z-40 ${
          isActive
            ? "opacity-100 border-[#00a8ab]"
            : "opacity-0 group-hover/edit:opacity-100 border-blue-400"
        }`}
      />
      {/* Edit button */}
      <button
        onClick={() => setEditingSection(contentKey, label)}
        className="absolute top-4 right-4 opacity-0 group-hover/edit:opacity-100 z-50 bg-white shadow-lg rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-2 border border-gray-200"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        {label}
      </button>
    </div>
  );
}
