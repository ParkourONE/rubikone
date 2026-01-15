import { Metadata } from "next";
import { PostenPage } from "@/components/sections/posten-page";

export const metadata: Metadata = {
  title: "07 | Passement | RubikONE Köniz",
  description: "Körperliche Aktivität wirkt positiv auf Körper und Geist. Jede Bewegung zählt!",
};

export default function PassementPage() {
  return (
    <PostenPage
      number="07"
      title="PASSEMENT"
      intro="Körperliche Aktivität wirkt positiv auf Körper und Geist. Jede Bewegung zählt! Denn Bewegung kann neben vielen anderen positiven Effekten auch die Stimmung aufhellen und Stress abbauen. Tue dir Gutes und beobachte, ob du dir und deinem Körper die Chance gibst, gesund und widerstandsfähig zu werden oder zu sein. Denke mal darüber nach."
      heroImage="/images/posten/passement/20190831_Last10_Berlin_Saturday_0625_1920px.jpg"
      exercises={[
        {
          title: "Passement",
          reps: "5x",
          description: "Eine Parkbank überwinden.",
          image: "/images/posten/passement/posten-7.png",
        },
        {
          title: "Trizeps Dip",
          reps: "12x",
          description: "Die Arme strecken und beugen.",
        },
      ]}
      furtherExercises={[
        "Oberkörper",
        "Challenge: Rolle vorwärts",
        "Team: Der Boden ist Lava",
      ]}
      tagescheck="Schliesse deine Augen. Was hörst du alles?"
      potenzial={{
        title: "Gegenseitig motivieren",
        content: `
          <p>Verabrede dich mit anderen um gemeinsam zu trainieren. So hast du andere Leute, die dich mitziehen, wenn du mal weniger Antrieb verspürst und umgekehrt kannst du andere zum Bewegen motivieren.</p>
          <p class="mt-4"><strong>UND:</strong> Erzähle anderen von deinen Sportplänen. So fragen sie gelegentlich nach wie es läuft und du kannst von deinen Fortschritten berichten.</p>
        `,
      }}
      prevPosten={{ slug: "stabilitaet", title: "06 | Stabilität" }}
      nextPosten={{ slug: "quadrupedie", title: "08 | Quadrupedie" }}
    />
  );
}
