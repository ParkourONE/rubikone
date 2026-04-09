/**
 * String -> Lucide icon resolver.
 *
 * Used so manifests/content.json can reference icons by name instead of
 * importing JSX components at author time. Keeps the set small and explicit
 * to avoid shipping every Lucide icon client-side.
 */
import {
  Shield,
  Clock,
  Users,
  Wrench,
  Puzzle,
  Award,
  CheckCircle,
  HelpCircle,
  Building2,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Clock,
  Users,
  Wrench,
  Puzzle,
  Award,
  CheckCircle,
  HelpCircle,
  Building2,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
};

export function iconByName(name: string | undefined | null): LucideIcon | null {
  if (!name) return null;
  return ICON_MAP[name] ?? null;
}

export type IconName = keyof typeof ICON_MAP;
export const KNOWN_ICON_NAMES = Object.keys(ICON_MAP) as IconName[];
