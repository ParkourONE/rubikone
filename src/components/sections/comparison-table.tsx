"use client";

import { Map, Construction, Users, FlaskConical, Wrench, Puzzle } from "lucide-react";
import { COMPARISON_TABLE } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { useEditPath } from "@/components/cms/primitives";

const iconMap: Record<string, React.ReactNode> = {
  map: <Map className="h-6 w-6" />,
  construction: <Construction className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  science: <FlaskConical className="h-6 w-6" />,
  tools: <Wrench className="h-6 w-6" />,
  puzzle: <Puzzle className="h-6 w-6" />,
};

interface ComparisonFeature {
  icon?: string;
  label?: string;
  description?: string;
}

function ComparisonFeatureCard({ feature, index }: { feature: ComparisonFeature; index: number }) {
  const path = `COMPARISON_TABLE.features[${index}]`;
  const itemEdit = useEditPath(path);
  const labelEdit = useEditPath(`${path}.label`);
  const descEdit = useEditPath(`${path}.description`);
  return (
    <StaggerItem>
      <div className="bg-white rounded-2xl p-6 shadow-apple h-full" {...itemEdit}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-apple-blue)]/10 text-[var(--color-apple-blue)] mb-4">
          {feature.icon && iconMap[feature.icon]}
        </div>
        {feature.label && (
          <h3 className="text-headline text-[var(--color-apple-dark)] mb-2" {...labelEdit}>
            {feature.label}
          </h3>
        )}
        {feature.description && (
          <p className="text-body text-[var(--color-apple-gray-600)]" {...descEdit}>
            {feature.description}
          </p>
        )}
      </div>
    </StaggerItem>
  );
}

export function ComparisonSection() {
  const comparisonTable = useContent("COMPARISON_TABLE", COMPARISON_TABLE);
  const headlineEdit = useEditPath("COMPARISON_TABLE.headline");
  const subheadlineEdit = useEditPath("COMPARISON_TABLE.subheadline");
  return (
    <section className="section-spacing bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <SectionHeader
          title={comparisonTable.headline}
          subtitle={comparisonTable.subheadline}
          align="center"
          titleProps={headlineEdit}
          subtitleProps={subheadlineEdit}
        />

        <StaggerContainer
          className="mt-12 lg:mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          {...useEditPath("COMPARISON_TABLE.features")}
        >
          {comparisonTable.features.map((feature, index) => (
            <ComparisonFeatureCard key={index} feature={feature} index={index} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
