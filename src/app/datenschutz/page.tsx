import { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/hero-section";
import { FadeUp } from "@/components/shared/fade-up";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | RubikONE",
  description: "Datenschutzerklärung von RubikONE - Informationen zur Bearbeitung Ihrer Personendaten.",
};

export default function DatenschutzPage() {
  return (
    <>
      <PageHero
        title="Datenschutzerklärung"
        breadcrumb="Rechtliches"
      />

      <section className="section-spacing">
        <div className="container-content">
          <FadeUp>
            <div className="prose prose-lg max-w-3xl mx-auto text-[var(--color-apple-gray-700)]">

              <h2 className="text-title-2 text-[var(--color-apple-dark)] mt-0">1. Einleitung</h2>
              <p>
                Mit dieser Datenschutzerklärung informieren wir Sie über die Bearbeitung von
                Personendaten im Zusammenhang mit unserer Website rubikone.ch und unserem
                sonstigen Online-Angebot.
              </p>
              <p>
                Diese Datenschutzerklärung ist auf die Anforderungen der EU-Datenschutz-Grundverordnung
                (DSGVO), das Schweizer Datenschutzgesetz (DSG) und das revidierte Schweizer
                Datenschutzgesetz (revDSG) ausgelegt.
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">2. Verantwortlicher</h2>
              <p>
                Verantwortlich für die Datenbearbeitung ist:
              </p>
              <p>
                ParkourONE GmbH<br />
                Südstrasse 16, SPOT 101<br />
                3110 Münsingen<br />
                Schweiz
              </p>
              <p>
                E-Mail: <a href="mailto:info@rubikone.ch" className="text-[var(--color-apple-blue)] hover:underline">info@rubikone.ch</a><br />
                Telefon: <a href="tel:+41319712827" className="text-[var(--color-apple-blue)] hover:underline">+41 31 971 28 27</a>
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">3. Erhebung und Bearbeitung von Personendaten</h2>

              <h3 className="text-headline text-[var(--color-apple-dark)]">3.1 Beim Besuch unserer Website</h3>
              <p>
                Bei jedem Zugriff auf unsere Website werden automatisch folgende Daten erhoben
                und in Server-Logfiles gespeichert:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP-Adresse des anfragenden Geräts</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>Verwendeter Browser und Betriebssystem</li>
              </ul>
              <p>
                Diese Daten werden ausschliesslich zur Gewährleistung eines störungsfreien Betriebs
                der Website und zur Verbesserung unseres Angebots ausgewertet. Eine Zuordnung dieser
                Daten zu einer bestimmten Person ist uns nicht möglich.
              </p>

              <h3 className="text-headline text-[var(--color-apple-dark)]">3.2 Kontaktformular</h3>
              <p>
                Wenn Sie unser Kontaktformular nutzen, erheben wir folgende Daten:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name</li>
                <li>E-Mail-Adresse</li>
                <li>Gemeinde / Organisation</li>
                <li>Ihre Nachricht</li>
              </ul>
              <p>
                Diese Daten verwenden wir ausschliesslich zur Bearbeitung Ihrer Anfrage.
                Wir geben Ihre Daten nicht an Dritte weiter. Nach Abschluss der Bearbeitung
                werden Ihre Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
              </p>
              <p>
                <strong>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf Grundlage Ihrer
                Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie zur Durchführung vorvertraglicher
                Massnahmen (Art. 6 Abs. 1 lit. b DSGVO).
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">4. Externe Dienste</h2>

              <h3 className="text-headline text-[var(--color-apple-dark)]">4.1 Google Fonts</h3>
              <p>
                Diese Website verwendet Google Fonts für die einheitliche Darstellung von Schriftarten.
                Beim Aufruf einer Seite lädt Ihr Browser die benötigten Schriftarten in Ihren
                Browser-Cache, um Texte und Schriftarten korrekt anzuzeigen.
              </p>
              <p>
                Zu diesem Zweck muss der von Ihnen verwendete Browser Verbindung zu den Servern
                von Google aufnehmen. Hierdurch erlangt Google Kenntnis darüber, dass über Ihre
                IP-Adresse unsere Website aufgerufen wurde.
              </p>
              <p>
                Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.<br />
                Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-apple-blue)] hover:underline">Google Datenschutzerklärung</a>
              </p>

              <h3 className="text-headline text-[var(--color-apple-dark)]">4.2 Vercel Analytics</h3>
              <p>
                Wir verwenden Vercel Analytics, um anonymisierte Nutzungsstatistiken zu erheben.
                Vercel Analytics ist ein datenschutzfreundliches Analyse-Tool, das keine Cookies
                verwendet und keine personenbezogenen Daten speichert.
              </p>
              <p>
                Folgende Daten werden erfasst:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Seitenaufrufe (ohne persönliche Identifikation)</li>
                <li>Verweildauer auf der Seite</li>
                <li>Geografische Region (Land/Stadt, keine genaue Position)</li>
                <li>Gerätetyp und Browser</li>
                <li>Referrer (woher Besucher kommen)</li>
              </ul>
              <p>
                <strong>Wichtig:</strong> Diese Analyse erfolgt nur mit Ihrer Einwilligung.
                Sie können Ihre Einstellungen jederzeit über den Link «Cookie-Einstellungen»
                im Footer ändern.
              </p>
              <p>
                Anbieter: Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.<br />
                Weitere Informationen: <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-apple-blue)] hover:underline">Vercel Analytics Privacy Policy</a>
              </p>

              <h3 className="text-headline text-[var(--color-apple-dark)]">4.3 YouTube-Videos</h3>
              <p>
                Auf einigen Seiten binden wir YouTube-Videos ein. Anbieter ist die Google Ireland
                Limited. Wenn Sie eine Seite mit einem eingebetteten Video besuchen, wird eine
                Verbindung zu den YouTube-Servern hergestellt.
              </p>
              <p>
                Wir verwenden YouTube im erweiterten Datenschutzmodus. Das bedeutet, dass YouTube
                keine Cookies setzt, die das Nutzerverhalten erfassen, solange Sie das Video
                nicht abspielen.
              </p>
              <p>
                Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-apple-blue)] hover:underline">Google Datenschutzerklärung</a>
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">5. Cookies und Einwilligung</h2>

              <h3 className="text-headline text-[var(--color-apple-dark)]">5.1 Cookie-Kategorien</h3>
              <p>
                Wir unterscheiden zwischen folgenden Cookie-Kategorien:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Notwendige Cookies:</strong> Diese Cookies sind für den Betrieb der Website
                  unbedingt erforderlich. Sie ermöglichen Grundfunktionen und können nicht deaktiviert werden.
                </li>
                <li>
                  <strong>Analyse-Cookies:</strong> Diese Cookies helfen uns zu verstehen, wie Besucher
                  mit unserer Website interagieren. Die Daten werden anonymisiert erhoben (Vercel Analytics).
                </li>
                <li>
                  <strong>Marketing-Cookies:</strong> Diese Cookies werden verwendet, um Werbung relevanter
                  zu gestalten. Derzeit verwenden wir keine Marketing-Cookies.
                </li>
              </ul>

              <h3 className="text-headline text-[var(--color-apple-dark)]">5.2 Einwilligungsmanagement</h3>
              <p>
                Beim ersten Besuch unserer Website werden Sie gefragt, welche Cookies Sie akzeptieren möchten.
                Ihre Entscheidung wird lokal in Ihrem Browser gespeichert (localStorage).
              </p>
              <p>
                Sie können Ihre Einstellungen jederzeit ändern, indem Sie auf «Cookie-Einstellungen»
                im Footer der Website klicken. Ihre Einwilligung können Sie dort auch widerrufen.
              </p>

              <h3 className="text-headline text-[var(--color-apple-dark)]">5.3 Verwendete Cookies</h3>
              <table className="w-full text-body-sm border-collapse mt-4">
                <thead>
                  <tr className="border-b border-[var(--color-apple-gray-200)]">
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">Zweck</th>
                    <th className="text-left py-2 pr-4">Speicherdauer</th>
                    <th className="text-left py-2">Kategorie</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-apple-gray-100)]">
                    <td className="py-2 pr-4">rubikone-cookie-consent</td>
                    <td className="py-2 pr-4">Speichert Ihre Cookie-Präferenzen</td>
                    <td className="py-2 pr-4">1 Jahr</td>
                    <td className="py-2">Notwendig</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">6. Hosting</h2>
              <p>
                Diese Website wird bei Vercel Inc. gehostet. Vercel kann bei Zugriffen auf
                unsere Website Server-Logfiles erheben und speichern.
              </p>
              <p>
                Anbieter: Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.<br />
                Weitere Informationen: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-apple-blue)] hover:underline">Vercel Privacy Policy</a>
              </p>
              <p>
                Vercel ist unter dem EU-US Data Privacy Framework zertifiziert und bietet
                damit Garantien zur Einhaltung des europäischen Datenschutzniveaus.
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">7. Datensicherheit</h2>
              <p>
                Wir treffen angemessene technische und organisatorische Sicherheitsmassnahmen,
                um Ihre Personendaten gegen unbeabsichtigte oder unrechtmässige Vernichtung,
                Verlust, Veränderung oder unbefugte Offenlegung zu schützen.
              </p>
              <p>
                Die Datenübertragung zwischen Ihrem Browser und unserer Website erfolgt
                verschlüsselt über HTTPS/TLS.
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">8. Ihre Rechte</h2>
              <p>
                Sie haben folgende Rechte in Bezug auf Ihre Personendaten:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Auskunftsrecht:</strong> Sie können jederzeit Auskunft über Ihre bei uns gespeicherten Daten verlangen.</li>
                <li><strong>Berichtigungsrecht:</strong> Sie können die Berichtigung unrichtiger Daten verlangen.</li>
                <li><strong>Löschungsrecht:</strong> Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
                <li><strong>Einschränkungsrecht:</strong> Sie können die Einschränkung der Verarbeitung verlangen.</li>
                <li><strong>Widerspruchsrecht:</strong> Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
                <li><strong>Datenübertragbarkeit:</strong> Sie können Ihre Daten in einem strukturierten, gängigen Format erhalten.</li>
              </ul>
              <p>
                Zur Ausübung dieser Rechte wenden Sie sich bitte an:{" "}
                <a href="mailto:info@rubikone.ch" className="text-[var(--color-apple-blue)] hover:underline">info@rubikone.ch</a>
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">9. Beschwerderecht</h2>
              <p>
                Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen das
                Datenschutzrecht verstösst, haben Sie das Recht, sich bei einer Aufsichtsbehörde
                zu beschweren.
              </p>
              <p>
                <strong>Schweiz:</strong> Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)<br />
                <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer" className="text-[var(--color-apple-blue)] hover:underline">www.edoeb.admin.ch</a>
              </p>

              <h2 className="text-title-2 text-[var(--color-apple-dark)]">10. Änderungen</h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen.
                Die aktuelle Version ist stets auf unserer Website verfügbar.
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
