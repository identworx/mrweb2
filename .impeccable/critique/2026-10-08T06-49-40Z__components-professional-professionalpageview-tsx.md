---
target: Professional-Seite (/professional) nach Redesign
total_score: 23
p0_count: 0
p1_count: 3
timestamp: 2026-10-08T06-49-40Z
slug: components-professional-professionalpageview-tsx
---
## Design Health Score

| # | Heuristik | Score | Befund |
|---|-----------|-------|--------|
| 1 | Sichtbarkeit Systemstatus | 2 | Breadcrumb als 11px-Leiste unter dem Hero kaum wahrnehmbar; Sektions-IDs existieren, werden aber nirgends verlinkt |
| 2 | System ↔ Realität | 3 | „SDP“, „Topgun“, „Olefin“ ohne Inline-Erklärung; Karte „Markisen & Schirme“ zeigt ein Sofa |
| 3 | Kontrolle & Freiheit | 3 | Beide CTAs führen ins volle Kontaktformular; kein Telefon/Mail-Direktweg auf der Seite |
| 4 | Konsistenz | 2 | Seite siezt, Kontaktformular duzt; Karten-Titel mal Montserrat (Materialien), mal Source Sans (Anwendungen); CTA-H2 ohne Grund kleiner |
| 5 | Fehlervermeidung | 2 | Einkäufer kann vor der Anfrage nicht prüfen, ob Menge/Breite/Anwendung passt |
| 6 | Wiedererkennen statt Erinnern | 3 | Anwendung ↔ Material wird nicht verknüpft („geeignet für Sonnensegel“ steht nur bei SDP) |
| 7 | Flexibilität & Effizienz | 1 | Kein Datenblatt, keine Farbkarte, kein Direktkontakt – der Profi-Pfad fehlt |
| 8 | Ästhetik & Minimalismus | 3 | Nichts Überflüssiges, aber Service ist 500px hoch für neun Wörter; Materialien zu luftig |
| 9 | Fehlererkennung | 3 | Kontaktformular mit role="alert"/aria-describedby (aus Kontaktseite abgeleitet) |
| 10 | Hilfe & Doku | 1 | „Stoff- & technische Daten“ nur im Footer, nicht kontextuell an den Materialien |
| **Gesamt** | | **23/40** | **Acceptable – solide Basis, Kernaufgabe (qualifizierte B2B-Anfrage) nur halb erfüllt** |

## Anti-Patterns-Verdict

**LLM-Bewertung:** Ein geübtes Auge sagt beim ersten Scroll „Template“. Nicht wegen Schrift oder Farbe – das Designsystem ist echt – sondern weil jede Sektion mit derselben Grammatik beginnt (Akzentlinie + Eyebrow + H2 + Subline, 5× inkl. Hero) und mit demselben Raster endet (3 gleiche Bilder, 2 gleiche Flächen, 3 gleiche Icon+Label-Reihen). Dazu drei Anthrazit-Blöcke am Stück (Service → CTA → Footer, ~750px Monolith) und 10rem Section-Padding für jede Sektion unabhängig vom Inhalt (DESIGN.md erlaubt max. 8rem). Echte Markenstimme: Hero-Foto mit Ast und Glasarchitektur, scharfe Kanten, sparsames Pumpkin, die Zeile „Farbe in der Faser“.

**Deterministischer Scan (Browser-Detektor, 11 Funde):** `repeated-section-kickers` ×5 (Anwendungen, Materialien, Service, Kontakt + Cookie-Banner) – deckt sich exakt mit dem LLM-Befund. `hero-eyebrow-chip` über der H1. `line-length` ~93 Zeichen ×2 (Materialien-Intro und Karten-Beschreibung bei 15px in 560px). `ai-color-palette` ×5 und `repeating-stripes-gradient` – das sind die Teal-/Streifen-Platzhalter der lokalen Umgebung, auf der Live-Seite durch Fotos ersetzt (bei Materialien/CTA noch nicht). `overused-font` Montserrat 49 % – angesichts Montserrat als Headline-Font vertretbar. Falsch-positiv: `low-contrast 1.1:1 weiß auf #faf8f5` und `thin-border-wide-shadow` stammen aus dem Cookie-Banner/Overlay, nicht aus der Seite. CLI-Scan der TSX-Dateien: 0 Funde (die Muster entstehen erst im gerenderten DOM).

**Visuelle Overlays:** Kein Nutzer-Browser in dieser Umgebung; Detektor lief per Playwright im Headless-Chromium, keine sichtbaren Overlays.

## Gesamteindruck

Der Hero ist der Peak der Seite und trägt die Marke: Foto, Headline unten links, ein Button. Danach fällt die Kurve. Anwendungen wiederholen das Segel-Motiv, Materialien zeigen leere Flächen, Service zeigt Piktogramme, und das Ende verspricht einen „Ansprechpartner“ und liefert eine GmbH plus beige Fläche. Die größte Chance: Die Materialien-Sektion vom leersten zum reichsten Teil der Seite machen – mit Kennwerten, Datenblatt und Verknüpfung zu den Anwendungen – und den Schluss mit einem echten Menschen beenden.

## Was funktioniert

1. **Hero-Komposition** – Eyebrow/H1/Subline/Button als 4-Zeilen-Hierarchie unten links, Foto oben rechts, Ast als Rahmen. Das ist „Garten-Salon“.
2. **„Solution-Dyed – Farbe in der Faser“** – technisch, bildhaft, markentypisch; typografisch sauber mit `text-wrap: balance`.
3. **Pumpkin-Disziplin** – nur Buttons, Akzentlinien, Eyebrows. Keine Farbinflation.

## Prioritäts-Issues

**[P1] Keine technische Substanz vor der Anfrage** – B2B-Einkäufer qualifizieren über Breite, g/m², Lichtechtheit, Farbanzahl, Mindestmenge. Ohne Daten fragen die Falschen an oder niemand. **Fix:** Materialien-Karten um eine Kennwert-Zeile erweitern (CMS-Felder: 3–4 Label/Wert-Paare je Material, `dl` zweispaltig, Josefin-Label + Source-Sans-Wert) plus Link „Datenblatt (PDF)“ (CMS-Upload) als `btn-outline`; Anwendungs-Karten mit „Empfohlen: SDP“-Zeile verknüpfen. **Befehl:** `/impeccable clarify`

**[P1] Service + CTA + Footer = dunkler Monolith** – 750px Anthrazit ohne Trenner; neun Wörter Service rechtfertigen keine eigene dunkle Sektion, der CTA verliert seine Bühne. **Fix:** Service als kompaktes Band auf Warm-Linen (`py-12`, drei Items inline, Trennlinie oben), CTA bleibt der einzige dunkle Block – oder CTA auf Pumpkin (bereits per Dropdown möglich, Button wird dann automatisch Outline-Weiß). **Befehl:** `/impeccable layout`

**[P1] CTA verspricht Ansprechpartner, zeigt keinen** – Peak-End-Regel verletzt: das Ende ist der schwächste Moment. **Fix:** Rechts Porträt der Kontaktperson (CMS-Bild ist schon da), darunter Name, Funktion, Telefon und E-Mail als Textlinks (neue CMS-Felder). Ohne Porträt: Titel auf „Direkt aus Oyten“ und Telefonnummer prominent. **Befehl:** `/impeccable delight`

**[P2] Scaffold-Grammatik fünfmal** – Akzentlinie + Eyebrow + H2 ist das stärkste AI-Tell, vom Detektor bestätigt. **Fix:** Eyebrow nur im Hero; Sektionen starten mit H2, Akzentlinie bleibt als einziges Punktuationszeichen (ist in DESIGN.md verankert). Service ohne H2, Items als Liste. **Befehl:** `/impeccable distill`

**[P2] Einheitliches 10rem-Padding, kein Rhythmus** – Materialien wirken leer, Service aufgebläht. **Fix:** Content-Sektionen `py-20 lg:py-28`, Service `py-12`; Materialien-Flächen 16:9 → 3:2 (Textur-Nahaufnahme, sobald Fotos da sind); Intro-Breite auf `max-w-[48ch]` für ≤80 Zeichen/Zeile. **Befehl:** `/impeccable polish`

## Persona-Red-Flags

- **Jordan (Erstbesucher):** „SDP“, „Topgun“, „Olefin“ unerklärt. Sofa unter „Markisen & Schirme“. Unklar, ob Privatkunden hier richtig sind.
- **Casey (Mobil):** Hero-Button im oberen Viertel, nicht in der Daumenzone. Materialien-Platzhalter je ~200px ohne Inhalt. CTA-Bild `min-h-[260px]` unter dem Text = 260px Fläche ohne Funktion.
- **Riley (Stress-Tester):** 4. Anwendung bricht das 3er-Raster auf 3+1. 3. Material wiederholt Gradient 1. Langer Service-Titel bricht neben 48px-Icon dreizeilig. Ohne Hero-Bild: Teal-Gradient mit Pumpkin-Eyebrow – markenfremde Farbe.
- **„Thorsten“ (Einkäufer Markisenbau, nach PRODUCT.md):** Sucht Rollenbreite, g/m², Lichtechtheit, UV-Standard, Farbkarte, MOQ, Lieferzeit. Findet nichts. Muss ein Formular ausfüllen, um zu erfahren, ob das Produkt überhaupt in Frage kommt. „Kleine Mengen auf Anfrage“ ohne Zahl ist für ihn ein Nicht-Satz.

## Kleinere Beobachtungen

- Hero-Umbruch „Sonnen- / und Regenschutz“: Trennstrich am Zeilenende liest sich wie Silbentrennung → `max-w` erhöhen oder Umbruch vor „Regenschutz“ erzwingen.
- Eyebrow `#AB5D0D` auf blauem Himmel grenzwertig lesbar → auf Foto Weiß/80.
- Service-Eyebrow weiß/70 auf dunkel – einziger Sektionsstart ohne farbigen Eyebrow, wirkt wie ein Fehler (entfällt bei Fix P2).
- Icons 48px vs. Label 15px – Icon dominiert.
- Breadcrumb-Bar als weiße Leiste direkt unter dem Hero bricht den Übergang.
- Footer-Kollektionen (Green, Blue, Red…) sprechen B2C an – auf Professional wäre ein B2B-Footerblock sinnvoll.
- Kontaktformular duzt („Bitte gib…“), Seite siezt – bestehender Befund außerhalb dieser Seite.

## Fragen

1. Warum hat eine Seite für technisch versierte Einkäufer keine einzige Zahl?
2. Wenn die Materialien-Sektion das Herz ist – warum ist sie die leerste Sektion und nicht die reichste?
3. Wer ist der Ansprechpartner in Oyten, und warum darf er sein Gesicht nicht zeigen?
