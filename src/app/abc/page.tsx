import { Metadata } from "next";
import { PostenPageClient } from "@/components/sections/posten-page-client";

export const metadata: Metadata = {
  title: "03 | ABC | RubikONE Köniz",
  description: "Parkour bedeutet so effizient wie möglich von Punkt A zum Punkt B zu gelangen. Lerne nach Lösungen zu suchen.",
};

export default function ABCPage() {
  return (
    <PostenPageClient
      contentKey="POSTEN_ABC"
      prevPosten={{ slug: "fokus", title: "02 | Fokus" }}
      nextPosten={{ slug: "balance", title: "04 | Balance" }}
    />
  );
}
