/**
 * Block registry — admin-only catalog of section types that can be added as
 * dynamic blocks via the CMS Block-Picker.
 *
 * Each entry pairs a content key (the same string passed to `useContent`)
 * with the React component to render and a default content payload to seed
 * a freshly inserted block. The default is a deep-cloned snapshot of the
 * existing exported constant — adding a "Hero" block to a fresh page yields
 * the same shape the homepage already uses.
 *
 * Only sections that read their content via `useContent(KEY, DEFAULT)` and
 * render without page-specific props are eligible. Page-bound sections
 * (legal-page-client, posten-page-client, configurator-overlay, contact-form,
 * movements-grid) are excluded — they couple to routing or external state.
 */

import type { ComponentType } from "react";

import {
  HERO_CONTENT,
  CTA_CONTENT,
  TESTIMONIALS,
  COMPARISON_TABLE,
  VIDEO_CONTENT,
  VORHER_NACHHER_CONTENT,
  GALLERY_CONTENT,
  PROZESS_TEASER_CONTENT,
  CONFIGURATOR_CTA_CONTENT,
  STATS_CONTENT,
  TEXTHOOK_CONTENT,
  PARKOURONE_STORY,
  FAQ_ITEMS,
  BENTO_GRID_DEFAULTS,
} from "@/lib/constants";

import { HeroSection } from "@/components/sections/hero-section";
import { CTASection } from "@/components/sections/cta-section";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ComparisonSection } from "@/components/sections/comparison-table";
import { VideoSection } from "@/components/sections/video-section";
import { VorherNachherTeaser } from "@/components/sections/vorher-nachher-teaser";
import { ImageGallery } from "@/components/sections/image-gallery";
import { ProzessTeaser } from "@/components/sections/prozess-teaser";
import { ConfiguratorCTASection } from "@/components/sections/configurator-cta-section";
import { StatsSection } from "@/components/sections/stats-section";
import { WasWaereWennHook } from "@/components/sections/was-waere-wenn-hook";
import { ParkourONEStoryCompact } from "@/components/sections/parkourone-story";
import { FAQSection } from "@/components/sections/faq-section";
import { BenefitsBentoGrid } from "@/components/sections/bento-grid";

export interface BlockDef {
  /** Canonical content key — matches the string passed to `useContent`. */
  type: string;
  /** Human-readable label for the picker. */
  label: string;
  /** Short description shown next to the label. */
  description?: string;
  /** Optional grouping for the picker. */
  category?: "Hero" | "Inhalt" | "Soziales" | "Konversion" | "Medien";
  /** Section component to render. */
  Component: ComponentType;
  /** Snapshot used to seed `content` when the block is inserted. */
  defaultContent: unknown;
}

// Sourced once at module load — structuredClone is performed at insert time
// so the registry remains read-only and safe to share between picker calls.
export const BLOCK_REGISTRY: readonly BlockDef[] = [
  {
    type: "HERO_CONTENT",
    label: "Hero",
    description: "Grosse Headline mit CTA + Video",
    category: "Hero",
    Component: HeroSection,
    defaultContent: HERO_CONTENT,
  },
  {
    type: "TEXTHOOK_CONTENT",
    label: "Text-Hook",
    description: "Eyecatcher-Satz, zentriert",
    category: "Inhalt",
    Component: WasWaereWennHook,
    defaultContent: TEXTHOOK_CONTENT,
  },
  {
    type: "STATS_CONTENT",
    label: "Zahlen / Stats",
    description: "Drei Zahlen mit Beschreibung",
    category: "Inhalt",
    Component: StatsSection,
    defaultContent: STATS_CONTENT,
  },
  {
    type: "BENTO_GRID_DEFAULTS",
    label: "Bento-Grid Vorteile",
    description: "Asymmetrisches Vorteile-Grid",
    category: "Inhalt",
    Component: BenefitsBentoGrid,
    defaultContent: BENTO_GRID_DEFAULTS,
  },
  {
    type: "COMPARISON_TABLE",
    label: "Vergleichstabelle",
    description: "RubikONE-Vorteile gegenuebergestellt",
    category: "Inhalt",
    Component: ComparisonSection,
    defaultContent: COMPARISON_TABLE,
  },
  {
    type: "PARKOURONE_STORY",
    label: "ParkourONE Story (kompakt)",
    description: "Kurzversion der Story",
    category: "Inhalt",
    Component: ParkourONEStoryCompact,
    defaultContent: PARKOURONE_STORY,
  },
  {
    type: "TESTIMONIALS",
    label: "Kundenstimmen",
    description: "Slider mit Quotes",
    category: "Soziales",
    Component: TestimonialsSection,
    defaultContent: TESTIMONIALS,
  },
  {
    type: "FAQ_ITEMS",
    label: "FAQ",
    description: "Aufklappbare Fragen + Antworten",
    category: "Inhalt",
    Component: FAQSection,
    defaultContent: FAQ_ITEMS,
  },
  {
    type: "VIDEO_CONTENT",
    label: "Video-Block",
    description: "Eingebettetes Video mit Headline",
    category: "Medien",
    Component: VideoSection,
    defaultContent: VIDEO_CONTENT,
  },
  {
    type: "GALLERY_CONTENT",
    label: "Bildergalerie",
    description: "Bildergalerie / Slider",
    category: "Medien",
    Component: ImageGallery,
    defaultContent: GALLERY_CONTENT,
  },
  {
    type: "VORHER_NACHHER_CONTENT",
    label: "Vorher / Nachher",
    description: "Vorher-Nachher-Vergleich",
    category: "Medien",
    Component: VorherNachherTeaser,
    defaultContent: VORHER_NACHHER_CONTENT,
  },
  {
    type: "PROZESS_TEASER_CONTENT",
    label: "Prozess-Teaser",
    description: "Phasen / Schritte des Prozesses",
    category: "Inhalt",
    Component: ProzessTeaser,
    defaultContent: PROZESS_TEASER_CONTENT,
  },
  {
    type: "CONFIGURATOR_CTA_CONTENT",
    label: "Konfigurator-CTA",
    description: "CTA zum Preisrechner",
    category: "Konversion",
    Component: ConfiguratorCTASection,
    defaultContent: CONFIGURATOR_CTA_CONTENT,
  },
  {
    type: "CTA_CONTENT",
    label: "Call-to-Action",
    description: "Abschluss-CTA mit Buttons",
    category: "Konversion",
    Component: CTASection,
    defaultContent: CTA_CONTENT,
  },
];

export function getBlockDef(type: string): BlockDef | undefined {
  return BLOCK_REGISTRY.find((b) => b.type === type);
}

/** Normalize a Next.js pathname to a stable PAGE_BLOCKS key. */
export function pathnameToPageKey(pathname: string): string {
  if (!pathname || pathname === "/") return "home";
  return pathname.replace(/^\/+/, "").replace(/\/+$/, "").replace(/\//g, "_");
}
