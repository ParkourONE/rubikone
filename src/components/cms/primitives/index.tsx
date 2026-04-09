"use client";

/**
 * CMS primitives.
 *
 * Reusable render components that can be sprinkled into section
 * components. Each primitive:
 *
 *  - Accepts the concrete content value as a prop (so public pages just
 *    pass values straight from the imported constants — zero overhead).
 *  - Accepts an optional `editPath` (dot/bracket path into content.json).
 *    When in edit mode the root DOM node gets `data-edit-path="<path>"`
 *    so Phase 4's overlay scanner can hook into it.
 *  - Has NO admin/provider coupling at import time — they only read
 *    `useEditMode()` which tolerates the absence of a provider via its
 *    default value.
 */

import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { forwardRef, type ElementType, type ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import { useEditMode } from "@/components/cms/edit-mode-context";

// ------------------------------------------------------------------
// Shared
// ------------------------------------------------------------------

/** Returns the `data-edit-path` attribute object (or empty) based on mode. */
function useEditAttrs(editPath?: string): Record<string, string> {
  const { editMode } = useEditMode();
  if (!editMode || !editPath) return {};
  return { "data-edit-path": editPath };
}

// ------------------------------------------------------------------
// CmsText — inline span/p text
// ------------------------------------------------------------------

export interface CmsTextProps {
  value: string;
  as?: ElementType;
  className?: string;
  editPath?: string;
  children?: ReactNode; // optional fallback when value is empty
}

export function CmsText({
  value,
  as: Tag = "span",
  className,
  editPath,
  children,
}: CmsTextProps) {
  const editAttrs = useEditAttrs(editPath);
  const content = value || children;
  return (
    <Tag className={className} {...editAttrs}>
      {content}
    </Tag>
  );
}

// ------------------------------------------------------------------
// CmsHeading — h1 / h2 / h3 / h4
// ------------------------------------------------------------------

export interface CmsHeadingProps {
  value: string;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  editPath?: string;
}

export function CmsHeading({
  value,
  level = 2,
  className,
  editPath,
}: CmsHeadingProps) {
  const Tag = `h${level}` as ElementType;
  const editAttrs = useEditAttrs(editPath);
  return (
    <Tag className={className} {...editAttrs}>
      {value}
    </Tag>
  );
}

// ------------------------------------------------------------------
// CmsImage — next/image or raw <img>
// ------------------------------------------------------------------

export interface CmsImageProps extends Omit<ImageProps, "alt" | "src"> {
  src: string;
  alt: string;
  editPath?: string;
  rawImg?: boolean;
}

export const CmsImage = forwardRef<HTMLImageElement, CmsImageProps>(
  function CmsImage({ src, alt, editPath, rawImg, className, ...rest }, ref) {
    const editAttrs = useEditAttrs(editPath);
    if (rawImg) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={className}
          {...editAttrs}
        />
      );
    }
    return (
      <Image
        {...(rest as ImageProps)}
        src={src}
        alt={alt}
        className={className}
        {...editAttrs}
      />
    );
  }
);

// ------------------------------------------------------------------
// CmsButton — renders an <a> with button styling
// ------------------------------------------------------------------

export interface CmsButtonData {
  label: string;
  href: string;
}

export interface CmsButtonProps {
  button: CmsButtonData;
  className?: string;
  editPath?: string;
}

export function CmsButton({ button, className, editPath }: CmsButtonProps) {
  const editAttrs = useEditAttrs(editPath);
  return (
    <Link href={button.href} className={className} {...editAttrs}>
      {button.label}
    </Link>
  );
}

// ------------------------------------------------------------------
// CmsLink — plain anchor
// ------------------------------------------------------------------

export interface CmsLinkProps {
  href: string;
  className?: string;
  editPath?: string;
  children: ReactNode;
}

export function CmsLink({ href, className, editPath, children }: CmsLinkProps) {
  const editAttrs = useEditAttrs(editPath);
  return (
    <Link href={href} className={className} {...editAttrs}>
      {children}
    </Link>
  );
}

// ------------------------------------------------------------------
// CmsIcon — Lucide icon lookup by string name
// ------------------------------------------------------------------

export interface CmsIconProps {
  name: string;
  className?: string;
  size?: number;
  editPath?: string;
}

export function CmsIcon({ name, className, size, editPath }: CmsIconProps) {
  const editAttrs = useEditAttrs(editPath);
  const icons = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string; size?: number }>
  >;
  const Icon = icons[name] ?? LucideIcons.HelpCircle;
  return (
    <span {...editAttrs} className={className}>
      <Icon size={size} />
    </span>
  );
}

// ------------------------------------------------------------------
// CmsList — generic list renderer
// ------------------------------------------------------------------

export interface CmsListProps<T> {
  items: T[];
  editPath?: string;
  className?: string;
  as?: ElementType;
  renderItem: (item: T, index: number, itemEditPath: string | undefined) => ReactNode;
  keyOf?: (item: T, index: number) => string | number;
}

export function CmsList<T>({
  items,
  editPath,
  className,
  as: Tag = "div",
  renderItem,
  keyOf,
}: CmsListProps<T>) {
  const editAttrs = useEditAttrs(editPath);
  return (
    <Tag className={className} {...editAttrs}>
      {items.map((item, i) => {
        const itemPath = editPath ? `${editPath}[${i}]` : undefined;
        const key =
          keyOf?.(item, i) ??
          ((item as unknown as { _id?: string; id?: string })._id ??
            (item as unknown as { id?: string }).id ??
            i);
        return (
          <div key={key} style={{ display: "contents" }}>
            {renderItem(item, i, itemPath)}
          </div>
        );
      })}
    </Tag>
  );
}
