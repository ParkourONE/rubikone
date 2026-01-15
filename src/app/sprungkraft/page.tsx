import { Metadata } from "next";
import { PostenPage } from "@/components/sections/posten-page";

export const metadata: Metadata = {
  title: "05 | Sprungkraft | RubikONE Köniz",
  description: "Reaktion ist eine koordinative Fähigkeit. Teste dich und finde die passende zielführende Reaktion auf das nächste Hindernis.",
};

export default function SprungkraftPage() {
  return (
    <PostenPage
      number="05"
      title="SPRUNGKRAFT"
      intro="Reaktion ist eine koordinative Fähigkeit. Im Outdoor Training kann eine gute Reaktion auch Sicherheit bedeuten. Zum Beispiel wenn es darum geht, sich flexibel auf die Bedingungen anzupassen. Wie verändert sich die Anforderung an deine Balance auf einem rutschigen Untergrund? Was musst du beachten, wenn die Treppe im Winter vereist ist? Je mehr verschiedene Situationen du durchlebst, desto mehr wächst dein Erfahrungsschatz. Teste dich und finde die passende zielführende Reaktion auf das nächste Hindernis."
      heroImage="/images/posten/sprungkraft/20180523_ParkourOne_Velodrom_047-scaled-1.jpg"
      exercises={[
        {
          title: "Springen",
          reps: "3x",
          description: "Mit möglichst wenigen Sprüngen bis zum Wendepfeil.",
          image: "/images/posten/sprungkraft/springen.png",
        },
        {
          title: "Team",
          reps: "2x",
          description: "Gebt euch die Hand. Die vorderste Person gibt die Route vor. Die hinteren Personen folgen exakt.",
          image: "/images/posten/sprungkraft/springen-2.png",
        },
      ]}
      furtherExercises={[
        "Vierfüsser",
        "Team-Challenge: Springen",
        "Kompakt",
      ]}
      tagescheck="Wie geht es dir jetzt gerade?"
      potenzial={{
        title: "Durchhalten & Ziele erreichen",
        content: `
          <p>Muhammad Ali, eine Boxlegende, beschrieb einst sein Erfolgsrezept in drei Wörtern: «Conceive! Believe! Achieve!». Übersetzt bedeutet das:</p>
          <p class="mt-4">Wenn ich ein Ziel begreife, kann ich daran glauben. Und wenn ich daran glaube, kann ich es erreichen.</p>
          <p class="mt-4 font-semibold">Realisieren! Daran glauben! Erreichen!</p>
          <p class="mt-4">Veränderung braucht Zeit. Manchmal mehr, manchmal weniger. Hast du ein Ziel und eine Vision für dich, triffst du Entscheidungen, die automatisch in diese Richtung führen. Das braucht manchmal etwas Mut.</p>
          <p class="mt-4">Viel Erfolg!</p>
        `,
      }}
      prevPosten={{ slug: "balance", title: "04 | Balance" }}
      nextPosten={{ slug: "stabilitaet", title: "06 | Stabilität" }}
    />
  );
}
