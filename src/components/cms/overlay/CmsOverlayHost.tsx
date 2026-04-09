"use client";

/**
 * Mounts the Phase 4b overlay stack (hover outline, hover toolbar, inline
 * editor popovers, and the add-block gap buttons). Rendered from the admin
 * provider so it's guaranteed to live inside the EditMode + Selection
 * contexts.
 */

import { HoverOverlay } from "./HoverOverlay";
import { HoverToolbar } from "./HoverToolbar";
import { InlineEditors } from "@/components/cms/inline-editors/InlineEditors";
import { AddBlockGaps } from "./AddBlockGaps";
import { TextCommitBridge } from "./TextCommitBridge";

export function CmsOverlayHost() {
  return (
    <>
      <HoverOverlay />
      <HoverToolbar />
      <InlineEditors />
      <AddBlockGaps />
      <TextCommitBridge />
    </>
  );
}
