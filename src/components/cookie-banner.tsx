"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Cookie, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useConsent, ConsentPreferences } from "@/providers/consent-provider";
import { appleTransition } from "@/lib/animations";

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, updateConsent, closeBanner, consent } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
  });

  const handleSavePreferences = () => {
    updateConsent(preferences);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={appleTransition}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-[var(--color-apple-gray-200)] overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center">
                    <Cookie className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-headline font-semibold text-[var(--color-apple-dark)]">
                      Cookie-Einstellungen
                    </h3>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                      Wir respektieren Ihre Privatsphäre
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeBanner}
                  className="p-2 hover:bg-[var(--color-apple-gray-100)] rounded-full transition-colors"
                  aria-label="Schliessen"
                >
                  <X className="h-5 w-5 text-[var(--color-apple-gray-500)]" />
                </button>
              </div>

              <p className="mt-4 text-body text-[var(--color-apple-gray-700)]">
                Wir verwenden Cookies und ähnliche Technologien, um unsere Website zu analysieren
                und zu verbessern. Sie können selbst entscheiden, welche Cookies Sie zulassen möchten.
              </p>

              {/* Details Toggle */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-4 flex items-center gap-2 text-body-sm text-[var(--color-apple-blue)] hover:underline"
              >
                <Settings className="h-4 w-4" />
                Einstellungen anpassen
                {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* Detailed Settings */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 space-y-4 border-t border-[var(--color-apple-gray-200)] pt-4">
                    {/* Necessary Cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-[var(--color-apple-gray-100)] rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">
                            Notwendig
                          </h4>
                          <span className="px-2 py-0.5 bg-[var(--color-apple-gray-200)] rounded text-caption text-[var(--color-apple-gray-600)]">
                            Immer aktiv
                          </span>
                        </div>
                        <p className="mt-1 text-body-sm text-[var(--color-apple-gray-600)]">
                          Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                        </p>
                      </div>
                      <div className="flex items-center justify-center w-12 h-6 bg-[var(--color-apple-blue)] rounded-full">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-[var(--color-apple-gray-100)] rounded-xl">
                      <div className="flex-1">
                        <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">
                          Analyse
                        </h4>
                        <p className="mt-1 text-body-sm text-[var(--color-apple-gray-600)]">
                          Hilft uns zu verstehen, wie Besucher mit unserer Website interagieren.
                          Wir verwenden Vercel Analytics für anonymisierte Nutzungsstatistiken.
                        </p>
                      </div>
                      <button
                        onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          preferences.analytics
                            ? "bg-[var(--color-apple-blue)]"
                            : "bg-[var(--color-apple-gray-300)]"
                        }`}
                        aria-label="Analyse-Cookies umschalten"
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            preferences.analytics ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-[var(--color-apple-gray-100)] rounded-xl">
                      <div className="flex-1">
                        <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">
                          Marketing
                        </h4>
                        <p className="mt-1 text-body-sm text-[var(--color-apple-gray-600)]">
                          Werden verwendet, um Werbung relevanter zu gestalten.
                          Derzeit verwenden wir keine Marketing-Cookies.
                        </p>
                      </div>
                      <button
                        onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          preferences.marketing
                            ? "bg-[var(--color-apple-blue)]"
                            : "bg-[var(--color-apple-gray-300)]"
                        }`}
                        aria-label="Marketing-Cookies umschalten"
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            preferences.marketing ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="p-6 pt-4 border-t border-[var(--color-apple-gray-200)] bg-[var(--color-apple-gray-50)]">
              <div className="flex flex-col sm:flex-row gap-3">
                {showDetails ? (
                  <button
                    onClick={handleSavePreferences}
                    className="btn-primary flex-1"
                  >
                    Auswahl speichern
                  </button>
                ) : (
                  <>
                    <button
                      onClick={rejectAll}
                      className="btn-secondary flex-1"
                    >
                      Nur Notwendige
                    </button>
                    <button
                      onClick={acceptAll}
                      className="btn-primary flex-1"
                    >
                      Alle akzeptieren
                    </button>
                  </>
                )}
              </div>
              <p className="mt-4 text-center text-caption text-[var(--color-apple-gray-500)]">
                Mehr Informationen in unserer{" "}
                <Link href="/datenschutz" className="text-[var(--color-apple-blue)] hover:underline">
                  Datenschutzerklärung
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
