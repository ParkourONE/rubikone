import { cn } from "@/lib/utils";
import { ImageIcon, Package, Users, Building2, MapPin, LucideIcon } from "lucide-react";

type PlaceholderType = "product" | "team" | "reference" | "location" | "generic";

interface PlaceholderImageProps {
  type?: PlaceholderType;
  label?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  className?: string;
  iconClassName?: string;
}

const typeIcons: Record<PlaceholderType, LucideIcon> = {
  product: Package,
  team: Users,
  reference: Building2,
  location: MapPin,
  generic: ImageIcon,
};

const aspectRatioClasses: Record<string, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[2/1]",
};

export function PlaceholderImage({
  type = "generic",
  label,
  aspectRatio = "video",
  className,
  iconClassName,
}: PlaceholderImageProps) {
  const Icon = typeIcons[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-apple-lg)] bg-[var(--color-apple-gray-100)]",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      <Icon
        className={cn(
          "h-12 w-12 text-[var(--color-apple-gray-400)]",
          iconClassName
        )}
        strokeWidth={1.5}
      />
      {label && (
        <span className="mt-3 text-caption text-[var(--color-apple-gray-500)]">
          {label}
        </span>
      )}
    </div>
  );
}

// Logo Placeholder (circular)
interface LogoPlaceholderProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const logoSizes = {
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-sm",
  lg: "h-20 w-20 text-base",
};

export function LogoPlaceholder({
  name,
  size = "md",
  className,
}: LogoPlaceholderProps) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[var(--color-apple-gray-200)] font-medium text-[var(--color-apple-gray-600)]",
        logoSizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

// Avatar Placeholder (for team members)
interface AvatarPlaceholderProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const avatarSizes = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-lg",
  lg: "h-24 w-24 text-2xl",
  xl: "h-32 w-32 text-3xl",
};

export function AvatarPlaceholder({
  name,
  size = "md",
  className,
}: AvatarPlaceholderProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[var(--color-apple-gray-200)] font-semibold text-[var(--color-apple-gray-600)]",
        avatarSizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
