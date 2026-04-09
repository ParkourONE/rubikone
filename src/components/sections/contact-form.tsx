"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeUp } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { CONTACT_FORM_LABELS } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  titleEditPath?: string;
  subtitleEditPath?: string;
}

export function ContactForm({
  title = "Kontaktieren Sie uns",
  subtitle = "Kontakt",
  titleEditPath,
  subtitleEditPath,
}: ContactFormProps) {
  const labels = useContent("CONTACT_FORM_LABELS", CONTACT_FORM_LABELS);
  const editSuccessTitle = useEditPath("CONTACT_FORM_LABELS.successTitle");
  const editSuccessMessage = useEditPath("CONTACT_FORM_LABELS.successMessage");
  const editNameLabel = useEditPath("CONTACT_FORM_LABELS.nameLabel");
  const editEmailLabel = useEditPath("CONTACT_FORM_LABELS.emailLabel");
  const editGemeindeLabel = useEditPath("CONTACT_FORM_LABELS.gemeindeLabel");
  const editNachrichtLabel = useEditPath("CONTACT_FORM_LABELS.nachrichtLabel");
  const editPrivacyPrefix = useEditPath("CONTACT_FORM_LABELS.privacyPrefix");
  const editPrivacyLinkText = useEditPath("CONTACT_FORM_LABELS.privacyLinkText");
  const editPrivacySuffix = useEditPath("CONTACT_FORM_LABELS.privacySuffix");
  const editSubmitLabel = useEditPath("CONTACT_FORM_LABELS.submitLabel");
  const editPrivacyHint = useEditPath("CONTACT_FORM_LABELS.privacyHint");
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
        throw new Error(result.error || labels.errorSendFailed);
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.errorDefault);
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
              <h2 className="text-title-2" {...editSuccessTitle}>{labels.successTitle}</h2>
              <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]" {...editSuccessMessage}>
                {labels.successMessage}
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
        <SectionHeader
          title={title}
          subtitle={subtitle}
          className="mb-12"
          titleProps={titleEditPath ? { "data-edit-path": titleEditPath } : undefined}
          subtitleProps={subtitleEditPath ? { "data-edit-path": subtitleEditPath } : undefined}
        />

        <FadeUp>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-body-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" {...editNameLabel}>{labels.nameLabel}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder={labels.namePlaceholder}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" {...editEmailLabel}>{labels.emailLabel}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder={labels.emailPlaceholder}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gemeinde" {...editGemeindeLabel}>{labels.gemeindeLabel}</Label>
              <Input
                id="gemeinde"
                name="gemeinde"
                type="text"
                required
                placeholder={labels.gemeindePlaceholder}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nachricht" {...editNachrichtLabel}>{labels.nachrichtLabel}</Label>
              <Textarea
                id="nachricht"
                name="nachricht"
                placeholder={labels.nachrichtPlaceholder}
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
                <span {...editPrivacyPrefix}>{labels.privacyPrefix}</span>{" "}
                <Link href="/datenschutz" className="text-[var(--color-apple-blue)] hover:underline" target="_blank" {...editPrivacyLinkText}>
                  {labels.privacyLinkText}
                </Link>{" "}
                <span {...editPrivacySuffix}>{labels.privacySuffix}</span>
              </Label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? (
                labels.submitBusyLabel
              ) : (
                <>
                  <span {...editSubmitLabel}>{labels.submitLabel}</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-start gap-2 text-body-sm text-[var(--color-apple-gray-600)]">
              <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p {...editPrivacyHint}>
                {labels.privacyHint}
              </p>
            </div>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}
