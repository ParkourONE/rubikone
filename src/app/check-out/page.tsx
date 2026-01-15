import { Metadata } from "next";
import { PostenPage } from "@/components/sections/posten-page";

export const metadata: Metadata = {
  title: "09 | Check-Out | RubikONE Köniz",
  description: "Wiederholung ist der Schlüssel. Um eine Gewohnheit aufzubauen, muss das Zielverhalten regelmässig wiederholt werden.",
};

export default function CheckOutPage() {
  return (
    <PostenPage
      number="09"
      title="CHECK-OUT"
      intro="Wiederholung ist der Schlüssel. Um eine Gewohnheit aufzubauen, muss das Zielverhalten (z.B. jede Woche den RubikONE absolvieren) am besten regelmässig wiederholt werden. Nimm physische und mentale Anstrengung in Kauf – es fällt dir mit der Zeit einfacher, dein aktives Verhalten aufrecht zu halten. Zuerst ist es eine Absicht, dann wirst du aktiv bis das Training über regelmässiges Wiederholen zu einer Gewohnheit und schlussendlich einem Teil von dir wird. Los geht's! Routine aufbauen: Setze dir regelmässige Termine um Sport zu treiben oder dich extra zu bewegen. Fehlt dir die Zeit? Kein Problem. Auch ein Training alle zwei Wochen wirkt positiv und kann zum festen Bestandteil deines Alltages werden."
      heroImage="/images/posten/check-out/466A7482-scaled-1.jpg"
      exercises={[
        {
          title: "Nacken",
          reps: "30 Sek. pro Seite",
          description: "Neige deinen Kopf nach rechts/links und ziehe die Hand zum Boden.",
          image: "/images/posten/check-out/Vektor-Smartobjekt-1-2.png",
        },
        {
          title: "Rotation",
          reps: "30 Sek. pro Seite",
          description: "In der «Grätsche» mit einer Hand am Boden abstützen. Den anderen Arm weit nach oben strecken.",
          image: "/images/posten/check-out/Vektor-Smartobjekt-2-1.png",
        },
        {
          title: "Hüfte",
          reps: "30 Sek. pro Seite",
          description: "Mit stolzer Haltung die Hüfte zum vorderen Knie schieben.",
          image: "/images/posten/check-out/Vektor-Smartobjekt-4.png",
        },
      ]}
      furtherExercises={[
        {
          title: "Die letzten 10",
          description: "1x mind. 10 Wiederholungen | Absolviere nochmals die Übung, die dich auf dem RubikONE heute am meisten herausgefordert hat.",
        },
        {
          title: "Feedback",
          description: "Scanne den QR-Code und gib uns ein kurzes Feedback zu deinem Training heute. Was hat dir gefallen? Was können wir verbessern?",
        },
      ]}
      tagescheck="Wie gönnst du dir heute Erholung?"
      potenzial={{
        title: "Erholung",
        content: `
          <p>...sie ist ein Bestandteil des Trainings. Zur Erholung gehören auch ausreichend und erholsamer Schlaf sowie ausgewogene Ernährung.</p>
          <p class="mt-4"><strong>Wie kannst du deine Schlafqualität verbessern?</strong></p>
          <p class="mt-2">Es gibt verschiedene Ansätze dazu. Ein paar findest du hier:</p>
          <ul class="mt-2 space-y-1">
            <li>• Der Raum in dem du schläfst, ist möglichst dunkel.</li>
            <li>• Lärm und Geräuschquellen minimieren.</li>
            <li>• Spätestens eine Stunde vor dem Schlafengehen keine Bildschirmzeit (d.h. Mobiltelefon, TV, Laptop etc.)</li>
          </ul>
          <p class="mt-4"><strong>Was kann zu einer ausgewogenen Ernährung gehören?</strong></p>
          <p class="mt-2">Auch hier gibt es viele Punkte, die du bei deiner Ernährung beachten kannst. Hier findest du eine kleine Auswahl:</p>
          <ul class="mt-2 space-y-1">
            <li>• Verwende frisches Gemüse und Obst</li>
            <li>• 5 am Tag = 3 Portionen Gemüse + 2 Portionen Obst jeden Tag</li>
            <li>• Hülsenfrüchte wie Linsen, Quinoa oder Reis sind wertvolle Alternativen zu Teigwaren.</li>
            <li>• Bist du viel unterwegs? Koche dir leckere Speisen vor und nimm sie in Portionen mit.</li>
          </ul>
        `,
      }}
      prevPosten={{ slug: "quadrupedie", title: "08 | Quadrupedie" }}
    />
  );
}
