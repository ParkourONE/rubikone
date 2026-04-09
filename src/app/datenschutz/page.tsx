import { Metadata } from "next";
import { LegalPageClient } from "@/components/sections/legal-page-client";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | RubikONE",
  description: "Datenschutzerklärung von RubikONE - Informationen zur Bearbeitung Ihrer Personendaten.",
};

export default function DatenschutzPage() {
  return <LegalPageClient contentKey="DATENSCHUTZ_CONTENT" />;
}
