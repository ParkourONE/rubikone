import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ============================================================
      // CONTENT – Bearbeitet die bestehende content.json direkt
      // ============================================================
      {
        name: "content",
        label: "Website-Inhalte",
        path: "src/content",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          // --- SITE CONFIG ---
          {
            type: "object",
            name: "SITE_CONFIG",
            label: "Site-Einstellungen",
            fields: [
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "tagline", label: "Tagline" },
              { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
              { type: "string", name: "company", label: "Firma" },
            ],
          },

          // --- NAVIGATION ---
          {
            type: "object",
            name: "NAVIGATION_ITEMS",
            label: "Navigation",
            list: true,
            fields: [
              { type: "string", name: "label", label: "Text" },
              { type: "string", name: "href", label: "Link" },
            ],
          },

          // --- HERO ---
          {
            type: "object",
            name: "HERO_CONTENT",
            label: "Startseite Hero",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "headlineAccent", label: "Headline Akzent" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
              { type: "string", name: "videoUrl", label: "Video URL" },
              {
                type: "object", name: "ctaPrimary", label: "Primärer Button",
                fields: [
                  { type: "string", name: "label", label: "Text" },
                  { type: "string", name: "href", label: "Link" },
                ],
              },
              {
                type: "object", name: "ctaSecondary", label: "Sekundärer Button",
                fields: [
                  { type: "string", name: "label", label: "Text" },
                  { type: "string", name: "href", label: "Link" },
                ],
              },
            ],
          },

          // --- TRUST STATS ---
          {
            type: "object",
            name: "TRUST_STATS",
            label: "Vertrauens-Statistiken",
            list: true,
            fields: [
              { type: "string", name: "value", label: "Wert" },
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "sublabel", label: "Sublabel" },
            ],
          },

          // --- PROBLEM ---
          {
            type: "object",
            name: "PROBLEM_CONTENT",
            label: "Problem-Sektion",
            fields: [
              { type: "string", name: "statistic", label: "Statistik" },
              { type: "string", name: "statisticLabel", label: "Statistik-Label" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline" },
              { type: "string", name: "source", label: "Quelle" },
            ],
          },

          // --- SOLUTION ---
          {
            type: "object",
            name: "SOLUTION_CONTENT",
            label: "Lösung-Sektion",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "features", label: "Features", list: true },
              { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
            ],
          },

          // --- 9 MOVEMENTS ---
          {
            type: "object",
            name: "NINE_MOVEMENTS",
            label: "9 Bewegungen",
            list: true,
            fields: [
              { type: "string", name: "id", label: "ID" },
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "description", label: "Beschreibung" },
            ],
          },

          // --- COMPARISON TABLE ---
          {
            type: "object",
            name: "COMPARISON_TABLE",
            label: "Vergleichstabelle (Konzept)",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
              {
                type: "object", name: "features", label: "Vorteile", list: true,
                fields: [
                  { type: "string", name: "label", label: "Vorteil" },
                  { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                ],
              },
            ],
          },

          // --- TESTIMONIALS ---
          {
            type: "object",
            name: "TESTIMONIALS",
            label: "Testimonials",
            list: true,
            fields: [
              { type: "string", name: "quote", label: "Zitat", ui: { component: "textarea" } },
              { type: "string", name: "author", label: "Autor" },
              { type: "string", name: "role", label: "Rolle/Position" },
            ],
          },

          // --- PROCESS PHASES ---
          {
            type: "object",
            name: "PROCESS_PHASES",
            label: "Prozess-Phasen",
            list: true,
            fields: [
              { type: "string", name: "number", label: "Nummer" },
              { type: "string", name: "title", label: "Titel" },
              { type: "string", name: "subtitle", label: "Untertitel" },
              { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
              { type: "string", name: "details", label: "Details", list: true },
              { type: "string", name: "duration", label: "Dauer" },
            ],
          },

          // --- PRICING PACKAGES ---
          {
            type: "object",
            name: "PRICING_PACKAGES",
            label: "Preis-Pakete",
            list: true,
            fields: [
              { type: "string", name: "name", label: "Paket-Name" },
              { type: "string", name: "posts", label: "Posten" },
              { type: "string", name: "idealFor", label: "Ideal für" },
              { type: "string", name: "price", label: "Preis" },
              { type: "boolean", name: "highlighted", label: "Hervorgehoben" },
              { type: "string", name: "badge", label: "Badge" },
              {
                type: "object", name: "features", label: "Features", list: true,
                fields: [
                  { type: "string", name: "name", label: "Feature" },
                  { type: "boolean", name: "included", label: "Enthalten" },
                ],
              },
            ],
          },

          // --- IMPULSWORKSHOP ---
          {
            type: "object",
            name: "IMPULSWORKSHOP",
            label: "Impulsworkshop",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline" },
              { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
              { type: "string", name: "price", label: "Preis" },
              { type: "string", name: "priceNote", label: "Preis-Hinweis" },
              { type: "string", name: "duration", label: "Dauer" },
              { type: "string", name: "participants", label: "Teilnehmende" },
              { type: "string", name: "location", label: "Ort" },
              { type: "string", name: "weather", label: "Wetter" },
              { type: "string", name: "targetAudience", label: "Zielgruppe", ui: { component: "textarea" } },
              {
                type: "object", name: "program", label: "Programm", list: true,
                fields: [
                  { type: "string", name: "title", label: "Titel" },
                  { type: "string", name: "description", label: "Beschreibung" },
                ],
              },
              { type: "string", name: "outcomes", label: "Ergebnisse", list: true },
            ],
          },

          // --- FAQ ---
          {
            type: "object",
            name: "FAQ_ITEMS",
            label: "FAQ",
            list: true,
            fields: [
              { type: "string", name: "question", label: "Frage" },
              { type: "string", name: "answer", label: "Antwort", ui: { component: "textarea" } },
            ],
          },

          // --- CTA ---
          {
            type: "object",
            name: "CTA_CONTENT",
            label: "Call-to-Action",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
              {
                type: "object", name: "ctaPrimary", label: "Primärer Button",
                fields: [
                  { type: "string", name: "label", label: "Text" },
                  { type: "string", name: "href", label: "Link" },
                ],
              },
              {
                type: "object", name: "ctaSecondary", label: "Sekundärer Button",
                fields: [
                  { type: "string", name: "label", label: "Text" },
                  { type: "string", name: "href", label: "Link" },
                ],
              },
              {
                type: "object", name: "downloads", label: "Downloads", list: true,
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "href", label: "Link" },
                ],
              },
            ],
          },

          // --- CONTACT ---
          {
            type: "object",
            name: "CONTACT_PERSON",
            label: "Kontaktperson",
            fields: [
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "role", label: "Rolle" },
              { type: "string", name: "email", label: "E-Mail" },
              { type: "string", name: "phone", label: "Telefon" },
            ],
          },
          {
            type: "object",
            name: "CONTACT_INFO",
            label: "Kontaktdaten",
            fields: [
              { type: "string", name: "company", label: "Firma" },
              { type: "string", name: "street", label: "Strasse" },
              { type: "string", name: "city", label: "Stadt" },
              { type: "string", name: "email", label: "E-Mail" },
              { type: "string", name: "phone", label: "Telefon" },
            ],
          },

          // --- FOOTER ---
          {
            type: "object",
            name: "FOOTER_LINKS",
            label: "Footer-Links",
            fields: [
              {
                type: "object", name: "hauptseiten", label: "Hauptseiten", list: true,
                fields: [
                  { type: "string", name: "label", label: "Text" },
                  { type: "string", name: "href", label: "Link" },
                ],
              },
              {
                type: "object", name: "rechtliches", label: "Rechtliches", list: true,
                fields: [
                  { type: "string", name: "label", label: "Text" },
                  { type: "string", name: "href", label: "Link" },
                ],
              },
              {
                type: "object", name: "partner", label: "Partner", list: true,
                fields: [
                  { type: "string", name: "label", label: "Text" },
                  { type: "string", name: "href", label: "Link" },
                  { type: "string", name: "logo", label: "Logo-Pfad" },
                ],
              },
            ],
          },

          // --- KOENIZ ---
          {
            type: "object",
            name: "KOENIZ_CASE_STUDY",
            label: "Köniz Case Study",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline" },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              {
                type: "object", name: "challenge", label: "Herausforderung",
                fields: [
                  { type: "string", name: "title", label: "Titel" },
                  { type: "string", name: "points", label: "Punkte", list: true },
                ],
              },
              {
                type: "object", name: "solution", label: "Lösung",
                fields: [
                  { type: "string", name: "title", label: "Titel" },
                  { type: "string", name: "points", label: "Punkte", list: true },
                ],
              },
              {
                type: "object", name: "insights", label: "Erkenntnisse", list: true,
                fields: [
                  { type: "string", name: "title", label: "Titel" },
                  { type: "string", name: "shortDesc", label: "Kurzbeschreibung" },
                  { type: "string", name: "fullDesc", label: "Vollbeschreibung", ui: { component: "textarea" } },
                ],
              },
              {
                type: "object", name: "timeline", label: "Timeline", list: true,
                fields: [
                  { type: "string", name: "date", label: "Datum" },
                  { type: "string", name: "event", label: "Ereignis" },
                ],
              },
              { type: "string", name: "denkmalpflege", label: "Denkmalpflege-Text", ui: { component: "textarea" } },
              { type: "string", name: "workshopFeedback", label: "Workshop-Feedback", list: true },
            ],
          },

          // --- PARTNERS ---
          {
            type: "object",
            name: "PARTNERS",
            label: "Partner",
            list: true,
            fields: [
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "description", label: "Beschreibung" },
              { type: "string", name: "url", label: "URL" },
            ],
          },

          // --- STAKEHOLDER ---
          {
            type: "object",
            name: "STAKEHOLDER_BENEFITS",
            label: "Stakeholder-Vorteile",
            fields: [
              {
                type: "object", name: "gemeinden", label: "Gemeinden",
                fields: [
                  { type: "string", name: "title", label: "Titel" },
                  { type: "string", name: "benefits", label: "Vorteile", list: true },
                ],
              },
              {
                type: "object", name: "bildung", label: "Bildung",
                fields: [
                  { type: "string", name: "title", label: "Titel" },
                  { type: "string", name: "benefits", label: "Vorteile", list: true },
                ],
              },
              {
                type: "object", name: "bevoelkerung", label: "Bevölkerung",
                fields: [
                  { type: "string", name: "title", label: "Titel" },
                  { type: "string", name: "benefits", label: "Vorteile", list: true },
                ],
              },
            ],
          },

          // --- SAFETY ---
          {
            type: "object",
            name: "SAFETY_INFO",
            label: "Sicherheit & Normen",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
              {
                type: "object", name: "norms", label: "Normen", list: true,
                fields: [
                  { type: "string", name: "code", label: "Norm-Code" },
                  { type: "string", name: "name", label: "Bezeichnung" },
                ],
              },
            ],
          },

          // --- FLEXIBILITY ---
          {
            type: "object",
            name: "FLEXIBILITY_INFO",
            label: "Flexibilitäts-Info",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
              {
                type: "object", name: "services", label: "Leistungen", list: true,
                fields: [
                  { type: "string", name: "name", label: "Name" },
                  { type: "string", name: "description", label: "Beschreibung" },
                  { type: "boolean", name: "optional", label: "Optional" },
                ],
              },
            ],
          },

          // --- PARKOURONE STORY ---
          {
            type: "object",
            name: "PARKOURONE_STORY",
            label: "ParkourONE Story",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
              {
                type: "object", name: "milestones", label: "Meilensteine", list: true,
                fields: [
                  { type: "string", name: "year", label: "Jahr" },
                  { type: "string", name: "title", label: "Titel" },
                  { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                ],
              },
            ],
          },

          // --- WORKSHOP DETAILS ---
          {
            type: "object",
            name: "WORKSHOP_DETAILS",
            label: "Workshop-Details",
            fields: [
              { type: "string", name: "duration", label: "Dauer" },
              { type: "string", name: "participants", label: "Teilnehmende" },
              {
                type: "object", name: "targetGroups", label: "Zielgruppen", list: true,
                fields: [
                  { type: "string", name: "name", label: "Name" },
                  { type: "string", name: "description", label: "Beschreibung" },
                ],
              },
              {
                type: "object", name: "faq", label: "Workshop-FAQ", list: true,
                fields: [
                  { type: "string", name: "question", label: "Frage" },
                  { type: "string", name: "answer", label: "Antwort", ui: { component: "textarea" } },
                ],
              },
            ],
          },

          // --- CONFIGURATOR ---
          {
            type: "object",
            name: "CONFIGURATOR",
            label: "Konfigurator",
            fields: [
              {
                type: "object", name: "packages", label: "Pakete", list: true,
                fields: [
                  { type: "string", name: "name", label: "Name" },
                  { type: "number", name: "posts", label: "Anzahl Posten" },
                  { type: "number", name: "basePrice", label: "Basispreis (CHF)" },
                  { type: "string", name: "description", label: "Beschreibung" },
                  { type: "boolean", name: "highlighted", label: "Hervorgehoben" },
                ],
              },
              {
                type: "object", name: "additionalServices", label: "Zusatzleistungen", list: true,
                fields: [
                  { type: "string", name: "name", label: "Name" },
                  { type: "number", name: "price", label: "Preis (CHF)" },
                  { type: "string", name: "description", label: "Beschreibung" },
                ],
              },
            ],
          },

          // --- IMAGE CONCEPTS ---
          {
            type: "object",
            name: "IMAGE_CONCEPTS",
            label: "Bild-Konzepte (intern)",
            fields: [
              { type: "string", name: "hero", label: "Hero", ui: { component: "textarea" } },
              { type: "string", name: "problem", label: "Problem", ui: { component: "textarea" } },
              { type: "string", name: "solution", label: "Lösung", ui: { component: "textarea" } },
              { type: "string", name: "koeniz", label: "Köniz", ui: { component: "textarea" } },
              { type: "string", name: "workshop", label: "Workshop", ui: { component: "textarea" } },
              { type: "string", name: "team", label: "Team", ui: { component: "textarea" } },
            ],
          },
        ],
      },
    ],
  },
});
