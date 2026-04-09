import { cn } from "@/lib/utils";
import { FadeUp } from "./fade-up";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  animated?: boolean;
  titleProps?: Record<string, string>;
  subtitleProps?: Record<string, string>;
  descriptionProps?: Record<string, string>;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = "center",
  className,
  titleClassName,
  animated = true,
  titleProps,
  subtitleProps,
  descriptionProps,
}: SectionHeaderProps) {
  const content = (
    <div
      className={cn(
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {subtitle && (
        <p
          className="text-body-sm font-medium uppercase tracking-wider text-[var(--color-apple-blue)] mb-3"
          {...subtitleProps}
        >
          {subtitle}
        </p>
      )}
      <h2 className={cn("text-title-1", titleClassName)} {...titleProps}>
        {title}
      </h2>
      {description && (
        <p
          className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]"
          {...descriptionProps}
        >
          {description}
        </p>
      )}
    </div>
  );

  if (animated) {
    return <FadeUp>{content}</FadeUp>;
  }

  return content;
}

// Smaller section header for sub-sections
interface SubsectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  animated?: boolean;
}

export function SubsectionHeader({
  title,
  description,
  className,
  animated = true,
}: SubsectionHeaderProps) {
  const content = (
    <div className={cn("max-w-2xl", className)}>
      <h3 className="text-title-3">{title}</h3>
      {description && (
        <p className="mt-2 text-body text-[var(--color-apple-gray-600)]">
          {description}
        </p>
      )}
    </div>
  );

  if (animated) {
    return <FadeUp>{content}</FadeUp>;
  }

  return content;
}
