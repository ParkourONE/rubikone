"use client";

import { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";

// Curated catalog — icons actually used under src/components/sections/** and
// in lib/constants.ts. Hand-maintained: keep small.
const ICON_CATALOG = [
  "ArrowRight",
  "ArrowLeft",
  "ArrowUpRight",
  "Check",
  "CheckCircle",
  "CheckCircle2",
  "X",
  "ChevronRight",
  "ChevronDown",
  "ChevronUp",
  "Plus",
  "Minus",
  "Star",
  "Heart",
  "Info",
  "HelpCircle",
  "AlertCircle",
  "Mail",
  "Phone",
  "MapPin",
  "Calendar",
  "Clock",
  "Users",
  "User",
  "Home",
  "Building",
  "Settings",
  "Download",
  "Upload",
  "Share",
  "Play",
  "Pause",
  "Image",
  "FileText",
  "Link",
  "Trophy",
  "Target",
  "Zap",
  "Shield",
  "Sparkles",
  "Leaf",
];

interface Props {
  value: string;
  onSelect: (name: string) => void;
  onCancel: () => void;
}

export function IconEditor({ value, onSelect, onCancel }: Props) {
  const [q, setQ] = useState("");
  const icons = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ size?: number }>
  >;
  const filtered = useMemo(
    () =>
      ICON_CATALOG.filter((n) => n.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  return (
    <div className="p-3 space-y-3">
      <input
        type="text"
        autoFocus
        placeholder="Icon suchen…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#00a8ab]/30"
      />
      <div className="grid grid-cols-6 gap-1 max-h-56 overflow-y-auto">
        {filtered.map((name) => {
          const Icon = icons[name] ?? icons.HelpCircle;
          const isActive = name === value;
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onSelect(name)}
              className={`h-10 w-10 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors ${
                isActive ? "bg-[#00a8ab]/15 text-[#00a8ab]" : "text-gray-700"
              }`}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs rounded-md hover:bg-gray-100"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}
