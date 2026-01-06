import { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/hero-section";
import { FadeUp } from "@/components/shared/fade-up";

export const metadata: Metadata = {
  title: "Impressum | RubikONE",
  description: "Impressum und rechtliche Informationen zu RubikONE.",
};

export default function ImpressumPage() {
  return (
    <>
      <PageHero
        title="Impressum"
        breadcrumb="Rechtliches"
      />

      <section className="section-spacing">
        <div className="container-content">
          <FadeUp>
            <div className="prose prose-lg max-w-3xl mx-auto text-[var(--color-apple-gray-700)]">

              <h2 className="text-title-2 text-[var(--color-apple-dark)] mt-0">Kontaktadresse</h2>
              <p>
                ParkourONE GmbH<br />
                Könizstrasse 161<br />
                3097 Liebefeld<br />
                Schweiz
              </p>
              <p>
                E-Mail: <a href="mailto:info@rubikone.ch" className="text-[var(--color-apple-blue)] hover:underline">info@rubikone.ch</a><br />
                Telefon: <a href="tel:+41319712827" className="text-[var(--color-apple-blue)] hover:underline">+41 31 971 28 27</a>
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">Vertretungsberechtigte Person</h2>
              <p>
                Roger Widmer, Geschäftsführer
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">Handelsregistereintrag</h2>
              <p>
                Eingetragener Firmenname: ParkourONE GmbH<br />
                Handelsregister: Handelsregisteramt des Kantons Bern<br />
                UID: CHE-114.332.498
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">Haftungsausschluss</h2>
              <p>
                Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit,
                Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.
              </p>
              <p>
                Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art,
                welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten
                Informationen, durch Missbrauch der Verbindung oder durch technische Störungen
                entstanden sind, werden ausgeschlossen.
              </p>
              <p>
                Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor,
                Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern,
                zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">Haftung für Links</h2>
              <p>
                Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs.
                Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung
                solcher Webseiten erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">Urheberrechte</h2>
              <p>
                Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien
                auf der Website gehören ausschliesslich der ParkourONE GmbH oder den speziell genannten
                Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung
                der Urheberrechtsträger im Voraus einzuholen.
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">Datenschutz</h2>
              <p>
                Informationen zur Bearbeitung von Personendaten finden Sie in unserer{" "}
                <Link href="/datenschutz" className="text-[var(--color-apple-blue)] hover:underline">
                  Datenschutzerklärung
                </Link>.
              </p>

              <div className="mt-12 pt-8 border-t border-[var(--color-apple-gray-200)]">
                <p className="text-body-sm text-[var(--color-apple-gray-500)]">
                  Stand: Januar 2025
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
