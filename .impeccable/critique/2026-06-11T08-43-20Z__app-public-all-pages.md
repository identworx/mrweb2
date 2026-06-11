---
target: alle öffentlichen Seiten
total_score: 26
p0_count: 1
p1_count: 3
timestamp: 2026-06-11T08-43-20Z
slug: app-public-all-pages
---
## Design Health Score

| # | Heuristik | Score | Kernproblem |
|---|-----------|-------|-------------|
| 1 | Visibility of System Status | 3 | Kein Active-State in Navigation; keine Loading-States |
| 2 | Match System / Real World | 4 | Durchweg natürliche deutsche Fachsprache |
| 3 | User Control and Freedom | 3 | Kein Zurück-zu-Ergebnissen auf Produktseiten |
| 4 | Consistency and Standards | 3 | Breadcrumb-Komponente inkonsistent |
| 5 | Error Prevention | 2 | Keine Formularvalidierung; leere Grids unbehandelt |
| 6 | Recognition Rather Than Recall | 3 | Keine Suchfunktion |
| 7 | Flexibility and Efficiency | 2 | Kein Search, kein Filter, keine Shortcuts |
| 8 | Aesthetic and Minimalist Design | 3 | Produktdetailseite zu dicht |
| 9 | Error Recovery | 2 | Nur required-Validierung; kein Custom-404 |
| 10 | Help and Documentation | 1 | Kein FAQ, keine Hilfe, keine Telefonnummer |
| **Gesamt** | | **26/40** | **Acceptable** |

## Anti-Patterns Verdict

LLM: Moderate AI-Slop-Gefahr (6/10). Eyebrow-Pattern 40+ Mal, identische Hover-Behandlung auf allen Card-Typen, formelhafte Seitenstruktur.

Detector: 1 Finding (bounce-easing auf Hero-Scroll-Pfeil). 6 Admin-Findings out of scope.

## Gesamteindruck

Technisch solide, visuell diszipliniert. Farb-System, Typografie und CMS-Architektur gut. Aber jede Unterseite fühlt sich gleich an — zusammengebaut statt gestaltet.

## What's Working

1. Typografische Disziplin (3 Fonts konsequent)
2. Echte Farb-Zurückhaltung (One-Voice Pumpkin)
3. CMS-Fallback-Architektur
4. Zero-Border-Radius konsequent

## Priority Issues

### [P0] Widersprüchliche Garantie-Angaben auf /ueber-uns
Überschrift: 3 Jahre. Body: 5 Jahre Olefin, 2 Jahre Nähte. Vertrauensbruch.
Datei: app/ueber-uns/page.tsx, Zeilen 231-244

### [P1] Eyebrow-Pattern-Monotonie (40+ Instanzen)
accent-line + pumpkin uppercase auf jeder Sektion jeder Unterseite.
Fix: Auf 30-40% reduzieren, Abwechslung einbauen.
Befehl: /impeccable layout

### [P1] Leere Grids bei fehlenden CMS-Daten
Keine Empty-States auf Listing-Seiten.
Befehl: /impeccable harden

### [P1] btn-primary nicht auf Hero beschränkt
btn-primary auf dunklen CTA-Blöcken aller Unterseiten.
Befehl: /impeccable layout

### [P2] Keine Suchfunktion
63+ Produkte, 7 Kollektionen, 9 Kategorien — keine Suche.

### [P2] Breadcrumb-Inkonsistenz
BreadcrumbBar vs Breadcrumbs direkt auf verschiedenen Seiten.

### [P2] Border-Radius-Verletzungen
rounded auf Feature-Items in /produktkategorien/[slug] und /kataloge/pflege-garantie.

### [P2] Duplizierte Statistik-Blöcke
Identischer 4-Stat-Block auf /kontakt und /ueber-uns.

## Persona Red Flags

Jordan: Kein klarer Next-Step nach Hero. Keine Telefonnummer.
Riley: Leere Grids, minimales Catch-All-Skelett.
Casey: Uppercase Mobile-Nav schwer scannbar. 2-Spalten-Grid kann überlaufen.
Thomas: Keine Suche, kein Filter, 4+ Klicks zum Produkt, generisches Kontaktformular.
Mia: Kompetent aber nicht aufregend. Klinische Farbfeld-Benennung.

## Minor Observations

- Footer text-white/40 Kontrast fraglich
- ASCII statt Umlaute in Metadata
- Catch-All direkter Prisma-Query statt CMS-Abstraktion
- News-Placeholder-Text live
- HomepageValueProps gute Eyebrow-Variation
