"use client";

/**
 * Compat shim preserving the old `<InlineText contentKey field>` API.
 * Delegates to the new primitive at `src/components/cms/InlineText.tsx`.
 * Kept so any existing imports continue to work — no behaviour change
 * in public mode, and the same contentEditable flow in admin mode.
 */
import { useAdmin } from "@/providers/admin-provider";
import { InlineText as CmsInlineText } from "@/components/cms/InlineText";

interface InlineTextProps {
  contentKey: string;
  field: string;
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
}

function getNestedValue(obj: unknown, path: string): string | undefined {
  const parts: string[] = [];
  const regex = /([^.\[\]]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(path)) !== null) {
    parts.push((match[1] ?? match[2]) as string);
  }
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    const asArray = current as Record<string, unknown> & unknown[];
    const index = Number(part);
    if (!isNaN(index) && Array.isArray(current)) {
      current = asArray[index];
    } else {
      current = (current as Record<string, unknown>)[part];
    }
  }
  return typeof current === "string" ? current : undefined;
}

export function InlineText({
  contentKey,
  field,
  children,
  as = "span",
  className,
}: InlineTextProps) {
  const { isAdmin, content, updateContent } = useAdmin();
  const fullPath = `${contentKey}.${field}`;
  const liveValue =
    isAdmin && content ? getNestedValue(content, fullPath) : undefined;

  if (!isAdmin) {
    const Tag = as as unknown as React.ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const displayValue =
    liveValue ?? (typeof children === "string" ? children : "");

  return (
    <CmsInlineText
      as={as}
      className={className}
      value={displayValue}
      editable
      onChange={(next) => updateContent(fullPath, next)}
    />
  );
}
