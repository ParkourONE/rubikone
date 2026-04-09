import { Metadata } from "next";
import { PostenPageClient } from "@/components/sections/posten-page-client";

export const metadata: Metadata = {
  title: "02 | Fokus | RubikONE Köniz",
  description: "Koordinationsaufgaben sind nach der Mobilisation der optimale Anfang eines Trainings. Richte den Fokus auf dich selbst.",
};

export default function FokusPage() {
  return (
    <PostenPageClient
      contentKey="FOKUS_CONTENT"
      prevPosten={{ slug: "check-in", title: "01 | Check-In" }}
      nextPosten={{ slug: "abc", title: "03 | ABC" }}
    />
  );
}
