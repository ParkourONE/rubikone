import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt | RubikONE",
  description: "Kontaktieren Sie uns für eine unverbindliche Beratung zu RubikONE.",
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
