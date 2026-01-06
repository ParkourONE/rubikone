import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/og-image.jpg`,
    parentOrganization: {
      "@type": "Organization",
      name: CONTACT_INFO.company,
      url: SITE_CONFIG.companyUrl,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_INFO.street,
      addressLocality: "Münsingen",
      postalCode: "3110",
      addressCountry: "CH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT_INFO.phone,
      email: CONTACT_INFO.email,
      contactType: "customer service",
      availableLanguage: ["German"],
    },
    sameAs: [
      SITE_CONFIG.companyUrl,
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "RubikONE Fitnessparkour",
    description: "RubikONE verwandelt bestehende öffentliche Orte in Bewegungsräume – ohne neue Geräte, ohne Tiefbau.",
    provider: {
      "@type": "Organization",
      name: CONTACT_INFO.company,
    },
    areaServed: {
      "@type": "Country",
      name: "Switzerland",
    },
    serviceType: "Bewegungsförderung für Gemeinden",
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: CONTACT_INFO.company,
    description: "Pioniere der Parkour-Bewegung in der Schweiz seit 2000. Entwickler von RubikONE.",
    url: SITE_CONFIG.companyUrl,
    telephone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_INFO.street,
      addressLocality: "Münsingen",
      postalCode: "3110",
      addressCountry: "CH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.8746,
      longitude: 7.5602,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
    </>
  );
}
