"use client";

import { useState, useRef } from "react";

interface FieldEditorProps {
  label: string;
  value: unknown;
  path: string;
  onChange: (path: string, value: unknown) => void;
  depth?: number;
}

// Fields that contain image paths
const IMAGE_FIELD_PATTERNS = [
  "image", "logo", "src", "poster", "icon", "photo", "avatar", "thumbnail",
  "imageUrl", "heroImage", "backgroundImage", "ogImage",
];

function isImageField(key: string): boolean {
  const lower = key.toLowerCase();
  return IMAGE_FIELD_PATTERNS.some((p) => lower.includes(p.toLowerCase()));
}

function isImagePath(value: string): boolean {
  return /\.(jpg|jpeg|png|gif|svg|webp|avif)$/i.test(value) || value.startsWith("/images/");
}

export function FieldEditor({
  label,
  value,
  path,
  onChange,
  depth = 0,
}: FieldEditorProps) {
  const [collapsed, setCollapsed] = useState(depth > 1);

  // String field
  if (typeof value === "string") {
    const fieldKey = path.split(".").pop() || "";
    const showImagePreview = isImageField(fieldKey) || isImagePath(value);
    const isLong = value.length > 80;

    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          {humanizeKey(label)}
        </label>

        {/* Image preview + upload */}
        {showImagePreview && (
          <div className="flex items-start gap-3 mb-2">
            {value && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <ImageUpload
              currentPath={value}
              onUpload={(newPath) => onChange(path, newPath)}
            />
          </div>
        )}

        {isLong ? (
          <textarea
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
            rows={Math.min(Math.ceil(value.length / 60), 6)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-y"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        )}
      </div>
    );
  }

  // Number field
  if (typeof value === "number") {
    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          {humanizeKey(label)}
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(path, Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>
    );
  }

  // Boolean field
  if (typeof value === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(path, e.target.checked)}
          className="rounded border-gray-300"
        />
        <label className="text-sm text-gray-700">{humanizeKey(label)}</label>
      </div>
    );
  }

  // Null field
  if (value === null) {
    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          {humanizeKey(label)}
        </label>
        <input
          type="text"
          value=""
          onChange={(e) =>
            onChange(path, e.target.value === "" ? null : e.target.value)
          }
          placeholder="(leer)"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>
    );
  }

  // Array field
  if (Array.isArray(value)) {
    // Array of strings
    if (value.length === 0 || typeof value[0] === "string") {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
              {humanizeKey(label)}
            </label>
            <button
              onClick={() => onChange(path, [...value, ""])}
              className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 px-2 py-1 rounded"
            >
              + Hinzufügen
            </button>
          </div>
          {value.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item as string}
                onChange={(e) => {
                  const newArr = [...value];
                  newArr[i] = e.target.value;
                  onChange(path, newArr);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newArr = value.filter((_, idx) => idx !== i);
                  onChange(path, newArr);
                }}
                className="text-xs text-red-500 hover:text-red-700 px-2"
                title="Entfernen"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      );
    }

    // Array of objects – with duplicate, reorder, delete
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-700"
          >
            <span className="text-[10px]">{collapsed ? "▶" : "▼"}</span>
            {humanizeKey(label)} ({value.length} Einträge)
          </button>
          <button
            onClick={() => {
              const template =
                value.length > 0
                  ? JSON.parse(JSON.stringify(value[value.length - 1]))
                  : {};
              clearStringValues(template);
              onChange(path, [...value, template]);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 px-2 py-1 rounded"
          >
            + Hinzufügen
          </button>
        </div>
        {!collapsed &&
          value.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              {/* Item header with actions */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-400">
                  #{i + 1}
                  {typeof item === "object" && item !== null && getItemTitle(item as Record<string, unknown>)}
                </span>
                <div className="flex items-center gap-1">
                  {/* Move up */}
                  <button
                    onClick={() => {
                      if (i === 0) return;
                      const newArr = [...value];
                      [newArr[i - 1], newArr[i]] = [newArr[i], newArr[i - 1]];
                      onChange(path, newArr);
                    }}
                    disabled={i === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Nach oben"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                  </button>
                  {/* Move down */}
                  <button
                    onClick={() => {
                      if (i === value.length - 1) return;
                      const newArr = [...value];
                      [newArr[i], newArr[i + 1]] = [newArr[i + 1], newArr[i]];
                      onChange(path, newArr);
                    }}
                    disabled={i === value.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Nach unten"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {/* Duplicate */}
                  <button
                    onClick={() => {
                      const clone = JSON.parse(JSON.stringify(item));
                      const newArr = [...value];
                      newArr.splice(i + 1, 0, clone);
                      onChange(path, newArr);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Duplizieren"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (!confirm(`Eintrag #${i + 1} wirklich löschen?`)) return;
                      const newArr = value.filter((_, idx) => idx !== i);
                      onChange(path, newArr);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Löschen"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
              {/* Item content */}
              <div className="p-4 space-y-3">
                {typeof item === "object" && item !== null && (
                  <ObjectEditor
                    value={item as Record<string, unknown>}
                    path={`${path}[${i}]`}
                    onChange={onChange}
                    depth={depth + 1}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    );
  }

  // Object field
  if (typeof value === "object" && value !== null) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-700"
        >
          <span className="text-[10px]">{collapsed ? "▶" : "▼"}</span>
          {humanizeKey(label)}
        </button>
        {!collapsed && (
          <div className="border-l-2 border-gray-200 pl-4 space-y-3">
            <ObjectEditor
              value={value as Record<string, unknown>}
              path={path}
              onChange={onChange}
              depth={depth + 1}
            />
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ============================================================
// Image Upload Component
// ============================================================

function ImageUpload({
  currentPath,
  onUpload,
}: {
  currentPath: string;
  onUpload: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (currentPath) {
        formData.append("currentPath", currentPath);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload fehlgeschlagen");

      const data = await res.json();
      onUpload(data.path);
    } catch (err) {
      alert("Bild-Upload fehlgeschlagen: " + (err instanceof Error ? err.message : "Unbekannter Fehler"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {uploading ? "Wird hochgeladen..." : "Bild ändern"}
      </button>
    </div>
  );
}

// ============================================================
// Object Editor (renders nested fields)
// ============================================================

function ObjectEditor({
  value,
  path,
  onChange,
  depth,
}: {
  value: Record<string, unknown>;
  path: string;
  onChange: (path: string, value: unknown) => void;
  depth: number;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(value).map(([key, val]) => (
        <FieldEditor
          key={key}
          label={key}
          value={val}
          path={`${path}.${key}`}
          onChange={onChange}
          depth={depth}
        />
      ))}
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\s/, "")
    .trim();
}

function clearStringValues(obj: Record<string, unknown>) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      obj[key] = "";
    } else if (Array.isArray(obj[key])) {
      obj[key] = [];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      clearStringValues(obj[key] as Record<string, unknown>);
    }
  }
}

function getItemTitle(item: Record<string, unknown>): string {
  const titleKeys = ["title", "name", "question", "label", "headline", "value"];
  for (const key of titleKeys) {
    if (key in item && typeof item[key] === "string" && item[key]) {
      const text = item[key] as string;
      return ` – ${text.length > 50 ? text.slice(0, 50) + "..." : text}`;
    }
  }
  return "";
}
