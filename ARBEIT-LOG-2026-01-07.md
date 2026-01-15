# Arbeitslog RubikONE Website - 7. Januar 2026

## Kundenfeedback bearbeitet

### 1. Scroll-to-top Fix
**Problem:** Beim Klicken auf Links landete man immer zuunterst auf der Seite statt oben.

**Lösung:** `src/providers/lenis-provider.tsx` angepasst - scrollt jetzt bei jeder Navigation automatisch nach oben.

**Commit:** `0e9c57a`

---

### 2. Postenpaket-Anzeige im Konfigurator
**Problem:** Bei der Paketauswahl war unklar, warum man auf 100'000 CHF kommt. Das Postenpaket wurde nicht angezeigt.

**Lösung:** Im Konfigurator-Footer wird jetzt neben dem Preis auch das Paket mit Postenanzahl angezeigt, z.B. "Standard (9 Posten)".

**Datei:** `src/components/sections/configurator-overlay.tsx`

**Commit:** `0e9c57a`

---

### 3. Text Update - Lerndimensionen
**Problem:** Text "Drei Schwierigkeitsstufen pro Posten machen es inklusiv" sollte geändert werden.

**Lösung:**
- Vorher: *"Von 6 bis 96 – RubikONE spricht alle an. Drei Schwierigkeitsstufen pro Posten machen es inklusiv."*
- Nachher: *"Von 6 bis 96 – RubikONE spricht alle an. Fünf Lerndimensionen machen Bewegung für alle zugänglich."*

**Datei:** `src/lib/constants.ts` (Zeile 172)

**Commits:** `0e9c57a`, `52887ef` (Korrektur: 5 statt 9 Lerndimensionen)

---

### 4. Text Update - Fundamente
**Problem:** "Kein Tiefbau, keine Fundamente" war nicht korrekt - es gab kleine Fundamente für die Schilder.

**Lösung:**
- Vorher: *"Kein Tiefbau, keine Fundamente. Nur Schilder und Bodenmarkierungen. Denkmalschutz-kompatibel bewiesen in Köniz."*
- Nachher: *"Kein Tiefbau, nur kleine Fundamente für die Schilder. Denkmalschutz-kompatibel bewiesen in Köniz."*

**Datei:** `src/lib/constants.ts` (Zeile 167)

**Commit:** `0e9c57a`

---

### 5. Pricing Buttons -> Konfigurator
**Problem:** Die "Anfragen"-Buttons bei den Preispaketen führten zur Kontaktseite statt zum Preisberechner.

**Lösung:** Links von `/kontakt` auf `/konfigurator` geändert.

**Datei:** `src/components/sections/pricing-section.tsx`

**Commit:** `b4dbc22`

---

### Nicht behoben (nicht möglich)
**Spam-Problem:** E-Mails vom Konfigurator landen im Spam. Dies liegt an der E-Mail-Server-Konfiguration (SPF/DKIM Records) und kann nicht im Code behoben werden.

---

## Commits (chronologisch)
1. `0e9c57a` - fix: Customer feedback - scroll behavior, pricing clarity, text updates
2. `52887ef` - fix: Correct Lerndimensionen count to 5
3. `b4dbc22` - fix: Pricing package buttons now open configurator instead of contact

---

## Nächste Schritte
- Weitere Kundenfeedback-Runden
- E-Mail Spam-Problem separat mit Hosting/DNS klären
