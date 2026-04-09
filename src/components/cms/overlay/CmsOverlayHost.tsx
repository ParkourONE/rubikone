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
import { SaveBar } from "./SaveBar";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { ValidationBadges } from "./ValidationBadges";
import { useMounted } from "./use-mounted";

export function CmsOverlayHost() {
  // Gate the entire overlay stack behind a client-only mounted flag so SSR
  // and first-client render both produce null (prevents React #418 hydration
  // mismatch caused by portals + typeof document checks inside children).
  const mounted = useMounted();
  if (!mounted) return null;
  return (
    <>
      <HoverOverlay />
      <HoverToolbar />
      <InlineEditors />
      <AddBlockGaps />
      <TextCommitBridge />
      <ValidationBadges />
      <SaveBar />
      <KeyboardShortcuts />
    </>
  );
}
