"use client";

import { Building2, GraduationCap, Users } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-8 w-8" />,
  GraduationCap: <GraduationCap className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
};

export function StakeholderGridBlock({ data }: { data: any }) {
  const headline = data?.headline || "";
  const subtitle = data?.subtitle;
  const description = data?.description;
  const items = data?.items || [];

  return (
    <section className="section-spacing">
      <div className="container-content">
        {headline && (
          <SectionHeader
            title={headline}
            subtitle={subtitle}
            description={description}
            align="center"
          />
        )}

        <StaggerContainer className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item: any, index: number) => (
            <StaggerItem key={index}>
              <div className="rounded-2xl bg-[var(--color-apple-gray-100)] p-8">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[var(--color-apple-blue)] shadow-[var(--shadow-apple-sm)]">
                  {iconMap[item?.icon] || <Building2 className="h-8 w-8" />}
                </div>
                <h3 className="text-title-3 mb-3">{item?.title}</h3>
                {item?.description && (
                  <p className="text-body text-[var(--color-apple-gray-600)] mb-4">
                    {item.description}
                  </p>
                )}
                {item?.benefits && item.benefits.length > 0 && (
                  <ul className="space-y-2">
                    {item.benefits.map((benefit: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-body-sm text-[var(--color-apple-gray-700)]"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-apple-blue)]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
