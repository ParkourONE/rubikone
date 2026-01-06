"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  MapPin,
  FileText,
  Users,
  Package,
  Wrench,
  Sparkles
} from "lucide-react";
import { CONFIGURATOR } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PackageId = "kompakt" | "standard" | "premium";
type ServiceId = "standortanalyse" | "baugesuch" | "eigentuemer" | "produktion" | "montage";

const serviceIcons: Record<ServiceId, React.ReactNode> = {
  standortanalyse: <MapPin className="h-5 w-5" />,
  baugesuch: <FileText className="h-5 w-5" />,
  eigentuemer: <Users className="h-5 w-5" />,
  produktion: <Package className="h-5 w-5" />,
  montage: <Wrench className="h-5 w-5" />,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

interface ConfiguratorOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfiguratorOverlay({ isOpen, onClose }: ConfiguratorOverlayProps) {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("standard");
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(
    new Set(["standortanalyse", "baugesuch", "eigentuemer", "produktion", "montage"])
  );

  const currentPackage = CONFIGURATOR.packages.find((p) => p.id === selectedPackage)!;

  // Calculate prices
  const calculatePrices = useCallback(() => {
    const basePrice = currentPackage.basePrice;
    let servicesTotal = 0;

    CONFIGURATOR.additionalServices.forEach((service) => {
      const price = service.prices[selectedPackage as keyof typeof service.prices];
      if (selectedServices.has(service.id as ServiceId)) {
        servicesTotal += price;
      }
    });

    return {
      totalPrice: basePrice + servicesTotal,
      servicesPrice: servicesTotal,
    };
  }, [selectedPackage, selectedServices, currentPackage.basePrice]);

  const { totalPrice } = calculatePrices();

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
      }, 300);
    }
  }, [isOpen]);

  const toggleService = (serviceId: ServiceId) => {
    const newServices = new Set(selectedServices);
    if (newServices.has(serviceId)) {
      newServices.delete(serviceId);
    } else {
      newServices.add(serviceId);
    }
    setSelectedServices(newServices);
  };

  const handlePackageSelect = (packageId: PackageId) => {
    setSelectedPackage(packageId);
    // Auto-advance after brief delay
    setTimeout(() => setStep(2), 400);
  };

  const steps = [
    { number: 1, label: "Paket" },
    { number: 2, label: "Leistungen" },
    { number: 3, label: "Zusammenfassung" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white"
        >
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-[var(--color-apple-gray-200)] z-10">
            <div className="h-full max-w-5xl mx-auto px-6 flex items-center justify-between">
              {/* Back / Close */}
              <button
                onClick={step > 1 ? () => setStep(step - 1) : onClose}
                className="flex items-center gap-2 text-[var(--color-apple-blue)] hover:opacity-70 transition-opacity"
              >
                {step > 1 ? (
                  <>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-body-sm font-medium">Zurück</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5" />
                    <span className="text-body-sm font-medium">Schliessen</span>
                  </>
                )}
              </button>

              {/* Progress Steps */}
              <div className="flex items-center gap-2">
                {steps.map((s, index) => (
                  <div key={s.number} className="flex items-center">
                    <button
                      onClick={() => s.number < step && setStep(s.number)}
                      disabled={s.number > step}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
                        step === s.number
                          ? "bg-[var(--color-apple-blue)] text-white"
                          : s.number < step
                          ? "bg-[var(--color-apple-gray-100)] text-[var(--color-apple-gray-600)] hover:bg-[var(--color-apple-gray-200)]"
                          : "bg-transparent text-[var(--color-apple-gray-400)]"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-caption font-semibold",
                        step === s.number
                          ? "bg-white/20"
                          : s.number < step
                          ? "bg-[var(--color-apple-blue)] text-white"
                          : "bg-[var(--color-apple-gray-200)]"
                      )}>
                        {s.number < step ? <Check className="h-3 w-3" /> : s.number}
                      </span>
                      <span className="text-caption font-medium hidden sm:inline">{s.label}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-8 h-0.5 mx-1",
                        s.number < step ? "bg-[var(--color-apple-blue)]" : "bg-[var(--color-apple-gray-200)]"
                      )} />
                    )}
                  </div>
                ))}
              </div>

              {/* Spacer for balance */}
              <div className="w-24" />
            </div>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto pt-16 pb-32">
            <div className="max-w-5xl mx-auto px-6 py-12">
              <AnimatePresence mode="wait">
                {/* Step 1: Package Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-12">
                      <h1 className="text-display text-[var(--color-apple-dark)]">
                        Wählen Sie Ihr Paket
                      </h1>
                      <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]">
                        Wie viele Bewegungsposten soll Ihre Route umfassen?
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      {CONFIGURATOR.packages.map((pkg) => (
                        <motion.button
                          key={pkg.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePackageSelect(pkg.id as PackageId)}
                          className={cn(
                            "relative p-8 rounded-3xl text-left transition-all",
                            selectedPackage === pkg.id
                              ? "bg-[var(--color-apple-blue)] text-white shadow-apple-xl"
                              : "bg-[var(--color-apple-gray-100)] hover:bg-[var(--color-apple-gray-200)]"
                          )}
                        >
                          {"recommended" in pkg && pkg.recommended && selectedPackage !== pkg.id && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-apple-blue)] text-white text-caption font-medium rounded-full">
                              Empfohlen
                            </span>
                          )}

                          <div className="text-center">
                            <div className={cn(
                              "text-6xl font-bold mb-2",
                              selectedPackage === pkg.id ? "text-white" : "text-[var(--color-apple-blue)]"
                            )}>
                              {pkg.posts}
                            </div>
                            <p className={cn(
                              "text-body-sm mb-4",
                              selectedPackage === pkg.id ? "text-white/70" : "text-[var(--color-apple-gray-600)]"
                            )}>
                              Posten
                            </p>
                            <h3 className={cn(
                              "text-title-2 font-semibold mb-2",
                              selectedPackage === pkg.id ? "text-white" : "text-[var(--color-apple-dark)]"
                            )}>
                              {pkg.name}
                            </h3>
                            <p className={cn(
                              "text-body-sm mb-6",
                              selectedPackage === pkg.id ? "text-white/70" : "text-[var(--color-apple-gray-600)]"
                            )}>
                              {pkg.description}
                            </p>
                            <p className={cn(
                              "text-title-3 font-semibold",
                              selectedPackage === pkg.id ? "text-white" : "text-[var(--color-apple-dark)]"
                            )}>
                              ab {formatPrice(pkg.basePrice)}
                            </p>
                          </div>

                          {selectedPackage === pkg.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                            >
                              <Check className="h-5 w-5 text-[var(--color-apple-blue)]" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    <div className="text-center mt-12">
                      <button
                        onClick={() => setStep(2)}
                        className="btn-primary"
                      >
                        Weiter zu Leistungen
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Services Selection */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-12">
                      <h1 className="text-display text-[var(--color-apple-dark)]">
                        Was sollen wir übernehmen?
                      </h1>
                      <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]">
                        Wählen Sie die Leistungen, die ParkourONE für Sie erledigen soll.
                      </p>
                    </div>

                    {/* Always included */}
                    <div className="mb-8 p-6 bg-[var(--color-apple-gray-100)] rounded-2xl max-w-3xl mx-auto">
                      <p className="text-body-sm font-semibold text-[var(--color-apple-gray-600)] mb-4">
                        Immer inklusive im {currentPackage.name}:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {CONFIGURATOR.coreServices.map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-body-sm text-[var(--color-apple-dark)]"
                          >
                            <Check className="h-4 w-4 text-[var(--color-apple-blue)]" />
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Toggleable services */}
                    <div className="space-y-4 max-w-3xl mx-auto">
                      {CONFIGURATOR.additionalServices.map((service) => {
                        const isSelected = selectedServices.has(service.id as ServiceId);
                        const price = service.prices[selectedPackage as keyof typeof service.prices];

                        return (
                          <motion.button
                            key={service.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => toggleService(service.id as ServiceId)}
                            className={cn(
                              "w-full p-6 rounded-2xl text-left transition-all flex items-center gap-6",
                              isSelected
                                ? "bg-[var(--color-apple-blue)]/5 border-2 border-[var(--color-apple-blue)]"
                                : "bg-[var(--color-apple-gray-100)] border-2 border-transparent hover:bg-[var(--color-apple-gray-200)]"
                            )}
                          >
                            {/* Icon */}
                            <div
                              className={cn(
                                "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                                isSelected
                                  ? "bg-[var(--color-apple-blue)] text-white"
                                  : "bg-white text-[var(--color-apple-gray-500)]"
                              )}
                            >
                              {serviceIcons[service.id as ServiceId]}
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-body font-semibold text-[var(--color-apple-dark)]">
                                  {service.name}
                                </h3>
                                <span
                                  className={cn(
                                    "text-body font-semibold",
                                    isSelected ? "text-[var(--color-apple-blue)]" : "text-[var(--color-apple-gray-500)]"
                                  )}
                                >
                                  +{formatPrice(price)}
                                </span>
                              </div>
                              <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                                {isSelected ? service.description : service.selfDescription}
                              </p>
                            </div>

                            {/* Checkbox */}
                            <div
                              className={cn(
                                "flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all",
                                isSelected
                                  ? "border-[var(--color-apple-blue)] bg-[var(--color-apple-blue)]"
                                  : "border-[var(--color-apple-gray-300)] bg-white"
                              )}
                            >
                              {isSelected && <Check className="h-4 w-4 text-white" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="text-center mt-12">
                      <button
                        onClick={() => setStep(3)}
                        className="btn-primary"
                      >
                        Zusammenfassung anzeigen
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Summary */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-12">
                      <h1 className="text-display text-[var(--color-apple-dark)]">
                        Ihre Konfiguration
                      </h1>
                      <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]">
                        Überprüfen Sie Ihre Auswahl und fordern Sie ein Angebot an.
                      </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                      {/* Package Summary */}
                      <div className="bg-[var(--color-apple-gray-100)] rounded-3xl p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-body-sm text-[var(--color-apple-gray-600)]">Gewähltes Paket</p>
                            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
                              {currentPackage.name}
                            </h2>
                            <p className="text-body text-[var(--color-apple-gray-600)]">
                              {currentPackage.posts} Bewegungsposten
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-body-sm text-[var(--color-apple-gray-600)]">Basispreis</p>
                            <p className="text-title-2 text-[var(--color-apple-dark)]">
                              {formatPrice(currentPackage.basePrice)}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-[var(--color-apple-gray-300)] pt-6">
                          <p className="text-body-sm font-semibold text-[var(--color-apple-gray-600)] mb-4">
                            Inklusive:
                          </p>
                          <ul className="space-y-2">
                            {CONFIGURATOR.coreServices.map((service, index) => (
                              <li key={index} className="flex items-center gap-3 text-body text-[var(--color-apple-dark)]">
                                <Check className="h-4 w-4 text-[var(--color-apple-blue)]" />
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Services Summary */}
                      {selectedServices.size > 0 && (
                        <div className="bg-white border border-[var(--color-apple-gray-200)] rounded-3xl p-8 mb-8">
                          <p className="text-body-sm font-semibold text-[var(--color-apple-gray-600)] mb-4">
                            Zusätzlich gewählte Leistungen:
                          </p>
                          <ul className="space-y-4">
                            {CONFIGURATOR.additionalServices
                              .filter((s) => selectedServices.has(s.id as ServiceId))
                              .map((service) => {
                                const price = service.prices[selectedPackage as keyof typeof service.prices];
                                return (
                                  <li key={service.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-[var(--color-apple-blue)]/10 flex items-center justify-center text-[var(--color-apple-blue)]">
                                        {serviceIcons[service.id as ServiceId]}
                                      </div>
                                      <span className="text-body text-[var(--color-apple-dark)]">{service.name}</span>
                                    </div>
                                    <span className="text-body font-semibold text-[var(--color-apple-dark)]">
                                      +{formatPrice(price)}
                                    </span>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      )}

                      {/* Self-service info */}
                      {selectedServices.size < 5 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-8">
                          <p className="text-body-sm font-semibold text-amber-800 mb-4">
                            Diese Aufgaben übernehmen Sie selbst:
                          </p>
                          <ul className="space-y-2">
                            {CONFIGURATOR.additionalServices
                              .filter((s) => !selectedServices.has(s.id as ServiceId))
                              .map((service) => (
                                <li key={service.id} className="text-body text-amber-700">
                                  • {service.selfDescription}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="text-center">
                        <Link
                          href="/kontakt"
                          onClick={onClose}
                          className="btn-primary text-lg px-10 py-4"
                        >
                          Unverbindliches Angebot anfragen
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                        <p className="mt-4 text-body-sm text-[var(--color-apple-gray-600)]">
                          Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sticky Price Footer */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[var(--color-apple-gray-200)]"
          >
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                  {currentPackage.name} • {currentPackage.posts} Posten • {selectedServices.size} Zusatzleistungen
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-caption text-[var(--color-apple-gray-600)]">Geschätzter Preis</p>
                  <p className="text-title-2 text-[var(--color-apple-dark)] font-semibold">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
                {step < 3 && (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="btn-primary"
                  >
                    Weiter
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
                {step === 3 && (
                  <Link
                    href="/kontakt"
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Angebot anfragen
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Trigger Button Component
export function ConfiguratorTrigger({
  variant = "button",
  className = ""
}: {
  variant?: "button" | "card" | "inline";
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "card") {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "block w-full p-8 bg-gradient-to-br from-[var(--color-apple-blue)] to-[var(--color-apple-blue)]/80 rounded-3xl text-white text-left hover:shadow-apple-xl transition-shadow group",
            className
          )}
        >
          <Sparkles className="h-10 w-10 mb-6 opacity-80" />
          <h3 className="text-title-2 mb-2">Projekt konfigurieren</h3>
          <p className="text-body opacity-80 mb-6">
            Stellen Sie Ihr RubikONE zusammen und sehen Sie direkt den Preis.
          </p>
          <span className="inline-flex items-center gap-2 text-body font-semibold">
            Konfigurator starten
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
        <ConfiguratorOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  if (variant === "inline") {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "inline-flex items-center gap-2 text-[var(--color-apple-blue)] font-medium hover:underline",
            className
          )}
        >
          <Sparkles className="h-4 w-4" />
          Projekt konfigurieren
          <ArrowRight className="h-4 w-4" />
        </button>
        <ConfiguratorOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn("btn-primary", className)}
      >
        <Sparkles className="h-4 w-4" />
        Jetzt konfigurieren
      </button>
      <ConfiguratorOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
