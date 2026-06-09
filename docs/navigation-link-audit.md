# Navigation Link Audit

## Executive Summary

All 21 NavigationItems across 4 menus have been audited and classified. 14 items were upgraded from CUSTOM_URL to PAGE with proper linkedPageId references. 3 DRAFT page records were created for legal pages (Impressum, Datenschutz, AGB) that previously had no target. 7 footer collection links remain as CUSTOM_URL pointing to valid SSG collection routes.

## Branch / Commit

- Branch: `claude/add-logo-i2yFH`
- Audit date: 2026-06-09

## Data Model

### NavigationItem Fields

| Field | Type | Purpose |
|---|---|---|
| linkType | String (default "CUSTOM_URL") | PAGE, PAGE_SLUG, SYSTEM_ROUTE, CUSTOM_URL |
| href | String? | Legacy/fallback URL, also used for SYSTEM_ROUTE path and CUSTOM_URL |
| linkedPageId | String? | Foreign key to Page (used when linkType=PAGE) |
| linkedPage | Page? | Relation to CMS Page |
| isActive | Boolean (default true) | Controls public visibility |
| target | String (default "_self") | "_blank" for new tab |

### Link Types

| Type | Description | Public Rendering |
|---|---|---|
| PAGE | Linked to CMS Page via linkedPageId | Resolves slug to path; hidden if DRAFT/ARCHIVED |
| PAGE_SLUG | Planned page by slug (href field) | Always hidden publicly (status=missing_page) |
| SYSTEM_ROUTE | Known app route from SYSTEM_ROUTES list | Validated against route list |
| CUSTOM_URL | Free internal or external URL | External URLs get target=_blank rel=noopener |

## Pre-Backfill State

All 21 items were linkType=CUSTOM_URL with linkedPageId=null.

### Header (HEADER) - 6 items

| Label | href | linkType | linkedPageId | Problem |
|---|---|---|---|---|
| Kollektionen | /kollektionen | CUSTOM_URL | null | upgradeable to PAGE |
| Materialien | /materialien | CUSTOM_URL | null | upgradeable to PAGE |
| Uber uns | /ueber-uns | CUSTOM_URL | null | upgradeable to PAGE |
| Kataloge | /kataloge | CUSTOM_URL | null | upgradeable to PAGE |
| Neuigkeiten | /neuigkeiten | CUSTOM_URL | null | upgradeable to PAGE |
| Kontakt | /kontakt | CUSTOM_URL | null | upgradeable to PAGE |

### Footer / Kollektionen (FOOTER) - 7 items

| Label | href | linkType | linkedPageId | Problem |
|---|---|---|---|---|
| Green | /kollektionen/green | CUSTOM_URL | null | OK (valid SSG route) |
| Blue | /kollektionen/blue | CUSTOM_URL | null | OK (valid SSG route) |
| Red | /kollektionen/red | CUSTOM_URL | null | OK (valid SSG route) |
| Golden | /kollektionen/golden | CUSTOM_URL | null | OK (valid SSG route) |
| Earth & Grey | /kollektionen/earth-grey | CUSTOM_URL | null | OK (valid SSG route) |
| NERIO Oceana | /kollektionen/nerio-oceana | CUSTOM_URL | null | OK (valid SSG route) |
| Basic | /kollektionen/basic | CUSTOM_URL | null | OK (valid SSG route) |

### Service (SERVICE) - 5 items

| Label | href | linkType | linkedPageId | Problem |
|---|---|---|---|---|
| Kataloge | /kataloge | CUSTOM_URL | null | upgradeable to PAGE |
| Produktmasse | /kataloge/produktmasse | CUSTOM_URL | null | upgradeable to PAGE |
| Pflege & Garantie | /kataloge/pflege-garantie | CUSTOM_URL | null | upgradeable to PAGE |
| Stoff- & technische Daten | /kataloge/stoff-technische-daten | CUSTOM_URL | null | upgradeable to PAGE |
| Kontakt | /kontakt | CUSTOM_URL | null | upgradeable to PAGE |

### Rechtliches (LEGAL) - 3 items

| Label | href | linkType | linkedPageId | Problem |
|---|---|---|---|---|
| Impressum | /impressum | CUSTOM_URL | null | NO PAGE EXISTS - 404 |
| Datenschutz | /datenschutz | CUSTOM_URL | null | NO PAGE EXISTS - 404 |
| AGB | /agb | CUSTOM_URL | null | NO PAGE EXISTS - 404 |

## Post-Backfill State

### Header (HEADER) - 6 items - ALL PAGE

| Label | linkType | linkedPage | Status |
|---|---|---|---|
| Kollektionen | PAGE | kollektionen | PUBLISHED |
| Materialien | PAGE | materialien | PUBLISHED |
| Uber uns | PAGE | ueber-uns | PUBLISHED |
| Kataloge | PAGE | kataloge | PUBLISHED |
| Neuigkeiten | PAGE | neuigkeiten | PUBLISHED |
| Kontakt | PAGE | kontakt | PUBLISHED |

### Footer / Kollektionen (FOOTER) - 7 items - ALL CUSTOM_URL

No changes. Collection routes are valid SSG pages generated from the Collection model, not CMS Pages.

### Service (SERVICE) - 5 items - ALL PAGE

| Label | linkType | linkedPage | Status |
|---|---|---|---|
| Kataloge | PAGE | kataloge | PUBLISHED |
| Produktmasse | PAGE | produktmasse | PUBLISHED |
| Pflege & Garantie | PAGE | pflege-garantie | PUBLISHED |
| Stoff- & technische Daten | PAGE | stoff-technische-daten | PUBLISHED |
| Kontakt | PAGE | kontakt | PUBLISHED |

### Rechtliches (LEGAL) - 3 items - ALL PAGE (DRAFT)

| Label | linkType | linkedPage | Status | Public |
|---|---|---|---|---|
| Impressum | PAGE | impressum | DRAFT | HIDDEN |
| Datenschutz | PAGE | datenschutz | DRAFT | HIDDEN |
| AGB | PAGE | agb | DRAFT | HIDDEN |

DRAFT pages were created with title only, no content. Public rendering filters these out (status != "ok"). Admin shows "Entwurf" warning badge. When content is added and pages are published, links automatically become visible.

## Summary by linkType

| linkType | Count | Notes |
|---|---|---|
| PAGE | 14 | 11 PUBLISHED, 3 DRAFT |
| CUSTOM_URL | 7 | All footer collection links |
| SYSTEM_ROUTE | 0 | All converted to PAGE where possible |
| PAGE_SLUG | 0 | Available for future planned pages |

## Broken Links

- `/impressum` - FIXED: DRAFT page created, link hidden until published
- `/datenschutz` - FIXED: DRAFT page created, link hidden until published
- `/agb` - FIXED: DRAFT page created, link hidden until published

## Deactivated Links

None. All items remain isActive=true. DRAFT page links are hidden via the resolver status filter, not via isActive.

## Recommendations

1. Add content to Impressum, Datenschutz, AGB pages and publish them
2. Consider adding collection-specific pages if CMS content is needed for collection routes
3. PAGE_SLUG type is available for pre-configuring navigation items before pages exist

## Open TODOs

- [ ] Add actual content to legal pages (Impressum, Datenschutz, AGB) and set status to PUBLISHED
- [ ] Consider whether footer collection links should eventually point to CMS pages
