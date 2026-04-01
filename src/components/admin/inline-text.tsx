"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useAdmin } from "@/providers/admin-provider";

interface InlineTextProps {
  contentKey: string;
  field: string;
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
}

function getNestedValue(obj: any, path: string): string | undefined {
  const parts: string[] = [];
  const regex = /([^.\[\]]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    parts.push(match[1] ?? match[2]);
  }

  let current = obj;
  for (const part of parts) {
    if (current == null) return undefined;
    const index = Number(part);
    if (!isNaN(index) && Array.isArray(current)) {
      current = current[index];
    } else {
      current = current[part];
    }
  }

  return typeof current === "string" ? current : undefined;
}

export function InlineText({
  contentKey,
  field,
  children,
  as: Tag = "span",
  className,
}: InlineTextProps) {
  const { isAdmin, content, updateContent } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Get the current value from content
  const fullPath = `${contentKey}.${field}`;
  const currentValue =
    isAdmin && content ? getNestedValue(content, fullPath) : undefined;

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (ref.current) {
      const newValue = ref.current.textContent || "";
      if (newValue !== currentValue) {
        updateContent(fullPath, newValue);
      }
    }
  }, [currentValue, fullPath, updateContent]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
        // Restore original value
        if (ref.current && currentValue !== undefined) {
          ref.current.textContent = currentValue;
        }
        ref.current?.blur();
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        ref.current?.blur();
      }
    },
    [currentValue]
  );

  // Sync content value to DOM when content changes externally
  useEffect(() => {
    if (!isEditing && ref.current && currentValue !== undefined) {
      if (ref.current.textContent !== currentValue) {
        ref.current.textContent = currentValue;
      }
    }
  }, [currentValue, isEditing]);

  // Non-admin: zero overhead
  if (!isAdmin) {
    return <Tag className={className}>{children}</Tag>;
  }

  const handleClick = () => {
    setIsEditing(true);
    // Focus happens after render via the effect below
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.focus();
        // Move cursor to end
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    });
  };

  return (
    <Tag
      ref={ref as any}
      className={`${className || ""} admin-inline-text ${
        isEditing ? "admin-inline-text--editing" : ""
      }`}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={
        isEditing
          ? {
              outline: "2px solid var(--color-apple-blue, #007AFF)",
              outlineOffset: "4px",
              borderRadius: "4px",
              cursor: "text",
            }
          : undefined
      }
    >
      {currentValue !== undefined ? currentValue : children}
    </Tag>
  );
}
