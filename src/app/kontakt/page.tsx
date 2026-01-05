import { Metadata } from "next";
import { MapPin, Mail, Phone, User } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { ContactForm } from "@/components/sections/contact-form";
import { CONTACT_INFO, CONTACT_PERSON } from "@/lib/constants";
import { FadeUp } from "@/components/shared/fade-up";

export const metadata: Metadata = {
  title: "Kontakt | RubikONE",
  description: "Kontaktieren Sie uns für eine unverbindliche Beratung zu RubikONE. Wir antworten innerhalb von 2 Werktagen.",
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        title="Bereit für den neuen Blick?"
        description="Ob Impulsworkshop, Beratungsgespräch oder allgemeine Fragen – wir freuen uns auf Ihre Anfrage."
        breadcrumb="Kontakt"
      />

      {/* Contact Person */}
      <section className="section-spacing">
        <div className="container-content">
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--color-apple-gray-200)] mb-6">
                <User className="h-12 w-12 text-[var(--color-apple-gray-500)]" />
              </div>
              <h2 className="text-title-2">Ihre Ansprechpartnerin</h2>
              <p className="mt-2 text-headline text-[var(--color-apple-dark)]">
                {CONTACT_PERSON.name}
              </p>
              <p className="text-body text-[var(--color-apple-gray-600)]">
                {CONTACT_PERSON.role}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`mailto:${CONTACT_PERSON.email}`}
                  className="btn-primary"
                >
                  E-Mail schreiben
                </a>
                <a
                  href={`tel:${CONTACT_PERSON.phone.replace(/\s/g, "")}`}
                  className="btn-secondary"
                >
                  {CONTACT_PERSON.phone}
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <ContactForm
        title="Oder schreiben Sie uns direkt"
        subtitle="Kontaktformular"
      />

      {/* Company Info */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-apple-blue)] text-white mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-headline">Standort</h3>
                <p className="mt-2 text-body text-[var(--color-apple-gray-600)]">
                  {CONTACT_INFO.company}<br />
                  {CONTACT_INFO.city}
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-apple-blue)] text-white mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-headline">E-Mail</h3>
                <p className="mt-2 text-body">
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-[var(--color-apple-blue)] hover:underline"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </p>
                <p className="mt-1 text-body-sm text-[var(--color-apple-gray-600)]">
                  Antwort innerhalb von 2 Werktagen
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-apple-blue)] text-white mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-headline">Telefon</h3>
                <p className="mt-2 text-body">
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                    className="text-[var(--color-apple-blue)] hover:underline"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </p>
                <p className="mt-1 text-body-sm text-[var(--color-apple-gray-600)]">
                  Mo–Fr, 8:00–17:00 Uhr
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
