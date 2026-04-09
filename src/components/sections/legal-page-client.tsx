"use client";

import { PageHero } from "@/components/sections/hero-section";
import { FadeUp } from "@/components/shared/fade-up";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";
import {
  IMPRESSUM_CONTENT,
  DATENSCHUTZ_CONTENT,
} from "@/lib/constants";

type LegalKey = "IMPRESSUM_CONTENT" | "DATENSCHUTZ_CONTENT";

type LegalSection = { _id: string; heading: string; body: string };
type LegalContent = {
  title: string;
  breadcrumb?: string;
  sections: LegalSection[];
  stand?: string;
};

const DEFAULTS: Record<LegalKey, LegalContent> = {
  IMPRESSUM_CONTENT,
  DATENSCHUTZ_CONTENT,
};

interface LegalSectionItemProps {
  section: LegalSection;
  index: number;
  contentKey: LegalKey;
}

function LegalSectionItem({ section, index, contentKey }: LegalSectionItemProps) {
  const headingEdit = useEditPath(`${contentKey}.sections[${index}].heading`);
  const bodyEdit = useEditPath(`${contentKey}.sections[${index}].body`);
  return (
    <>
      <h2
        className={`text-title-2 text-[var(--color-apple-dark)]${index === 0 ? " mt-0" : ""}`}
        {...headingEdit}
      >
        {section.heading}
      </h2>
      <div dangerouslySetInnerHTML={{ __html: section.body }} {...bodyEdit} />
    </>
  );
}

interface Props {
  contentKey: LegalKey;
}

export function LegalPageClient({ contentKey }: Props) {
  const data = useContent(contentKey, DEFAULTS[contentKey]) as LegalContent;
  const standEdit = useEditPath(`${contentKey}.stand`);

  return (
    <>
      <PageHero
        title={data.title}
        breadcrumb={data.breadcrumb}
        titleEditPath={`${contentKey}.title`}
        breadcrumbEditPath={`${contentKey}.breadcrumb`}
      />

      <section className="section-spacing">
        <div className="container-content">
          <FadeUp>
            <div className="prose prose-lg max-w-3xl mx-auto text-[var(--color-apple-gray-700)]">
              {(data.sections ?? []).map((section, i) => (
                <LegalSectionItem
                  key={section._id}
                  section={section}
                  index={i}
                  contentKey={contentKey}
                />
              ))}

              {data.stand ? (
                <div className="mt-12 pt-8 border-t border-[var(--color-apple-gray-200)]">
                  <p className="text-body-sm text-[var(--color-apple-gray-500)]" {...standEdit}>
                    {data.stand}
                  </p>
                </div>
              ) : null}
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
