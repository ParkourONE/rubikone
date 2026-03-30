"use client";

import {
  Clock,
  Users,
  MapPin,
  Sun,
  Mail,
  Phone,
  Banknote,
  Building2,
} from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Clock: <Clock className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  MapPin: <MapPin className="h-6 w-6" />,
  Sun: <Sun className="h-6 w-6" />,
  Mail: <Mail className="h-6 w-6" />,
  Phone: <Phone className="h-6 w-6" />,
  Banknote: <Banknote className="h-6 w-6" />,
  Building2: <Building2 className="h-6 w-6" />,
};

export function KeyFactsBlock({ data }: { data: any }) {
  const headline = data?.headline;
  const subtitle = data?.subtitle;
  const items = data?.items || [];
  const columns = data?.columns || 3;

  const gridCols: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className="section-spacing">
      <div className="container-content">
        {headline && (
          <SectionHeader
            title={headline}
            subtitle={subtitle}
            align="center"
          />
        )}

        <StaggerContainer
          className={cn(
            "mt-12 grid gap-6",
            gridCols[columns] || gridCols[3]
          )}
        >
          {items.map((item: any, index: number) => (
            <StaggerItem key={index}>
              <div className="flex flex-col items-center text-center rounded-2xl bg-[var(--color-apple-gray-100)] p-6">
                {item?.icon && iconMap[item.icon] && (
                  <div className="mb-3 text-[var(--color-apple-blue)]">
                    {iconMap[item.icon]}
                  </div>
                )}
                <p className="text-display font-bold text-[var(--color-apple-dark)]">
                  {item?.value}
                </p>
                <p className="mt-1 text-body-sm text-[var(--color-apple-gray-600)]">
                  {item?.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
