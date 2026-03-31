"use client";

import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { ContactForm } from "@/components/sections/contact-form";
import { EditableSection } from "@/components/admin/editable-section";
import { useContent } from "@/hooks/useContent";
import { FadeUp } from "@/components/shared/fade-up";
import {
  CONTACT_INFO,
  KONTAKT_HERO,
  KONTAKT_FORM,
} from "@/lib/constants";

export default function KontaktPage() {
  const hero = useContent("KONTAKT_HERO", KONTAKT_HERO) as any;
  const form = useContent("KONTAKT_FORM", KONTAKT_FORM) as any;

  return (
    <>
      <EditableSection contentKey="KONTAKT_HERO" label="Hero">
      <PageHero
        title={hero.title}
        description={hero.description}
        breadcrumb={hero.breadcrumb}
        image={hero.image}
        imageAlt={hero.imageAlt}
      />
      </EditableSection>

      {/* Contact Info */}
      <EditableSection contentKey="KONTAKT_FORM" label="Kontakt & Formular">
      <section className="section-spacing">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-apple-gray-100)] mb-4">
                  <MapPin className="h-6 w-6 text-[var(--color-apple-blue)]" />
                </div>
                <h3 className="text-headline">Standort</h3>
                <p className="mt-2 text-body text-[var(--color-apple-gray-600)]">
                  {CONTACT_INFO.company}<br />
                  {CONTACT_INFO.street}<br />
                  {CONTACT_INFO.city}
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-apple-gray-100)] mb-4">
                  <Mail className="h-6 w-6 text-[var(--color-apple-blue)]" />
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
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-apple-gray-100)] mb-4">
                  <Phone className="h-6 w-6 text-[var(--color-apple-blue)]" />
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
                  {form.phoneHours}
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <ContactForm
        title={form.contactFormTitle}
        subtitle={form.contactFormSubtitle}
      />

      {/* Image Section */}
      <section className="relative h-[40vh] min-h-[300px]">
        <Image
          src={form.footerImage}
          alt="Parkour in Aktion"
          fill
          className="object-cover"
        />
      </section>
      </EditableSection>
    </>
  );
}
