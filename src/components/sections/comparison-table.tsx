"use client";

import { Map, Construction, Users, FlaskConical, Wrench, Puzzle } from "lucide-react";
import { COMPARISON_TABLE } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";

const iconMap: Record<string, React.ReactNode> = {
  map: <Map className="h-6 w-6" />,
  construction: <Construction className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  science: <FlaskConical className="h-6 w-6" />,
  tools: <Wrench className="h-6 w-6" />,
  puzzle: <Puzzle className="h-6 w-6" />,
};

export function ComparisonSection() {
  const comparisonTable = useContent("COMPARISON_TABLE", COMPARISON_TABLE);
  return (
    <section className="section-spacing bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <SectionHeader
          title={comparisonTable.headline}
          subtitle={comparisonTable.subheadline}
          align="center"
        />

        <StaggerContainer className="mt-12 lg:mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {comparisonTable.features.map((feature, index) => (
            <StaggerItem key={index}>
              <div className="bg-white rounded-2xl p-6 shadow-apple h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-apple-blue)]/10 text-[var(--color-apple-blue)] mb-4">
                  {iconMap[feature.icon]}
                </div>
                <h3 className="text-headline text-[var(--color-apple-dark)] mb-2">
                  {feature.label}
                </h3>
                <p className="text-body text-[var(--color-apple-gray-600)]">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
