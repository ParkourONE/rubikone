"use client";

import { useState, useEffect, useCallback } from "react";
import { FieldEditor } from "./components/field-editor";

// Tab configuration: maps tab names to content.json keys
const TABS = [
  {
    id: "allgemein",
    label: "Allgemein",
    keys: ["SITE_CONFIG", "NAVIGATION_ITEMS", "CONTACT_INFO", "CONTACT_PERSON", "FOOTER_LINKS"],
  },
  {
    id: "startseite",
    label: "Startseite",
    keys: [
      "HERO_CONTENT",
      "TRUST_STATS",
      "PROBLEM_CONTENT",
      "SOLUTION_CONTENT",
      "COMPARISON_TABLE",
      "TESTIMONIALS",
      "PROCESS_PHASES",
      "CTA_CONTENT",
      "IMAGE_CONCEPTS",
    ],
  },
  {
    id: "koeniz",
    label: "Köniz",
    keys: ["KOENIZ_CASE_STUDY", "KOENIZ_DETAILS"],
  },
  {
    id: "impulsworkshop",
    label: "Impulsworkshop",
    keys: ["IMPULSWORKSHOP", "WORKSHOP_DETAILS"],
  },
  {
    id: "preise",
    label: "Preise & Konfigurator",
    keys: ["PRICING_PACKAGES", "CONFIGURATOR", "FLEXIBILITY_INFO"],
  },
  {
    id: "faq",
    label: "FAQ",
    keys: ["FAQ_ITEMS"],
  },
  {
    id: "ueber-uns",
    label: "Über uns",
    keys: [
      "PARKOURONE_STORY",
      "PARTNERS",
      "STAKEHOLDER_BENEFITS",
      "SAFETY_INFO",
    ],
  },
  {
    id: "posten",
    label: "9 Posten",
    keys: ["NINE_MOVEMENTS"],
  },
] as const;

// Map of German section names for display
const SECTION_LABELS: Record<string, string> = {
  SITE_CONFIG: "Website-Konfiguration",
  NAVIGATION_ITEMS: "Navigation",
  CONTACT_INFO: "Kontaktdaten",
  CONTACT_PERSON: "Ansprechpartnerin",
  FOOTER_LINKS: "Footer-Links",
  HERO_CONTENT: "Hero-Bereich",
  TRUST_STATS: "Vertrauens-Statistiken",
  PROBLEM_CONTENT: "Problem-Sektion",
  SOLUTION_CONTENT: "Lösung-Sektion",
  COMPARISON_TABLE: "Vorteile-Vergleich",
  TESTIMONIALS: "Kundenstimmen",
  PROCESS_PHASES: "4-Phasen-Prozess",
  CTA_CONTENT: "Call-to-Action",
  IMAGE_CONCEPTS: "Bildkonzepte",
  KOENIZ_CASE_STUDY: "Case Study Köniz",
  KOENIZ_DETAILS: "Köniz Details",
  IMPULSWORKSHOP: "Impulsworkshop",
  WORKSHOP_DETAILS: "Workshop Details",
  PRICING_PACKAGES: "Preispakete",
  CONFIGURATOR: "Konfigurator",
  FLEXIBILITY_INFO: "Flexibilität",
  FAQ_ITEMS: "FAQ",
  PARKOURONE_STORY: "ParkourONE Story",
  PARTNERS: "Partner",
  STAKEHOLDER_BENEFITS: "Stakeholder-Mehrwert",
  SAFETY_INFO: "Sicherheit & Normen",
  NINE_MOVEMENTS: "Die 9 Posten",
};

type ContentData = Record<string, unknown>;

export default function AdminPage() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [sha, setSha] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);
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
      setError("Content konnte nicht geladen werden. Prüfe die GitHub-Konfiguration.");
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
      const currentTab = TABS.find((t) => t.id === activeTab);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          sha,
          message: `content: Update ${currentTab?.label || "Inhalte"} via Admin-Panel`,
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

  const currentTab = TABS.find((t) => t.id === activeTab);

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
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSuccess("");
              }}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
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

      {/* Content Sections */}
      <div className="space-y-8">
        {currentTab?.keys.map((key) => {
          const sectionContent = content[key];
          if (sectionContent === undefined) return null;

          return (
            <section
              key={key}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">
                  {SECTION_LABELS[key] || key}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {Array.isArray(sectionContent) ? (
                  <FieldEditor
                    label={SECTION_LABELS[key] || key}
                    value={sectionContent}
                    path={key}
                    onChange={handleChange}
                    depth={0}
                  />
                ) : typeof sectionContent === "object" &&
                  sectionContent !== null ? (
                  Object.entries(
                    sectionContent as Record<string, unknown>
                  ).map(([fieldKey, fieldValue]) => (
                    <FieldEditor
                      key={fieldKey}
                      label={fieldKey}
                      value={fieldValue}
                      path={`${key}.${fieldKey}`}
                      onChange={handleChange}
                      depth={0}
                    />
                  ))
                ) : (
                  <FieldEditor
                    label={key}
                    value={sectionContent}
                    path={key}
                    onChange={handleChange}
                    depth={0}
                  />
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Save Bar */}
      <div className="sticky bottom-0 mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {hasChanges ? (
              <span className="text-amber-600 font-medium">
                Ungespeicherte Änderungen
              </span>
            ) : (
              "Keine Änderungen"
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
