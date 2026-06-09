# Admin CMS — Dokumentation

Stand: 2026-06-09 (PageSections Editor) | Branch: `claude/add-logo-i2yFH`

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

## 3. Umgebungsvariablen (.env)

| Variable           | Beschreibung                                         | Beispiel                           |
| ------------------ | ---------------------------------------------------- | ---------------------------------- |
| `DATABASE_URL`     | SQLite Datenbankpfad (absolut in Produktion)         | `file:./dev.db`                    |
| `ADMIN_EMAIL`      | E-Mail des Seed-Admin-Benutzers                      | `admin@mosaroma.de`                |
| `ADMIN_PASSWORD`   | Passwort des Seed-Admin-Benutzers                    | `changeme123`                      |
| `ADMIN_JWT_SECRET` | JWT-Signaturschluessel (`openssl rand -base64 32`)   | 32+ Zeichen                        |

**Wichtig:** In Produktion unbedingt `ADMIN_JWT_SECRET` aendern und `ADMIN_PASSWORD` nach erstem Login zuruecksetzen.

## 4. Datenbank (Prisma Schema)

### Modelle (17 Tabellen)

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
| `/admin/products`               | Produkte-Liste (mit Bild, Slug, Aktionen) | Funktional |
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
| GET     | `/api/admin/media`       | Alle Medien laden                         |
| POST    | `/api/admin/media`       | Medium hochladen / Metadaten aktualisieren|
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

## 8. Medien-Upload

- **Erlaubte Typen:** JPEG, PNG, GIF, WebP, AVIF
- **Maximale Groesse:** 5 MB
- **Speicherort:** `public/uploads/general/`
- **Dateiname:** Sanitized + Timestamp (z.B. `mein-bild-1717505432123.jpg`)
- **Nicht erlaubt:** SVG (XSS-Risiko durch eingebettetes JavaScript), PDF

## 9. Frontend-Anbindung (Phase 2A + 2B — aktiv)

### Status

Das oeffentliche Frontend liest Daten aus der CMS-Datenbank. Alle 15 oeffentlichen Seiten sind angebunden (Phase 2A), Kollektionen sind vollstaendig datenbankfaehig (Phase 2B). Wenn die DB leer ist oder CMS-Felder fehlen, greifen automatisch die statischen Fallback-Daten.

### Revalidierung (ISR)

Alle oeffentlichen Seiten nutzen `export const revalidate = 60` (Incremental Static Regeneration). Aenderungen im Admin sind nach maximal 60 Sekunden auf der oeffentlichen Website sichtbar.

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
- [x] Admin: Produkte-Liste mit Bildvorschau, Slug und Aktionen
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
5. Produkt erscheint nach max. 60 Sekunden auf der Website

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
- [x] PageSectionEditForm — Style-spezifische Formulare fuer alle 7 Section-Styles
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

#### Seiten mit Sections

| Seite | Slug | Sections |
|-------|------|----------|
| Pflege & Garantie | pflege-garantie | 6 (4× care-list, 1× cross-link, 1× cta) |
| Stoff- & techn. Daten | stoff-technische-daten | 4 (1× fabric-cards, 1× comparison-table, 1× highlight-cards, 1× cta) |

#### Seed vs. Admin

- **Seed** (`prisma/seed.ts`) ist Initialbefuellung — erstellt Basis-Sections nur wenn noch keine vorhanden
- **Admin** (`/admin/pages/[id]`) ist danach die fuehrende Pflegeoberflaeche
- Seed ueberschreibt nie manuell bearbeitete Sections
- Kein freier PageBuilder — nur kontrollierter feldbasierter Editor fuer feste Section-Styles

### Spaeter
11. **Rich-Text-Editor** — Fuer Seitentexte, Beschreibungen etc.
15. **Drag & Drop Sortierung** — Fuer Listen (Navigationsitems, Sektionen)
16. **Medien-Browser** — Modale Bildauswahl statt manueller ID-Eingabe
17. **Audit-Log** — Aenderungen nachverfolgen

## 12. Sicherheits-Status

### Erledigt
- Alle Admin-API-Routen durch `getSessionUser()` geschuetzt
- Users-API zusaetzlich durch ADMIN-Rollen-Check geschuetzt
- SVG-Upload blockiert (XSS-Risiko)
- Dateigroessen-Limit serverseitig validiert (5 MB)
- MIME-Type serverseitig validiert
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
    media/                  # Medien-Verwaltung
    navigation/             # Navigations-Verwaltung
    footer/page.tsx         # Footer-Einstellungen
    forms/                  # Formulare + Einreichungen
    settings/page.tsx       # Website-Einstellungen
    users/                  # Benutzer-Verwaltung
  api/admin/                # Alle Admin-API-Routen
components/service/         # 7 Service-Section-Renderer (Phase 2D-C)
components/admin/           # 15 Client-Formular-Komponenten (inkl. PageSectionsEditor, PageSectionEditForm)
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
    service-pages.ts        # getServicePageBySlug() (Phase 2D-C)
    forms.ts                # getFormBySlug() (noch nicht im Frontend)
  db/prisma.ts              # Prisma Client Singleton
  generated/prisma/         # Generierter Prisma Client (gitignored)
prisma/
  schema.prisma             # Datenbank-Schema (17 Modelle)
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

- `getMediaAssetUsage(id)` — Prüft 13 Reverse-Relationen, gibt `{ model, count }[]` zurück
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
