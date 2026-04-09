"use client";

import { useCallback, useRef, useState } from "react";

interface Props {
  value: string;
  onSave: (url: string) => void;
  onCancel: () => void;
}

export function ImageEditor({ value, onSave, onCancel }: Props) {
  const [url, setUrl] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [dragActive, setDragActive] = useState(false);

  const upload = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      const next = data.url ?? data.path ?? "";
      if (!next) throw new Error("Upload returned no URL");
      setUrl(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  };

  return (
    <div className="p-3 space-y-3">
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          dragCounter.current += 1;
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          dragCounter.current -= 1;
          if (dragCounter.current <= 0) setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center text-xs cursor-pointer transition-colors ${
          dragActive
            ? "border-[#00a8ab] bg-[#00a8ab]/10 text-[#00a8ab]"
            : "border-gray-300 text-gray-500 hover:bg-gray-50"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        {uploading
          ? "Lädt hoch…"
          : "Bild hierher ziehen oder klicken zum Auswählen"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      <label className="block space-y-1">
        <span className="text-xs text-gray-600">URL</span>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#00a8ab]/30"
        />
      </label>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="w-full max-h-40 object-cover rounded-md border border-gray-200"
        />
      )}
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
          onClick={() => onSave(url)}
          disabled={uploading}
          className="px-3 py-1.5 text-xs rounded-md bg-[#00a8ab] text-white disabled:opacity-50"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}
