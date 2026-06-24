---
target: Mosaroma website — all public pages
total_score: 26
p0_count: 0
p1_count: 1
timestamp: 2026-06-24T08-45-04Z
slug: mosaroma-website-all-public-pages
---
# Design Critique: Mosaroma Website — All Public Pages (Post-Fix Re-assessment)

## Design Health Score

| # | Heuristic | Prior | Current | Key Issue |
|---|-----------|-------|---------|-----------|
| 1 | Visibility of System Status | 3 | **3** | Anchor navs still lack scroll-tracking active state |
| 2 | Match System / Real World | 3 | **3** | "Collection ansehen" fixed; sustainability stat contradiction new (38% = Chemie vs Energie) |
| 3 | User Control and Freedom | 2 | **2** | No back-to-top, no search, no sticky nav on long pages |
| 4 | Consistency and Standards | 3 | **3** | 24 off-token `bg-[#FAF8F5]` instances; Footer `bg-[#1a1a1a]` off-token |
| 5 | Error Prevention | 3 | **3** | Contact form: `noValidate` + no JS replacement; blanket `aria-invalid` |
| 6 | Recognition Rather Than Recall | 3 | **3** | Active nav state solid; anchor navs lack scroll-tracking |
| 7 | Flexibility and Efficiency | 2 | **2** | Skip-link is only keyboard accelerator; no search |
| 8 | Aesthetic and Minimalist Design | 3 | **3** | CTA variation improves closer diversity; section choreography still repetitive |
| 9 | Error Recovery | 2 | **2** | Global contact form error only; no per-field messages |
| 10 | Help and Documentation | 2 | **2** | No FAQ, no contextual help beyond contact info |
| **Total** | **26** | **26/40** | **Acceptable — upper band** |

**Score trajectory: 22 → 25 → 26 → 26 → 26/40 (stable)**

---

## Anti-Patterns Verdict

### LLM Assessment

**AI slop signal: Low.** The site has moved further from AI-template territory since the last critique. Key improvements:

- **CTA closer variation is genuine.** Three structurally distinct PageCta variants (dark/light/minimal) deployed across 10 pages with varied copy. The old identical-CTA-on-every-page pattern is broken.
- **"Collection ansehen" English string is fixed.** German language discipline is now consistent.
- **NerioAnchorNav anchor order fixed.** Matches page section order.
- **Garantie section is no longer underpowered.** Bold pumpkin full-width treatment with oversized "3" typography.

Remaining template signals:
- **Section choreography** still follows `accent-line → heading → paragraph → card grid` on most subpages. CMS-rendered service sections each get their own accent-line, meaning a single service page can stack 5-6 accent lines.
- **Background alternation** remains mechanical: white → cream → dark section → white → cream.
- **Trailing-period headline style** persists on virtually every h2 across the site.
- **PageCta light variant dominates**: 7 of 10 PageCta usages are `light`, 2 are `minimal`, 1 is `dark`. The variety exists but skews heavily toward one treatment.

### Deterministic Scan

**13 findings total: 0 in public files, 13 in admin-only files** (all `gray-on-color` in `components/admin/`). Public site remains detector-clean across all 36 rules. No new findings since last critique.

---

## Fix Verification (6 items checked)

### 1. Skip-to-Content link + main#main landmarks — FULLY RESOLVED
`Header.tsx:117-121`: Skip link with `href="#main"`, visually hidden via `-top-20`, revealed on `focus:top-3`, with focus ring. All 20 public page routes have `<main id="main">`. Comprehensive implementation.

### 2. CTA closer variation (PageCta) — EFFECTIVE, WITH CAVEATS
Three variants deployed:
- **dark** (anthracite bg, centered): über-uns
- **light** (cream bg, centered): homepage, produkte, ambiente, materialien, technische-daten, stoff-technische-daten, pflege-garantie
- **minimal** (white bg, horizontal layout, border-top): produktkategorien, produktmasse

**Assessment**: Light dominance (7/10) means the variation is more cosmetic than structural. Dark and light share identical layout (centered heading + paragraph + button row) and differ only in color. Minimal is genuinely different (side-by-side flex layout). The fix visibly reduces repetition — each page now has page-specific CTA copy — but a visitor browsing 3 pages still sees the same light-on-cream centered closer twice.

**Residual issue**: Homepage adjacent cream-on-cream is STILL PRESENT. HomepageNews (`bg-cream`) flows directly into PageCta light (`bg-cream`) with no visual separation.

### 3. Eyebrow cleanup — CONFIRMED
Dead eyebrow variables removed from homepage. 9 accent-line instances remain in page files + PageHero applies accent-line on all subpages. 8 additional service section components each add their own accent-line. Accent-line IS the brand's visual punctuation mark and is acceptable as identity, but the volume on CMS-driven service pages is high.

### 4. "Collection ansehen" English string — FIXED
No matches for "Collection ansehen" in the codebase. German "Kollektion ansehen" used consistently.

### 5. NerioAnchorNav anchor order — FIXED
Nav order (Story → Technologie → Fakten → Produkte → Beratung) now matches page section order.

### 6. Garantie section — FIXED
`pflege-garantie/page.tsx:206-232`: Bold pumpkin full-width section with oversized "3" typography and guarantee callout. No longer underpowered.

---

## What's Working

1. **Header is the best component on the site.** Scroll-aware transparency, logo inversion, active state with `aria-current="page"`, mobile focus trap with Escape key handling, body scroll lock, `motion-safe` transitions. Production-quality throughout.

2. **Typography system is disciplined.** Three-font rule consistently followed: Montserrat commands, Source Sans 3 narrates, Josefin Sans marks territory. No crossover violations found. `font-heading`, `font-body`, `font-accent` tokens used uniformly.

3. **NERIO page remains the strongest brand story.** Custom teal hero, differentiated layout (story+image, process cards, stat blocks on dark bg, video, table+image, product grid, dual-card CTA). Most layout variety of any page on the site.

4. **PageCta architecture is clean.** Three variants with correct semantic structure, responsive layout, and button-system integration. The component solves the right problem.

5. **CMS integration is thorough.** Contact details, catalog downloads, footer copyright, page hero content — all sourced from CMS with sensible fallbacks. `revalidate = 60` set consistently for ISR.

---

## Priority Issues

### [P1] No 404 page exists
**Category**: UX / Brand  
**Location**: Missing `app/not-found.tsx`  
**Impact**: Users hitting a broken link or typo see the default Next.js 404, which completely breaks the site's visual identity. For a premium brand, this is a credibility gap — it's the one page that signals "nobody thought about this."  
**Fix**: Create `app/not-found.tsx` with the site's design system (Header, Footer, brand typography, helpful navigation back to key pages).  
**Suggested command**: `/impeccable harden`

### [P2] Contact form has no per-field validation
**Category**: Accessibility / UX  
**Location**: `components/public/PublicContactForm.tsx:74,103`  
**Impact**: `noValidate` disables browser validation. After any server error, ALL required fields get `aria-invalid="true"` regardless of which field actually failed. No per-field error messages exist. Screen reader users hear "invalid" on correctly-filled fields. Keyboard-only users get no guidance on what specifically to fix.  
**WCAG**: 3.3.1 (Error Identification), 3.3.3 (Error Suggestion)  
**Fix**: Add client-side per-field validation on blur/submit. Show individual error messages with `aria-errormessage`. Only set `aria-invalid` on the field(s) that actually failed.  
**Suggested command**: `/impeccable harden kontakt`

### [P2] Sustainability stat contradiction between pages
**Category**: Content / Credibility  
**Location**: `app/page.tsx:127` vs `app/ueber-uns/page.tsx:49`  
**Impact**: Homepage says "38 % weniger Chemie" (less chemicals). Über-uns says "38 % weniger Energie" (less energy). A B2B buyer checking both pages will notice the contradiction, undermining the brand's credibility on sustainability claims.  
**Fix**: Verify the correct stat and make both pages consistent. Consider sourcing these values from CMS to prevent future divergence.  
**Suggested command**: `/impeccable clarify`

### [P2] Adjacent cream-on-cream on homepage (still open)
**Category**: Visual / Layout  
**Location**: `app/page.tsx:218` (PageCta light after HomepageNews)  
**Impact**: Two adjacent `bg-cream` sections with no visual boundary merge into an undifferentiated cream block. The CTA loses its "section boundary" impact.  
**Fix**: Either change the homepage PageCta to `variant="dark"` (creating a strong close like über-uns), or add a `border-t` divider, or insert a white-bg section between them.  
**Suggested command**: `/impeccable layout`

### [P2] 24 hardcoded `bg-[#FAF8F5]` instead of `bg-cream` token
**Category**: Consistency / Maintainability  
**Location**: `app/produkte/[slug]/page.tsx` (5), `components/collections/AmbienteTeaser.tsx` (4), `components/materials/*` (9), `components/measurements/*` (2), and others  
**Impact**: Same color, different notation. If the cream token value ever changes, these 24 instances won't update. Creates maintenance burden and signals inconsistency in the design system.  
**Fix**: Replace all `bg-[#FAF8F5]` with `bg-cream`.  
**Suggested command**: `/impeccable polish`

### [P3] Section choreography monotony (structural, unchanged)
**Category**: Design / Anti-pattern  
**Location**: All subpages via PageHero + service section components  
**Impact**: The `accent-line → eyebrow → heading → paragraph → card grid` structure repeats across every section of every page. CMS-rendered service pages stack 5-6 accent lines in sequence. Breaking 2-3 sections with genuinely different layouts (full-bleed imagery, editorial splits, pull quotes) would have more impact than any single component fix.  
**Suggested command**: `/impeccable layout`

### [P3] NerioAnchorNav + MaterialAnchorNav lack scroll-tracking
**Category**: UX  
**Location**: `components/nerio/NerioAnchorNav.tsx`, `components/materials/MaterialAnchorNav.tsx`  
**Impact**: Anchor navs never highlight the current section during scroll. Users lose orientation on long pages.  
**Fix**: Add IntersectionObserver for active section highlighting.  
**Suggested command**: `/impeccable animate nerio`

### [P3] Footer off-token `bg-[#1a1a1a]`
**Category**: Consistency  
**Location**: `components/Footer.tsx:129`  
**Impact**: Footer CTA bar uses `bg-[#1a1a1a]` while the main footer uses `bg-anthracite` (#2D2D2D). Two near-black backgrounds coexist without a named token. HomepageSustainability uses `bg-[#1a2e1a]` (forest-deep, also off-token).  
**Fix**: Create a named token for the near-black or use `bg-anthracite` consistently.  
**Suggested command**: `/impeccable polish`

### [P3] Trailing-period headline style on every h2
**Category**: Design / Voice  
**Location**: Across all pages (homepage fallback titles, subpage headings)  
**Impact**: "Design trifft Performance." / "Was uns antreibt." / "Kollektionen." on virtually every h2. Once is voice; everywhere is tic. Removing the period from 60% of headings would make the remaining ones feel more intentional.  
**Suggested command**: `/impeccable typeset`

---

## Persona Red Flags

### Jordan (First-Timer B2B buyer)
- Homepage hero "Design trifft Performance" is confident but product-agnostic — Jordan doesn't know what Mosaroma sells until reading the sub-headline.
- No "Preise auf Anfrage" prompt anywhere on the site. B2B buyers expect pricing context; the absence creates uncertainty about whether to contact or look elsewhere.
- Sustainability stats contradict between pages — a detail-oriented buyer will notice.

### Sam (Accessibility-Dependent User)
- Contact form marks ALL required fields as `aria-invalid` on any error, regardless of which field failed. Misleading screen reader feedback.
- No per-field error messages — only a global banner. Screen reader users can't identify which field needs correction.
- Missing `aria-labelledby` on homepage `<section>` elements. Screen reader landmark navigation shows unlabeled sections.
- Default Next.js 404 page breaks screen reader navigation expectations (no site landmarks, no header/footer).

### Casey (Mobile User at trade show)
- NerioAnchorNav has no active state on mobile — disorienting on a long scroll.
- Homepage at 9 sections is heavy mobile scrolling with no skip-to-section affordance.
- No `:active` pseudo-class on `btn-primary` — mobile users don't see button press feedback.

---

## Cognitive Load Assessment

**3 / 8 items failing — moderate cognitive load** (unchanged)

Failures:
1. **Single focus**: Homepage presents 6+ competing destinations before the footer.
2. **Section scannability**: Many body paragraphs have no sub-headings, no bold pull quotes, no scannable structure.
3. **Working memory**: Sustainability stats appear on two pages with contradictory values, requiring the user to reconcile conflicting information.

Passes: heading hierarchy, button label specificity, paragraph line length, color differentiation, interaction pattern consistency.

---

## Minor Observations

- `MaterialAnchorNav.tsx:16-19`: Four commented-out routes remain with TODO. Nav renders links to pages that don't exist yet.
- `HomepageSustainability.tsx:28`: Diamond grid texture at `opacity-[0.04]` is effectively invisible. Either raise to 0.08+ or remove.
- `HomepageCollections.tsx:52`: "View all" card is bespoke JSX, not a CollectionCard variant — maintenance divergence risk.
- `NerioVideoSection.tsx:54`: Play button uses `bg-[#FAF8F5]/90 backdrop-blur-sm rounded-full` — rounded element on a sharp-edge brand site. Intentional for play buttons (functional affordance), but worth noting.
- `CollectionCard` color swatches (`kollektionen/[slug]/page.tsx:340-344`): Mood colors have `title={hex}` but no human-readable `aria-label`.
- `kataloge/page.tsx`: No PageCta closer — page ends abruptly after service cards. Conversion gap.
- `produktkategorien/page.tsx:30-33`: Fallback description uses ASCII dashes and transliterated umlauts ("fuer", "Aussenbereich"), suggesting an un-corrected legacy string.

---

## Questions to Consider

1. **Should the sustainability stats be CMS-sourced?** The current hardcoded contradiction (Chemie vs Energie) will persist until someone manually fixes both files. A single CMS field for sustainability stats would prevent divergence.

2. **What would breaking ONE section out of the `accent-line → heading → paragraph → cards` template look like?** A full-bleed textile-in-context photograph dividing two card grids, a pull quote from a hospitality partner, or an asymmetric text+image editorial block would disrupt the rhythm more than any component refinement.

3. **Is the minimal PageCta variant underused?** It's the most structurally different variant (horizontal layout, lighter weight) but only appears on 2 of 10 pages. Data-light pages like product categories and catalog subpages could benefit from the minimal treatment instead of another centered light closer.
