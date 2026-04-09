import { Metadata } from "next";
import { PostenPageClient } from "@/components/sections/posten-page-client";

export const metadata: Metadata = {
  title: "09 | Check-Out | RubikONE Köniz",
  description: "Wiederholung ist der Schlüssel. Um eine Gewohnheit aufzubauen, muss das Zielverhalten regelmässig wiederholt werden.",
};

export default function CheckOutPage() {
  return (
    <PostenPageClient
      contentKey="POSTEN_CHECK_OUT"
      prevPosten={{ slug: "quadrupedie", title: "08 | Quadrupedie" }}
    />
  );
}
