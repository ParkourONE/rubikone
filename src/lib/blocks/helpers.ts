/**
 * FieldSpec builders to DRY common manifest patterns.
 */
import type { FieldSpec } from "./types";

type ScalarOpts = { required?: boolean; label?: string; default?: unknown };

export const text = (
  path: string,
  opts: ScalarOpts = {}
): FieldSpec => ({
  kind: "text",
  path,
  required: opts.required ?? true,
  label: opts.label,
  default: opts.default ?? "",
});

export const richtext = (
  path: string,
  opts: ScalarOpts = {}
): FieldSpec => ({
  kind: "richtext",
  path,
  required: opts.required ?? true,
  label: opts.label,
  default: opts.default ?? "",
});

export const image = (
  path: string,
  opts: ScalarOpts = {}
): FieldSpec => ({
  kind: "image",
  path,
  required: opts.required ?? false,
  label: opts.label,
  default: opts.default ?? "",
});

export const button = (
  path: string,
  opts: ScalarOpts = {}
): FieldSpec => ({
  kind: "button",
  path,
  required: opts.required ?? false,
  label: opts.label,
  default: opts.default ?? { label: "", href: "" },
});

export const link = (
  path: string,
  opts: ScalarOpts = {}
): FieldSpec => ({
  kind: "link",
  path,
  required: opts.required ?? false,
  label: opts.label,
  default: opts.default ?? { label: "", href: "" },
});

export const icon = (
  path: string,
  opts: ScalarOpts = {}
): FieldSpec => ({
  kind: "icon",
  path,
  required: opts.required ?? false,
  label: opts.label,
  default: opts.default ?? "HelpCircle",
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
