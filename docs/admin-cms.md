# Admin CMS — Dokumentation

Stand: 2026-06-04 | Branch: `claude/add-logo-i2yFH`

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
- 9 Produktkategorien
- 1 Footer-Settings
- 1 Kontaktformular mit 5 Feldern

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
| `/admin/products`               | Produkte-Liste                  | Funktional |
| `/admin/products/[id]`          | Produkt bearbeiten/erstellen    | Funktional |
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

## 7. API-Endpunkte

| Methode | Route                    | Funktion                                  |
| ------- | ------------------------ | ----------------------------------------- |
| POST    | `/api/admin/auth`        | Login / Logout                            |
| GET     | `/api/admin/pages`       | Alle Seiten laden                         |
| POST    | `/api/admin/pages`       | Seite erstellen / aktualisieren           |
| GET     | `/api/admin/collections` | Alle Kollektionen laden                   |
| POST    | `/api/admin/collections` | Kollektion erstellen / aktualisieren      |
| GET     | `/api/admin/products`    | Alle Produkte laden                       |
| POST    | `/api/admin/products`    | Produkt erstellen / aktualisieren         |
| GET     | `/api/admin/materials`   | Alle Materialien laden                    |
| POST    | `/api/admin/materials`   | Material erstellen / aktualisieren        |
| GET     | `/api/admin/media`       | Alle Medien laden                         |
| POST    | `/api/admin/media`       | Medium hochladen / Metadaten aktualisieren|
| GET     | `/api/admin/navigation`  | Alle Navigations-Menues laden             |
| POST    | `/api/admin/navigation`  | Navigation aktualisieren                  |
| GET     | `/api/admin/footer`      | Footer-Einstellungen laden                |
| POST    | `/api/admin/footer`      | Footer-Einstellungen speichern            |
| GET     | `/api/admin/forms`       | Kontaktformular laden                     |
| POST    | `/api/admin/forms`       | Kontaktformular aktualisieren             |
| GET     | `/api/admin/submissions` | Formular-Einreichungen laden              |
| GET     | `/api/admin/settings`    | Website-Einstellungen laden               |
| POST    | `/api/admin/settings`    | Website-Einstellungen speichern           |
| GET     | `/api/admin/users`       | Alle Benutzer laden                       |
| POST    | `/api/admin/users`       | Benutzer erstellen / aktualisieren        |
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
| `products.ts`      | `getProducts()`, `getProductBySlug()`                     | Noch nicht (Phase 2C) |
| `forms.ts`         | `getFormBySlug()`, `createSubmission()`                   | Noch nicht (Phase 2C) |

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
- Alle 12 Admin-Listenseiten laden und zeigen Seed-Daten
- Alle Erstellungsformulare (`/new`) laden korrekt
- CRUD fuer alle Entitaeten (Erstellen + Aktualisieren via API getestet)
- Medien-Upload mit Dateivalidierung (Typ + Groesse)
- Dateiname-Sanitierung mit Zeitstempel
- Navigation bearbeiten (Items hinzufuegen/entfernen/sortieren)
- Footer-Einstellungen bearbeiten
- Website-Einstellungen bearbeiten
- Benutzer-Verwaltung (nur ADMIN-Rolle)
- Kontaktformular-Konfiguration
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
- Produkte auf Kollektions-Detailseiten noch aus statischen Daten (Phase 2C)
- TypeScript-Build ohne Fehler (269 Routen)
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

### Phase 2C — Produkte, Produktgruppen, Formulare
1. **Produktkategorien-Seiten** — `/produktkategorien` und `/produktkategorien/[slug]` mit DB-Daten
2. **Produkt-Detailseiten** — `/produkte/[slug]` mit DB-Daten und Galerie
3. **Produkt-Galerie** — Mehrere Bilder pro Produkt hochladen und verwalten
4. **Produkte auf Kollektions-Detailseiten** — Statische Produkte durch DB-Produkte ersetzen
5. **Bild-Zuweisung fuer Produkte** — Hero/Card-Image-Picker
6. **Kontaktformular** — Frontend-Formular mit DB-Konfiguration und API verbinden
7. **E-Mail-Benachrichtigung** — Bei neuen Formular-Einreichungen
8. **Delete-Funktion** — Fuer alle Entitaeten (Seiten, Kollektionen, Produkte, Medien, etc.)
9. **Medien-Loeschen** — Datei + DB-Eintrag entfernen

### Spaeter
10. **PageSections-Editor** — Sektionen innerhalb von Seiten erstellen und bearbeiten
11. **Rich-Text-Editor** — Fuer Seitentexte, Beschreibungen etc.
12. **News-Verwaltung** — Admin-UI fuer NewsArticle
13. **Downloads-Verwaltung** — Admin-UI fuer Download-Eintraege
14. **Measurement-Verwaltung** — Admin-UI fuer Produktmasse
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
    materials/              # Materialien-Verwaltung
    media/                  # Medien-Verwaltung
    navigation/             # Navigations-Verwaltung
    footer/page.tsx         # Footer-Einstellungen
    forms/                  # Formulare + Einreichungen
    settings/page.tsx       # Website-Einstellungen
    users/                  # Benutzer-Verwaltung
  api/admin/                # Alle Admin-API-Routen
components/admin/           # 12 Client-Formular-Komponenten
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
    collections.ts          # getCollections() (noch nicht im Frontend)
    products.ts             # getProducts() (noch nicht im Frontend)
    forms.ts                # getFormBySlug() (noch nicht im Frontend)
  db/prisma.ts              # Prisma Client Singleton
  generated/prisma/         # Generierter Prisma Client (gitignored)
prisma/
  schema.prisma             # Datenbank-Schema (17 Modelle)
  seed.ts                   # Seed-Daten
  migrations/               # SQLite Migrationen
proxy.ts                    # Auth-Proxy (Next.js 16 Middleware)
public/uploads/             # Hochgeladene Medien
```
