"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeUp } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
}

export function ContactForm({
  title = "Kontaktieren Sie uns",
  subtitle = "Kontakt",
}: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      gemeinde: formData.get('gemeinde') as string,
      nachricht: formData.get('nachricht') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Fehler beim Senden');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
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

        <FadeUp>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-body-sm">{error}</p>
              </div>
            )}

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
                Ihre Daten sind sicher. Wir verwenden sie nur zur Bearbeitung Ihrer Anfrage.
              </p>
            </div>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}
