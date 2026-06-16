# Icon Audit — Mosaroma Public Website

**Date:** 2026-06-16
**Status:** VOLLSTÄNDIG — alle öffentlich sichtbaren Icons CMS-austauschbar

## Zusammenfassung

- **IconSlots insgesamt:** 56
- **Gruppen:** 11 (navigation, ui, homepage, benefits, nerio, service, social, contact, downloads, care, categories)
- **Öffentlich sichtbare Inline-SVGs:** 0 verbleibend
- **Admin-interne Inline-SVGs:** ~30 (bewusst nicht konvertiert)
- **Technische Diagramme (SVG):** 1 Datei (MeasurementDrawing.tsx) — kein Icon, nicht konvertiert
- **Externe Icon-Bibliotheken:** Keine (kein lucide-react, kein heroicons)

---

## Konvertierte Dateien (vollständig)

### Navigation & Pfeile (arrow-right, arrow-left, chevron-right, scroll-down)

| Datei | Icon-Typ | CMS-Key | Status |
|-------|----------|---------|--------|
| `components/HeroSection.tsx` | Pfeil rechts (CTA) | `arrow-right` | ✅ umgestellt |
| `components/homepage/HomepageHero.tsx` | Pfeil rechts (CTA) + Scroll-Indicator | `arrow-right`, `scroll-down` | ✅ umgestellt |
| `components/homepage/HomepageValueProps.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/homepage/HomepageImageTextFeature.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/homepage/HomepageCollections.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/homepage/HomepageSustainability.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/homepage/HomepageDownloads.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/homepage/HomepageNews.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/SectionTeaser.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/Footer.tsx` | Pfeil rechts + Social Icons | `arrow-right`, `social-*` | ✅ umgestellt |
| `components/Header.tsx` | Chevron rechts (Mobile Nav) | `chevron-right` | ✅ umgestellt |
| `components/Breadcrumbs.tsx` | Chevron rechts (Breadcrumb) | `chevron-right` | ✅ umgestellt |
| `components/NewsCard.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/CollectionCard.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/CategoryCard.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/ProductCard.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/CollectionProductCard.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/ConsultationCard.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `components/materials/FabricLibraryPreview.tsx` | Pfeil rechts | `arrow-right` | ✅ umgestellt |
| `app/neuigkeiten/[slug]/page.tsx` | Pfeil links | `arrow-left` | ✅ umgestellt |

### Häkchen (checkmark)

| Datei | CMS-Key | Status |
|-------|---------|--------|
| `components/service/CareListSection.tsx` | `checkmark` | ✅ umgestellt |
| `components/service/HighlightCardsSection.tsx` | `checkmark`, `arrow-right` | ✅ umgestellt |
| `components/service/ProcessChainSection.tsx` | `checkmark`, `arrow-right` | ✅ umgestellt |
| `components/service/CrossLinkSection.tsx` | `arrow-right` | ✅ umgestellt |
| `app/nerio/page.tsx` | `checkmark` | ✅ umgestellt |
| `app/kollektionen/[slug]/page.tsx` | `checkmark`, `arrow-right` | ✅ umgestellt |
| `app/produktkategorien/[slug]/page.tsx` | `checkmark`, `arrow-right` | ✅ umgestellt |
| `app/materialien/page.tsx` | `checkmark`, `arrow-right` | ✅ umgestellt |
| `app/materialien/technische-daten/page.tsx` | `checkmark`, `arrow-right` | ✅ umgestellt |
| `app/kataloge/stoff-technische-daten/page.tsx` | `checkmark`, `arrow-right` | ✅ umgestellt |

### Homepage Value-Proposition Icons

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `components/homepage/HomepageValueProps.tsx` | `value-comfort`, `value-quality`, `value-sustainability`, `value-design` | ✅ umgestellt |

### Collection Benefits

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `components/service/CollectionBenefitsSection.tsx` | `benefit-sun`, `benefit-droplet`, `benefit-shield`, `benefit-star`, `benefit-fallback` | ✅ umgestellt |
| `app/kollektionen/page.tsx` | (über CollectionBenefitsSection) | ✅ umgestellt |

### NERIO Icons

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `app/nerio/page.tsx` | `nerio-recycle`, `nerio-droplet`, `nerio-sun`, `nerio-shield`, `nerio-fabric-grid`, `nerio-collection-box` | ✅ umgestellt |

### Service-Seiten Icons

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `app/kataloge/page.tsx` | `service-ruler`, `service-shield`, `service-fabric`, `external-link`, `arrow-right` | ✅ umgestellt |

### Social Media Icons

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `components/Footer.tsx` | `social-facebook`, `social-instagram`, `social-pinterest`, `social-youtube`, `social-linkedin` | ✅ umgestellt |

### Kontakt Icons

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `app/kontakt/page.tsx` | `contact-email`, `contact-globe`, `contact-clock` | ✅ umgestellt |

### Download/Dokument Icons

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `components/DownloadCard.tsx` | `download-pdf` | ✅ umgestellt |
| `components/homepage/HomepageDownloads.tsx` | `download-book` | ✅ umgestellt |

### Stoff-UI Icons

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `components/materials/FabricLibrary.tsx` | `ui-search`, `ui-grid`, `ui-matrix` | ✅ umgestellt |
| `components/materials/FabricDetailDrawer.tsx` | `ui-close` | ✅ umgestellt |
| `components/materials/FabricSwatchCard.tsx` | `arrow-right`, `ui-image-placeholder` | ✅ umgestellt |
| `components/materials/FabricMatrixView.tsx` | `checkmark` | ✅ umgestellt |

### Pflege-Symbole

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `components/service/CareSymbolsSection.tsx` | `care-wash-30`, `care-bleach-dilute`, `care-no-dryer`, `care-line-dry`, `care-no-heat` | ✅ umgestellt |
| `components/service/CareCardPrint.tsx` | `care-print` | ✅ umgestellt |
| `app/kataloge/pflege-garantie/page.tsx` | (über CareSymbolsSection + CareCardPrint) | ✅ umgestellt |

### Kategorie-Placeholder Icons (FabricPatternCard)

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `components/service/FabricPatternCard.tsx` | `category-dekokissen`, `category-hochlehner`, `category-niedriglehner`, `category-sitzkissen`, `category-sitzpolster`, `category-bankauflagen`, `category-poufs`, `category-tischsets`, `category-decken`, `category-default`, `ui-flip`, `ui-close`, `ui-image-placeholder` | ✅ umgestellt |

### Measurement-Komponenten

| Datei | CMS-Keys | Status |
|-------|----------|--------|
| `components/measurements/CustomSizeCta.tsx` | `arrow-right` | ✅ umgestellt |
| `components/measurements/MaterialQualityBox.tsx` | `arrow-right` | ✅ umgestellt |

---

## Nicht konvertierte SVGs

### 1. Technische Zeichnungen (KEIN Icon)

| Datei | Beschreibung | Begründung |
|-------|-------------|------------|
| `components/measurements/MeasurementDrawing.tsx` | SVG-Diagramme für Produktmaße (Kissen, Polster, Hochlehner etc.) mit Bemaßungslinien, Pfeilen und Textlabels. 11 separate Drawing-Funktionen. | Keine Icons, sondern maßstabsgetreue technische Zeichnungen mit dynamischen Koordinaten, Dimensionslinien und Textannotationen. Nicht sinnvoll über CMS-Icon-System austauschbar. |

### 2. Admin-interne SVGs (nicht öffentlich sichtbar)

| Datei | Anzahl SVGs | Beschreibung |
|-------|-------------|-------------|
| `components/admin/AdminShell.tsx` | ~20 | Sidebar-Navigation-Icons |
| `components/admin/ProductAdminList.tsx` | ~2 | Produkt-Admin-Aktionen |
| `components/admin/media/MediaDetailsPanel.tsx` | ~2 | Media-Detail-Aktionen |
| `components/admin/MediaPickerModal.tsx` | ~3 | Media-Picker-UI |
| `components/admin/media/MediaBrowser.tsx` | ~3 | Media-Browser-UI |
| `components/admin/ProductGalleryEditor.tsx` | ~2 | Galerie-Editor-UI |
| `components/admin/RichTextEditor.tsx` | ~5 | Rich-Text-Toolbar |
| `components/admin/MeasurementEditForm.tsx` | ~2 | Maß-Formular |
| `components/admin/MediaSearchInput.tsx` | ~1 | Such-Icon |
| `components/admin/MediaPickerField.tsx` | ~1 | Media-Picker-Feld |
| `app/admin/measurements/page.tsx` | ~2 | Admin-Maße-Seite |

**Begründung:** Admin-Seiten sind nur für authentifizierte Benutzer sichtbar. Sie sind nicht Teil der öffentlichen Website und unterliegen nicht der Anforderung "alle öffentlich sichtbaren Icons CMS-austauschbar".

### 3. CSS-Dekorationsmuster (KEIN Icon)

| Datei | Typ | Begründung |
|-------|-----|------------|
| `components/homepage/HomepageSustainability.tsx` | Diamond SVG Data-URI als Hintergrundtextur | Dekoratives CSS-Muster |
| `components/service/CollectionCtaSection.tsx` | Gewebte Linear-Gradient-Textur | Dekoratives CSS-Muster |
| `components/Header.tsx` | Hamburger-Menü (CSS `<span>` Balken) | Strukturelles UI, kein SVG |

---

## Icon-Gruppen Übersicht (final)

| Gruppe | Slots | Beschreibung |
|--------|-------|-------------|
| navigation | 4 | Pfeile, Chevrons, Scroll-Indicator |
| ui | 8 | Suche, Grid, Close, Flip, Placeholder, External Link, Checkmark |
| homepage | 4 | Wertversprechen-Icons |
| benefits | 5 | Collection-Benefits (Sonne, Tropfen, Schild, Stern, Fallback) |
| nerio | 6 | NERIO-Seite (Recycling, Tropfen, Sonne, Schild, Stoff-Grid, Box) |
| service | 3 | Service-Seiten (Lineal, Schild, Stoff) |
| social | 5 | Footer Social-Media |
| contact | 3 | Kontaktseite (E-Mail, Globus, Uhr) |
| downloads | 2 | Download-Karten (PDF, Buch) |
| care | 6 | Pflege-Symbole (5 Waschsymbole + Druck-Icon) |
| categories | 10 | Produktkategorie-Platzhalter (9 + Fallback) |
| **Gesamt** | **56** | |
