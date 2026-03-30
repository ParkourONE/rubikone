"use client";

import Image from "next/image";
import { FadeUp } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

export function TimelineBlock({ data }: { data: any }) {
  const headline = data?.headline;
  const subtitle = data?.subtitle;
  const items = data?.items || [];

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

        <div className="relative mt-12">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-apple-gray-200)] md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {items.map((item: any, index: number) => {
              const isEven = index % 2 === 0;

              return (
                <FadeUp key={index} delay={index * 0.1}>
                  <div
                    className={cn(
                      "relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start",
                      !isEven && "md:direction-rtl"
                    )}
                  >
                    {/* Year badge on the line */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center justify-center h-8 min-w-[3.5rem] px-3 rounded-full bg-[var(--color-apple-blue)] text-white text-body-sm font-semibold">
                        {item?.year}
                      </span>
                    </div>

                    {/* Content - left side on desktop (or right when alternating) */}
                    <div
                      className={cn(
                        "pl-12 md:pl-0",
                        isEven
                          ? "md:pr-12 md:text-right"
                          : "md:col-start-2 md:pl-12"
                      )}
                    >
                      <div className="pt-10 md:pt-0">
                        <h3 className="text-title-3 text-[var(--color-apple-dark)]">
                          {item?.title}
                        </h3>
                        {item?.description && (
                          <p className="mt-2 text-body text-[var(--color-apple-gray-600)]">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Image - right side on desktop (or left when alternating) */}
                    {item?.image && (
                      <div
                        className={cn(
                          "pl-12 md:pl-0",
                          isEven
                            ? "md:col-start-2 md:pl-12"
                            : "md:col-start-1 md:row-start-1 md:pr-12"
                        )}
                      >
                        <div className="relative aspect-video overflow-hidden rounded-xl">
                          <Image
                            src={item.image}
                            alt={item?.title || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
