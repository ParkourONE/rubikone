"use client";

import { useState } from "react";

interface Props {
  initialLabel: string;
  initialHref: string;
  initialTarget: string;
  onSave: (label: string, href: string, target: string) => void;
  onCancel: () => void;
}

export function LinkEditor({
  initialLabel,
  initialHref,
  initialTarget,
  onSave,
  onCancel,
}: Props) {
  const [label, setLabel] = useState(initialLabel);
  const [href, setHref] = useState(initialHref);
  const [target, setTarget] = useState(initialTarget);

  return (
    <div className="p-3 space-y-3">
      <label className="block space-y-1">
        <span className="text-xs text-gray-600">Label</span>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#00a8ab]/30"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs text-gray-600">Href</span>
        <input
          type="text"
          value={href}
          onChange={(e) => setHref(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#00a8ab]/30"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs text-gray-600">Target</span>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#00a8ab]/30"
        >
          <option value="">(default)</option>
          <option value="_self">_self</option>
          <option value="_blank">_blank</option>
        </select>
      </label>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs rounded-md hover:bg-gray-100"
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={() => onSave(label, href, target)}
          className="px-3 py-1.5 text-xs rounded-md bg-[#00a8ab] text-white"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}
