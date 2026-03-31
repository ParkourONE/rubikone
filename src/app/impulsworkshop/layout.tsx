import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impulsworkshop | RubikONE",
  description: "Der einfachste Weg zu starten. Ein 120-minütiger Workshop vor Ort in Ihrer Gemeinde. Nach dem Workshop sehen Sie Ihre Umgebung mit anderen Augen.",
};

export default function ImpulsworkshopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
