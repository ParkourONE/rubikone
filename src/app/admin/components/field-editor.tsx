"use client";

import { useState } from "react";

interface FieldEditorProps {
  label: string;
  value: unknown;
  path: string;
  onChange: (path: string, value: unknown) => void;
  depth?: number;
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
    const isLong = value.length > 80;
    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </label>
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
          {label}
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
        <label className="text-sm text-gray-700">{label}</label>
      </div>
    );
  }

  // Null field
  if (value === null) {
    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
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
    if (value.length > 0 && typeof value[0] === "string") {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
              {label}
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
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      );
    }

    // Array of objects
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-700"
          >
            <span className="text-[10px]">{collapsed ? "▶" : "▼"}</span>
            {label} ({value.length} Einträge)
          </button>
          <button
            onClick={() => {
              // Clone the last item as template for a new entry
              const template =
                value.length > 0
                  ? JSON.parse(JSON.stringify(value[value.length - 1]))
                  : {};
              // Clear all string values in the template
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
              className="border border-gray-200 rounded-lg p-4 bg-white space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">
                  #{i + 1}
                  {typeof item === "object" &&
                    item !== null &&
                    "title" in item &&
                    ` – ${(item as Record<string, unknown>).title}`}
                  {typeof item === "object" &&
                    item !== null &&
                    "name" in item &&
                    !("title" in item) &&
                    ` – ${(item as Record<string, unknown>).name}`}
                  {typeof item === "object" &&
                    item !== null &&
                    "question" in item &&
                    ` – ${(item as Record<string, unknown>).question}`}
                  {typeof item === "object" &&
                    item !== null &&
                    "label" in item &&
                    !("title" in item) &&
                    !("name" in item) &&
                    ` – ${(item as Record<string, unknown>).label}`}
                </span>
                <button
                  onClick={() => {
                    const newArr = value.filter((_, idx) => idx !== i);
                    onChange(path, newArr);
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Entfernen
                </button>
              </div>
              {typeof item === "object" && item !== null && (
                <ObjectEditor
                  value={item as Record<string, unknown>}
                  path={`${path}[${i}]`}
                  onChange={onChange}
                  depth={depth + 1}
                />
              )}
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
          {label}
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
          label={humanizeKey(key)}
          value={val}
          path={`${path}.${key}`}
          onChange={onChange}
          depth={depth}
        />
      ))}
    </div>
  );
}

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
