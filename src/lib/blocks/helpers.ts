/**
 * FieldSpec builders to DRY common manifest patterns.
 */
import type { FieldSpec } from "./types";

export const text = (
  path: string,
  opts: { required?: boolean; label?: string } = {}
): FieldSpec => ({
  kind: "text",
  path,
  required: opts.required ?? true,
  label: opts.label,
});

export const richtext = (
  path: string,
  opts: { required?: boolean; label?: string } = {}
): FieldSpec => ({
  kind: "richtext",
  path,
  required: opts.required ?? true,
  label: opts.label,
});

export const image = (
  path: string,
  opts: { required?: boolean; label?: string } = {}
): FieldSpec => ({
  kind: "image",
  path,
  required: opts.required ?? false,
  label: opts.label,
});

export const button = (
  path: string,
  opts: { required?: boolean; label?: string } = {}
): FieldSpec => ({
  kind: "button",
  path,
  required: opts.required ?? false,
  label: opts.label,
});

export const link = (
  path: string,
  opts: { required?: boolean; label?: string } = {}
): FieldSpec => ({
  kind: "link",
  path,
  required: opts.required ?? false,
  label: opts.label,
});

export const icon = (
  path: string,
  opts: { required?: boolean; label?: string } = {}
): FieldSpec => ({
  kind: "icon",
  path,
  required: opts.required ?? false,
  label: opts.label,
});

export const list = (
  path: string,
  itemFields: FieldSpec[],
  opts: { required?: boolean; label?: string } = {}
): FieldSpec => ({
  kind: "list",
  path,
  required: opts.required ?? true,
  label: opts.label,
  itemFields,
});

/** Common pattern: head/body/cta section. */
export const headCtaFields = (): FieldSpec[] => [
  text("headline"),
  text("description"),
  button("ctaPrimary"),
  button("ctaSecondary"),
];
