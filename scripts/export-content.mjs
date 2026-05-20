#!/usr/bin/env node
// Exports each page of the site to a Markdown file in content-export/.
// One MD per page. Each section is a YAML-frontmatter block followed by
// a "Vorhandene Medien" list and a pretty-printed content body.
// Re-run: `node scripts/export-content.mjs`

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PAGES_DIR = path.join(PROJECT_ROOT, "src/app");
const CONTENT_PATH = path.join(PROJECT_ROOT, "src/content/content.json");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "content-export");

const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));

const SEPARATOR = "═".repeat(79);

const LAYOUT_MAP = {
  HeroSection:
    "Split-Layout — Text links (Headline + Subheadline + 2 CTAs), Video rechts (Auto-Loop). Auf Mobil gestapelt.",
  PageHero:
    "Sub-Page Hero — Breadcrumb + großer Titel + Beschreibung + Hintergrundbild.",
  WasWaereWennHook:
    "Zentrierter, schmaler Text-Block. Nur Headline + Beschreibungstext.",
  VideoSection:
    "Zentriert. Tagline + Headline + Beschreibung, darunter Video-Embed (YouTube). Fallback-Bild solange Video nicht geladen.",
  VorherNachherTeaser:
    "Tagline + Headline + Beschreibung. Darunter zweispaltiger Bildvergleich (Vorher/Nachher). CTA-Button unten.",
  TestimonialsSection:
    "Zweispalten-Cards mit Zitaten, Autor und Rolle. Auf Mobil gestapelt.",
  ImageGallery:
    "Tagline + Headline. Darunter horizontaler Bilder-Slider mit Titel und Kommentar pro Bild.",
  ProzessTeaser:
    "Block mit Tagline, Headline und zwei Beschreibungstexten. CTA-Button am Ende.",
  ConfiguratorCTASection:
    "Zentrierter Block mit Headline, Subheadline und Hinweis.",
  CTASection:
    "CTA-Banner (dunkel) mit Headline + Subheadline + zwei CTAs + optionalen Downloads.",
  PostenPageClient:
    "Bewegungsstations-Seite — Hero, Beschreibung, Übungen, Navigation zur nächsten Station.",
  LegalPageClient:
    "Rechts-Seite — Strukturierter Text mit Überschriften und Absätzen.",
  section:
    "Eigener Layout-Block (siehe Live-Site für genaue Darstellung).",
};

// ---------- JSX parsing ----------

function extractEditableSections(src) {
  const re =
    /<EditableSection\s+contentKey="(\w+)"\s+label="([^"]+)"\s*>([\s\S]*?)<\/EditableSection>/g;
  const sections = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const [, contentKey, label, inner] = m;
    // Find first JSX tag inside (skipping whitespace/comments)
    const compMatch = /<(\w+)/.exec(inner.replace(/\{\/\*[\s\S]*?\*\/\}/g, ""));
    sections.push({
      contentKey,
      label,
      componentType: compMatch?.[1] ?? "section",
    });
  }
  return sections;
}

function extractTemplateSection(src) {
  // Match <ClientComponent ... contentKey="KEY" ... />
  const re =
    /<(PostenPageClient|LegalPageClient)[\s\S]*?contentKey="(\w+)"/;
  const m = re.exec(src);
  if (!m) return null;
  const [, componentType, contentKey] = m;
  const label =
    componentType === "PostenPageClient" ? "Bewegungsstation" : "Rechts-Inhalt";
  return [{ contentKey, label, componentType }];
}

function extractSections(pageFile) {
  const src = fs.readFileSync(pageFile, "utf8");
  const editables = extractEditableSections(src);
  if (editables.length > 0) return editables;
  const template = extractTemplateSection(src);
  if (template) return template;
  return [];
}

// ---------- Media detection ----------

function isMediaPath(s) {
  if (typeof s !== "string") return false;
  if (s.startsWith("/") && /\.(jpe?g|png|webp|gif|svg|mp4|webm|pdf)$/i.test(s))
    return true;
  if (/(youtube\.com|youtu\.be|vimeo\.com)/i.test(s)) return true;
  return false;
}

function detectMedia(obj, results = [], pathLabel = "") {
  if (typeof obj === "string") {
    if (isMediaPath(obj)) {
      results.push({ path: obj, role: pathLabel });
    }
    return results;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) =>
      detectMedia(item, results, pathLabel ? `${pathLabel}[${i + 1}]` : `#${i + 1}`)
    );
    return results;
  }
  if (obj && typeof obj === "object") {
    Object.entries(obj).forEach(([k, v]) => {
      if (k.startsWith("_")) return;
      const sub = pathLabel ? `${pathLabel}.${k}` : k;
      detectMedia(v, results, sub);
    });
    return results;
  }
  return results;
}

// ---------- Pretty-print ----------

function isPrimitive(v) {
  return (
    v === null ||
    v === undefined ||
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  );
}

function formatPrimitive(v) {
  if (v === null || v === undefined) return "(leer)";
  if (v === "") return "(leer)";
  return String(v);
}

function formatKV(key, value, depth) {
  const indent = "  ".repeat(depth);
  if (isPrimitive(value)) {
    const s = formatPrimitive(value);
    // Multi-line strings on a new line
    if (typeof value === "string" && value.includes("\n")) {
      return `${indent}${key}:\n${value
        .split("\n")
        .map((l) => `${indent}  ${l}`)
        .join("\n")}`;
    }
    if (typeof value === "string" && value.length > 80) {
      return `${indent}${key}:\n${indent}  ${value}`;
    }
    return `${indent}${key}: ${s}`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return `${indent}${key}: (leere Liste)`;
    const items = value
      .map((item, i) => {
        if (isPrimitive(item)) return `${indent}  - ${formatPrimitive(item)}`;
        // object item -> sub-block
        const subLines = Object.entries(item)
          .filter(([k]) => !k.startsWith("_"))
          .map(([k, v]) => formatKV(k, v, depth + 2))
          .join("\n");
        return `${indent}  ${i + 1}.\n${subLines}`;
      })
      .join("\n");
    return `${indent}${key}:\n${items}`;
  }
  if (typeof value === "object") {
    const subLines = Object.entries(value)
      .filter(([k]) => !k.startsWith("_"))
      .map(([k, v]) => formatKV(k, v, depth + 1))
      .join("\n");
    return `${indent}${key}:\n${subLines}`;
  }
  return `${indent}${key}: ${String(value)}`;
}

function prettyContent(obj) {
  if (obj === undefined || obj === null) return "(content.json hat keinen Eintrag)";
  if (isPrimitive(obj)) return formatPrimitive(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "(leere Liste)";
    return obj
      .map((item, i) => {
        if (isPrimitive(item)) return `${i + 1}. ${formatPrimitive(item)}`;
        const subLines = Object.entries(item)
          .filter(([k]) => !k.startsWith("_"))
          .map(([k, v]) => formatKV(k, v, 1))
          .join("\n");
        return `## Eintrag ${i + 1}\n${subLines}`;
      })
      .join("\n\n");
  }
  // Object: format top-level fields without indent
  return Object.entries(obj)
    .filter(([k]) => !k.startsWith("_"))
    .map(([k, v]) => formatKV(k, v, 0))
    .join("\n\n");
}

// ---------- Per-page assembly ----------

function buildSectionBlock(section, sectionNum, contentBlock) {
  const layoutCurrent =
    LAYOUT_MAP[section.componentType] ??
    `Custom Komponente "${section.componentType}" — siehe Live-Site.`;
  const media = detectMedia(contentBlock);

  const frontmatter = [
    "---",
    `section: ${sectionNum}`,
    `type: ${section.componentType}`,
    `contentKey: ${section.contentKey}`,
    `layoutCurrent: ${JSON.stringify(layoutCurrent)}`,
    `layoutWish: ""`,
    `action: ""`,
    `notes: ""`,
    "---",
  ].join("\n");

  const lines = [];
  lines.push("");
  lines.push(`# ${section.label}`);
  lines.push("");

  if (media.length > 0) {
    lines.push("### Vorhandene Medien");
    media.forEach((m) => {
      lines.push(`- \`${m.path}\` _(Position: ${m.role || "—"})_`);
    });
    lines.push("");
  } else {
    lines.push("### Vorhandene Medien");
    lines.push("(keine Bilder oder Videos in dieser Sektion)");
    lines.push("");
  }

  lines.push("### Inhalt");
  lines.push("");
  lines.push(prettyContent(contentBlock));

  return `${SEPARATOR}\n\n${frontmatter}\n${lines.join("\n")}\n`;
}

function pageToMd(pageFile) {
  const sections = extractSections(pageFile);
  if (sections.length === 0) return null;
  const blocks = sections.map((section, i) =>
    buildSectionBlock(section, i + 1, content[section.contentKey])
  );
  return blocks.join("\n") + "\n" + SEPARATOR + "\n";
}

// ---------- Page inventory ----------

const PAGE_FILES = [{ file: "src/app/page.tsx", slug: "home", route: "/" }];

const subdirs = fs
  .readdirSync(PAGES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !["admin", "api"].includes(d.name));
for (const dir of subdirs) {
  const pageFile = path.join(PAGES_DIR, dir.name, "page.tsx");
  if (fs.existsSync(pageFile)) {
    PAGE_FILES.push({
      file: `src/app/${dir.name}/page.tsx`,
      slug: dir.name,
      route: `/${dir.name}`,
    });
  }
}

// ---------- Run ----------

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

let written = 0;
const skipped = [];

for (const page of PAGE_FILES) {
  const fullPath = path.join(PROJECT_ROOT, page.file);
  const md = pageToMd(fullPath);
  if (md === null) {
    skipped.push(page.route);
    continue;
  }
  const outPath = path.join(OUTPUT_DIR, `${page.slug}.md`);
  fs.writeFileSync(outPath, md);
  console.log(`WROTE  ${page.slug}.md  (route: ${page.route})`);
  written++;
}

if (skipped.length > 0) {
  console.log("");
  console.log("SKIPPED (kein extractable content):");
  skipped.forEach((r) => console.log(`  ${r}`));
}

console.log("");
console.log(`Done: ${written} files in content-export/, ${skipped.length} skipped.`);
