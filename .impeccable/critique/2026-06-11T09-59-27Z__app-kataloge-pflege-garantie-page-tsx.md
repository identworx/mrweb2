---
target: /kataloge/pflege-garantie
total_score: 31
p0_count: 0
p1_count: 0
timestamp: 2026-06-11T09-59-27Z
slug: app-kataloge-pflege-garantie-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Breadcrumbs show location; no scroll indicator on long page |
| 2 | Match System / Real World | 4 | Excellent German-language care terminology, familiar laundry pictograms |
| 3 | User Control and Freedom | 3 | Breadcrumb escape hatch works; no back-to-top on long scroll |
| 4 | Consistency and Standards | 4 | Three-font system, CTA hierarchy, section spacing all disciplined |
| 5 | Error Prevention | 2 | Read-only page; CareIcon silently returns null for unknown keys |
| 6 | Recognition Rather Than Recall | 4 | Icons + labels, numbered steps, bold key values — all scannable |
| 7 | Flexibility and Efficiency | 2 | No jump links, no printable view, no section anchors for return visitors |
| 8 | Aesthetic and Minimalist Design | 4 | Every section earns its space; pumpkin restraint is exemplary |
| 9 | Error Recovery | 2 | Limited applicability; notFound() and CMS fallback are solid |
| 10 | Help and Documentation | 3 | Care instructions are well-structured docs; no inline contact for questions |
| **Total** | | **31/40** | **Good** |

## Anti-Patterns Verdict

**LLM assessment: PASS.** No absolute bans triggered. Numbered steps justified (real washing procedure). Single eyebrow. Guarantee "3" reads as editorial, not SaaS metric. Zero border-radius throughout.

**Deterministic scan: 0 findings.** Exit code 0. TSX component files evade page-level analyzers.

## Overall Impression

Solid informational page with a well-structured emotional arc: practical → reassuring → bold → calm. Biggest opportunities: utility (printable/downloadable care card) and accessibility polish (contrast, semantics).

## What's Working

1. Guarantee section — bold editorial design, oversized "3" on pumpkin is the emotional peak
2. Care symbols — scannable quick-reference with icons + labels, correct aria-hidden usage
3. Typography restraint — zero font-role crossings, bold-text highlighting for key values

## Priority Issues

**[P2] CTA description fails WCAG AA contrast** — text-white/60 on bg-anthracite = ~2.9:1. Fix: bump to text-white/70+. Files: page.tsx:293, ServiceCtaSection.tsx:24.

**[P2] Two equal-weight CTA buttons** — both btn-outline-white, no visual hierarchy between primary and secondary action. Fix: differentiate "Materialien entdecken" as primary. File: page.tsx:297-303.

**[P2] Care symbol containers lack semantic grouping** — plain divs, no figure/figcaption. Fix: wrap in figure+figcaption. File: page.tsx:245-251.

**[P3] height="compact" prop is dead code** — PageHero accepts but ignores it. Fix: implement or remove. Files: page.tsx:136, PageHero.tsx.

**[P3] Care symbols grid orphans 5th item on mobile** — grid-cols-2 for 5 items. Fix: adjust breakpoints. File: page.tsx:243.

## Persona Red Flags

**Jordan (First-Timer):** MACKINTOSH technology name-dropped without explanation. No link to product overview for search-landing visitors.

**Sam (Accessibility):** text-white/60 contrast fail. Giant "3" + heading read as separate SR elements. Care symbols need semantic grouping.

**Casey (Mobile):** 5-item grid orphans last item on 2-col. Guarantee "3" at 128px is large but manageable. CTAs stack correctly.

## Minor Observations

- BoldText duplicated in page.tsx and NumberedStepsSection.tsx
- CareIcon duplicated in page.tsx and CareSymbolsSection.tsx
- ServiceCtaSection max-w-xl overridden by prose max-w-none
- Intro section uses custom padding instead of section-padding utility

## Questions to Consider

1. Should the care symbols be a downloadable/printable card for lasting brand utility?
2. Does pumpkin survive its own frequency on this page (subtitle, eyebrow, step numbers, full section)?
3. Is "drei Schritte" honest when Step 2 involves mixing specific chemical ratios?
