"use client";

import { Check, X, Minus } from "lucide-react";
import { COMPARISON_TABLE } from "@/lib/constants";
import { FadeUp } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

export function ComparisonSection() {
  return (
    <section className="section-spacing bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <SectionHeader
          title={COMPARISON_TABLE.headline}
          subtitle={COMPARISON_TABLE.subheadline}
          align="center"
        />

        <FadeUp delay={0.2}>
          <div className="mt-12 lg:mt-16 overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              {/* Header */}
              <thead>
                <tr>
                  {COMPARISON_TABLE.columns.map((col, index) => (
                    <th
                      key={index}
                      className={cn(
                        "text-left p-4 text-body font-semibold",
                        index === 0 && "w-1/4",
                        index === 3 && "bg-[var(--color-apple-blue)]/10 rounded-t-xl text-[var(--color-apple-blue)]"
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {COMPARISON_TABLE.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-[var(--color-apple-gray-200)]">
                    <td className="p-4 text-body text-[var(--color-apple-dark)] font-medium">
                      {row.label}
                    </td>
                    {row.values.map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn(
                          "p-4 text-body",
                          colIndex === row.highlight
                            ? "bg-[var(--color-apple-blue)]/10 font-semibold text-[var(--color-apple-dark)]"
                            : "text-[var(--color-apple-gray-600)]",
                          rowIndex === COMPARISON_TABLE.rows.length - 1 && colIndex === row.highlight && "rounded-b-xl"
                        )}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
