import { Metadata } from "next";
import { PostenPageClient } from "@/components/sections/posten-page-client";

export const metadata: Metadata = {
  title: "07 | Passement | RubikONE Köniz",
  description: "Körperliche Aktivität wirkt positiv auf Körper und Geist. Jede Bewegung zählt!",
};

export default function PassementPage() {
  return (
    <PostenPageClient
      contentKey="POSTEN_PASSEMENT"
      prevPosten={{ slug: "stabilitaet", title: "06 | Stabilität" }}
      nextPosten={{ slug: "quadrupedie", title: "08 | Quadrupedie" }}
    />
  );
}
