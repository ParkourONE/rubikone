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
        {
          title: "Linien berühren",
          description: "1x | Mit der Hand möglichst schnell alle Linien berühren. Achtung: Merke dir den Laufweg. Absolviere den Laufweg in umgekehrter Reihenfolge und berühre wieder alle Linien.",
        },
        {
          title: "Rucksack packen",
          description: "Alle Mitspieler stehen innerhalb des Feldes. Die erste Person rennt an einen Ort auf dem Platz, berührt ein Material und stellt sich zurück an den Ausgangsort. Jetzt rennen alle anderen und wiederholen, was die erste Person gerade gemacht hat. Die nächste Person rennt alleine los und berührt das erste und zusätzlich ein neu gewähltes Material. Sobald sie zurück ist, rennen die anderen los und wiederholen den Ablauf. ...solange bis jede Person mind. 3x gerannt ist.",
        },
        {
          title: "Ein-Mal-alles",
          description: "Mind. 2x pro Seite die ganze Abfolge wiederholen: 1. Auf dem linken Bein stehen und das rechte Knie umarmen. 2. Rechter Fuss weit vorne auf den Boden absetzen und die linke Hand neben dem Fuss abstützen. 3. Den Oberkörper rotieren und den rechten Arm senkrecht in Richtung Himmel strecken. 4. Position halten. Tief ein und aus atmen. 5. Zurückdrehen und die rechte Hand neben dem rechten Fuss abstützen. 6. Rechtes Bein strecken (so weit es geht) und den Fussballen weit Richtung Schienbein ziehen. 7. Fuss wieder flach hinstellen und Hände vom Boden lösen. 8. Im Ausfallschritt bleiben und Oberkörper stolz aufrichten. 9. In einem Schwung mit dem rechten Fuss abstossen und zurück in den Einbeinstand kommen. 10. Den linken Fuss erst abstellen, wenn die Balance stabil erreicht ist. Tipp: Die Übung ist auch unter «World's greatest stretch» bekannt.",
        },
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
