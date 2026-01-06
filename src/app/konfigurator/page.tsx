import { Metadata } from "next";
import { Configurator } from "@/components/sections/configurator";
import { PageHero } from "@/components/sections/hero-section";
import { FadeUp } from "@/components/shared/fade-up";

export const metadata: Metadata = {
  title: "Konfigurator | RubikONE",
  description: "Konfigurieren Sie Ihr RubikONE-Projekt und sehen Sie direkt, was es kostet. Wählen Sie Paket und Leistungen nach Ihren Bedürfnissen.",
};

export default function KonfiguratorPage() {
  return (
    <>
      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-3xl">
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-3">
                Projekt-Konfigurator
              </p>
              <h1 className="text-display text-[var(--color-apple-dark)]">
                Ihr RubikONE.<br />
                <span className="text-[var(--color-apple-blue)]">Ihr Preis.</span>
              </h1>
              <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]">
                Wählen Sie Paket und Leistungen – und sehen Sie sofort, was Ihr Projekt kostet.
                Sie entscheiden, was wir übernehmen und was Sie selbst machen.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="container-wide">
          <FadeUp delay={0.1}>
            <Configurator />
          </FadeUp>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="text-title-2 text-[var(--color-apple-dark)]">531</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">Teilnehmende in Köniz</p>
            </div>
            <div className="w-px h-12 bg-[var(--color-apple-gray-300)] hidden sm:block" />
            <div>
              <p className="text-title-2 text-[var(--color-apple-dark)]">0 CHF</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">Wartungskosten (8 Monate)</p>
            </div>
            <div className="w-px h-12 bg-[var(--color-apple-gray-300)] hidden sm:block" />
            <div>
              <p className="text-title-2 text-[var(--color-apple-dark)]">BASPO</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">Wissenschaftlich evaluiert</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
