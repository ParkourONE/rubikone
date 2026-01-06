"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Lock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeUp } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { SingleTestimonial } from "./testimonials";
import { AvatarPlaceholder } from "@/components/shared/placeholder-image";
import { CONTACT_INFO, CONTACT_PERSON } from "@/lib/constants";

interface ContactFormProps {
  showTestimonial?: boolean;
  showDirectContact?: boolean;
  title?: string;
  subtitle?: string;
}

export function ContactForm({
  showTestimonial = true,
  showDirectContact = true,
  title = "Kontaktieren Sie uns",
  subtitle = "Kontakt",
}: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section className="section-spacing">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-xl mx-auto text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-title-2">Vielen Dank für Ihre Nachricht</h2>
              <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]">
                Wir melden uns innerhalb von 2 Werktagen bei Ihnen.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing">
      <div className="container-content">
        <SectionHeader title={title} subtitle={subtitle} className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Form */}
          <FadeUp>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Ihr Name"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="ihre.email@gemeinde.ch"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gemeinde">Gemeinde / Organisation *</Label>
                <Input
                  id="gemeinde"
                  name="gemeinde"
                  type="text"
                  required
                  placeholder="Name Ihrer Gemeinde"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nachricht">Nachricht</Label>
                <Textarea
                  id="nachricht"
                  name="nachricht"
                  placeholder="Wie können wir Ihnen helfen?"
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="datenschutz"
                  name="datenschutz"
                  required
                  className="mt-1 h-4 w-4 rounded border-[var(--color-apple-gray-300)] text-[var(--color-apple-blue)] focus:ring-[var(--color-apple-blue)]"
                />
                <Label htmlFor="datenschutz" className="text-body-sm text-[var(--color-apple-gray-600)] font-normal cursor-pointer">
                  Ich habe die{" "}
                  <Link href="/datenschutz" className="text-[var(--color-apple-blue)] hover:underline" target="_blank">
                    Datenschutzerklärung
                  </Link>{" "}
                  gelesen und bin mit der Verarbeitung meiner Daten einverstanden. *
                </Label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Wird gesendet..."
                ) : (
                  <>
                    Nachricht senden
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-start gap-2 text-body-sm text-[var(--color-apple-gray-600)]">
                <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Ihre Daten sind sicher. Wir verwenden sie nur zur Bearbeitung Ihrer Anfrage
                  und geben sie nicht an Dritte weiter.
                </p>
              </div>
            </form>
          </FadeUp>

          {/* Sidebar */}
          {showDirectContact && (
            <FadeUp delay={0.1}>
              <div className="space-y-8">
                {/* Direct Contact */}
                <div className="bg-[var(--color-apple-gray-100)] rounded-[var(--radius-apple-lg)] p-6">
                  <h3 className="text-headline mb-4">Ihre Ansprechpartnerin</h3>
                  <div className="flex items-center gap-4">
                    <AvatarPlaceholder name={CONTACT_PERSON.name} size="lg" />
                    <div>
                      <p className="text-body font-semibold">{CONTACT_PERSON.name}</p>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                        {CONTACT_PERSON.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-body-sm">
                    <p>
                      <a
                        href={`tel:${CONTACT_PERSON.phone.replace(/\s/g, "")}`}
                        className="text-[var(--color-apple-blue)] hover:underline"
                      >
                        {CONTACT_PERSON.phone}
                      </a>
                    </p>
                    <p>
                      <a
                        href={`mailto:${CONTACT_PERSON.email}`}
                        className="text-[var(--color-apple-blue)] hover:underline"
                      >
                        {CONTACT_PERSON.email}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="text-center p-6 border border-[var(--color-apple-gray-200)] rounded-[var(--radius-apple-lg)]">
                  <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                    Durchschnittliche Antwortzeit
                  </p>
                  <p className="text-title-3 text-[var(--color-apple-blue)] mt-1">
                    &lt; 2 Werktage
                  </p>
                </div>

                {/* Testimonial */}
                {showTestimonial && (
                  <div className="bg-[var(--color-apple-gray-100)] rounded-[var(--radius-apple-lg)] p-6">
                    <p className="text-body italic text-[var(--color-apple-gray-700)]">
                      &ldquo;Professionelle Beratung, schnelle Reaktion. So macht Zusammenarbeit Spass.&rdquo;
                    </p>
                    <p className="mt-3 text-body-sm text-[var(--color-apple-gray-600)]">
                      – P. Müller, Sportamt Bern
                    </p>
                  </div>
                )}
              </div>
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  );
}

// Standalone contact form (without sidebar)
export function SimpleContactForm() {
  return (
    <ContactForm showDirectContact={false} showTestimonial={false} />
  );
}
