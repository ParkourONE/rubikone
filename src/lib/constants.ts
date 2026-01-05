// ===========================================
// RUBIKONE WEBSITE - CONSTANTS
// Echter Inhalt basierend auf Abschlussbericht & Strategie
// ===========================================

// Site Configuration
export const SITE_CONFIG = {
  name: "RubikONE",
  tagline: "Die Stadt wird zum Bewegungsraum",
  url: "https://rubikone.ch",
  description: "RubikONE verwandelt bestehende Orte in Bewegungsräume – wissenschaftlich fundiert, von Köniz bewiesen.",
  company: "ParkourONE",
  companyUrl: "https://parkourone.ch",
} as const;

// Navigation
export const NAVIGATION_ITEMS = [
  { label: "Konzept", href: "/konzept" },
  { label: "Fallstudie Köniz", href: "/koeniz" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Impulsworkshop", href: "/impulsworkshop" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

// Hero Content
export const HERO_CONTENT = {
  headline: "Sie sehen eine Treppe.",
  headlineAccent: "Wir sehen einen Spielplatz.",
  subheadline: "RubikONE verwandelt Ihre Gemeinde in einen Bewegungsraum. Ohne neue Geräte. Ohne Tiefbau. Mit wissenschaftlicher Wirkung.",
  videoUrl: "https://www.youtube.com/watch?v=wGEUzjLv0Ac",
  ctaPrimary: {
    label: "Impulsworkshop anfragen",
    href: "/impulsworkshop",
  },
  ctaSecondary: {
    label: "Fallstudie Köniz",
    href: "/koeniz",
  },
} as const;

// Trust Stats (echte Zahlen aus Abschlussbericht)
export const TRUST_STATS = [
  {
    value: "531",
    label: "Teilnehmende",
    sublabel: "in Köniz",
  },
  {
    value: "94%",
    label: "verstehen's",
    sublabel: "sofort",
  },
  {
    value: "84%",
    label: "schätzen den",
    sublabel: "Gratiszugang",
  },
  {
    value: "0 CHF",
    label: "Wartung",
    sublabel: "in 8 Monaten",
  },
  {
    value: "BASPO",
    label: "lab7x1",
    sublabel: "evaluiert",
  },
] as const;

// Problem Section
export const PROBLEM_CONTENT = {
  statistic: "40%",
  statisticLabel: "der Schweizer Bevölkerung bewegt sich zu wenig.",
  headline: "Nicht weil sie nicht wollen.",
  subheadline: "Sondern weil niemand sie einlädt.",
  source: "Bundesamt für Gesundheit",
} as const;

// Solution Section
export const SOLUTION_CONTENT = {
  headline: "RubikONE gibt Menschen die Erlaubnis, sich zu bewegen.",
  features: [
    "9 Bewegungen",
    "0 neue Geräte",
    "100% Wirkung",
  ],
  description: "Wir machen sichtbar, was schon da ist: Treppen werden zu Trainingsgeräten. Mauern zu Balancierbalken. Geländer zu Kletterstangen.",
} as const;

// Die 9 Posten
export const NINE_MOVEMENTS = [
  {
    id: "greifen",
    name: "Greifen",
    description: "Hände aktivieren, Griffkraft stärken",
    image: "/images/posten/greifen.jpg",
  },
  {
    id: "hangeln",
    name: "Hangeln",
    description: "Am Geländer entlanghangeln",
    image: "/images/posten/hangeln.jpg",
  },
  {
    id: "stuetzen",
    name: "Stützen",
    description: "Körpergewicht auf den Händen tragen",
    image: "/images/posten/stuetzen.jpg",
  },
  {
    id: "springen",
    name: "Springen",
    description: "Von Punkt zu Punkt springen",
    image: "/images/posten/springen.jpg",
  },
  {
    id: "balancieren",
    name: "Balancieren",
    description: "Auf Mauern und Linien balancieren",
    image: "/images/posten/balancieren.jpg",
  },
  {
    id: "landen",
    name: "Landen",
    description: "Sicher und kontrolliert landen",
    image: "/images/posten/landen.jpg",
  },
  {
    id: "klettern",
    name: "Klettern",
    description: "Hindernisse überwinden",
    image: "/images/posten/klettern.jpg",
  },
  {
    id: "rollen",
    name: "Rollen",
    description: "Abrollen und Aufstehen",
    image: "/images/posten/rollen.jpg",
  },
  {
    id: "laufen",
    name: "Laufen",
    description: "Die Route verbindet alle Posten",
    image: "/images/posten/laufen.jpg",
  },
] as const;

// Schwierigkeitsgrade
export const DIFFICULTY_LEVELS = {
  green: { label: "Einfach", color: "#22C55E" },
  blue: { label: "Mittel", color: "#3B82F6" },
  red: { label: "Schwer", color: "#EF4444" },
} as const;

// Vergleichstabelle
export const COMPARISON_TABLE = {
  headline: "Warum RubikONE?",
  subheadline: "60–70% günstiger. Überall integrierbar. Für alle.",
  columns: ["", "Pumptrack", "Outdoor-Gym", "RubikONE"],
  rows: [
    {
      label: "Investition",
      values: ["CHF 200–500k", "CHF 80–150k", "CHF 45–120k"],
      highlight: 2,
    },
    {
      label: "Flächenbedarf",
      values: ["500–2000m²", "100–300m²", "0m² (bestehend)"],
      highlight: 2,
    },
    {
      label: "Baugenehmigung",
      values: ["Tiefbau nötig", "Fundamente nötig", "Minimal"],
      highlight: 2,
    },
    {
      label: "Denkmalschutz",
      values: ["Unmöglich", "Schwierig", "Bewiesen (Köniz)"],
      highlight: 2,
    },
    {
      label: "Wartung/Jahr",
      values: ["CHF 5–10k", "CHF 3–5k", "CHF 0"],
      highlight: 2,
    },
    {
      label: "Zielgruppe",
      values: ["Kinder/Jugend", "Erwachsene", "Alle Generationen"],
      highlight: 2,
    },
    {
      label: "Wissenschaftlich evaluiert",
      values: ["Nein", "Nein", "BASPO lab7x1"],
      highlight: 2,
    },
  ],
} as const;

// Testimonials
export const TESTIMONIALS = [
  {
    quote: "Das Potenzial für Bewegung, für Wohlbefinden und Leistungsfähigkeit ist elementar. Hauptsache Menschen bewegen sich – und im Idealfall draussen. RubikONE macht genau das möglich.",
    author: "Christoph Conz",
    role: "Bundesamt für Sport BASPO, lab7x1",
    logo: "/images/logos/baspo.gif",
  },
  {
    quote: "RubikONE bedeutet für uns ein niederschwelliges Angebot, das die Bevölkerung zu Bewegung einlädt – und zwar mit Sachen, die schon vorhanden sind. Als Roger das Projekt vorstellte, war sofort klar: Das ist innovativ.",
    author: "Stephan Baeriswyl",
    role: "Fachstelle Sport, Gemeinde Köniz",
    logo: "/images/logos/koeniz.jpg",
  },
] as const;

// 4-Phasen Prozess
export const PROCESS_PHASES = [
  {
    number: "1",
    title: "Kennenlernen",
    subtitle: "Impulsworkshop",
    description: "Wir kommen zu Ihnen und zeigen, was in Ihrer Gemeinde möglich ist.",
    details: ["120 Minuten", "CHF 690.–", "Bis 12 Personen"],
    duration: "1 Tag",
  },
  {
    number: "2",
    title: "Planen",
    subtitle: "Konzeption",
    description: "Standortanalyse, Route definieren, Sicherheitsprüfung nach Schweizer Normen.",
    details: ["Route & Posten", "Eigentümer klären", "Sicherheitsprüfung"],
    duration: "4–6 Wochen",
  },
  {
    number: "3",
    title: "Umsetzen",
    subtitle: "Realisierung",
    description: "Baugesuch einreichen, Produktion, Montage.",
    details: ["Baugesuch", "Produktion", "Installation"],
    duration: "3–4 Monate",
  },
  {
    number: "4",
    title: "Eröffnen",
    subtitle: "Aktivierung",
    description: "Eröffnungsevent mit Workshops. Ihre Gemeinde bewegt sich.",
    details: ["Eröffnungsfeier", "Workshops", "Übergabe"],
    duration: "1 Tag",
  },
] as const;

// Pricing Packages
export const PRICING_PACKAGES = [
  {
    name: "Kompakt",
    posts: "6 Posten",
    idealFor: "Schulareale, kleine Gemeinden",
    price: "ab CHF 45'000",
    features: [
      { name: "Standortanalyse", included: true },
      { name: "Konzeption & Design", included: true },
      { name: "Safety Check", included: true },
      { name: "Beschilderung", included: true },
      { name: "Farbmarkierungen", included: true },
      { name: "QR-Code System", included: true },
      { name: "Eröffnungsevent", included: false },
      { name: "Impulsworkshops", included: false },
    ],
    highlighted: false,
  },
  {
    name: "Standard",
    posts: "9 Posten",
    idealFor: "Gemeinden bis 20'000 EW",
    price: "ab CHF 75'000",
    features: [
      { name: "Standortanalyse", included: true },
      { name: "Konzeption & Design", included: true },
      { name: "Safety Check", included: true },
      { name: "Beschilderung", included: true },
      { name: "Farbmarkierungen", included: true },
      { name: "QR-Code System", included: true },
      { name: "Eröffnungsevent", included: true },
      { name: "1× Impulsworkshop", included: true },
    ],
    highlighted: true,
    badge: "Beliebt",
  },
  {
    name: "Premium",
    posts: "16 Posten",
    idealFor: "Städte, grosse Areale",
    price: "ab CHF 120'000",
    features: [
      { name: "Standortanalyse", included: true },
      { name: "Konzeption & Design", included: true },
      { name: "Safety Check", included: true },
      { name: "Beschilderung", included: true },
      { name: "Farbmarkierungen", included: true },
      { name: "QR-Code System", included: true },
      { name: "Eröffnungsevent", included: true },
      { name: "3× Impulsworkshops", included: true },
    ],
    highlighted: false,
  },
] as const;

// Impulsworkshop Details
export const IMPULSWORKSHOP = {
  headline: "Der einfachste Weg zu starten",
  subheadline: "Ein Impulsworkshop vor Ort",
  description: "Wir kommen zu Ihnen und zeigen, was in Ihrer Gemeinde möglich ist. Nach 120 Minuten sehen Sie Ihre Umgebung mit anderen Augen.",
  price: "CHF 690.–",
  priceNote: "zzgl. Spesen",
  duration: "120 Minuten",
  participants: "Bis 12 Personen",
  location: "Bei Ihnen vor Ort",
  weather: "Findet bei jedem Wetter draussen statt",
  targetAudience: "Akteure aus Bewegung, Bildung, Raumplanung, Bau, Mobilität",
  program: [
    { title: "Begrüssung", description: "Ziel und Absicht des Workshops" },
    { title: "Einführung", description: "Was ist Parkour und weshalb braucht es das?" },
    { title: "Hauptteil", description: "Umgebung neu interpretieren, Beispiele testen" },
    { title: "Abschluss", description: "Potenzial erkennen, nächste Schritte" },
  ],
  outcomes: [
    "Sie betrachten Ihre Umgebung aus der Multiperspektive",
    "Sie erkennen das ungenutzte Potenzial für Gesundheitsförderung",
    "Sie verstehen, wie RubikONE funktioniert",
    "Sie wissen, was die nächsten Schritte sind",
  ],
} as const;

// Köniz Case Study
export const KOENIZ_CASE_STUDY = {
  headline: "Fallstudie: Gemeinde Köniz",
  subheadline: "Die erste RubikONE-Installation der Schweiz",
  intro: "9 Posten. 2.5 km Route. Mitten im denkmalgeschützten Schlossareal.",
  challenge: {
    title: "Die Herausforderung",
    points: [
      "Denkmalgeschütztes Schlossareal",
      "Verschiedene Grundeigentümer",
      "Wissenschaftliche Evaluation gefordert",
    ],
  },
  solution: {
    title: "Die Lösung",
    points: [
      "Minimale bauliche Eingriffe (Schilder + Farbe)",
      "Vereinbarungen mit allen Eigentümern",
      "BASPO lab7x1 Laborversuch",
    ],
  },
  stats: [
    { value: "531", label: "Teilnehmende am Pilotprojekt" },
    { value: "94%", label: "verstehen das Konzept sofort" },
    { value: "84%", label: "schätzen den kostenfreien Zugang" },
    { value: "75%", label: "werden durch Freude motiviert" },
    { value: "59%", label: "nutzen es spontan im Vorbeigehen" },
    { value: "0", label: "Vandalismus-Vorfälle" },
    { value: "0 CHF", label: "Wartungskosten in 8 Monaten" },
    { value: "140", label: "Besucher bei der Eröffnung" },
  ],
  timeline: [
    { date: "November 2024", event: "Projektstart" },
    { date: "Februar 2025", event: "Baugesuch eingereicht" },
    { date: "April 2025", event: "Bewilligung erteilt" },
    { date: "10. Mai 2025", event: "Eröffnung" },
  ],
  denkmalpflege: "Das Schlossareal Köniz steht unter Denkmalschutz. Trotzdem erhielt RubikONE die Bewilligung – weil die Installation reversibel ist und das Ortsbild nicht beeinträchtigt.",
} as const;

// Partner Logos
export const PARTNERS = [
  {
    name: "BASPO",
    description: "Unterstützt durch lab 7×1 des Bundesamts für Sport BASPO",
    logo: "/images/partners/baspo.png",
    url: "https://www.baspo.admin.ch",
  },
  {
    name: "Gemeinde Köniz",
    description: "Pilotgemeinde",
    logo: "/images/partners/koeniz.png",
    url: "https://www.koeniz.ch",
  },
] as const;

// Ansprechpartnerin
export const CONTACT_PERSON = {
  name: "Michèle Lütolf",
  role: "Ansprechpartnerin RubikONE",
  email: "michele@parkourone.ch",
  phone: "+41 XX XXX XX XX",
  image: "/images/team/michele.jpg",
} as const;

// Contact Info
export const CONTACT_INFO = {
  company: "ParkourONE GmbH",
  street: "Adresse folgt",
  city: "Bern",
  email: "info@rubikone.ch",
  phone: "+41 XX XXX XX XX",
} as const;

// Footer Links
export const FOOTER_LINKS = {
  hauptseiten: [
    { label: "Konzept", href: "/konzept" },
    { label: "Fallstudie Köniz", href: "/koeniz" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Impulsworkshop", href: "/impulsworkshop" },
  ],
  rechtliches: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
  partner: [
    { label: "ParkourONE", href: "https://parkourone.ch" },
    { label: "BASPO", href: "https://www.baspo.admin.ch" },
  ],
} as const;

// FAQ Items
export const FAQ_ITEMS = [
  {
    question: "Was genau ist RubikONE?",
    answer: "RubikONE ist ein Bewegungsparcours im öffentlichen Raum, der bestehende urbane Elemente (Treppen, Mauern, Geländer) durch Beschilderung und Farbmarkierungen als Bewegungsräume sichtbar macht. Keine neuen Geräte – nur ein neuer Blick auf das, was schon da ist.",
  },
  {
    question: "Braucht es ein Baugesuch?",
    answer: "Ja, für eine Fixinstallation ist ein Baugesuch notwendig. Die gute Nachricht: Da nur Schilder und Farbmarkierungen installiert werden, ist der Prozess deutlich einfacher als bei herkömmlichen Sportanlagen. In Köniz dauerte das Verfahren etwa 3–4 Monate.",
  },
  {
    question: "Funktioniert das auch im Denkmalschutz?",
    answer: "Ja! In Köniz wurde RubikONE im denkmalgeschützten Schlossareal bewilligt. Die Installation ist reversibel und beeinträchtigt das Ortsbild nicht.",
  },
  {
    question: "Wie lange dauert die Umsetzung?",
    answer: "Von der Idee bis zur Eröffnung rechnen wir mit 4–6 Monaten. Der grösste Zeitfaktor ist das Baugesuchsverfahren (3–4 Monate).",
  },
  {
    question: "Wer kümmert sich um die Eigentümer?",
    answer: "Das können Sie selbst übernehmen oder wir machen es für Sie. Als Gemeinde haben Sie oft kürzere Wege. Die Aufgabenverteilung beeinflusst den Preis – Sie können also Kosten sparen.",
  },
  {
    question: "Was ist mit Haftung und Sicherheit?",
    answer: "Jeder RubikONE entspricht den relevanten Schweizer Sicherheitsnormen, insbesondere SN EN 16630:2015 (Fitnessgeräte im Aussenbereich) und weiteren Standards.",
  },
  {
    question: "Gibt es Fördermöglichkeiten?",
    answer: "Viele Kantone fördern Bewegungsinfrastruktur über Sportfonds und Lotteriefonds. Wir unterstützen Sie bei der Antragstellung.",
  },
  {
    question: "Was kostet der Unterhalt?",
    answer: "Praktisch nichts. In Köniz sind in 8 Monaten Testbetrieb keine Wartungskosten angefallen. Es gab auch keine Vandalismus-Vorfälle.",
  },
] as const;

// CTA Content
export const CTA_CONTENT = {
  headline: "Bereit für den neuen Blick?",
  subheadline: "Köniz war die erste Gemeinde. Werden Sie die zweite.",
  ctaPrimary: {
    label: "Impulsworkshop buchen",
    href: "/impulsworkshop",
  },
  ctaSecondary: {
    label: "Beratungsgespräch vereinbaren",
    href: "/kontakt",
  },
  downloads: [
    {
      label: "Verkaufsbroschüre RubikONE (PDF)",
      href: "/downloads/rubikone-verkaufsbroschuere.pdf",
    },
  ],
} as const;

// Mehrwert für Stakeholder
export const STAKEHOLDER_BENEFITS = {
  gemeinden: {
    title: "Für Gemeinden",
    icon: "Building2",
    benefits: [
      "Nachhaltige Stadtentwicklung ohne Platzanspruch",
      "Innovative Gesundheitsförderung vor der Haustür",
      "Stärkung der lokalen Gemeinschaft",
      "Minimaler Ressourceneinsatz",
    ],
  },
  bildung: {
    title: "Für Bildung & Schulen",
    icon: "GraduationCap",
    benefits: [
      "Erweitertes Klassenzimmer & Bildungserlebnis",
      "Förderung von Teamwork & Konzentrationsfähigkeit",
      "Bewegungspausen leicht gemacht",
      "Kreative Lernmöglichkeiten",
    ],
  },
  bevoelkerung: {
    title: "Für die Bevölkerung",
    icon: "Users",
    benefits: [
      "Kostenfrei & flexibel erreichbar",
      "Für alle Altersgruppen & Fitnesslevel",
      "Ausgleich im Alltag",
      "Fördert einen aktiven Lebensstil",
    ],
  },
} as const;

// Normen & Sicherheit
export const SAFETY_INFO = {
  headline: "Sicherheit nach Schweizer Standards",
  description: "Jeder RubikONE entspricht den relevanten Schweizer Sicherheitsnormen für Fitnessgeräte im Aussenbereich.",
  norms: [
    { code: "SN EN 16630:2015", name: "Fitnessgeräte im Aussenbereich" },
    { code: "SN EN 1177:2020", name: "Stossdämpfende Spielplatzböden" },
    { code: "SIA 358", name: "Geländer und Brüstungen" },
    { code: "bfu-Richtlinien", name: "Beratungsstelle für Unfallverhütung" },
  ],
} as const;

// Flexibilität Info
export const FLEXIBILITY_INFO = {
  headline: "Wir übernehmen alles – oder nur das, was Sie brauchen",
  description: "Je mehr Sie intern abwickeln, desto günstiger wird's. Als Gemeinde haben Sie bei vielen Aufgaben kürzere Wege als wir.",
  examples: [
    "Baugesuch selbst einreichen",
    "Eigentümer-Gespräche führen",
    "Eröffnungsevent organisieren",
  ],
} as const;

// ===========================================
// PARKOURONE - DIE PIONIERE
// ===========================================

export const PARKOURONE_STORY = {
  headline: "Entwickelt von den Pionieren.",
  subheadline: "Über 20 Jahre Parkour-Expertise",
  intro: "RubikONE ist kein Marketingprojekt. Es ist die logische Weiterentwicklung von zwei Jahrzehnten Arbeit mit Bewegung im öffentlichen Raum.",

  history: {
    headline: "Die Geschichte",
    milestones: [
      {
        year: "2000",
        title: "Die Anfänge",
        description: "Roger Widmer beginnt als einer der ersten Traceure ausserhalb Frankreichs mit Parkour. Reisen nach Lisses und Evry zu David Belle und den Yamakasi.",
      },
      {
        year: "2006",
        title: "Weltweit erste Parkour-Klasse",
        description: "In Münsingen starten wir das weltweit erste organisierte Parkour-Training. Gleichzeitig bauen wir den ersten mobilen Parkour-Park.",
      },
      {
        year: "2007",
        title: "ParkourONE gegründet",
        description: "Roger Widmer, Felix Stöckli und Steven Käser gründen ParkourONE – im Einvernehmen mit David Belle.",
      },
      {
        year: "2012",
        title: "TraceSpace",
        description: "Launch des Labels für Parkourlandschaften. Wir beginnen, den öffentlichen Raum systematisch für Bewegung zu gestalten.",
      },
      {
        year: "2024",
        title: "RubikONE",
        description: "Die konsequente Weiterentwicklung: Keine neuen Anlagen bauen, sondern bestehende Räume aktivieren.",
      },
    ],
  },

  expertise: {
    headline: "Unsere Expertise",
    points: [
      {
        title: "20+ Jahre Erfahrung",
        description: "Als Traceure der ersten Stunde kennen wir Parkour von der Pike auf.",
      },
      {
        title: "1'500+ Schüler",
        description: "Die grösste deutschsprachige Parkourschule – mit wissenschaftlich fundierter Methodik.",
      },
      {
        title: "TRuST Methode",
        description: "Unsere eigene Lehrmethode: Training, Understanding, Safety, Transfer. Wissenschaftlich evaluiert.",
      },
      {
        title: "Nicht kompetitiv",
        description: "Parkour nach TRuST ist bewusst nicht wettkampforientiert. Verletzungsrisiko wie Snowboarden.",
      },
    ],
  },

  team: [
    {
      name: "Roger Widmer",
      role: "Gründer & Konzeption",
      description: "Traceur seit 2000. Diplomstudium Art Education (ZHdK), Erwachsenenbildner SVEB II. Kreativer Kopf hinter TRuST Education.",
      image: "/images/team/roger.jpg",
    },
    {
      name: "Michèle Lütolf",
      role: "Projektleitung RubikONE",
      description: "Ihre Ansprechpartnerin für alle Fragen rund um RubikONE.",
      image: "/images/team/michele.jpg",
    },
  ],

  quote: {
    text: "Wir wollen nicht, dass Menschen zu uns kommen müssen, um sich zu bewegen. Wir wollen, dass Bewegung zu den Menschen kommt.",
    author: "Roger Widmer",
    role: "Gründer ParkourONE",
  },

  values: [
    {
      title: "Stark",
      description: "Körperliche und mentale Stärke durch Bewegung entwickeln.",
    },
    {
      title: "Sinnvoll",
      description: "Bewegung in den Alltag integrieren, nicht davon trennen.",
    },
    {
      title: "Nachhaltig",
      description: "Keine neuen Ressourcen verbrauchen, sondern Bestehendes nutzen.",
    },
  ],
} as const;

// Emotionale Bildkonzepte (Platzhalter-Beschreibungen)
export const IMAGE_CONCEPTS = {
  hero: {
    description: "Ältere Frau und Kind balancieren gemeinsam auf einer Mauer",
    emotion: "Generationenübergreifend, spielerisch, natürlich",
  },
  problem: {
    description: "Leere Bank im Park, Menschen gehen vorbei ohne sich zu bewegen",
    emotion: "Stillstand, ungenutzes Potenzial",
  },
  solution: {
    description: "Dieselbe Szene, aber Menschen nutzen die Umgebung zum Bewegen",
    emotion: "Aktivierung, Freude, Leben",
  },
  koeniz: {
    description: "Schlossareal Köniz mit sichtbaren RubikONE-Posten",
    emotion: "Historisch + Modern, würdevoll, integriert",
  },
  workshop: {
    description: "Gruppe von Gemeindevertreter:innen probiert Übungen aus",
    emotion: "Neugier, Spass, Aha-Moment",
  },
  team: {
    description: "Roger und Felix beim Training im urbanen Raum",
    emotion: "Authentisch, erfahren, leidenschaftlich",
  },
} as const;

// Zusätzliche Köniz Details
export const KOENIZ_DETAILS = {
  location: {
    name: "Schlossareal Köniz",
    address: "Schloss Köniz, 3098 Köniz",
    coordinates: { lat: 46.9247, lng: 7.4147 },
    mapUrl: "https://maps.app.goo.gl/...",
  },
  route: {
    length: "2.5 km",
    posts: 9,
    duration: "45-60 Minuten",
    terrain: "Asphalt, Kies, Rasen",
  },
  accessibility: {
    publicTransport: "Bus 10 bis Köniz Schloss",
    parking: "Parkplätze beim Schloss",
    hours: "24/7 frei zugänglich",
    cost: "Kostenlos",
  },
  quotes: [
    {
      text: "Nach einem halben Jahr Arbeit mit verschiedenen Abteilungen und dem Kanton hat es geklappt. RubikONE ist bewilligt – mitten im denkmalgeschützten Schlossareal.",
      author: "Stephan Baeriswyl",
      role: "Fachstelle Sport, Gemeinde Köniz",
    },
    {
      text: "Ich habe heute das erste Mal den RubikONE erlebt. Es ist perfekt. Was super wäre: Wenn er noch 100 Jahre bestehen bleibt und viel genutzt wird.",
      author: "Christoph Conz",
      role: "BASPO lab7x1",
    },
  ],
  gallery: [
    { src: "/images/koeniz/eroeffnung.jpg", alt: "Eröffnungsfeier RubikONE Köniz", caption: "140 Besucher bei der Eröffnung" },
    { src: "/images/koeniz/posten-greifen.jpg", alt: "Posten Greifen am Schloss", caption: "Posten 1: Greifen" },
    { src: "/images/koeniz/balancieren.jpg", alt: "Kind balanciert auf Mauer", caption: "Für alle Generationen" },
    { src: "/images/koeniz/schild.jpg", alt: "RubikONE Beschilderung", caption: "Klare Beschilderung" },
    { src: "/images/koeniz/luftbild.jpg", alt: "Luftaufnahme Route", caption: "2.5 km Route durch das Areal" },
  ],
} as const;

// Impulsworkshop erweitert
export const WORKSHOP_DETAILS = {
  ...IMPULSWORKSHOP,
  forWhom: {
    headline: "Für wen ist der Workshop?",
    groups: [
      {
        title: "Gemeindeverantwortliche",
        roles: ["Sportamt", "Raumplanung", "Tiefbau", "Gesundheitsförderung"],
      },
      {
        title: "Bildungsverantwortliche",
        roles: ["Schulleitung", "Sportlehrpersonen", "Jugendarbeit"],
      },
      {
        title: "Weitere Stakeholder",
        roles: ["Quartiervereine", "Seniorenvertretung", "Gesundheitsligen"],
      },
    ],
  },
  whatYouGet: [
    "Hands-on Erfahrung mit Parkour-Bewegungen",
    "Begehung Ihrer Umgebung mit neuen Augen",
    "Konkrete Vorschläge für mögliche Standorte",
    "Verständnis für den weiteren Prozess",
    "Entscheidungsgrundlage für Gemeinderat",
  ],
  faq: [
    {
      question: "Muss ich sportlich sein?",
      answer: "Nein! Der Workshop ist für alle Fitnesslevel geeignet. Wir zeigen Übungen von einfach bis fortgeschritten.",
    },
    {
      question: "Was, wenn es regnet?",
      answer: "Der Workshop findet bei jedem Wetter draussen statt. Das gehört dazu – RubikONE funktioniert auch bei Regen.",
    },
    {
      question: "Wie viele Personen können teilnehmen?",
      answer: "Idealerweise 6-12 Personen. Bei mehr Teilnehmenden empfehlen wir zwei Workshops.",
    },
  ],
} as const;
