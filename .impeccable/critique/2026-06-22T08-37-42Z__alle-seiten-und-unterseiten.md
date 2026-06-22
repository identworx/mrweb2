---
target: alle Seiten und Unterseiten
total_score: 22
p0_count: 1
p1_count: 2
timestamp: 2026-06-22T08-37-42Z
slug: alle-seiten-und-unterseiten
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Header hat keinen aktiven Link-Indikator für aktuelle Seite |
| 2 | Match System / Real World | 3 | Fachbegriffe ohne Erklärung beim ersten Auftreten |
| 3 | User Control and Freedom | 2 | Keine Suchfunktion, kein "Zurück zu Ergebnissen" |
| 4 | Consistency and Standards | 3 | Zwei Breadcrumb-Komponenten, max-w Inkonsistenz |
| 5 | Error Prevention | 2 | Keine Custom-404, keine Error-Boundary |
| 6 | Recognition Rather Than Recall | 3 | Gute Breadcrumbs, aber keine Suche |
| 7 | Flexibility and Efficiency | 1 | Keine Suche, keine Shortcuts |
| 8 | Aesthetic and Minimalist Design | 3 | Eyebrow-Monotonie flacht Hierarchie ab |
| 9 | Error Recovery | 2 | Keine Custom-404 |
| 10 | Help and Documentation | 1 | Kein FAQ, kein Glossar |
| **Total** | | **22/40** | **Acceptable** |

## Anti-Patterns Verdict

LLM: 6/10 AI-Slop-Risiko. Eyebrow auf jeder Section (100+ Instanzen), 10+ identische CTA-Closer, identische Icon-Card-Grids. Positiv: Kein Gradient-Text, keine Glassmorphism, keine Side-Stripes.

Detector: 14 Findings, 13 nur Admin (gray-on-color). 1 Public: animate-bounce auf Hero-Scroll-Indikator.

## Priority Issues

[P0] Kein Skip-to-Content-Link — WCAG 2.1 Level A Failure.
[P1] Eyebrow/Accent-Line-Monotonie — 100+ identische Section-Header zerstören visuelle Priorität.
[P1] Fehlende Suchfunktion — B2B-Wiederkäufer ohne direkte Navigation.
[P2] Consent-Komponenten brechen Sharp-Edge-Markenidentität — rounded-xl als erste Interaktion.
[P2] Identische CTA-Closer auf jeder Seite — Peak-End-Rule verletzt.

## Persona Red Flags

Jordan (First-Timer): Keine Suche, Vokabular-Barriere, keine Preissignale.
Casey (Mobile): NERIO zu lang, 9px Spec-Labels, Sticky-Nav frisst Viewport.
Sam (Accessibility): Kein Skip-Link, Hex-Code Color-Titles, fehlende Focus-Visible.
B2B-Einkäufer: Keine MOQ/Lieferzeiten, generisches 3-Feld-Formular, "Muster auf Anfrage" in 40% Opacity.

## Minor Observations

- max-w-[1440px] vs max-w-[1400px] Inkonsistenz
- Olefin-Tags und HomepageImageTextFeature brechen Sharp-Edge-Regel
- showAmbiente toter Code (immer true)
- animate-bounce auf Homepage veraltet
- Duplizierter DataRow Component
- Kein main#main Landmark

## Questions

1. Was wenn der Eyebrow von 80% der Sections verschwände?
2. Was passiert wenn B2B-Procurement-Teams diese Seite nutzen?
3. Könnte die Ambiente-Galerie die Homepage sein?
