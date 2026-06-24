# Admin-Backend & CMS-Pflegbarkeits-Audit: Mosaroma Website

**Datum:** 2026-06-24
**Scope:** Vollständiges Admin-Backend, CMS-Datenmodell, alle öffentlichen Seiten
**Methode:** 4 parallele Analyse-Agents (Admin-Routen, Prisma-Schema, Hardcoded Content, Admin-UX)

---

## A. Executive Summary

Das Admin-Backend ist **solide gebaut und für den aktuellen Launch grundsätzlich geeignet**. Die Architektur folgt einem durchdachten "CMS mit Fallback"-Muster: Die meisten Inhalte können im Admin gepflegt werden, wobei hardcodierte Fallback-Werte greifen, wenn die CMS-Daten leer sind.

**Stärken:**
- 20 Admin-Bereiche in 6 logischen Gruppen, vollständig auf Deutsch
- Exzellente Medienverwaltung mit Ordnerstruktur, Suche, Upload, Nutzungstracking
- Durchgängiger Schutz vor versehentlichem Löschen (DangerZone, Löschsperre bei Verknüpfungen)
- 3-Rollen-System (Admin, Editor, Viewer) mit konsequenter Zugriffskontrolle
- Draft/Published/Archived-Workflow für Hauptinhalte

**Schwächen:**
- Viele öffentliche Seiten haben substantielle hardcodierte Inhalte (besonders Über-uns, NERIO, Materialien, Kontakt), die der Kunde nicht selbst ändern kann
- Kritische Geschäftsdaten (Adresse, E-Mail, Garantie, Öffnungszeiten) sind im Code fest verankert
- Kein OG-Image-Feld im gesamten Datenmodell
- Keine Mehrsprachigkeit vorbereitet
- P0-Sicherheitsthema: JWT-Secret-Fallback im Quellcode

**Gesamtbewertung:** Das CMS deckt die datengetriebenen Inhalte (Produkte, Kollektionen, News, Medien) gut ab. Die redaktionellen Seiten (Über uns, NERIO, Materialien-Hub, Kontakt, Kataloge-Subpages) sind jedoch weitgehend hardcodiert. Für einen Launch mit technischem Support ist das vertretbar; für eigenständige Content-Pflege durch den Kunden fehlen CMS-Felder für ~40% der öffentlichen Inhalte.

---

## B. Score

| Kategorie | Score | Max | Begründung |
|---|---|---|---|
| Informationsarchitektur Admin | **4** | 5 | 6 logische Gruppen, klare Benennung; Stoffbibliothek vs Materialien leicht verwirrend, Medien unter "Navigation & Layout" unlogisch |
| Bedienbarkeit | **3** | 5 | Gute Formulare, exzellente Bild-Vorschau und Lösch-Schutz; aber Pflichtfelder nicht markiert, kein Unsaved-Changes-Warning, Status-Werte auf Englisch |
| CMS-Abdeckung öffentlicher Inhalte | **6** | 10 | Produkte/Kollektionen/News/Legal vollständig; Über-uns/NERIO/Materialien/Kontakt/Kataloge-Subpages weitgehend hardcodiert |
| Medienverwaltung | **4** | 5 | Vollwertige Medienbibliothek mit Ordnern, Suche, Upload, Nutzungstracking; kein Bild-Ersetzen, kein Crop/Focal-Point, Alt-Text nicht erzwungen |
| SEO-Pflegbarkeit | **3** | 5 | seoTitle/seoDescription auf Hauptmodellen; fehlt auf ProductGroup, Measurement, FabricFamily; kein ogImage-Feld; kein SEO-Length-Indicator |
| Sicherheit / Schutz vor Fehlern | **3** | 5 | JWT-Auth, Rollen, Upload-Validierung, Löschsperre; aber P0 JWT-Fallback-Secret, kein Unsaved-Changes-Warning, kein CSRF-Token |
| Zukunftsfähigkeit / Mehrsprachigkeit | **1** | 5 | Kein Locale/i18n in irgendeinem Modell; Download hat language-Feld (Freitext); keine Multi-Language-Struktur |
| **Gesamt** | **24** | **40** | **Akzeptabel — mit bekannten Lücken** |

---

## C. CMS-Abdeckungsmatrix

### Legende
- **Ja** = Vollständig im CMS pflegbar
- **Fallback** = CMS möglich, aber hardcodierter Fallback dominiert aktuell
- **Nein** = Nur im Code änderbar
- **Teil** = Teilweise pflegbar (einige Elemente ja, andere nein)

| Seite | Texte | Bilder | CTAs | SEO | Sections sortierbar | Problemstellen | Prio |
|---|---|---|---|---|---|---|---|
| **Startseite** | Fallback | Fallback | Fallback | Fallback | Ja (PageSections) | Hero, Value-Props, Sustainability-Stats, Downloads-Headline, News-Headline, PageCta alle hardcodiert als Fallback | P2 |
| **Kollektionen Übersicht** | Fallback | Ja | Fallback | Fallback | Nein | Consultation-CTA, Benefits-Cards, Intro-Text hardcodiert; Eyebrow, Headline als Fallback | P2 |
| **Kollektion Detail** | Ja | Ja | Teil | Ja | Nein | SERVICE_LINKS-Array, Beratungs-CTA-Texte, Section-Headlines hardcodiert | P3 |
| **Produkt Detail** | Ja | Ja | Teil | Ja | Nein | "Das könnte Sie interessieren"-Headline, PageCta-Texte hardcodiert | P3 |
| **Produktkategorien** | Teil | Ja | Teil | Teil | Nein | SEO fehlt im Modell, Features/shortDescription aus statischem Fallback | P2 |
| **Materialien Hub** | Nein | Teil | Nein | Fallback | Nein | Technologie, Olefin, Stofffamilien-Intros, CTAs — fast alles in `lib/mosaroma/materials.ts` | P1 |
| **Stoffe & Muster** | Ja | Ja | — | Fallback | — | Vollständig datengetrieben (FabricLibrary) | OK |
| **Technische Daten** | Nein | Nein | Nein | Fallback | Nein | Gesamte Seite aus `lib/mosaroma/materials.ts` und hardcoded JSX | P2 |
| **NERIO** | Nein | Teil | Nein | Fallback | Teil (CMS-Sections optional) | Story, Technologie, Versprechen, Highlights, Videos, Produkt-Cards — alles in `lib/mosaroma/materials.ts` + page.tsx | P1 |
| **Über uns** | Nein | Nur Hero | Nein | Fallback | Nein | Promises-Array, Sustainability-Stats, Standort-Daten, Garantie-Text, PageCta — alles hardcodiert | P1 |
| **Kontakt** | Teil | Nur Hero | Nein | Fallback | Nein | Firmenadresse, E-Mail, Öffnungszeiten, Website-URL hardcodiert; Formular via CMS | P1 |
| **Neuigkeiten Liste** | Ja | Ja | — | Fallback | — | Vollständig CMS-getrieben | OK |
| **Neuigkeiten Detail** | Ja | Ja | — | Ja | — | Vollständig CMS-getrieben | OK |
| **Kataloge** | Nein | Nein | Nein | Nein | Nein | "Katalog 2027", Flipbook-URLs, Beschreibung, Service-Cards — alles hardcodiert | P1 |
| **Produktmaße** | Teil | Ja | Nein | Nein | Ja (order) | Gruppen-Headlines, Disclaimer, Sondermaß-Text, PageCta hardcodiert | P2 |
| **Pflege & Garantie** | Nein | Nein | Nein | Nein | Teil (CMS-Sections) | Waschanleitung, Pflegesymbole, Garantie-Text — alles statische Arrays | P1 |
| **Stoff-Techn. Daten** | Nein | Nein | Nein | Nein | Nein | Identisch mit Technische Daten; Vergleichstabelle aus `materials.ts` | P2 |
| **Impressum** | Ja | — | — | Ja | Ja | Vollständig CMS-getrieben (Page + Sections) | OK |
| **Datenschutz** | Ja | — | — | Ja | Ja | Vollständig CMS-getrieben | OK |
| **AGB** | Ja | — | — | Ja | Ja | Vollständig CMS-getrieben | OK |
| **Ambiente-Galerie** | Ja | Ja | Teil | Nein | Ja | Hero-Texte, PageCta hardcodiert; SEO statisch | P3 |
| **404 / not-found** | — | — | — | — | — | Nicht explizit vorhanden (Next.js Default) | P3 |

### Zusammenfassung
- **Vollständig CMS-pflegbar:** 6 Seiten (News, Stoffe & Muster, Impressum, Datenschutz, AGB, News Detail)
- **Überwiegend CMS mit Fallbacks:** 4 Seiten (Startseite, Kollektionen, Kollektion Detail, Produkt Detail)
- **Überwiegend hardcodiert:** 9 Seiten (Über uns, NERIO, Materialien, Kontakt, Kataloge, Pflege & Garantie, Technische Daten, Stoff-Techn. Daten, Produktmaße)
- **CMS-Abdeckungsquote für redaktionelle Inhalte: ~55%**

---

## D. Hardcoded Content — Kritische Findings

### Kritisch (C) — Kunde MUSS dies ändern können

| Datei | Inhalt | Typ | Empfehlung | Prio |
|---|---|---|---|---|
| `app/kontakt/page.tsx` | "Mosaroma Industries GmbH", Adresse, E-Mail, Öffnungszeiten, Website | Firmendaten | Aus CMS (SiteSettings/FooterSettings) beziehen | P1 |
| `components/Footer.tsx` | CONTACT_DEFAULTS mit Firmenname, Adresse, E-Mail | Firmendaten | Bereits CMS-fähig, aber Fallback enthält echte Daten | P2 |
| `components/Footer.tsx` | "(c) 2026 MOSAROMA GmbH" | Copyright | Jahr veraltet, aus CMS beziehen | P1 |
| `app/ueber-uns/page.tsx` | "14.000m²", "seit 2021", "2-4 Tage", Standort-Daten | Firmenfakten | Ins CMS oder SiteSettings | P1 |
| `app/ueber-uns/page.tsx` | "3 Jahre Garantie" + Garantietext | Rechtlich | Ins CMS (eigene Page oder Settings) | P1 |
| `app/kataloge/pflege-garantie/page.tsx` | Waschanleitung (3 Schritte), Pflegesymbole (5 Symbole), Garantietext | Produktsicherheit | Ins CMS — Pflegeanweisungen müssen aktualisierbar sein | P1 |
| `lib/mosaroma/materials.ts` | fabricQualities (4 Stoffqualitäten mit allen Specs) | Produktdaten | Bereits Material-Modell im CMS — Fallback-Daten synchron halten oder eliminieren | P1 |
| `lib/mosaroma/materials.ts` | propertiesComparison (12 Zeilen technische Vergleichsdaten mit Prüfnormen) | Technische Daten | Neues CMS-Modell oder in Material-Model integrieren | P2 |
| `lib/mosaroma/materials.ts` | fabricPatternGroups (kompletter Stoffmuster-Katalog) | Produktkatalog | Bereits FabricSwatch im CMS — Fallback eliminieren | P2 |
| `lib/mosaroma/servicePages.ts` | Katalog-Flipbook-URLs (DE/EN) | Externe URLs | Download-Modell nutzen oder in SiteSettings | P1 |
| `components/measurements/CustomSizeCta.tsx` | "sales@mosaroma.de" | Kontakt-E-Mail | Aus SiteSettings beziehen | P1 |
| `lib/mosaroma/footer.ts` | Legal-Links mit `#` Platzhalter-URLs | Rechtlich | Müssen echte URLs bekommen, aus Navigation-CMS | P1 |

### Sollte ins CMS (B) — Wichtigste Fälle

| Datei | Inhalt | Typ | Prio |
|---|---|---|---|
| `app/ueber-uns/page.tsx` | promises-Array (4 Cards), Nachhaltigkeits-Stats, About-Text | Redaktionell | P2 |
| `app/nerio/page.tsx` | Story, Technologie, Versprechen, Highlights, Videos, Produkt-Cards | Redaktionell | P2 |
| `app/materialien/page.tsx` | Mackintosh-Vorteile, Olefin-Beschreibung, Stofffamilien-Intro | Redaktionell | P2 |
| `app/kataloge/page.tsx` | "Katalog 2027", Beschreibungstext, Flipbook-Links | Jahreszeitenabhängig | P1 |
| `app/kollektionen/page.tsx` | Beratungs-CTA, Benefits-Cards, Intro-Text | Marketing | P2 |
| `app/page.tsx` | Value-Props (4 Cards), Sustainability-Stats, Technologie-Text | Marketing | P2 |
| `lib/mosaroma/materials.ts` | mackintoshTechnology, olefinBenefits, oceanCycleProcess, nerioStory | Technologie-Marketing | P2 |

---

## E. Admin UX Findings

### P0 — Kritisch (vor Produktiveinsatz beheben)

**1. JWT-Secret-Fallback im Quellcode**
`lib/auth/session.ts` Zeile 8: Fallback-Wert `"mosaroma-admin-dev-secret-change-me"`. Wenn `ADMIN_JWT_SECRET` in Produktion nicht gesetzt ist, kann jeder mit Quellcode-Zugang Admin-Sessions fälschen. **Startup-Check einbauen, der ohne gesetztes Secret abbricht.**

### P1 — Wichtig (beeinträchtigt Bedienbarkeit signifikant)

**2. Kein Unsaved-Changes-Warning**
Alle Formulare verwerfen Änderungen kommentarlos bei Navigation. Kein `beforeunload`-Handler. Risiko: Kunde verliert versehentlich umfangreiche Textarbeit.

**3. Pflichtfelder nicht markiert**
ProductEditForm, PageEditForm, CollectionEditForm haben serverseitig erforderliche Felder (Name, Slug, Collection, ProductGroup), zeigen aber kein visuelles `*`. Nutzer submittet, bekommt Fehler, weiß nicht welches Feld fehlt.

**4. Keine Client-seitige Validierung vor Submit**
Nur MeasurementEditForm validiert lokal. Alle anderen senden zum Server und warten auf Fehlermeldung — langsam und verwirrend.

**5. Kein Slug-Auto-Generation**
Nicht-technische Nutzer müssen URL-sichere Slugs manuell erstellen. Nur FabricSwatchEditForm hat "auto"-Option. Alle anderen Content-Typen erfordern manuelle Slug-Eingabe ohne Format-Hinweis.

### P2 — Sinnvoll (Usability-Verbesserung)

**6. Kein Draft-Preview**
Keine Möglichkeit, Draft-Seiten/Produkte vor Veröffentlichung zu sehen. Nutzer muss auf PUBLISHED setzen, prüfen, ggf. zurücksetzen.

**7. Keine Änderungshistorie / Audit-Log**
Kein Protokoll wer wann was geändert hat. Keine Revisions- oder Undo-Funktion.

**8. Status-Werte auf Englisch**
DRAFT, PUBLISHED, ARCHIVED werden als englische Codes in Dropdowns angezeigt. Sollte "Entwurf", "Veröffentlicht", "Archiviert" sein.

**9. Kein SEO-Length-Indicator**
SEO-Titel und -Beschreibung haben keinen Zeichenzähler oder Empfehlung (60/160 Zeichen). Kein SERP-Preview.

**10. Alt-Text nicht erzwungen**
Bilder können ohne Alt-Text hochgeladen und verwendet werden. Mindestens: Warnung bei leerem Alt-Text.

**11. "Eyebrow" nicht übersetzt**
Dieser englische Marketing-Fachbegriff erscheint in mehreren Formularen ohne Erklärung. Nicht-technische deutsche Nutzer verstehen das Feld nicht.

**12. Kein Bild-Ersetzen**
Um ein Bild zu ersetzen, muss der Nutzer das alte löschen und neu hochladen — dabei brechen bestehende Verknüpfungen.

**13. Stoffbibliothek vs Materialien verwirrend**
Zwei Admin-Bereiche für überlappende Konzepte (Stoffe/Materialien). Der Unterschied (Material = Produktzuordnung, Stoffbibliothek = Muster-Katalog) ist nicht offensichtlich.

### P3 — Nice-to-have

**14. Kein Drag-and-Drop-Reordering** — Button-basiert (auf/ab); funktional aber nicht intuitiv.

**15. Keine Pagination auf den meisten Listen** — Nur Produkte hat Pagination. Wird bei wachsendem Content zum Performance-Problem.

**16. Keine Suche in mehreren Bereichen** — Produktgruppen, Materialien, Downloads, Measurements, Ambiente, Users haben keine Suchfunktion.

**17. Keine Bulk-Aktionen** — Jedes Element muss einzeln verwaltet werden.

**18. PageSectionsEditor nutzt `confirm()`** — Browser-nativer Dialog statt konsistentem ConfirmDialog.

**19. Medien unter "Navigation & Layout"** — Gehört logisch unter "Inhalte".

---

## F. Datenmodell-Findings

### Fehlende Felder

| Modell | Fehlendes Feld | Auswirkung | Prio |
|---|---|---|---|
| Page, Collection, Product, NewsArticle, SiteSettings | `ogImageId` (FK MediaAsset) | Kein Social-Sharing-Bild; Hero-Bild ist nicht immer geeignet | P2 |
| ProductGroup | `seoTitle`, `seoDescription` | SEO auf Kategorieseiten nicht pflegbar | P2 |
| Product | `order` (Int) | Produkte nur nach Name sortierbar, nicht manuell | P2 |
| Page | `publishedAt` (DateTime) | Kein Veröffentlichungsdatum, kein geplantes Publizieren | P3 |
| FabricFamily | `imageId` (FK MediaAsset) | Kein Thumbnail für Stofffamilien | P2 |
| FabricFamily | `seoTitle`, `seoDescription` | SEO nicht pflegbar | P3 |
| Download | `slug` | Einziges Content-Modell ohne Slug | P3 |
| NewsArticle | `author`, `tags` | Kein Autor, keine Tags für Filterung | P3 |
| MediaAsset | `alt` ist optional | Alt-Text kann vergessen werden — A11y-Risiko | P2 |
| ProductImage, FabricProductType, FabricAvailability | `createdAt`/`updatedAt` | Keine Timestamps — Audit/Debugging erschwert | P3 |
| FormSubmission | `status` (Enum) | Kein Workflow (neu/beantwortet/erledigt) | P3 |
| NavigationMenu | `isActive` | Menü kann nicht deaktiviert werden ohne zu löschen | P3 |

### Inkonsistenzen

| Thema | Details |
|---|---|
| Status-Modell | Manche Modelle nutzen `PageStatus` (DRAFT/PUBLISHED/ARCHIVED), andere `isActive` (Boolean) — kognitive Last für Editoren |
| Feld-Benennung | `materialComp` statt `materialComposition`; `hubHighlights` als Newline-String statt JSON-Array |
| Link-Typen | `NavigationItem.linkType` ist String statt Enum — valide Werte nur in `nav-constants.ts` definiert |
| Alt-Text-Strategie | Measurement und AmbienteImage haben eigenes `alt`/`imageAlt`-Feld; alle anderen verlassen sich auf MediaAsset.alt |

---

## G. Sicherheit

| Aspekt | Status | Details |
|---|---|---|
| Login/Auth | Gut | JWT + bcrypt, httpOnly-Cookie, 7-Tage-Expiry |
| API-Schutz | Exzellent | Jede Route prüft Session; DELETE nur für ADMIN; PATCH für nicht-VIEWER |
| Upload-Schutz | Exzellent | MIME-Whitelist, Magic-Bytes-Prüfung, 15MB-Limit, Filename-Sanitizing |
| Lösch-Schutz | Exzellent | In-Use-Check, Rollen-Beschränkung, Bestätigungs-Dialog |
| **JWT-Secret** | **P0** | **Fallback-Secret im Code — muss Startup-Check bekommen** |
| CSRF | Moderat | SameSite=lax + JSON-Body bieten partiellen Schutz; kein explizites CSRF-Token |
| Rollen | Gut | 3 Rollen (Admin, Editor, Viewer) konsequent durchgesetzt |

---

## H. Empfohlene Roadmap

### Quick Wins (je 1-4 Stunden)

1. **JWT-Startup-Check** — Server startet nicht ohne `ADMIN_JWT_SECRET` (P0)
2. **Pflichtfelder mit `*` markieren** — Label-Suffix in allen Edit-Forms (P1)
3. **Status-Labels übersetzen** — "Entwurf"/"Veröffentlicht"/"Archiviert" statt DRAFT/PUBLISHED/ARCHIVED (P2)
4. **"Eyebrow" mit Hilfetext versehen** — Tooltip: "Kleiner Text über der Überschrift" (P2)
5. **Slug-Auto-Generation** — Aus Titel generieren (wie bei FabricSwatch) in allen Content-Formularen (P1)
6. **Kontaktseite: Firmendaten aus CMS** — SiteSettings/FooterSettings-Daten nutzen statt hardcoded (P1)
7. **Copyright-Jahr aus CMS** — FooterSettings.copyrightText nutzen (P1)
8. **Katalog-URLs aus Downloads-Modell** — Flipbook-Links nicht in Code (P1)
9. **SEO auf ProductGroup** — `seoTitle`/`seoDescription`-Felder hinzufügen (P2)

### Mittlere CMS-Erweiterungen (je 4-16 Stunden)

10. **Über-uns-Seite CMS-fähig machen** — Promises, Stats, Standort, Garantie als PageSections oder eigenes Modell
11. **Materialien-Hub CMS-fähig machen** — Technologie-, Olefin-, Stofffamilien-Inhalte aus CMS statt `materials.ts`
12. **NERIO-Seite CMS-fähig machen** — Story, Highlights, Videos als CMS-Sections
13. **Pflege & Garantie CMS-fähig machen** — Waschanleitung, Pflegesymbole, Garantie in CMS
14. **OG-Image-Feld** — `ogImageId` auf Page, Collection, Product, NewsArticle, SiteSettings
15. **Unsaved-Changes-Warning** — `beforeunload`-Handler in allen Edit-Forms
16. **Client-seitige Validierung** — Pflichtfeld-Prüfung vor Server-Submit
17. **Alt-Text-Warnung** — Visueller Hinweis bei fehlendem Alt-Text in MediaPicker

### Größere Architekturthemen (je 1-3 Tage)

18. **Hardcoded-Fallback-Strategie überarbeiten** — `lib/mosaroma/*.ts` Fallbacks als CMS-Seeds statt Runtime-Fallbacks
19. **Draft-Preview** — Preview-Route für unveröffentlichte Inhalte
20. **Änderungshistorie** — Audit-Log für Content-Änderungen
21. **Mehrsprachigkeit vorbereiten** — Locale-Feld auf Content-Modellen, i18n-Struktur planen

---

## I. Klare Empfehlung

### Option 2 — Admin/CMS braucht kleine Verbesserungen

Das Backend ist **funktional vollständig für einen Launch mit technischem Support**. Die datengetriebenen Bereiche (Produkte, Kollektionen, News, Medien, Formulare, Legal Pages) sind solide implementiert. Die Rollen- und Zugriffskontrolle ist durchgängig. Die Medienverwaltung ist überdurchschnittlich gut.

**Vor dem Launch zwingend:**
- P0 JWT-Secret-Startup-Check (verhindert kritische Sicherheitslücke)
- Kontaktseite Firmendaten aus CMS beziehen (Kunde muss Adresse ändern können)
- Copyright-Jahr aktualisieren (steht aktuell auf 2026)
- Katalog-Flipbook-URLs aus CMS/Downloads statt hardcoded

**Für eigenständige Content-Pflege durch den Kunden** (ohne Entwickler-Support) müssten zusätzlich die redaktionellen Seiten (Über uns, NERIO, Materialien-Hub, Pflege & Garantie) CMS-fähig gemacht werden. Das ist ein mittlerer Aufwand (Roadmap-Punkte 10-13), aber kein Launch-Blocker, wenn der Kunde zunächst technischen Support hat.

**Das CMS ist strukturell nicht unvollständig** — es ist ein bewusstes "CMS with Fallback"-Pattern, das für einen MVP/Launch-Kontext angemessen ist. Die Fallback-Daten sind korrekt und vollständig; sie sind nur nicht vom Kunden editierbar.

---

*Audit durchgeführt mit 4 parallelen Analyse-Agents. Keine Code-Änderungen vorgenommen. Nur diese Audit-Datei erstellt.*
