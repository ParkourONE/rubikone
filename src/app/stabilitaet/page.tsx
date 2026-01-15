import { Metadata } from "next";
import { PostenPage } from "@/components/sections/posten-page";

export const metadata: Metadata = {
  title: "06 | Stabilität | RubikONE Köniz",
  description: "Der Körper ist ein Meisterwerk der Natur. Nur wenn wir sorgfältig und clever mit ihm umgehen, kann er stärker werden.",
};

export default function StabilitaetPage() {
  return (
    <PostenPage
      number="06"
      title="STABILITÄT"
      intro="Schon gewusst? Das Six Pack gehört zum menschlichen Bauplan und ist nur ein Übername. Denn dieser Teil der oberflächlichen Rumpfmuskulatur, auch bekannt als die gerade Bauchmuskulatur (lat. M. rectus abdominis), hat eigentlich acht «Pakete». Der Körper ist ein Meisterwerk der Natur. Wir haben einen einzigen davon und nur wenn wir sorgfältig und clever mit ihm umgehen, kann er stärker werden und uns gesund durch das Leben begleiten."
      heroImage="/images/posten/stabilitaet/466A1081-scaled-1.jpg"
      exercises={[
        {
          title: "Bergsteiger",
          reps: "12x pro Seite",
          description: "Ein Knie abwechslungsweise schnell zum Ellenbogen ziehen.",
          image: "/images/posten/stabilitaet/Vektor-Smartobjekt (1).png",
        },
        {
          title: "Superkraft",
          reps: "5x pro Seite",
          description: "Gleichzeitig einen Arm und einen Fuss heben & senken. Dann die andere Seite.",
          image: "/images/posten/stabilitaet/Vektor-Smartobjekt-1 (1).png",
        },
        {
          title: "Fangen",
          reps: "5x",
          description: "Innerhalb der Markierung einander die Hände berühren, ohne selber gefangen zu werden.",
          image: "/images/posten/stabilitaet/Vektor-Smartobjekt-2 (1).png",
        },
      ]}
      furtherExercises={[
        {
          title: "Rumpfrotation",
          description: "2x mind. 10x pro Seite | Setze dich hin und hebe die Füsse vom Boden ab. Spanne den Bauch an und rotiere jetzt den Oberkörper so weit es geht nach links und nach rechts. Halte dabei die Hände hinter dem Kopf oder vor der Brust verschränkt. Lust auf Rekordjagd? Rotiere so oft du kannst und merke dir die Anzahl. Schaffst du im nächsten Training mehr? Vereinfachung: Stelle die Fersen auf dem Boden ab.",
        },
        {
          title: "Von A nach B",
          description: "Laufe zum anderen Ende der grossen Wiese und zurück. Überwinde unterwegs so viele Hindernisse wie möglich (max. 1m Höhe). HINWEIS: Du bist für dein Handeln selbst verantwortlich. Sei dir bewusst, dass die Natur kein Sportgerät und entsprechend nicht auf Sicherheit geprüft ist. Oberflächen können rutschig, wackelig oder instabil sein. Schätze deine Fähigkeiten richtig ein.",
        },
        {
          title: "Team-Challenge: Wadenbeisser",
          description: "Ab 2 Personen: Sitzt einander gegenüber und hebt die Füsse vom Boden ab. Ihr dürft euch mit den Händen auf dem Boden abstützen. Versucht mit den Füssen die Wade der anderen Person zu berühren. Wer erzielt am meisten Treffer? Wer hält am längsten durch? Wer gewinnt 3x?",
        },
      ]}
      tagescheck="Was isst du heute Gesundes?"
      potenzial={{
        title: "Spass & Vorbild",
        content: `
          <p>Verhalte dich respektvoll gegenüber deiner Umgebung und Mitmenschen. RubikONE ist im öffentlichen Raum und wir sind dankbar, hier trainieren zu können.</p>
          <p class="mt-4">Du bist ein Vorbild in verschiedenen Hinsichten: Wenn du dich an einem Posten bewegst, animierst du andere Personen es auch zu tun! Grossartig! Gleichzeitig lebst du sorgfältigen Umgang mit der Umgebung und der Natur vor. Deshalb entsorge allfälligen Müll im Mülleimer und trampel nicht unnötig in Gärten oder Felder herum.</p>
          <p class="mt-4 font-semibold">#LEAVE NO TRACE (hinterlasse keine Spuren)</p>
        `,
      }}
      prevPosten={{ slug: "sprungkraft", title: "05 | Sprungkraft" }}
      nextPosten={{ slug: "passement", title: "07 | Passement" }}
    />
  );
}
