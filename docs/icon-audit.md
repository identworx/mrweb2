# Icon Audit — Mosaroma Public Website

**Date:** 2026-06-16
**Scope:** All public-facing icons across the entire Mosaroma website

## Summary

- **Total distinct icon shapes:** ~55
- **Total inline SVG occurrences:** ~95+
- **External icon libraries used:** None (all hand-coded inline SVGs)
- **Placeholder SVG image files:** ~130 in `public/images/placeholders/`
- **Icon pattern:** Stroke-based SVGs using `currentColor`, no fills except social icons

---

## 1. CTA / Navigation Arrow Icons

The most common icon across the site. Same SVG path used everywhere.

| # | Component | File | Lines | Size | Purpose |
|---|-----------|------|-------|------|---------|
| 1 | HeroSection | `components/HeroSection.tsx` | 71–73 | 14×14 | Primary CTA "Kollektionen entdecken" |
| 2 | HeroSection | `components/HeroSection.tsx` | 77–79 | 14×14 | Secondary CTA "Katalog ansehen" |
| 3 | HomepageHero | `components/homepage/HomepageHero.tsx` | 79–81 | 14×14 | CMS hero primary CTA |
| 4 | HomepageHero | `components/homepage/HomepageHero.tsx` | 86–88 | 14×14 | CMS hero secondary CTA |
| 5 | HomepageValueProps | `components/homepage/HomepageValueProps.tsx` | 81–83 | 14×14 | "Mehr über Mosaroma" |
| 6 | HomepageImageTextFeature | `components/homepage/HomepageImageTextFeature.tsx` | 65–67 | 14×14 | "Materialien entdecken" |
| 7 | HomepageCollections | `components/homepage/HomepageCollections.tsx` | 102–104 | 14×14 | "Alle Kollektionen ansehen" |
| 8 | HomepageSustainability | `components/homepage/HomepageSustainability.tsx` | 68–70 | 14×14 | "Mehr zur Verantwortung" |
| 9 | HomepageDownloads | `components/homepage/HomepageDownloads.tsx` | 47–49 | 14×14 | "Alle Downloads ansehen" |
| 10 | HomepageNews | `components/homepage/HomepageNews.tsx` | 40–42 | 14×14 | "Aktuelles" link |
| 11 | SectionTeaser | `components/SectionTeaser.tsx` | 89–98 | 14×14 | Generic section CTA |
| 12 | Footer | `components/Footer.tsx` | 278–288 | 13×13 | Contact CTA button |
| 13 | NewsCard | `components/NewsCard.tsx` | 66–77 | 14×14 | "Weiterlesen" link |
| 14 | CollectionCard | `components/CollectionCard.tsx` | 130–141 | 14×14 | "Entdecken" link |
| 15 | CategoryCard | `components/CategoryCard.tsx` | 58–69 | 12×12 | "Mehr erfahren" link |
| 16 | ProductCard | `components/ProductCard.tsx` | 102–112 | 12×12 | "Produkt ansehen" link |
| 17 | CollectionProductCard | `components/CollectionProductCard.tsx` | 56–66 | 12×12 | "Details" link |
| 18 | ConsultationCard | `components/ConsultationCard.tsx` | 54–64 | 12×12 | Secondary action link |
| 19 | FabricLibraryPreview | `components/materials/FabricLibraryPreview.tsx` | 72–79 | 14×14 | "Alle Stoffe ansehen" |
| 20 | HighlightCardsSection | `components/service/HighlightCardsSection.tsx` | 70–80 | 14×14 | CTA link |
| 21 | CrossLinkSection | `components/service/CrossLinkSection.tsx` | 35–44 | 14×14 | Cross-link button |
| 22 | ProcessChainSection | `components/service/ProcessChainSection.tsx` | 58–68 | 20×20 | Process flow arrow |
| 23 | kollektionen/[slug] | `app/kollektionen/[slug]/page.tsx` | 462–464 | 13×13 | "Materialien entdecken" |
| 24 | kollektionen/[slug] | `app/kollektionen/[slug]/page.tsx` | 549–550 | 12×12 | Service "Ansehen" link |
| 25 | produkte/[slug] | `app/produkte/[slug]/page.tsx` | 282–291 | 14×14 | "Anfrage senden" |
| 26 | produkte/[slug] | `app/produkte/[slug]/page.tsx` | 329–339 | 14×14 | Material link |
| 27 | produkte/[slug] | `app/produkte/[slug]/page.tsx` | 374–384 | 14×14 | Collection link |
| 28 | produktkategorien/[slug] | `app/produktkategorien/[slug]/page.tsx` | 242–252 | 14×14 | Materials link |
| 29 | produktkategorien/[slug] | `app/produktkategorien/[slug]/page.tsx` | 280–290 | 14×14 | Collection link |
| 30 | kataloge | `app/kataloge/page.tsx` | 188–198 | 14×14 | Service card link |
| 31 | kataloge/stoff-technische-daten | `app/kataloge/stoff-technische-daten/page.tsx` | 232–241 | 14×14 | Materials link |
| 32 | materialien | `app/materialien/page.tsx` | 364–366 | 12×12 | "Stoffe ansehen" |
| 33 | materialien | `app/materialien/page.tsx` | 420–421 | 20×20 | OceanCycle step arrow |
| 34 | materialien/technische-daten | `app/materialien/technische-daten/page.tsx` | 168–178 | 14×14 | Materials link |
| 35 | NERIO page | `app/nerio/page.tsx` | various | 14×14 | Multiple CTAs |

**SVG Path:** `M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5`

**Proposed CMS key:** `arrow-right` (group: `navigation`)

---

## 2. Left / Back Arrow Icons

| # | Component | File | Lines | Size | Purpose |
|---|-----------|------|-------|------|---------|
| 1 | neuigkeiten/[slug] | `app/neuigkeiten/[slug]/page.tsx` | 128–130 | 14×14 | "Zurück zu Neuigkeiten" |
| 2 | neuigkeiten/[slug] | `app/neuigkeiten/[slug]/page.tsx` | 211–213 | 14×14 | Static fallback back link |

**SVG Path:** `M19.5 12h-15m0 0l5.5 5.5M4.5 12l5.5-5.5`

**Proposed CMS key:** `arrow-left` (group: `navigation`)

---

## 3. Chevron Icons

| # | Component | File | Lines | Size | Purpose |
|---|-----------|------|-------|------|---------|
| 1 | Breadcrumbs | `components/Breadcrumbs.tsx` | 15–29 | 12×12 | Breadcrumb separator |
| 2 | Header | `components/Header.tsx` | 189–191 | 14×14 | Mobile nav chevron |
| 3 | Header | `components/Header.tsx` | 212–214 | 14×14 | Mobile nav chevron |

**SVG Path (Breadcrumbs):** `M9 18l6-6-6-6`
**SVG Path (Header):** `M8.25 4.5l7.5 7.5-7.5 7.5`

**Proposed CMS key:** `chevron-right` (group: `navigation`)

---

## 4. Scroll Indicator

| # | Component | File | Lines | Size | Purpose |
|---|-----------|------|-------|------|---------|
| 1 | HomepageHero | `components/homepage/HomepageHero.tsx` | 97–99 | 16×24 | Bounce scroll indicator |

**SVG Path:** `M8 3v14m0 0l-5-5m5 5l5-5`

**Proposed CMS key:** `scroll-down` (group: `navigation`)

---

## 5. Checkmark / Tick Icons

| # | Component | File | Lines | Size | Purpose |
|---|-----------|------|-------|------|---------|
| 1 | HomepageValueProps | `components/homepage/HomepageValueProps.tsx` | 40–42 | 28×28 | Fallback icon |
| 2 | CareListSection | `components/service/CareListSection.tsx` | 6–18 | 18×18 | Care checklist items |
| 3 | HighlightCardsSection | `components/service/HighlightCardsSection.tsx` | 41–52 | 18×18 | Highlight items |
| 4 | ProcessChainSection | `components/service/ProcessChainSection.tsx` | 87–99 | 16×16 | Process highlights |
| 5 | NERIO page | `app/nerio/page.tsx` | 394–406 | 16×16 | OceanCycle highlights |
| 6 | kollektionen/[slug] | `app/kollektionen/[slug]/page.tsx` | 477+ | 14×14 | Property highlights |
| 7 | produktkategorien/[slug] | `app/produktkategorien/[slug]/page.tsx` | 167–179 | 20×20 | Feature items |
| 8 | kataloge/stoff-technische-daten | `app/kataloge/stoff-technische-daten/page.tsx` | 40–55 | 18×18 | Mackintosh highlights |
| 9 | materialien | `app/materialien/page.tsx` | 183–195 | 18×18 | Benefits checkmarks |
| 10 | materialien/technische-daten | `app/materialien/technische-daten/page.tsx` | 139–151 | 18×18 | Highlights |

**SVG Path (polyline):** `20 6 9 17 4 12`
**SVG Path (path):** `M5 13l4 4L19 7`

**Proposed CMS key:** `checkmark` (group: `ui`)

---

## 6. Homepage Value Proposition Icons

| # | Key | Component | File | Lines | Purpose |
|---|-----|-----------|------|-------|---------|
| 1 | comfort | HomepageValueProps | `components/homepage/HomepageValueProps.tsx` | 16–19 | Sun/comfort icon |
| 2 | quality | HomepageValueProps | `components/homepage/HomepageValueProps.tsx` | 21–24 | Shield-check/quality |
| 3 | sustainability | HomepageValueProps | `components/homepage/HomepageValueProps.tsx` | 26–29 | Globe-leaf icon |
| 4 | design | HomepageValueProps | `components/homepage/HomepageValueProps.tsx` | 31–34 | Palette icon |

**Size:** 28×28, stroke-width 1.5

**Proposed CMS keys:** `value-comfort`, `value-quality`, `value-sustainability`, `value-design` (group: `homepage`)

---

## 7. Collection Benefits Icons

| # | Key | Component | File | Lines | Purpose |
|---|-----|-----------|------|-------|---------|
| 1 | sun | CollectionBenefitsSection | `components/service/CollectionBenefitsSection.tsx` | 11–15 | UV-beständig |
| 2 | droplet | CollectionBenefitsSection | `components/service/CollectionBenefitsSection.tsx` | 17–20 | Wasserabweisend |
| 3 | shield | CollectionBenefitsSection | `components/service/CollectionBenefitsSection.tsx` | 22–26 | Schimmelfest |
| 4 | star | CollectionBenefitsSection | `components/service/CollectionBenefitsSection.tsx` | 28–31 | 3 Jahre Garantie |

**Viewbox:** 32×32, stroke-width 1.2

**Proposed CMS keys:** `benefit-sun`, `benefit-droplet`, `benefit-shield`, `benefit-star` (group: `benefits`)

---

## 8. NERIO Promise Icons

| # | Key | Component | File | Lines | Purpose |
|---|-----|-----------|------|-------|---------|
| 1 | recycle | NERIO page | `app/nerio/page.tsx` | 49–55 | 50% Recycled |
| 2 | droplet | NERIO page | `app/nerio/page.tsx` | 57–61 | PFAS-free |
| 3 | sun | NERIO page | `app/nerio/page.tsx` | 63–73 | Solution-dyed |
| 4 | shield | NERIO page | `app/nerio/page.tsx` | 75–80 | Durability |

**Size:** 24×24, stroke-width 1.5–2

**Proposed CMS keys:** `nerio-recycle`, `nerio-droplet`, `nerio-sun`, `nerio-shield` (group: `nerio`)

---

## 9. Service Page Icons

| # | Key | Component | File | Lines | Purpose |
|---|-----|-----------|------|-------|---------|
| 1 | ruler | kataloge page | `app/kataloge/page.tsx` | 29–32 | Produktmaße |
| 2 | shield | kataloge page | `app/kataloge/page.tsx` | 36–40 | Pflege-Garantie |
| 3 | fabric | kataloge page | `app/kataloge/page.tsx` | 44–47 | Stoff-technische Daten |

**Size:** 24×24, stroke-width 1.5

**Proposed CMS keys:** `service-ruler`, `service-shield`, `service-fabric` (group: `service`)

---

## 10. Social Media Icons (Footer)

| # | Platform | File | Lines | Purpose |
|---|----------|------|-------|---------|
| 1 | Facebook | `components/Footer.tsx` | 330–332 | Social link |
| 2 | Instagram | `components/Footer.tsx` | 335–337 | Social link |
| 3 | Pinterest | `components/Footer.tsx` | 340–342 | Social link |
| 4 | YouTube | `components/Footer.tsx` | 345–347 | Social link |
| 5 | LinkedIn | `components/Footer.tsx` | 350–352 | Social link |

**Size:** 16×16, filled SVGs (not stroke-based)

**Proposed CMS keys:** `social-facebook`, `social-instagram`, `social-pinterest`, `social-youtube`, `social-linkedin` (group: `social`)

---

## 11. Contact Page Icons

| # | Icon | File | Lines | Purpose |
|---|------|------|-------|---------|
| 1 | Envelope | `app/kontakt/page.tsx` | 91–104 | Email contact |
| 2 | Globe | `app/kontakt/page.tsx` | 113–126 | Website link |
| 3 | Clock | `app/kontakt/page.tsx` | 140–153 | Business hours |

**Size:** 16×16, stroke-width 1.5, color pumpkin

**Proposed CMS keys:** `contact-email`, `contact-globe`, `contact-clock` (group: `contact`)

---

## 12. Download / Document Icons

| # | Icon | Component | File | Lines | Purpose |
|---|------|-----------|------|-------|---------|
| 1 | PDF document | DownloadCard | `components/DownloadCard.tsx` | 20–31 | Download card icon |
| 2 | Book/open-book | HomepageDownloads | `components/homepage/HomepageDownloads.tsx` | 12–16 | Download teaser icon |
| 3 | External link | kataloge page | `app/kataloge/page.tsx` | 53–55 | External link indicator |

**Proposed CMS keys:** `download-pdf`, `download-book`, `external-link` (group: `downloads`)

---

## 13. Fabric Library UI Icons

| # | Icon | Component | File | Lines | Purpose |
|---|------|-----------|------|-------|---------|
| 1 | Search | FabricLibrary | `components/materials/FabricLibrary.tsx` | 113–124 | Search input icon |
| 2 | Grid view | FabricLibrary | `components/materials/FabricLibrary.tsx` | 158–163 | Grid view toggle |
| 3 | Matrix view | FabricLibrary | `components/materials/FabricLibrary.tsx` | 175–180 | Matrix view toggle |
| 4 | Close/X | FabricDetailDrawer | `components/materials/FabricDetailDrawer.tsx` | 57–59 | Close drawer |
| 5 | Flip/swap | FabricPatternCard | `components/service/FabricPatternCard.tsx` | 62–74 | Flip card action |
| 6 | Close/X | FabricPatternCard | `components/service/FabricPatternCard.tsx` | 153–162 | Close card back |
| 7 | Image placeholder | FabricPatternCard | `components/service/FabricPatternCard.tsx` | 93–105 | Missing image fallback |

**Proposed CMS keys:** `ui-search`, `ui-grid`, `ui-matrix`, `ui-close`, `ui-flip`, `ui-image-placeholder` (group: `ui`)

---

## 14. Care Symbols

| # | Key | File | Lines | Purpose |
|---|-----|------|-------|---------|
| 1 | wash-30 | `components/service/CareSymbolsSection.tsx` | 10–16 | Wash at 30°C |
| 2 | bleach-dilute | `components/service/CareSymbolsSection.tsx` | 18–23 | Dilute bleach |
| 3 | no-dryer | `components/service/CareSymbolsSection.tsx` | 25–29 | No tumble dry |
| 4 | line-dry | `components/service/CareSymbolsSection.tsx` | 31–35 | Line dry |
| 5 | no-heat | `components/service/CareSymbolsSection.tsx` | 37–47 | No heat/iron |
| 6 | print | `components/service/CareCardPrint.tsx` | 10–24 | Print button |

**Proposed CMS keys:** `care-wash-30`, `care-bleach-dilute`, `care-no-dryer`, `care-line-dry`, `care-no-heat`, `care-print` (group: `care`)

---

## 15. Category Placeholder Icons (FabricPatternCard)

| # | Slug | File | Lines | Purpose |
|---|------|------|-------|---------|
| 1 | dekokissen | `components/service/FabricPatternCard.tsx` | 237–240 | Decorative pillow |
| 2 | hochlehner | `components/service/FabricPatternCard.tsx` | 244–247 | High-back chair |
| 3 | niedriglehner | `components/service/FabricPatternCard.tsx` | 251–254 | Low-back chair |
| 4 | sitzkissen | `components/service/FabricPatternCard.tsx` | 258–261 | Seat cushion |
| 5 | sitzpolster | `components/service/FabricPatternCard.tsx` | 265–267 | Seat upholstery |
| 6 | bankauflagen | `components/service/FabricPatternCard.tsx` | 271–274 | Bench pad |
| 7 | poufs | `components/service/FabricPatternCard.tsx` | 278–281 | Pouf |
| 8 | tischsets-tischlaeufer | `components/service/FabricPatternCard.tsx` | 285–289 | Table set |
| 9 | decken | `components/service/FabricPatternCard.tsx` | 293–296 | Blanket |
| 10 | (default) | `components/service/FabricPatternCard.tsx` | 301–302 | Fallback square |

**Proposed CMS keys:** `category-dekokissen`, `category-hochlehner`, `category-niedriglehner`, `category-sitzkissen`, `category-sitzpolster`, `category-bankauflagen`, `category-poufs`, `category-tischsets`, `category-decken` (group: `categories`)

---

## 16. NERIO Page Dual-CTA Card Icons

| # | Icon | File | Lines | Purpose |
|---|------|------|-------|---------|
| 1 | Fabric grid | `app/nerio/page.tsx` | ~460 | "Stoffe ansehen" card |
| 2 | Collection box | `app/nerio/page.tsx` | ~480 | "Collection ansehen" card |

**Proposed CMS keys:** `nerio-fabric-grid`, `nerio-collection-box` (group: `nerio`)

---

## 17. Decorative / CSS Patterns (NOT for CMS conversion)

| # | Pattern | File | Purpose |
|---|---------|------|---------|
| 1 | Diamond SVG data URI | `HomepageSustainability.tsx` | Background texture |
| 2 | Woven linear-gradient | `CollectionCtaSection.tsx` | Background texture |
| 3 | Hamburger menu bars | `Header.tsx` | CSS `<span>` bars, not SVG |
| 4 | Scroll indicator line | `HeroSection.tsx` | CSS gradient line |

**These should NOT be converted to CMS icons — they are decorative CSS patterns.**

---

## 18. Placeholder SVG Image Files

**Directory:** `public/images/placeholders/`

These are content placeholder images, not icons. They are referenced via `<Image>` components and data structures. They should remain as-is — not part of the CMS icon system.

| Subdirectory | Count | Purpose |
|--------------|-------|---------|
| categories/ | 9 | Product category images |
| collections/ | 7 | Collection gradient images |
| collections/hero/ | 7 | Collection hero images |
| detail/ | 7 | Fabric detail images |
| downloads/ | 4 | Download category images |
| hero/ | 2 | Homepage hero images |
| materials/ | 6 | Material quality images |
| nerio/ | 1 | NERIO story image |
| news/ | 3 | News article images |
| page-heroes/ | 11 | Page hero banner images |
| products/ | 17 | Product images |
| service/ | 6 | Service page images |
| subcategories/hero/ | 54 | Subcategory hero images |

**Total:** ~134 files — all are content images, not icons.

---

## Proposed CMS Icon Slot Groups

| Group | Slot Count | CMS-Convertible |
|-------|-----------|-----------------|
| navigation | 4 | Yes |
| ui | 7 | Yes |
| homepage | 4 | Yes |
| benefits | 5 (incl. fallback) | Yes |
| nerio | 6 | Yes |
| service | 3 | Yes |
| social | 5 | Yes |
| contact | 3 | Yes |
| downloads | 3 | Yes |
| care | 6 | Yes |
| categories | 10 | Yes |
| **Total** | **56** | |

---

## Icons NOT Recommended for CMS Conversion

1. **Decorative CSS patterns** (diamond, woven gradients) — not icons
2. **Hamburger menu** (CSS spans, not SVG) — structural UI
3. **Placeholder SVG image files** — content images, managed via MediaAsset
4. **Admin-only icons** (AdminShell NavIcon) — 20+ admin sidebar icons, not public

---

## Next Steps

1. Create `IconSlot` Prisma model
2. Create icon registry with all ~56 slots
3. Build `CmsIcon` component
4. Build admin UI at `/admin/icons`
5. Create backfill script
6. Convert all public components to use `CmsIcon`
