"use client";

import { useState, useEffect, useCallback } from "react";
import { SectionCard } from "./components/section-card";

// Page -> Section mapping
const PAGES = [
  {
    id: "startseite",
    label: "Startseite",
    sections: [
      { key: "HERO_CONTENT", label: "Hero", icon: "HE", preview: "headline", bg: "white" },
      { key: "TRUST_STATS", label: "Vertrauens-Zahlen", icon: "ST", preview: "list", bg: "white" },
      { key: "PROBLEM_CONTENT", label: "Problem-Statement", icon: "PR", preview: "headline", bg: "white" },
      { key: "SOLUTION_CONTENT", label: "Loesung", icon: "LO", preview: "headline", bg: "white" },
      { key: "TESTIMONIALS", label: "Kundenstimmen", icon: "KS", preview: "list", bg: "gray" },
      { key: "PROCESS_PHASES", label: "4-Phasen-Prozess", icon: "PH", preview: "list", bg: "white" },
      { key: "CTA_CONTENT", label: "Call-to-Action", icon: "CT", preview: "headline", bg: "dark" },
      { key: "IMAGE_CONCEPTS", label: "Bildkonzepte", icon: "BK", preview: "object", bg: "white" },
    ],
  },
  {
    id: "konzept",
    label: "Konzept",
    sections: [
      { key: "COMPARISON_TABLE", label: "Vorteile-Vergleich", icon: "VG", preview: "headline", bg: "white" },
      { key: "NINE_MOVEMENTS", label: "Die 9 Bewegungen", icon: "9B", preview: "list", bg: "white" },
      { key: "SAFETY_INFO", label: "Sicherheit & Normen", icon: "SI", preview: "headline", bg: "gray" },
    ],
  },
  {
    id: "raumgestaltung",
    label: "Raumgestaltung",
    sections: [
      { key: "STAKEHOLDER_BENEFITS", label: "Stakeholder-Vorteile", icon: "SV", preview: "object", bg: "white" },
      { key: "FLEXIBILITY_INFO", label: "Flexible Leistungen", icon: "FL", preview: "headline", bg: "white" },
    ],
  },
  {
    id: "koeniz",
    label: "Koeniz",
    sections: [
      { key: "KOENIZ_CASE_STUDY", label: "Case Study", icon: "CS", preview: "headline", bg: "white" },
      { key: "KOENIZ_DETAILS", label: "Standort-Details", icon: "SD", preview: "object", bg: "gray" },
    ],
  },
  {
    id: "impulsworkshop",
    label: "Impulsworkshop",
    sections: [
      { key: "IMPULSWORKSHOP", label: "Workshop-Inhalt", icon: "WI", preview: "headline", bg: "white" },
      { key: "WORKSHOP_DETAILS", label: "Details & FAQ", icon: "WD", preview: "object", bg: "white" },
    ],
  },
  {
    id: "preise",
    label: "Preise & Konfigurator",
    sections: [
      { key: "PRICING_PACKAGES", label: "Preis-Pakete", icon: "PP", preview: "list", bg: "white" },
      { key: "CONFIGURATOR", label: "Konfigurator", icon: "KO", preview: "object", bg: "white" },
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    sections: [
      { key: "FAQ_ITEMS", label: "Fragen & Antworten", icon: "FA", preview: "list", bg: "white" },
    ],
  },
  {
    id: "ueber-uns",
    label: "Ueber uns",
    sections: [
      { key: "PARKOURONE_STORY", label: "Unsere Geschichte", icon: "GE", preview: "headline", bg: "white" },
      { key: "PARTNERS", label: "Partner", icon: "PA", preview: "list", bg: "white" },
    ],
  },
  {
    id: "allgemein",
    label: "Allgemein",
    sections: [
      { key: "SITE_CONFIG", label: "Website-Einstellungen", icon: "WE", preview: "object", bg: "white" },
      { key: "NAVIGATION_ITEMS", label: "Navigation", icon: "NA", preview: "list", bg: "white" },
      { key: "CONTACT_INFO", label: "Kontaktdaten", icon: "KD", preview: "object", bg: "white" },
      { key: "CONTACT_PERSON", label: "Ansprechpartnerin", icon: "AP", preview: "object", bg: "white" },
      { key: "FOOTER_LINKS", label: "Footer", icon: "FO", preview: "object", bg: "dark" },
    ],
  },
];

type ContentData = Record<string, unknown>;

export default function AdminPage() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [sha, setSha] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>(PAGES[0].id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error("Laden fehlgeschlagen");
      const data = await res.json();
      setContent(data.content);
      setSha(data.sha);
      setHasChanges(false);
    } catch {
      setError("Content konnte nicht geladen werden. Pruefe die GitHub-Konfiguration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleChange = (path: string, value: unknown) => {
    if (!content) return;

    const newContent = JSON.parse(JSON.stringify(content));
    setNestedValue(newContent, path, value);
    setContent(newContent);
    setHasChanges(true);
    setSuccess("");
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const currentPage = PAGES.find((p) => p.id === activeTab);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          sha,
          message: `content: Update ${currentPage?.label || "Inhalte"} via Admin-Panel`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Speichern fehlgeschlagen");
      }

      const data = await res.json();
      setSha(data.sha);
      setHasChanges(false);
      setSuccess("Gespeichert! Vercel deployed automatisch in ca. 30-60 Sekunden.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  };

  const currentPage = PAGES.find((p) => p.id === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Content wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error || "Content konnte nicht geladen werden."}</p>
          <button
            onClick={loadContent}
            className="mt-3 text-sm text-red-700 underline hover:no-underline"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Seiten-Editor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Waehle eine Seite und bearbeite die Sektionen.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                setActiveTab(page.id);
                setSuccess("");
              }}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === page.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Page header */}
      {currentPage && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-800">
            {currentPage.label}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {currentPage.sections.length} {currentPage.sections.length === 1 ? "Sektion" : "Sektionen"}
          </p>
        </div>
      )}

      {/* Section Cards */}
      <div className="space-y-3">
        {currentPage?.sections.map((section) => {
          const sectionContent = content[section.key];
          if (sectionContent === undefined) return null;

          return (
            <SectionCard
              key={section.key}
              section={section}
              content={sectionContent}
              contentKey={section.key}
              onChange={handleChange}
            />
          );
        })}
      </div>

      {/* Save Bar */}
      <div className="sticky bottom-0 mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {hasChanges ? (
              <span className="text-amber-600 font-medium">
                Ungespeicherte Aenderungen
              </span>
            ) : (
              "Keine Aenderungen"
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadContent}
              disabled={saving}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Verwerfen
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Wird gespeichert..." : "Speichern & Deployen"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Sets a nested value in an object given a dot-notation path.
 * Supports array notation like "FAQ_ITEMS[0].question"
 */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
) {
  const parts = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const isIndex = /^\d+$/.test(key);

    if (isIndex) {
      current = (current as unknown as unknown[])[parseInt(key)] as Record<
        string,
        unknown
      >;
    } else {
      current = current[key] as Record<string, unknown>;
    }
  }

  const lastKey = parts[parts.length - 1];
  const isIndex = /^\d+$/.test(lastKey);

  if (isIndex) {
    (current as unknown as unknown[])[parseInt(lastKey)] = value;
  } else {
    current[lastKey] = value;
  }
}
