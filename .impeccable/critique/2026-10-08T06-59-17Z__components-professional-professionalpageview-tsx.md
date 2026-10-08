---
target: Professional-Seite (/professional) nach Stufe 1
total_score: 27
p0_count: 0
p1_count: 1
timestamp: 2026-10-08T06-59-17Z
slug: components-professional-professionalpageview-tsx
---
## Design Health Score (Re-Critique nach Stufe 1)

| # | Heuristik | Score | Befund |
|---|-----------|-------|--------|
| 1 | Sichtbarkeit Systemstatus | 2 | Breadcrumb weiterhin unauffällig; Sektions-IDs nicht verlinkt |
| 2 | System ↔ Realität | 3 | Fachbegriffe (SDP, Topgun, Olefin) weiterhin ohne Inline-Erklärung; Sofa-Bild (Inhalt vom Kunden) |
| 3 | Kontrolle & Freiheit | 4 | E-Mail (und Telefon, sobald im CMS gepflegt) als Direktweg neben dem Formular-CTA |
| 4 | Konsistenz | 3 | Kartentitel einheitlich Montserrat, CTA-H2 auf Standardgröße; Formular-Duzen bleibt (außerhalb der Seite) |
| 5 | Fehlervermeidung | 2 | Unverändert: keine Vorqualifikation vor der Anfrage (Stufe 2) |
| 6 | Wiedererkennen statt Erinnern | 3 | Anwendung ↔ Material weiterhin nicht verknüpft (Stufe 2) |
| 7 | Flexibilität & Effizienz | 2 | Direkt-Mail vorhanden; Datenblatt/Farbkarte fehlen (Stufe 2) |
| 8 | Ästhetik & Minimalismus | 4 | Eyebrows nur im Hero, Service als kompaktes Band, Padding nach Inhalt, Monolith aufgelöst |
| 9 | Fehlererkennung | 3 | Unverändert |
| 10 | Hilfe & Doku | 1 | Unverändert: technische Daten nicht kontextuell verlinkt (Stufe 2) |
| **Gesamt** | | **27/40** | **Acceptable → an der Grenze zu Good; verbleibende Lücken sind inhaltlich (Stufe 2)** |

## Anti-Patterns-Verdict

**Deterministischer Scan (Browser-Detektor): 11 → 9 Funde.** Verschwunden: `repeated-section-kickers` ×5, `hero-eyebrow-chip`, `line-length` ×2. Neu und behoben im selben Durchgang: `all-caps-body` (41 Zeichen Service-Label in Uppercase → jetzt Josefin-Label in Groß-/Kleinschreibung). Verbleibend: `ai-color-palette` ×5 und `repeating-stripes-gradient` = lokale Bild-Platzhalter (live durch Fotos ersetzt, Materialien/CTA folgen); `overused-font` Montserrat 48 % (Headline-Font, vertretbar); `low-contrast` und `thin-border-wide-shadow` aus dem Cookie-Banner (falsch-positiv).

**LLM-Bewertung:** Die Scaffold-Grammatik ist weg, die Seite hat jetzt Rhythmus (weiß → creme → creme-Band → dunkel) und einen klaren Schluss. Der Hero bricht sauber vor „Regenschutz“ um. Das Service-Band liest sich als Fußzeile der Materialien-Sektion – zwei Creme-Flächen hintereinander sind durch die Trennlinie ausreichend geschieden, sollten aber mit echten Material-Fotos nochmal geprüft werden.

## Behoben (gegenüber 23/40)
- [P1] Service + CTA + Footer-Monolith → Service hell und kompakt, CTA einziger dunkler Block
- [P1] CTA-Versprechen „Ansprechpartner“ → „Direkt aus Oyten“ + Firmen-E-Mail/Telefon als Links (Kundenentscheidung: keine Person)
- [P2] Scaffold-Grammatik → Eyebrow nur im Hero
- [P2] Einheitliches Padding → nach Inhalt variiert, Materialien 3:2, Zeilenlänge ≤ 80 Zeichen
- Minor: Hero-Umbruch, Eyebrow-Kontrast auf Foto, Kartentitel-Font, CTA-H2-Größe, auto-fit-Raster für 4+ Karten, Icon-Größe

## Offen (Stufe 2 – braucht CMS-Felder und Inhalte vom Büro)
- [P1] Technische Substanz: Kennwerte je Material (Breite, g/m², Lichtechtheit, Farbanzahl), Datenblatt-Download, MOQ-Zahl bei „Kleine Mengen“
- [P2] Anwendung ↔ Material verknüpfen („Empfohlen: SDP“)
- [P2] Fachbegriffe inline erklären (Tooltip/Kurzsatz bei SDP, Topgun, Olefin)
- [P3] Breadcrumb-Leiste prominenter oder in den Hero integrieren; B2B-Footerblock statt B2C-Kollektionsliste
- Inhalte: Material-Fotos (Textur-Nahaufnahmen), CTA-Bild, passendes Bild für „Markisen & Schirme“, Telefonnummer im Footer-CMS pflegen
