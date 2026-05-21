import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bewegungskultur",
  description: "RubikONE macht sichtbar, was schon da ist: 9 Bewegungen, 3 Schwierigkeitsgrade, 0 neue Geräte. Erfahren Sie, wie die Bewegungskultur funktioniert.",
};

export default function KonzeptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
