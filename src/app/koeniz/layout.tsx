import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entdecke RubikONE",
  description: "Probiere RubikONE selbst aus. Köniz hat in Kooperation mit dem BASPO lab7x1 als erste Gemeinde einen RubikONE installiert.",
};

export default function KoenizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
