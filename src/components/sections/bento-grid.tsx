"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";
import { iconByName } from "@/lib/lucide-by-name";
import { useContent } from "@/hooks/useContent";
import { BENTO_GRID_DEFAULTS } from "@/lib/constants";
import { useEditPath } from "@/components/cms/primitives";

export interface BentoItem {
  _id?: string;
  title: string;
  description: string;
  /** Lucide icon name, resolved via `iconByName`. */
  icon: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface BentoGridProps {
  title?: string;
  subtitle?: string;
  items?: BentoItem[];
  className?: string;
  /** Dotted path root used to wire inline edit handles (e.g. BENTO_GRID_DEFAULTS). */
  editPathRoot?: string;
}

const sizeClasses = {
  sm: "col-span-1",
  md: "col-span-1 md:col-span-2",
  lg: "col-span-1 md:col-span-2 lg:col-span-2 row-span-2",
};

function BentoCard({
  item,
  index,
  editPathRoot,
}: {
  item: BentoItem;
  index: number;
  editPathRoot?: string;
}) {
  const basePath = editPathRoot ? `${editPathRoot}[${index}]` : undefined;
  const itemEdit = useEditPath(basePath);
  const titleEdit = useEditPath(basePath ? `${basePath}.title` : undefined);
  const descEdit = useEditPath(basePath ? `${basePath}.description` : undefined);
  const Icon = iconByName(item.icon);
  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        "card-bento group",
        sizeClasses[item.size || "sm"],
        item.className
      )}
      {...itemEdit}
    >
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-apple-gray-200)] text-[var(--color-apple-gray-700)] group-hover:bg-[var(--color-apple-blue)] group-hover:text-white transition-colors duration-300">
            {Icon ? <Icon className="h-6 w-6" strokeWidth={1.5} /> : null}
          </div>
        </div>
        {item.title && (
          <h3 className="text-headline mb-2" {...titleEdit}>
            {item.title}
          </h3>
        )}
        {item.description && (
          <p
            className="text-body-sm text-[var(--color-apple-gray-600)] flex-grow"
            {...descEdit}
          >
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function BentoGrid({
  title,
  subtitle,
  items,
  className,
  editPathRoot,
}: BentoGridProps) {
  const list = items ?? [];
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
          {...useEditPath(editPathRoot)}
        >
          {list.map((item, index) => (
            <BentoCard
              key={item._id ?? index}
              item={item}
              index={index}
              editPathRoot={editPathRoot}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Pre-configured BentoGrid for homepage — content-driven via content.json.
export function BenefitsBentoGrid() {
  const items = useContent("BENTO_GRID_DEFAULTS", BENTO_GRID_DEFAULTS);
  return (
    <BentoGrid
      title="Warum RubikONE?"
      subtitle="Ihre Vorteile"
      items={items as BentoItem[]}
      editPathRoot="BENTO_GRID_DEFAULTS"
    />
  );
}
