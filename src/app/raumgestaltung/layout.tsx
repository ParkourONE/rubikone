import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angebot",
  description: "Das Angebot von RubikONE: Wir transformieren bestehende Umgebungen in Parkour- & Bewegungsräume — von der Analyse bis zur Eröffnung.",
};

export default function AngebotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
