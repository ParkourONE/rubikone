import { Metadata } from "next";
import { LegalPageClient } from "@/components/sections/legal-page-client";

export const metadata: Metadata = {
  title: "Impressum | RubikONE",
  description: "Impressum und rechtliche Informationen zu RubikONE.",
};

export default function ImpressumPage() {
  return <LegalPageClient contentKey="IMPRESSUM_CONTENT" />;
}
