import { Metadata } from "next";
import { PostenPageClient } from "@/components/sections/posten-page-client";

export const metadata: Metadata = {
  title: "01 | Check-In | RubikONE Köniz",
  description: "Bringe dich zu Beginn physisch und mental in Schwung. Starte deinen Motor und sei bereit auf das was kommt.",
};

export default function CheckInPage() {
  return (
    <PostenPageClient
      contentKey="POSTEN_CHECK_IN"
      nextPosten={{ slug: "fokus", title: "02 | Fokus" }}
    />
  );
}
