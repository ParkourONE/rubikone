import { Metadata } from "next";
import { PostenPage } from "@/components/sections/posten-page";

export const metadata: Metadata = {
  title: "01 | Check-In | RubikONE Köniz",
  description: "Bringe dich zu Beginn physisch und mental in Schwung. Starte deinen Motor und sei bereit auf das was kommt.",
};

export default function CheckInPage() {
  return (
    <PostenPage
      number="01"
      title="CHECK-IN"
      intro="Um optimal vom Training zu profitieren empfehlen wir: Bringe dich zu Beginn physisch und mental in Schwung. Starte deinen Motor und sei bereit auf das was kommt. Als Trainingsstart wählen wir deshalb Übungen die den Herz-Kreislauf anregen und das neuromuskuläre System aktivieren. Ziel: Alle Gelenke durchbewegen (mobilisieren) und mental im Training ankommen."
      heroImage="/images/posten/check-in/G1A1984-1-scaled-1.jpg"
      exercises={[
        {
          title: "Hüpfen",
          reps: "1x",
          description: "In jedes Feld hüpfen.",
          image: "/images/posten/check-in/springen.png",
        },
        {
          title: "Rotieren",
          reps: "5x pro Seite",
          description: "Auf jede Seite drehen und abklatschen. Als Einzelperson auf der Seite in die Hände klatschen.",
          image: "/images/posten/check-in/drehen.png",
        },
        {
          title: "Armkreisen",
          reps: "3x",
          description: "Um das Muster herum joggen. Dabei Arme vorwärts & rückwärts kreisen.",
        },
      ]}
      furtherExercises={[
        "Linien berühren",
        "Rucksack packen",
        "Ein-Mal-alles",
      ]}
      tagescheck="Worauf freust du dich heute?"
      potenzial={{
        title: "Effizient vs. Effektiv",
        content: `
          <p>Ein Beispiel: Dein Ziel ist es fitter zu werden und weniger schnell ausser Atem zu sein? Dann kannst du dich fragen: «Tue ich das Richtige, um dieses Ziel zu erreichen (Effektivität)? Und mache ich es auch richtig (Effizient)?»</p>
          <p class="mt-4">Um nachhaltig gesünder und möglichst verletzungsfrei zu sein, braucht es Bewegung. Am besten vielseitige Aktivitäten, bei denen du Spass hast, koordinativ, konditionell und mental herausgefordert wirst und einfach tolle Erlebnisse sammelst.</p>
          <p class="mt-4 font-semibold">Ein wissender Athlet – ist ein besserer Athlet</p>
          <p class="mt-2">Informiere dich. Was passiert im Körper beim Joggen? Weshalb bin ich nach dem Training müde? etc. Informiere dich, damit du den Nutzen von Bewegung noch besser verstehst. Sammle Ideen, wie du dein Training auf dem RubikONE für dich optimal gestalten kannst.</p>
        `,
      }}
      nextPosten={{ slug: "fokus", title: "02 | Fokus" }}
    />
  );
}
