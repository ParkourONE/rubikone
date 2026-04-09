import { Metadata } from "next";
import { PostenPageClient } from "@/components/sections/posten-page-client";

export const metadata: Metadata = {
  title: "06 | Stabilität | RubikONE Köniz",
  description: "Der Körper ist ein Meisterwerk der Natur. Nur wenn wir sorgfältig und clever mit ihm umgehen, kann er stärker werden.",
};

export default function StabilitaetPage() {
  return (
    <PostenPageClient
      contentKey="POSTEN_STABILITAET"
      prevPosten={{ slug: "sprungkraft", title: "05 | Sprungkraft" }}
      nextPosten={{ slug: "passement", title: "07 | Passement" }}
    />
  );
}
