/**
 * Section manifests for every top-level key in content.json.
 *
 * Shapes here MIRROR the actual current content — they describe what IS,
 * not what we wish. When adding a new block, add its manifest here and
 * re-run `npm run validate:content`.
 *
 * Admin/tooling-only module — must NOT be imported from public components.
 */
import { z } from "zod";
import type { BlockManifest } from "./types";
import { registerBlock } from "./registry";

/**
 * Idempotent: (re)registers every built-in manifest. Call from the entry
 * point and from test setup that needs a full registry after clearRegistry.
 */
export function registerAllManifests(): void {
  // The module body below runs once on import. Re-calling this function
  // re-pushes the same manifests into the registry (register is idempotent
  // by id).
  for (const manifest of BUILTIN_MANIFESTS) {
    registerBlock(manifest);
  }
}

const BUILTIN_MANIFESTS: BlockManifest<unknown>[] = [];
import {
  blockObject,
  withId,
  ctaSchema,
  anyString,
} from "./schemas";
import {
  text,
  richtext,
  image,
  button,
  list,
} from "./helpers";

function m<T>(manifest: BlockManifest<T>): BlockManifest<T> {
  registerBlock(manifest);
  BUILTIN_MANIFESTS.push(manifest as BlockManifest<unknown>);
  return manifest;
}

/* --------------------------------- SITE ---------------------------------- */

m({
  id: "SITE_CONFIG",
  label: "Site-Konfiguration",
  schema: blockObject({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    company: z.string(),
  }),
  fields: [text("name"), text("tagline"), text("description"), text("company")],
});

m({
  id: "NAVIGATION_ITEMS",
  label: "Navigation",
  schema: z.array(withId({ label: z.string(), href: z.string() })),
  fields: [list("", [text("label"), text("href")])],
});

/* --------------------------------- HOME ---------------------------------- */

m({
  id: "HERO_CONTENT",
  label: "Hero",
  schema: blockObject({
    headline: z.string(),
    headlineAccent: z.string(),
    brandTag: z.string().optional(),
    subheadline: z.string(),
    videoUrl: z.string(),
    heroVideoSrc: z.string().optional(),
    ctaPrimary: ctaSchema.optional(),
    ctaSecondary: ctaSchema.optional(),
  }),
  fields: [
    text("brandTag", { label: "Marken-Tag", required: false }),
    text("headline"),
    text("headlineAccent", { required: false }),
    text("subheadline"),
    text("heroVideoSrc", { label: "Hero Video Datei", required: false }),
    text("videoUrl", { label: "Video URL" }),
    button("ctaPrimary"),
    button("ctaSecondary"),
  ],
});

m({
  id: "TRUST_STATS",
  label: "Trust Stats",
  schema: z.array(
    withId({ value: z.string(), label: z.string(), sublabel: z.string() })
  ),
  fields: [list("", [text("value"), text("label"), text("sublabel")])],
});

m({
  id: "PROBLEM_CONTENT",
  label: "Problem",
  schema: blockObject({
    statistic: z.string(),
    statisticLabel: z.string(),
    headline: z.string(),
    subheadline: z.string(),
    source: z.string(),
  }),
  fields: [
    text("statistic"),
    text("statisticLabel"),
    text("headline"),
    text("subheadline"),
    text("source"),
  ],
});

m({
  id: "SOLUTION_CONTENT",
  label: "Lösung",
  schema: blockObject({
    headline: z.string(),
    features: z.array(z.string()),
    description: z.string(),
  }),
  fields: [
    text("headline"),
    text("description"),
    list("features", [text("")]),
  ],
});

m({
  id: "NINE_MOVEMENTS",
  label: "9 Bewegungen",
  schema: z.array(
    withId({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      // MAN-05: image migrated from positional zip into the item itself.
      image: z.string(),
    })
  ),
  fields: [
    list("", [text("name"), text("description"), image("image")]),
  ],
});

m({
  id: "COMPARISON_TABLE",
  label: "Vergleichstabelle",
  schema: blockObject({
    headline: z.string(),
    subheadline: z.string(),
    features: z.array(
      withId({ label: z.string(), description: z.string() })
    ),
  }),
  fields: [
    text("headline"),
    text("subheadline"),
    list("features", [text("label"), text("description")]),
  ],
});

m({
  id: "TESTIMONIALS",
  label: "Testimonials",
  schema: z.array(
    withId({ quote: z.string(), author: z.string(), role: z.string() })
  ),
  fields: [
    list("", [text("quote"), text("author"), text("role")]),
  ],
});

m({
  id: "PROCESS_PHASES",
  label: "4-Phasen Prozess",
  schema: z.array(
    withId({
      number: z.string(),
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      details: z.array(z.string()),
      duration: z.string(),
    })
  ),
  fields: [
    list("", [
      text("number"),
      text("title"),
      text("subtitle"),
      text("description"),
      text("duration"),
    ]),
  ],
});

m({
  id: "PRICING_PACKAGES",
  label: "Pakete",
  schema: z.array(
    withId({
      name: z.string(),
      posts: z.string(),
      idealFor: z.string(),
      price: z.string(),
      features: z.array(z.unknown()),
      highlighted: z.boolean(),
    })
  ),
  fields: [
    list("", [
      text("name"),
      text("posts"),
      text("idealFor"),
      text("price"),
    ]),
  ],
});

m({
  id: "IMPULSWORKSHOP",
  label: "Impulsworkshop",
  schema: blockObject({
    headline: z.string(),
    subheadline: z.string(),
    description: z.string(),
    price: z.string(),
    priceNote: z.string(),
    duration: z.string(),
    participants: z.string(),
    location: z.string(),
    weather: z.string(),
    targetAudience: z.string(),
    program: z.array(withId({ title: z.string(), description: z.string() })),
    outcomes: z.array(z.string()),
  }),
  fields: [
    text("headline"),
    text("subheadline"),
    text("description"),
    text("price"),
    text("priceNote"),
    text("duration"),
    text("participants"),
    text("location"),
    text("weather"),
    text("targetAudience"),
    list("program", [text("title"), text("description")]),
  ],
});

m({
  id: "KOENIZ_CASE_STUDY",
  label: "Köniz Case Study",
  schema: blockObject({
    headline: z.string(),
    subheadline: z.string(),
    intro: z.string(),
    challenge: blockObject({
      title: z.string(),
      points: z.array(z.string()),
    }),
    solution: blockObject({
      title: z.string(),
      points: z.array(z.string()),
    }),
    insights: z.array(
      withId({
        title: z.string(),
        shortDesc: z.string(),
        fullDesc: z.string(),
      })
    ),
    timeline: z.array(withId({ date: z.string(), event: z.string() })),
    denkmalpflege: z.string(),
    workshopFeedback: z.array(z.string()),
  }),
  fields: [
    text("headline"),
    text("subheadline"),
    text("intro"),
    text("challenge.title"),
    text("solution.title"),
    text("denkmalpflege"),
    list("insights", [text("title"), text("shortDesc"), text("fullDesc")]),
    list("timeline", [text("date"), text("event")]),
    list("workshopFeedback", [text("")]),
  ],
});

m({
  id: "PARTNERS",
  label: "Partner",
  schema: z.array(
    withId({
      name: z.string(),
      description: z.string(),
      url: z.string(),
    })
  ),
  fields: [list("", [text("name"), text("description"), text("url")])],
});

m({
  id: "CONTACT_PERSON",
  label: "Ansprechperson",
  schema: blockObject({
    name: z.string(),
    role: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  fields: [text("name"), text("role"), text("email"), text("phone")],
});

m({
  id: "CONTACT_INFO",
  label: "Kontaktinfo",
  schema: blockObject({
    company: z.string(),
    street: z.string(),
    city: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  fields: [
    text("company"),
    text("street"),
    text("city"),
    text("email"),
    text("phone"),
  ],
});

m({
  id: "FOOTER_LINKS",
  label: "Footer-Links",
  schema: blockObject({
    hauptseiten: z.array(withId({ label: z.string(), href: z.string() })),
    rechtliches: z.array(withId({ label: z.string(), href: z.string() })),
    partner: z.array(
      withId({ label: z.string(), href: z.string(), logo: z.string() })
    ),
  }),
  fields: [
    list("hauptseiten", [text("label"), text("href")]),
    list("rechtliches", [text("label"), text("href")]),
    list("partner", [text("label"), text("href"), image("logo")]),
  ],
});

m({
  id: "FAQ_ITEMS",
  label: "FAQ",
  schema: z.array(
    withId({ question: z.string(), answer: z.string() })
  ),
  fields: [list("", [text("question"), text("answer")])],
});

m({
  id: "CTA_CONTENT",
  label: "CTA",
  schema: blockObject({
    headline: z.string(),
    subheadline: z.string(),
    ctaPrimary: ctaSchema,
    ctaSecondary: ctaSchema,
    downloads: z.array(withId({ label: z.string(), href: z.string() })),
  }),
  fields: [
    text("headline"),
    text("subheadline"),
    button("ctaPrimary"),
    button("ctaSecondary"),
    list("downloads", [text("label"), text("href")]),
  ],
});

const stakeholderGroup = blockObject({
  title: z.string(),
  benefits: z.array(z.string()),
});

m({
  id: "STAKEHOLDER_BENEFITS",
  label: "Stakeholder-Mehrwert",
  schema: blockObject({
    gemeinden: stakeholderGroup,
    bildung: stakeholderGroup,
    bevoelkerung: stakeholderGroup,
  }),
  fields: [
    text("gemeinden.title"),
    text("bildung.title"),
    text("bevoelkerung.title"),
  ],
});

m({
  id: "SAFETY_INFO",
  label: "Sicherheit",
  schema: blockObject({
    headline: z.string(),
    description: z.string(),
    norms: z.array(withId({ code: z.string(), name: z.string() })),
  }),
  fields: [
    text("headline"),
    text("description"),
    list("norms", [text("code"), text("name")]),
  ],
});

m({
  id: "FLEXIBILITY_INFO",
  label: "Flexibilität",
  schema: blockObject({
    headline: z.string(),
    description: z.string(),
    examples: z.array(z.string()),
  }),
  fields: [text("headline"), text("description")],
});

m({
  id: "PARKOURONE_STORY",
  label: "ParkourONE Story",
  schema: blockObject({
    headline: z.string(),
    subheadline: z.string(),
    intro: z.string(),
    history: blockObject({
      headline: z.string(),
      milestones: z.array(z.unknown()),
    }),
    expertise: blockObject({
      headline: z.string(),
      points: z.array(z.unknown()),
    }),
    team: z.array(
      withId({
        name: z.string(),
        role: z.string(),
        description: z.string(),
      })
    ),
    quote: blockObject({
      text: z.string(),
      author: z.string(),
      role: z.string(),
    }),
    values: z.array(
      withId({ title: z.string(), description: z.string() })
    ),
  }),
  fields: [
    text("headline"),
    text("subheadline"),
    text("intro"),
    text("quote.text"),
    text("quote.author"),
    text("quote.role"),
    list("team", [text("name"), text("role"), text("description")]),
    list("values", [text("title"), text("description")]),
  ],
});

m({
  id: "KOENIZ_DETAILS",
  label: "Köniz Details",
  schema: blockObject({
    location: blockObject({ name: z.string(), address: z.string() }),
    route: blockObject({
      length: z.string(),
      posts: z.number(),
      duration: z.string(),
      terrain: z.string(),
    }),
    accessibility: blockObject({
      publicTransport: z.string(),
      parking: z.string(),
      hours: z.string(),
      cost: z.string(),
    }),
    quotes: z.array(
      withId({
        text: z.string(),
        author: z.string(),
        role: z.string(),
      })
    ),
  }),
  fields: [
    text("location.name"),
    text("location.address"),
    list("quotes", [text("text"), text("author"), text("role")]),
  ],
});

m({
  id: "WORKSHOP_DETAILS",
  label: "Workshop Details",
  schema: blockObject({
    forWhom: blockObject({
      headline: z.string(),
      groups: z.array(z.unknown()),
    }),
    whatYouGet: z.array(z.string()),
    faq: z.array(withId({ question: z.string(), answer: z.string() })),
  }),
  fields: [
    text("forWhom.headline"),
    list("faq", [text("question"), text("answer")]),
  ],
});

m({
  id: "CONFIGURATOR",
  label: "Konfigurator",
  schema: blockObject({
    headline: z.string(),
    subheadline: z.string(),
    packages: z.array(
      withId({
        id: z.string(),
        name: z.string(),
        posts: z.number(),
        basePrice: z.number(),
        description: z.string(),
      })
    ),
    coreServices: z.array(
      withId({ name: z.string(), info: z.string() })
    ),
    additionalServices: z.array(z.unknown()),
    optionalServices: z.array(z.unknown()),
  }),
  fields: [
    text("headline"),
    text("subheadline"),
    list("packages", [text("name"), text("description")]),
    list("coreServices", [text("name"), text("info")]),
  ],
});

m({
  id: "CONFIGURATOR_UI",
  label: "Konfigurator UI-Labels",
  schema: blockObject({
    step1Title: z.string().optional(),
    step1Hint: z.string().optional(),
    packagePostsLabel: z.string().optional(),
    packageRecommendedBadge: z.string().optional(),
    coreServicesLabel: z.string().optional(),
    step2Title: z.string().optional(),
    step2Hint: z.string().optional(),
    step3Title: z.string().optional(),
    summaryPostsLabel: z.string().optional(),
    summaryIncludesLabel: z.string().optional(),
    step4Title: z.string().optional(),
    step4Hint: z.string().optional(),
    formNameLabel: z.string().optional(),
    formNamePlaceholder: z.string().optional(),
    formEmailLabel: z.string().optional(),
    formEmailPlaceholder: z.string().optional(),
    formOrgTypeLabel: z.string().optional(),
    formOrgNameLabel: z.string().optional(),
    formOrgNamePlaceholder: z.string().optional(),
    formOrgSizeLabel: z.string().optional(),
    formConsultationLabel: z.string().optional(),
    formMessageLabel: z.string().optional(),
    successTitle: z.string().optional(),
    successMessage: z.string().optional(),
    successNextStepLabel: z.string().optional(),
    successNextStepHint: z.string().optional(),
    successContactLabel: z.string().optional(),
    buttonClose: z.string().optional(),
    buttonBack: z.string().optional(),
    buttonNext: z.string().optional(),
    buttonGoToSummary: z.string().optional(),
    buttonSubmit: z.string().optional(),
    buttonSubmitting: z.string().optional(),
    errorDefault: z.string().optional(),
    errorSendFailed: z.string().optional(),
    triggerCardTitle: z.string().optional(),
    triggerCardHint: z.string().optional(),
    triggerCardCta: z.string().optional(),
    triggerButtonLabel: z.string().optional(),
  }),
  fields: [
    text("step1Title"),
    text("step1Hint"),
    text("packagePostsLabel"),
    text("packageRecommendedBadge"),
    text("coreServicesLabel"),
    text("step2Title"),
    text("step2Hint"),
    text("step3Title"),
    text("summaryPostsLabel"),
    text("summaryIncludesLabel"),
    text("step4Title"),
    text("step4Hint"),
    text("formNameLabel"),
    text("formNamePlaceholder"),
    text("formEmailLabel"),
    text("formEmailPlaceholder"),
    text("formOrgTypeLabel"),
    text("formOrgNameLabel"),
    text("formOrgNamePlaceholder"),
    text("formOrgSizeLabel"),
    text("formConsultationLabel"),
    text("formMessageLabel"),
    text("successTitle"),
    text("successMessage"),
    text("successNextStepLabel"),
    text("successNextStepHint"),
    text("successContactLabel"),
    text("buttonClose"),
    text("buttonBack"),
    text("buttonNext"),
    text("buttonGoToSummary"),
    text("buttonSubmit"),
    text("buttonSubmitting"),
    text("errorDefault"),
    text("errorSendFailed"),
    text("triggerCardTitle"),
    text("triggerCardHint"),
    text("triggerCardCta"),
    text("triggerButtonLabel"),
  ],
});

m({
  id: "TEXTHOOK_CONTENT",
  label: "Text-Hook",
  schema: blockObject({ headline: z.string(), description: z.string() }),
  fields: [text("headline"), text("description")],
});

m({
  id: "VIDEO_CONTENT",
  label: "Video",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description: z.string(),
    videoUrl: z.string(),
    fallbackImage: z.string(),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("description"),
    text("videoUrl"),
    image("fallbackImage"),
  ],
});

m({
  id: "VORHER_NACHHER_CONTENT",
  label: "Vorher/Nachher",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description: z.string(),
    vorherImage: z.string(),
    nachherImage: z.string(),
    ctaText: z.string(),
    ctaHref: z.string(),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("description"),
    image("vorherImage"),
    image("nachherImage"),
    text("ctaText"),
    text("ctaHref"),
  ],
});

m({
  id: "GALLERY_CONTENT",
  label: "Galerie",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    images: z.array(
      withId({
        src: z.string(),
        title: z.string(),
        comment: z.string(),
      })
    ),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    list("images", [image("src"), text("title"), text("comment")]),
  ],
});

m({
  id: "PROZESS_TEASER_CONTENT",
  label: "Prozess-Teaser",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description1: z.string(),
    description2: z.string(),
    ctaText: z.string(),
    ctaHref: z.string(),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("description1"),
    text("description2"),
    text("ctaText"),
    text("ctaHref"),
  ],
});

m({
  id: "CONFIGURATOR_CTA_CONTENT",
  label: "Konfigurator-CTA",
  schema: blockObject({
    headline: z.string(),
    subheadline: z.string(),
    note: z.string(),
  }),
  fields: [text("headline"), text("subheadline"), text("note")],
});

m({
  id: "STATS_CONTENT",
  label: "Stats Slider",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    slides: z.array(
      withId({
        value: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string(),
      })
    ),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    list("slides", [
      text("value"),
      text("title"),
      text("description"),
      image("image"),
    ]),
  ],
});

const imageConceptEntry = blockObject({
  description: z.string(),
  emotion: z.string(),
});
m({
  id: "IMAGE_CONCEPTS",
  label: "Bildkonzepte",
  schema: blockObject({
    hero: imageConceptEntry,
    problem: imageConceptEntry,
    solution: imageConceptEntry,
    koeniz: imageConceptEntry,
    workshop: imageConceptEntry,
    team: imageConceptEntry,
  }),
  fields: [],
});

m({
  id: "PAGE_BLOCKS",
  label: "Page-Block-Register",
  schema: z
    .record(
      z.string(),
      z.array(
        withId({
          type: z.string(),
          contentKey: z.string(),
          label: z.string(),
        })
      )
    ),
  fields: [],
});

/* --------------------------- KONZEPT-Seite -------------------------------- */

m({
  id: "KONZEPT_HERO",
  label: "Konzept Hero",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    questions: z.string(),
    description: z.string(),
    heroImage: z.string(),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("questions"),
    text("description"),
    image("heroImage"),
  ],
});

m({
  id: "KONZEPT_PRINZIP",
  label: "Konzept Prinzip",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description: z.string(),
    elements: z.array(withId({ title: z.string(), desc: z.string() })),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("description"),
    list("elements", [text("title"), text("desc")]),
  ],
});

m({
  id: "KONZEPT_POSTEN_SLIDER",
  label: "Konzept Posten-Slider",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description: z.string(),
  }),
  fields: [text("tagline"), text("headline"), text("description")],
});

m({
  id: "KONZEPT_LERNDIMENSIONEN",
  label: "Lerndimensionen",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description: z.string(),
    dimensions: z.array(
      withId({
        id: z.string(),
        title: z.string(),
        shortDesc: z.string(),
        modalTitle: z.string(),
        modalContent: z.string(),
      })
    ),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("description"),
    list("dimensions", [
      text("title"),
      text("shortDesc"),
      text("modalTitle"),
      text("modalContent"),
    ]),
  ],
});

m({
  id: "KONZEPT_SICHERHEIT",
  label: "Konzept Sicherheit",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description: z.string(),
    normen: z.array(withId({ code: z.string(), name: z.string() })),
    image: z.string(),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("description"),
    image("image"),
    list("normen", [text("code"), text("name")]),
  ],
});

const simpleCtaBlock = blockObject({
  headline: z.string(),
  description: z.string(),
  ctaPrimary: ctaSchema,
  ctaSecondary: ctaSchema,
});

const simpleCtaFields = [
  text("headline"),
  text("description"),
  button("ctaPrimary"),
  button("ctaSecondary"),
];

m({
  id: "KONZEPT_CTA",
  label: "Konzept CTA",
  schema: simpleCtaBlock,
  fields: simpleCtaFields,
});

/* -------------------------- RAUMGESTALTUNG -------------------------------- */

const pageHeroBlock = blockObject({
  title: z.string(),
  description: z.string(),
  breadcrumb: z.string(),
  image: z.string(),
  imageAlt: z.string(),
});

const pageHeroFields = [
  text("title"),
  text("description"),
  text("breadcrumb"),
  image("image"),
  text("imageAlt"),
];

m({
  id: "RAUMGESTALTUNG_HERO",
  label: "Raumgestaltung Hero",
  schema: pageHeroBlock,
  fields: pageHeroFields,
});

m({
  id: "RAUMGESTALTUNG_MEHRWERT",
  label: "Raumgestaltung Mehrwert",
  schema: blockObject({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    stakeholders: z.array(
      withId({
        title: z.string(),
        benefits: z.array(z.string()),
      })
    ),
  }),
  fields: [
    text("title"),
    text("subtitle"),
    text("description"),
    list("stakeholders", [text("title")]),
  ],
});

m({
  id: "RAUMGESTALTUNG_USP",
  label: "Raumgestaltung USP",
  schema: z.array(
    withId({ title: z.string(), description: z.string() })
  ),
  fields: [list("", [text("title"), text("description")])],
});

m({
  id: "RAUMGESTALTUNG_TESTIMONIAL",
  label: "Raumgestaltung Testimonial",
  schema: blockObject({
    quote: z.string(),
    name: z.string(),
    detail: z.string(),
    image: z.string(),
  }),
  fields: [
    text("quote"),
    text("name"),
    text("detail"),
    image("image"),
  ],
});

m({
  id: "RAUMGESTALTUNG_PROZESS",
  label: "Raumgestaltung Prozess",
  schema: blockObject({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    schritte: z.array(
      withId({
        nummer: z.string(),
        titel: z.string(),
        beschreibung: z.string(),
        image: z.string(),
      })
    ),
  }),
  fields: [
    text("title"),
    text("subtitle"),
    text("description"),
    list("schritte", [
      text("nummer"),
      text("titel"),
      text("beschreibung"),
      image("image"),
    ]),
  ],
});

m({
  id: "RAUMGESTALTUNG_REFERENZ",
  label: "Raumgestaltung Referenz",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description: z.string(),
    image: z.string(),
    ctaText: z.string(),
    ctaHref: z.string(),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("description"),
    image("image"),
    text("ctaText"),
    text("ctaHref"),
  ],
});

m({
  id: "RAUMGESTALTUNG_FAQ",
  label: "Raumgestaltung FAQ",
  schema: z.array(
    withId({ question: z.string(), answer: z.string() })
  ),
  fields: [list("", [text("question"), text("answer")])],
});

m({
  id: "RAUMGESTALTUNG_CTA",
  label: "Raumgestaltung CTA",
  schema: simpleCtaBlock,
  fields: simpleCtaFields,
});

/* -------------------------------- KÖNIZ ----------------------------------- */

m({
  id: "KOENIZ_HERO",
  label: "Köniz Hero",
  schema: pageHeroBlock,
  fields: pageHeroFields,
});

m({
  id: "KOENIZ_LAB7X1",
  label: "Köniz Lab 7x1",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description1: z.string(),
    description2: z.string(),
    downloadLabel: z.string(),
    downloadDesc: z.string(),
    downloadHref: z.string(),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("description1"),
    text("description2"),
    text("downloadLabel"),
    text("downloadDesc"),
    text("downloadHref"),
  ],
});

m({
  id: "KOENIZ_DENKMALSCHUTZ",
  label: "Köniz Denkmalschutz",
  schema: blockObject({ label: z.string() }),
  fields: [text("label")],
});

m({
  id: "KOENIZ_ERKENNTNISSE",
  label: "Köniz Erkenntnisse",
  schema: blockObject({ tagline: z.string(), headline: z.string() }),
  fields: [text("tagline"), text("headline")],
});

m({
  id: "KOENIZ_FEEDBACK",
  label: "Köniz Feedback",
  schema: blockObject({ tagline: z.string(), headline: z.string() }),
  fields: [text("tagline"), text("headline")],
});

m({
  id: "KOENIZ_ANNINA",
  label: "Köniz Annina",
  schema: blockObject({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
  }),
  fields: [text("quote"), text("name"), text("role")],
});

m({
  id: "KOENIZ_GALLERY",
  label: "Köniz Galerie",
  schema: blockObject({
    images: z.array(withId({ src: z.string(), alt: z.string() })),
  }),
  fields: [list("images", [image("src"), text("alt")])],
});

m({
  id: "KOENIZ_CTA",
  label: "Köniz CTA",
  schema: simpleCtaBlock,
  fields: simpleCtaFields,
});

/* ------------------------------ WORKSHOP ---------------------------------- */

m({
  id: "WORKSHOP_HERO",
  label: "Workshop Hero",
  schema: pageHeroBlock,
  fields: pageHeroFields,
});

m({
  id: "WORKSHOP_KEY_FACTS",
  label: "Workshop Key Facts",
  schema: blockObject({
    keyFacts: z.array(
      withId({ label: z.string(), value: z.string() })
    ),
  }),
  fields: [list("keyFacts", [text("label"), text("value")])],
});

m({
  id: "WORKSHOP_IMAGES",
  label: "Workshop Bilder",
  schema: blockObject({
    images: z.array(withId({ src: z.string(), alt: z.string() })),
  }),
  fields: [list("images", [image("src"), text("alt")])],
});

m({
  id: "WORKSHOP_MITNEHMEN",
  label: "Workshop Mitnehmen",
  schema: blockObject({ title: z.string(), subtitle: z.string() }),
  fields: [text("title"), text("subtitle")],
});

m({
  id: "WORKSHOP_PREIS",
  label: "Workshop Preis",
  schema: blockObject({ preisWetter: z.string() }),
  fields: [text("preisWetter")],
});

m({
  id: "WORKSHOP_FUER_WEN",
  label: "Workshop Für Wen",
  schema: blockObject({ idealNote: z.string() }),
  fields: [text("idealNote")],
});

m({
  id: "WORKSHOP_CTA",
  label: "Workshop CTA",
  schema: simpleCtaBlock,
  fields: simpleCtaFields,
});

/* ------------------------------ KONTAKT ----------------------------------- */

m({
  id: "KONTAKT_HERO",
  label: "Kontakt Hero",
  schema: pageHeroBlock,
  fields: pageHeroFields,
});

m({
  id: "KONTAKT_FORM",
  label: "Kontakt Formular",
  schema: blockObject({
    phoneHours: z.string(),
    contactFormTitle: z.string(),
    contactFormSubtitle: z.string(),
    footerImage: z.string(),
  }),
  fields: [
    text("phoneHours"),
    text("contactFormTitle"),
    text("contactFormSubtitle"),
    image("footerImage"),
  ],
});

/* ------------------------------ ÜBER UNS ---------------------------------- */

m({
  id: "UEBER_UNS_HERO",
  label: "Über Uns Hero",
  schema: pageHeroBlock,
  fields: pageHeroFields,
});

m({
  id: "UEBER_UNS_SRF",
  label: "Über Uns SRF",
  schema: blockObject({
    tagline: z.string(),
    headline: z.string(),
    description1: z.string(),
    description2: z.string(),
    ctaText: z.string(),
    videoUrl: z.string(),
    image: z.string(),
  }),
  fields: [
    text("tagline"),
    text("headline"),
    text("description1"),
    text("description2"),
    text("ctaText"),
    text("videoUrl"),
    image("image"),
  ],
});

m({
  id: "UEBER_UNS_CTA",
  label: "Über Uns CTA",
  schema: simpleCtaBlock,
  fields: simpleCtaFields,
});

m({
  id: "UEBER_UNS_STORY",
  label: "Über Uns Story",
  schema: blockObject({
    storyIntro: blockObject({
      tagline: z.string(),
      headline: z.string(),
      description1: z.string(),
      description2: z.string(),
      image: z.string(),
    }),
    timelineTagline: z.string(),
    threeThemes: blockObject({
      title: z.string(),
      subtitle: z.string(),
      themes: z.array(z.unknown()),
    }),
    expertiseTagline: z.string(),
    fullWidthQuote: z.string(),
    compactIntro: blockObject({
      tagline: z.string(),
      headline: z.string(),
      description: z.string(),
      stat1: blockObject({ value: z.string(), label: z.string() }),
      stat2: blockObject({ value: z.string(), label: z.string() }),
      ctaText: z.string(),
      ctaHref: z.string(),
    }),
  }),
  fields: [
    text("storyIntro.tagline"),
    text("storyIntro.headline"),
    text("storyIntro.description1"),
    text("storyIntro.description2"),
    image("storyIntro.image"),
    text("timelineTagline"),
    text("threeThemes.title"),
    text("threeThemes.subtitle"),
    text("expertiseTagline"),
    text("fullWidthQuote"),
    text("compactIntro.tagline"),
    text("compactIntro.headline"),
    text("compactIntro.description"),
    text("compactIntro.ctaText"),
    text("compactIntro.ctaHref"),
  ],
});

/* --------------------- HOMEPAGE EXTRA BLOCKS (v3) ------------------------- */

m({
  id: "USP_ITEMS",
  label: "USP Slider",
  schema: z.array(
    withId({
      title: z.string(),
      description: z.string(),
      image: z.string(),
    })
  ),
  fields: [list("", [text("title"), text("description"), image("image")])],
});

m({
  id: "SOLUTION_CARDS_CONTENT",
  label: "Lösung Karten",
  schema: z.array(
    withId({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      image: z.string(),
      modalTitle: z.string(),
      modalContent: z.string(),
    })
  ),
  fields: [
    list("", [
      text("title"),
      text("subtitle"),
      image("image"),
      text("modalTitle"),
      text("modalContent"),
    ]),
  ],
});

m({
  id: "MOVEMENTS_GRID",
  label: "9 Bewegungen Grid",
  schema: z.array(withId({ title: z.string() })),
  fields: [list("", [text("title")])],
});

m({
  id: "LERNDIMENSIONEN_CONTENT",
  label: "Lerndimensionen Grid",
  schema: z.array(
    withId({
      id: z.string(),
      title: z.string(),
      icon: z.string(),
      description: z.string(),
      example: z.string(),
      color: z.string(),
    })
  ),
  fields: [
    list("", [
      text("title"),
      image("icon"),
      text("description"),
      text("example"),
    ]),
  ],
});

m({
  id: "PROCESS_STEPS_CONTENT",
  label: "Prozess-Schritte (Homepage)",
  schema: z.array(
    withId({
      number: z.string(),
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      modalContent: z.string(),
      duration: z.string(),
      image: z.string(),
    })
  ),
  fields: [
    list("", [
      text("number"),
      text("title"),
      text("subtitle"),
      text("description"),
      text("modalContent"),
      text("duration"),
      image("image"),
    ]),
  ],
});

/* ------------------------- BEWEGUNGSSTATIONEN ----------------------------- */

const postenSchema = blockObject({
  number: z.string(),
  title: z.string(),
  intro: z.string(),
  heroImage: z.string().optional(),
  exercises: z.array(
    withId({
      title: z.string(),
      reps: z.string(),
      description: z.string(),
      image: z.string().optional(),
    })
  ),
  furtherExercises: z
    .array(withId({ title: z.string(), description: z.string() }))
    .optional(),
  tagescheck: z.string(),
  potenzial: z.object({ title: z.string(), content: z.string() }),
});

const postenFields = [
  text("number", { label: "Nummer" }),
  text("title"),
  text("intro"),
  image("heroImage", { required: false }),
  list("exercises", [text("title"), text("reps"), text("description"), image("image", { required: false })]),
  list("furtherExercises", [text("title"), text("description")]),
  text("tagescheck"),
  text("potenzial.title"),
  text("potenzial.content"),
];

for (const [id, label] of [
  ["POSTEN_CHECK_IN", "Posten Check-In"],
  ["POSTEN_ABC", "Posten ABC"],
  ["POSTEN_BALANCE", "Posten Balance"],
  ["POSTEN_SPRUNGKRAFT", "Posten Sprungkraft"],
  ["POSTEN_STABILITAET", "Posten Stabilität"],
  ["POSTEN_PASSEMENT", "Posten Passement"],
  ["POSTEN_QUADRUPEDIE", "Posten Quadrupedie"],
  ["POSTEN_CHECK_OUT", "Posten Check-Out"],
  ["FOKUS_CONTENT", "Posten Fokus"],
] as const) {
  m({ id, label, schema: postenSchema, fields: postenFields });
}

/* ------------------------------- LEGAL ----------------------------------- */

const legalSchema = blockObject({
  title: z.string(),
  breadcrumb: z.string().optional(),
  sections: z.array(withId({ heading: z.string(), body: z.string() })),
  stand: z.string().optional(),
});

const legalFields = [
  text("title"),
  text("breadcrumb", { required: false }),
  list("sections", [text("heading"), richtext("body")]),
  text("stand", { required: false }),
];

m({ id: "IMPRESSUM_CONTENT", label: "Impressum", schema: legalSchema, fields: legalFields });
m({ id: "DATENSCHUTZ_CONTENT", label: "Datenschutzerklärung", schema: legalSchema, fields: legalFields });

/* ------------------------------- BENTO ----------------------------------- */

m({
  id: "BENTO_GRID_DEFAULTS",
  label: "Bento Grid Vorteile",
  schema: z.array(
    withId({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
      size: z.string().optional(),
    })
  ),
  fields: [
    list("", [
      text("title"),
      text("description"),
      text("icon", { label: "Lucide Icon-Name" }),
      text("size", { required: false, label: "Grösse (sm|md|lg)" }),
    ]),
  ],
});

/** Sentinel to keep the helper import active under strict unused checks. */
export const __manifestsLoaded = true;
// Silence unused imports that show up only in some branches.
void anyString;
void image;
void button;
