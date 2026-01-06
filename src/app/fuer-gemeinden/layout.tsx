import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Für Gemeinden | RubikONE",
  description: "RubikONE für Gemeinden: Bewegungsförderung ohne Bauaufwand. Verwandeln Sie bestehende Orte in Bewegungsräume – nachhaltig und kosteneffizient.",
};

export default function FuerGemeindenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
