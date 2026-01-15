import { Metadata } from "next";
import { PostenPage } from "@/components/sections/posten-page";

export const metadata: Metadata = {
  title: "04 | Balance | RubikONE Köniz",
  description: "Mit RubikONE verfolgen wir zielgerichtete Glaubenssätze. Hindernisse sind Möglichkeiten – es gibt immer einen Weg.",
};

export default function BalancePage() {
  return (
    <PostenPage
      number="04"
      title="BALANCE"
      intro="Mit RubikONE verfolgen wir zielgerichtete Glaubenssätze. Denn die eigenen Entscheidungen hängen stark von den persönlichen Überzeugungen ab. Es gibt kein 0815 Rezept für ein gesundes und glückliches Leben. Entscheide selbst, was du als richtig erachtest und fokussiere auf deine Stärken. Denn: Hindernisse sind Möglichkeiten. Das heisst, es gibt immer einen Weg."
      heroImage="/images/posten/balance/IMG_4237-scaled-1.jpg"
      exercises={[
        {
          title: "Balancieren",
          reps: "1x",
          description: "Auf der Linie vorwärts und rückwärts balancieren.",
          image: "/images/posten/balance/Vektor-Smartobjekt-1.jpg",
        },
        {
          title: "Hüpfen",
          reps: "5x",
          description: "Auf der Linie seitwärts nach rechts, dann nach links hüpfen.",
          image: "/images/posten/balance/Vektor-Smartobjekt-1-2.png",
        },
        {
          title: "Kreuzen",
          reps: "2x",
          description: "Einander auf der Linie kreuzen.",
          image: "/images/posten/balance/Vektor-Smartobjekt-2-1.png",
        },
      ]}
      furtherExercises={[
        {
          title: "Transport",
          description: "1x entlang der ganzen Farbmarkierung | Nimm einen Gegenstand den du dabei hast. Lege ihn auf den Kopf und transportiere ihn während dem Balancieren. Schaffst du es ohne den Gegenstand festzuhalten?",
        },
        {
          title: "Pirouette",
          description: "3x pro Seite | Stelle dich auf eine Linie und balanciere während der ganzen Übung auf einem Bein. Führe eine 360° Drehung aus, sodass ein Fuss immer in der Luft bleibt.",
        },
        {
          title: "Team-Challenge",
          description: "Für 2 oder mehr Personen: Alle stehen während der ganzen Übung auf einer Linie und berühren den Boden nebenan nicht. Die erste Person gibt ein akustisches Signal, woraufhin alle eine Drehung ausführen. Danach gibt die zweite, dritte, vierte, …usw. Person das Signal. Wer bleibt am längsten in Balance?",
        },
      ]}
      tagescheck="Nenne zwei Stärken von dir und begründe sie."
      potenzial={{
        title: "Was ist dein sportbezogenes Ziel?",
        content: `
          <p>Welche Etappen braucht es bis dahin?</p>
          <p class="mt-4">Sich Ziele und Etappenziele aufzuschreiben hilft dabei sich zu motivieren und Fortschritte zu erkennen. Es braucht jeden Tropfen um ein Fass mit Wasser zu füllen. Genauso braucht es jedes Training um seinem Ziel näher zu kommen.</p>
          <p class="mt-4"><strong>Faustformel für die Zielsetzung «SMART»:</strong> Spezifisch, messbar, attraktiv, realistisch, terminiert.</p>
          <p class="mt-4">Du kannst dir kurz-, mittel- und langfristige Ziele setzten. Überprüfe deine Zielsetzung (messbar, realistisch) zu einem vordefinierten Termin (terminiert). So kannst du deinen Plan rechtzeitig anpassen, Erfolge feiern und sicherstellen, dass du auf Kurs bist. Frage dich auch, ob du dieses Ziel wirklich erreichen möchtest (attraktiv) und definiere es ganz exakt (spezifisch).</p>
        `,
      }}
      prevPosten={{ slug: "abc", title: "03 | ABC" }}
      nextPosten={{ slug: "sprungkraft", title: "05 | Sprungkraft" }}
    />
  );
}
