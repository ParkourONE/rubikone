"use client";

import { useState } from "react";
import { FieldEditor } from "./field-editor";

interface SectionConfig {
  key: string;
  label: string;
  icon: string;
  preview: string;
  bg: string;
}

interface SectionCardProps {
  section: SectionConfig;
  content: unknown;
  contentKey: string;
  onChange: (path: string, value: unknown) => void;
}

// --- Preview renderers ---

function getHeadlinePreview(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const obj = content as Record<string, unknown>;
  // Try common headline keys
  for (const key of ["headline", "title", "name", "question"]) {
    if (typeof obj[key] === "string" && obj[key]) {
      return obj[key] as string;
    }
  }
  return "";
}

function getSubheadlinePreview(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const obj = content as Record<string, unknown>;
  for (const key of ["subheadline", "subtitle", "description", "intro"]) {
    if (typeof obj[key] === "string" && obj[key]) {
      const text = obj[key] as string;
      return text.length > 120 ? text.slice(0, 120) + "..." : text;
    }
  }
  return "";
}

function getListCount(content: unknown): number {
  if (Array.isArray(content)) return content.length;
  return 0;
}

function getObjectKeyCount(content: unknown): number {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return Object.keys(content as Record<string, unknown>).length;
  }
  return 0;
}

function getListItemLabels(content: unknown): string[] {
  if (!Array.isArray(content)) return [];
  return content.slice(0, 4).map((item) => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      const obj = item as Record<string, unknown>;
      for (const key of ["title", "name", "label", "question", "value", "quote"]) {
        if (typeof obj[key] === "string" && obj[key]) {
          const text = obj[key] as string;
          return text.length > 60 ? text.slice(0, 60) + "..." : text;
        }
      }
    }
    return "";
  }).filter(Boolean);
}

function getObjectSubkeys(content: unknown): string[] {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return Object.keys(content as Record<string, unknown>).slice(0, 6);
  }
  return [];
}

// --- Background style ---

function getBgClasses(bg: string): { container: string; header: string; text: string; subtext: string } {
  switch (bg) {
    case "dark":
      return {
        container: "bg-gray-900 border-gray-700",
        header: "text-white",
        text: "text-gray-200",
        subtext: "text-gray-400",
      };
    case "gray":
      return {
        container: "bg-gray-50 border-gray-200",
        header: "text-gray-900",
        text: "text-gray-700",
        subtext: "text-gray-500",
      };
    default:
      return {
        container: "bg-white border-gray-200",
        header: "text-gray-900",
        text: "text-gray-700",
        subtext: "text-gray-500",
      };
  }
}

// --- Section-specific preview components ---

function HeroPreview({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") return null;
  const obj = content as Record<string, unknown>;
  const headline = (obj.headline as string) || "";
  const subheadline = (obj.subheadline as string) || "";
  const ctaPrimary = obj.ctaPrimary as Record<string, unknown> | undefined;
  const ctaSecondary = obj.ctaSecondary as Record<string, unknown> | undefined;

  return (
    <div className="mt-3 space-y-2">
      {headline && (
        <p className="text-lg font-semibold text-gray-900 leading-tight">{headline}</p>
      )}
      {subheadline && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{subheadline}</p>
      )}
      {(ctaPrimary || ctaSecondary) && (
        <div className="flex gap-2 pt-1">
          {ctaPrimary && (
            <span className="inline-block px-2.5 py-1 bg-gray-900 text-white text-[10px] rounded-full">
              {(ctaPrimary.label as string) || "CTA"}
            </span>
          )}
          {ctaSecondary && (
            <span className="inline-block px-2.5 py-1 border border-gray-300 text-gray-600 text-[10px] rounded-full">
              {(ctaSecondary.label as string) || "CTA"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function CTAPreview({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") return null;
  const obj = content as Record<string, unknown>;
  const headline = (obj.headline as string) || "";
  const subheadline = (obj.subheadline as string) || "";

  return (
    <div className="mt-3 space-y-1.5">
      {headline && (
        <p className="text-sm font-semibold text-gray-100 leading-tight">{headline}</p>
      )}
      {subheadline && (
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{subheadline}</p>
      )}
    </div>
  );
}

function TestimonialsPreview({ content }: { content: unknown }) {
  if (!Array.isArray(content)) return null;
  return (
    <div className="mt-3 space-y-2">
      {content.slice(0, 2).map((item, i) => {
        const obj = item as Record<string, unknown>;
        return (
          <div key={i} className="flex items-start gap-2">
            <span className="text-gray-300 text-xs mt-0.5 flex-shrink-0">&ldquo;</span>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-600 line-clamp-1 italic">
                {((obj.quote as string) || "").slice(0, 80)}...
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {obj.author as string}
              </p>
            </div>
          </div>
        );
      })}
      {content.length > 2 && (
        <p className="text-[10px] text-gray-400">+{content.length - 2} weitere</p>
      )}
    </div>
  );
}

function FAQPreview({ content }: { content: unknown }) {
  if (!Array.isArray(content)) return null;
  return (
    <div className="mt-3 space-y-1">
      {content.slice(0, 3).map((item, i) => {
        const obj = item as Record<string, unknown>;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-[9px] flex items-center justify-center flex-shrink-0">?</span>
            <p className="text-[11px] text-gray-600 truncate">{obj.question as string}</p>
          </div>
        );
      })}
      {content.length > 3 && (
        <p className="text-[10px] text-gray-400 pl-6">+{content.length - 3} weitere Fragen</p>
      )}
    </div>
  );
}

function ListPreview({ content }: { content: unknown }) {
  const labels = getListItemLabels(content);
  const total = getListCount(content);
  if (labels.length === 0) return null;

  return (
    <div className="mt-3 space-y-1">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
          <p className="text-[11px] text-gray-600 truncate">{label}</p>
        </div>
      ))}
      {total > 4 && (
        <p className="text-[10px] text-gray-400 pl-3">+{total - 4} weitere</p>
      )}
    </div>
  );
}

function ObjectPreview({ content }: { content: unknown }) {
  const keys = getObjectSubkeys(content);
  if (keys.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1">
      {keys.map((key) => (
        <span key={key} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">
          {humanizeKey(key)}
        </span>
      ))}
    </div>
  );
}

// --- Render the right preview based on section key ---

function SectionPreviewContent({ section, content }: { section: SectionConfig; content: unknown }) {
  // Special previews for known section types
  switch (section.key) {
    case "HERO_CONTENT":
      return <HeroPreview content={content} />;
    case "CTA_CONTENT":
      return <CTAPreview content={content} />;
    case "TESTIMONIALS":
      return <TestimonialsPreview content={content} />;
    case "FAQ_ITEMS":
      return <FAQPreview content={content} />;
    default:
      break;
  }

  // Generic previews based on preview type
  switch (section.preview) {
    case "headline": {
      const headline = getHeadlinePreview(content);
      const sub = getSubheadlinePreview(content);
      return (
        <div className="mt-3 space-y-1">
          {headline && <p className="text-sm font-medium text-gray-800 leading-tight">{headline}</p>}
          {sub && <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{sub}</p>}
        </div>
      );
    }
    case "list":
      return <ListPreview content={content} />;
    case "object":
      return <ObjectPreview content={content} />;
    default:
      return null;
  }
}

// --- Info badge ---

function InfoBadge({ section, content }: { section: SectionConfig; content: unknown }) {
  switch (section.preview) {
    case "list": {
      const count = getListCount(content);
      return (
        <span className="text-[11px] text-gray-400 tabular-nums">
          {count} {count === 1 ? "Eintrag" : "Eintraege"}
        </span>
      );
    }
    case "object": {
      const count = getObjectKeyCount(content);
      return (
        <span className="text-[11px] text-gray-400 tabular-nums">
          {count} {count === 1 ? "Feld" : "Felder"}
        </span>
      );
    }
    case "headline": {
      const headline = getHeadlinePreview(content);
      if (!headline) return null;
      const truncated = headline.length > 40 ? headline.slice(0, 40) + "..." : headline;
      return (
        <span className="text-[11px] text-gray-400 truncate max-w-[200px] hidden sm:inline">
          {truncated}
        </span>
      );
    }
    default:
      return null;
  }
}

// --- Main SectionCard ---

export function SectionCard({ section, content, contentKey, onChange }: SectionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const bg = getBgClasses(section.bg);

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${bg.container}`}>
      {/* Header - always visible */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-base flex-shrink-0" aria-hidden="true">{section.icon}</span>
            <div className="min-w-0">
              <h3 className={`text-sm font-semibold leading-tight ${bg.header}`}>
                {section.label}
              </h3>
              <div className="mt-0.5">
                <InfoBadge section={section} content={content} />
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              expanded
                ? section.bg === "dark"
                  ? "bg-white/10 text-gray-300 hover:bg-white/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : section.bg === "dark"
                  ? "bg-white/10 text-gray-300 hover:bg-white/20"
                  : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {expanded ? "Schliessen" : "Bearbeiten"}
          </button>
        </div>

        {/* Mini preview - only when collapsed */}
        {!expanded && (
          <SectionPreviewContent section={section} content={content} />
        )}
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="border-t border-gray-200 bg-white px-5 py-5">
          <div className="space-y-4">
            {Array.isArray(content) ? (
              <FieldEditor
                label={section.label}
                value={content}
                path={contentKey}
                onChange={onChange}
                depth={0}
              />
            ) : typeof content === "object" && content !== null ? (
              Object.entries(content as Record<string, unknown>).map(
                ([fieldKey, fieldValue]) => (
                  <FieldEditor
                    key={fieldKey}
                    label={fieldKey}
                    value={fieldValue}
                    path={`${contentKey}.${fieldKey}`}
                    onChange={onChange}
                    depth={0}
                  />
                )
              )
            ) : (
              <FieldEditor
                label={contentKey}
                value={content}
                path={contentKey}
                onChange={onChange}
                depth={0}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helpers ---

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\s/, "")
    .trim();
}
