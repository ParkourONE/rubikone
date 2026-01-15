import { Metadata } from "next";
import { PostenPage } from "@/components/sections/posten-page";

export const metadata: Metadata = {
  title: "03 | ABC | RubikONE Köniz",
  description: "Parkour bedeutet so effizient wie möglich von Punkt A zum Punkt B zu gelangen. Lerne nach Lösungen zu suchen.",
};

export default function ABCPage() {
  return (
    <PostenPage
      number="03"
      title="ABC"
      intro="Parkour bedeutet so effizient wie möglich von Punkt A zum Punkt B zu gelangen. Was du im Training übst, kannst du dann auf Alltagssituationen übertragen. Lerne nach Lösungen zu suchen, indem du Neues ausprobierst. Beeinflusse, was du verändern kannst und handle zielstrebig und mutig. Reminder: Die Stichworte Stark – Sinnvoll – Nachhaltig können dir als Orientierung bzw. Entscheidungshilfe dienen."
      heroImage="/images/posten/abc/G1A1984-1-scaled-1.jpg"
      exercises={[
        {
          title: "Schreiben",
          reps: "4x",
          description: "Ein Wort schreiben. Auf allen Vieren herumgehen und mit der Hand die richtigen Buchstaben berühren.",
          image: "/images/posten/abc/abc.png",
        },
        {
          title: "Team",
          reps: "1x",
          description: "Einen Satz ausdenken mit mindestens einem Wort pro Person. Alle schreiben gleichzeitig ihr Wort ohne einander zu berühren.",
          image: "/images/posten/abc/IMG_2252-scaled-1.jpg",
        },
      ]}
      furtherExercises={[
        {
          title: "Buchstabendschungel",
          description: "Mindestens 2 Personen: Eine Person springt auf einen Buchstaben und bleibt stehen. Die zweite Person springt auf den gleichen Buchstaben. Danach springt die erste Person woanders hin. Die zweite Person folgt usw. Vereinfachung: Fühlt sich der Abstand zwischen den Personen zu nah an? Dann nur einen Fuss auf den Buchstabe stellen.",
        },
        {
          title: "SMS",
          description: "1x Text | Schreibe einen Text an eine Person, die du kennst. Bedanke dich im Text bei dieser Person für etwas. Bewege dich dabei mit den Händen und Füssen am Boden von Buchstabe zu Buchstabe.",
        },
        {
          title: "Challenge",
          description: "Für 1 Person: Versuche mit so wenig Bewegungen wie möglich, jeden Buchstaben ein Mal zu berühren. Du darfst Hände, Füsse und den ganzen Körper einsetzen. Für 2 oder mehr Personen: Ergänzt euch gegenseitig.",
        },
      ]}
      tagescheck="Nenne zwei Stärken von dir. Wo im Alltag zeigst du sie?"
      potenzial={{
        title: "Hindernisse überwinden",
        content: `
          <p>Stehst du vor einer Entscheidung und brauchst Orientierung um auf die Lösung zu kommen?</p>
          <p class="mt-4">Wir haben für uns drei Stichworte ausgewählt, die uns immer wieder als Entscheidungshilfen dienen. Du kannst dich fragen: Ist meine Idee…</p>
          <ul class="mt-4 space-y-2">
            <li><strong>stark?</strong> – d.h. ich bin davon überzeugt.</li>
            <li><strong>sinnvoll?</strong> – d.h. sie stimmt mit meinen Werten und Authentizität überein.</li>
            <li><strong>nachhaltig?</strong> – d.h. sie führt mich in die richtige Richtung.</li>
          </ul>
        `,
      }}
      prevPosten={{ slug: "fokus", title: "02 | Fokus" }}
      nextPosten={{ slug: "balance", title: "04 | Balance" }}
    />
  );
}
