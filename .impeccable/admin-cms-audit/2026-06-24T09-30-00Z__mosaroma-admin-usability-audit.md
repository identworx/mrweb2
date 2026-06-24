# Mosaroma Admin CMS — Usability Audit

**Datum:** 2026-06-24
**Perspektive:** Nicht-technischer Mosaroma-Mitarbeiter ohne Entwicklungshintergrund
**Methode:** Systematische Prüfung aller Admin-Bereiche gegen 12 Usability-Kriterien
**Scope:** Admin-Backend, alle Edit-Forms, Listen, Medienverwaltung, Einstellungen

---

## A. Executive Summary

Das Mosaroma CMS ist **funktional vollständig** und deckt alle wesentlichen Inhaltstypen ab. Die Grundstruktur ist solide: Deutsche Oberfläche, konsistentes visuelles Design, klare Speichern/Abbrechen-Wege, guter Löschschutz durch Rollen und Bestätigungsdialoge.

Für einen **normalen Bediener** bestehen jedoch drei wesentliche Hürden:

1. **Verstreute Kontaktdaten** — E-Mail, Telefon und Adresse existieren in zwei getrennten Bereichen (Einstellungen + Footer) mit unsichtbarer Fallback-Kette. Ein Bediener kann nicht erkennen, welche Änderung wo wirkt.

2. **Fehlende Schutzfunktion für rechtliche Seiten** — Impressum, Datenschutz und AGB können wie jede beliebige Seite archiviert oder gelöscht werden, ohne zusätzliche Warnung. In Deutschland kann das zu Abmahnungen führen.

3. **Technische Begriffe** — Trotz der jüngsten Verbesserungen (Eyebrow-Hilfetexte, Slug-Hinweise, Status-Labels deutsch) bleiben zahlreiche englische Fachbegriffe im UI: CTA, Hero, Section, Style, Href, Subheadline, Benefits, Features, Highlights, Bulletpoints. Für einen Marketing-Mitarbeiter ohne Webentwicklungshintergrund sind diese nicht selbsterklärend.

**Gesamturteil:** Das CMS ist nutzbar, braucht aber eine kurze Einweisung und gezielte UX-Fixes (siehe Empfehlung am Ende).

---

## B. Score: 27 / 40

| Kategorie | Score | Begründung |
|-----------|-------|------------|
| Admin-Navigation & Informationsarchitektur | 4 / 5 | Sidebar gut gruppiert, Dashboard mit Schnellzugriff. Abzug: Inhalte-Gruppe hat 8 Items, „Navigation & Layout" als Gruppenname ist technisch, kein Hilfe-Link. |
| Verständlichkeit der Begriffe | 2 / 5 | Viele englische Fachbegriffe (CTA, Hero, Style, Href, Subheadline, Benefits, Highlights). Slug und Eyebrow haben jetzt Hilfetexte, Status ist deutsch. Aber PageSectionEditor und Formulare zeigen noch zu viel Englisch. |
| Formularlogik & Gruppierung | 4 / 5 | Konsistente Struktur: Allgemein → Bilder → SEO → Gefahrenzone. Pflichtfelder markiert. Hilfetexte vorhanden. Abzug: Kein Hinweis auf ungespeicherte Änderungen, PageSectionsEditor ist komplex. |
| Medienverwaltung | 4 / 5 | Upload, Suche, Ordner, Verwendungsanzeige, Löschschutz bei Verwendung — alles vorhanden. Abzug: Alt-Text ohne Erklärung, Suchfeld ohne Hinweis was durchsucht wird, MIME-Types roh angezeigt. |
| Redaktionsworkflow | 3 / 5 | Grundablauf funktioniert. Abzug: Kein Vorschau-Button, kein Auto-Save, keine Warnung bei ungespeicherten Änderungen, Status-Wechsel zu „Veröffentlicht" ohne Bestätigung, kein Autor-Feld bei News. |
| Fehlerschutz | 3 / 5 | Bestätigungsdialoge bei Löschen/Archivieren, Rollensystem, Medien-Verwendungsschutz. Abzug: Keine beforeunload-Warnung, keine Client-Slug-Validierung, kein Schutz für rechtliche Seiten, teilweise native confirm() statt ConfirmDialog. |
| Selbsterklärbarkeit ohne Schulung | 3 / 5 | Dashboard und Hauptnavigation sind klar. Produkte/Kollektionen/News bearbeiten ist intuitiv. Abzug: Beziehung Footer↔Kontaktseite unklar, Seitentypen als rohe Enums, Section-Editor braucht Einweisung, rechtliche Seiten nicht dediziert auffindbar. |
| Konsistenz zwischen Bereichen | 4 / 5 | Einheitliches Design (orange Buttons, graue Borders, gleiche Input-Styles). Abzug: Manche Formulare nutzen native confirm(), andere ConfirmDialog. Manche haben Info-Banner, andere nicht. |

---

## C. Bedienbarkeits-Matrix

| Admin-Bereich | Aufgabe | Verständlichkeit | Stolperstellen | Risiko | Priorität |
|---------------|---------|------------------|----------------|--------|-----------|
| Dashboard | Nach Login orientieren | ✅ Sehr gut | Keine | Gering | — |
| Produkte | Produkt finden, öffnen, bearbeiten | ✅ Gut | Slug ohne Client-Validierung | Gering | P3 |
| Produkte | Bilder zuweisen | ✅ Gut | MediaPicker klar, aber keine Vorschau des gewählten Bildes im Kontext | Gering | P3 |
| Produkte | Status verstehen | ✅ Gut (deutsch) | Statuswechsel ohne Extra-Bestätigung | Mittel | P2 |
| Kollektionen | Kollektion bearbeiten | ✅ Gut | Stimmungsfarben-Editor ungewöhnlich aber funktional | Gering | — |
| Kollektionen | Eyebrow verstehen | ✅ Gut (Hilfetext vorhanden) | Keine | Gering | — |
| Seiten | Seite bearbeiten | ⚠️ Mittel | Section-Editor komplex, viele Style-Optionen, englische Begriffe | Mittel | P1 |
| Seiten | Section hinzufügen/sortieren | ⚠️ Mittel | Sortier-Pfeile sehr klein, kein Drag&Drop, 21 Styles ungruppiert | Mittel | P2 |
| Seiten | Seitentyp verstehen | ❌ Schlecht | Rohe Enum-Werte (HOME, LEGAL, COLLECTION_INDEX etc.) | Gering | P2 |
| News | Artikel anlegen | ✅ Gut | Kein Autor-Feld, kein Tag-System | Gering | P3 |
| News | Veröffentlichung verstehen | ⚠️ Mittel | Status + Datum steuern Sichtbarkeit, aber kein Hinweis | Mittel | P2 |
| Medien | Bild hochladen | ✅ Gut | Format-Hinweise nur auf Edit-Seite, nicht im Browser-Upload | Gering | P3 |
| Medien | Alt-Text pflegen | ⚠️ Mittel | „Alt-Text" als Label ohne Erklärung | Gering | P2 |
| Medien | Verwendung prüfen | ✅ Gut | Zeigt Modell + Anzahl, aber keine Links zu den Einträgen | Gering | P3 |
| Footer | Kontaktdaten ändern | ⚠️ Mittel | Unklar, dass Footer-Kontaktdaten auch auf Kontaktseite wirken | Hoch | P1 |
| Footer | CTA bearbeiten | ✅ Gut | Eyebrow-Hilfetext vorhanden | Gering | — |
| Einstellungen | E-Mail ändern | ⚠️ Mittel | Dopplung mit Footer-E-Mail, Fallback unsichtbar | Hoch | P1 |
| Downloads | Katalog-Link ändern | ✅ Gut (CMS-first) | Zusammenhang Downloads ↔ Katalogseite nicht erklärt | Mittel | P2 |
| Rechtliche Seiten | Impressum bearbeiten | ❌ Schlecht | In generischer Seitenliste versteckt, kein dedizierter Zugang | Hoch | P0 |
| Rechtliche Seiten | Versehentlich löschen | ❌ Schlecht | Kein Sonderschutz, behandelt wie jede andere Seite | Hoch | P0 |
| Formulare | Kontaktformular konfigurieren | ✅ Gut | Eigener Menüpunkt, klar strukturiert | Gering | — |
| Formulare | Anfragen lesen | ✅ Gut | Eigener Menüpunkt mit Zähler im Dashboard | Gering | — |
| Navigation | Menü bearbeiten | ✅ Gut | Status-Badges für verlinkte Seiten hilfreich | Gering | — |
| Benutzer | Nutzer verwalten | ✅ Gut | Rollen klar (Admin/Editor/Viewer), Selbstlöschungsschutz | Gering | — |

---

## D. Begriffsliste

| Begriff | Fundstelle | Problem | Empfehlung | Priorität |
|---------|-----------|---------|------------|-----------|
| **Eyebrow** | PageEditForm, NewsEditForm, CollectionEditForm, FooterEditForm, PageSectionEditForm, FabricAdminList | Englischer Fachbegriff, aber Hilfetext jetzt vorhanden | ✅ Erledigt — Hilfetexte ergänzt. Optional: Label zu „Dachzeile" ändern | P3 |
| **Slug** | Alle Edit-Forms mit Slug-Feld | Technischer Begriff, aber Hilfetext jetzt vorhanden | ✅ Erledigt — Hinweise ergänzt | — |
| **SEO** | Alle Edit-Forms | Weitgehend bekannter Begriff, aber ohne Erklärung | Hilfetext: „Suchmaschinenoptimierung — Titel und Beschreibung für Google" | P3 |
| **Hero** | PageSectionEditForm, PageEditForm | Marketing-Fachbegriff, nicht allgemein verständlich | Hilfetext: „Großer Kopfbereich der Seite mit Bild und Überschrift" | P2 |
| **Section / Sektion** | PageSectionsEditor | Verständlich im Kontext, aber Style-Optionen englisch | Kein Umbenennen nötig, aber Style-Labels übersetzen | P2 |
| **CTA / Call to Action** | FooterEditForm, PageSectionEditForm | Nur im Marketing bekannt | Label: „Handlungsaufruf" oder Hilfetext | P2 |
| **Style** | PageSectionEditForm | Englisch, unklar im Kontext | „Darstellungsart" oder „Abschnittstyp" | P2 |
| **Href** | PageSectionEditForm (CTA 1 Href, CTA 2 Href, Button Href) | Reiner Entwicklerbegriff, für Bediener unverständlich | „Link" oder „Ziel-URL" | P1 |
| **Subheadline** | PageSectionEditForm (Hero-Settings) | Englisch | „Unterüberschrift" oder „Untertitel" | P2 |
| **Benefits** | PageSectionEditForm (CollectionBenefitsFields) | Englisch | „Vorteile" | P2 |
| **Features / Feature Cards** | PageSectionEditForm (ValuePropsFields) | Englisch | „Eigenschaften" / „Eigenschafts-Karten" | P2 |
| **Highlights** | PageSectionEditForm | Englisch | „Hervorhebungen" | P3 |
| **Bulletpoints** | PageSectionEditForm (BulletsFields) | Englisch | „Aufzählungspunkte" | P3 |
| **Tags** | PageSectionEditForm | Bekannt, aber Hilfetext fehlt | „Schlagwörter" | P3 |
| **Helper / Helper-Section** | PageSectionsEditor | Technischer Systembegriff | „Datenquelle" oder besser: für Bediener ausblenden | P3 |
| **Label** | PageSectionEditForm (Button Label) | Englisch | „Beschriftung" | P2 |
| **Logout** | AdminShell Sidebar | Englisch, Rest ist deutsch | „Abmelden" | P3 |
| **Footer** | Sidebar, Formulare | Englisch, aber eingebürgert | Optional: „Seitenende" oder „Fußzeile", aber „Footer" ist vertretbar | P3 |
| **Dashboard** | Sidebar, Startseite | Englisch, aber allgemein verständlich | Kein Handlungsbedarf | — |
| **Icons** | Sidebar | Englisch/technisch | „Symbole" oder „Website-Symbole" | P3 |
| **Medien** | Sidebar | Verständlich | Optional klarer: „Bilder & Dateien" | P3 |
| **DRAFT / PUBLISHED / ARCHIVED** | Statusbadges in Listen | ✅ Teilweise erledigt — Edit-Form-Dropdowns deutsch, ProductAdminList deutsch | Noch roh in: pages/page.tsx, news/page.tsx, collections/page.tsx — jetzt auch erledigt | ✅ |
| **Seitentypen** (HOME, STANDARD, LEGAL, ...) | PageEditForm Dropdown, Seiten-Liste | Rohe englische Enum-Werte, für Bediener unverständlich | Deutsche Labels im Dropdown und in der Liste | P2 |
| **Alt-Text** | MediaDetailsPanel, MediaEditForm | Technischer A11y-Begriff | Hilfetext: „Bildbeschreibung für Suchmaschinen und Screenreader" | P2 |
| **Metadaten** | MediaEditForm Überschrift | Technisch | „Bildinformationen" oder „Bildbeschreibung" | P3 |
| **Stoffbibliothek** vs. **Materialien** | Sidebar (zwei getrennte Menüpunkte) | Unterschied unklar ohne Erklärung | Hilfetext oder Tooltip im Sidebar, oder zusammenführen | P2 |

---

## E. Top Findings

### P0 — Kritisch

**F1: Kein Sonderschutz für rechtlich erforderliche Seiten**
Impressum, Datenschutz und AGB können wie jede beliebige Seite archiviert oder gelöscht werden. Es gibt keine zusätzliche Warnung, keinen Löschschutz, keine Kennzeichnung als „rechtlich erforderlich". In Deutschland kann das Entfernen dieser Seiten zu Abmahnungen führen. Außerdem sind diese Seiten in der generischen Seitenliste versteckt — es gibt keinen dedizierten Zugang im Sidebar.

**Empfehlung:**
- Lösch- und Archivierungsschutz für Seiten vom Typ LEGAL
- Warnhinweis beim Versuch, eine LEGAL-Seite zu depublizieren
- Optional: Dashboard-Widget oder Sidebar-Shortcut für rechtliche Seiten

### P1 — Wichtig

**F2: Verstreute Kontaktdaten mit unsichtbarer Fallback-Kette**
E-Mail existiert in SiteSettings (`contactEmail`) und FooterSettings (`email`). Adresse und Telefon existieren nur in FooterSettings. Die Kontaktseite bezieht Daten aus FooterSettings mit Fallback auf SiteSettings. Kein Hinweis im Admin erklärt diese Beziehung. Ein Bediener, der die E-Mail nur in Einstellungen ändert, wundert sich, warum auf der Kontaktseite die alte E-Mail steht.

**Empfehlung:**
- Info-Banner in FooterEditForm: „Diese Kontaktdaten werden auch auf der öffentlichen Kontaktseite angezeigt."
- Info-Banner in SettingsForm beim E-Mail-Feld: „Wird als Fallback verwendet, wenn im Footer keine E-Mail hinterlegt ist."

**F3: Keine Warnung bei ungespeicherten Änderungen**
Kein einziges Formular im Admin warnt vor Datenverlust bei Navigation oder Tab-Schließen. Ein Bediener, der 20 Minuten an einer Seite mit Sections arbeitet und versehentlich einen Sidebar-Link klickt, verliert alle Änderungen lautlos.

**Empfehlung:**
- `beforeunload`-Handler in allen Edit-Forms, wenn `isDirty === true`

**F4: „Href" als Feldlabel im Section-Editor**
„CTA 1 Href", „CTA 2 Href", „Button Href" sind reine Entwicklerbegriffe. Kein Bediener ohne Webentwicklungshintergrund versteht „Href".

**Empfehlung:**
- Umbenennen zu „Link" oder „Ziel-URL"

### P2 — Sinnvoll

**F5: Seitentypen als rohe englische Enums**
Das Dropdown und die Listenseite zeigen `HOME`, `STANDARD`, `LEGAL`, `COLLECTION_INDEX`, `COLLECTION_DETAIL`, `MATERIAL_INDEX`, `CATALOG_INDEX`, `SERVICE`, `NEWS_INDEX`, `CONTACT`. Ein Bediener versteht diese Werte nicht.

**Empfehlung:**
- Deutsche Labels: Startseite, Standard, Rechtliches, Kollektionsübersicht, Kollektionsdetail, Materialübersicht, Katalogübersicht, Service, Neuigkeiten, Kontakt

**F6: Section-Editor — Style-Dropdown ungruppiert mit 21 Optionen**
Ein Bediener, der eine Section hinzufügen möchte, sieht 21 unsortierte Optionen ohne visuelle Vorschau. Viele Style-Namen sind seitenspezifisch (z.B. „Musterset-CTA (Kollektionen)"), aber das ist nicht gefiltert.

**Empfehlung:**
- Styles nach Verwendungszweck gruppieren (z.B. „Allgemein", „Kollektionen", „Materialien")
- Optional: Thumbnail-Vorschau pro Style

**F7: Alt-Text ohne Erklärung**
„Alt-Text" als Label ist für einen nicht-technischen Bediener Fachjargon. Es gibt keinen Hinweis, warum dieses Feld wichtig ist oder was man eingeben soll.

**Empfehlung:**
- Hilfetext: „Bildbeschreibung für Suchmaschinen und sehbehinderte Nutzer. Beschreiben Sie kurz, was auf dem Bild zu sehen ist."

**F8: Englische Labels in Section-Feldern**
CTA, Style, Label, Subheadline, Benefits, Features, Bulletpoints, Tags, Highlights — durchgehend englisch in einem sonst deutschen Interface.

**Empfehlung:**
- Schrittweise übersetzen (siehe Begriffsliste oben)

**F9: Statuswechsel zu „Veröffentlicht" ohne Bestätigung**
Ein Bediener kann im Edit-Form den Status von „Entwurf" auf „Veröffentlicht" setzen und speichern, ohne zusätzliche Bestätigung. Bei Löschen/Archivieren gibt es Bestätigungsdialoge, aber beim Veröffentlichen — der folgenreichsten Aktion — nicht.

**Empfehlung:**
- Hinweistext unter Status-Dropdown: „Nur veröffentlichte Inhalte sind auf der Website sichtbar."
- Optional: Bestätigungsdialog beim ersten Veröffentlichen

**F10: Downloads ↔ Katalogseite Zusammenhang nicht erklärt**
Ein Bediener, der unter „Kataloge & Downloads" einen Download-Eintrag sieht, erkennt nicht, dass dieser automatisch auf der öffentlichen Katalogseite erscheint.

**Empfehlung:**
- Info-Banner auf der Downloads-Listenseite: „Downloads vom Typ ‚catalog' erscheinen automatisch auf der öffentlichen Katalogseite."

**F11: Unterschied Stoffbibliothek vs. Materialien unklar**
Zwei getrennte Sidebar-Menüpunkte ohne Erklärung des Unterschieds.

**Empfehlung:**
- Hilfetext oder Info-Banner auf beiden Seiten, das den Unterschied erklärt

### P3 — Nice-to-have

**F12: „Logout" statt „Abmelden"** — Einziges englisches Wort in der Sidebar.

**F13: Sortier-Pfeile im Section-Editor zu klein** — Unicode-Dreiecke ohne sichtbares Label, kein Drag&Drop.

**F14: Kein Vorschau-Button** — Kollektion/Seite/News haben keinen „Vorschau"-Link in der Edit-Ansicht (CollectionEditForm hat „Öffentliche Seite ansehen ↗", aber die anderen nicht).

**F15: MediaBrowser Suchfeld ohne Platzhalter-Hinweis** — „Suchen..." sagt nicht, was durchsucht wird (Dateiname? Alt-Text? Beides?).

**F16: MIME-Types roh angezeigt** — „image/webp" statt „WebP-Bild".

**F17: Kein Autor-Feld bei News** — Für Redaktionsworkflow fehlt ein Autor-Zuordnung.

**F18: Interne Typ-Werte in PageSectionEditForm sichtbar** — „Typ (intern): CUSTOM" bringt einem Bediener keinen Nutzen.

**F19: JSON-Fallback-Editor im Section-Editor** — Kann bei unbekannten Styles erscheinen und würde einen nicht-technischen Bediener völlig verwirren.

---

## F. Konkrete Quick Wins (risikoarm)

Diese Verbesserungen sind rein additive Hilfetext- und Label-Änderungen ohne Datenbankänderungen:

| # | Maßnahme | Bereich | Aufwand | Wirkung |
|---|----------|---------|---------|---------|
| 1 | Info-Banner in FooterEditForm: „Diese Kontaktdaten werden auch auf der Kontaktseite angezeigt." | FooterEditForm | 1 Zeile | Hoch |
| 2 | Info-Banner in SettingsForm E-Mail: „Fallback, wenn im Footer keine E-Mail hinterlegt." | SettingsForm | 1 Zeile | Hoch |
| 3 | „Href" → „Link" oder „Ziel-URL" in Section-Feldern | PageSectionEditForm | 5–10 Stellen | Hoch |
| 4 | Seitentypen deutsch (HOME → Startseite etc.) | PageEditForm, pages/page.tsx | ~10 Labels | Mittel |
| 5 | Alt-Text Hilfetext in MediaDetailsPanel + MediaEditForm | 2 Dateien | 2 Zeilen | Mittel |
| 6 | „Logout" → „Abmelden" | AdminShell | 1 Wort | Gering |
| 7 | Info-Banner auf Downloads-Listenseite (Zusammenhang Katalogseite) | downloads/page.tsx | 1 Zeile | Mittel |
| 8 | Statushinweis unter Status-Dropdown: „Nur veröffentlichte Inhalte sind sichtbar." | Alle Edit-Forms ohne diesen Hinweis | 4–5 Stellen | Mittel |
| 9 | Section-Feld-Labels übersetzen (CTA → Handlungsaufruf, Subheadline → Unterüberschrift, Benefits → Vorteile) | PageSectionEditForm, page-section-schemas.ts | ~15 Labels | Mittel |
| 10 | „Hero" Hilfetext in PageEditForm: „Großer Kopfbereich mit Bild und Überschrift" | PageEditForm | 1 Zeile | Gering |

---

## G. Klare Empfehlung

### Bewertung: **2 — CMS ist nutzbar, braucht aber kurze Einweisung und kleine UX-Fixes**

Das Mosaroma Admin-Backend ist **funktional vollständig** und hat eine **solide Grundstruktur**. Ein Mitarbeiter mit kurzer Einweisung (30–60 Minuten) kann alle wesentlichen Aufgaben erledigen: Produkte bearbeiten, Bilder verwalten, News anlegen, Footer pflegen.

**Ohne Einweisung** wird ein Bediener an folgenden Stellen scheitern oder Fehler machen:
- Kontaktdaten an falscher Stelle ändern (Einstellungen statt Footer)
- Rechtliche Seiten nicht finden oder versehentlich depublizieren
- Section-Editor ohne Vorwissen bedienen (Style-Auswahl, englische Begriffe)
- „Href" und andere technische Feldnamen nicht verstehen

**Empfohlene Reihenfolge der Fixes:**
1. **P0:** Schutz für rechtliche Seiten (Lösch-/Archivierungssperre + Warnhinweis)
2. **P1:** Info-Banner für Kontaktdaten-Beziehung (Footer ↔ Kontaktseite ↔ Einstellungen)
3. **P1:** „Href" → „Link" / „Ziel-URL" umbenennen
4. **P2:** Seitentypen deutsch, Alt-Text-Hilfetext, Statushinweise
5. **P2:** Section-Editor Labels schrittweise übersetzen

Die Quick Wins (F1–F10) haben einzeln jeweils minimalen Diff-Impact, verbessern aber in Summe die Selbsterklärbarkeit erheblich. Keine dieser Maßnahmen erfordert Datenbankänderungen oder Prisma-Migrationen.

---

*Audit durchgeführt am 2026-06-24. Keine Codeänderungen vorgenommen.*
