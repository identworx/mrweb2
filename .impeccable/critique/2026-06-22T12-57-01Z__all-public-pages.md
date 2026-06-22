---
target: all public pages
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-06-22T12-57-01Z
slug: all-public-pages
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No active-state in header nav for current page |
| 2 | Match System / Real World | 4 | n/a — excellent German B2B language throughout |
| 3 | User Control and Freedom | 3 | No back-to-top on long pages (NERIO has 10+ sections) |
| 4 | Consistency and Standards | 3 | Section padding mix (explicit values vs `.section-padding` class) |
| 5 | Error Prevention | 2 | Contact form: required attrs only, no inline validation |
| 6 | Recognition Rather Than Recall | 3 | No search functionality |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts, no compare/search for B2B buyers |
| 8 | Aesthetic and Minimalist Design | 3 | Accent-line/eyebrow monotony on subpages dampens the premium feel |
| 9 | Error Recovery | 2 | Basic 404 handling, no suggestion mechanism |
| 10 | Help and Documentation | 2 | No FAQ, no glossary, no contextual tooltips |
| **Total** | | **27/40** | **Acceptable → Good boundary** |

**Change: 22 → 27 (+5).** Real improvement from skip-link, landmarks, CTA variants, animation fix, DataRow extraction. The remaining gap is dominated by section-opener monotony and missing conversion moments.

---

## Anti-Patterns Verdict

**LLM assessment:** The single biggest "AI made this" tell is the accent-line + eyebrow + heading pattern repeated 35+ times across public pages and components. On the NERIO page alone: 6 consecutive sections with this opener. On /materialien: 4 instances. On /kollektionen/[slug]: 4 instances. The homepage was cleaned (only HomepageCollections retains it) but every subpage still follows the identical section choreography. A real editorial designer would break this rhythm.

Beyond the eyebrow pattern: the strict ABAB background alternation (white → cream → white → cream → dark CTA) and the identical section structure (eyebrow → heading → paragraph → grid) across all pages reinforces the template impression.

**What is NOT slop:** The three-font system is genuinely distinctive. The zero-border-radius commitment is unusual and memorable. The pumpkin-only accent discipline is strong. The pflege-garantie page (numbered steps, bold "3 Jahre" pumpkin guarantee section) shows what the site can be when it breaks the formula.

**Deterministic scan:** 0 findings on public pages. All 13 detector findings are in `components/admin/` (gray-on-color warnings) — out of scope for this public-site critique.

---

## Overall Impression

The foundation is strong: committed brand language, disciplined color, excellent B2B information architecture. The P0 fixes are solid. The CTA variation genuinely helps — the minimal variant in particular feels like a different design decision, not a reskin. But the site reads as "one component repeated 35 times" because every section opens the same way. The homepage also surrenders its ending to a tepid news section with no closing CTA. Fix the section-opener monotony and add conversion endpoints to pages that lack them, and this site jumps from "good template execution" to "bespoke brand experience."

---

## What's Working

1. **Committed design language.** Zero border-radius, three-font system, pumpkin-only accent — these aren't defaults. The sharp-edge rule is especially unusual and creates a precision-as-identity statement that feels intentionally Mosaroma.

2. **CTA closer variation delivers.** The three PageCta variants (dark/light/minimal) feel genuinely different. The minimal variant on produktmasse and produktkategorien is the strongest new addition — it reduces page-end monotony without losing function. The light variant on kontakt and ambiente creates a softer, more editorial transition to the footer.

3. **B2B information depth.** Collection → product → material hierarchy, anchor navigation, "Auf einen Blick" quick-facts panels, cross-linking between collections/materials/catalogs — the site respects its audience's need to go deep without becoming overwhelming.

---

## Priority Issues

### [P1] Accent-line/eyebrow section-opener monotony across subpages
**What:** 22 `accent-line` instances in page files + 13 in components = 35 total across the public site. Nearly every section opens identically: accent-line → pumpkin eyebrow → bold heading → paragraph → content grid.
**Why it matters:** This is the single most detectable AI/template signature. When a visitor scrolls through /nerio (6 identical openers) or /materialien (4 identical openers), the rhythm becomes metronomic. It undermines the premium brand promise.
**Fix:** Create 3–4 alternative section-opener patterns (heading-only, numbered heading, pull-quote/highlight style, inline label). Distribute them across subpages to break the rhythm. The homepage already demonstrates this: HomepageValueProps has no eyebrow, HomepageSustainability leads with centered heading, HomepageDownloads uses a flex-row header with link. Apply this variety to subpages.
**Suggested command:** `/impeccable quieter` on subpage section openers, or `/impeccable layout` for rhythm variation

### [P1] Homepage has no closing CTA
**What:** The homepage sequence ends with news teasers (low-emotion content) and goes straight to the footer. There is no final conversion moment.
**Why it matters:** Violates peak-end rule. A B2B visitor who scrolls through the entire homepage — past the hero, collections, sustainability stats — is left at a tepid news grid with no "what to do next" prompt. The footer CTA bar defaults to disabled.
**Fix:** Add a PageCta (dark or light variant) after the news section, or enable the footer CTA bar by default for the homepage, or add a dedicated homepage closing section.
**Suggested command:** `/impeccable craft` homepage closing CTA

### [P2] Dark-on-dark CTA-to-footer collision
**What:** At least 6 pages have `bg-anthracite` CTA sections immediately above the `bg-anthracite` footer. The 6% opacity border-top in the footer provides insufficient separation.
**Why it matters:** The page "bleeds" into the footer rather than ending with intention. The CTA section and footer merge into one dark mass.
**Fix:** Convert remaining dark CTAs on info/catalog pages to light or minimal variants, or add a visible separator (e.g., a thin pumpkin line or a cream spacer strip) between CTA and footer.
**Suggested command:** `/impeccable layout`

### [P2] Rounded-corner outlier remains
**What:** `app/materialien/page.tsx:247` still has `rounded-[14px]` on the Olefin image — violates the sharp-edge design language.
**Why it matters:** One of the flagged "rounded outliers" from the minor fixes batch was missed. It breaks the zero-border-radius commitment on a prominent page.
**Fix:** Remove `rounded-[14px]` from the image className.
**Suggested command:** `/impeccable polish`

### [P3] /ueber-uns and /neuigkeiten lack closing CTAs
**What:** Both pages end abruptly — /ueber-uns goes from "3 Jahre Garantie" straight to footer, /neuigkeiten goes from the news grid straight to footer.
**Why it matters:** Missing conversion opportunity. These pages have no "what to do next" moment.
**Fix:** Add minimal- or light-variant PageCta at the end of both pages.
**Suggested command:** `/impeccable polish`

---

## Persona Red Flags

**Jordan (First-time visitor):**
- The homepage hero immediately communicates what Mosaroma is — strong first impression
- RED FLAG: Homepage ends on news teasers with no CTA. Jordan scrolls to the bottom and has no guided next step
- RED FLAG: /materialien/technische-daten drops Jordan into dense data tables with no "why this matters" context. Assumes B2B expertise
- The collection cards with color swatches are inviting and discoverable — good for exploration

**Sam (Accessibility-dependent):**
- RESOLVED: Skip-to-content link correctly implemented with position-based hiding
- RESOLVED: `<main id="main">` landmarks on all pages
- RESOLVED: `prefers-reduced-motion` and `motion-safe:` properly applied
- RED FLAG: Some text is very small — 9px feature tags on product pages, 10px eyebrows. Below WCAG recommended minimum
- RED FLAG: `text-white/55` in footer (55% white on anthracite) likely fails WCAG AA 4.5:1 contrast
- RED FLAG: `text-pumpkin/70` eyebrows on dark backgrounds need contrast verification

**Casey (Mobile user):**
- PASS: Responsive grids consistently collapse (4-col → 2-col → 1-col)
- PASS: `100svh` hero height handles mobile browser chrome correctly
- PASS: Mobile menu with body scroll lock
- RED FLAG: Anchor navigation bars use horizontal scroll — no visible scroll indicator or swipe affordance
- CONCERN: 10px label text may be difficult to tap as interactive elements on touch devices

---

## Minor Observations

- `HomepageImageTextFeature` reads `section.eyebrow` but never renders it — dead variable (same pattern as the ones cleaned from Sustainability/Downloads/News)
- The footer CTA bar (`ctaEnabled`) defaults to false — this means the carefully designed footer CTA with its woven texture never appears unless explicitly enabled in CMS. Consider enabling it by default
- The `ConsultationCard` linen texture (2.5% opacity repeating gradient) and the collection CTA woven texture are nice micro-details that differentiate these from plain cards
- The pflege-garantie page's "3 Jahre" pumpkin guarantee section is the single best design moment on the entire site — editorial, bold, and confident. This quality should spread
- On /nerio, ocean cycle steps use custom green gradients as image fallbacks — thoughtful empty-state handling
- Some inline CTA blocks in static fallbacks (stoff-technische-daten, pflege-garantie) duplicate the dark pattern but aren't converted to PageCta — low priority since they only show when CMS has no sections

---

## Questions to Consider

1. **If a competitor hired the same AI tool, what would be different?** The accent-line + eyebrow pattern is the "In conclusion" of web design — it signals templated thinking. What is Mosaroma's visual punctuation beyond the accent line? The pflege-garantie page proves you have it. Why is it isolated to one page?

2. **Why does the homepage surrender its ending to news?** The sustainability section (forest-green, bold stats) would be a far stronger emotional close. News is ephemeral and low-intensity. Is the news-at-bottom order a CMS artifact or a design decision?

3. **What does a B2B buyer who visits 5 pages in one session experience?** They see the same accent-line → eyebrow → heading opener on every page, the same dark CTA closer on half of them, and the same footer. The CTA variation helps break the end-monotony. What breaks the beginning-monotony?
