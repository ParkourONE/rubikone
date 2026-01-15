import { Metadata } from "next";
import { PostenPage } from "@/components/sections/posten-page";

export const metadata: Metadata = {
  title: "08 | Quadrupedie | RubikONE Köniz",
  description: "Keine Lust oder Langeweile beim Training? Kein Problem – probiere mal was Neues aus!",
};

export default function QuadrupediePage() {
  return (
    <PostenPage
      number="08"
      title="QUADRUPEDIE"
      intro="Keine Lust oder Langeweile beim Training? Kein Problem – probiere mal was Neues aus! Tipps für Abwechslung: Gegensatzerfahrung – Führe die Übung ein paar Mal extra langsam und dann schnell, oder laut und leise aus. Wetter – Bei verschiedenen Wetterbedingungen raus zu gehen macht Spass, weil es Abwechslung bringt. Adjektiv – Wähle ein Adjektiv und führe Übungen so aus. Z.B. kräftig, elegant, schwungvoll, künstlerisch. Alleine vs. gemeinsam – Geteilte Freude ist doppelte Freude. Hinweis: Sicherheit geht vor! Du bist für dich verantwortlich. Schätze deine Fähigkeiten dabei realistisch ein."
      heroImage="/images/posten/quadrupedie/G1A1984-1-scaled-1.jpg"
      exercises={[
        {
          title: "Quadrupedie",
          reps: "1x",
          description: "Rückwärts auf allen Vieren entlang der Markierung bewegen.",
          image: "/images/posten/quadrupedie/Vektor-Smartobjekt-1-1.png",
        },
        {
          title: "Schubkarre",
          reps: "5x pro Person",
          description: "Entlang der Markierung auf den Händen gehen. Als Einzelperson: Beide Hände und ein Fuss berühren den Boden.",
          image: "/images/posten/quadrupedie/Vektor-Smartobjekt-3 (1).png",
        },
      ]}
      furtherExercises={[
        "Schrittprognose",
        "Zick Zack",
        "Freie Wahl",
      ]}
      tagescheck="Wo fühlst du Erschöpfung in deinem Körper? Wo hast du Energiereserven?"
      potenzial={{
        title: "Raus aus der Komfortzone!",
        content: `
          <p>Mit Komfortzone verbinden wir ein Gefühl von Sicherheit. Gewohnte Verhaltensweisen laufen automatisch ab und es braucht keinen zusätzlichen Mut, diese Handlungs- oder Denkmuster zu wiederholen.</p>
          <p class="mt-4">Ausserhalb der Komfortzone hingegen liegt der Bereich, wo du dich weiterentwickeln und Neues lernen kannst (Lernzone).</p>
          <p class="mt-4">Hier triffst du Hindernisse an. Um sie zu überwinden braucht es eine Veränderung deiner Gewohnheiten oder es ist an der Zeit dir neue Methoden anzueignen. Du kannst frei zwischen Komfort- und Lernzone wechseln, um die richtige Dosis an Herausforderung für dich zu finden.</p>
          <p class="mt-4 font-semibold">Allgemein gilt: Übe das, was du verbessern willst.</p>
          <p class="mt-4"><strong>Bewegung & Sport als Übungsfeld – Zum Beispiel:</strong></p>
          <ul class="mt-2 space-y-1">
            <li>• <em>Fitness verbessern:</em> Bewege dich (egal wie) und sorge für Erfolgserlebnisse.</li>
            <li>• <em>Durchhaltewille verbessern:</em> Führe immer 1 Wiederholung mehr aus.</li>
            <li>• <em>Gelassenheit:</em> Achte auf deine Atmung.</li>
          </ul>
          <p class="mt-4 font-semibold">Zur Erinnerung: Repetition is the key (Wiederholung ist der Schlüssel)</p>
        `,
      }}
      prevPosten={{ slug: "passement", title: "07 | Passement" }}
      nextPosten={{ slug: "check-out", title: "09 | Check-Out" }}
    />
  );
}
