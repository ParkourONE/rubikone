"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, MapPin, FileText, Users, Package, Wrench, Sparkles, ArrowRight, Info } from "lucide-react";
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

export function Configurator() {
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("standard");
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(
    new Set(["standortanalyse", "baugesuch", "eigentuemer", "produktion", "montage"])
  );
  const [hoveredService, setHoveredService] = useState<ServiceId | null>(null);

  const currentPackage = CONFIGURATOR.packages.find((p) => p.id === selectedPackage)!;

  const { totalPrice, servicesPrice, savings } = useMemo(() => {
    const basePrice = currentPackage.basePrice;
    let servicesTotal = 0;
    let maxServicesTotal = 0;

    CONFIGURATOR.additionalServices.forEach((service) => {
      const price = service.prices[selectedPackage as keyof typeof service.prices];
      maxServicesTotal += price;
      if (selectedServices.has(service.id as ServiceId)) {
        servicesTotal += price;
      }
    });

    return {
      totalPrice: basePrice + servicesTotal,
      servicesPrice: servicesTotal,
      savings: maxServicesTotal - servicesTotal,
    };
  }, [selectedPackage, selectedServices, currentPackage.basePrice]);

  const toggleService = (serviceId: ServiceId) => {
    const newServices = new Set(selectedServices);
    if (newServices.has(serviceId)) {
      newServices.delete(serviceId);
    } else {
      newServices.add(serviceId);
    }
    setSelectedServices(newServices);
  };

  const selectAll = () => {
    setSelectedServices(new Set(["standortanalyse", "baugesuch", "eigentuemer", "produktion", "montage"]));
  };

  const selectNone = () => {
    setSelectedServices(new Set());
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Step 1: Package Selection */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-apple-blue)] text-white text-sm font-semibold">
            1
          </div>
          <h2 className="text-title-3 text-[var(--color-apple-dark)]">Paket wählen</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {CONFIGURATOR.packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id as PackageId)}
              className={cn(
                "relative p-6 rounded-2xl border-2 text-left transition-all",
                selectedPackage === pkg.id
                  ? "border-[var(--color-apple-blue)] bg-[var(--color-apple-blue)]/5"
                  : "border-[var(--color-apple-gray-200)] hover:border-[var(--color-apple-gray-400)]"
              )}
            >
              {"recommended" in pkg && pkg.recommended && (
                <span className="absolute -top-3 left-4 px-3 py-1 bg-[var(--color-apple-blue)] text-white text-caption font-medium rounded-full">
                  Empfohlen
                </span>
              )}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-headline text-[var(--color-apple-dark)]">{pkg.name}</h3>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)]">{pkg.posts} Posten</p>
                </div>
                {selectedPackage === pkg.id && (
                  <div className="w-6 h-6 rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-2">{pkg.description}</p>
              <p className="text-title-3 text-[var(--color-apple-dark)] mt-4">
                ab {formatPrice(pkg.basePrice)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Services Selection */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-apple-blue)] text-white text-sm font-semibold">
              2
            </div>
            <h2 className="text-title-3 text-[var(--color-apple-dark)]">Leistungen konfigurieren</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-body-sm text-[var(--color-apple-blue)] hover:underline"
            >
              Alle wählen
            </button>
            <span className="text-[var(--color-apple-gray-400)]">|</span>
            <button
              onClick={selectNone}
              className="text-body-sm text-[var(--color-apple-blue)] hover:underline"
            >
              Keine
            </button>
          </div>
        </div>

        {/* Core Services - Always Included */}
        <div className="mb-6 p-4 bg-[var(--color-apple-gray-100)] rounded-xl">
          <p className="text-body-sm font-medium text-[var(--color-apple-gray-600)] mb-3">
            Immer inklusive:
          </p>
          <div className="flex flex-wrap gap-2">
            {CONFIGURATOR.coreServices.map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-body-sm text-[var(--color-apple-dark)]"
              >
                <Check className="h-4 w-4 text-[var(--color-apple-blue)]" />
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="space-y-3">
          {CONFIGURATOR.additionalServices.map((service) => {
            const isSelected = selectedServices.has(service.id as ServiceId);
            const price = service.prices[selectedPackage as keyof typeof service.prices];

            return (
              <div
                key={service.id}
                className={cn(
                  "relative rounded-xl border-2 transition-all overflow-hidden",
                  isSelected
                    ? "border-[var(--color-apple-blue)] bg-white"
                    : "border-[var(--color-apple-gray-200)] bg-[var(--color-apple-gray-100)]"
                )}
                onMouseEnter={() => setHoveredService(service.id as ServiceId)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <button
                  onClick={() => toggleService(service.id as ServiceId)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-[var(--color-apple-blue)] text-white"
                          : "bg-[var(--color-apple-gray-200)] text-[var(--color-apple-gray-600)]"
                      )}
                    >
                      {serviceIcons[service.id as ServiceId]}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-body font-semibold text-[var(--color-apple-dark)]">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "text-body font-semibold",
                              isSelected ? "text-[var(--color-apple-blue)]" : "text-[var(--color-apple-gray-500)]"
                            )}
                          >
                            {isSelected ? `+${formatPrice(price)}` : formatPrice(price)}
                          </span>
                          <div
                            className={cn(
                              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                              isSelected
                                ? "border-[var(--color-apple-blue)] bg-[var(--color-apple-blue)]"
                                : "border-[var(--color-apple-gray-300)]"
                            )}
                          >
                            {isSelected && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      </div>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">
                        {isSelected ? service.description : service.selfDescription}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div className="sticky bottom-4 z-10">
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-apple-xl border border-[var(--color-apple-gray-200)] p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-display text-[var(--color-apple-dark)]">
                  {formatPrice(totalPrice)}
                </span>
                {savings > 0 && (
                  <span className="text-body text-green-600 font-medium">
                    Sie sparen {formatPrice(savings)}
                  </span>
                )}
              </div>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                {currentPackage.name} ({currentPackage.posts} Posten) • {selectedServices.size} von 5 Zusatzleistungen
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/kontakt"
                className="btn-primary"
              >
                Angebot anfragen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Expandable Details */}
          <div className="mt-6 pt-6 border-t border-[var(--color-apple-gray-200)]">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-body-sm font-medium text-[var(--color-apple-gray-600)] mb-2">
                  ParkourONE übernimmt:
                </p>
                <ul className="space-y-1">
                  {CONFIGURATOR.coreServices.map((service, index) => (
                    <li key={index} className="flex items-center gap-2 text-body-sm text-[var(--color-apple-dark)]">
                      <Check className="h-4 w-4 text-[var(--color-apple-blue)]" />
                      {service}
                    </li>
                  ))}
                  {CONFIGURATOR.additionalServices
                    .filter((s) => selectedServices.has(s.id as ServiceId))
                    .map((service) => (
                      <li key={service.id} className="flex items-center gap-2 text-body-sm text-[var(--color-apple-dark)]">
                        <Check className="h-4 w-4 text-[var(--color-apple-blue)]" />
                        {service.name}
                      </li>
                    ))}
                </ul>
              </div>
              {selectedServices.size < 5 && (
                <div>
                  <p className="text-body-sm font-medium text-[var(--color-apple-gray-600)] mb-2">
                    Sie übernehmen selbst:
                  </p>
                  <ul className="space-y-1">
                    {CONFIGURATOR.additionalServices
                      .filter((s) => !selectedServices.has(s.id as ServiceId))
                      .map((service) => (
                        <li key={service.id} className="flex items-start gap-2 text-body-sm text-[var(--color-apple-gray-600)]">
                          <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{service.selfDescription}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Compact CTA component for use throughout the site
export function ConfiguratorCTA({ variant = "default" }: { variant?: "default" | "minimal" | "card" }) {
  if (variant === "minimal") {
    return (
      <Link
        href="/konfigurator"
        className="inline-flex items-center gap-2 text-[var(--color-apple-blue)] font-medium hover:underline"
      >
        <Sparkles className="h-4 w-4" />
        Projekt konfigurieren
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  if (variant === "card") {
    return (
      <Link
        href="/konfigurator"
        className="block p-6 bg-gradient-to-br from-[var(--color-apple-blue)] to-[var(--color-apple-blue)]/80 rounded-2xl text-white hover:shadow-apple-lg transition-shadow group"
      >
        <Sparkles className="h-8 w-8 mb-4 opacity-80" />
        <h3 className="text-headline mb-2">Projekt konfigurieren</h3>
        <p className="text-body-sm opacity-80 mb-4">
          Stellen Sie Ihr RubikONE zusammen und sehen Sie direkt den Preis.
        </p>
        <span className="inline-flex items-center gap-2 text-body-sm font-medium">
          Zum Konfigurator
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/konfigurator"
      className="inline-flex items-center gap-3 px-6 py-4 bg-[var(--color-apple-gray-100)] rounded-xl hover:bg-[var(--color-apple-gray-200)] transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-[var(--color-apple-blue)] flex items-center justify-center">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-body font-medium text-[var(--color-apple-dark)]">Projekt konfigurieren</p>
        <p className="text-body-sm text-[var(--color-apple-gray-600)]">Preis in 2 Minuten berechnen</p>
      </div>
      <ArrowRight className="h-5 w-5 text-[var(--color-apple-gray-400)] group-hover:text-[var(--color-apple-blue)] group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
