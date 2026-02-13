// ===========================================
// RUBIKONE WEBSITE - CONSTANTS
// Importiert editierbare Texte aus content.json
// Nicht-editierbare Werte (Icons, Bilder, Koordinaten) bleiben hier
// ===========================================

import content from "@/content/content.json";

// Site Configuration
export const SITE_CONFIG = {
  ...content.SITE_CONFIG,
  url: "https://rubikone.ch",
  companyUrl: "https://parkourone.ch",
} as const;

// Navigation (Konfigurator is handled separately as overlay button)
export const NAVIGATION_ITEMS = content.NAVIGATION_ITEMS;

// Hero Content
export const HERO_CONTENT = content.HERO_CONTENT;

// Trust Stats (echte Zahlen aus Abschlussbericht)
export const TRUST_STATS = content.TRUST_STATS;

// Problem Section
export const PROBLEM_CONTENT = content.PROBLEM_CONTENT;

// Solution Section
export const SOLUTION_CONTENT = content.SOLUTION_CONTENT;

// Die 9 Posten (images bleiben hier, Texte aus JSON)
export const NINE_MOVEMENTS = content.NINE_MOVEMENTS.map((m, i) => ({
  ...m,
  image: [
    "/images/posten/greifen.jpg",
    "/images/posten/hangeln.jpg",
    "/images/posten/stuetzen.jpg",
    "/images/posten/springen.jpg",
    "/images/posten/balancieren.jpg",
    "/images/posten/landen.jpg",
    "/images/posten/klettern.jpg",
    "/images/posten/rollen.jpg",
    "/images/posten/laufen.jpg",
  ][i],
}));

// Schwierigkeitsgrade (nicht editierbar - Farb-Codes)
export const DIFFICULTY_LEVELS = {
  green: { label: "Einfach", color: "#22C55E" },
  blue: { label: "Mittel", color: "#3B82F6" },
  red: { label: "Schwer", color: "#EF4444" },
} as const;

// RubikONE Vorteile (icons bleiben hier, Texte aus JSON)
const COMPARISON_ICONS = ["map", "construction", "users", "science", "tools", "puzzle"] as const;
export const COMPARISON_TABLE = {
  headline: content.COMPARISON_TABLE.headline,
  subheadline: content.COMPARISON_TABLE.subheadline,
  features: content.COMPARISON_TABLE.features.map((f, i) => ({
    ...f,
    icon: COMPARISON_ICONS[i],
  })),
} as const;

// Testimonials (logos bleiben hier)
const TESTIMONIAL_LOGOS = ["/images/logos/baspo.gif", "/images/logos/koeniz.jpg"] as const;
export const TESTIMONIALS = content.TESTIMONIALS.map((t, i) => ({
  ...t,
  logo: TESTIMONIAL_LOGOS[i],
}));

// 4-Phasen Prozess
export const PROCESS_PHASES = content.PROCESS_PHASES;

// Pricing Packages
export const PRICING_PACKAGES = content.PRICING_PACKAGES;

// Impulsworkshop Details
export const IMPULSWORKSHOP = content.IMPULSWORKSHOP;

// Köniz Case Study (images bleiben hier)
export const KOENIZ_CASE_STUDY = {
  ...content.KOENIZ_CASE_STUDY,
  challenge: {
    ...content.KOENIZ_CASE_STUDY.challenge,
    image: "/images/konzept/vorher.jpg",
  },
  solution: {
    ...content.KOENIZ_CASE_STUDY.solution,
    image: "/images/konzept/nachher.jpg",
  },
};

// Partner Logos (logos/images bleiben hier)
const PARTNER_LOGOS = ["/images/partners/baspo.png", "/images/partners/koeniz.png"] as const;
export const PARTNERS = content.PARTNERS.map((p, i) => ({
  ...p,
  logo: PARTNER_LOGOS[i],
}));

// Ansprechpartnerin (image bleibt hier)
export const CONTACT_PERSON = {
  ...content.CONTACT_PERSON,
  image: "/images/team/michele.jpg",
};

// Contact Info
export const CONTACT_INFO = content.CONTACT_INFO;

// Footer Links
export const FOOTER_LINKS = content.FOOTER_LINKS;

// FAQ Items
export const FAQ_ITEMS = content.FAQ_ITEMS;

// CTA Content
export const CTA_CONTENT = content.CTA_CONTENT;

// Mehrwert für Stakeholder (icons bleiben hier)
export const STAKEHOLDER_BENEFITS = {
  gemeinden: {
    ...content.STAKEHOLDER_BENEFITS.gemeinden,
    icon: "Building2",
  },
  bildung: {
    ...content.STAKEHOLDER_BENEFITS.bildung,
    icon: "GraduationCap",
  },
  bevoelkerung: {
    ...content.STAKEHOLDER_BENEFITS.bevoelkerung,
    icon: "Users",
  },
} as const;

// Normen & Sicherheit
export const SAFETY_INFO = content.SAFETY_INFO;

// Flexibilität Info
export const FLEXIBILITY_INFO = content.FLEXIBILITY_INFO;

// ===========================================
// PARKOURONE - DIE PIONIERE
// ===========================================

// Team images bleiben hier
export const PARKOURONE_STORY = {
  ...content.PARKOURONE_STORY,
  team: content.PARKOURONE_STORY.team.map((member, i) => ({
    ...member,
    image: ["/images/team/roger.jpg", "/images/team/michele.jpg"][i],
  })),
};

// Emotionale Bildkonzepte
export const IMAGE_CONCEPTS = content.IMAGE_CONCEPTS;

// Zusätzliche Köniz Details (coordinates, mapUrl, gallery bleiben hier)
export const KOENIZ_DETAILS = {
  ...content.KOENIZ_DETAILS,
  location: {
    ...content.KOENIZ_DETAILS.location,
    coordinates: { lat: 46.9214587, lng: 7.4141155 },
    mapUrl: "https://www.google.com/maps/place/RubikONE/@46.9213899,7.4126901,718m/data=!3m1!1e3!4m6!3m5!1s0x478e3900134580bb:0x14c092f51700878b!8m2!3d46.9214587!4d7.4141155!16s%2Fg%2F11wmd6132x",
  },
  gallery: [
    { src: "/images/koeniz/eroeffnung.jpg", alt: "Eröffnungsfeier RubikONE Köniz", caption: "140 Besucher bei der Eröffnung" },
    { src: "/images/koeniz/posten-greifen.jpg", alt: "Posten Greifen am Schloss", caption: "Posten 1: Greifen" },
    { src: "/images/koeniz/balancieren.jpg", alt: "Kind balanciert auf Mauer", caption: "Für alle Generationen" },
    { src: "/images/koeniz/schild.jpg", alt: "RubikONE Beschilderung", caption: "Klare Beschilderung" },
    { src: "/images/koeniz/luftbild.jpg", alt: "Luftaufnahme Route", caption: "2.5 km Route durch das Areal" },
  ],
};

// Impulsworkshop erweitert
export const WORKSHOP_DETAILS = {
  ...IMPULSWORKSHOP,
  ...content.WORKSHOP_DETAILS,
};

// Konfigurator
export const CONFIGURATOR = content.CONFIGURATOR;
