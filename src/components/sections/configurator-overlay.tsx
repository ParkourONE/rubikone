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
  AlertCircle,
  Mail,
  Phone,
  CheckCircle
} from "lucide-react";
import { CONFIGURATOR, CONFIGURATOR_UI } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

type PackageId = "kompakt" | "standard" | "premium";
type ServiceId = "impulsworkshop" | "vorprojekt" | "baugesuch" | "eroeffnungsevent";

const serviceIcons: Record<ServiceId, React.ReactNode> = {
  impulsworkshop: <Users className="h-4 w-4" />,
  vorprojekt: <Palette className="h-4 w-4" />,
  baugesuch: <FileText className="h-4 w-4" />,
  eroeffnungsevent: <Sparkles className="h-4 w-4" />,
};

const coreServiceIcons = [
  <Palette key="design" className="h-4 w-4" />,
  <MapPin key="standort" className="h-4 w-4" />,
  <Box key="material" className="h-4 w-4" />,
];

const stepImages = [
  "/images/hero/oma-enkelin.jpg",
  "/images/workshop/frauen-balancieren.jpg",
  "/images/koeniz/schulklasse.jpg",
  "/images/hero/generationen-kraft.jpg",
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
  const ui = useContent("CONFIGURATOR_UI", CONFIGURATOR_UI);
  const edit = {
    step1Title: useEditPath("CONFIGURATOR_UI.step1Title"),
    step1Hint: useEditPath("CONFIGURATOR_UI.step1Hint"),
    coreServicesLabel: useEditPath("CONFIGURATOR_UI.coreServicesLabel"),
    step2Title: useEditPath("CONFIGURATOR_UI.step2Title"),
    step2Hint: useEditPath("CONFIGURATOR_UI.step2Hint"),
    step3Title: useEditPath("CONFIGURATOR_UI.step3Title"),
    summaryIncludesLabel: useEditPath("CONFIGURATOR_UI.summaryIncludesLabel"),
    step4Title: useEditPath("CONFIGURATOR_UI.step4Title"),
    step4Hint: useEditPath("CONFIGURATOR_UI.step4Hint"),
    formNameLabel: useEditPath("CONFIGURATOR_UI.formNameLabel"),
    formEmailLabel: useEditPath("CONFIGURATOR_UI.formEmailLabel"),
    formOrgTypeLabel: useEditPath("CONFIGURATOR_UI.formOrgTypeLabel"),
    formOrgNameLabel: useEditPath("CONFIGURATOR_UI.formOrgNameLabel"),
    formOrgSizeLabel: useEditPath("CONFIGURATOR_UI.formOrgSizeLabel"),
    formConsultationLabel: useEditPath("CONFIGURATOR_UI.formConsultationLabel"),
    formMessageLabel: useEditPath("CONFIGURATOR_UI.formMessageLabel"),
    successTitle: useEditPath("CONFIGURATOR_UI.successTitle"),
    successMessage: useEditPath("CONFIGURATOR_UI.successMessage"),
    successNextStepLabel: useEditPath("CONFIGURATOR_UI.successNextStepLabel"),
    successNextStepHint: useEditPath("CONFIGURATOR_UI.successNextStepHint"),
    successContactLabel: useEditPath("CONFIGURATOR_UI.successContactLabel"),
    buttonClose: useEditPath("CONFIGURATOR_UI.buttonClose"),
    buttonBack: useEditPath("CONFIGURATOR_UI.buttonBack"),
    buttonNext: useEditPath("CONFIGURATOR_UI.buttonNext"),
    buttonGoToSummary: useEditPath("CONFIGURATOR_UI.buttonGoToSummary"),
    buttonSubmit: useEditPath("CONFIGURATOR_UI.buttonSubmit"),
  };
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("standard");
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(
    new Set([])
  );
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [orgType, setOrgType] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [wantsConsultation, setWantsConsultation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      setTimeout(() => {
        setStep(1);
        setIsSubmitted(false);
        setContactName("");
        setEmail("");
        setOrgType("");
        setOrgName("");
        setOrgSize("");
        setWantsConsultation("");
        setMessage("");
        setSubmitError(null);
      }, 300);
    }
  }, [isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit = contactName && email && orgType && orgName && orgSize;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Build services list with prices
      const selectedServicesList = CONFIGURATOR.additionalServices
        .filter((s) => selectedServices.has(s.id as ServiceId))
        .map((s) => ({
          name: s.name,
          price: s.prices[selectedPackage as keyof typeof s.prices],
        }));

      const response = await fetch('/api/configurator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName,
          email,
          orgType,
          orgName,
          orgSize,
          wantsConsultation,
          message,
          paket: {
            name: currentPackage.name,
            posts: currentPackage.posts,
            basePrice: currentPackage.basePrice,
          },
          services: selectedServicesList,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || ui.errorSendFailed);
      }

      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : ui.errorDefault);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    <h2 className="text-title-3 text-[var(--color-apple-dark)] text-center mb-1" {...edit.step1Title}>
                      {ui.step1Title}
                    </h2>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)] text-center mb-4" {...edit.step1Hint}>
                      {ui.step1Hint}
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
                              {ui.packageRecommendedBadge}
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
                            {ui.packagePostsLabel}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-[var(--color-apple-gray-100)] rounded-xl">
                      <p className="text-caption font-medium text-[var(--color-apple-gray-600)] mb-2" {...edit.coreServicesLabel}>
                        {ui.coreServicesLabel}
                      </p>
                      <div className="space-y-1.5">
                        {CONFIGURATOR.coreServices.map((service, index) => (
                          <div key={index} className="flex items-center gap-2 text-caption">
                            <span className="text-[var(--color-apple-gray-500)]">
                              {coreServiceIcons[index]}
                            </span>
                            <span className="text-[var(--color-apple-dark)] font-medium">{service.name}</span>
                            <span className="text-[var(--color-apple-gray-400)]">–</span>
                            <span className="text-[var(--color-apple-gray-500)]">{service.info}</span>
                          </div>
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
                    <h2 className="text-title-3 text-[var(--color-apple-dark)] text-center mb-1" {...edit.step2Title}>
                      {ui.step2Title}
                    </h2>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)] text-center mb-4" {...edit.step2Hint}>
                      {ui.step2Hint}
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
                              <p className="text-body-sm text-[var(--color-apple-dark)]">
                                <span className="font-semibold">{service.name}</span>
                                {'info' in service && service.info && (
                                  <>
                                    <span className="text-[var(--color-apple-gray-400)]"> – </span>
                                    <span className="text-[var(--color-apple-gray-500)] font-normal">{service.info as string}</span>
                                  </>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
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
                    <h2 className="text-title-3 text-[var(--color-apple-dark)] text-center mb-4" {...edit.step3Title}>
                      {ui.step3Title}
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
                            {currentPackage.posts} {ui.summaryPostsLabel}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-caption font-medium text-[var(--color-apple-gray-600)] mb-2" {...edit.summaryIncludesLabel}>
                        {ui.summaryIncludesLabel}
                      </p>
                      <div className="space-y-1.5">
                        {CONFIGURATOR.coreServices.map((service, index) => (
                          <div key={index} className="flex items-center gap-2 text-body-sm">
                            <span className="text-[var(--color-apple-gray-500)]">{coreServiceIcons[index]}</span>
                            <span className="text-[var(--color-apple-dark)]">{service.name}</span>
                          </div>
                        ))}
                        {CONFIGURATOR.additionalServices
                          .filter((s) => selectedServices.has(s.id as ServiceId))
                          .map((service) => (
                            <div key={service.id} className="flex items-center gap-2 text-body-sm">
                              <span className="text-[var(--color-apple-gray-500)]">{serviceIcons[service.id as ServiceId]}</span>
                              <span className="text-[var(--color-apple-dark)]">{service.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* Step 4: Contact Form */}
                {step === 4 && !isSubmitted && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-title-3 text-[var(--color-apple-dark)] text-center mb-1" {...edit.step4Title}>
                      {ui.step4Title}
                    </h2>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)] text-center mb-6" {...edit.step4Hint}>
                      {ui.step4Hint}
                    </p>

                    {submitError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p className="text-body-sm">{submitError}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-body-sm font-medium text-[var(--color-apple-dark)] mb-2" {...edit.formNameLabel}>
                          {ui.formNameLabel}
                        </label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder={ui.formNamePlaceholder}
                          className="w-full px-4 py-3 bg-[var(--color-apple-gray-100)] rounded-xl text-body text-[var(--color-apple-dark)] placeholder:text-[var(--color-apple-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-dark)]"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-body-sm font-medium text-[var(--color-apple-dark)] mb-2" {...edit.formEmailLabel}>
                          {ui.formEmailLabel}
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={ui.formEmailPlaceholder}
                          className="w-full px-4 py-3 bg-[var(--color-apple-gray-100)] rounded-xl text-body text-[var(--color-apple-dark)] placeholder:text-[var(--color-apple-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-dark)]"
                          required
                        />
                      </div>

                      {/* Organisationseinheit */}
                      <div>
                        <label className="block text-body-sm font-medium text-[var(--color-apple-dark)] mb-2" {...edit.formOrgTypeLabel}>
                          {ui.formOrgTypeLabel}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Gemeinde", "Stadt", "Non-Profit Organisation", "Privates Unternehmen", "Bildungseinrichtung", "anderes"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setOrgType(option)}
                              className={cn(
                                "px-3 py-2.5 rounded-xl text-body-sm text-left transition-all",
                                orgType === option
                                  ? "bg-[var(--color-apple-dark)] text-white"
                                  : "bg-[var(--color-apple-gray-100)] text-[var(--color-apple-dark)] hover:bg-[var(--color-apple-gray-200)]"
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bezeichnung */}
                      <div>
                        <label className="block text-body-sm font-medium text-[var(--color-apple-dark)] mb-2" {...edit.formOrgNameLabel}>
                          {ui.formOrgNameLabel}
                        </label>
                        <input
                          type="text"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder={ui.formOrgNamePlaceholder}
                          className="w-full px-4 py-3 bg-[var(--color-apple-gray-100)] rounded-xl text-body text-[var(--color-apple-dark)] placeholder:text-[var(--color-apple-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-dark)]"
                          required
                        />
                      </div>

                      {/* Grösse */}
                      <div>
                        <label className="block text-body-sm font-medium text-[var(--color-apple-dark)] mb-2" {...edit.formOrgSizeLabel}>
                          {ui.formOrgSizeLabel}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["klein", "mittel", "gross"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setOrgSize(option)}
                              className={cn(
                                "px-3 py-2.5 rounded-xl text-body-sm text-center transition-all capitalize",
                                orgSize === option
                                  ? "bg-[var(--color-apple-dark)] text-white"
                                  : "bg-[var(--color-apple-gray-100)] text-[var(--color-apple-dark)] hover:bg-[var(--color-apple-gray-200)]"
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Beratungsgespräch */}
                      <div>
                        <label className="block text-body-sm font-medium text-[var(--color-apple-dark)] mb-2" {...edit.formConsultationLabel}>
                          {ui.formConsultationLabel}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["ja", "nein", "weiss noch nicht"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setWantsConsultation(option)}
                              className={cn(
                                "px-3 py-2.5 rounded-xl text-body-sm text-center transition-all",
                                wantsConsultation === option
                                  ? "bg-[var(--color-apple-dark)] text-white"
                                  : "bg-[var(--color-apple-gray-100)] text-[var(--color-apple-dark)] hover:bg-[var(--color-apple-gray-200)]"
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Anliegen / Fragen */}
                      <div>
                        <label className="block text-body-sm font-medium text-[var(--color-apple-dark)] mb-2" {...edit.formMessageLabel}>
                          {ui.formMessageLabel}
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-[var(--color-apple-gray-100)] rounded-xl text-body text-[var(--color-apple-dark)] placeholder:text-[var(--color-apple-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-dark)] resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Success State */}
                {step === 4 && isSubmitted && (
                  <motion.div
                    key="step4-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-title-3 text-[var(--color-apple-dark)] mb-2" {...edit.successTitle}>
                      {ui.successTitle}
                    </h2>
                    <p className="text-body text-[var(--color-apple-gray-600)] mb-6" {...edit.successMessage}>
                      {ui.successMessage}
                    </p>

                    <div className="space-y-3">
                      <Link
                        href="/impulsworkshop"
                        onClick={onClose}
                        className="flex items-center gap-3 p-4 bg-[var(--color-apple-dark)] text-white rounded-xl hover:bg-black transition-colors"
                      >
                        <ArrowRight className="h-5 w-5" />
                        <div className="text-left">
                          <p className="text-body-sm font-medium" {...edit.successNextStepLabel}>{ui.successNextStepLabel}</p>
                          <p className="text-caption opacity-70" {...edit.successNextStepHint}>{ui.successNextStepHint}</p>
                        </div>
                      </Link>

                      <div className="p-4 bg-[var(--color-apple-gray-100)] rounded-xl text-left">
                        <p className="text-caption font-medium text-[var(--color-apple-gray-600)] mb-2" {...edit.successContactLabel}>{ui.successContactLabel}</p>
                        <div className="space-y-1">
                          <p className="text-body-sm text-[var(--color-apple-dark)] flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[var(--color-apple-gray-500)]" />
                            info@rubikone.ch
                          </p>
                          <p className="text-body-sm text-[var(--color-apple-dark)] flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[var(--color-apple-gray-500)]" />
                            +41 31 971 28 27
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 pt-6 pb-8 border-t border-[var(--color-apple-gray-200)] rounded-b-3xl">
                {step === 4 && isSubmitted ? (
                  <button
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-apple-dark)] text-white rounded-full font-medium hover:bg-black transition-colors"
                    {...edit.buttonClose}
                  >
                    {ui.buttonClose}
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-caption text-[var(--color-apple-gray-600)]">{currentPackage.name} ({currentPackage.posts} {ui.packagePostsLabel})</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {step > 1 && (
                        <button
                          onClick={() => {
                            // Reset services when going back to step 1
                            if (step === 2) {
                              setSelectedServices(new Set([]));
                            }
                            setStep(step - 1);
                          }}
                          className="flex items-center gap-1 text-body-sm font-medium text-[var(--color-apple-gray-600)] hover:text-[var(--color-apple-dark)] transition-colors"
                          {...edit.buttonBack}
                        >
                          <ArrowLeft className="h-4 w-4" />
                          {ui.buttonBack}
                        </button>
                      )}

                      {step < 3 ? (
                        <button
                          onClick={() => setStep(step + 1)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-apple-dark)] text-white rounded-full font-medium hover:bg-black transition-colors"
                          {...edit.buttonNext}
                        >
                          {ui.buttonNext}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : step === 3 ? (
                        <button
                          onClick={() => setStep(4)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-apple-dark)] text-white rounded-full font-medium hover:bg-black transition-colors"
                          {...edit.buttonGoToSummary}
                        >
                          {ui.buttonGoToSummary}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={!canSubmit || isSubmitting}
                          className={cn(
                            "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors",
                            canSubmit && !isSubmitting
                              ? "bg-[var(--color-apple-dark)] text-white hover:bg-black"
                              : "bg-[var(--color-apple-gray-200)] text-[var(--color-apple-gray-500)] cursor-not-allowed"
                          )}
                        >
                          {isSubmitting ? ui.buttonSubmitting : ui.buttonSubmit}
                          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                )}
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
  const ui = useContent("CONFIGURATOR_UI", CONFIGURATOR_UI);
  const editCardTitle = useEditPath("CONFIGURATOR_UI.triggerCardTitle");
  const editCardHint = useEditPath("CONFIGURATOR_UI.triggerCardHint");
  const editCardCta = useEditPath("CONFIGURATOR_UI.triggerCardCta");
  const editTriggerBtn = useEditPath("CONFIGURATOR_UI.triggerButtonLabel");

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
          <h3 className="text-headline font-semibold mb-1" {...editCardTitle}>{ui.triggerCardTitle}</h3>
          <p className="text-body-sm opacity-80 mb-4" {...editCardHint}>
            {ui.triggerCardHint}
          </p>
          <span className="inline-flex items-center gap-2 text-body-sm font-semibold" {...editCardCta}>
            {ui.triggerCardCta}
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
          {ui.triggerButtonLabel}
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
        Leistungspaket konfigurieren
      </button>
      <ConfiguratorOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
