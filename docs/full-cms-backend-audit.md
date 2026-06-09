# Vollständiges CMS Backend Audit

**Datum:** 2026-06-09
**Branch:** `claude/add-logo-i2yFH`
**Commit-Basis:** `f211ee1` (Phase 2G abgeschlossen)
**Build-Status:** Erfolgreich

---

## 1. Zusammenfassung

Das mrweb2 CMS ist insgesamt solide gebaut. 46 Routes (31 Admin, 15 Public), 19 Prisma-Modelle und eine vollständige CRUD-API-Abdeckung wurden geprüft. Zwei Bugs wurden gefunden und sofort behoben:

1. **FormSubmission DELETE** hatte keine Rollenprüfung (VIEWER konnte löschen) — jetzt ADMIN-only
2. **Health-Endpoint** gab Environment-Variablen-Status preis — jetzt nur noch DB-Status

---

## 2. Route-Matrix

### Admin Routes (31)

| Route | Auth | Server/Client | Datenquelle |
|-------|------|--------------|-------------|
| /admin/login | Nein (Login-Seite) | Client | Statisch |
| /admin | Ja | Server | Prisma (Counts) |
| /admin/pages | Ja | Server | Prisma |
| /admin/pages/[id] | Ja | Server | Prisma |
| /admin/media | Ja | Server | Prisma |
| /admin/media/[id] | Ja | Server | Prisma |
| /admin/collections | Ja | Server | Prisma |
| /admin/collections/[id] | Ja | Server | Prisma |
| /admin/products | Ja | Server | Prisma |
| /admin/products/[id] | Ja | Server | Prisma |
| /admin/product-groups | Ja | Server | Prisma |
| /admin/product-groups/[id] | Ja | Server | Prisma |
| /admin/materials | Ja | Server | Prisma |
| /admin/materials/[id] | Ja | Server | Prisma |
| /admin/downloads | Ja | Server | Prisma |
| /admin/downloads/[id] | Ja | Server | Prisma |
| /admin/measurements | Ja | Server | Prisma |
| /admin/measurements/[id] | Ja | Server | Prisma |
| /admin/news | Ja | Server | Prisma |
| /admin/news/[id] | Ja | Server | Prisma |
| /admin/navigation | Ja | Server | Prisma |
| /admin/navigation/[id] | Ja | Server | Prisma |
| /admin/footer | Ja | Server | Prisma |
| /admin/forms/contact | Ja | Server | Prisma |
| /admin/forms/submissions | Ja | Server | Prisma |
| /admin/forms/submissions/[id] | Ja | Server | Prisma |
| /admin/settings | Ja | Server | Prisma |
| /admin/users | Ja | Server | Prisma |
| /admin/users/[id] | Ja | Server | Prisma |
| /admin/service/pflege-garantie | Ja | Server | Prisma |
| /admin/service/stoff-technische-daten | Ja | Server | Prisma |

### Public Routes (15)

| Route | Revalidate | Fallback | Status-Filter |
|-------|-----------|----------|--------------|
| / | 60s | Statisch | N/A |
| /kollektionen | 60s | Statisch | PUBLISHED |
| /kollektionen/[slug] | 60s | Statisch + DB | PUBLISHED |
| /produkte/[slug] | 60s | Statisch + DB | PUBLISHED |
| /produktkategorien | 60s | Statisch | isActive |
| /produktkategorien/[slug] | 60s | Statisch + DB | isActive + PUBLISHED |
| /materialien | 60s | Statisch | N/A |
| /kataloge | 60s | Statisch | isActive |
| /kataloge/produktmasse | 60s | Statisch | isActive |
| /kataloge/pflege-garantie | 60s | Statisch | PUBLISHED |
| /kataloge/stoff-technische-daten | 60s | Statisch | PUBLISHED |
| /neuigkeiten | 60s | Statisch | PUBLISHED |
| /neuigkeiten/[slug] | 60s | Statisch + DB | PUBLISHED |
| /kontakt | 60s | Statisch | isActive |
| /ueber-uns | 60s | Statisch | N/A |

---

## 3. Modell-Matrix (Prisma)

| Modell | Status-Feld | isActive | Delete-Strategie | Seed-Schutz |
|--------|------------|----------|-----------------|-------------|
| User | — | — | ADMIN-only | Upsert by email |
| SiteSettings | — | — | Kein DELETE | Upsert (empty update) |
| MediaAsset | — | — | ADMIN + Usage-Check | Create if not exists |
| NavigationMenu | — | — | ADMIN + Cascade Items | Create if not exists |
| NavigationItem | — | isActive | Cascade on Menu | Upsert if menu missing |
| Page | PageStatus | — | ADMIN-only | Upsert by slug |
| PageSection | — | isActive | ADMIN + Cascade on Page | Create if count=0 |
| Collection | PageStatus | — | ADMIN + Guard | Upsert by slug |
| ProductGroup | — | isActive | ADMIN + Guard | Upsert by slug |
| Product | PageStatus | — | ADMIN-only | Upsert, preserves SEO/images |
| ProductImage | — | — | Cascade on Product | Bulk create |
| Material | — | isActive | ADMIN + Guard | Upsert by slug |
| Measurement | — | isActive | ADMIN-only | Upsert by slug |
| Download | — | isActive | ADMIN-only | Create if not exists |
| NewsArticle | PageStatus | — | ADMIN-only | Upsert by slug |
| FooterSettings | — | — | Kein DELETE | Upsert (empty update) |
| Form | — | isActive | Kein DELETE | Upsert by slug |
| FormField | — | isActive | Cascade on Form | Bulk delete + recreate |
| FormSubmission | — | isRead | ADMIN-only (BEHOBEN) | Create only |

---

## 4. API CRUD-Abdeckung

| Modell | GET | POST | PATCH | DELETE | Auth |
|--------|-----|------|-------|--------|------|
| User | L | C/U | — | ADMIN | Ja |
| SiteSettings | L | Upsert | — | — | Ja |
| FooterSettings | L | Upsert | — | — | Ja |
| MediaAsset | L+Detail | Upload+Meta | Meta | ADMIN+Usage | Ja |
| NavigationMenu | L | C/U+Items | — | ADMIN | Ja |
| Page | L | C/U | Status | ADMIN | Ja |
| PageSection | L | C | Update | ADMIN | Ja |
| Collection | L | C/U | Status | ADMIN+Guard | Ja |
| ProductGroup | L | C/U | isActive | ADMIN+Guard | Ja |
| Product | L | C/U | Status | ADMIN | Ja |
| Material | L | C/U | isActive | ADMIN+Guard | Ja |
| Measurement | L | C/U | isActive | ADMIN | Ja |
| Download | L | C/U | isActive | ADMIN | Ja |
| NewsArticle | L | C/U | Status | ADMIN | Ja |
| Form | L | C/U+Fields | — | — | Ja |
| FormSubmission | L | — | isRead | ADMIN (BEHOBEN) | Ja |

---

## 5. Sicherheits-Audit

### Authentifizierung
- JWT-basiert mit HTTP-only Cookies (HS256, jose)
- Cookie: httpOnly, secure (Prod), sameSite=lax, 7 Tage
- Passwort-Hashing: bcryptjs, cost 12
- Per-Route Auth-Checks via `getSessionUser()`

### Rollen-Checks
- VIEWER: Nur Lesen
- EDITOR: Lesen + Schreiben (kein Löschen)
- ADMIN: Voller Zugriff
- Alle DELETE-Endpoints prüfen ADMIN-Rolle

### Upload-Sicherheit
- 5 MB Limit
- MIME-Type Whitelist (jpeg, png, gif, webp, avif)
- Magic-Byte Validierung
- Dateiname-Sanitisierung (basename + timestamp)
- Path-Traversal-Schutz im File-Serving

### Rich-Text Sanitisierung
- Server-seitig via `sanitize-html` (`lib/server/sanitize-rich-text.ts`)
- Erlaubte Tags: p, strong, em, ul, ol, li, br, a, h3, h4
- Erlaubte Attribute: a[href, target, rel]
- Angewendet in: PageSection (POST/PATCH), NewsArticle (POST)
- Nicht nötig für: Collections, Products, Pages, Downloads (plain-text Felder, React-escaped)

### Formular-Sicherheit (öffentlich)
- Rate-Limiting: 5 Requests/60s pro IP-Hash (speicherbasiert)
- Honeypot-Feld konfigurierbar
- Min-Zeit-Check: 3 Sekunden
- Input-Validierung: max 5000 Zeichen/Feld, max 50 Felder
- IP-Hashing: SHA256 (kein Klartext)

### Öffentliche Endpoints (bewusst ohne Auth)
- `GET /api/health` — nur DB-Status (BEREINIGT, kein Env mehr)
- `POST /api/forms/[slug]/submit` — öffentliches Formular
- `GET /api/media/file/[...path]` — öffentliche Medien mit Path-Traversal-Schutz

---

## 6. Frontend-Rendering

### Status-Filterung
- Alle 15 Public Pages filtern korrekt nach `status: PUBLISHED` bzw. `isActive: true`
- Draft/Archived/Inactive Inhalte werden nie öffentlich angezeigt
- Alle CMS-Helfer importieren `"server-only"`

### Fallback-Strategie
- 3-Stufen: DB (published) → Statische Daten → 404
- Alle dynamischen Routes haben `generateStaticParams()`
- ISR mit `revalidate = 60` auf allen Seiten

### HTML-Rendering
- `dangerouslySetInnerHTML` nur in `RichTextRenderer.tsx`
- Alle anderen Textfelder werden als JSX `{value}` gerendert (auto-escaped)

---

## 7. Seed-Schutz

**Gesamtbewertung: 8/10**

- Die meisten Modelle nutzen `upsert` mit konditionaler Erstellung
- Products: SEO-Felder und Image-IDs werden bei Re-Seed beibehalten
- Collections: Admin-bearbeitete Beschreibungen werden beibehalten
- PageSections: Nur erstellt wenn count=0

**Risiko:** Contact Form Felder werden bei jedem Seed komplett neu erstellt (FormField delete + recreate).

---

## 8. Behobene Bugs

### Bug 1: FormSubmission DELETE ohne Rollenprüfung (HIGH)
**Datei:** `app/api/admin/submissions/route.ts`
**Problem:** DELETE-Endpoint prüfte nur `getSessionUser()`, nicht die Rolle. VIEWER konnte Formular-Anfragen löschen.
**Fix:** `if (!user || user.role !== "ADMIN")` — jetzt ADMIN-only.

### Bug 2: Health-Endpoint Informationsleck (LOW)
**Datei:** `app/api/health/route.ts`
**Problem:** Endpoint zeigte `DATABASE_URL: true`, `ADMIN_JWT_SECRET: true` etc. Kein Wert-Leak, aber Infrastruktur-Details.
**Fix:** Env-Objekt komplett entfernt. Zeigt nur noch DB-Status und Timestamp.

---

## 9. Empfehlungen (nicht umgesetzt)

### Mittel-Priorität
1. **CSRF-Token für öffentliches Formular** — Aktuell nur Honeypot + Rate-Limit. CSRF-Token würde automatisierte Angriffe weiter erschweren.
2. **JWT-Secret Fallback entfernen** — `lib/auth/session.ts` hat Dev-Default `"mosaroma-admin-dev-secret-change-me"`. In Produktion sollte ein fehlender Secret einen Fehler werfen.

### Niedrig-Priorität
3. **ISR On-Demand Invalidierung** — Aktuell 60s Polling. `revalidateTag()` nach CMS-Änderungen für sofortige Updates.
4. **Distributed Rate-Limiting** — Speicherbasiert reicht für Single-Server, aber bei Skalierung Redis/DB nötig.
5. **Form DELETE-Endpoint** — Kein DELETE für Forms vorhanden (nur indirekt über DB).

---

## 10. Prüfumfang

| Bereich | Status |
|---------|--------|
| Route-Struktur (46 Routes) | Geprüft |
| Prisma-Schema (19 Modelle) | Geprüft |
| API CRUD-Abdeckung | Geprüft |
| Auth auf allen Admin-Routes | Geprüft |
| Rollen-Checks (VIEWER/EDITOR/ADMIN) | Geprüft |
| Upload-Sicherheit | Geprüft |
| Rich-Text Sanitisierung | Geprüft |
| Path-Traversal-Schutz | Geprüft |
| Public Status-Filterung | Geprüft |
| Fallback-Strategie | Geprüft |
| ISR-Konfiguration | Geprüft |
| HTML-Rendering / XSS | Geprüft |
| Seed-Datei Schutzlogik | Geprüft |
| Health-Endpoint | Geprüft + bereinigt |
| Formular-Sicherheit | Geprüft |
| Cascade/SetNull-Relationen | Geprüft |
