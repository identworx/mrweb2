# Mosaroma Admin CMS — Usability Re-Audit

**Datum:** 2026-06-24
**Perspektive:** Nicht-technischer Mosaroma-Mitarbeiter ohne Entwicklungshintergrund
**Methode:** Systematische Nachprüfung aller Admin-Bereiche nach Umsetzung von 8 Fixes
**Scope:** Admin-Backend, alle Edit-Forms, Listen, Medienverwaltung, Einstellungen
**Vorheriger Score:** 27 / 40 (erstes Audit, gleiches Datum)

---

## A. Executive Summary

Das Mosaroma Admin-Backend hat sich seit dem ersten Audit **messbar verbessert**. Die drei damals identifizierten Haupthürden wurden gezielt adressiert:

1. **Rechtliche Seiten** — Vollständig geschützt: Lösch-/Archivierungssperre, Warn-Banner, gesperrtes Status-Dropdown, API-Schutz. ✅ Erledigt.

2. **Verstreute Kontaktdaten** — Info-Hinweise in FooterEditForm und SettingsForm erklären die Fallback-Kette. ✅ Erledigt.

3. **Technische Begriffe** — Fortschritt: Href→Link, Seitentypen deutsch, Alt-Text-Hilfe, Status-Hinweise, Logout→Abmelden. Aber der PageSectionEditForm enthält weiterhin umfangreiches Englisch (CTA, Style, Subheadline, Features, Benefits, Bulletpoints, Highlights, Tags, Label, Helper).

**Gesamtbewertung:** Das CMS ist jetzt **für einen eingewiesenen Bediener gut nutzbar**. Die kritischste Lücke (Rechtsschutz) ist geschlossen. Die größte verbleibende Hürde ist das fehlende Unsaved-Changes-Warning — ein Bediener kann Arbeit lautlos verlieren.

---

## B. Score: 30 / 40 (vorher: 27 / 40, +3)

| Kategorie | Vorher | Jetzt | Veränderung | Begründung |
|-----------|--------|-------|-------------|------------|
| Admin-Navigation & Informationsarchitektur | 4 / 5 | 4 / 5 | = | „Abmelden" korrigiert. Breadcrumbs nach wie vor inkonsistent (4/9 Seiten). Kein Hilfe-Link. |
| Verständlichkeit der Begriffe | 2 / 5 | 3 / 5 | +1 | Seitentypen deutsch, Href→Link, Status-Hinweise, Alt-Text-Hilfe — wichtigste Alltagsbegriffe korrigiert. Aber PageSectionEditForm hat noch ~20 englische Labels (CTA, Style, Subheadline, Benefits, Features, Bulletpoints, Highlights, Tags, Label, Helper). |
| Formularlogik & Gruppierung | 4 / 5 | 4 / 5 | = | Status-Hinweise ergänzt. Section-Editor weiterhin 31 Styles in ungruppieter Flachliste. |
| Medienverwaltung | 4 / 5 | 4 / 5 | = | Alt-Text-Hilfetext ergänzt. Suchfeld weiterhin generisch „Suchen..." ohne Angabe, was durchsucht wird. |
| Redaktionsworkflow | 3 / 5 | 3 / 5 | = | Status-Hinweise helfen bei Orientierung. Kein Vorschau-Button, kein Autor-Feld bei News, kein Auto-Save. |
| Fehlerschutz | 3 / 5 | 4 / 5 | +1 | Rechtliche Seiten vollständig geschützt (P0 erledigt). Aber: Kein beforeunload-Warning, 5× native confirm(), Produkte-Archivierung ohne Bestätigung. |
| Selbsterklärbarkeit ohne Schulung | 3 / 5 | 4 / 5 | +1 | Kontaktdaten-Hinweise, Downloads-Hinweis, Seitentypen verständlich, „Geschützt"-Badge. Section-Editor braucht weiterhin Einweisung. |
| Konsistenz zwischen Bereichen | 4 / 5 | 4 / 5 | = | Logout→Abmelden korrigiert. Neu entdeckt: Produkte-Statusbadges inkonsistent („Live"/„Archiv" statt „Veröffentlicht"/„Archiviert"). 5× native confirm() neben ConfirmDialog. |

---

## C. Erledigte Findings (8 von 19)

| Finding | Prio | Status | Verifizierung |
|---------|------|--------|---------------|
| **F1:** Kein Sonderschutz für rechtliche Seiten | P0 | ✅ Erledigt | Warn-Banner, gesperrtes Status-Dropdown, DangerZone deaktiviert, API-Schutz (403), „Geschützt"-Badge in Seitenliste |
| **F2:** Verstreute Kontaktdaten ohne Erklärung | P1 | ✅ Erledigt | FooterEditForm: „Diese Kontaktdaten werden im Footer und auf der öffentlichen Kontaktseite angezeigt." SettingsForm: „Diese E-Mail wird als Fallback verwendet, wenn im Footer keine E-Mail hinterlegt ist." |
| **F4:** „Href" als Feldlabel | P1 | ✅ Erledigt | Button Href→Button-Link, Primär Href→Primär-Link, Sekundär Href→Sekundär-Link, CTA 1/2 Href→CTA 1/2 Link |
| **F5:** Seitentypen als rohe Enums | P2 | ✅ Erledigt | Deutsche Labels in Dropdown (Startseite, Standardseite, etc.) und Listenseite (typeLabels-Map mit Fallback) |
| **F7:** Alt-Text ohne Erklärung | P2 | ✅ Erledigt | Hilfetext: „Bildbeschreibung für Suchmaschinen und Screenreader. Kurz beschreiben, was auf dem Bild zu sehen ist." |
| **F9:** Statuswechsel ohne Hinweis | P2 | ✅ Erledigt | „Nur veröffentlichte Inhalte sind öffentlich sichtbar." in PageEditForm, NewsEditForm, ProductEditForm. CollectionEditForm hat eigene, detailliertere Variante. |
| **F10:** Downloads↔Katalogseite unklar | P2 | ✅ Erledigt | „Downloads vom Typ Katalog erscheinen automatisch auf der öffentlichen Katalogseite." |
| **F12:** „Logout" statt „Abmelden" | P3 | ✅ Erledigt | AdminShell Sidebar: „Abmelden" |

---

## D. Verbleibende Findings (11 von 19)

### P1 — Wichtig

**F3: Keine Warnung bei ungespeicherten Änderungen** — OFFEN
Kein einziges Formular implementiert `beforeunload`. Kein `isDirty`-Tracking. Ein Bediener, der 20 Minuten am Section-Editor arbeitet und versehentlich einen Sidebar-Link klickt, verliert alle Änderungen lautlos. Dies ist die **größte verbleibende Usability-Lücke**.

### P2 — Sinnvoll

**F6: Section-Editor — Styles ungruppiert** — OFFEN
Jetzt 31 Styles (vorher 21 erwähnt, nicht-Helper-Styles) in einer flachen `<select>`-Liste ohne `<optgroup>`. Viele Style-Namen sind seitenspezifisch, aber nicht nach Verwendungszweck gruppiert.

**F8: Englische Labels in Section-Feldern** — OFFEN
Weiterhin umfangreiche englische Begriffe im PageSectionEditForm:
- Überschriften: CTA Buttons, Feature Cards, Bulletpoints, Highlights, Benefits, Tags
- Felder: Style, Button Label, Primär Label, Sekundär Label, Subheadline, CTA 1/2 Label
- System: Helper-Section, Settings JSON
- Auch in FooterEditForm: Footer CTA, Social Links, Button-Label, Bottom-Hinweis
- Auch in FabricAdminList: Swatch, Icon Key, Subtitle, Hub

**F11: Unterschied Stoffbibliothek vs. Materialien unklar** — OFFEN
Zwei getrennte Sidebar-Menüpunkte ohne Erklärung des Unterschieds.

### P3 — Nice-to-have

| Finding | Status | Kommentar |
|---------|--------|-----------|
| **F13:** Sortier-Pfeile im Section-Editor zu klein | OFFEN | Kein Drag&Drop, Unicode-Dreiecke |
| **F14:** Kein Vorschau-Button | OFFEN | Nur CollectionEditForm hat „Öffentliche Seite ansehen ↗" |
| **F15:** MediaBrowser Suchfeld ohne konkreten Hinweis | OFFEN | „Suchen..." sagt nicht was durchsucht wird |
| **F16:** MIME-Types roh angezeigt | OFFEN | „image/webp" statt „WebP-Bild" |
| **F17:** Kein Autor-Feld bei News | OFFEN | Für Redaktionsworkflow fehlt Autor-Zuordnung |
| **F18:** Interne Typ-Werte sichtbar | OFFEN | „Typ (intern): CUSTOM" im Section-Editor |
| **F19:** JSON-Fallback-Editor | OFFEN | Kann bei unbekannten Styles erscheinen |

---

## E. Neu entdeckte Findings

### N1 (P2): Produkte-Statusbadges inkonsistent
`ProductAdminList` zeigt „Live" und „Archiv" statt „Veröffentlicht" und „Archiviert". Alle anderen Listen (Seiten, Kollektionen, News) verwenden die korrekten Begriffe. Zusätzlich zeigen die Filter-Buttons auf derselben Seite „Veröffentlicht" — Badge und Filter widersprechen sich.

### N2 (P2): 5× native confirm() statt ConfirmDialog
Diese Dateien verwenden `confirm()` (Browser-Standarddialog) statt des gestylten `ConfirmDialog`:
- `PageSectionsEditor.tsx` — Section löschen
- `ProductAdminList.tsx` — Produkt löschen
- `FabricAdminList.tsx` — Stoff/Familie/Produktart löschen
- `SubmissionDetail.tsx` — Anfrage löschen
- `FabricSwatchEditForm.tsx` — Farbmuster löschen

### N3 (P3): 10× native alert() für Fehlermeldungen
`ListActions.tsx`, `SubmissionDetail.tsx`, `FabricSwatchEditForm.tsx`, `FabricAdminList.tsx` verwenden `alert()` statt Inline-Fehlermeldungen. Wirkt ungepflegt.

### N4 (P2): Produkte-Archivierung ohne Bestätigung
In `ProductAdminList` erfolgt die Archivierung per Klick auf ein Icon ohne Bestätigungsdialog — anders als bei allen `ListActions`-Nutzern.

### N5 (P3): Breadcrumbs inkonsistent
Nur 4 von 9 Listenseiten haben Breadcrumbs (News, Downloads, Materialien, Medien). Seiten, Kollektionen, Produkte, Produktgruppen, Stoffbibliothek haben keine.

### N6 (P3): Kein Hilfe-Link im Admin
Kein Hilfe-, Dokumentations- oder Support-Link in Sidebar oder Header. Für Erstbediener fehlt jede Orientierungshilfe.

---

## F. Bedienbarkeits-Matrix (aktualisiert)

| Admin-Bereich | Aufgabe | Vorher | Jetzt | Kommentar |
|---------------|---------|--------|-------|-----------|
| Rechtliche Seiten | Versehentlich löschen | ❌ Schlecht | ✅ Geschützt | P0 fix: Lösch-/Archiv-/Depublizierungsschutz |
| Rechtliche Seiten | Impressum finden | ❌ Schlecht | ⚠️ Mittel | „Geschützt"-Badge in Liste, aber kein dedizierter Sidebar-Zugang |
| Footer | Kontaktdaten ändern | ⚠️ Mittel | ✅ Gut | Hinweis erklärt Kontaktseite-Verbindung |
| Einstellungen | E-Mail ändern | ⚠️ Mittel | ✅ Gut | Fallback-Hinweis vorhanden |
| Seiten | Seitentyp verstehen | ❌ Schlecht | ✅ Gut | Deutsche Labels im Dropdown und Liste |
| Medien | Alt-Text pflegen | ⚠️ Mittel | ✅ Gut | Hilfetext erklärt Zweck |
| Downloads | Katalog-Zusammenhang | ⚠️ Mittel | ✅ Gut | Info-Hinweis auf Listenseite |
| Produkte | Status verstehen | ⚠️ Mittel | ✅ Gut | Status-Hinweis vorhanden |
| News | Veröffentlichung | ⚠️ Mittel | ✅ Gut | Status-Hinweis vorhanden |
| Seiten | Section bearbeiten | ⚠️ Mittel | ⚠️ Mittel | Englische Begriffe bleiben, Styles ungruppiert |
| Alle Formulare | Ungespeicherte Änderungen | ❌ Kein Schutz | ❌ Kein Schutz | Keine Verbesserung — größte Lücke |

---

## G. Empfehlung

### Score-Vergleich: 27 → 30 / 40 (+3 Punkte, +11%)

Die 8 umgesetzten Fixes haben die **kritischsten Lücken geschlossen** (Rechtsschutz P0, Kontaktdaten P1, Href-Labels P1) und die Selbsterklärbarkeit im Alltag verbessert. Der verbleibende Abstand zu 40/40 besteht aus:

- **1 struktureller Lücke** (P1): beforeunload-Warning
- **Terminologie-Rückstand** im Section-Editor (P2): ~20 englische Labels
- **Konsistenz-Kleinkram** (P2–P3): Products-Badges, native confirm(), Breadcrumbs

### Empfehlung: **Option 2 — 2–3 letzte Mikro-Fixes, dann einfrieren**

| # | Fix | Prio | Aufwand | Wirkung |
|---|-----|------|---------|---------|
| 1 | Products-Statusbadges vereinheitlichen: „Live"→„Veröffentlicht", „Archiv"→„Archiviert" | P2 | 2 Werte | Hoch (Konsistenz) |
| 2 | native `confirm()` → `ConfirmDialog` in PageSectionsEditor + ProductAdminList | P2 | 2 Dateien | Mittel (Konsistenz) |
| 3 | Stoffbibliothek/Materialien Info-Hinweis | P2 | 2 Zeilen | Mittel (Selbsterklärbarkeit) |

**Nicht empfohlen für diese Runde:**
- `beforeunload`-Warning (F3): Technisch aufwändiger, da alle Forms dirty-Tracking brauchen. Wichtig, aber eigenes Ticket.
- Section-Editor-Labels übersetzen (F8): Groß, ~15+ Stellen, betrifft nur Power-User-Bereich. Eigenes Ticket.
- Section-Styles gruppieren (F6): Benötigt UI-Redesign des Dropdowns. Eigenes Ticket.

**Nach diesen 2–3 Fixes:** Admin-UX einfrieren und Fokus auf andere Prioritäten (Public Site, Features). Der Section-Editor und das beforeunload-Warning sind bewusst als separate, größere Aufgaben geparkt.

---

## H. Gesamturteil

| Aspekt | Bewertung |
|--------|-----------|
| Alltagstauglichkeit (Seiten, Produkte, News, Medien, Footer, Einstellungen) | ✅ Gut — selbsterklärend mit kleiner Einweisung |
| Rechtsschutz | ✅ Vollständig — LEGAL-Seiten geschützt |
| Section-Editor (Power-User-Bereich) | ⚠️ Mittel — braucht Einweisung, englische Begriffe |
| Datensicherheit bei Navigation | ❌ Lücke — kein beforeunload-Warning |
| Konsistenz | ⚠️ Gut mit Ausnahmen — Products-Badges, confirm-Dialoge |

Das CMS hat sich von **„nutzbar mit Einweisung und gezielten Fixes nötig"** zu **„im Alltag gut nutzbar, Power-Features brauchen Einweisung"** entwickelt.

---

*Re-Audit durchgeführt am 2026-06-24. Keine Codeänderungen vorgenommen.*
