# Handoff — Ambiente-Galerie unter `/kollektionen`

> Für Claude Code. Ziel: Die Ambiente-Bildergalerie sinnvoll in die bestehende
> Kollektionen-Seite einbauen + eine eigene Galerie-Unterseite anlegen.
> **Referenz-Implementierung** (Design + Verhalten 1:1 übernehmen):
> - `frames/Ambiente-Galerie.html` → Variante A (Mosaik-Teaser), Abschnitt mit Badge „A"
> - `frames/Ambiente-Alle.html` → vollständige Galerieseite mit Filter + Lightbox
> Beide nutzen ausschließlich die Tokens aus `styles/tokens.css` (Kürbis-Orange, Anthrazit, Cream, Montserrat / Source Sans).

---

## 1. Was gebaut wird (zwei Teile)

**A) Teaser-Mosaik** — ein neuer Abschnitt **auf `/kollektionen`**, eingefügt
**zwischen dem Masthead/Spektrum-Band und dem Farbwelt-Karten-Raster**.
Asymmetrisches Mosaik aus 5 Bildern (1 großes Querformat, 1 hohes Hochformat,
3 kleinere). Hover: sanfter Zoom + Verlauf + Bildunterschrift (Farbwelt + Titel).
Überschrift „Mosaroma im Einsatz." mit Textlink **„Alle Ambiente-Bilder →"**.

**B) Galerie-Unterseite** unter der Route **`/kollektionen/ambiente`**.
Masthead, Farbwelt-Filter mit Zählern, Masonry-Galerie aller Bilder, Lightbox.
Der Textlink aus (A) zeigt hierauf.

---

## 2. Routing / Seitenstruktur

- Bestehende Seite: `/kollektionen` (Übersicht).
- Neue Seite: `/kollektionen/ambiente` (Galerie).
- Breadcrumb auf der Galerie: `Kollektionen › Ambiente`.
- Header/Footer der bestehenden Seiten wiederverwenden (nicht neu bauen) — in der
  Referenz ist ein vereinfachter Header drin, **nur als Platzhalter**; im echten
  Projekt die vorhandene Navi-/Footer-Komponente einsetzen.

---

## 3. Komponenten (an euren Stack anpassen)

> Stack-agnostisch beschrieben. Bei React/Vue als Komponenten, bei einem CMS/Theme
> als Partial/Block. Markup + CSS exakt aus den Referenzdateien übernehmen.

1. `AmbienteTeaser` (Abschnitt A)
   - Props/Daten: Liste von 5 `{ src, srcset, alt, world, caption, href }`.
   - Layout: CSS-Grid `grid-template-columns: repeat(6,1fr)` mit den Flächen
     `f-a … f-e` (siehe `.mos` in `frames/Ambiente-Galerie.html`).
   - „Alle Ambiente-Bilder" → Link auf `/kollektionen/ambiente`.

2. `AmbienteGallery` (Seite B)
   - `FilterBar`: Chips `Alle | Green | Blue | Earth & Grey | Golden` mit Zählern.
   - `MasonryGrid`: CSS-`columns` (kein JS-Layout nötig), `break-inside: avoid`.
   - `Lightbox`: Overlay, Vor/Zurück, Zähler „n / total", Caption, Schließen via
     ×, Klick-außerhalb und `Esc`, Pfeiltasten ← →. **Wichtig:** Lightbox blättert
     nur durch die **aktuell gefilterten** Bilder.

---

## 4. Datenmodell (CMS-fähig)

Jedes Bild:
```
{
  src:      "…-1500.jpg",        // Detailgröße
  srcset:   "…-800.jpg 800w, …-1500.jpg 1500w",
  alt:      "Beschreibung (Deutsch)",
  world:    "green" | "blue" | "earth" | "golden",   // 1+ Farbwelten (Space-separiert)
  caption:  "Mediterraner Innenhof",
  featured: true|false           // nur für Teaser-Auswahl (A)
}
```
- Filter zählt pro `world`; ein Bild kann mehreren Welten zugeordnet sein
  (z. B. `"green earth"`).
- Im CMS als wiederverwendbare „Ambiente-Bild"-Sammlung anlegen, damit Redakteure
  Bilder ohne Code ergänzen können.

---

## 5. Bilder / Performance (wichtig)

- Originale waren 7–9 MB PNG → **nicht** so ausliefern. In der Referenz auf
  **~1500 px lange Kante, JPEG q≈0.82, 120–310 KB** reduziert. Gleiche Pipeline
  im Projekt verwenden (Build-Step oder CMS-Image-Service).
- `srcset`/`sizes` für responsive Auslieferung; `loading="lazy"` für alle
  Galeriebilder außer dem ersten Teaser-Bild.
- Optional `image/avif` + `image/webp` mit JPEG-Fallback via `<picture>`.
- Lightbox lädt die Detailgröße (≤1500 px), nicht das Original.

---

## 6. Verhalten / Interaktion (1:1 aus Referenz)

- Übergänge: 200 ms Standard, Zoom 900 ms, Easing `cubic-bezier(0.16,1,0.3,1)`.
- Hover-Zoom nur auf Geräten mit `hover: hover`.
- Filter: Toggle `.hide` auf nicht passenden Kacheln; Masonry reflowt automatisch.
- Keine Bibliothek nötig — Lightbox + Filter sind ~40 Zeilen Vanilla JS
  (siehe `<script>` in `frames/Ambiente-Alle.html`). Falls ihr bereits eine
  Lightbox-Lib nutzt, gerne diese verwenden, aber Look/Verhalten beibehalten.

---

## 7. Barrierefreiheit

- Galeriekacheln als `<button>`/`<a>` fokussierbar; Lightbox mit `role="dialog"`,
  `aria-modal="true"`, Fokus-Falle, Rückgabe des Fokus auf die auslösende Kachel
  beim Schließen.
- `Esc` schließt, `←/→` blättert; sichtbarer Fokusring (2 px Kürbis-Orange).
- Jedes Bild braucht aussagekräftiges `alt`.
- `prefers-reduced-motion`: Zoom/Übergänge reduzieren.

---

## 8. Design-Tokens (nicht neu erfinden)

Alle Farben/Abstände/Radien/Schatten aus `styles/tokens.css` bzw. dem Design-System
verwenden: `--mos-orange`, `--mos-anthracite`, `--mos-cream`, `--radius-md` (6 px),
`--shadow-1/-2/-hero`, Schriften `--font-display` (Montserrat) / `--font-body`
(Source Sans 3). Keine neuen Farben, keine Gradients als Flächen.

---

## 9. Definition of Done

- [ ] Teaser-Mosaik sitzt auf `/kollektionen` zwischen Spektrum-Band und Karten-Raster.
- [ ] „Alle Ambiente-Bilder" verlinkt auf `/kollektionen/ambiente`.
- [ ] Galerie filtert nach Farbwelt (mit korrekten Zählern).
- [ ] Lightbox: Vor/Zurück, Zähler, Esc/Klick-außerhalb/×, Pfeiltasten, nur gefilterte Bilder.
- [ ] Bilder responsive + lazy, keine Datei > ~350 KB.
- [ ] Tastatur-/Screenreader-tauglich, `prefers-reduced-motion` beachtet.
- [ ] Nur Design-System-Tokens, visuell identisch zur Referenz.
```
```
```

---

### Hinweis an Claude Code
Bau das Markup/CSS **aus den beiden Referenzdateien** nach und gieße es in unsere
bestehenden Komponenten/Templates (Header, Footer, Routing). Die Referenzdateien
sind absichtlich eigenständig (eigener Mini-Header) — diesen Teil durch unsere
echten Layout-Komponenten ersetzen.
