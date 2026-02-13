import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raumgestaltung | RubikONE",
  description: "RubikONE verwandelt bestehende Orte in Parkour- & Bewegungsräume – für Gemeinden, Städte, Schulen und Organisationen.",
};

export default function FuerGemeindenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
