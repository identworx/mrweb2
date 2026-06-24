---
target: Mosaroma website — all public pages (post-fix re-audit)
total_score: 28
prior_score: 26
p0_count: 0
p1_count: 0
p2_count: 3
timestamp: 2026-06-24T16-30-00Z
slug: mosaroma-public-reaudit
---
# Design Critique: Mosaroma Website — Public Re-Audit

## Design Health Score

| # | Heuristic | Prior | Current | Delta | Key Issue |
|---|-----------|-------|---------|-------|-----------|
| 1 | Visibility of System Status | 3 | **3** | — | Anchor navs still lack scroll-tracking active state |
| 2 | Match System / Real World | 3 | **3** | — | Sustainability stat contradiction resolved; no remaining real-world mismatches |
| 3 | User Control and Freedom | 2 | **2** | — | No back-to-top, no search; 404 page now provides recovery path |
| 4 | Consistency and Standards | 3 | **3** | — | 24 off-token cream values fixed; Footer `bg-[#1a1a1a]` + Nerio hardcoded colors remain |
| 5 | Error Prevention | 3 | **4** | +1 | Per-field form validation with German messages, proper aria-invalid, focus management |
| 6 | Recognition Rather Than Recall | 3 | **3** | — | Active nav state solid; anchor navs lack scroll-tracking |
| 7 | Flexibility and Efficiency | 2 | **2** | — | Skip-link is only keyboard accelerator; no search |
| 8 | Aesthetic and Minimalist Design | 3 | **3** | — | Homepage cream-on-cream fixed; section choreography still repetitive |
| 9 | Error Recovery | 2 | **3** | +1 | Per-field error messages + branded 404 page with navigation |
| 10 | Help and Documentation | 2 | **2** | — | No FAQ, no contextual help beyond contact info |
| **Total** | **26** | **28/40** | **+2** | **Good — lower band** |

**Score trajectory: 22 → 25 → 26 → 26 → 26 → 28/40**

---

## Fix Verification (5 items checked)

### 1. Branded 404 page — FULLY RESOLVED

`app/not-found.tsx` is a clean, brand-conformant implementation:
- Uses `getPublicLayoutData()` for Header/Footer (consistent with all public pages)
- Full design token usage: `font-heading`, `font-body`, `font-accent`, `text-anthracite`, `text-text-gray`, `text-text-muted`, `bg-cream`, `btn-primary`
- `<main id="main">` landmark present (skip-link target)
- Proper heading hierarchy: single `<h1>`
- `<nav aria-label="Weitere Seiten">` wraps secondary links
- Correct links: /kollektionen, /materialien, /kataloge, /kontakt (no /produkte)
- No unnecessary imports, no `"use client"`, minimal server component
- German copy is user-friendly and empathetic

**Assessment**: Production-quality. Closes the P1 gap from the previous audit completely.

### 2. Contact form per-field validation — FULLY RESOLVED

`components/public/PublicContactForm.tsx` now has comprehensive accessible validation:
- **Per-field `validateField()` function** with type-aware German messages (6 distinct messages)
- **Submit-then-blur pattern**: All fields validate on submit; blur only re-validates already-errored fields (prevents premature error display)
- **`aria-invalid`**: Per-field, `error ? true : undefined` — only set on actually invalid fields (was blanket before)
- **`aria-describedby`**: Dynamically composed from `${name}-error` + `${name}-help` IDs
- **Focus management**: First invalid field focused on submit via `elements.namedItem()`
- **Visual cues**: `ring-1 ring-red-400` on invalid inputs, red error text below each field
- **Consent checkbox**: Properly labeled, validated, `aria-invalid` on the checkbox itself
- **SELECT fields**: Empty default option `"Bitte wählen"`, type-specific error message
- **`noValidate`**: Present (disables inconsistent browser bubbles), fully replaced by custom JS
- **`role="alert"`** on global server error banner, **`role="status"`** on success message
- **Honeypot**: `aria-hidden="true"` + `tabIndex={-1}` (hidden from assistive tech)

**Assessment**: Thorough implementation. WCAG 3.3.1 (Error Identification), 3.3.3 (Error Suggestion), and 1.3.1 (Info and Relationships) all addressed. Screen reader experience is now complete: labels, required state, invalid state, error descriptions, focus management.

### 3. Sustainability stats consistency — FULLY RESOLVED

All locations now use identical values:

| Stat | Value | Verified in |
|------|-------|-------------|
| weniger Wasser | 42 % | `app/page.tsx:126`, `app/ueber-uns/page.tsx:48`, `prisma/seed.ts:405`, `scripts/backfill-homepage-sections.ts:154` |
| weniger Chemie | 38 % | `app/page.tsx:127`, `app/ueber-uns/page.tsx:49`, `prisma/seed.ts:406`, `scripts/backfill-homepage-sections.ts:160` |
| Solarstrom | 71 % | `app/page.tsx:128`, `app/ueber-uns/page.tsx:50`, `prisma/seed.ts:407`, `scripts/backfill-homepage-sections.ts:166` |

No contradictions remain. The old "38 % weniger Energie" on the about page was corrected to "38 % weniger Chemie" in commit `0603cf9`.

### 4. Hardcoded cream backgrounds — FULLY RESOLVED

All 24 `bg-[#FAF8F5]` instances replaced with `bg-cream` across 12 files in commit `2f967aa`. Zero remaining instances in source code (4 references remain in `.impeccable/critique/` audit files only, which is expected).

Files cleaned: `app/produkte/[slug]/page.tsx` (5), `components/collections/AmbienteTeaser.tsx` (4), `components/homepage/HomepageCollections.tsx` (1), `components/nerio/NerioVideoSection.tsx` (2, including `/90` opacity variant), `components/measurements/MeasurementImageCard.tsx` (1), `components/measurements/BenchMeasurementCard.tsx` (1), `components/materials/FabricDetailDrawer.tsx` (2), `components/materials/FabricMatrixView.tsx` (3), `components/materials/FabricSwatchCard.tsx` (2), `components/materials/FabricLibraryPreview.tsx` (1), `components/materials/FabricLibrary.tsx` (1), `components/products/ProductImageFrame.tsx` (1).

### 5. Homepage cream-on-cream — FULLY RESOLVED

Homepage PageCta changed from `variant="light"` (bg-cream) to `variant="minimal"` (bg-white with border-t) in commit `2f967aa`.

Current homepage background sequence: Hero (image) → cream → white → cream → dark green → white → cream → **white** (PageCta minimal). No adjacent same-background collisions.

---

## What's Working

1. **Header remains the strongest component.** Scroll-aware transparency, logo inversion, `aria-current="page"`, mobile focus trap with Escape, body scroll lock, `motion-safe` transitions. Unchanged and production-quality.

2. **Typography system is disciplined.** Three-font rule (Montserrat/Source Sans 3/Josefin Sans) consistently followed. No crossover violations. `font-heading`, `font-body`, `font-accent` tokens used uniformly across all pages.

3. **Contact form is now a model implementation.** The validate-on-submit + re-validate-on-blur pattern with per-field German messages, proper ARIA attributes, and focus management is best-in-class for a CMS-driven form.

4. **404 page is brand-conformant.** Uses the exact same design tokens and layout structure as every other page. Navigation links guide users to the most useful destinations.

5. **Design token consistency significantly improved.** The cream token cleanup eliminated the largest category of off-token values. The remaining off-token backgrounds are edge cases (Footer near-black, Nerio-specific teal, forest-deep sustainability).

6. **PageCta component architecture is solid.** Three structurally distinct variants, page-specific copy across all 10 usages, no more cream-on-cream adjacency on homepage.

7. **CMS integration with fallback pattern.** Homepage, page heroes, contact details, downloads — all CMS-sourced with hardcoded fallbacks. `revalidate = 60` consistent for ISR.

---

## Remaining Issues

### [P2] Section choreography monotony (unchanged, structural)
**Category**: Design / Anti-pattern
**Location**: All subpages via PageHero + service section components
**Impact**: The `accent-line → eyebrow → heading → paragraph → card grid` structure repeats across every section. CMS-rendered service pages stack 5-6 accent lines in sequence. 20 files contain `accent-line` references. Breaking 2-3 sections with genuinely different layouts (full-bleed imagery, editorial splits, pull quotes) would have more impact than any component refinement.
**Note**: This is a structural/architectural issue requiring layout redesign, not a bug fix. Deferring is reasonable if the current visual quality is acceptable for launch.
**Suggested command**: `/impeccable layout`

### [P2] NerioAnchorNav + MaterialAnchorNav lack scroll-tracking (unchanged)
**Category**: UX
**Location**: `components/nerio/NerioAnchorNav.tsx`, `components/materials/MaterialAnchorNav.tsx`
**Impact**: Anchor navs never highlight the current section during scroll. Users lose orientation on long pages (Nerio page has 7 sections, Materialien has 5).
**Fix**: Add IntersectionObserver for active section highlighting.
**Suggested command**: `/impeccable animate nerio`

### [P2] PageCta variant distribution skews light (6/3/1)
**Category**: Design / Repetition
**Location**: 10 pages with PageCta
**Impact**: 6 pages use `light`, 3 use `minimal`, 1 uses `dark`. A visitor browsing 3 pages will likely see the same cream-background centered closer twice. Shifting 2-3 more pages to `minimal` or `dark` would increase perceived variety.
**Distribution**:
- **light** (6): produkte/[slug], ambiente, stoff-technische-daten, technische-daten, materialien, pflege-garantie
- **minimal** (3): homepage, produktkategorien/[slug], produktmasse
- **dark** (1): ueber-uns
**Suggested command**: `/impeccable polish`

### [P3] Footer off-token `bg-[#1a1a1a]` (unchanged)
**Category**: Consistency
**Location**: `components/Footer.tsx:129`
**Impact**: Footer CTA bar uses `bg-[#1a1a1a]` (near-black) while the main footer uses `bg-anthracite` (#2D2D2D). Two near-black backgrounds coexist without a named token.
**Suggested command**: `/impeccable polish`

### [P3] Remaining hardcoded hex backgrounds in public components
**Category**: Consistency
**Locations**:
- `components/homepage/HomepageSustainability.tsx:26`: `bg-[#1a2e1a]` (forest-deep, named in DESIGN.md but no Tailwind token)
- `components/nerio/NerioVideoSection.tsx:202,243`: `bg-[#0C3D40]`, `bg-[#0C3D40]/90` (Nerio teal)
- `components/measurements/BenchMeasurementCard.tsx:35`: `bg-[#FDFCFB]` (near-white, distinct from cream)
- `components/materials/FabricMatrixView.tsx:79`: `bg-[#FDFCFB]` (alternating row)
- `components/Header.tsx:27`: `bg-[#2F7195]` (blue badge variant)
- `app/nerio/page.tsx:385`: `bg-[#1B6B6D]/[0.06]` (teal highlight)
**Impact**: Low — most are page-specific or functional. The Nerio teal and forest-deep green are intentional brand colors that could become named tokens for cleanliness.
**Suggested command**: `/impeccable polish`

### [P3] Trailing-period headline style on every h2 (unchanged)
**Category**: Design / Voice
**Location**: Across all pages
**Impact**: "Design trifft Performance." / "Was uns antreibt." / "Kollektionen." on virtually every h2. Once is voice; everywhere is tic.
**Suggested command**: `/impeccable typeset`

### [P3] kataloge/page.tsx has no PageCta closer (unchanged)
**Category**: UX / Conversion
**Location**: `app/kataloge/page.tsx`
**Impact**: Page ends abruptly after service cards. Conversion gap — no CTA guides users to the next step.
**Suggested command**: `/impeccable polish`

---

## New Issues

**No new issues introduced by the fixes.** All five changes (404 page, form validation, sustainability stats, cream token cleanup, cream-on-cream fix) are clean implementations with no regressions.

Verified:
- Build passes without errors after all changes
- No new `bg-[#FAF8F5]` instances introduced
- 404 page correctly uses existing design tokens without new components
- Contact form validation doesn't interfere with honeypot or submit flow
- Homepage section sequence has no adjacent same-background collisions
- `bg-cream/90` opacity variant in NerioVideoSection works correctly

---

## Cognitive Load Assessment

**2 / 8 items failing — low-moderate cognitive load** (improved from 3/8)

Resolved:
- ~~Working memory: Sustainability stats contradicting between pages~~ — now consistent

Remaining failures:
1. **Single focus**: Homepage presents 6+ competing destinations before the footer
2. **Section scannability**: Many body paragraphs have no sub-headings, no bold pull quotes, no scannable structure

---

## Comparison: 26/40 → 28/40

| Area | Prior Finding | Status | Impact |
|------|--------------|--------|--------|
| 404 page missing | P1 — default Next.js 404 breaks brand | **RESOLVED** | H9 +1 |
| Contact form no per-field validation | P2 — blanket aria-invalid, no error messages | **RESOLVED** | H5 +1 |
| Sustainability stat contradiction | P2 — "Chemie" vs "Energie" on two pages | **RESOLVED** | H2 improved (stayed 3) |
| 24 hardcoded cream backgrounds | P2 — bg-[#FAF8F5] instead of bg-cream | **RESOLVED** | H4 improved (stayed 3) |
| Homepage cream-on-cream | P2 — News + PageCta both bg-cream | **RESOLVED** | H8 improved (stayed 3) |
| Section choreography monotony | P3 — accent-line stacking | Unchanged | Structural |
| Anchor nav scroll-tracking | P3 — no active section highlight | Unchanged | Unchanged |
| Footer off-token near-black | P3 — bg-[#1a1a1a] | Unchanged | Minor |
| Trailing-period headlines | P3 — every h2 ends with period | Unchanged | Minor |

**Net result**: 3 P2s resolved, 1 P1 resolved. 0 P0/P1 remaining. Score moved from Acceptable (upper band) to Good (lower band).

---

## Recommendation

**Option 2: Public-UX/Design einfrieren nach 1-2 optionalen Rest-Fixes.**

The public site is now at 28/40 ("Good"), with:
- **Zero P0 or P1 issues** remaining
- **Zero regressions** from the fixes
- All accessibility-critical items resolved (form validation, ARIA, 404 recovery, skip-link)
- Design token consistency significantly improved

The remaining P2s (section choreography, anchor scroll-tracking, CTA variant balance) are structural/architectural issues that would require layout redesign or significant component work — not quick fixes. They improve the experience but are not blockers.

**If 1-2 more quick fixes are desired before freeze:**
1. **NerioAnchorNav scroll-tracking** (P2) — IntersectionObserver addition, contained to one component, high UX impact on the most complex page
2. **kataloge/page.tsx missing PageCta** (P3) — one-line addition, closes a conversion gap

**After those (or now), freeze is justified.** The public site is brand-conformant, accessible (WCAG AA), consistent in design tokens, and free of credibility-damaging issues. Further improvements would be polish, not necessity.
