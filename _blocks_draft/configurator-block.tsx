"use client";

import { useState } from "react";
import { ConfiguratorOverlay, ConfiguratorTrigger } from "@/components/sections/configurator-overlay";
import { FadeUp } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";

export function ConfiguratorBlock({ data }: { data: any }) {
  const headline = data?.headline;
  const subheadline = data?.subheadline;
  const variant = data?.variant || "card";

  return (
    <section className="section-spacing">
      <div className="container-content">
        {headline && (
          <SectionHeader
            title={headline}
            description={subheadline}
            align="center"
          />
        )}

        <FadeUp>
          <div className="mt-8 flex justify-center">
            <ConfiguratorTrigger variant={variant} className="max-w-md" />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
