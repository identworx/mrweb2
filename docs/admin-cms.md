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
| `Collection`      | Stoff-Kollektionen                            |
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
- 7 Kollektionen
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

## 9. Frontend-Anbindung (CMS-Helper)

Die folgenden Helper-Funktionen existieren in `lib/cms/`, sind aber **noch nicht** im Frontend eingebunden:

| Datei              | Funktionen                                                |
| ------------------ | --------------------------------------------------------- |
| `pages.ts`         | `getPublishedPages()`, `getPublishedPageBySlug()`         |
| `collections.ts`   | `getCollections()`, `getCollectionBySlug()`                |
| `products.ts`      | `getProducts()`, `getProductBySlug()`                     |
| `navigation.ts`    | `getNavigationByLocation()`                               |
| `footer.ts`        | `getFooterSettings()`                                     |
| `media.ts`         | `getMediaAsset()`, `getMediaAssets()`                     |
| `forms.ts`         | `getFormBySlug()`, `createSubmission()`                   |
| `settings.ts`      | `getSiteSettings()`                                       |

**Aktueller Stand:** Das Frontend liest NULL Daten aus der Datenbank. Alle Inhalte sind statisch in den React-Komponenten.

## 10. Was funktioniert (vollstaendig geprueft)

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
- TypeScript-Build ohne Fehler (269 Routen)
- Proxy-basierter Auth-Schutz fuer alle Admin-Routen

## 11. Was noch fehlt (Phase 2)

### Hohe Prioritaet
1. **Frontend mit DB verbinden** — CMS-Helper in Frontend-Komponenten importieren
2. **Delete-Funktion** — Fuer alle Entitaeten (Seiten, Kollektionen, Produkte, Medien, etc.)
3. **Bild-Zuweisung in Formularen** — Hero/Card-Image-Picker fuer Kollektionen, Produkte, Seiten
4. **Produkt-Galerie** — Mehrere Bilder pro Produkt hochladen und verwalten

### Mittlere Prioritaet
5. **PageSections-Editor** — Sektionen innerhalb von Seiten erstellen und bearbeiten
6. **Rich-Text-Editor** — Fuer Seitentexte, Beschreibungen etc.
7. **Medien-Loeschen** — Datei + DB-Eintrag entfernen
8. **Formular-Einreichungen** — Frontend-Formular mit API verbinden
9. **E-Mail-Benachrichtigung** — Bei neuen Formular-Einreichungen

### Niedrige Prioritaet
10. **News-Verwaltung** — Admin-UI fuer NewsArticle
11. **Downloads-Verwaltung** — Admin-UI fuer Download-Eintraege
12. **Measurement-Verwaltung** — Admin-UI fuer Produktmasse
13. **Drag & Drop Sortierung** — Fuer Listen (Navigationsitems, Sektionen)
14. **Medien-Browser** — Modale Bildauswahl statt manueller ID-Eingabe
15. **Audit-Log** — Aenderungen nachverfolgen

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
  cms/                      # 8 Frontend-Helper (noch ungenutzt)
  db/prisma.ts              # Prisma Client Singleton
  generated/prisma/         # Generierter Prisma Client (gitignored)
prisma/
  schema.prisma             # Datenbank-Schema (17 Modelle)
  seed.ts                   # Seed-Daten
  migrations/               # SQLite Migrationen
proxy.ts                    # Auth-Proxy (Next.js 16 Middleware)
public/uploads/             # Hochgeladene Medien
```
