import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns | RubikONE",
  description: "ParkourONE: Die Pioniere hinter RubikONE. Seit 2007 bringen wir Menschen in Bewegung. Über 20 Jahre Erfahrung, 1'500+ Schüler, die TRuST-Methode.",
};

export default function UeberUnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
