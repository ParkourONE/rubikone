"use client";

/**
 * Mounts `<DynamicBlocks>` at the end of every page's `<main>`. Wraps the
 * pathname-derivation client-side so layout.tsx (a server component) can
 * stay unchanged structurally.
 */

import { usePathname } from "next/navigation";
import { DynamicBlocks } from "./DynamicBlocks";
import { pathnameToPageKey } from "@/lib/cms/block-registry";

export function DynamicBlocksHost() {
  const pathname = usePathname() ?? "/";

  // The /admin route renders its own UI (a redirect placeholder today) and
  // shouldn't host dynamic page blocks.
  if (pathname.startsWith("/admin")) return null;

  const pageKey = pathnameToPageKey(pathname);
  return <DynamicBlocks pageKey={pageKey} />;
}
