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
  Sparkles,
  Palette,
  Shield,
  Box,
  AlertCircle
} from "lucide-react";
import { CONFIGURATOR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { appleTransition } from "@/lib/animations";

type PackageId = "kompakt" | "standard" | "premium";
type ServiceId = "standortanalyse" | "baugesuch" | "eigentuemer" | "produktion" | "montage";

const serviceIcons: Record<ServiceId, React.ReactNode> = {
  standortanalyse: <MapPin className="h-4 w-4" />,
  baugesuch: <FileText className="h-4 w-4" />,
  eigentuemer: <Users className="h-4 w-4" />,
  produktion: <Package className="h-4 w-4" />,
  montage: <Wrench className="h-4 w-4" />,
};

// Icons for core services
const coreServiceIcons = [
  <Palette key="design" className="h-4 w-4" />,
  <Shield key="safety" className="h-4 w-4" />,
  <Box key="material" className="h-4 w-4" />,
];

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 pb-4 overflow-y-auto"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={appleTransition}
            className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[var(--color-apple-gray-100)] rounded-full flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
            >
              <X className="h-5 w-5 text-[var(--color-apple-gray-600)]" />
            </button>

            {/* Progress Steps */}
            <div className="px-8 pt-6 pb-4 border-b border-[var(--color-apple-gray-200)]">
              <div className="flex items-center justify-center gap-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center gap-4">
                    <button
                      onClick={() => num < step && setStep(num)}
                      disabled={num > step}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                        step === num
                          ? "bg-[var(--color-apple-blue)] text-white"
                          : num < step
                          ? "bg-[var(--color-apple-blue)]/20 text-[var(--color-apple-blue)]"
                          : "bg-[var(--color-apple-gray-200)] text-[var(--color-apple-gray-500)]"
                      )}
                    >
                      {num < step ? <Check className="h-4 w-4" /> : num}
                    </button>
                    {num < 3 && (
                      <div className={cn(
                        "w-12 h-0.5",
                        num < step ? "bg-[var(--color-apple-blue)]" : "bg-[var(--color-apple-gray-200)]"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Package Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-title-2 text-[var(--color-apple-dark)] text-center mb-2">
                      Paket wählen
                    </h2>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)] text-center mb-6">
                      Wie viele Posten soll Ihre Route umfassen?
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                      {CONFIGURATOR.packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id as PackageId)}
                          className={cn(
                            "relative p-4 rounded-2xl text-center transition-all",
                            selectedPackage === pkg.id
                              ? "bg-[var(--color-apple-blue)] text-white ring-2 ring-[var(--color-apple-blue)] ring-offset-2"
                              : "bg-[var(--color-apple-gray-100)] hover:bg-[var(--color-apple-gray-200)]"
                          )}
                        >
                          {"recommended" in pkg && pkg.recommended && selectedPackage !== pkg.id && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--color-apple-blue)] text-white text-[10px] font-medium rounded-full">
                              Empfohlen
                            </span>
                          )}
                          <div className={cn(
                            "text-3xl font-bold mb-1",
                            selectedPackage === pkg.id ? "text-white" : "text-[var(--color-apple-blue)]"
                          )}>
                            {pkg.posts}
                          </div>
                          <p className={cn(
                            "text-caption",
                            selectedPackage === pkg.id ? "text-white/70" : "text-[var(--color-apple-gray-600)]"
                          )}>
                            Posten
                          </p>
                          <p className={cn(
                            "text-body-sm font-semibold mt-2",
                            selectedPackage === pkg.id ? "text-white" : "text-[var(--color-apple-dark)]"
                          )}>
                            {pkg.name}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* Core services included */}
                    <div className="mt-6 p-4 bg-[var(--color-apple-gray-100)] rounded-xl">
                      <p className="text-caption font-medium text-[var(--color-apple-gray-600)] mb-3">
                        Immer inklusive:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {CONFIGURATOR.coreServices.map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-caption text-[var(--color-apple-dark)]"
                          >
                            <span className="text-[var(--color-apple-blue)]">
                              {coreServiceIcons[index]}
                            </span>
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Services Selection */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-title-2 text-[var(--color-apple-dark)] text-center mb-2">
                      Leistungen wählen
                    </h2>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)] text-center mb-6">
                      Was soll ParkourONE übernehmen?
                    </p>

                    <div className="space-y-2">
                      {CONFIGURATOR.additionalServices.map((service) => {
                        const isSelected = selectedServices.has(service.id as ServiceId);
                        const price = service.prices[selectedPackage as keyof typeof service.prices];

                        return (
                          <button
                            key={service.id}
                            onClick={() => toggleService(service.id as ServiceId)}
                            className={cn(
                              "w-full p-4 rounded-xl text-left transition-all flex items-center gap-4",
                              isSelected
                                ? "bg-[var(--color-apple-blue)]/10 border border-[var(--color-apple-blue)]"
                                : "bg-[var(--color-apple-gray-100)] border border-transparent hover:bg-[var(--color-apple-gray-200)]"
                            )}
                          >
                            <div
                              className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                                isSelected
                                  ? "bg-[var(--color-apple-blue)] text-white"
                                  : "bg-white text-[var(--color-apple-gray-500)]"
                              )}
                            >
                              {serviceIcons[service.id as ServiceId]}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-body-sm font-semibold text-[var(--color-apple-dark)] truncate">
                                {service.name}
                              </p>
                              <p className="text-caption text-[var(--color-apple-gray-600)] truncate">
                                {isSelected ? service.description : service.selfDescription}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className={cn(
                                "text-body-sm font-semibold",
                                isSelected ? "text-[var(--color-apple-blue)]" : "text-[var(--color-apple-gray-500)]"
                              )}>
                                +{formatPrice(price)}
                              </span>
                              <div className={cn(
                                "w-5 h-5 rounded flex items-center justify-center",
                                isSelected
                                  ? "bg-[var(--color-apple-blue)]"
                                  : "border-2 border-[var(--color-apple-gray-300)]"
                              )}>
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Summary */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-title-2 text-[var(--color-apple-dark)] text-center mb-6">
                      Ihre Konfiguration
                    </h2>

                    {/* Package */}
                    <div className="flex items-center justify-between p-4 bg-[var(--color-apple-gray-100)] rounded-xl mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[var(--color-apple-blue)] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {currentPackage.posts}
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
                            {currentPackage.name}
                          </p>
                          <p className="text-caption text-[var(--color-apple-gray-600)]">
                            {currentPackage.posts} Posten
                          </p>
                        </div>
                      </div>
                      <p className="text-body font-semibold text-[var(--color-apple-dark)]">
                        {formatPrice(currentPackage.basePrice)}
                      </p>
                    </div>

                    {/* Included services */}
                    <div className="mb-4">
                      <p className="text-caption font-medium text-[var(--color-apple-gray-600)] mb-2">
                        ParkourONE übernimmt:
                      </p>
                      <div className="space-y-1">
                        {CONFIGURATOR.coreServices.map((service, index) => (
                          <div key={index} className="flex items-center gap-2 text-body-sm text-[var(--color-apple-dark)]">
                            <span className="text-[var(--color-apple-blue)]">{coreServiceIcons[index]}</span>
                            {service}
                          </div>
                        ))}
                        {CONFIGURATOR.additionalServices
                          .filter((s) => selectedServices.has(s.id as ServiceId))
                          .map((service) => (
                            <div key={service.id} className="flex items-center gap-2 text-body-sm text-[var(--color-apple-dark)]">
                              <span className="text-[var(--color-apple-blue)]">{serviceIcons[service.id as ServiceId]}</span>
                              {service.name}
                              <span className="text-[var(--color-apple-gray-500)] ml-auto">
                                +{formatPrice(service.prices[selectedPackage as keyof typeof service.prices])}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Self-service */}
                    {selectedServices.size < 5 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                        <p className="text-caption font-medium text-amber-800 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Sie übernehmen selbst:
                        </p>
                        <div className="space-y-1">
                          {CONFIGURATOR.additionalServices
                            .filter((s) => !selectedServices.has(s.id as ServiceId))
                            .map((service) => (
                              <div key={service.id} className="flex items-center gap-2 text-caption text-amber-700">
                                <span className="text-amber-500">{serviceIcons[service.id as ServiceId]}</span>
                                {service.selfDescription}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between p-4 bg-[var(--color-apple-blue)] rounded-xl text-white">
                      <p className="text-body font-medium">Geschätzter Gesamtpreis</p>
                      <p className="text-title-2 font-bold">{formatPrice(totalPrice)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 pt-4 border-t border-[var(--color-apple-gray-200)]">
              <div className="flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 text-body-sm font-medium text-[var(--color-apple-gray-600)] hover:text-[var(--color-apple-dark)] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Zurück
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="btn-primary"
                  >
                    Weiter
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
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
            "block w-full p-6 bg-gradient-to-br from-[var(--color-apple-blue)] to-[var(--color-apple-blue)]/80 rounded-2xl text-white text-left hover:shadow-apple-xl transition-shadow group",
            className
          )}
        >
          <Sparkles className="h-8 w-8 mb-4 opacity-80" />
          <h3 className="text-headline font-semibold mb-1">Preis berechnen</h3>
          <p className="text-body-sm opacity-80 mb-4">
            In 3 Schritten zu Ihrem individuellen Angebot.
          </p>
          <span className="inline-flex items-center gap-2 text-body-sm font-semibold">
            Konfigurator starten
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
          Preis berechnen
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
        Preis berechnen
      </button>
      <ConfiguratorOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
