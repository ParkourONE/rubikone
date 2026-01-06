import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { FloatingConfigurator } from "@/components/layout/floating-configurator";
import { LenisProvider } from "@/providers/lenis-provider";
import { ConsentProvider } from "@/providers/consent-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { ConditionalAnalytics } from "@/components/analytics";
import { SITE_CONFIG } from "@/lib/constants";
import { StructuredData } from "@/components/structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} – Der Fitnessparkour für Ihre Gemeinde`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: "RubikONE verwandelt bestehende Orte in Bewegungsräume – wissenschaftlich fundiert, von Köniz bewiesen. Ohne neue Geräte. Ohne Tiefbau.",
  keywords: [
    "RubikONE",
    "Bewegungsraum",
    "Gemeinde",
    "Schweiz",
    "Sportinfrastruktur",
    "Öffentlicher Raum",
    "Parkour",
    "BASPO",
    "Fitnessparkour",
    "ParkourONE",
    "Köniz",
    "Bewegungsförderung",
  ],
  authors: [{ name: SITE_CONFIG.company, url: SITE_CONFIG.companyUrl }],
  creator: SITE_CONFIG.company,
  publisher: SITE_CONFIG.company,
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} – Der Fitnessparkour für Ihre Gemeinde`,
    description: "RubikONE verwandelt bestehende Orte in Bewegungsräume – wissenschaftlich fundiert, von Köniz bewiesen. Ohne neue Geräte. Ohne Tiefbau.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RubikONE – Generationen bewegen sich gemeinsam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} – Der Fitnessparkour für Ihre Gemeinde`,
    description: "RubikONE verwandelt bestehende Orte in Bewegungsräume – wissenschaftlich fundiert, von Köniz bewiesen.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-CH">
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ConsentProvider>
          <LenisProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
            <CookieBanner />
            <FloatingConfigurator />
          </LenisProvider>
          <ConditionalAnalytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
