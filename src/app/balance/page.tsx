import { Metadata } from "next";
import { PostenPageClient } from "@/components/sections/posten-page-client";

export const metadata: Metadata = {
  title: "04 | Balance | RubikONE Köniz",
  description: "Mit RubikONE verfolgen wir zielgerichtete Glaubenssätze. Hindernisse sind Möglichkeiten – es gibt immer einen Weg.",
};

export default function BalancePage() {
  return (
    <PostenPageClient
      contentKey="POSTEN_BALANCE"
      prevPosten={{ slug: "abc", title: "03 | ABC" }}
      nextPosten={{ slug: "sprungkraft", title: "05 | Sprungkraft" }}
    />
  );
}
