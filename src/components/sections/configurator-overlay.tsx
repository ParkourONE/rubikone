"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { useScrollLock } from "@/hooks/useScrollLock";

type PackageId = "kompakt" | "standard" | "premium";
type ServiceId = "standortanalyse" | "baugesuch" | "eigentuemer" | "produktion" | "montage";

const serviceIcons: Record<ServiceId, React.ReactNode> = {
  standortanalyse: <MapPin className="h-4 w-4" />,
  baugesuch: <FileText className="h-4 w-4" />,
  eigentuemer: <Users className="h-4 w-4" />,
  produktion: <Package className="h-4 w-4" />,
  montage: <Wrench className="h-4 w-4" />,
};

const coreServiceIcons = [
  <Palette key="design" className="h-4 w-4" />,
  <Shield key="safety" className="h-4 w-4" />,
  <Box key="material" className="h-4 w-4" />,
];

const stepImages = [
  "/images/hero/oma-enkelin.jpg",
  "/images/workshop/frauen-balancieren.jpg",
  "/images/koeniz/schulklasse.jpg",
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

  useScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep(1), 300);
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Full Screen Scroll Container */}
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="min-h-full flex flex-col items-center py-[30px] px-[10px]">
              {/* Top spacer - grows to center card, shrinks when card is too big */}
              <div className="flex-1" />

              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-[630px]"
              >
              {/* Image Header - Full Width */}
              <div className="relative h-56 rounded-t-3xl overflow-hidden">
                <Image
                  src={stepImages[step - 1]}
                  alt={`Schritt ${step}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
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
                    <h2 className="text-title-3 text-[var(--color-apple-dark)] text-center mb-1">
                      Paket wählen
                    </h2>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)] text-center mb-4">
                      Wie viele Posten soll Ihre Route umfassen?
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                      {CONFIGURATOR.packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id as PackageId)}
                          className={cn(
                            "relative p-3 rounded-xl text-center transition-all",
                            selectedPackage === pkg.id
                              ? "bg-[var(--color-apple-dark)] text-white"
                              : "bg-[var(--color-apple-gray-100)] hover:bg-[var(--color-apple-gray-200)]"
                          )}
                        >
                          {"recommended" in pkg && pkg.recommended && selectedPackage !== pkg.id && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--color-apple-dark)] text-white text-[10px] font-medium rounded-full">
                              Empfohlen
                            </span>
                          )}
                          <div className={cn(
                            "text-2xl font-bold mb-0.5",
                            selectedPackage === pkg.id ? "text-white" : "text-[var(--color-apple-dark)]"
                          )}>
                            {pkg.posts}
                          </div>
                          <p className={cn(
                            "text-caption",
                            selectedPackage === pkg.id ? "text-white/70" : "text-[var(--color-apple-gray-600)]"
                          )}>
                            Posten
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-[var(--color-apple-gray-100)] rounded-xl">
                      <p className="text-caption font-medium text-[var(--color-apple-gray-600)] mb-2">
                        Immer inklusive:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {CONFIGURATOR.coreServices.map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-full text-caption text-[var(--color-apple-dark)]"
                          >
                            <span className="text-[var(--color-apple-gray-500)]">
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
                    <h2 className="text-title-3 text-[var(--color-apple-dark)] text-center mb-1">
                      Leistungen wählen
                    </h2>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)] text-center mb-4">
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
                              "w-full p-3 rounded-xl text-left transition-all flex items-center gap-3",
                              isSelected
                                ? "bg-[var(--color-apple-gray-100)] border border-[var(--color-apple-dark)]"
                                : "bg-[var(--color-apple-gray-100)] border border-transparent hover:bg-[var(--color-apple-gray-200)]"
                            )}
                          >
                            <div
                              className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                                isSelected
                                  ? "bg-[var(--color-apple-dark)] text-white"
                                  : "bg-white text-[var(--color-apple-gray-500)]"
                              )}
                            >
                              {serviceIcons[service.id as ServiceId]}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
                                {service.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-body-sm font-semibold text-[var(--color-apple-gray-500)]">
                                +{formatPrice(price)}
                              </span>
                              <div className={cn(
                                "w-5 h-5 rounded flex items-center justify-center",
                                isSelected
                                  ? "bg-[var(--color-apple-dark)]"
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
                    <h2 className="text-title-3 text-[var(--color-apple-dark)] text-center mb-4">
                      Ihre Konfiguration
                    </h2>

                    <div className="flex items-center justify-between p-3 bg-[var(--color-apple-gray-100)] rounded-xl mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-apple-dark)] rounded-lg flex items-center justify-center text-white font-bold">
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
                      <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
                        {formatPrice(currentPackage.basePrice)}
                      </p>
                    </div>

                    <div className="mb-3">
                      <p className="text-caption font-medium text-[var(--color-apple-gray-600)] mb-2">
                        ParkourONE übernimmt:
                      </p>
                      <div className="space-y-1">
                        {CONFIGURATOR.coreServices.map((service, index) => (
                          <div key={index} className="flex items-center gap-2 text-body-sm text-[var(--color-apple-dark)]">
                            <span className="text-[var(--color-apple-gray-500)]">{coreServiceIcons[index]}</span>
                            {service}
                          </div>
                        ))}
                        {CONFIGURATOR.additionalServices
                          .filter((s) => selectedServices.has(s.id as ServiceId))
                          .map((service) => (
                            <div key={service.id} className="flex items-center gap-2 text-body-sm text-[var(--color-apple-dark)]">
                              <span className="text-[var(--color-apple-gray-500)]">{serviceIcons[service.id as ServiceId]}</span>
                              {service.name}
                              <span className="text-[var(--color-apple-gray-500)] ml-auto">
                                +{formatPrice(service.prices[selectedPackage as keyof typeof service.prices])}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {selectedServices.size < 5 && (
                      <div className="p-3 bg-[var(--color-apple-gray-100)] border border-[var(--color-apple-gray-300)] rounded-xl">
                        <p className="text-caption font-medium text-[var(--color-apple-gray-700)] mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Sie übernehmen selbst:
                        </p>
                        <div className="space-y-1">
                          {CONFIGURATOR.additionalServices
                            .filter((s) => !selectedServices.has(s.id as ServiceId))
                            .map((service) => (
                              <div key={service.id} className="flex items-center gap-2 text-caption text-[var(--color-apple-gray-600)]">
                                <span className="text-[var(--color-apple-gray-500)]">{serviceIcons[service.id as ServiceId]}</span>
                                {service.selfDescription}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 pt-6 pb-8 border-t border-[var(--color-apple-gray-200)] rounded-b-3xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-caption text-[var(--color-apple-gray-600)]">Geschätzter Preis</p>
                    <p className="text-title-3 text-[var(--color-apple-dark)] font-bold">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {step > 1 && (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="flex items-center gap-1 text-body-sm font-medium text-[var(--color-apple-gray-600)] hover:text-[var(--color-apple-dark)] transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Zurück
                      </button>
                    )}

                    {step < 3 ? (
                      <button
                        onClick={() => setStep(step + 1)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-apple-dark)] text-white rounded-full font-medium hover:bg-black transition-colors"
                      >
                        Weiter
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <Link
                        href="/kontakt"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-apple-dark)] text-white rounded-full font-medium hover:bg-black transition-colors"
                      >
                        Angebot anfragen
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              </motion.div>

              {/* Bottom spacer - grows to center card, shrinks when card is too big */}
              <div className="flex-1" />
            </div>
          </div>
        </>
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
