"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { PRICING_PACKAGES, IMPULSWORKSHOP } from "@/lib/constants";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section className="section-spacing bg-[var(--color-apple-gray-100)]">
      <div className="container-wide">
        <SectionHeader
          title="Transparente Preise"
          subtitle="Wählen Sie das passende Paket für Ihre Gemeinde"
          align="center"
        />

        <StaggerContainer className="mt-12 lg:mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
          {PRICING_PACKAGES.map((pkg, index) => (
            <StaggerItem key={index}>
              <div
                className={cn(
                  "relative bg-white rounded-2xl p-8 h-full flex flex-col",
                  pkg.highlighted
                    ? "ring-2 ring-[var(--color-apple-blue)] shadow-apple-lg"
                    : "shadow-apple"
                )}
              >
                {/* Badge */}
                {pkg.highlighted && pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-[var(--color-apple-blue)] text-white text-caption font-medium rounded-full">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="text-center pb-6 border-b border-[var(--color-apple-gray-200)]">
                  <h3 className="text-headline text-[var(--color-apple-dark)]">
                    {pkg.name}
                  </h3>
                  <p className="text-body text-[var(--color-apple-blue)] font-semibold mt-1">
                    {pkg.posts}
                  </p>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-2">
                    {pkg.idealFor}
                  </p>
                  <p className="text-title-2 font-bold text-[var(--color-apple-dark)] mt-4">
                    {pkg.price}
                  </p>
                </div>

                {/* Features */}
                <ul className="py-6 space-y-3 flex-grow">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-[var(--color-apple-gray-400)] flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-body-sm",
                          feature.included
                            ? "text-[var(--color-apple-dark)]"
                            : "text-[var(--color-apple-gray-400)]"
                        )}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/konfigurator"
                  className={cn(
                    "w-full text-center py-3 rounded-full font-medium transition-all",
                    pkg.highlighted
                      ? "btn-primary"
                      : "btn-outline"
                  )}
                >
                  Anfragen
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Impulsworkshop Add-on */}
        <FadeUp delay={0.4}>
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-apple text-center">
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
                Add-on
              </p>
              <h3 className="text-headline text-[var(--color-apple-dark)]">
                Impulsworkshop separat buchbar
              </h3>
              <p className="text-body text-[var(--color-apple-gray-600)] mt-2">
                Der perfekte Einstieg: Erleben Sie RubikONE vor Ort.
              </p>
              <p className="text-title-3 font-bold text-[var(--color-apple-dark)] mt-4">
                {IMPULSWORKSHOP.price}
                <span className="text-body font-normal text-[var(--color-apple-gray-500)] ml-2">
                  | {IMPULSWORKSHOP.duration} | {IMPULSWORKSHOP.participants}
                </span>
              </p>
              <Link href="/impulsworkshop" className="btn-secondary mt-6 inline-flex">
                Workshop buchen
              </Link>
            </div>
          </div>
        </FadeUp>

        {/* Fördermittel Hinweis */}
        <FadeUp delay={0.5}>
          <p className="mt-8 text-center text-body-sm text-[var(--color-apple-gray-600)]">
            Viele Kantone fördern Bewegungsinfrastruktur über Sportfonds und Lotteriefonds.
            <br />
            Wir unterstützen Sie bei der Antragstellung.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
