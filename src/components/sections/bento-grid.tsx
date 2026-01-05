"use client";

import { motion } from "framer-motion";
import { LucideIcon, Shield, Clock, Users, Wrench, Puzzle, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";

interface BentoItem {
  title: string;
  description: string;
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface BentoGridProps {
  title?: string;
  subtitle?: string;
  items: BentoItem[];
  className?: string;
}

const sizeClasses = {
  sm: "col-span-1",
  md: "col-span-1 md:col-span-2",
  lg: "col-span-1 md:col-span-2 lg:col-span-2 row-span-2",
};

export function BentoGrid({ title, subtitle, items, className }: BentoGridProps) {
  return (
    <section className={cn("section-spacing", className)}>
      <div className="container-content">
        {(title || subtitle) && (
          <SectionHeader
            title={title || ""}
            subtitle={subtitle}
            className="mb-12 lg:mb-16"
          />
        )}

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={staggerItem}
                className={cn(
                  "card-bento group",
                  sizeClasses[item.size || "sm"],
                  item.className
                )}
              >
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-apple-gray-200)] text-[var(--color-apple-gray-700)] group-hover:bg-[var(--color-apple-blue)] group-hover:text-white transition-colors duration-300">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-headline mb-2">{item.title}</h3>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)] flex-grow">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// Default benefits data for RubikONE
export const defaultBenefits: BentoItem[] = [
  {
    title: "TÜV-zertifiziert",
    description: "Alle Anlagen erfüllen die Sicherheitsnorm DIN EN 16630 und werden regelmässig geprüft.",
    icon: Shield,
    size: "md",
  },
  {
    title: "25 Jahre Lebensdauer",
    description: "Hochwertige Materialien und Verarbeitung für jahrzehntelange Nutzung.",
    icon: Clock,
  },
  {
    title: "Für alle Generationen",
    description: "Übungen für Einsteiger bis Fortgeschrittene, von Jung bis Alt.",
    icon: Users,
  },
  {
    title: "Minimale Wartung",
    description: "Wartungsarme Konstruktion mit jährlichen Kosten von nur CHF 500-800.",
    icon: Wrench,
  },
  {
    title: "Modularer Aufbau",
    description: "Flexible Konfiguration passend zu Ihrem Platzbedarf und Budget.",
    icon: Puzzle,
  },
  {
    title: "Swiss Made",
    description: "Entwickelt und produziert in der Schweiz für Schweizer Ansprüche.",
    icon: Award,
  },
];

// Pre-configured BentoGrid for homepage
export function BenefitsBentoGrid() {
  return (
    <BentoGrid
      title="Warum RubikONE?"
      subtitle="Ihre Vorteile"
      items={defaultBenefits}
    />
  );
}
