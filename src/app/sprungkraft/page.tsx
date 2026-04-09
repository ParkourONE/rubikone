import { Metadata } from "next";
import { PostenPageClient } from "@/components/sections/posten-page-client";

export const metadata: Metadata = {
  title: "05 | Sprungkraft | RubikONE Köniz",
  description: "Reaktion ist eine koordinative Fähigkeit. Teste dich und finde die passende zielführende Reaktion auf das nächste Hindernis.",
};

export default function SprungkraftPage() {
  return (
    <PostenPageClient
      contentKey="POSTEN_SPRUNGKRAFT"
      prevPosten={{ slug: "balance", title: "04 | Balance" }}
      nextPosten={{ slug: "stabilitaet", title: "06 | Stabilität" }}
    />
  );
}
