/**
 * Content schema migration chain.
 * Each migration takes the tree at version N and returns the tree at N+1.
 * Add new migrations by pushing to `migrations` — never mutate existing ones.
 */

export const CURRENT_SCHEMA_VERSION = 6;

type Migration = (tree: Record<string, unknown>) => Record<string, unknown>;

// v1 is the baseline: stable _id on array blocks + __schemaVersion root key.
// v2 (MAN-05): move NINE_MOVEMENTS images out of the positional zip in
// constants.ts into the content entries themselves so reorder/delete is safe.
const NINE_MOVEMENTS_IMAGES_V2: Record<string, string> = {
  greifen: "/images/posten/greifen.jpg",
  hangeln: "/images/posten/hangeln.jpg",
  stuetzen: "/images/posten/stuetzen.jpg",
  springen: "/images/posten/springen.jpg",
  balancieren: "/images/posten/balancieren.jpg",
  landen: "/images/posten/landen.jpg",
  klettern: "/images/posten/klettern.jpg",
  rollen: "/images/posten/rollen.jpg",
  laufen: "/images/posten/laufen.jpg",
};

// Positional fallback (mirrors the old zip order in constants.ts) for entries
// whose `id` field is not in the map above.
const NINE_MOVEMENTS_POSITIONAL_V2 = [
  "/images/posten/greifen.jpg",
  "/images/posten/hangeln.jpg",
  "/images/posten/stuetzen.jpg",
  "/images/posten/springen.jpg",
  "/images/posten/balancieren.jpg",
  "/images/posten/landen.jpg",
  "/images/posten/klettern.jpg",
  "/images/posten/rollen.jpg",
  "/images/posten/laufen.jpg",
];

const migrations: Record<number, Migration> = {
  1: (tree) => {
    const raw = tree.NINE_MOVEMENTS;
    if (!Array.isArray(raw)) return tree;
    const next = raw.map((entry, i) => {
      if (!entry || typeof entry !== "object") return entry;
      const e = entry as Record<string, unknown>;
      if (typeof e.image === "string" && e.image.length > 0) return e;
      const byId =
        typeof e.id === "string"
          ? NINE_MOVEMENTS_IMAGES_V2[e.id]
          : undefined;
      return {
        ...e,
        image: byId ?? NINE_MOVEMENTS_POSITIONAL_V2[i] ?? "",
      };
    });
    return { ...tree, NINE_MOVEMENTS: next };
  },
  // v2 -> v3: inject default content for newly migrated homepage blocks and
  // Koeniz list items if they are missing. Existing values are preserved.
  2: (tree) => {
    const next: Record<string, unknown> = { ...tree };
    for (const [key, value] of Object.entries(V3_DEFAULTS)) {
      if (next[key] === undefined) next[key] = value;
    }
    // KOENIZ_CASE_STUDY: ensure list sub-keys exist (they already did in v2,
    // but be defensive in case a newer seed drops them).
    const k = next.KOENIZ_CASE_STUDY as Record<string, unknown> | undefined;
    if (k && typeof k === "object") {
      if (!Array.isArray(k.insights)) k.insights = [];
      if (!Array.isArray(k.timeline)) k.timeline = [];
      if (!Array.isArray(k.workshopFeedback)) k.workshopFeedback = [];
    }
    return next;
  },
  // v3 -> v4: seed 8 Bewegungsstationen posten blocks if absent.
  3: (tree) => {
    const next: Record<string, unknown> = { ...tree };
    for (const [key, value] of Object.entries(V4_POSTEN_DEFAULTS)) {
      if (next[key] === undefined) next[key] = value;
    }
    return next;
  },
  // v4 -> v5: seed BENTO_GRID_DEFAULTS (string-name Lucide icons) if absent.
  4: (tree) => {
    const next: Record<string, unknown> = { ...tree };
    for (const [key, value] of Object.entries(V5_DEFAULTS)) {
      if (next[key] === undefined) next[key] = value;
    }
    return next;
  },
  // v5 -> v6: seed FOKUS_CONTENT + legal pages (IMPRESSUM/DATENSCHUTZ) if absent.
  5: (tree) => {
    const next: Record<string, unknown> = { ...tree };
    for (const [key, value] of Object.entries(V6_DEFAULTS)) {
      if (next[key] === undefined) next[key] = value;
    }
    return next;
  },
};

const V6_DEFAULTS: Record<string, unknown> = {
  FOKUS_CONTENT: {
    number: "02",
    title: "FOKUS",
    intro: "",
    exercises: [],
    furtherExercises: [],
    tagescheck: "",
    potenzial: { title: "", content: "" },
  },
  IMPRESSUM_CONTENT: {
    title: "Impressum",
    breadcrumb: "Rechtliches",
    sections: [],
    stand: "",
  },
  DATENSCHUTZ_CONTENT: {
    title: "Datenschutzerklärung",
    breadcrumb: "Rechtliches",
    sections: [],
    stand: "",
  },
};

const V5_DEFAULTS: Record<string, unknown> = {
  BENTO_GRID_DEFAULTS: [
    { _id: "bento-1", title: "TÜV-zertifiziert", description: "Alle Anlagen erfüllen die Sicherheitsnorm DIN EN 16630 und werden regelmässig geprüft.", icon: "Shield", size: "md" },
    { _id: "bento-2", title: "25 Jahre Lebensdauer", description: "Hochwertige Materialien und Verarbeitung für jahrzehntelange Nutzung.", icon: "Clock" },
    { _id: "bento-3", title: "Für alle Generationen", description: "Übungen für Einsteiger bis Fortgeschrittene, von Jung bis Alt.", icon: "Users" },
    { _id: "bento-4", title: "Minimale Wartung", description: "Wartungsarme Konstruktion mit jährlichen Kosten von nur CHF 500-800.", icon: "Wrench" },
    { _id: "bento-5", title: "Modularer Aufbau", description: "Flexible Konfiguration passend zu Ihrem Platzbedarf und Budget.", icon: "Puzzle" },
    { _id: "bento-6", title: "Swiss Made", description: "Entwickelt und produziert in der Schweiz für Schweizer Ansprüche.", icon: "Award" },
  ],
};

// Default seeds written on v2->v3 upgrade when a key is absent. These mirror
// the values already committed into content.json; the migration only kicks in
// for trees that predate the v3 rollout.
const V3_DEFAULTS: Record<string, unknown> = {
  USP_ITEMS: [
    {
      _id: "usp-1",
      title: "Einfache Integration",
      description:
        "RubikONE nutzt, was schon da ist: Wegweiser und Postenschilder werden wo immer möglich an vorhandene Strukturen montiert.",
      image: "/images/gemeinden/integration.jpg",
    },
    {
      _id: "usp-2",
      title: "Nachhaltigkeit",
      description:
        "Das verwendete Material ist langlebig und bei Bedarf leicht zu ersetzen.",
      image: "/images/gemeinden/nachhaltigkeit.jpg",
    },
    {
      _id: "usp-3",
      title: "Lebensqualität",
      description:
        "Bewegung ist Leben – mit RubikONE fördern Sie physische, psychische und soziale Gesundheit.",
      image: "/images/gemeinden/lebensqualitaet.jpg",
    },
  ],
  MOVEMENTS_GRID: [
    { _id: "mv-1", title: "Greifen" },
    { _id: "mv-2", title: "Hangeln" },
    { _id: "mv-3", title: "Balancieren" },
    { _id: "mv-4", title: "Springen" },
    { _id: "mv-5", title: "Klettern" },
    { _id: "mv-6", title: "Ausdehnen" },
    { _id: "mv-7", title: "Kraft" },
    { _id: "mv-8", title: "Quadrupedie" },
    { _id: "mv-9", title: "Laufen" },
  ],
  // SOLUTION_CARDS_CONTENT, LERNDIMENSIONEN_CONTENT and PROCESS_STEPS_CONTENT
  // are seeded directly into content.json — no defaults needed here for the
  // migration path, but we still fall through without clobbering. Empty
  // arrays would pass schema validation if nothing was written.
  SOLUTION_CARDS_CONTENT: [],
  LERNDIMENSIONEN_CONTENT: [],
  PROCESS_STEPS_CONTENT: [],
};

// v4 posten defaults — seed only if a given key is missing. These mirror the
// values written into content.json so fresh trees load correctly.
const V4_POSTEN_DEFAULTS: Record<string, unknown> = {
  POSTEN_CHECK_IN: {
    number: "01",
    title: "CHECK-IN",
    intro:
      "Um optimal vom Training zu profitieren empfehlen wir: Bringe dich zu Beginn physisch und mental in Schwung. Starte deinen Motor und sei bereit auf das was kommt. Als Trainingsstart wählen wir deshalb Übungen die den Herz-Kreislauf anregen und das neuromuskuläre System aktivieren. Ziel: Alle Gelenke durchbewegen (mobilisieren) und mental im Training ankommen.",
    heroImage: "/images/posten/check-in/G1A1984-1-scaled-1.jpg",
    exercises: [
      { _id: "check-in-ex-1", title: "Hüpfen", reps: "1x", description: "In jedes Feld hüpfen.", image: "/images/posten/check-in/springen.png" },
      { _id: "check-in-ex-2", title: "Rotieren", reps: "5x pro Seite", description: "Auf jede Seite drehen und abklatschen. Als Einzelperson auf der Seite in die Hände klatschen.", image: "/images/posten/check-in/drehen.png" },
      { _id: "check-in-ex-3", title: "Armkreisen", reps: "3x", description: "Um das Muster herum joggen. Dabei Arme vorwärts & rückwärts kreisen." },
    ],
    furtherExercises: [],
    tagescheck: "Worauf freust du dich heute?",
    potenzial: { title: "Effizient vs. Effektiv", content: "" },
  },
  POSTEN_ABC: {
    number: "03",
    title: "ABC",
    intro: "",
    exercises: [],
    furtherExercises: [],
    tagescheck: "",
    potenzial: { title: "", content: "" },
  },
  POSTEN_BALANCE: {
    number: "04",
    title: "BALANCE",
    intro: "",
    exercises: [],
    furtherExercises: [],
    tagescheck: "",
    potenzial: { title: "", content: "" },
  },
  POSTEN_SPRUNGKRAFT: {
    number: "05",
    title: "SPRUNGKRAFT",
    intro: "",
    exercises: [],
    furtherExercises: [],
    tagescheck: "",
    potenzial: { title: "", content: "" },
  },
  POSTEN_STABILITAET: {
    number: "06",
    title: "STABILITÄT",
    intro: "",
    exercises: [],
    furtherExercises: [],
    tagescheck: "",
    potenzial: { title: "", content: "" },
  },
  POSTEN_PASSEMENT: {
    number: "07",
    title: "PASSEMENT",
    intro: "",
    exercises: [],
    furtherExercises: [],
    tagescheck: "",
    potenzial: { title: "", content: "" },
  },
  POSTEN_QUADRUPEDIE: {
    number: "08",
    title: "QUADRUPEDIE",
    intro: "",
    exercises: [],
    furtherExercises: [],
    tagescheck: "",
    potenzial: { title: "", content: "" },
  },
  POSTEN_CHECK_OUT: {
    number: "09",
    title: "CHECK-OUT",
    intro: "",
    exercises: [],
    furtherExercises: [],
    tagescheck: "",
    potenzial: { title: "", content: "" },
  },
};

export function migrateContent<T extends Record<string, unknown>>(raw: T): T {
  if (!raw || typeof raw !== "object") return raw;
  let current: Record<string, unknown> = raw;
  let version =
    typeof current.__schemaVersion === "number" ? current.__schemaVersion : 0;

  while (version < CURRENT_SCHEMA_VERSION) {
    const mig = migrations[version];
    if (!mig) {
      // No migration registered: bump version and move on.
      current = { ...current, __schemaVersion: version + 1 };
      version += 1;
      continue;
    }
    current = mig(current);
    version += 1;
    current = { ...current, __schemaVersion: version };
  }
  return current as T;
}
