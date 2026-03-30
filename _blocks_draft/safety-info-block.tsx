"use client";

import { ShieldCheck } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";

export function SafetyInfoBlock({ data }: { data: any }) {
  const headline = data?.headline || "Sicherheit & Normen";
  const description = data?.description;
  const norms = data?.norms || [];

  return (
    <section className="section-spacing bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <SectionHeader
          title={headline}
          description={description}
          align="center"
        />

        <StaggerContainer className="mt-12 flex flex-wrap justify-center gap-4">
          {norms.map((norm: any, index: number) => (
            <StaggerItem key={index}>
              <div className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[var(--shadow-apple-sm)]">
                <ShieldCheck className="h-5 w-5 flex-shrink-0 text-[var(--color-apple-blue)]" />
                <div className="text-left">
                  {norm?.code && (
                    <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
                      {norm.code}
                    </p>
                  )}
                  {norm?.name && (
                    <p className="text-caption text-[var(--color-apple-gray-600)]">
                      {norm.name}
                    </p>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
