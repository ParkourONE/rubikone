"use client";

/**
 * Dynamic blocks renderer — reads `content.PAGE_BLOCKS[pageKey]` and renders
 * each block via its registry entry. Each block:
 *
 * - Renders inside a `BlockContentOverrideProvider` so the section's
 *   `useContent(KEY, DEFAULT)` returns the block-scoped content instead of
 *   the global one.
 * - Registers itself with the admin sidebar so it appears in the block list,
 *   marked as `dynamic` (sidebar uses that to enable the delete button).
 *
 * Silently no-ops when `PAGE_BLOCKS[pageKey]` is missing — backwards
 * compatible with existing content.json snapshots.
 */

import { useEffect, useMemo } from "react";
import { useAdmin } from "@/providers/admin-provider";
import { BlockContentOverrideProvider } from "@/hooks/useContent";
import { getBlockDef } from "@/lib/cms/block-registry";

interface PageBlock {
  type: string;
  id: string;
  content?: unknown;
}

interface DynamicBlocksProps {
  pageKey: string;
}

export function DynamicBlocks({ pageKey }: DynamicBlocksProps) {
  const { content } = useAdmin();

  const blocks = useMemo<PageBlock[]>(() => {
    const all = content?.PAGE_BLOCKS as Record<string, unknown> | undefined;
    const list = all?.[pageKey];
    if (!Array.isArray(list)) return [];
    return list.filter(
      (b): b is PageBlock =>
        typeof b === "object" && b !== null && "type" in b && "id" in b
    );
  }, [content, pageKey]);

  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => (
        <DynamicBlock
          key={block.id}
          block={block}
          pageKey={pageKey}
          index={index}
        />
      ))}
    </>
  );
}

function DynamicBlock({
  block,
  pageKey,
  index,
}: {
  block: PageBlock;
  pageKey: string;
  index: number;
}) {
  const { isAdmin, registerSection, unregisterSection } = useAdmin();
  const def = getBlockDef(block.type);
  const sidebarKey = `PAGE_BLOCKS.${pageKey}.${index}.content`;
  const label = def?.label ?? block.type;

  const overrideValue = useMemo(
    () => ({ [block.type]: block.content }),
    [block.type, block.content]
  );

  useEffect(() => {
    if (!isAdmin) return;
    registerSection(sidebarKey, label, { dynamic: { pageKey, index } });
    return () => unregisterSection(sidebarKey);
  }, [isAdmin, sidebarKey, label, pageKey, index, registerSection, unregisterSection]);

  if (!def) {
    // Unknown block type — skip rendering, but the sidebar entry above lets
    // the user remove it.
    return null;
  }

  const Section = def.Component;
  const inner = (
    <BlockContentOverrideProvider value={overrideValue}>
      <Section />
    </BlockContentOverrideProvider>
  );

  if (!isAdmin) return inner;

  // Edit affordance — borrow the same hover treatment used by
  // <EditableSection> so dynamic blocks behave consistently in admin mode.
  return (
    <div id={`section-${sidebarKey}`} className="relative group/edit">
      {inner}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-200 border-2 border-dashed rounded-lg z-40 opacity-0 group-hover/edit:opacity-100 border-blue-400" />
    </div>
  );
}
