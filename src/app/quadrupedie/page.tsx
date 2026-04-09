import { Metadata } from "next";
import { PostenPageClient } from "@/components/sections/posten-page-client";

export const metadata: Metadata = {
  title: "08 | Quadrupedie | RubikONE Köniz",
  description: "Keine Lust oder Langeweile beim Training? Kein Problem – probiere mal was Neues aus!",
};

export default function QuadrupediePage() {
  return (
    <PostenPageClient
      contentKey="POSTEN_QUADRUPEDIE"
      prevPosten={{ slug: "passement", title: "07 | Passement" }}
      nextPosten={{ slug: "check-out", title: "09 | Check-Out" }}
    />
  );
}
