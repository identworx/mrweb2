# Admin CMS — Dokumentation

Stand: 2026-06-16 (Phase 4: NERIO Sustainability Landing Page) | Branch: `claude/add-logo-i2yFH`

## 1. Technologie-Stack

| Komponente       | Version / Paket                    |
| ---------------- | ---------------------------------- |
| Framework        | Next.js 16.2.2 (App Router, Turbopack) |
| Sprache          | TypeScript (strict)                |
| ORM              | Prisma 7.8.0 + `@prisma/adapter-better-sqlite3` |
| Datenbank        | SQLite                             |
| Auth             | jose (JWT) + bcryptjs (Hashing)    |
| Styling          | Tailwind CSS v4                    |
| Validierung      | Zod v4                             |
| Bildoptimierung  | sharp 0.35 (WebP-Konvertierung)    |
| Runtime          | Node.js, PM2 (Produktion)         |

## 2. Installation & Setup

```bash
git clone <repo> && cd mrweb2
cp .env.example .env          # Werte anpassen (siehe Abschnitt 3)
npm install                    # postinstall generiert Prisma Client
npx prisma migrate deploy      # Migrationen anwenden
npx prisma db seed             # Seed-Daten laden
npm run dev                    # Dev-Server starten
```

### Produktions-Build

```bash
npm run build                  # prisma generate + next build
npm start                      # Next.js Produktionsserver
```

### Produktions-Deploy (Server)

```bash
npm run prisma:deploy          # prisma generate + migrate deploy + seed
npm run build
pm2 restart mosaroma
```

### Stoffkatalog-Import auf Production (einmalig)

Vollstaendige Checkliste fuer den Katalogdaten-Import:

```bash
# 1. DB Backup
cp /var/www/web.mosaroma.de/shared/mosaroma.db /var/www/web.mosaroma.de/shared/mosaroma.db.bak-$(date +%Y%m%d)

# 2. Build Backup (optional)
cp -r .next .next.bak

# 3. Git Pull
git pull origin claude/add-logo-i2yFH

# 4. Prisma Check
npx prisma validate
npx prisma migrate status

# 5. ProductType Backfill (falls 4 Produktarten fehlen: Sitzpolster, Bankauflagen, Poufs, Tischsets)
npx tsx scripts/backfill-fabric-product-types.ts
npx tsx scripts/backfill-fabric-product-types.ts --apply

# 6. Family Name Fix (nur falls Production noch "Mackintosh® & Lite" statt "Mackintosh® Lite" hat)
#    Pruefen im Admin unter Stoffbibliothek → Familien. Wenn Name korrekt: ueberspringen.

# 7. Import Dry-Run
npx tsx scripts/import-fabric-catalog-overview.ts

# 8. Import Apply
npx tsx scripts/import-fabric-catalog-overview.ts --apply

# 9. Import Idempotency (Kontrolle: 0 neue Eintraege erwartet)
npx tsx scripts/import-fabric-catalog-overview.ts

# 10. Rocky Mountain Family Fix Dry-Run
npx tsx scripts/fix-rocky-mountain-family.ts

# 11. Rocky Mountain Family Fix Apply
npx tsx scripts/fix-rocky-mountain-family.ts --apply

# 12. Rocky Mountain Family Fix Idempotency (Kontrolle: alle ALREADY_CORRECT)
npx tsx scripts/fix-rocky-mountain-family.ts

# 13. Build
npm run build

# 14. PM2 Restart
pm2 restart mosaroma
```

**Wichtig:**
- Keine Migration noetig (Schema ist bereits aktuell)
- Kein Full Seed ausfuehren
- Upload-Limit bleibt 15 MB
- Alle Scripts sind idempotent und sicher mehrfach ausfuehrbar

## 3. Umgebungsvariablen (.env)

| Variable           | Beschreibung                                         | Beispiel                           |
| ------------------ | ---------------------------------------------------- | ---------------------------------- |
| `DATABASE_URL`     | SQLite Datenbankpfad (absolut in Produktion)         | `file:./dev.db`                    |
| `ADMIN_EMAIL`      | E-Mail des Seed-Admin-Benutzers                      | `admin@mosaroma.de`                |
| `ADMIN_PASSWORD`   | Passwort des Seed-Admin-Benutzers                    | `changeme123`                      |
| `ADMIN_JWT_SECRET` | JWT-Signaturschluessel (`openssl rand -base64 32`)   | 32+ Zeichen                        |

**Wichtig:** In Produktion unbedingt `ADMIN_JWT_SECRET` aendern und `ADMIN_PASSWORD` nach erstem Login zuruecksetzen.

## 4. Datenbank (Prisma Schema)

### Modelle (21 Tabellen)

| Modell            | Beschreibung                                  |
| ----------------- | --------------------------------------------- |
| `User`            | Admin-Benutzer (Rollen: ADMIN, EDITOR, VIEWER)|
| `SiteSettings`    | Globale Website-Einstellungen (Singleton)     |
| `MediaAsset`      | Hochgeladene Medien (Bilder)                  |
| `NavigationMenu`  | Navigations-Menues (HEADER, FOOTER, etc.)     |
| `NavigationItem`  | Einzelne Menu-Eintraege                        |
| `Page`            | CMS-Seiten mit Status und SEO-Feldern         |
| `PageSection`     | Sektionen innerhalb einer Seite               |
| `Collection`      | Stoff-Kollektionen (mit Hero/Card-Bild, MoodColors, SEO) |
| `ProductGroup`    | Produktkategorien (Dekokissen, Hochlehner...) |
| `Product`         | Einzelprodukte                                |
| `ProductImage`    | Produktbilder-Galerie                         |
| `Material`        | Materialien mit technischen Daten             |
| `Measurement`     | Produktmass-Tabellen                          |
| `Download`        | Downloadbare Dateien (Kataloge etc.)          |
| `NewsArticle`     | News-Beitraege                                |
| `FooterSettings`  | Footer-Einstellungen (Singleton)              |
| `Form`            | Kontaktformular-Konfiguration                 |
| `FormField`       | Formular-Felder                               |
| `FormSubmission`  | Formular-Einreichungen                        |
| `FabricFamily`    | Stofffamilien (Mackintosh, Basic, etc.)        |
| `FabricSwatch`    | Einzelne Stoffmuster mit Bild und Farbe       |
| `FabricProductType`| Produktarten fuer Verfuegbarkeitsmatrix       |
| `FabricAvailability`| Zuordnung Stoff ↔ Produktart (mit Notiz)    |

### Seed-Daten

Die Seed-Datei (`prisma/seed.ts`) erstellt:
- 1 Admin-Benutzer (aus `.env`)
- 1 SiteSettings-Eintrag
- 10 Seiten (Home, Kollektionen, Materialien, Kataloge, Kontakt, etc.)
- 4 Navigations-Menues (Header, Footer, Service, Legal) mit Eintraegen
- 7 Kollektionen (mit Eyebrow, Beschreibungen, MoodColors, SEO-Daten)
- 4 Materialien
- 6 Materialien (inkl. Bambusfaser und Acryl fuer Decken)
- 9 Produktgruppen (mit Beschreibungen)
- 209 Produkte (vollstaendiger Import aus statischen Daten)
- 1 Footer-Settings
- 1 Kontaktformular mit 7 Feldern (Name, Unternehmen, E-Mail, Telefon, Betreff, Nachricht, Datenschutz)
- 2 Downloads (Katalog 2027 Deutsch + English)
- 12 Measurements (Kissen, Auflagen, Lehner, Bankauflagen, Poufs, Tischsets)
- 4 News-Artikel (Kollektionen 2027, Mackintosh, NERIO Oceana, Pflegehinweise)
- 7 PageSections fuer Startseite (1 home-hero, 1 value-props, 1 image-text-feature, 1 collection-showcase, 1 sustainability-stats, 1 downloads-teaser, 1 news-teaser)
- 3 PageSections fuer Kollektionen (1 collection-consultation-card, 1 collection-benefits, 1 collection-cta)
- 6 PageSections fuer Pflege & Garantie (4 care-list, 1 cross-link, 1 cta)
- 4 PageSections fuer Stoff- & technische Daten (1 fabric-cards, 1 comparison-table, 1 highlight-cards, 1 cta)

## 5. Admin-Authentifizierung

- **Login:** `/admin/login` — E-Mail + Passwort
- **Session:** JWT in HTTP-only Cookie (`admin_session`, 7 Tage Laufzeit)
- **Hashing:** bcryptjs mit 12 Runden
- **Route-Schutz:** `proxy.ts` (Next.js 16 Proxy/Middleware) prueft Cookie fuer alle `/admin/*` Routen
- **API-Schutz:** Jeder API-Handler prueft Session via `getSessionUser()`
- **Rollen:** Users-API erfordert zusaetzlich `ADMIN`-Rolle
- **Logout:** POST an `/api/admin/auth` mit `{ action: "logout" }` loescht Cookie

### Proxy (proxy.ts)

```
/admin/login       → immer durchlassen
/api/*             → immer durchlassen (API-Handler pruefen selbst)
/admin/*           → Cookie pruefen, bei Fehlen → Redirect zu /admin/login
```

## 6. Admin-Seiten (UI)

| Route                           | Funktion                        | Status     |
| ------------------------------- | ------------------------------- | ---------- |
| `/admin`                        | Dashboard                       | Funktional |
| `/admin/login`                  | Login-Seite                     | Funktional |
| `/admin/pages`                  | Seiten-Liste                    | Funktional |
| `/admin/pages/[id]`             | Seite bearbeiten / erstellen    | Funktional |
| `/admin/collections`            | Kollektionen-Liste              | Funktional |
| `/admin/collections/[id]`       | Kollektion bearbeiten/erstellen | Funktional |
| `/admin/products`               | Produkte-Liste (Suche, Filter, Pagination, Bildstatus) | Funktional |
| `/admin/products/[id]`          | Produkt bearbeiten/erstellen (mit Bildauswahl) | Funktional |
| `/admin/product-groups`         | Produktgruppen-Liste            | Funktional |
| `/admin/product-groups/[id]`    | Produktgruppe bearbeiten/erstellen | Funktional |
| `/admin/materials`              | Materialien-Liste               | Funktional |
| `/admin/materials/[id]`         | Material bearbeiten/erstellen   | Funktional |
| `/admin/media`                  | Medien-Uebersicht               | Funktional |
| `/admin/media/[id]`             | Medium bearbeiten/hochladen     | Funktional |
| `/admin/navigation`             | Navigations-Liste               | Funktional |
| `/admin/navigation/[id]`        | Navigation bearbeiten           | Funktional |
| `/admin/footer`                 | Footer-Einstellungen            | Funktional |
| `/admin/forms/contact`          | Kontaktformular-Konfiguration   | Funktional |
| `/admin/forms/submissions`      | Einreichungen-Liste             | Funktional |
| `/admin/forms/submissions/[id]` | Einreichung-Detail              | Funktional |
| `/admin/settings`               | Website-Einstellungen           | Funktional |
| `/admin/users`                  | Benutzer-Liste                  | Funktional |
| `/admin/users/[id]`             | Benutzer bearbeiten/erstellen   | Funktional |
| `/admin/downloads`              | Kataloge & Downloads (Liste + Filter) | Funktional |
| `/admin/downloads/[id]`         | Download bearbeiten/erstellen   | Funktional |
| `/admin/measurements`           | Produktmaße (Liste + Filter)    | Funktional |
| `/admin/measurements/[id]`      | Produktmaß bearbeiten/erstellen | Funktional |
| `/admin/news`                   | Neuigkeiten (Liste + Filter)    | Funktional |
| `/admin/news/[id]`              | News-Artikel bearbeiten/erstellen | Funktional |
| `/admin/service/pflege-garantie`| Service: Pflege & Garantie      | Funktional |
| `/admin/service/stoff-technische-daten` | Service: Stoff- & techn. Daten | Funktional |
| `/admin/fabrics`                | Stoffbibliothek (Stoffe, Familien, Produktarten) | Funktional |
| `/admin/fabrics/[id]`           | Stoff bearbeiten/erstellen (inkl. Verfuegbarkeiten) | Funktional |

## 7. API-Endpunkte

| Methode | Route                    | Funktion                                  |
| ------- | ------------------------ | ----------------------------------------- |
| POST    | `/api/admin/auth`        | Login / Logout                            |
| GET     | `/api/admin/pages`       | Alle Seiten laden                         |
| POST    | `/api/admin/pages`       | Seite erstellen / aktualisieren           |
| GET     | `/api/admin/collections` | Alle Kollektionen laden                   |
| POST    | `/api/admin/collections` | Kollektion erstellen / aktualisieren      |
| GET     | `/api/admin/products`    | Alle Produkte laden                       |
| POST    | `/api/admin/products`    | Produkt erstellen / aktualisieren (inkl. shortDescription, heroImageId, mainImageId) |
| GET     | `/api/admin/product-groups` | Alle Produktgruppen laden              |
| POST    | `/api/admin/product-groups` | Produktgruppe erstellen / aktualisieren |
| GET     | `/api/admin/materials`   | Alle Materialien laden                    |
| POST    | `/api/admin/materials`   | Material erstellen / aktualisieren        |
| GET     | `/api/admin/media`       | Medien laden (optional `?q=` Suche)       |
| POST    | `/api/admin/media`       | Medium hochladen / Metadaten aktualisieren|
| PATCH   | `/api/admin/media?id=`   | Medien-Metadaten aktualisieren (alt, caption, title) |
| GET     | `/api/admin/navigation`  | Alle Navigations-Menues laden             |
| POST    | `/api/admin/navigation`  | Navigation aktualisieren                  |
| GET     | `/api/admin/footer`      | Footer-Einstellungen laden                |
| POST    | `/api/admin/footer`      | Footer-Einstellungen speichern            |
| GET     | `/api/admin/forms`       | Kontaktformular laden                     |
| POST    | `/api/admin/forms`       | Kontaktformular aktualisieren (inkl. placeholder, helpText, options) |
| GET     | `/api/admin/submissions` | Formular-Einreichungen laden              |
| POST    | `/api/forms/[slug]/submit` | Oeffentliche Formular-Einreichung (Spam-Schutz, Validierung, E-Mail) |
| GET     | `/api/admin/settings`    | Website-Einstellungen laden               |
| POST    | `/api/admin/settings`    | Website-Einstellungen speichern           |
| GET     | `/api/admin/users`       | Alle Benutzer laden                       |
| POST    | `/api/admin/users`       | Benutzer erstellen / aktualisieren        |
| DELETE  | `/api/admin/users`       | Benutzer loeschen (ADMIN, Guards)         |
| GET     | `/api/admin/downloads`   | Alle Downloads laden                      |
| POST    | `/api/admin/downloads`   | Download erstellen / aktualisieren        |
| PATCH   | `/api/admin/downloads`   | Download (de)aktivieren                   |
| DELETE  | `/api/admin/downloads`   | Download loeschen (ADMIN)                 |
| GET     | `/api/admin/measurements`| Alle Produktmasse laden                   |
| POST    | `/api/admin/measurements`| Produktmass erstellen / aktualisieren     |
| PATCH   | `/api/admin/measurements`| Produktmass (de)aktivieren                |
| DELETE  | `/api/admin/measurements`| Produktmass loeschen (ADMIN)              |
| GET     | `/api/admin/news`        | Alle News-Artikel laden                   |
| POST    | `/api/admin/news`        | News-Artikel erstellen / aktualisieren    |
| PATCH   | `/api/admin/news`        | News-Status aendern                       |
| DELETE  | `/api/admin/news`        | News-Artikel loeschen (ADMIN)             |
| GET     | `/api/admin/fabrics`     | Stoffbibliothek laden (`?entity=families\|swatches\|product-types`) |
| POST    | `/api/admin/fabrics`     | Familie/Stoff/Produktart erstellen/aktualisieren |
| PATCH   | `/api/admin/fabrics`     | Aktiv-Status umschalten (`?entity=...&id=...`) |
| DELETE  | `/api/admin/fabrics`     | Loeschen (ADMIN, `?entity=...&id=...`)    |
| GET     | `/api/admin/page-sections?pageId=` | PageSections einer Seite laden       |
| POST    | `/api/admin/page-sections` | PageSection erstellen                   |
| PATCH   | `/api/admin/page-sections?id=` | PageSection aktualisieren              |
| DELETE  | `/api/admin/page-sections?id=` | PageSection loeschen (ADMIN)           |
| PATCH   | `/api/admin/pages`       | Seiten-Status aendern                     |
| DELETE  | `/api/admin/pages`       | Seite loeschen (ADMIN)                    |
| PATCH   | `/api/admin/collections` | Kollektion-Status aendern                 |
| DELETE  | `/api/admin/collections` | Kollektion loeschen (ADMIN, Guard)        |
| PATCH   | `/api/admin/products`    | Produkt-Status aendern                    |
| DELETE  | `/api/admin/products`    | Produkt loeschen (ADMIN)                  |
| PATCH   | `/api/admin/product-groups` | Produktgruppe (de)aktivieren           |
| DELETE  | `/api/admin/product-groups` | Produktgruppe loeschen (ADMIN, Guard)  |
| PATCH   | `/api/admin/materials`   | Material (de)aktivieren                   |
| DELETE  | `/api/admin/materials`   | Material loeschen (ADMIN, Guard)          |
| DELETE  | `/api/admin/media`       | Medium loeschen (ADMIN, Usage Guard)      |
| DELETE  | `/api/admin/navigation`  | NavigationItem loeschen (ADMIN)           |
| DELETE  | `/api/admin/submissions` | Formular-Einreichung loeschen             |
| PATCH   | `/api/admin/submissions` | isRead-Status aendern                     |
| GET     | `/api/health`            | Health Check (DB + Env)                   |

## 8. Medien-Upload & Medien-Browser

- **Erlaubte Typen:** JPEG, PNG, GIF, WebP, AVIF
- **Maximale Groesse:** 15 MB
- **Speicherort:** `public/uploads/general/`
- **Dateiname:** Sanitized + Timestamp (z.B. `mein-bild-1717505432123.webp`)
- **Nicht erlaubt:** SVG (XSS-Risiko durch eingebettetes JavaScript), PDF
- **Sicherheit:** Magic-Byte-Validierung (prueft Datei-Header, nicht nur MIME-Type)

### Automatische WebP-Optimierung

Beim Upload werden Bilder serverseitig automatisch optimiert (via `sharp`):

| Quellformat | Verhalten | Zielformat |
| ----------- | --------- | ---------- |
| JPEG, PNG   | Konvertierung zu WebP (Qualitaet 84, max 2880px Breite) | WebP |
| WebP        | Re-Kompression (Qualitaet 84, max 2880px Breite) | WebP |
| GIF, AVIF   | Unveraendert durchgereicht (Dimensionen ausgelesen) | Original |

- **Qualitaet:** WebP Q84 — visuell verlustfrei fuer Stofftexturen
- **Max. Breite:** 2880px (Retina-Displays), Seitenverhaeltnis bleibt erhalten
- **Kein Cropping:** Bilder werden nur verkleinert, nie beschnitten
- **EXIF-Daten:** Automatisch entfernt (Datenschutz, Dateigrösse)
- **Rotation:** EXIF-Rotation wird vor Konvertierung angewendet
- **Fehlerfall:** Bei Sharp-Fehler wird das Original gespeichert (mit Log-Warnung)
- **Dimensionen:** `width` und `height` werden bei jedem Upload gespeichert
- **Admin-Anzeige:** Details-Panel zeigt "Als WebP optimiert" wenn Original nicht WebP war
- **Bestandsdaten:** Bestehende MediaAssets bleiben unveraendert (nur neue Uploads)
- **Implementierung:** `lib/server/image-optimizer.ts` (sharp-basiert)

### Produktbild-Normalisierung

Produktbilder werden serverseitig normalisiert, damit alle Produkte im Frontend einheitlich dargestellt werden — unabhaengig von Bildformat, Seitenverhaeltnis oder Randanteil im Original.

| Parameter | Wert |
| --------- | ---- |
| Canvas | 1600 × 1600 px (quadratisch) |
| Produktfuellung | ~80% der Canvas-Flaeche |
| Sicherheitsrand | ~10% pro Seite |
| Hintergrund | #FAF8F5 (Cream, passend zum Layout) |
| Ausgabeformat | WebP Q86 |
| Trim-Threshold | 20 (konservativ, kein Produkt-Anschnitt) |

**Ablauf:**
1. Leerer Rand/Hintergrund wird getrimmt (konservativer Threshold)
2. Produkt wird proportional skaliert (max 1280 × 1280 px, kein Upscaling)
3. Produkt wird zentriert auf 1600 × 1600 Canvas gesetzt
4. Ausgabe als WebP Q86

**Dateien:**
- `lib/server/product-image-normalizer.ts` — Normalisierungs-Logik (Sharp-basiert)
- `scripts/normalize-product-images.ts` — Batch-Skript fuer bestehende Bilder

**Batch-Skript ausfuehren:**
```bash
npx tsx scripts/normalize-product-images.ts              # Dry-Run (zeigt was passieren wuerde)
npx tsx scripts/normalize-product-images.ts --apply      # Normalisierung durchfuehren
```

**Datenmodell:**
- `MediaAsset.normalizedUrl` (String, optional) — Pfad zum normalisierten Bild
- Normalisierte Bilder liegen in `public/uploads/normalized/`
- Frontend (`getMediaUrl`) bevorzugt automatisch `normalizedUrl` wenn vorhanden
- Originaldateien bleiben erhalten (kein Loeschen, kein Ueberschreiben)

**Nur Produktbilder:** Hero-Bilder, Ambient-Bilder, Logos, Collection-Bilder und Katalogbilder werden NICHT normalisiert.

### MediaPicker (Phase 2F-A)

Alle Admin-Formulare nutzen den **MediaPickerField** statt einfacher `<select>`-Dropdowns:

| Komponente           | Datei                                        | Funktion                              |
| -------------------- | -------------------------------------------- | ------------------------------------- |
| `MediaPickerField`   | `components/admin/MediaPickerField.tsx`       | Formularfeld mit Vorschau + Auswahl   |
| `MediaPickerModal`   | `components/admin/MediaPickerModal.tsx`       | Modale Bildauswahl mit Suche + Upload |

**Formulare mit MediaPicker:**
- CollectionEditForm (Hero-Bild, Card-Bild)
- ProductEditForm (Hauptbild, Hero-Bild)
- ProductGroupEditForm (Icon, Bild)
- MeasurementEditForm (Bemaßtes Bild)
- NewsEditForm (Hero-Bild, Card-Bild)
- DownloadEditForm (Bild)
- PageEditForm (Hero-Bild)
- MaterialEditForm (Bild)

### Media Browser (Phase 2F-B)

`/admin/media` ist ein vollstaendiger Medien-Browser mit Grid, Suche, Filtern, Pagination und Details-Panel:

| Komponente           | Datei                                              | Funktion                                    |
| -------------------- | -------------------------------------------------- | ------------------------------------------- |
| `MediaBrowser`       | `components/admin/media/MediaBrowser.tsx`           | Haupt-Browser mit Grid, Filter, Pagination  |
| `MediaDetailsPanel`  | `components/admin/media/MediaDetailsPanel.tsx`      | Seitenpanel: Vorschau, Metadaten, Verwendung, Loeschen |
| `MediaUsageList`     | `components/admin/media/MediaUsageList.tsx`         | Anzeige wo ein Medium verwendet wird        |

**Features:**
- Paginated Grid (24 pro Seite)
- Suche (filename, originalName, alt, title, caption)
- Filter: Typ (Bilder), Ordner
- Drag-and-Drop + Button Upload
- Details-Panel rechts mit Inline-Metadaten-Bearbeitung (alt, title, caption, folder)
- URL-Kopierfunktion
- Verwendungs-Anzeige (13 Relationen)
- Delete mit Usage-Guard (nur ADMIN, nur wenn nicht verwendet)
- Rollenpruefung: VIEWER sieht nur, EDITOR kann editieren, ADMIN kann loeschen

**Medien-API (`/api/admin/media`):**
- GET ohne `page`: Flaches Array (Rueckwaertskompatibilitaet fuer MediaPickerModal)
- GET mit `page`: Paginiert `{items, total, page, limit, totalPages, folders, mimeTypes}`
- GET mit `id`: Einzelnes Asset + Usage-Array
- GET Filter: `?q=`, `?type=image`, `?folder=`
- POST: FormData-Upload oder JSON-Metadaten-Update (VIEWER blockiert)
- PATCH: Metadaten aktualisieren (alt, caption, title, folder) per `?id=`
- DELETE: ADMIN only, Usage Guard, loescht Datei + DB-Eintrag

### TODOs (nicht in Phase 2F)

- **Tags:** MediaAsset-Schema hat kein `tags`-Feld. Benoetigt Schema-Migration.
- ~~**SiteSettings/Footer Logos:** Verwenden URL-Strings, nicht MediaAsset-Relationen.~~ → Erledigt in Phase 2H.
- ~~**Produkt-Galerie-Editor:** Kein Admin-Editor fuer ProductImage-Reihenfolge/Upload vorhanden.~~ → Erledigt in Phase 2H.
- **Bildbearbeitung/KI-Analyse:** Bewusst nicht implementiert.

## 8c. Media-Logos & Produktgalerie (Phase 2H)

### SiteSettings Logo via MediaAsset

- `SiteSettings.logoMediaId` → optional MediaAsset-Relation (`logoMedia`)
- Admin-Formular: MediaPickerField unter "Allgemein"
- Public-Rendering Fallback: `logoMedia.url` → `logoDarkUrl` → `null`
- Bestehende `logoDarkUrl`/`logoLightUrl` Felder bleiben als Fallback erhalten

### FooterSettings Logo via MediaAsset

- `FooterSettings.logoMediaId` → optional MediaAsset-Relation (`logoMedia`)
- Admin-Formular: MediaPickerField unter "Allgemein"
- Public-Rendering Fallback: `logoMedia.url` → `logoUrl` → `/mosaroma_logo.png`
- Bestehende `logoUrl` Feld bleibt als Fallback erhalten

### Produktgalerie-Editor (Admin)

- Neues Component: `components/admin/ProductGalleryEditor.tsx`
- Funktionen: Bilder hinzufuegen (via MediaPickerModal), entfernen, Reihenfolge aendern (Hoch/Runter)
- Integriert in `ProductEditForm` als "Produktgalerie"-Sektion
- Galerie wird als `galleryImages[]` Array mit dem Produkt gespeichert
- API: `/api/admin/products` POST loescht bestehende ProductImage-Eintraege und erstellt neue

### Produktgalerie (Public)

- Neues Component: `components/products/ProductImageGallery.tsx` (Client Component)
- Klickbare Thumbnails ersetzen das Hauptbild ohne Page Reload
- Aktiver Thumbnail wird visuell markiert (ring-2, pumpkin)
- Tastaturbedienbar (Buttons mit aria-label, aria-current)
- Responsive: Mobile horizontal scrollend, Desktop Thumbnail-Leiste
- Wenn nur 1 Bild: keine Thumbnail-Leiste
- Wenn keine Galerie: mainImage als einziges Bild
- Datenfluss: `FrontendProduct.galleryItems` (strukturiert mit id/url/alt) + `buildGalleryItems()` in `lib/cms/products.ts`
- Deduplizierung: mainImage wird nicht doppelt angezeigt, falls auch in gallery vorhanden

### Branding Media Backfill (Seed)

- Seed erstellt automatisch einen MediaAsset-Datensatz fuer `/mosaroma_logo.png` (Folder: `branding`)
- `SiteSettings.logoMediaId` wird initial auf diesen MediaAsset gesetzt, nur wenn vorher null
- `FooterSettings.logoMediaId` wird initial auf diesen MediaAsset gesetzt, nur wenn vorher null
- Bestehende Logo-Auswahl wird nicht ueberschrieben
- Seed ist idempotent (kein Duplikat bei erneutem Ausfuehren)
- Media Usage Guard blockiert Loeschen des Branding-Logos, solange es referenziert ist

### Delete-Guards erweitert

- `getMediaAssetUsage()` prueft jetzt 17 Relationen (vorher 13):
  - Neu: `Messung`, `Site-Logo`, `Site-Favicon`, `Footer-Logo`

### Migration

- `20260609130201_add_media_logos`: Fuegt `logoMediaId`, `faviconMediaId` zu SiteSettings und `logoMediaId` zu FooterSettings hinzu

## 8d. Navigation Link Types (Phase 2H)

### Uebersicht

NavigationItems unterstuetzen vier Linktypen, die bestimmen, wie die URL aufgeloest wird:

| Linktyp | Beschreibung | Admin-UI | Public Rendering |
|---|---|---|---|
| PAGE | Verknuepfung mit CMS-Seite | Seiten-Dropdown | URL aus Page.slug, hidden wenn DRAFT/ARCHIVED |
| PAGE_SLUG | Geplante Seite (existiert noch nicht) | Slug-Eingabefeld | Immer hidden (status=missing_page) |
| SYSTEM_ROUTE | Feste Systemroute | Routen-Dropdown | Validiert gegen SYSTEM_ROUTES Liste |
| CUSTOM_URL | Freie interne/externe URL | URL-Eingabefeld | Extern: target=_blank rel=noopener |

### Page-Dropdown im Navigation Editor

- Bei Linktyp PAGE zeigt der Editor ein Dropdown mit allen CMS-Seiten
- Anzeige: `Titel — /slug — STATUS`
- Warnung bei DRAFT/ARCHIVED: "Diese Seite ist nicht veroeffentlicht. Der Link wird oeffentlich nicht angezeigt."
- Beim Speichern wird `linkedPageId` gesetzt
- Beim Wechsel von PAGE auf SYSTEM_ROUTE/CUSTOM_URL wird `linkedPageId` geleert

### Status-Badges im Admin

- **OK** (gruen): Link ist gueltig und oeffentlich sichtbar
- **Entwurf** (gelb): Verknuepfte Seite ist DRAFT
- **Archiviert** (grau): Verknuepfte Seite ist ARCHIVED
- **Seite fehlt** (rot): linkedPageId gesetzt, aber Page existiert nicht
- **Keine Seite** (rot): Linktyp PAGE, aber keine Seite ausgewaehlt
- **Geplant** (blau): Linktyp PAGE_SLUG, Seite existiert noch nicht
- **Ungueltig** (rot): Systemroute nicht in SYSTEM_ROUTES Liste
- **Kein Link** (rot): CUSTOM_URL ohne href

### LinkResolver (`lib/cms/link-resolver.ts`)

Zentrale Utility fuer die Aufloesung von NavigationItem-Links:

```
resolveNavigationLink(item) → {
  href: string | null,
  label: string,
  target?: string,
  rel?: string,
  status: "ok" | "missing_page" | "draft_page" | "archived_page" | "invalid_url",
  source: "page" | "planned_page" | "system_route" | "custom_url" | "legacy_url"
}
```

### Public Rendering

- Nur Links mit `status === "ok"` werden oeffentlich gerendert
- DRAFT/ARCHIVED Page-Links werden oeffentlich NICHT angezeigt
- PAGE_SLUG Links werden oeffentlich NICHT angezeigt (immer missing_page)
- Externe URLs erhalten automatisch `target="_blank" rel="noopener noreferrer"`
- `isActive=false` Items werden bereits in der DB-Query gefiltert

### Revalidation

- Navigation-Aenderungen: `revalidateNavigation()` → revalidiert alle Public Pages
- Page Status/Slug Aenderungen: Wenn die Page mit NavigationItems verknuepft ist, wird `revalidateNavigation()` zusaetzlich aufgerufen
- Footer-Aenderungen: `revalidateFooter()` → revalidiert alle Public Pages

### Footer/Legal Links

- Footer-Links (Kollektionen, Service, Legal) nutzen dasselbe NavigationMenu/NavigationItem System
- FooterSettings speichert Logo, Description, Copyright, Social Links, CTA-Felder, Kontakt-Daten, Bottom-Note
- Footer hat 3 Ebenen: CTA-Bar (optional), Hauptfooter (Marke + Navigation + Kontakt), Bottom-Bar (Copyright + Legal)
- CTA-Bar ist optional und standardmaessig deaktiviert (`ctaEnabled` default: `false`)
- CTA-Bar kann ueber `ctaEnabled` im Admin ein-/ausgeschaltet werden
- Kontakt-Spalte zeigt Firmenadresse, E-Mail, Telefon und einen Button
- Legal-Links (Impressum, Datenschutz, AGB) sind als PAGE verknuepft mit DRAFT-Seiten
- Legal-Links werden oeffentlich erst angezeigt, wenn die Seiten PUBLISHED sind
- Backfill-Script: `npx tsx scripts/backfill-premium-footer-settings.ts` (idempotent, produktionssicher)
- CTA deaktivieren auf Produktion: `npx tsx scripts/disable-footer-cta.ts` (idempotent, aendert nur `ctaEnabled`)

### Dateien

| Datei | Beschreibung |
|---|---|
| `lib/cms/nav-constants.ts` | LINK_TYPES, SYSTEM_ROUTES, LinkType (shared client+server) |
| `lib/cms/page-paths.ts` | PAGE_SLUG_TO_PATH Mapping, pageSlugToPublicPath() (server-only) |
| `lib/cms/link-resolver.ts` | resolveNavigationLink(), Status-Utilities (server-only) |
| `lib/cms/navigation.ts` | DB-Queries mit linkedPage Relation (server-only) |
| `lib/cms/public-layout.ts` | Baut Header/Footer Daten mit Resolver |
| `components/admin/NavigationEditForm.tsx` | Admin-Formular mit Linktyp-UI |
| `app/admin/navigation/[id]/page.tsx` | Laedt Pages-Liste und linkedPage-Daten |
| `app/api/admin/navigation/route.ts` | Speichert linkType, linkedPageId, isActive |

### Navigation Badges

NavigationItems koennen optional einen Badge (kleines Label) neben dem Menuepunkt anzeigen.

**Prisma-Felder:**
- `badgeText String?` — Badge-Text (z.B. „NEU", „Sale", „2027"). Wenn leer/null: kein Badge.
- `badgeVariant String @default("blue")` — Farbvariante: `blue`, `orange`, `dark`, `light`.

**Admin-Pflege:**
- Pro NavigationItem: Badge-Text (Textfeld) + Badge-Farbe (Dropdown)
- Inline-Vorschau im Editor wenn Badge-Text gesetzt
- Badge-Info in der Item-Kopfzeile als blaues Tag sichtbar

**Badge-Varianten:**

| Variante | Hintergrund | Text |
|----------|-------------|------|
| `blue` | #2F7195 (Nerio/Oceana-Blau) | Weiss |
| `orange` | Pumpkin | Weiss |
| `dark` | Anthracite | Weiss |
| `light` | Weiss/90 | Anthracite |

**Rendering:**
- Desktop: Badge inline rechts neben dem Label, 9px uppercase, bold, gerundet
- Mobile: Badge inline rechts neben dem Label in der Mobile-Nav
- Badges werden auf hellem und dunklem Header-Hintergrund sauber dargestellt
- Wenn `badgeText` leer ist, wird kein Badge gerendert

**Backfill-Script:** `scripts/backfill-nerio-nav-badge.ts`
- Ersetzt den Header-Menuepunkt „Kontakt" durch „Nerio" mit Link auf `/kollektionen/nerio-oceana` und Badge „NEU"
- Idempotent: erkennt bestehende Nerio-Eintraege
- Dry-run: `npx tsx scripts/backfill-nerio-nav-badge.ts`
- Apply: `npx tsx scripts/backfill-nerio-nav-badge.ts --apply`
- Der rechte Kontakt-CTA-Button im Header bleibt unveraendert (hardcodiert in Header.tsx)

### Migrationen

- `20260609141011_add_nav_link_type`: Fuegt `linkType` Spalte zu NavigationItem hinzu (Default: CUSTOM_URL)
- `20260615064442_add_navigation_badges`: Fuegt `badgeText` und `badgeVariant` zu NavigationItem hinzu

## 8b. Rich Text Editing (Phase 2G)

### Technologie

- **Editor:** TipTap (basiert auf ProseMirror)
- **Sanitizing:** sanitize-html (serverseitig)
- **Datenformat:** HTML-String, serverseitig sanitiert

### Komponenten

| Komponente         | Datei                                          | Funktion                              |
| ------------------ | ---------------------------------------------- | ------------------------------------- |
| `RichTextEditor`   | `components/admin/RichTextEditor.tsx`           | Kontrollierter WYSIWYG-Editor (Client)|
| `RichTextRenderer` | `components/rich-text/RichTextRenderer.tsx`     | Sichere HTML-Ausgabe + Plain-Text-Fallback |
| `sanitizeRichText` | `lib/server/sanitize-rich-text.ts`              | Server-seitiges HTML-Sanitizing       |
| `isRichTextEmpty`  | `lib/server/sanitize-rich-text.ts`              | Prueft ob HTML-Inhalt leer ist        |

### Erlaubte Formatierungen

| Element      | Tag            | Erlaubt |
| ------------ | -------------- | ------- |
| Absatz       | `p`            | Ja      |
| Fett         | `strong`       | Ja      |
| Kursiv       | `em`           | Ja      |
| Aufzaehlung  | `ul`, `li`     | Ja      |
| Nummerierung | `ol`, `li`     | Ja      |
| Zeilenumbruch| `br`           | Ja      |
| Link         | `a`            | Ja (href, target, rel) |
| Ueberschrift | `h3`, `h4`     | Ja      |

### Bewusst NICHT erlaubt

- Inline-Farben, Font-Auswahl, Schriftgroessen
- Bilder im Rich Text (nur ueber MediaPicker/Sections)
- script, iframe, style-Attribute, Event-Handler
- Beliebige HTML-Tags

### Felder mit Rich Text

- **PageSection content** (alle Styles inkl. Homepage-Sections)
- **PageSection settings.items** (care-list Eintraege)
- **NewsArticle content**

### Felder bleiben Plain Text

- Titel, Slugs, Eyebrow, Headlines
- Button Labels, URLs, Hrefs
- SEO Title, SEO Description
- Fabric Card Felder, Comparison Table Werte
- Highlight Card Items (kurze Texte)
- Measurement Rows, Labels, technische Werte
- Value-Props Card Text (kurz, kein Rich Text noetig)
- Sustainability Stat Value/Label/Detail (kurz)
- Bulletpoints (image-text-feature, kurze Texte)

### Absatzverhalten im Editor

- **Enter** erzeugt einen neuen Absatz (`<p>`) — sichtbar als Abstand
- **Shift+Enter** erzeugt einen Zeilenumbruch (`<br>`) innerhalb desselben Absatzes
- Der Editor zeigt Absatzabstaende sofort im Backend
- Gespeichertes Format: HTML mit `<p>`, `<br>`, `<ul>`, `<ol>`, `<a>` etc.
- Sanitizer entfernt unsichere Tags (script, style, onclick) und behaelt erlaubte Tags

### Absatzdarstellung auf der Website

- `RichTextRenderer` rendert HTML-Inhalte mit Absatzabstaenden (CSS-Klasse `.rich-text`)
- Zwischen zwei Absaetzen (`<p>`) entsteht automatisch sichtbarer Abstand (0.75em)
- Listen (`<ul>`, `<ol>`) haben passende Einrueckung und Abstaende
- Links erscheinen in Mosaroma-Orange mit Unterstreichung
- **Plain-Text-Fallback:** Aeltere Inhalte ohne HTML-Tags werden automatisch korrekt dargestellt:
  - Doppelte Zeilenumbrueche (`\n\n`) werden als separate Absaetze gerendert
  - Einfache Zeilenumbrueche (`\n`) werden als `<br>` innerhalb eines Absatzes gerendert
  - Plain Text wird HTML-escaped (kein XSS-Risiko)

### Sanitizing

Alle Rich-Text-Felder werden serverseitig sanitiert bevor sie in die DB geschrieben werden:
- `page-sections` API: content + settings.items
- `news` API: content

Unerlaubte Tags werden entfernt. Links erhalten automatisch `rel="noopener noreferrer"`.

### Plain-Text-Fallback

`RichTextRenderer` erkennt automatisch ob der Inhalt HTML oder Plain Text ist. Bestehende Plain-Text-Inhalte werden weiterhin korrekt gerendert. Keine Migration noetig.

## 9. Frontend-Anbindung (Phase 2A + 2B — aktiv)

### Status

Das oeffentliche Frontend liest Daten aus der CMS-Datenbank. Alle 15 oeffentlichen Seiten sind angebunden (Phase 2A), Kollektionen sind vollstaendig datenbankfaehig (Phase 2B). Wenn die DB leer ist oder CMS-Felder fehlen, greifen automatisch die statischen Fallback-Daten.

### Revalidierung (ISR + On-Demand)

Alle oeffentlichen Seiten nutzen `export const revalidate = 60` als Fallback (Incremental Static Regeneration). Zusaetzlich loesen alle Admin-API-Routen nach erfolgreichen Aenderungen `revalidatePath()` aus, um die betroffenen oeffentlichen Seiten sofort zu invalidieren.

**Vor Phase 2H:** Aenderungen im Admin waren erst nach bis zu 60 Sekunden sichtbar, weil Next.js ISR die Seiten fuer 60 Sekunden cached und keine On-Demand-Invalidierung stattfand.

**Ab Phase 2H:** Aenderungen im Admin sind sofort sichtbar, da jede Admin-API-Route nach dem Speichern gezielt die betroffenen Public-Pfade invalidiert. Die 60-Sekunden-Revalidierung bleibt als Sicherheitsnetz erhalten.

#### Revalidation-Zuordnung

| Admin-Aktion | Invalidierte Public-Pfade |
|---|---|
| Seite speichern/Status | Zugehoerige oeffentliche Seite (z.B. `/kontakt`, `/kataloge`) |
| PageSection speichern | Seite der Section (z.B. `/` fuer home, `/kataloge/pflege-garantie`) |
| Kollektion speichern/Status | `/`, `/kollektionen`, `/kollektionen/[slug]` |
| Produkt speichern/Status | `/produkte/[slug]`, `/kollektionen/[slug]`, `/produktkategorien/[slug]` |
| Produktgruppe speichern | `/produktkategorien`, `/produktkategorien/[slug]` |
| Material speichern | `/materialien` |
| Download speichern | `/kataloge` |
| Measurement speichern | `/kataloge/produktmasse` |
| News speichern/Status | `/neuigkeiten`, `/neuigkeiten/[slug]` |
| Kontaktformular speichern | `/kontakt` |
| Navigation speichern | Alle Seiten (Layout-Revalidierung) |
| Footer speichern | Alle Seiten (Layout-Revalidierung) |
| Einstellungen speichern | Alle Seiten (Layout-Revalidierung) |

#### Technische Details

- Utility: `lib/server/revalidate-cms.ts` (server-only)
- Verwendet `revalidatePath()` aus `next/cache`
- Navigation/Footer/Settings invalidieren das Root-Layout (`revalidatePath("/", "layout")`) — alle Seiten werden neu gerendert
- Robuste Fehlerbehandlung: Revalidation-Fehler werden geloggt, crashen aber nicht die API-Response
- `revalidate = 60` bleibt als Sicherheitsnetz bestehen

### CMS-Helper (`lib/cms/`)

Alle Helper nutzen `import "server-only"` und `try/catch` mit Fallback auf `null` bzw. `[]`.

| Datei              | Funktionen                                                | Frontend-Status     |
| ------------------ | --------------------------------------------------------- | ------------------- |
| `settings.ts`      | `getSiteSettings()`                                       | Aktiv (alle Seiten) |
| `navigation.ts`    | `getHeaderNavigation()`, `getFooterNavigation()`          | Aktiv (alle Seiten) |
| `footer.ts`        | `getFooterSettings()`                                     | Aktiv (alle Seiten) |
| `pages.ts`         | `getPublishedPages()`, `getPublishedPageBySlug()`         | Aktiv (Hero + SEO)  |
| `media.ts`         | `getMediaAssets()`, `getMediaAssetById()`                 | Aktiv (Hero-Bilder) |
| `media-url.ts`     | `getMediaUrl(asset, fallback)`                            | Aktiv (URL-Aufloesung) |
| `public-layout.ts` | `getPublicLayoutData()`                                   | Aktiv (alle Seiten) |
| `page-hero.ts`     | `getPageHeroData(slug, fallbackKey)`                      | Aktiv (alle Seiten) |
| `collections.ts`   | `getPublishedCollections()`, `getCollectionBySlug()`, `getCollectionStaticParams()`, `mapCollectionForFrontend()` | Aktiv (Phase 2B) |
| `products.ts`      | `getPublishedProducts()`, `getProductBySlugWithStatus()`, `getProductsByCollectionSlug()`, `getProductsByProductGroupSlug()`, `getProductStaticParams()`, `mapProductForFrontend()` | Aktiv (Phase 2C) |
| `product-groups.ts`| `getActiveProductGroups()`, `getProductGroupBySlugWithStatus()`, `getProductGroupStaticParams()`, `mapProductGroupForFrontend()` | Aktiv (Phase 2C) |
| `homepage.ts`      | `getHomepageData()`                                       | Aktiv (Startseite) |
| `service-pages.ts` | `getServicePageBySlug()`                                  | Aktiv (Phase 2D-C) |
| `forms.ts`         | `getFormBySlug()`, `createSubmission()`                   | Noch nicht |

### Was aus der DB gelesen wird

| Bereich                | DB-Quelle                        | Fallback                              |
| ---------------------- | -------------------------------- | ------------------------------------- |
| Header-Logo            | `SiteSettings.logoDarkUrl`       | `/mosaroma_logo.png`                  |
| Header-Navigation      | `NavigationMenu` (HEADER)        | `lib/mosaroma/navigation.ts`          |
| Footer-Navigation      | `NavigationMenu` (FOOTER + LEGAL)| `lib/mosaroma/footer.ts`              |
| Footer-Logo            | `FooterSettings.logoUrl`         | `/mosaroma_logo.png`                  |
| Footer-Beschreibung    | `FooterSettings.description`     | `lib/mosaroma/footer.ts`              |
| Footer-Copyright       | `FooterSettings.copyrightText`   | Hardcoded Fallback                    |
| Footer-Social-Links    | `FooterSettings.socialLinks`     | Statische Platzhalter-Icons           |
| Footer-CTA             | `FooterSettings.cta*`            | Hardcoded Defaults (Beratung & Muster)|
| Footer-Kontakt         | `FooterSettings.company*/address*` | Mosaroma Industries GmbH Defaults   |
| Footer-Bottom-Note     | `FooterSettings.bottomNote`      | Nicht angezeigt wenn leer             |
| Seitenname             | `SiteSettings.siteName`          | "Mosaroma"                            |
| SEO-Titel (global)     | `SiteSettings.defaultSeoTitle`   | "Mosaroma \| Design trifft Performance" |
| SEO-Beschreibung       | `SiteSettings.defaultSeoDescription` | Statischer Text                   |
| Hero-Eyebrow           | `Page.eyebrow`                   | `lib/mosaroma/pageHeroes.ts`          |
| Hero-Headline          | `Page.headline`                  | `lib/mosaroma/pageHeroes.ts`          |
| Hero-Einleitungstext   | `Page.introText`                 | `lib/mosaroma/pageHeroes.ts`          |
| Hero-Bild              | `Page.heroImage` (MediaAsset)    | `lib/mosaroma/pageHeroes.ts`          |
| SEO-Titel (pro Seite)  | `Page.seoTitle`                  | Globaler Default                      |
| SEO-Beschreibung       | `Page.seoDescription`            | Globaler Default                      |
| Kollektionen-Uebersicht| `Collection` (PUBLISHED, order)  | `lib/mosaroma/collections.ts`         |
| Kollektion-Name        | `Collection.name`                | `lib/mosaroma/collections.ts`         |
| Kollektion-Eyebrow     | `Collection.eyebrow`             | "Kollektion {number}"                 |
| Kollektion-Beschreibung| `Collection.shortDescription`    | `lib/mosaroma/collections.ts`         |
| Kollektion-Langtext    | `Collection.longDescription`     | `lib/mosaroma/collections.ts`         |
| Kollektion-Hero-Bild   | `Collection.heroImage` (MediaAsset) | `/images/placeholders/collections/hero/` |
| Kollektion-Card-Bild   | `Collection.cardImage` (MediaAsset) | `/images/placeholders/collections/`  |
| Kollektion-MoodColors  | `Collection.moodColors` (JSON)   | `lib/mosaroma/collections.ts`         |
| Kollektion-Stoff       | `Collection.fabric`              | `lib/mosaroma/collections.ts`         |
| Kollektion-SEO         | `Collection.seoTitle/Description`| Name-basierter Fallback               |
| Produkte (Kollektion)  | `Product` (PUBLISHED, nach Gruppe) | `lib/mosaroma/products.ts`          |
| Produkte (Kategorie)   | `Product` (PUBLISHED, nach Kollektion) | `lib/mosaroma/products.ts`      |
| Produkt-Detail         | `Product` (PUBLISHED, slug)      | `lib/mosaroma/products.ts`            |
| Produkt-Hauptbild      | `Product.mainImage` (MediaAsset) | `/images/placeholders/products/`      |
| Produkt-Hero-Bild      | `Product.heroImage` (MediaAsset) | mainImage / Kollektion-Hero / Default |
| Produkt-Galerie        | `ProductImage` (sortiert nach order) | mainImage als Fallback             |
| Produkt-SEO            | `Product.seoTitle/Description`   | Name-basierter Fallback               |
| Produktgruppen-Liste   | `ProductGroup` (isActive, order) | `lib/mosaroma/categories.ts`          |
| Produktgruppe-Detail   | `ProductGroup` (isActive, slug)  | `lib/mosaroma/categories.ts`          |
| Startseite Sektionen   | `PageSection` (via Page home, 7 Styles) | FALLBACK_SECTIONS in `app/page.tsx` |
| Pflege & Garantie      | `PageSection` (via Page pflege-garantie) | Statische Fallback-Inhalte im Page-File |
| Stoff- & techn. Daten  | `PageSection` (via Page stoff-technische-daten) | `lib/mosaroma/materials.ts`       |

### Architektur-Muster

```
Server Page (async) → getPublicLayoutData() + getPageHeroData()
  ├─ <Header navItems={...} logoUrl={...} siteName={...} />  (Client Component)
  ├─ <PageHero eyebrow={...} title={...} ... />
  ├─ ... (Seiten-Inhalt, statisch oder CMS)
  └─ <Footer description={...} columns={...} ... />          (Server Component)
```

- **Kein Prisma in Client Components** — Alle DB-Zugriffe erfolgen in Server Components bzw. async Page-Funktionen. Daten werden als Props an Client Components uebergeben.
- **`server-only`** — Alle CMS-Helper importieren `server-only`, was einen Build-Fehler erzeugt, falls sie versehentlich in einem Client Bundle landen.

### So aendern Sie Inhalte im Admin

| Was Sie aendern wollen        | Wo im Admin                          |
| ----------------------------- | ------------------------------------ |
| Header-Logo                   | Einstellungen → Logo (dunkel)        |
| Header-Links                  | Navigation → HEADER Menu bearbeiten  |
| Footer-Links                  | Navigation → FOOTER / LEGAL Menus    |
| Footer-Logo / Beschreibung    | Footer-Einstellungen                 |
| Footer-Social-Links           | Footer-Einstellungen → Social Links  |
| Hero einer Seite              | Seiten → Seite waehlen → Eyebrow, Headline, Einleitungstext, Hero-Bild |
| SEO-Titel einer Seite         | Seiten → Seite waehlen → SEO Titel   |
| Globaler SEO-Titel            | Einstellungen → Standard SEO Titel   |
| Kontaktdaten                  | Einstellungen → E-Mail, Telefon, Adresse |
| Kollektion-Name/Beschreibung  | Kollektionen → Kollektion waehlen → Name, Kurzbeschreibung, Langbeschreibung |
| Kollektion-Hero-Bild          | Kollektionen → Kollektion waehlen → Bilder → Hero-Bild |
| Kollektion-Card-Bild          | Kollektionen → Kollektion waehlen → Bilder → Card-Bild |
| Kollektion-Stimmungsfarben    | Kollektionen → Kollektion waehlen → Stimmungsfarben (Farben hinzufuegen/entfernen) |
| Kollektion-SEO                | Kollektionen → Kollektion waehlen → SEO Titel / Beschreibung |
| Kollektion veroeffentlichen   | Kollektionen → Kollektion waehlen → Status auf PUBLISHED setzen |
| Produkt-Name/Beschreibung     | Produkte → Produkt waehlen → Name, Kurzbeschreibung, Beschreibung |
| Produkt-Hauptbild             | Produkte → Produkt waehlen → Bilder → Hauptbild |
| Produkt-Hero-Bild             | Produkte → Produkt waehlen → Bilder → Hero-Bild |
| Produkt-Status                | Produkte → Produkt waehlen → Status (DRAFT/PUBLISHED/ARCHIVED) |
| Produkt-SEO                   | Produkte → Produkt waehlen → SEO Titel / Beschreibung |
| Produktgruppe bearbeiten      | Produktgruppen → Gruppe waehlen → Name, Beschreibung, Bild |
| Produktgruppe (de)aktivieren  | Produktgruppen → Gruppe waehlen → Aktiv-Checkbox |
| Startseite Hero                | Seiten → home → Sektionen → home-hero bearbeiten (Eyebrow, Titel, Subheadline, CTAs, Bild) |
| Startseite Werte-Karten        | Seiten → home → Sektionen → value-props bearbeiten (Karten mit Icon, Titel, Text) |
| Startseite Mackintosh-Feature  | Seiten → home → Sektionen → image-text-feature bearbeiten (Titel, Text, Bulletpoints, Bild) |
| Startseite Kollektions-Teaser  | Seiten → home → Sektionen → collection-showcase bearbeiten (Eyebrow, Titel, Text) |
| Startseite Nachhaltigkeit      | Seiten → home → Sektionen → sustainability-stats bearbeiten (Stats: Wert, Label, Detail) |
| Startseite Downloads-Teaser    | Seiten → home → Sektionen → downloads-teaser bearbeiten (Eyebrow, Titel, Text) |
| Startseite News-Teaser         | Seiten → home → Sektionen → news-teaser bearbeiten (Eyebrow, Titel, Text) |
| Pflege & Garantie Sichtbarkeit | Seiten → pflege-garantie → Status (PUBLISHED/DRAFT/ARCHIVED) |
| Stoff- & techn. Daten Sichtbarkeit | Seiten → stoff-technische-daten → Status (PUBLISHED/DRAFT/ARCHIVED) |

### Persistenz in Produktion (TODO)

Aktuell liegen DB und Uploads im Projektverzeichnis. Fuer Produktions-Deployments mit Zero-Downtime wird empfohlen:

```
/var/www/web.mosaroma.de/
  shared/
    mosaroma.db          ← SQLite DB (persistent)
    uploads/             ← Hochgeladene Medien (persistent)
  releases/
    current/             ← Aktueller Build (Symlink)
```

**Notwendige Symlinks / Env-Anpassungen:**
- `DATABASE_URL=file:/var/www/web.mosaroma.de/shared/mosaroma.db`
- `public/uploads → /var/www/web.mosaroma.de/shared/uploads`

Dies ist ein TODO fuer das Deployment-Setup und noch nicht implementiert.

## 10. Was funktioniert (vollstaendig geprueft)

### Admin
- Login / Logout / Session-Management
- Alle 15+ Admin-Listenseiten laden und zeigen Seed-Daten
- Alle Erstellungsformulare (`/new`) laden korrekt
- Vollstaendiges CRUD fuer alle Entitaeten (Create, Read, Update, Archive/Deactivate, Delete)
- Statusfilter auf allen Listenseiten (StatusFilter-Komponente)
- DangerZone auf allen Bearbeitungsseiten (Archivieren, Deaktivieren, Loeschen)
- ListActions auf allen Listenseiten (Bearbeiten, Archivieren/Deaktivieren)
- Downloads CRUD (API, Liste, Erstellen, Bearbeiten, Deaktivieren, Loeschen)
- Measurements CRUD (API mit JSON-Validierung, Liste, Erstellen, Bearbeiten, Deaktivieren, Loeschen)
- News CRUD (API, Liste, Erstellen, Bearbeiten, Hero/Card-Bild, Status, Loeschen)
- Medien-Upload mit Dateivalidierung (Typ + Groesse)
- Medien-Loeschen mit Usage Guard (blockiert wenn referenziert)
- Dateiname-Sanitierung mit Zeitstempel
- Navigation bearbeiten (Items hinzufuegen/entfernen/sortieren)
- Footer-Einstellungen bearbeiten
- Website-Einstellungen bearbeiten
- Benutzer-Verwaltung (nur ADMIN-Rolle) mit Loeschguards
- Kontaktformular-Konfiguration mit Inline-Feldverwaltung
- Formular-Einreichungen (lesen, loeschen, gelesen/ungelesen Filter)
- Health-Check Endpunkt
- Proxy-basierter Auth-Schutz fuer alle Admin-Routen

### Frontend (Phase 2A)
- Alle 15 oeffentlichen Seiten lesen Header/Footer/Hero/SEO aus der DB
- ISR mit 60s Revalidierung auf allen oeffentlichen Seiten
- Sichere Fallbacks: Frontend funktioniert auch bei leerer DB
- Header-Logo, Navigation und Sitename aus CMS
- Footer-Logo, Beschreibung, Copyright, Navigation, Legal-Links und Social-Links aus CMS
- Hero-Bereich (Eyebrow, Headline, Einleitungstext, Bild) pro Seite aus CMS
- SEO-Metadaten (Titel + Beschreibung) global und pro Seite aus CMS
- Admin-Hinweistexte bei CMS-relevanten Feldern

### Frontend (Phase 2B)
- /kollektionen liest Kollektion-Uebersicht aus DB (nur PUBLISHED, sortiert nach order)
- /kollektionen/[slug] liest Kollektion-Kopfdaten aus DB (Name, Eyebrow, Beschreibungen, Hero, MoodColors, SEO)
- Kollektion-Hero-Bild und Card-Bild aus MediaAsset mit Fallback auf Platzhalter
- MoodColors robust geparst (JSON Array, Komma-String, null)
- Kollektion-SEO dynamisch aus DB mit Fallback
- generateStaticParams aus DB + statischen Kollektionen kombiniert
- Admin: Hero/Card-Bildauswahl mit Vorschau, Mood-Color-Editor mit Farbfeldern
- **DRAFT/ARCHIVED Kollektionen** werden auf Detailseiten nicht angezeigt (404), auch wenn ein statischer Fallback mit gleichem Slug existiert. Statischer Fallback greift nur, wenn die Kollektion in der DB nicht existiert oder die DB nicht erreichbar ist.

### Frontend (Phase 2C)
- /kollektionen/[slug] zeigt Produkte aus DB (gruppiert nach Produktkategorie), Fallback auf statische Produkte
- /produktkategorien liest Produktgruppen aus DB (nur isActive, sortiert nach order), Fallback auf statische Kategorien
- /produktkategorien/[slug] liest Produktgruppe aus DB mit Statusregel, Produkte aus DB gruppiert nach Kollektion
- /produkte/[slug] liest Produkt aus DB mit Statusregel, SEO, Galerie, verwandte Produkte aus DB
- ProductCard akzeptiert sowohl statische als auch DB-Produkte (einheitliches Interface)
- **DRAFT/ARCHIVED Produkte** werden nicht oeffentlich angezeigt, auch wenn ein statischer Fallback existiert
- **Inaktive Produktgruppen** werden nicht oeffentlich angezeigt, auch wenn ein statischer Fallback existiert
- Statische Fallbacks in `lib/mosaroma/` bleiben unveraendert als Absicherung
- TypeScript-Build ohne Fehler
- ESLint ohne Fehler

### Premium Collection Detail Template

Die Kollektions-Detailseite (`/kollektionen/[slug]`) ist als generisches Premium-Template fuer alle Kollektionen aufgebaut.

**Seitenstruktur:**

1. **Hero** — Collection Name, Eyebrow, Subtitle, CMS-Bild oder Mood-Color-Gradient als Fallback
2. **BreadcrumbBar** — Standard-Breadcrumb
3. **Anchor Navigation** — sticky, scrollt zu Sektionen (Farben, Produkte, Material, Service, Beratung)
4. **Intro + Quick Facts** — LongDescription links, Quick-Facts-Box rechts (Stoff, Faerbung, Material, Produktanzahl, Palette)
5. **Stimmungsfarben** — Mood Colors als groessere Farbfelder mit HEX-Code und Collection-Nummerierung
6. **Produkte** — gruppiert nach Produktgruppen mit Gruppenheader, Produktanzahl, Premium-Produktkarten
7. **Material** — zweispaltig: Stoffbeschreibung links, Eigenschaften-Checkliste rechts
8. **Service Links** — 4 Karten: Produktmasse, Pflege & Garantie, Technische Daten, Kataloge
9. **Collection CTA** — dynamischer CTA mit Collection-Name, dunkler Hintergrund
10. **Footer**

**Datenquellen:**

| Bereich | DB-Quelle | Fallback |
|---|---|---|
| Hero-Bild | Collection.heroImage (MediaAsset) | Mood-Color-Gradient |
| Intro | Collection.longDescription, shortDescription | Statische Fallbacks |
| Quick Facts | Collection.fabric + fabricQualities (statisch) | Nur verfuegbare Daten |
| Mood Colors | Collection.moodColors (JSON Array) | Leerer Bereich |
| Produkte | Product + ProductGroup (DB) | Statische Produkte |
| Material | Collection.fabric + fabricQualities | Nur Fabric-Name |
| CTA | Collection.name (dynamisch) | Generischer Text |

**Komponenten:**

| Komponente | Datei | Verwendung |
|---|---|---|
| CollectionProductCard | `components/CollectionProductCard.tsx` | Nur Collection-Detail |
| CollectionAnchorNav | `components/CollectionAnchorNav.tsx` | Nur Collection-Detail |
| ProductCard (global) | `components/ProductCard.tsx` | Nicht veraendert, genutzt auf anderen Seiten |

**Placeholder-System:**

- Hero: Mood-Color-Gradient mit Fasertextur (kein SVG-Fallback noetig)
- Produktbilder: Collection-Mood-Color-Gradient mit Fasertextur
- Kein "Bild fehlt" Icon, stattdessen visuelle Qualitaet

**CMS-Pflege:**

- Collection-Daten: Admin → Kollektionen → Kollektion bearbeiten
- Mood Colors: Farbeditor im Admin
- Produkte: Admin → Produkte → Bilder, Texte, Material, Gruppe
- Produktgruppen: Admin → Produktkategorien → Name, Beschreibung, Reihenfolge
- Kein Backfill noetig — alle Daten bestehen bereits

**Revalidation:**

- Collection-Aenderung → `revalidateCollection(slug)` → /, /kollektionen, /kollektionen/[slug]
- Product-Aenderung → `revalidateProduct(slug, collectionSlug)` → /kollektionen/[collectionSlug]
- MediaAsset-Aenderung → sichtbar beim naechsten Rebuild (revalidate=60)

## 11. Was noch fehlt (Phase 2C / spaeter)

### Phase 2A — erledigt
- [x] Frontend mit DB verbinden (SiteSettings, Logo, Navigation, Footer, Hero, SEO)
- [x] ISR mit 60s Revalidierung auf allen oeffentlichen Seiten
- [x] Alle CMS-Helper mit `server-only` und Fehlerbehandlung
- [x] Admin-Hinweistexte fuer CMS-relevante Felder
- [x] ESLint fehlerfrei

### Phase 2B — erledigt
- [x] Kollektionen-Uebersicht aus DB (`/kollektionen`)
- [x] Kollektion-Detailseite aus DB (`/kollektionen/[slug]`)
- [x] Kollektion-Hero/Card-Bilder aus MediaAsset mit Fallback
- [x] MoodColors robust (JSON Array, Komma-String, null)
- [x] Kollektion-SEO dynamisch aus DB
- [x] generateStaticParams aus DB + Fallback
- [x] Admin: Hero/Card-Bildauswahl mit Vorschau
- [x] Admin: Mood-Color-Editor (hinzufuegen/entfernen/bearbeiten)
- [x] Admin: Eyebrow-Feld, Public-URL-Link
- [x] Seed-Daten erweitert (Beschreibungen, SEO, Eyebrow)
- [x] Prisma-Migration fuer `Collection.eyebrow`

### Phase 2C — erledigt
- [x] CMS-Helper `products.ts` — `getPublishedProducts()`, `getProductBySlugWithStatus()`, `getProductsByCollectionSlug()`, `getProductsByProductGroupSlug()`, `getProductStaticParams()`, `mapProductForFrontend()`
- [x] CMS-Helper `product-groups.ts` — `getActiveProductGroups()`, `getProductGroupBySlugWithStatus()`, `getProductGroupStaticParams()`, `mapProductGroupForFrontend()`
- [x] `/produktkategorien` liest Gruppen aus DB (nur isActive, sortiert nach order)
- [x] `/produktkategorien/[slug]` liest Gruppen aus DB mit Statusregel (isActive=false → 404, nicht gefunden → statischer Fallback)
- [x] `/produkte/[slug]` liest Produkt aus DB mit Statusregel (PUBLISHED → anzeigen, DRAFT/ARCHIVED → 404, nicht gefunden → statischer Fallback)
- [x] `/kollektionen/[slug]` liest Produkte pro Kollektion aus DB (gruppiert nach Produktkategorie)
- [x] ProductCard akzeptiert sowohl statische als auch DB-Produkte
- [x] Admin: Produktgruppen-Verwaltung (Liste, Erstellen, Bearbeiten, Icon/Bild-Picker)
- [x] Admin: Produkt-Bearbeitung erweitert (Kurzbeschreibung, Hauptbild, Hero-Bild aus MediaAssets)
- [x] Admin: Produkte-Liste mit Suche, Filter, Pagination, Sortierung, Bildstatus
- [x] Admin: Produktgruppen im Sidebar
- [x] API: `POST /api/admin/products` erweitert (shortDescription, heroImageId, mainImageId)
- [x] API: `GET/POST /api/admin/product-groups`
- [x] Seed: Produktgruppen mit Beschreibungen
- [x] Seed: Slug-Fix tischsets-tischlaufer → tischsets-tischlaeufer
- [x] Seed: Alle 209 statischen Produkte vollstaendig in DB importiert
- [x] Seed: 2 zusaetzliche Materialien (Bambusfaser, Acryl) fuer Decken-Produkte
- [x] Seed: Idempotent — bereits vorhandene Produkte werden aktualisiert, Admin-gepflegte Felder (SEO, Bilder) bleiben erhalten
- [x] Statische Fallbacks erhalten (lib/mosaroma/ Dateien unveraendert)
- [x] **DRAFT/ARCHIVED Produkte** werden nicht oeffentlich angezeigt, auch wenn ein statischer Fallback existiert
- [x] **Inaktive Produktgruppen** werden nicht oeffentlich angezeigt, auch wenn ein statischer Fallback existiert

### Produktdaten-Migration (Phase 2C Erweiterung)

Die Datenbank ist jetzt die primaere Quelle fuer alle 209 Produkte. Die statischen Daten in `lib/mosaroma/products.ts` dienen nur noch als Bild-Fallback, wenn ein DB-Produkt kein eigenes mainImage/heroImage hat.

**Importierte Felder pro Produkt:**
- `slug`, `name`, `code`, `size`, `description`, `features`, `colorName`, `patternName`
- `collectionId` (via `collectionSlug` → `Collection.slug`)
- `productGroupId` (via `categorySlug` → `ProductGroup.slug`)
- `materialId` (via `materialSlug` → `Material.slug`)
- `status` → PUBLISHED

**Nicht importierte / noch fehlende Felder:**
- `mainImageId`, `heroImageId` → null (statische Bilder als Fallback via `mapProductForFrontend`)
- `shortDescription` → null (nicht in statischen Daten vorhanden)
- `seoTitle`, `seoDescription` → null (im Admin pflegbar)
- `ProductImage` Galerie-Eintraege → noch nicht migriert (statische Gallery-Pfade dienen als Fallback)

**Bildfallback-Kette:**
1. `Product.mainImage` (MediaAsset aus DB) → bestes Bild
2. Statisches Produkt mit gleichem Slug → `staticProduct.image`
3. Kollektion-Platzhalter → `/images/placeholders/products/product-{collectionSlug}.svg`

**Neue Produkte im Admin pflegen:**
1. Produkte → Neues Produkt
2. Name, Slug, Code, Zuordnung (Kollektion, Produktgruppe, Material)
3. Optional: Hauptbild und Hero-Bild aus Medien waehlen
4. Status auf PUBLISHED setzen
5. Produkt erscheint sofort auf der Website (On-Demand Revalidierung)

### Delete/Archive — erledigt
- [x] Delete-Funktion fuer alle Entitaeten (Seiten, Kollektionen, Produkte, Medien, etc.)
- [x] Medien-Loeschen — Datei + DB-Eintrag entfernen (mit Usage Guard)
- [x] DangerZone-Komponente auf allen Bearbeitungsseiten
- [x] ListActions-Komponente auf allen Listenseiten
- [x] Rollen-basierte Berechtigungen (ADMIN, EDITOR, VIEWER)
- [x] Delete Guards fuer referenzierte Entitaeten

### Downloads/Measurements/News CRUD — erledigt
- [x] Downloads CRUD (API: GET/POST/PATCH/DELETE, Liste, Erstellen, Bearbeiten, Deaktivieren, Loeschen)
- [x] Measurements CRUD (API: GET/POST/PATCH/DELETE, Liste, Erstellen, Bearbeiten, JSON-Validierung, Deaktivieren, Loeschen)
- [x] News CRUD (API: GET/POST/PATCH/DELETE, Liste, Erstellen, Bearbeiten, Hero/Card-Bild, Archivieren, Loeschen)

### Statusfilter — erledigt
- [x] Wiederverwendbare StatusFilter-Komponente (`components/admin/StatusFilter.tsx`)
- [x] Filter auf allen Admin-Listenseiten:
  - Pages, Collections, Products, News: PUBLISHED / DRAFT / ARCHIVED
  - ProductGroups, Materials, Downloads, Measurements: Aktiv / Inaktiv
  - Users: Admin / Redakteur / Betrachter (Rollenfilter)
  - Submissions: Ungelesen / Gelesen

### Erledigt — Phase 2D-A (Kontaktformular Frontend-Anbindung)
- [x] Oeffentliches Kontaktformular `/kontakt` aus DB rendern (dynamische Felder)
- [x] PublicContactForm Client-Komponente mit Mosaroma-Design
- [x] Submit-API `/api/forms/[slug]/submit` mit Validierung
- [x] Spam-Schutz: Honeypot, Mindest-Absende-Zeit (3s), In-Memory Rate-Limiting (5/min)
- [x] IP-Anonymisierung (SHA-256 Hash, 16 Zeichen)
- [x] Nur konfigurierte Felder akzeptiert (keine beliebigen Felder)
- [x] Strings getrimmt, Laenge begrenzt (1000/5000 Zeichen)
- [x] CONSENT-Feld mit Pflicht-Validierung
- [x] E-Mail-Benachrichtigung via SMTP (Nodemailer, graceful degradation)
- [x] Submission zuerst gespeichert, E-Mail danach (Fire-and-forget)
- [x] FormSubmission.meta Feld hinzugefuegt (IP-Hash, User-Agent, Timestamp)
- [x] Fallback-Strategie: not-found/error → statisches Formular, inactive → Hinweis
- [x] Admin-Editor erweitert: Platzhalter, Hilfstext, Optionen (kommagetrennt)
- [x] Seed aktualisiert: 7 Felder (Name, Unternehmen, E-Mail, Telefon, Betreff, Nachricht, Datenschutz)
- [x] SMTP-Konfiguration in .env.example dokumentiert

### Erledigt — Phase 2D-B (Downloads, Measurements, News Frontend)
- [x] `/kataloge` laedt Katalog-Downloads aus DB (type=catalog, language=de/en)
- [x] `/kataloge/produktmasse` laedt Produktmasse aus DB (Measurement Modell)
- [x] `/neuigkeiten` laedt News-Artikel aus DB (nur PUBLISHED)
- [x] `/neuigkeiten/[slug]` laedt News-Detail aus DB mit SEO-Metadaten
- [x] CMS-Helper: `lib/cms/downloads.ts`, `lib/cms/measurements.ts`, `lib/cms/news.ts`
- [x] Fallback-Strategie: DB leer oder Fehler → statische Daten als Fallback
- [x] Statuslogik: isActive=false (Downloads/Measurements) bzw. DRAFT/ARCHIVED (News) → nicht oeffentlich
- [x] DRAFT/ARCHIVED News-Detailseiten liefern 404
- [x] Seed: 2 Katalog-Downloads, 12 Measurements, 4 News-Artikel
- [x] Service-Karten (Produktmasse, Pflege, Stoff-Daten) bleiben als statische Links erhalten
- [x] generateStaticParams fuer News aus DB
- [x] ISR mit revalidate=60 auf allen oeffentlichen Seiten

### Phase 2D-C — erledigt
- [x] CMS-Helper `service-pages.ts` — `getServicePageBySlug()` mit Discriminated-Union-Ergebnis (published/not-public/not-found/error)
- [x] `/kataloge/pflege-garantie` laedt Sektionen aus DB via ServiceSectionRenderer
- [x] `/kataloge/stoff-technische-daten` laedt Sektionen aus DB via ServiceSectionRenderer
- [x] 6 Section-Renderer-Komponenten: CareListSection, FabricCardsSection, ComparisonTableSection, HighlightCardsSection, CrossLinkSection, ServiceCtaSection
- [x] ServiceSectionRenderer dispatcht nach `settings.style` (care-list, fabric-cards, comparison-table, highlight-cards, cross-link, cta)
- [x] Statische Fallbacks: DB leer oder Fehler → bestehende statische Inhalte angezeigt
- [x] Statuslogik: DRAFT/ARCHIVED → notFound(), kein Fallback
- [x] Seed: 6 PageSections fuer pflege-garantie, 4 PageSections fuer stoff-technische-daten
- [x] Admin: Seitenstatus (PUBLISHED/DRAFT/ARCHIVED) steuert Sichtbarkeit beider Service-Seiten

### Phase 2E — erledigt
- [x] PageSections CRUD API (`/api/admin/page-sections`) mit Auth, Validierung, Rollenlogik
- [x] PageSectionsEditor Komponente — Sektionen anzeigen, anlegen, bearbeiten, sortieren, aktivieren/deaktivieren, loeschen, duplizieren
- [x] PageSectionEditForm — Style-spezifische Formulare fuer alle Section-Styles
- [x] Section-Style-Schemas (`lib/admin/page-section-schemas.ts`) — Labels, Defaults, Beschreibungen
- [x] Integration in `/admin/pages/[id]` — Sektionen unterhalb der Seitengrundaten
- [x] Pages-Liste zeigt Anzahl aktiver/gesamter Sektionen
- [x] Hinweis bei neuen Seiten: "Sections koennen nach dem ersten Speichern angelegt werden"
- [x] Up/Down-Sortierung via Order-Swap
- [x] Rollenlogik: VIEWER nur lesen, EDITOR erstellen/bearbeiten/sortieren, ADMIN zusaetzlich loeschen
- [x] JSON-Fallback-Editor fuer unbekannte Styles
- [x] Oeffentliche Renderer bleiben robust (null-Guards, leere Arrays → null)
- [x] Seed ueberschreibt bestehende Admin-gepflegte Sections nicht

#### Unterstuetzte Section-Styles

| Style | Label | Beschreibung | Verwendung |
|-------|-------|-------------|------------|
| care-list | Checkliste | Haekchen-Liste (Pflege, Garantie) | Pflege & Garantie |
| fabric-cards | Stoff-Karten | Materialkarten mit Datenzeilen | Stoff- & techn. Daten |
| comparison-table | Vergleichstabelle | Eigenschaftsvergleich | Stoff- & techn. Daten |
| highlight-cards | Highlight-Karten | Kompakte Karten im 2-Spalten-Grid | Stoff- & techn. Daten |
| cross-link | Querverweis | Verweis-Karte mit Button | Pflege & Garantie |
| cta | Call to Action | Dunkler CTA mit 2 Buttons | Beide Service-Seiten |
| text | Text | Einfacher Textbereich | Generisch |
| home-hero | Startseite Hero | Fullscreen Hero mit 2 CTAs und Subheadline | Startseite |
| value-props | Werte-Karten | Feature-Karten mit Icon, Titel, Text | Startseite |
| image-text-feature | Bild-Text Feature | Bild links + Bulletpoints rechts | Startseite |
| collection-showcase | Kollektions-Teaser | Zeigt publizierte Kollektionen als Grid | Startseite |
| sustainability-stats | Nachhaltigkeit | Dunkle Sektion mit Statistik-Karten | Startseite |
| downloads-teaser | Downloads-Teaser | Zeigt aktive Downloads als Karten | Startseite |
| news-teaser | News-Teaser | Zeigt 3 neueste News-Artikel | Startseite |
| collection-consultation-card | Beratungskarte (Kollektionen) | Service-Karte im Collection Grid mit Beratungsangebot | Kollektionen |
| collection-benefits | Kollektion Benefits | Performance-Vorteile (UV, Wasser, Schimmel, Garantie) | Kollektionen |
| collection-cta | Musterset-CTA (Kollektionen) | Dunkler Premium-CTA fuer Musterset-Anforderung | Kollektionen |

#### Seiten mit Sections

| Seite | Slug | Sections |
|-------|------|----------|
| Startseite | home | 7 (1× home-hero, 1× value-props, 1× image-text-feature, 1× collection-showcase, 1× sustainability-stats, 1× downloads-teaser, 1× news-teaser) |
| Pflege & Garantie | pflege-garantie | 6 (4× care-list, 1× cross-link, 1× cta) |
| Stoff- & techn. Daten | stoff-technische-daten | 4 (1× fabric-cards, 1× comparison-table, 1× highlight-cards, 1× cta) |
| Kollektionen | kollektionen | 3 (1× collection-consultation-card, 1× collection-benefits, 1× collection-cta) |

#### Seed vs. Admin

- **Seed** (`prisma/seed.ts`) ist Initialbefuellung — erstellt Basis-Sections nur wenn noch keine vorhanden
- **Admin** (`/admin/pages/[id]`) ist danach die fuehrende Pflegeoberflaeche
- Seed ueberschreibt nie manuell bearbeitete Sections
- Kein freier PageBuilder — nur kontrollierter feldbasierter Editor fuer feste Section-Styles

#### Produktions-Hinweis: Seed vs. Backfill

- **Homepage Sections** werden beim Seed nur initial angelegt, wenn fuer die Page `home` noch keine Sections existieren
- Der vollstaendige Seed (`npx prisma db seed`) erstellt Contact Form Fields neu (`deleteMany` + `createMany`). Auf Produktion mit bereits gepflegten Formulardaten sollte er daher **nicht** als einziges Mittel zum Backfill genutzt werden.
- Fuer Produktion gibt es gezielte Backfill-Scripts:
  - `npx tsx scripts/backfill-homepage-sections.ts` — 7 Homepage-Sections
  - `npx tsx scripts/backfill-collection-page-sections.ts` — 3 Kollektionen-Sections
  - Jedes Script legt nur die jeweilige Page an (falls sie fehlt) und erstellt fehlende Sections
  - Fasst keine anderen Daten an (keine Products, Collections, News, Downloads, Contact Form Fields, Users)
  - Idempotent: kann mehrfach ausgefuehrt werden

### Admin-Produktuebersicht Filter & Suche

Die Produktuebersicht (`/admin/products`) bietet erweiterte Filter-, Such- und Paginierungsfunktionen fuer die Verwaltung grosser Produktbestaende.

**Suche:** Freitext-Suche ueber Name, Slug, Artikelcode, Farbe, Muster, Kollektion, Produktgruppe und Material. Sofort filternd (Client-seitig).

**Filter:**

| Filter | Typ | Optionen |
|--------|-----|----------|
| Status | Buttons | Alle, Veroeffentlicht, Entwurf, Archiviert |
| Kollektion | Dropdown | Alle Kollektionen aus DB |
| Produktgruppe | Dropdown | Alle aktiven Produktgruppen aus DB |
| Material | Dropdown | Alle aktiven Materialien aus DB |
| Bildstatus | Dropdown | Alle, Mit Hauptbild, Ohne Hauptbild, Mit Galerie, Ohne Galerie |

**Sortierung:** Name A–Z, Name Z–A, Zuletzt geaendert, Neueste, Artikelnummer, Kollektion, Produktgruppe.

**Pagination:** 25 / 50 / 100 pro Seite (Standard: 50). Navigation ueber Seitenbuttons.

**URL-Parameter:** Filter werden in der URL gespeichert (`?q=...&collection=...&group=...&status=...&image=...&sort=...&page=...`). Filter bleiben beim Zuruecknavigieren erhalten.

**Tabellenspalten:** Thumbnail, Name/Slug, Code, Kollektion, Produktgruppe, Material, Status, Bildstatus (Hauptbild-Indikator + Galerieanzahl), Aktionen.

**Bildstatus-Anzeige:** Gruener Punkt = Hauptbild vorhanden, Roter Punkt = kein Hauptbild. Galerieanzahl als Zahl (z.B. „3 Gal.").

**Komponenten:**
- `app/admin/products/page.tsx` — Server-Seite, laedt Produkte + Filter-Optionen
- `components/admin/ProductAdminList.tsx` — Client-Komponente mit Filter, Suche, Pagination, Tabelle

**Hinweis:** Hauptbilder werden bei Filterung/Anzeige NICHT ueberschrieben. Bestehende Galerien bleiben erhalten. Upload-Limit bleibt 15 MB. Keine Migration erforderlich.

### Spaeter
11. **Rich-Text-Editor** — Fuer Seitentexte, Beschreibungen etc.
15. **Drag & Drop Sortierung** — Fuer Listen (Navigationsitems, Sektionen)
16. ~~**Medien-Browser**~~ — ✅ Erledigt (Phase 2F-A: MediaPicker, Phase 2F-B: MediaBrowser + DetailsPanel + Pagination + Filter + Ordner)
17. **Audit-Log** — Aenderungen nachverfolgen

## 12. Sicherheits-Status

### Erledigt
- Alle Admin-API-Routen durch `getSessionUser()` geschuetzt
- Users-API zusaetzlich durch ADMIN-Rollen-Check geschuetzt
- SVG-Upload blockiert (XSS-Risiko)
- Dateigroessen-Limit serverseitig validiert (5 MB)
- MIME-Type serverseitig validiert
- Magic-Byte-Validierung (prueft tatsaechlichen Datei-Header)
- Dateinamen sanitiert (keine Sonderzeichen, Zeitstempel)
- Passwoerter mit bcrypt (12 Runden) gehasht
- JWT in HTTP-only Cookie (nicht per JS lesbar)
- Admin-Seiten aus Suchmaschinen-Index ausgeschlossen

### Noch zu tun
- [ ] `ADMIN_JWT_SECRET` Fallback-Wert in Produktion entfernen
- [ ] CSRF-Schutz fuer POST-Endpunkte implementieren
- [ ] Rate-Limiting fuer Login-Endpunkt
- [ ] Input-Validierung mit Zod fuer alle POST-Endpunkte
- [ ] Content-Security-Policy Header setzen
- [ ] Hochgeladene Bilder ausserhalb von `public/` speichern (optional)
- [ ] Session-Invalidierung bei Passwort-Aenderung

## 13. Projektstruktur (Admin-relevant)

```
app/
  admin/
    layout.tsx              # Admin-Shell (Sidebar, Auth-Check)
    page.tsx                # Dashboard
    login/page.tsx          # Login-Seite
    pages/                  # Seiten-Verwaltung
    collections/            # Kollektionen-Verwaltung
    products/               # Produkte-Verwaltung
    product-groups/         # Produktgruppen-Verwaltung
    materials/              # Materialien-Verwaltung
    fabrics/                # Stoffbibliothek (Stoffe, Familien, Produktarten)
    media/                  # Medien-Verwaltung
    navigation/             # Navigations-Verwaltung
    footer/page.tsx         # Footer-Einstellungen
    forms/                  # Formulare + Einreichungen
    settings/page.tsx       # Website-Einstellungen
    users/                  # Benutzer-Verwaltung
  api/admin/                # Alle Admin-API-Routen
components/homepage/        # 7 Homepage-Section-Komponenten (CMS-gesteuert)
components/service/         # 7 Service-Section-Renderer (Phase 2D-C)
components/admin/           # 17 Client-Formular-Komponenten (inkl. PageSectionsEditor, PageSectionEditForm, FabricAdminList, FabricSwatchEditForm)
components/materials/       # Oeffentliche Stoffbibliothek-Komponenten (FabricLibrary, SwatchCard, MatrixView, DetailDrawer)
lib/
  auth/session.ts           # JWT + bcrypt Auth-Logik
  cms/                      # CMS-Helper (server-only, aktiv in Phase 2A)
    settings.ts             # getSiteSettings()
    navigation.ts           # getHeaderNavigation(), getFooterNavigation()
    footer.ts               # getFooterSettings()
    pages.ts                # getPublishedPages(), getPublishedPageBySlug()
    media.ts                # getMediaAssets(), getMediaAssetById()
    media-url.ts            # getMediaUrl() — URL-Aufloesung mit Fallback
    public-layout.ts        # getPublicLayoutData() — zentrale Layout-Daten
    page-hero.ts            # getPageHeroData() — Hero + SEO pro Seite
    collections.ts          # Kollektionen-Helper (Phase 2B)
    products.ts             # Produkte-Helper (Phase 2C)
    product-groups.ts       # Produktgruppen-Helper (Phase 2C)
    homepage.ts             # getHomepageData() (Startseite CMS-Sektionen)
    service-pages.ts        # getServicePageBySlug() (Phase 2D-C)
    forms.ts                # getFormBySlug() (noch nicht im Frontend)
    fabric-library.ts       # getFabricLibraryData(), getFabricFamilies() (Stoffbibliothek)
  db/prisma.ts              # Prisma Client Singleton
  generated/prisma/         # Generierter Prisma Client (gitignored)
prisma/
  schema.prisma             # Datenbank-Schema (21 Modelle)
  seed.ts                   # Seed-Daten
  migrations/               # SQLite Migrationen
  admin/
    delete-guards.ts          # Lösch-Guards (Referenz-Prüfungen)
    validation.ts             # Zod-Schemas
proxy.ts                    # Auth-Proxy (Next.js 16 Middleware)
public/uploads/             # Hochgeladene Medien
```

## 12. Löschen / Archivieren / Deaktivieren

### Strategie pro Datentyp

| Modell | Soft Delete | Deaktivieren | Hard Delete | Guard |
|--------|-------------|-------------|-------------|-------|
| Page | `status → ARCHIVED` | — | ADMIN only | Sections cascaden |
| Collection | `status → ARCHIVED` | — | ADMIN only | Blockiert wenn Produkte vorhanden |
| Product | `status → ARCHIVED` | — | ADMIN only | Images cascaden |
| NewsArticle | `status → ARCHIVED` | — | ADMIN only | — |
| ProductGroup | — | `isActive → false` | ADMIN only | Blockiert wenn Produkte vorhanden |
| Material | — | `isActive → false` | ADMIN only | Blockiert wenn Produkte zugeordnet |
| NavigationItem | — | — | ADMIN only | Kinder werden entkoppelt (parentId → null) |
| Download | — | `isActive → false` | ADMIN only | — |
| Measurement | — | `isActive → false` | ADMIN only | — |
| MediaAsset | — | — | ADMIN only | Blockiert wenn irgendwo referenziert + Datei wird gelöscht |
| FormSubmission | — | — | Alle auth. User | — |
| User | — | — | ADMIN only | Letzter Admin geschützt, Selbstlöschung verboten |

### Rollen-Berechtigungen

| Aktion | ADMIN | EDITOR | VIEWER |
|--------|-------|--------|--------|
| Archivieren / Wiederherstellen | Ja | Ja | Nein |
| Deaktivieren / Reaktivieren | Ja | Ja | Nein |
| Endgültig löschen (Hard Delete) | Ja | Nein | Nein |

### API-Endpunkte

Alle DELETE- und PATCH-Handler liegen unter `app/api/admin/`:

- **PATCH** `?id=<id>&action=status` — Status ändern (DRAFT / PUBLISHED / ARCHIVED)
- **PATCH** `?id=<id>&action=toggle` — isActive umschalten
- **DELETE** `?id=<id>` — Endgültig löschen (nur ADMIN)

### Guard-Utilities (`lib/admin/delete-guards.ts`)

- `getMediaAssetUsage(id)` — Prüft 17 Reverse-Relationen, gibt `{ model, count }[]` zurück
- `canDeleteUser(targetId, currentUserId)` — Letzter-Admin und Selbstlösch-Schutz
- `canDeleteCollection(id)` — Blockiert wenn Produkte vorhanden (Cascade-Schutz)
- `canDeleteProductGroup(id)` — Blockiert wenn Produkte vorhanden (Cascade-Schutz)
- `canDeleteMaterial(id)` — Blockiert wenn Produkte zugeordnet

### UI-Komponenten

- `ConfirmDialog` — Wiederverwendbarer Bestätigungsdialog (danger / warning)
- `DangerZone` — Gefahrenzone für Bearbeitungsseiten (Archivieren, Deaktivieren, Löschen)
- `ListActions` — Inline-Aktionsbuttons für Listenansichten

### FormField-Strategie

FormFields werden **inline** ueber den Kontaktformular-Editor verwaltet (nicht als eigene Admin-Seite):
- **Anlegen:** "Feld hinzufuegen"-Button im Editor
- **Bearbeiten:** Label, Name, Typ, Platzhalter, Hilfstext, Optionen (kommagetrennt fuer SELECT/RADIO), Pflichtfeld direkt im Formular
- **Entfernen:** "Entfernen"-Button pro Feld
- **Speicherverhalten:** Beim Speichern des Formulars werden alle Felder geloescht und neu erstellt (deleteMany + createMany). Dies ist bewusst so implementiert, da FormFields keine eigene Identitaet ausserhalb ihres Formulars haben.
- **Kein isActive-Toggle:** Da Felder nur im Kontext des Formulars existieren, gibt es kein separates Deaktivieren. Nicht benoetigte Felder werden entfernt.
- **Submissions bleiben erhalten:** Bestehende FormSubmissions speichern Daten als JSON und werden durch Feldaenderungen nicht beeinflusst.

### Admin-Sidebar

Die Admin-Sidebar (`AdminShell.tsx`) ist **hardcodierte Systemnavigation** und wird **nicht** aus der Datenbank verwaltet:
- Sidebar-Links koennen nicht ueber das CMS geloescht oder umbenannt werden
- Aenderungen erfordern Code-Aenderungen in `components/admin/AdminShell.tsx`
- Die oeffentliche Website-Navigation (Header, Footer, Service, Legal) ist hingegen **CMS-gesteuert** ueber `/admin/navigation`
- Dort koennen Links hinzugefuegt, bearbeitet, umsortiert und entfernt werden

### Oeffentliche Seiten

Alle CMS-Helpers filtern automatisch:
- `status: "PUBLISHED"` für Content-Modelle
- `isActive: true` für strukturelle Modelle

Archivierte und deaktivierte Einträge erscheinen niemals auf der öffentlichen Website.

### Produktmasse: Bemasste Bilder pflegen

Empfohlener Workflow fuer Measurement-Kacheln auf `/kataloge/produktmasse`:

1. Bemasstes Produktbild aus Katalog exportieren oder separat gestalten
2. In `/admin/media` hochladen
3. In `/admin/measurements` die passende Kachel oeffnen
4. Unter "Bemasstes Bild" das hochgeladene Bild auswaehlen
5. Alt-Text setzen (z.B. "Bemassungszeichnung Hochlehner 120 x 48 x 6 cm")
6. Masszeilen darunter pruefen/pflegen (Label + Wert pro Zeile)
7. Kachel aktivieren und Reihenfolge setzen

Ohne zugewiesenes Bild wird eine SVG-Fallback-Zeichnung angezeigt.
Die oeffentliche Seite zeigt nur aktive Measurements (isActive=true).

## 9. Breadcrumbs & Hero-Layout

### 9a. Breadcrumb-Komponenten

**Breadcrumbs** (`components/Breadcrumbs.tsx`) — Low-level nav-Komponente:
```ts
type BreadcrumbItem = { label: string; href?: string }
```

Merkmale:
- Semantisch korrekt: `<nav aria-label="Breadcrumb"><ol><li>...</li></ol></nav>`
- Automatisch "Startseite" als erstes Element
- Chevron-Separator (SVG)
- Variante `dark` (Standard, fuer helle Hintergruende)
- Text: 12px (`text-xs`), dezent, Premium-Look
- Kein eigenes Padding — Layout wird vom Eltern-Container gesteuert

**BreadcrumbBar** (`components/BreadcrumbBar.tsx`) — Slim-Bar-Wrapper:
- Weisser Hintergrund, Border-Bottom `border-black/[0.06]`
- Standard-Container: `max-w-[1400px] px-5 md:px-10`
- Vertikales Padding: `py-3.5` (~44-56px Gesamthoehe)
- Wird direkt unterhalb des Hero platziert (nicht innerhalb)

### 9b. Breadcrumb-Strategie pro Seitentyp

| Route | Breadcrumb-Trail | Platzierung |
|---|---|---|
| `/` (Startseite) | Keine | — |
| `/kollektionen` | Startseite > Kollektionen | BreadcrumbBar unter Hero |
| `/kollektionen/[slug]` | Startseite > Kollektionen > Name | BreadcrumbBar unter Hero |
| `/produkte/[slug]` | Startseite > Kollektionen > Collection > Name | Inline oberhalb Produktlayout |
| `/produktkategorien` | Startseite > Produktkategorien | BreadcrumbBar unter Hero |
| `/produktkategorien/[slug]` | Startseite > Produktkategorien > Name | Inline oberhalb Kategorielayout |
| `/materialien` | Startseite > Materialien | BreadcrumbBar unter Hero |
| `/ueber-uns` | Startseite > Ueber uns | BreadcrumbBar unter Hero |
| `/kataloge` | Startseite > Kataloge | BreadcrumbBar unter Hero |
| `/kataloge/produktmasse` | Startseite > Kataloge > Produktmasse | BreadcrumbBar unter Hero |
| `/kataloge/pflege-garantie` | Startseite > Kataloge > Pflege & Garantie | BreadcrumbBar unter Hero |
| `/kataloge/stoff-technische-daten` | Startseite > Kataloge > Stoff- & technische Daten | BreadcrumbBar unter Hero |
| `/neuigkeiten` | Startseite > Neuigkeiten | BreadcrumbBar unter Hero |
| `/neuigkeiten/[slug]` | Startseite > Neuigkeiten > Titel | BreadcrumbBar unter Hero |
| `/kontakt` | Startseite > Kontakt | BreadcrumbBar unter Hero |
| `/[slug]` (CMS-Seiten) | Startseite > Seitentitel | BreadcrumbBar unter Hero |

### 9c. Hero Max Height 210px fuer Unterseiten

Alle Unterseiten-Heroes haben eine feste Hoehe:
- `h-[300px]` (Mobile) / `h-[320px]` (Desktop)
- Sichtbare Hoehe unterhalb Header: ca. 210px
- Startseite (HeroSection): Volle Bildschirmhoehe (h-screen), davon ausgenommen

Compact Hero-Layout:
- Padding: `pt-24 md:pt-28 pb-6 md:pb-8`
- Content am unteren Rand (`flex items-end`)
- Eyebrow (optional), Titel, Beschreibung (line-clamp-2)
- Background-Image mit Overlay
- Breadcrumbs NICHT im Hero, sondern via BreadcrumbBar direkt darunter

Abstand BreadcrumbBar → Content:
- Seiten mit kontrollierter erster Section: `pt-12 md:pt-16` (48-64px)
- Seiten mit ServiceSectionRenderer: Standard `section-padding`

Typografie im Hero:
- Eyebrow: 11px, uppercase, tracking 0.3em, Pumpkin
- Titel: text-3xl / md:text-4xl / lg:text-[2.75rem], bold
- Beschreibung: text-sm / md:text-[0.9375rem], line-clamp-2, max-w-2xl

### 9d. Seiten ohne Hero-Banner

Kategoriedetailseiten (`/produktkategorien/[slug]`) haben keinen Hero-Banner. Stattdessen:
- Breadcrumbs (Inline) mit Header-Clearance-Padding (`pt-28 md:pt-32`)
- Direkt im Content-Bereich (Cream-Hintergrund)

Produktdetailseiten (`/produkte/[slug]`) nutzen einen integrierten **Product Stage Hero** (siehe 9f).

### 9e. PageHero-Komponente

Datei: `components/sections/PageHero.tsx`

Props:
| Prop | Typ | Standard | Beschreibung |
|---|---|---|---|
| title | string | (pflicht) | Seitentitel |
| eyebrow | string? | — | Kleine Ueberschrift ueber Titel |
| description | string? | — | Kurzbeschreibung (line-clamp-2) |
| image | string? | Fallback-SVG | Hero-Hintergrundbild |
| alt | string? | "MOSAROMA Hero" | Bild Alt-Text |
| variant | "light" / "dark" | "dark" | Overlay-Variante |
| height | "compact" / "default" / "large" | — | Legacy-Prop (alle Varianten identisch) |

### 9f. Product Hero & Produktbild-Normalisierung

**Produktdetailseiten** (`/produkte/[slug]`) nutzen einen zweiteiligen Product Hero:

1. **Dunkle Product-Hero-Kopfflaeche** (Anthrazit, mit dezenter Collection-Farbe im Verlauf)
   - Sorgt fuer Lesbarkeit von weißem Logo und Navigation
   - Enthaelt: Breadcrumb (light variant), Collection Badge mit Farbswatches, H1 (Produktname), Produktgruppe
   - Kompakt — kein leerer dekorativer Bereich
   - Orientiert sich visuell an Unterseiten-Heros, ist aber produktbezogen

2. **Product Stage** (helle Flaeche #FAF8F5)
   - Links: Produktgalerie (Hauptbild + Thumbnails)
   - Rechts: Beschreibung, Specs, Features, CTAs
   - Grid: `lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]` — Galerie etwas schmaler als Info
   - Hauptbild bewusst kontrolliert (max-w-580px auf Mobil, reduziertes Padding)

**H1-Struktur:** Eine einzige H1 im dunklen Hero-Kopf. In der Product Stage kein zweiter Produktname.

**Zentrale Bildkomponente: `components/products/ProductImageFrame.tsx`**

Alle oeffentlichen Produktbilder laufen ueber diese zentrale Komponente. Sie stellt sicher:

- `object-fit: contain` — Produktbilder werden nie gecroppt
- Einheitlicher Hintergrund (#FAF8F5) fuer alle Varianten
- Sauberes Padding innerhalb des Rahmens
- Hochwertige Placeholder bei fehlenden Bildern (Collection-Farbverlauf + Faserstruktur)
- Unterschiedliche Upload-Groessen wirken im Layout einheitlich
- Collection-Farb-Fallbacks per `collectionSlug` wenn keine expliziten `collectionColors` uebergeben werden

| Variante | Aspect Ratio | Verwendung | Padding |
|----------|-------------|------------|---------|
| `detail` | 1:1 | Produktdetail-Hauptbild | 20-40px responsiv |
| `thumbnail` | 1:1 | Galerie-Thumbnails | 8-10px |
| `card` | 4:5 | Produktkarten (alle Seiten) | 20-24px |
| `related` | 4:5 | Related Products | 16-20px |
| `compact` | 1:1 | Kleine Teaser | 12px |

**Placeholder-Farblogik:**
- Wenn `collectionColors` uebergeben werden: diese werden verwendet
- Wenn nur `collectionSlug` verfuegbar: Fallback aus `COLLECTION_COLOR_FALLBACKS` (alle 7 Kollektionen)
- Wenn weder noch: neutraler Grau-Verlauf (kein Braun/Golden mehr)
- Blue-Produkte → blaue Placeholder, Green → gruene, Red → rote, etc.

**Betroffene Komponenten:**

| Komponente | Datei | Aenderung |
|---|---|---|
| ProductImageFrame | `components/products/ProductImageFrame.tsx` | Zentrale Bildlogik mit Collection-Farb-Fallbacks |
| ProductImageGallery | `components/products/ProductImageGallery.tsx` | Nutzt ProductImageFrame |
| ProductCard | `components/ProductCard.tsx` | Nutzt ProductImageFrame mit collectionSlug |
| CollectionProductCard | `components/CollectionProductCard.tsx` | Nutzt ProductImageFrame mit collectionSlug |

**Nicht veraendert (keine Produktbilder):**
- CollectionCard (Collection-Bilder, object-cover bleibt)
- CategoryCard (Kategorie-Bilder, background-cover bleibt)
- HomepageCollections (Collection-Bilder, object-cover bleibt)
- Admin-Komponenten (MediaBrowser, MediaPicker)

**Hinweis:**
- Diese Phase aendert nur die Darstellung (Frontend-Rendering)
- Bestehende Bilddateien bleiben unveraendert
- Upload-Canvas-Normalisierung verfuegbar via `scripts/normalize-product-images.ts`
- Keine Migration noetig
- Galerie-Thumbnails erscheinen wenn ein Produkt mehrere Bilder hat (ueber ProductImage-Tabelle)

**Premium Product Info Panel:**

Die Produktinformationen rechts in der Product Stage werden als weißes Panel mit dezenter Border dargestellt:
- Collection-Kontext (Farbswatches + Eyebrow)
- Produktgruppe als Link
- Beschreibung (15px, anthracite/80, max-w-lg)
- Spec Cards (2-Spalten Grid, Cream-Hintergrund, Label oben klein, Wert darunter groesser)
- Feature Chips (dezent, Cream-Hintergrund, dunkle Border)
- CTA-Bereich mit Trennlinie (Primary + Secondary nebeneinander, volle Breite)
- Serviceline: "Muster & Beratung auf Anfrage"
- Fehlende Werte werden automatisch ausgeblendet, keine leeren Felder
- Alle Daten aus bestehenden Product-Feldern, keine neuen CMS-Felder

**Responsive Layout:**

Desktop: Dunkler Hero-Kopf → 2-Spalten Product Stage (Galerie 0.9fr | Info Panel 1fr) → Material → Collection → Related → CTA

Mobile: Dunkler Hero-Kopf (Breadcrumb, Badge, Name, Gruppe) → Hauptbild → Thumbnails → Info Panel (Beschreibung → Spec Cards → Features → CTAs) → Material → Collection → Related → CTA

## 14. Kollektionen-Uebersichtsseite (`/kollektionen`)

### Ueberblick

Die oeffentliche Seite `/kollektionen` zeigt alle veroeffentlichten Kollektionen als gleichwertige Cards in einem Grid. Keine Kollektion wird groesser oder prominenter dargestellt als eine andere — Unterschiede entstehen nur durch Farbe, Name, Text, Mood-Bild und Farbpunkte.

### Inhalte aus der Datenbank

| Inhalt | Quelle | Admin-Pflege |
|--------|--------|-------------|
| Hero-Eyebrow | `Page.eyebrow` (Seite "kollektionen") | Seiten → kollektionen → Eyebrow |
| Hero-Titel | `Page.headline` | Seiten → kollektionen → Headline |
| Hero-Beschreibung | `Page.introText` | Seiten → kollektionen → Einleitungstext |
| Hero-Bild | `Page.heroImage` (MediaAsset) | Seiten → kollektionen → Hero-Bild |
| Collection Name | `Collection.name` | Kollektionen → Name |
| Collection Beschreibung | `Collection.shortDescription` | Kollektionen → Kurzbeschreibung |
| Collection Stoff | `Collection.fabric` | Kollektionen → Stoff |
| Collection Farbpunkte | `Collection.moodColors` (JSON) | Kollektionen → Stimmungsfarben |
| Collection Card-Bild | `Collection.cardImage` (MediaAsset) | Kollektionen → Bilder → Card-Bild |
| SEO Titel/Beschreibung | `Page.seoTitle/Description` | Seiten → kollektionen → SEO |
| Beratungskarte (Titel, Text, Buttons) | `PageSection` (style: collection-consultation-card) | Seiten → kollektionen → Sektionen |
| Benefits (Titel, 4 Items) | `PageSection` (style: collection-benefits) | Seiten → kollektionen → Sektionen |
| Musterset-CTA (Eyebrow, Titel, Text, Buttons) | `PageSection` (style: collection-cta) | Seiten → kollektionen → Sektionen |

### Collection Card Bilder pflegen

1. Bild in `/admin/media` hochladen (empfohlen: mind. 800×1000px, 3:4 Hochformat)
2. In `/admin/collections/[id]` die Kollektion oeffnen
3. Unter "Bilder" → "Card-Bild" das hochgeladene Bild auswaehlen
4. Bild wird auf der Card mit einheitlichem Overlay und Titel angezeigt
5. Echte Bilder erhalten dasselbe Gradient-Overlay wie Placeholder — keine Kollektion wirkt visuell dominanter

### Placeholder-System

Wenn eine Kollektion kein Card-Bild im CMS hat, wird ein CSS-Mood-Cover angezeigt:
- 3-Stufen-Gradient (from/via/to) in der jeweiligen Kollektion-Farbwelt
- Dezente Webstruktur (horizontale + vertikale Faserlinien) und diagonaler Lichteffekt
- Sieht wie bewusstes Mood-Cover aus, nicht wie "Bild fehlt"
- 7 vordefinierte Farbpaletten (green, blue, red, golden, earth-grey, nerio-oceana, basic)
- Neutraler Premium-Fallback fuer unbekannte Slugs
- Card-Aspect-Ratio: 3:4 (Hochformat) fuer wertigere Wirkung

### Farbbalken (Color Mood Bar)

Im Content-Bereich oberhalb des Collection-Grids wird ein Farbbalken aus allen Kollektion-Stimmungsfarben angezeigt. Dieser entsteht automatisch aus den `moodColors` aller veroeffentlichten Kollektionen. Der Balken ist auf die Content-Breite begrenzt (max-width 1440px).

### Hero-Copy Safe-Update Script

Optional fuer Produktion: `npx tsx scripts/update-kollektionen-hero-defaults.ts`
- Aendert Headline nur wenn exakt "Unsere Kollektionen" → "Sieben Farbwelten."
- Aendert Eyebrow nur wenn exakt "Saison 2027" → "Saison 2027 · Outdoor Living"
- Ueberschreibt keine manuell gepflegten Inhalte
- Idempotent, mehrfach ausfuehrbar

### CMS-editierbare Sektionen

Alle redaktionellen Inhalte der Seite sind ueber PageSections im CMS bearbeitbar. Die Seite verwendet 3 dedizierte Section-Styles:

| Section-Style | Label | Was wird bearbeitet | Admin-Felder |
|--------------|-------|---------------------|-------------|
| `collection-consultation-card` | Beratungskarte | Service-Karte im Grid | Titel, Inhalt, Primaer-Button (Label + Href), Sekundaer-Link (Label + Href) |
| `collection-benefits` | Kollektion Benefits | 4 Performance-Vorteile | Titel, Inhalt, Items (je Icon + Titel + Text) |
| `collection-cta` | Musterset-CTA | Dunkler CTA am Seitenende | Eyebrow, Titel, Inhalt, Primaer-Button (Label + Href), Sekundaer-Link (Label + Href) |

#### Admin-Pflege

1. Seiten → `kollektionen` → Sektionen
2. Beratungskarte: Titel "Welche Farbwelt passt zu Ihnen?", Inhalt, CTA-Buttons
3. Benefits: Titel, 4 Items mit Icon-Auswahl (Sonne/Tropfen/Schild/Stern), Titel und Beschreibung
4. Musterset-CTA: Eyebrow, Titel, Inhalt, Button-Labels und Ziel-URLs

#### Fallback-Verhalten

Wenn eine Section im CMS fehlt, wird der hartcodierte Fallback aus `app/kollektionen/page.tsx` verwendet. Alle Fallback-Texte entsprechen den Seed-Daten.

#### Backfill

Fuer Produktion: `npx tsx scripts/backfill-collection-page-sections.ts`
- Erstellt nur die 3 fehlenden Sections (prueft jede einzeln per Style)
- Fasst keine Collections, Products oder andere Daten an
- Idempotent: mehrfach ausfuehrbar ohne Duplikate

### Beratungskarte

Am Ende des Collection-Grids erscheint eine CMS-editierbare Service-Karte "Welche Farbwelt passt zu Ihnen?" mit Links zu `/kontakt`. Diese Karte hat ein anderes Design als die Collection Cards (Cream-Hintergrund, kein Bild, kein Farbbalken).

### Designregeln

- **Hero-Hoehe ist fest** (300px/320px) und darf nicht veraendert werden
- **Alle Kollektionen gleichwertig**: gleiche Card-Groesse, gleiches Layout, gleiche Gewichtung
- **Keine Featured Collection**: keine groessere, prominentere oder hervorgehobene Kollektion
- **Responsive Grid**: 4 Spalten Desktop, 2 Spalten Tablet, 1 Spalte Mobile

### Revalidation

| Aenderung im Admin | Revalidiert |
|---------------------|------------|
| Kollektion speichern | `/`, `/kollektionen`, `/kollektionen/[slug]` |
| Seite "kollektionen" speichern | `/kollektionen` |
| PageSection fuer "kollektionen" speichern | `/kollektionen` |

## 15. Stoffbibliothek (Fabric Library)

### Ueberblick

Die Stoffbibliothek auf `/materialien` ersetzt den früheren statischen „Stoffe & Muster"-Bereich durch eine interaktive, CMS-gesteuerte Premium-Stoffbibliothek. Sie bildet die Katalog-Doppelseiten (Mackintosh® Lite, Mackintosh®, NERIO/Oceana, Basic) webseitentauglich ab: Stoffname, Artikelnummer, Stofffamilie, Stoffbild und verfuegbare Produktarten.

### Datenmodell

4 neue Prisma-Modelle (Migration `20260614160440_add_fabric_library`):

| Modell | Beschreibung | Schluesselfelder |
|--------|-------------|-----------------|
| `FabricFamily` | Stofffamilien (Tabs) | slug (unique), name, description, eyebrow, order, isActive |
| `FabricSwatch` | Einzelne Stoffmuster | slug (unique), familyId → FabricFamily, name, articleNumber, swatchImageId → MediaAsset, colorHex, patternType, subtitle, description, order, isActive |
| `FabricProductType` | Produktarten fuer Matrix | slug (unique), name, iconKey, order, isActive |
| `FabricAvailability` | Zuordnung Stoff ↔ Produktart | swatchId + productTypeId (@@unique), note, isAvailable |

**Relationen:**
- FabricSwatch.familyId → FabricFamily (onDelete: Cascade)
- FabricSwatch.swatchImageId → MediaAsset (onDelete: SetNull)
- FabricAvailability.swatchId → FabricSwatch (onDelete: Cascade)
- FabricAvailability.productTypeId → FabricProductType (onDelete: Cascade)

### Admin-Pflege

#### Routen

| Route | Funktion |
|-------|----------|
| `/admin/fabrics` | Stoffbibliothek mit 3 Tabs (Stoffe, Familien, Produktarten) |
| `/admin/fabrics/[id]` | Stoff bearbeiten/erstellen (inkl. Verfuegbarkeiten) |

#### Tab: Stoffe

- Tabelle mit Name, Artikelnummer, Familie, Aktiv-Status, Aktionen
- Suche nach Name/Artikelnummer
- Filter nach Familie
- Link zu Detailseite (`/admin/fabrics/[id]`)
- Toggle aktiv/inaktiv (EDITOR+)
- Loeschen (ADMIN only)

#### Tab: Familien

- Inline-CRUD (kein eigener Router)
- Name, Slug (auto-generiert), Beschreibung, Eyebrow, Reihenfolge
- Erstellen, Bearbeiten, Loeschen direkt in der Liste

#### Tab: Produktarten

- Inline-CRUD (kein eigener Router)
- Name, Slug (auto-generiert), IconKey, Reihenfolge
- Erstellen, Bearbeiten, Loeschen direkt in der Liste

#### Stoff-Detailformular (`/admin/fabrics/[id]`)

| Feld | Typ | Pflicht |
|------|-----|---------|
| Name | Text | Ja |
| Slug | Text (auto) | Nein (wird generiert) |
| Familie | Dropdown | Ja |
| Artikelnummer | Text | Nein |
| Mustertyp | Text (z.B. Dobby, Jacquard, Uni) | Nein |
| Farbe (Hex) | Farbpicker + Textfeld | Nein |
| Untertitel | Text | Nein |
| Beschreibung | Textarea | Nein |
| Reihenfolge | Zahl | Nein (Default: 0) |
| Aktiv | Checkbox | Nein (Default: true) |
| Stoffbild | MediaPickerField | Nein |
| Verfuegbare Produktarten | Checkbox-Liste mit optionalem Hinweisfeld | Nein |

**Verfuegbarkeiten:** Pro Produktart eine Checkbox. Bei aktivierter Checkbox erscheint ein optionales Hinweisfeld (z.B. „mit Keder", „ohne Keder", „auf Anfrage").

### API

| Methode | Route | Funktion |
|---------|-------|----------|
| GET | `/api/admin/fabrics?entity=swatches` | Alle Stoffe laden (mit Familie, Bild, Verfuegbarkeiten) |
| GET | `/api/admin/fabrics?entity=families` | Alle Familien laden |
| GET | `/api/admin/fabrics?entity=product-types` | Alle Produktarten laden |
| GET | `/api/admin/fabrics?id=<id>` | Einzelnen Stoff laden |
| POST | `/api/admin/fabrics` (entity: swatch) | Stoff erstellen/aktualisieren (inkl. Verfuegbarkeiten) |
| POST | `/api/admin/fabrics` (entity: family) | Familie erstellen/aktualisieren |
| POST | `/api/admin/fabrics` (entity: product-type) | Produktart erstellen/aktualisieren |
| PATCH | `/api/admin/fabrics?entity=...&id=...` | Aktiv-Status umschalten |
| DELETE | `/api/admin/fabrics?entity=...&id=...` | Loeschen (ADMIN only) |

**Slug-Handling:** Slugs werden automatisch aus dem Namen generiert (Sanitizing: lowercase, Umlaute, Sonderzeichen). Bei Duplikaten wird 409 zurueckgegeben.

**Verfuegbarkeiten-Speicherung:** Beim Speichern eines Swatches werden bestehende Verfuegbarkeiten geloescht und neu erstellt (delete + recreate Pattern, analog zu FormFields).

### Public Darstellung

#### Datenloader (`lib/cms/fabric-library.ts`)

- `getFabricLibraryData()` — Laedt alle aktiven Familien, Stoffe (mit Familie, Bild, Verfuegbarkeiten) und Produktarten
- `getFabricFamilies()` — Laedt nur aktive Familien
- Nur aktive Daten (`isActive: true`, `isAvailable: true`)
- Sortiert nach `order`
- Swatch-Bilder via `getMediaUrl()`

#### Komponenten

| Komponente | Datei | Funktion |
|------------|-------|----------|
| `FabricLibrary` | `components/materials/FabricLibrary.tsx` | Hauptorchestrator: Tabs, Suche, Filter, Ansichtsumschaltung |
| `FabricSwatchCard` | `components/materials/FabricSwatchCard.tsx` | Stoffkarte in Kachelansicht |
| `FabricMatrixView` | `components/materials/FabricMatrixView.tsx` | Matrixansicht (Tabelle Desktop, Cards Mobile) |
| `FabricDetailDrawer` | `components/materials/FabricDetailDrawer.tsx` | Detail-Drawer (Slide-in von rechts) |

#### Kachelansicht (Standard)

- Quadratisches Stoffbild (oder colorHex-Fallback, oder Gradient-Placeholder)
- Familienname, Stoffname, Artikelnummer
- Verfuegbare Produktarten als Chips (max. 5 sichtbar, +N fuer Ueberlauf)
- „Details"-CTA mit Pfeil
- Responsive: 3-4 Spalten Desktop, 2 Tablet, 1 Mobile

#### Matrixansicht (B2B/Planung)

- **Desktop:** Tabelle mit Stoff-Info (Bild, Name, Artikelnummer) + Produktart-Spalten, Haekchen fuer Verfuegbarkeit, Hinweise als Tooltip
- **Mobile:** Karten-Liste mit Stoff-Info und Produktart-Chips (keine kaputte breite Tabelle)
- Zeilen klickbar → oeffnet Detail-Drawer

#### Tabs

- „Alle" + eine Tab pro aktive Familie
- Filtert Stoffe nach Familie
- Kombinierbar mit Suche und Produktfilter

#### Suche

- Sofort filternd (Client-Side)
- Durchsucht: Name, Artikelnummer, Familienname, Mustertyp

#### Produktfilter

- Dropdown mit allen aktiven Produktarten
- Filtert Stoffe, die fuer die gewaehlte Produktart verfuegbar sind
- Kombinierbar mit Tab-Auswahl und Suche

#### Ergebnisanzeige

- Anzahl angezeigter Stoffe (z.B. „24 Stoffe")
- Button „Filter zuruecksetzen" wenn Filter aktiv

#### Detail-Drawer

- Slide-in von rechts (volle Hoehe, max-w-lg)
- Grosses Stoffbild, Familienname, Stoffname, Artikelnummer
- Mustertyp, Untertitel, Beschreibung
- Verfuegbare Produktarten mit Hinweisen
- CTAs: „Muster anfragen" (→ /kontakt), „Katalog ansehen" (→ /kataloge)
- Schliesst via Escape-Taste, Backdrop-Klick oder X-Button
- Body-Scroll-Lock waehrend geoeffnet
- Animation: `slide-in-right` mit `prefers-reduced-motion` Fallback (Crossfade)

### Integration in `/materialien`

Der bisherige „Stoffe & Muster"-Bereich (statische Musterkarten aus `fabricPatternGroups`) wurde ersetzt durch die neue FabricLibrary-Komponente. Alle anderen Bereiche der Materialseite bleiben unveraendert:

- Mackintosh Technology
- Warum Olefin?
- OceanCycle Kreislauf
- Technische Daten
- CTA/Footer

Neue Section:
- Eyebrow: „Stoffe & Muster"
- Headline: „Alle Stoffe nach Materialfamilie und Produktart"
- Darunter: FabricLibrary-Komponente mit allen Daten

### Import-Script

**Datei:** `scripts/import-fabric-library.ts`

Akzeptiert JSON aus `data/import/fabric-library.json` (konfigurierbar via `--file`).

```bash
npx tsx scripts/import-fabric-library.ts                    # Dry-Run (zeigt was passieren wuerde)
npx tsx scripts/import-fabric-library.ts --apply            # Import durchfuehren
npx tsx scripts/import-fabric-library.ts --apply --file data/import/meine-daten.json
```

**Verhalten:**
- Upsert nach Slug (idempotent — mehrfach ausfuehrbar)
- Legt ProductTypes, Families, Swatches, Availabilities an
- Familien-Zuordnung via `familySlug`
- Produktart-Zuordnung via `productTypeSlug`
- Ueberschreibt keine manuell gesetzten Bilder (swatchImageId wird nicht angefasst)
- Verfuegbarkeiten werden pro Swatch geloescht und neu erstellt
- Summary mit created/updated/skipped/errors Zaehler

**Beispiel-JSON:** `data/import/fabric-library.example.json`
- 4 Produktarten (Deko-Kissen, Hochlehner, Niedriglehner, Sitzkissen)
- 2 Familien (Mackintosh® Lite, Basic)
- 3 Stoffe (Rocky Mountain Olive, St. Tropez Citron, Boletus Brown)

### Revalidation

| Aenderung im Admin | Revalidiert |
|---------------------|------------|
| Stoff speichern/loeschen | `/materialien` |
| Familie speichern/loeschen | `/materialien` |
| Produktart speichern/loeschen | `/materialien` |
| Aktiv-Status umschalten | `/materialien` |

Revalidation erfolgt via `revalidateMaterials()` → `safeRevalidate("/materialien")`.

Import-Script loest keine Revalidation aus. Nach Import auf Produktion: Seite wird beim naechsten Request nach Ablauf von `revalidate=60` automatisch neu gerendert, oder manuell im Admin eine beliebige Aenderung speichern.

### Produktionshinweise

- **Kein Full Seed** fuer Stoffbibliothek auf Produktion
- **Gezielter Import** ueber `scripts/import-fabric-library.ts`
- **Upload-Limit bleibt 15 MB** — keine Aenderung
- **Swatch-Bilder:** Ueber `/admin/fabrics/[id]` → MediaPicker hochladen und zuweisen
- **Keine bestehenden MediaAssets veraendert**
- **Keine bestehenden Produktdaten beschaedigt**
- **Rollback:** Migration `20260614160440_add_fabric_library` ist rein additiv (4 neue Tabellen). Rollback durch Entfernen der Modelle aus schema.prisma und `prisma migrate resolve`

### Dateien

| Datei | Beschreibung |
|-------|-------------|
| `prisma/schema.prisma` | 4 neue Modelle (FabricFamily, FabricSwatch, FabricProductType, FabricAvailability) |
| `prisma/migrations/20260614160440_add_fabric_library/` | Additive Migration |
| `app/api/admin/fabrics/route.ts` | Full CRUD API |
| `app/admin/fabrics/page.tsx` | Admin-Listenseite (3 Tabs) |
| `app/admin/fabrics/[id]/page.tsx` | Admin-Detailseite (Stoff bearbeiten) |
| `components/admin/FabricAdminList.tsx` | Admin-Liste Client-Komponente |
| `components/admin/FabricSwatchEditForm.tsx` | Admin-Formular Client-Komponente |
| `lib/cms/fabric-library.ts` | Public Datenloader (server-only) |
| `components/materials/FabricLibrary.tsx` | Public Hauptkomponente |
| `components/materials/FabricSwatchCard.tsx` | Stoffkarte (Kachelansicht) |
| `components/materials/FabricMatrixView.tsx` | Matrixansicht |
| `components/materials/FabricDetailDrawer.tsx` | Detail-Drawer |
| `scripts/import-fabric-library.ts` | JSON-Import-Script |
| `data/import/fabric-library.example.json` | Beispiel-Importdaten |

## 16. Materialsystem — Seitenstruktur

Stand: 2026-06-15

### Uebersicht

Die Materialseite wurde in ein Premium-Materialsystem mit Hub und Unterseiten aufgeteilt:

| Route | Funktion | Typ |
|-------|----------|-----|
| `/materialien` | Material-Hub / Uebersichtsseite | Hub mit Teasern |
| `/materialien/stoffe-muster` | Vollstaendige Stoffbibliothek | Unterseite |
| `/materialien/technische-daten` | Technische Datentabelle / Materialvergleich | Unterseite |

Keine Migration erforderlich. Alle neuen Routen nutzen bestehende Page/PageSection-Modelle.

### /materialien (Hub)

Die Hub-Seite zeigt:

1. **PageHero** — aus CMS (Page slug `materialien`)
2. **Anchor-Navigation** — kompakte Seitennavigation nach dem Hero
3. **Mackintosh® Technology** — Technologie-Teaser (CMS via Helper-Section `materials-technology`, Fallback `materials.ts`)
4. **Warum Olefin?** — Argumentationsbereich (CMS via Helper-Section `materials-olefin`, Fallback `materials.ts`)
5. **Stofffamilien** — 4 Cards (Mackintosh, Lite, Nerio, Basic), verlinkt auf `/materialien/stoffe-muster`
6. **OceanCycle** — Nachhaltigkeits-Teaser (CMS via Helper-Section `materials-oceancycle`, Fallback `materials.ts`)
7. **Stoffe & Muster Preview** — 6 Stoffkarten (datengetrieben aus FabricSwatch), CTA auf `/materialien/stoffe-muster`
8. **Katalog CTA** — Verweis auf `/kataloge`

**Wichtig:** Die vollstaendige FabricLibrary wird NICHT mehr auf der Hub-Seite angezeigt. Nur eine Preview mit 6 Stoffkarten.

### /materialien/stoffe-muster

Zeigt die vollstaendige interaktive Stoffbibliothek mit Katalogstruktur:

**Sticky Kontrollbereich** (haftet am oberen Rand beim Scrollen):

- **Stofffamilien-Tabs:** Alle, Mackintosh® Lite, Mackintosh®, Mackintosh® Nerio, Basic
- **Suche** nach Name, Artikelnummer, Familie, Mustertyp
- **Produktart-Filter** per Dropdown (alle 8 Produktarten inkl. Sitzpolster, Bankauflagen, Poufs, Tischsets)
- **Ansicht-Umschalter:** Kachelansicht / Matrixansicht

**Galerieansicht (Grid):**
- 4-Spalten-Grid (responsive: 1 → 2 → 3 → 4 Spalten)
- Maximal 24 Stoffe initial sichtbar
- „Mehr anzeigen"-Button laedt weitere 24 Stoffe nach
- Keine endlose Scrollwand

**Produktmatrix:**
- Tabellenansicht mit sticky erster Spalte (Stoffname + Thumbnail)
- Produktarten als Spaltenkoepfe
- Verfuegbarkeit mit Haekchen + optionalem Keder-Hinweis
- Horizontales Scrollen bei vielen Produktarten
- Mobile: Karten-Layout statt Tabelle

**Familien-Kontext:**
- Bei Auswahl einer Familie: Beschreibungstext unter den Tabs
- NERIO-Tab zeigt zusaetzlich „Mehr zur NERIO Materialstory" → `/nerio`

**Detail-Drawer** (unveraendert):
- Oeffnet beim Klick auf eine Stoffkarte/Matrixzeile
- Slide-in Animation von rechts (300ms ease-out)
- Backdrop-Close + Escape-Taste
- Body-Scroll wird blockiert
- Zeigt: Stoffbild, Name, Artikelnummer, Familie, Mustertyp, verfuegbare Produktarten, CTAs

**Produktarten (8 Stueck, sortiert nach order):**

| Name | Slug | Katalog-Referenz |
|------|------|-----------------|
| Deko-Kissen | deko-kissen | Alle Familien |
| Hochlehner | hochlehner | M&L, NERIO, Basic |
| Niedriglehner | niedriglehner | M&L, NERIO, Basic |
| Sitzkissen | sitzkissen | M&L, NERIO, Basic |
| Sitzpolster | sitzpolster | M&L (ohne Keder) |
| Bankauflagen | bankauflagen | M&L, NERIO |
| Poufs | poufs | M&L |
| Tischsets & Tischlaeufer | tischsets-tischlaeufer | M&L |

**Katalogdaten-Import (Phase 2 — erledigt):**

Alle 66 Stoffe aus dem PDF „Stoffe & Muster" wurden importiert:

| Familie | Stoffe | Besonderheit |
|---------|--------|-------------|
| Mackintosh® | 36 | 6 aus M&L-Matrixseite (volle Produktpalette) + 30 nur Deko-Kissen ohne Keder |
| Mackintosh® Lite | 6 | Alle aus M&L-Matrixseite, breite Verfuegbarkeit |
| Mackintosh® Nerio | 8 | 6 mit voller Palette + 2 Streifen nur Deko-Kissen |
| Basic | 16 | 4 Uni-Stoffe mit breiter Palette + 12 nur Deko-Kissen |

**Import-Script:**

```bash
npx tsx scripts/import-fabric-catalog-overview.ts              # Dry-Run
npx tsx scripts/import-fabric-catalog-overview.ts --apply       # Import ausfuehren
npx tsx scripts/import-fabric-catalog-overview.ts --file <pfad> # Alternative Datei
```

- Idempotent: sicher mehrfach ausfuehrbar
- Erstellt nur fehlende Swatches/Availabilities
- Ueberschreibt keine bestehenden Daten (Bilder, Texte, Artikelnummern)
- `colorHex: "TODO"` wird als `null` gespeichert (sauberer Platzhalter)
- Importvorlage: `data/import/fabric-catalog-overview.example.json`

**Keder-Hinweise:** Werden als `note`-Feld in `FabricAvailability` gespeichert. Bei Stoffen die sowohl mit als auch ohne Keder verfuegbar sind (z.B. Boletus Brown Deko-Kissen): `"mit & ohne Keder"`.

**Fehlende Swatch-Bilder:** 66 Stoffe ohne Bilder. Im Frontend wird ein Farbplatzhalter (colorHex) oder ein neutraler Gradient angezeigt. Bilder koennen ueber `/admin/fabrics` → Stoff bearbeiten → MediaPicker nachgepflegt werden.

**41 Stoffe mit fehlendem colorHex:** Vorwiegend Mackintosh® Deko-Kissen-Muster und einige Basic-Muster. Zeigen neutralen Gradient-Platzhalter bis manuell gepflegt.

**Backfill-Script fuer Produktarten:**

```bash
npx tsx scripts/backfill-fabric-product-types.ts          # Dry-Run
npx tsx scripts/backfill-fabric-product-types.ts --apply   # Produktarten anlegen
```

**Rocky Mountain Family Fix:**

Rocky Mountain Olive war vor dem Katalogimport der Familie `mackintosh-lite` zugeordnet. Laut PDF gehoert die gesamte Rocky-Mountain-Serie zu `mackintosh`. Fix-Script:

```bash
npx tsx scripts/fix-rocky-mountain-family.ts          # Dry-Run
npx tsx scripts/fix-rocky-mountain-family.ts --apply   # Fix ausfuehren
```

Idempotent, matcht ueber Artikelnummer, aendert nur `familyId`. Keine Bilder, Texte oder Verfuegbarkeiten betroffen.

**Phase 3 TODOs (Admin-Pflege):**
- Swatch-Bilder fuer alle 66 Stoffe hochladen
- colorHex fuer 41 Stoffe ergaenzen
- Verfuegbarkeitsmatrix in Admin schneller pflegbar machen

**Upload-Limit bleibt 15 MB.**

**Swatch Image Importer (ZIP/Ordner):**

Script zum Batch-Import von Stoffbildern aus einem lokalen Ordner oder ZIP-Archiv.
Matching ueber Artikelnummer im Dateinamen.

```bash
npx tsx scripts/import-swatch-images.ts <ordner-oder-zip>                  # Dry-Run
npx tsx scripts/import-swatch-images.ts <ordner-oder-zip> --apply          # Import ins CMS
npx tsx scripts/import-swatch-images.ts <ordner-oder-zip> --replace-existing --apply
```

Dateinamen-Konventionen (Artikelnummer am Anfang):
- `401.233.jpg` oder `401-233-olive.png` → Artikelnummer `401.233`
- `999-234-06-name.webp` → Artikelnummer `999.234.06`
- `15815809.jpg` → 8-stellige Artikelnummer
- `B15815826.png` → Prefixed Artikelnummer

Workflow:
1. **Dry-Run** (Standard): Dateien scannen, Artikelnummern erkennen, gegen DB matchen, Report schreiben
2. **Apply** (`--apply`): Bilder optimieren (WebP, max 2000px, Q84), MediaAsset anlegen, FabricSwatch.swatchImageId setzen

Report-Status:
- `MATCHED` — Artikelnummer passt exakt zu DB-Swatch, `importCandidate: true`
- `NO_MATCH` — Keine Artikelnummer im Dateinamen oder kein DB-Match
- `DUPLICATE` — Anderes Bild wurde bereits fuer diesen Swatch gematcht
- `ALREADY_HAS_IMAGE` — Swatch hat bereits ein Bild (ohne `--replace-existing`)
- `UNCERTAIN` — Match mit niedriger Confidence (< 0.85)
- `IMPORTED` — Erfolgreich importiert (nur mit `--apply`)

Report-Dateien:
- `data/import/swatch-images/import-report.json` — Detaillierter JSON-Report
- `data/import/swatch-images/import-report.csv` — CSV fuer Excel/Review

Sicherheitsregeln:
- Dry-Run macht keine DB-Aenderung
- Vorhandene Swatch-Bilder werden NICHT ueberschrieben (es sei denn `--replace-existing`)
- Keine Families/ProductTypes/Availabilities/Navigation geaendert
- Upload-Limit bleibt 15 MB pro Datei
- Bildoptimierung: Sharp, WebP Q84, max 2000px, EXIF entfernt, keine Hochskalierung
- ZIP: `__MACOSX`-Ordner und versteckte Dateien werden uebersprungen
- Idempotent: Mehrfach ausfuehren ist sicher

**Axroma Fabric Image Scraper (v2 — Deep Crawl, DEPRECATED):**

> **Hinweis:** Axroma-Scraper wird nicht mehr fuer automatischen Bildimport verwendet,
> da die Quelle keine zuverlaessigen Swatchbilder liefert. Stattdessen den
> Swatch Image Importer (oben) mit manuell vorbereiteten Bildern verwenden.

Script zum automatisierten Abgleich und Import von Stoffbildern von `axroma.com.cn` (eigene Webseite).
Crawlt Uebersichtsseiten, Kategorie-Seiten, Paginierung UND Detailseiten (z.B. `product_100000333439843.html`).

```bash
# Basis-Kommandos (Drei-Phasen-Workflow)
npx tsx scripts/scrape-axroma-fabric-images.ts                    # Dry-Run: Deep Crawl + Match, kein Download
npx tsx scripts/scrape-axroma-fabric-images.ts --download          # + Bilder ins Staging herunterladen
npx tsx scripts/scrape-axroma-fabric-images.ts --download --apply  # + gepruefte Bilder ins CMS importieren

# Crawl-Steuerung
npx tsx scripts/scrape-axroma-fabric-images.ts --url "http://axroma.com.cn/en/product/product_100000333439843.html"  # Start von spezifischer URL
npx tsx scripts/scrape-axroma-fabric-images.ts --url "http://axroma.com.cn/en/product/product_100000333439843.html" --detail-only  # Nur diese eine Seite
npx tsx scripts/scrape-axroma-fabric-images.ts --max-pages 200 --max-depth 4  # Crawl-Limits anpassen

# Erweiterte Optionen
npx tsx scripts/scrape-axroma-fabric-images.ts --download-uncertain     # Auch UNCERTAIN-Matches herunterladen
npx tsx scripts/scrape-axroma-fabric-images.ts --replace-existing       # Bestehende Swatch-Bilder ueberschreiben
npx tsx scripts/scrape-axroma-fabric-images.ts --resume-report data/import/axroma-images/axroma-images-report.json --download
```

CLI-Flags:

| Flag | Default | Beschreibung |
|------|---------|--------------|
| `--url <url>` | `http://axroma.com.cn/en/product/product.html` | Start-URL fuer den Crawl |
| `--detail-only` | off | Nur die via `--url` angegebene Seite scrapen (kein Crawl) |
| `--max-pages <n>` | 100 | Maximale Anzahl zu crawlender Seiten |
| `--max-depth <n>` | 3 | Maximale Link-Tiefe ab Start-URL |
| `--download` | off | Bilder ins Staging herunterladen + WebP-Optimierung |
| `--download-uncertain` | off | Auch `UNCERTAIN`-Matches herunterladen (nicht nur `READY_FOR_IMPORT`) |
| `--apply` | off | `READY_FOR_IMPORT`-Eintraege ins CMS importieren |
| `--replace-existing` | off | Vorhandene Swatch-Bilder ueberschreiben |
| `--resume-report <path>` | — | Von vorherigem Report fortsetzen |

Drei-Phasen-Workflow:
1. **Dry-Run** (Standard): BFS-Deep-Crawl, Bilder erkennen, gegen DB-Swatches matchen, Report schreiben
2. **Download** (`--download`): Bilder in Staging herunterladen + WebP-Optimierung
3. **Apply** (`--apply`): Nur `READY_FOR_IMPORT`-Eintraege ins CMS uebernehmen (MediaAsset anlegen + FabricSwatch verknuepfen)

> **Hinweis:** Erst Report pruefen, dann Download, dann niemals blind Apply.

Deep-Crawl-Verhalten:
- BFS-Queue mit `[url, depth]`-Tupeln, startet bei `--url` mit Tiefe 0
- Erkennt Detail-Links (`product_*.html`), Paginierung (`?page=`, `?p=`), Kategorie-Links
- Detailseiten werden geparst: Titel, Headings, Artikelnummern, Stoffnamen aus Tabellen/Spans
- Pro Seite: Deduplizierung (bester Match pro Swatch gewinnt, andere → `ALTERNATIVE_IMAGE`)

Image-Klassifizierung:
- Rollen: `swatch`, `product`, `detail`, `gallery`, `layout`, `unknown`, `ignored`
- `layout`: Website-Bedienelemente (Icons, Navigation, Back-Buttons)
- `product`/`detail`: Bilder aus `/vancheerfile/Images/` (Axroma CDN)
- `ignored`: Tracking-Pixel, Spacer, zu kleine Bilder (< 50px)
- Ignore-Rules mit `urlOnly`-Flag: URL-Pfad-basiert (z.B. `/images/ico*`, `/images/back.png`) oder Combined (URL + Alt + Title)
- Lazy-Load-Erkennung: `data-src`, `data-original`, `data-lazy`, `data-url`, `srcset`

Artikelnummer-Erkennung (Whitelist-basiert):
- `rawDetectedArticleNumbers`: Alle Zahlen, die syntaktisch wie Artikelnummern aussehen (inkl. interne IDs)
- `candidateArticleNumbers`: Nur validierte Kandidaten:
  - Punktierte Nummern (z.B. `401.233`) sind immer Kandidaten (strukturiertes Format)
  - 8-stellige Zahlen und Prefixed-Nummern nur wenn sie einer DB-Artikelnummer entsprechen
  - Verhindert False Positives durch interne Seiten-IDs, Bildnummern, JS-Werte
- `matchedArticleNumber`: Die tatsaechlich gematchte Artikelnummer des zugewiesenen Swatches

Matching-Prioritaet (6-stufig, nur mit Kandidaten-Artikelnummern):
1. Bild-Kontext Artikelnummer (umgebender Text/Tabelle) → confidence 0.95
2. Alt/Title Artikelnummer → confidence 0.90
3. Seite hat genau eine Kandidaten-Artikelnummer → confidence 0.85
4. Alt/Title Stoffname (exakt) → confidence 0.80
5. Heading Stoffname → confidence 0.75
6. Seitentitel Stoffname → confidence 0.70

Import-Workflow:
- `importCandidate: true` im Dry-Run: Bild ist importfaehig (confidence >= 0.85, Rolle swatch/product/detail, Swatch ohne Bild, bester Kandidat)
- `READY_FOR_IMPORT`: Status nach erfolgreichem Download + Optimierung
- `--apply` erst nach visueller Pruefung des Reports und der heruntergeladenen Bilder

> **WICHTIG:** `--apply` NIE blind ausfuehren. Immer zuerst:
> 1. Dry-Run → Report pruefen (Matches, Confidence, Artikelnummern)
> 2. `--download` → Bilder visuell pruefen (Staging-Verzeichnis)
> 3. Erst dann `--apply` mit Bedacht

Detailseiten-Test (Production):
```bash
DATABASE_URL="file:./data/mosaroma.db" npx tsx scripts/scrape-axroma-fabric-images.ts \
  --url "http://axroma.com.cn/en/product/product_100000333439843.html" \
  --detail-only
```

Staging-Verzeichnis: `data/import/axroma-images/`
- `original/` — Originalbilder vom Server
- `optimized/` — WebP-optimierte Versionen (max 2000px, Q84)

Report-Dateien:
- `data/import/axroma-images/axroma-images-report.json` — Detaillierter JSON-Report (inkl. PageReports)
- `data/import/axroma-images/axroma-images-report.csv` — CSV fuer Excel/Review
- Pro Bild: `status`, `confidence`, `imageRole`, `importCandidate`, `matchedArticleNumber`, `ignoredReason`
- Pro Seite: `rawDetectedArticleNumbers`, `candidateArticleNumbers`
- Summary: `importCandidates`, `rawArticleNumbersDetected`, `candidateArticleNumbersDetected`

Sicherheitsregeln:
- Nur Domain `axroma.com.cn` erlaubt (Allowlist)
- Rate Limit: 800ms Pause zwischen Requests
- Timeout: 15s pro Request
- Max-Pages und Max-Depth Limits
- Eigener User-Agent gesetzt
- Redirects werden validiert (Zieldomain muss erlaubt sein)
- Dry-Run macht keine DB-Aenderung
- Download macht keine DB-Aenderung
- Apply ist idempotent
- Vorhandene Swatch-Bilder werden NICHT ueberschrieben (es sei denn `--replace-existing`)
- Keine Families/ProductTypes/Availabilities/Navigation geaendert
- Upload-Limit bleibt 15 MB
- Bildoptimierung: Sharp, WebP Q84, max 2000px, EXIF entfernt, keine Hochskalierung

Datenquelle: `getFabricLibraryData()` aus `lib/cms/fabric-library.ts`

### /materialien/technische-daten

Zeigt die vollstaendige technische Vergleichstabelle:

- Stoffqualitaeten (Material & Gewicht)
- Eigenschaftenvergleich Olefin vs. Polyester (12 Pruefwerte)
- Mackintosh® Highlights
- CTA zu Kontakt und Katalog

Datenquelle: `fabricQualities` und `propertiesComparison` aus `lib/mosaroma/materials.ts`

### CMS-Pflegbarkeit

| Bereich | Pflegbar ueber | Datenquelle |
|---------|---------------|-------------|
| Hero (alle 3 Seiten) | Admin → Seiten → Page Record | `getPageHeroData()` |
| SEO Title/Description | Admin → Seiten → Page Record | Page.seoTitle/seoDescription |
| Breadcrumbs | automatisch | Hardcoded Pfade |
| Anchor-Navigation Labels | Code (UI-Labels) | `MaterialAnchorNav.tsx` |
| Mackintosh® Technologie | `/admin/pages` → Materialien → Seitenbereiche → Helper "materials-technology" | `getSectionData("materialien", "materials-technology")` mit Fallback auf `materials.ts` |
| Warum Olefin? (Text+Tags) | `/admin/pages` → Materialien → Seitenbereiche → Helper "materials-olefin" | `getSectionData("materialien", "materials-olefin")` mit Fallback auf `materials.ts` |
| Warum Olefin? (Bild) | `/admin/pages` → Materialien → Seitenbereiche → Helper "materials-olefin" (MediaPicker) | `getSectionImage("materialien", "materials-olefin")` |
| Stofffamilien-Cards | Admin → Stoffbibliothek → Familien | `getFabricFamiliesForHub()` aus FabricFamily DB |
| OceanCycle Kreislauf | `/admin/pages` → Materialien → Seitenbereiche → Helper "materials-oceancycle" | `getSectionData("materialien", "materials-oceancycle")` mit Fallback auf `materials.ts` |
| Stoffe & Muster Preview | Admin → Stoffbibliothek → Stoff bearbeiten → "Auf Materialien-Hub anzeigen" | `getFabricPreviewSwatches()` mit `featuredOnMaterials`-Steuerung |
| Stoffe & Muster Full | Admin → Stoffbibliothek | `getFabricLibraryData()` |
| Technische Tabelle | Code | `materials.ts` |
| Katalog-CTA auf Hub | Admin → Seiten → materialien → Helper-Section "materials-catalog-cta" | `getSectionData("materialien", "materials-catalog-cta")` mit Fallback |

Die Hub-Seite unterstuetzt **CMS-Section-Override**: Wenn fuer die Page `materialien` im Admin echte Content-Sections angelegt und publiziert werden, rendern diese via `ServiceSectionRenderer` statt der Fallback-Sections.

**Helper-Sections** (erkennbar an `settings.helper = true` oder `settings.style` mit Prefix `materials-`) werden vom CMS-Override ausgeschlossen. Sie dienen ausschliesslich als Datenquelle fuer spezifische Felder (z.B. Bilder, CTA-Texte) innerhalb der Fallback-Abschnitte. Eine Helper-Section loest NICHT den CMS-Override aus und wird NICHT als eigener Content-Block gerendert.

**Admin-Darstellung von Helper-Sections:**
- Blaues **Helper**-Badge in der Sektionsliste und im Bearbeitungsformular
- Hinweistext: "Diese Section dient als Datenquelle und wird nicht direkt als eigener Seitenblock gerendert."
- Style-Dropdown ist gesperrt (damit `helper: true` nicht versehentlich geloescht wird)
- Settings JSON ist schreibgeschuetzt in einem collapsed Details-Element sichtbar
- Inhaltliche Felder (Titel, Text, Button, Bild) sind je nach Helper-Typ sichtbar und pflegbar

### Wiederverwendete CMS-Funktionen

- **Page/PageSection-Modell** — neue Page Records fuer Unterseiten
- **getPageHeroData()** — Hero + SEO aus CMS mit Fallback
- **getServicePageBySlug()** — CMS-Section-Override
- **ServiceSectionRenderer** — Section-Rendering
- **BreadcrumbBar** — Navigation
- **PageHero** — Hero-Rendering
- **getFabricLibraryData()** / **getFabricPreviewSwatches()** — Stoffbibliothek-Daten
- **getSectionData()** — Laedt beliebige Helper-Section Daten (Titel, Text, Button) nach Style
- **Revalidation** — `revalidateMaterials()` deckt alle 3 Routen ab

### Nicht vorhandene CMS-Funktionen (bewusst nicht gebaut)

- **Technische Tabellenwerte im CMS** — Daten bleiben in `materials.ts` (TODO)
- **Materialdetailseiten** (`/materialien/mackintosh` etc.) — FabricFamily-Modell hat nicht genug Content-Felder (TODO)
- **Anchor-Navigation im CMS** — Labels sind UI-Konstanten, keine Inhalte

### Neue Dateien

| Datei | Beschreibung |
|-------|-------------|
| `app/materialien/stoffe-muster/page.tsx` | Vollstaendige Stoffbibliothek-Seite |
| `app/materialien/technische-daten/page.tsx` | Technische Datenseite |
| `components/materials/TechnicalDataTable.tsx` | Wiederverwendbare Vergleichstabelle |
| `components/materials/FabricLibraryPreview.tsx` | Stoffvorschau-Komponente (6 Cards) |
| `components/materials/MaterialAnchorNav.tsx` | Anchor-Navigation fuer Hub |
| `scripts/backfill-material-pages.ts` | Backfill fuer Page Records |
| `scripts/backfill-materials-olefin-image-section.ts` | Backfill fuer Olefin-Bild Section |
| `scripts/backfill-fabric-family-hub-fields.ts` | Backfill Hub-Felder aus fabricQualities |
| `scripts/backfill-materials-preview-swatches.ts` | Backfill featuredOnMaterials fuer erste 6 Swatches |
| `scripts/backfill-materials-catalog-cta-section.ts` | Backfill Katalog-CTA Helper-Section |
| `scripts/backfill-materials-core-sections.ts` | Backfill Technology, Olefin, OceanCycle Helper-Sections |

### Stofffamilien-Cards (CMS-gesteuert)

Die Stofffamilien-Cards auf `/materialien` werden aus dem FabricFamily-Modell geladen (`getFabricFamiliesForHub()`).

**Pflegepfad:** `/admin/fabrics` → Tab "Familien" → Familie bearbeiten

Neue Felder auf FabricFamily (Migration `add_fabric_family_hub_fields`):

| Feld | Beschreibung | Pflege |
|------|-------------|--------|
| `subtitle` | Untertitel (z.B. "Aus dem Ozean geboren.") | Textfeld |
| `material` | Materialangabe (z.B. "100 % Olefin") | Textfeld |
| `weight` | Gewichtsangabe (z.B. "ab 260 g/m²") | Textfeld |
| `dyeing` | Faerbungsart (z.B. "spinnduesengefaerbt") | Textfeld |
| `comfort` | Komfortbeschreibung | Textfeld |
| `cushionThickness` | Polsterstaerke (z.B. "5-6 cm") | Textfeld |
| `hubHighlights` | Highlights fuer Hub-Card | Textarea, eine Zeile pro Highlight |
| `isHighlighted` | Premium-Hervorhebung (dunkle Card) | Checkbox |

**Highlights:** Im Admin als Textarea pflegen, eine Zeile pro Highlight. Leere Zeilen werden ignoriert. Im Frontend automatisch in Array gesplittet.

**Hervorhebung:** Genau eine Familie sollte `isHighlighted = true` haben. Diese wird auf dem Hub als dunkle Premium-Card dargestellt. Falls keine Family hervorgehoben ist, wird die erste aktive Familie als Fallback hervorgehoben.

**Hinweis:** `fabricQualities` in `materials.ts` wird weiterhin auf anderen Seiten verwendet (technische Daten, Produkte, Kollektionen). Auf `/materialien` wird es nicht mehr fuer die Stofffamilien-Cards genutzt.

### Stoffe-&-Muster Vorschau (CMS-gesteuert)

Die Stoff-Vorschau auf `/materialien` zeigt bis zu 6 Stoffe. Welche Stoffe angezeigt werden, ist ueber `featuredOnMaterials` steuerbar.

**Pflegepfad:** `/admin/fabrics` → Stoff bearbeiten → Abschnitt "Materialien-Hub Vorschau"

Neue Felder auf FabricSwatch (Migration `add_fabric_swatch_materials_preview_fields`):

| Feld | Beschreibung | Pflege |
|------|-------------|--------|
| `featuredOnMaterials` | Swatch auf Hub anzeigen | Checkbox |
| `materialsPreviewOrder` | Reihenfolge in der Vorschau | Zahl (optional, null = automatisch) |

**Logik:** Wenn mindestens ein aktiver Swatch `featuredOnMaterials = true` hat, werden ausschliesslich diese Featured Swatches angezeigt (max. 6, sortiert nach `materialsPreviewOrder ASC` mit null zuletzt, dann `family.order`, `swatch.order`, `name`). Es wird NICHT mit nicht-featured Swatches aufgefuellt. Nur wenn kein einziger Swatch featured ist, greift der Fallback: die ersten 6 aktiven Swatches aus aktiven Families nach `family.order`, `swatch.order`, `name`.

### Katalog-CTA (CMS-gesteuert)

Der Katalog-CTA am Ende von `/materialien` ist ueber eine Helper-Section steuerbar.

**Pflegepfad:** `/admin/pages` → Materialien → Seitenbereiche → "Alle Details im Katalog"

Im Admin wird die Section mit einem **Helper**-Badge markiert und zeigt folgende Pflegefelder:

| Feld im Admin | DB-Feld | Beschreibung | Fallback auf /materialien |
|---------------|---------|-------------|--------------------------|
| Eyebrow | `eyebrow` | Optionaler Eyebrow-Text | (keiner) |
| Titel | `title` | Ueberschrift | "Alle Details im Katalog" |
| Inhalt | `content` | Beschreibungstext | "Entdecken Sie alle Stoffqualitaeten..." |
| Button Label | `buttonLabel` | Button-Text | "Katalog ansehen" |
| Button Href | `buttonHref` | Button-Link | "/kataloge" |

Die Section nutzt `settings = { style: "materials-catalog-cta", helper: true }`. Das Settings-JSON ist im Admin schreibgeschuetzt (collapsed), damit `helper: true` und `style` nicht versehentlich geloescht werden. Als Helper-Section loest sie NICHT den CMS-Override aus. Geladen ueber `getSectionData("materialien", "materials-catalog-cta")`.

### Mackintosh® Technology (CMS-gesteuert)

Der Technologie-Bereich auf `/materialien` ist ueber eine Helper-Section steuerbar.

**Pflegepfad:** `/admin/pages` → Materialien → Seitenbereiche → "Mackintosh® Technology"

| Feld im Admin | DB-Feld | Beschreibung | Fallback |
|---------------|---------|-------------|----------|
| Eyebrow | `eyebrow` | Eyebrow-Text ueber dem Titel | "Technologie" |
| Titel | `title` | Ueberschrift | "Mackintosh® Technology" |
| Inhalt | `content` | Beschreibungstext (Absaetze durch doppelten Zeilenumbruch getrennt) | 2 Absaetze aus `materials.ts` |
| Schritte | `settings.steps` | Prozessschritte mit Titel, Label und Beschreibung | 3 Schritte (Granulat, Additiv, Spinnduesenfaerbung) |
| Vorteile | `settings.benefits` | Liste der Vorteile | 6 Eintraege aus `materials.ts` |

Die Schritte werden im Admin als Karten-Editor gepflegt (Titel, Label, Beschreibung pro Schritt). Das Label erscheint als farbiger Zusatztext unter der Schrittbeschreibung. Die Vorteile werden als einfache Textliste gepflegt.

### Warum Olefin? (CMS-gesteuert)

Der Olefin-Abschnitt auf `/materialien` ist ueber eine Helper-Section steuerbar, die auch das optionale Bild traegt.

**Pflegepfad:** `/admin/pages` → Materialien → Seitenbereiche → "Warum Olefin?"

| Feld im Admin | DB-Feld | Beschreibung | Fallback |
|---------------|---------|-------------|----------|
| Titel | `title` | Ueberschrift | "Warum Olefin?" |
| Inhalt | `content` | Beschreibungstext (Absaetze durch doppelten Zeilenumbruch getrennt) | 4 Absaetze aus `materials.ts` |
| Tags | `settings.tags` | Eigenschafts-Tags (z.B. "Flexibel", "Hitzebestaendig") | 4 Tags aus `materials.ts` |
| Bild | `imageId` | Optionales Bild (MediaPicker) | (keines) |

Die Tags werden als einfache Textliste gepflegt und im Frontend als Border-Badges angezeigt.

### OceanCycle Kreislauf (CMS-gesteuert)

Der OceanCycle-Bereich auf `/materialien` ist ueber eine Helper-Section steuerbar.

**Pflegepfad:** `/admin/pages` → Materialien → Seitenbereiche → "OceanCycle Kreislauf"

| Feld im Admin | DB-Feld | Beschreibung | Fallback |
|---------------|---------|-------------|----------|
| Eyebrow | `eyebrow` | Eyebrow-Text ueber dem Titel | "Nachhaltigkeit" |
| Titel | `title` | Ueberschrift | "OceanCycle Kreislauf" |
| Inhalt | `content` | Einleitungstext | 1 Absatz aus `materials.ts` |
| Schritte | `settings.steps` | Prozessschritte mit Titel und Beschreibung | 4 Schritte (Sammlung, Sortierung, Reinigung, Recycling) |
| Highlights | `settings.highlights` | Highlight-Liste | 5 Eintraege aus `materials.ts` |

Die Schritte werden im Admin als Karten-Editor gepflegt (Titel, Beschreibung pro Schritt). Die Highlights werden als einfache Textliste gepflegt.

### Revalidation

`revalidateMaterials()` revalidiert jetzt alle 3 Routen:

- `/materialien`
- `/materialien/stoffe-muster`
- `/materialien/technische-daten`

ISR mit `revalidate = 60` auf allen Seiten.

### Backfill

```bash
# Dry-run (zeigt was angelegt wuerde)
npx tsx scripts/backfill-material-pages.ts

# Apply (schreibt in DB)
npx tsx scripts/backfill-material-pages.ts --apply
```

Legt Page Records an fuer:
- `stoffe-muster` (PUBLISHED, MATERIAL_INDEX)
- `technische-daten` (PUBLISHED, MATERIAL_INDEX)

Idempotent. Ueberschreibt keine bestehenden Pages.

```bash
# Olefin-Bild Section (dry-run)
npx tsx scripts/backfill-materials-olefin-image-section.ts

# Olefin-Bild Section (apply)
npx tsx scripts/backfill-materials-olefin-image-section.ts --apply
```

Legt eine Helper-Section mit `settings = { style: "materials-olefin", helper: true }` auf der Page `materialien` an. Diese Section ist eine Helper-Section und wird NICHT als normaler Content-Block gerendert. Sie dient ausschliesslich als Bildquelle fuer den Olefin-Abschnitt. Danach im Admin ein Bild an die Section anhaengen. Ohne Bild zeigt die Seite den bisherigen Text-Only-Abschnitt. Idempotent.

```bash
# Fabric Family Hub-Felder (dry-run)
npx tsx scripts/backfill-fabric-family-hub-fields.ts

# Fabric Family Hub-Felder (apply)
npx tsx scripts/backfill-fabric-family-hub-fields.ts --apply
```

Uebertraegt Hub-Felder aus den bisherigen fabricQualities-Daten in bestehende FabricFamily-Records. Erstellt fehlende Families (Mackintosh®, Mackintosh® Nerio) falls nicht vorhanden. Matching ueber Slug-Aliase (z.B. mackintosh, mackintosh-classic) und Name-Aliase (z.B. NERIO, Nerio, NERIO / Oceana). Ueberschreibt keine manuell gepflegten Werte. Kein Full Seed, keine bestehenden Daten geloescht. Idempotent.

```bash
# Featured Preview Swatches (dry-run)
npx tsx scripts/backfill-materials-preview-swatches.ts

# Featured Preview Swatches (apply)
npx tsx scripts/backfill-materials-preview-swatches.ts --apply
```

Setzt `featuredOnMaterials=true` und `materialsPreviewOrder=0..5` auf die ersten 6 aktiven Swatches. Idempotent: ueberspringt wenn bereits featured Swatches existieren.

```bash
# Katalog-CTA Section (dry-run)
npx tsx scripts/backfill-materials-catalog-cta-section.ts

# Katalog-CTA Section (apply)
npx tsx scripts/backfill-materials-catalog-cta-section.ts --apply
```

Legt eine Helper-Section mit `settings = { style: "materials-catalog-cta", helper: true }` auf der Page `materialien` an, vorausgefuellt mit den bisherigen CTA-Texten. Idempotent.

```bash
# Core Sections (Technology + Olefin + OceanCycle) (dry-run)
npx tsx scripts/backfill-materials-core-sections.ts

# Core Sections (apply)
npx tsx scripts/backfill-materials-core-sections.ts --apply
```

Legt 3 Helper-Sections auf der Page `materialien` an:
- `materials-technology` — Mackintosh® Technology mit Schritte-Karten und Vorteile-Liste
- `materials-olefin` — Ergaenzt bestehende Olefin-Section um Titel, Text und Tags (oder legt neu an falls nicht vorhanden)
- `materials-oceancycle` — OceanCycle Kreislauf mit Prozesskette und Highlights

Alle vorausgefuellt mit den bisherigen Hardcoded-Daten aus `materials.ts`. Idempotent: ueberspringt bei bestehenden Sections, ergaenzt nur fehlende Felder auf existierender Olefin-Section.

### Produktionshinweise

- **Migration noetig:** `npx prisma migrate deploy` (additive Felder auf FabricFamily + FabricSwatch)
- **Backfill empfohlen:** `npx tsx scripts/backfill-fabric-family-hub-fields.ts --apply`
- **Backfill empfohlen:** `npx tsx scripts/backfill-materials-preview-swatches.ts --apply`
- **Backfill empfohlen:** `npx tsx scripts/backfill-materials-catalog-cta-section.ts --apply`
- **Backfill empfohlen:** `npx tsx scripts/backfill-materials-core-sections.ts --apply`
- **Backfill-Scripts** muessen einmalig ausgefuehrt werden
- **Upload-Limit bleibt 15 MB**
- **Keine bestehenden Daten beschaedigt**
- **Rollback:** `git revert <commit>`, Page Records im Admin deaktivieren/loeschen

### TODOs

- [ ] Technische Tabellenwerte in CMS ueberfuehren (eigenes Modell oder PageSection-Style)
- [ ] Materialdetailseiten (`/materialien/mackintosh`, `/materialien/mackintosh-lite`, `/materialien/nerio`, `/materialien/basic`) mit enriched FabricFamily-Daten
- [x] Stofffamilien-Card-Texte in CMS ueberfuehren (FabricFamily Hub-Felder)
- [x] Stoffe-&-Muster-Vorschau steuerbar via `featuredOnMaterials`
- [x] Katalog-CTA CMS-pflegbar via Helper-Section
- [x] OceanCycle / Mackintosh-Technologie-Texte in CMS ueberfuehren (Phase 3: Helper-Sections)
- [x] NERIO Sustainability Landing Page mit 7 Helper-Sections (Phase 4)
- [x] FabricLibrary `?family=nerio` Query-Parameter-Support
- [x] NERIO in Hauptnavigation aufgenommen

### Phase 4: NERIO Sustainability Landing Page

**Route:** `/nerio`

**Neue Helper-Sections (7 Stueck):**

| Style | Label | Zweck |
|---|---|---|
| `nerio-story` | NERIO Story | Einleitungstext + optionales Bild (MediaPicker) |
| `nerio-oceancycle` | NERIO OceanCycle Kreislauf | Prozesskette mit Schritten und Highlights |
| `nerio-promise` | NERIO Versprechen | Nachhaltigkeitsversprechen mit Icon-Karten |
| `nerio-highlights` | NERIO Highlights | Statistiken und Kennzahlen (dunkler Bereich) |
| `nerio-technical-facts` | NERIO Technische Fakten | Technische Daten-Tabelle |
| `nerio-products-preview` | NERIO Stoffe Preview | Vorschau NERIO-Stoffe aus Stoffbibliothek |
| `nerio-final-cta` | NERIO CTA | Abschliessender CTA-Block |

**Admin-Pflege:** Alle Sections ueber Admin → Seiten → nerio bearbeitbar. Jede Section hat eigene Admin-Felder (Schritte, Highlights, Statistiken, Fakten etc.).

**Backfill-Script:**
```bash
npx tsx scripts/backfill-nerio-sections.ts          # Dry-Run
npx tsx scripts/backfill-nerio-sections.ts --apply   # Anwenden
```
Erstellt Page "nerio" (PUBLISHED) und alle 7 Helper-Sections mit Fallback-Daten. Idempotent.

**FabricLibrary Query-Parameter:**
`/materialien/stoffe-muster?family=nerio` oeffnet die Stoffbibliothek mit vorausgewaehltem NERIO-Filter.

**Navigation:**
NERIO-Link in `lib/mosaroma/navigation.ts` zwischen "Kollektionen" und "Materialien" eingefuegt.

**Revalidation:**
`/nerio` wird bei Material-Aenderungen automatisch revalidiert via `revalidateMaterials()`.

### Section: nerio-videos

**Position auf `/nerio`:** Zwischen "NERIO Highlights" und "NERIO im Detail" (Technische Fakten)

**Pflegepfad:** `/admin/pages` → NERIO → Seitenbereiche → `nerio-videos`

**Section-Felder:**
- **Eyebrow** — Oberer Akzent-Text (Standard: „Prozesse & Kreisläufe")
- **Titel** — Überschrift (Standard: „Wie aus Verantwortung neues Material entsteht")
- **Inhalt** — Einleitungstext (Rich Text)

**Video-Felder (3 Slots):**

Jedes Video hat folgende Felder:
- **Aktiv** — Checkbox, steuert ob das Video angezeigt wird
- **Reihenfolge** — Numerische Sortierung
- **YouTube URL** — Vollständige YouTube-URL (z.B. `https://www.youtube.com/watch?v=...`)
- **Titel** — Deutscher Videotitel
- **Beschreibung** — Deutsche Kurzbeschreibung
- **Startzeit (Sekunden)** — Optional, z.B. `26` für Start bei 0:26
- **Vorschaubild** — Optional per MediaPicker; wenn leer, wird ein hochwertiger Placeholder angezeigt
- **Label** — Optionaler Tag, z.B. „Prozessvideo", „Recycling", „Materialkreislauf"

**YouTube Datenschutz / Lazy Load:**
- YouTube-iframe wird erst nach Klick geladen (kein initialer Seitenaufruf)
- Embed über `youtube-nocookie.com`
- Hinweis auf jeder Karte: „Mit Klick wird ein YouTube-Video geladen."
- Autoplay nach Klick (`autoplay=1`)

**Thumbnail / Vorschaubild:**
- Optional per MediaPicker pro Video
- Wenn gesetzt: Bild wird in 16:9 Format mit `object-fit: cover` angezeigt
- Wenn leer: hochwertiger Ocean-Teal Placeholder mit Play-Button
- Alt-Text aus MediaAsset
- Upload-Limit bleibt 15 MB

**Backfill-Script:** `scripts/backfill-nerio-videos-section.ts`
- Dry-run: `npx tsx scripts/backfill-nerio-videos-section.ts`
- Apply: `npx tsx scripts/backfill-nerio-videos-section.ts --apply`
- Idempotent — überschreibt keine manuell gepflegten Inhalte

**Production-Hinweis:**
1. DB Backup erstellen
2. Code aktualisieren
3. Backfill ausführen (dry-run → apply)
4. Build + Restart

**Rollback:**
- Section `nerio-videos` im CMS deaktivieren oder löschen
- Seite zeigt dann nur Fallback-Videos (keine kaputte Darstellung)

### OceanCycle Step-Bilder

**Position auf `/nerio`:** Im Bereich „OceanCycle Kreislauf" — jede der vier Prozesskarten (Sammlung, Sortierung, Reinigung, Recycling)

**Pflegepfad:** `/admin/pages` → NERIO → Seitenbereiche → `nerio-oceancycle`

**Pro Step pflegbar:**
- Titel
- Beschreibung
- Bild per MediaPicker (optional)
- Bilddarstellung: „Einpassen" (contain) oder „Füllen" (cover)

**Bilddarstellung (imageFit):**
- **Einpassen (contain)** — Standard. Bild wird komplett angezeigt mit Padding. Ideal für Icons, Lineart und Grafiken.
- **Füllen (cover)** — Bild füllt den gesamten Bereich aus, wird ggf. beschnitten. Ideal für Fotos.
- Das Dropdown erscheint nur, wenn ein Bild gesetzt ist.

**Verhalten:**
- Wenn ein Bild gesetzt ist: CMS-Bild wird in 4:3-Format angezeigt (Darstellungsmodus per `imageFit`)
- Wenn kein Bild gesetzt ist: hochwertiger Teal-Gradient-Platzhalter mit Nummer wird angezeigt
- Alt-Text aus MediaAsset
- Upload-Limit bleibt 15 MB

**Backfill-Script:** `scripts/backfill-nerio-oceancycle-images.ts`
- Ergänzt fehlende `imageId`-Felder in bestehenden Steps
- Überschreibt keine manuell gepflegten Bilder
