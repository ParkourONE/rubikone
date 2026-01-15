import { Metadata } from "next";
import { PostenPage } from "@/components/sections/posten-page";

export const metadata: Metadata = {
  title: "02 | Fokus | RubikONE Köniz",
  description: "Koordinationsaufgaben sind nach der Mobilisation der optimale Anfang eines Trainings. Richte den Fokus auf dich selbst.",
};

export default function FokusPage() {
  return (
    <PostenPage
      number="02"
      title="FOKUS"
      intro="Koordinationsaufgaben sind nach der Mobilisation der optimale Anfang eines Trainings. So kannst du den Fokus auf dich selbst richten. Ausserdem eignen sich teambildende Übungen und Aufgaben, welche lösungsorientiertes Denken fordern. Zur Abwechslung kannst du deine Sinne gezielt einsetzen. Schliesse mal die Augen, teste einen anderen Boden und trainiere bei Sonne und Regen."
      heroImage="/images/posten/fokus/20190831_Last10_Berlin_Saturday_0810-scaled-1.jpg"
      exercises={[
        {
          title: "Balancieren",
          reps: "60 Sekunden",
          description: "Eine Person versucht die andere Person aus dem Gleichgewicht zu bringen. Als Einzelperson sich selbst herausfordern.",
          image: "/images/posten/fokus/Vektor-Smartobjekt-1-1.png",
        },
        {
          title: "Umrundung",
          reps: "1x pro Seite",
          description: "Mit den Händen um die Kugel wandern. Alternative: Hände auf der Kugel.",
          image: "/images/posten/fokus/Vektor-Smartobjekt.jpg",
        },
      ]}
      furtherExercises={[
        "Slalom",
        "Punkt",
        "Challenge",
      ]}
      tagescheck="Wofür bist du heute dankbar?"
      potenzial={{
        title: "Trickse dich aus",
        content: `
          <p>Fällt es dir manchmal schwer dich zu Sport oder Bewegung zu motivieren?</p>
          <p class="mt-4"><strong>Unser Tipp:</strong> Lege dir deine lieblings Sportklamotten schon am Vorabend bereit. Packe sie am Morgen ein, wenn du aus dem Haus gehst oder bereite sie so vor, dass du nur noch reinsteigen kannst, wenn du nach Hause kommst.</p>
          <p class="mt-4">Und: Entscheide dich ganz spezifisch, was die Aktivität ist. So hast du in Gedanken dein Training bereits vorbereitet und die Umsetzung fällt leichter.</p>
        `,
      }}
      prevPosten={{ slug: "check-in", title: "01 | Check-In" }}
      nextPosten={{ slug: "abc", title: "03 | ABC" }}
    />
  );
}
