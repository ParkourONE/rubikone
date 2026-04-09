"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/constants";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeUp } from "@/components/shared/fade-up";
import { useEditPath } from "@/components/cms/primitives";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  items?: readonly FAQItem[];
  className?: string;
}

function FAQItemRow({ item, index }: { item: FAQItem; index: number }) {
  const path = `FAQ_ITEMS[${index}]`;
  const itemEdit = useEditPath(path);
  const qEdit = useEditPath(`${path}.question`);
  const aEdit = useEditPath(`${path}.answer`);
  return (
    <AccordionItem
      value={`item-${index}`}
      className="border-b border-[var(--color-apple-gray-200)]"
      {...itemEdit}
    >
      <AccordionTrigger className="text-left text-body font-semibold py-5 hover:no-underline hover:text-[var(--color-apple-blue)] transition-colors">
        <span {...qEdit}>{item.question}</span>
      </AccordionTrigger>
      <AccordionContent className="text-body text-[var(--color-apple-gray-600)] pb-5" {...aEdit}>
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  );
}

export function FAQSection({
  title = "Häufig gestellte Fragen",
  subtitle = "FAQ",
  items = FAQ_ITEMS,
  className,
}: FAQSectionProps) {
  return (
    <section className={`section-spacing ${className || ""}`}>
      <div className="container-content">
        <SectionHeader title={title} subtitle={subtitle} className="mb-12 lg:mb-16" />

        <FadeUp>
          <div className="max-w-3xl mx-auto" {...useEditPath("FAQ_ITEMS")}>
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, index) => (
                <FAQItemRow key={index} item={item} index={index} />
              ))}
            </Accordion>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
