---
target: homepage
total_score: 24
p0_count: 1
p1_count: 1
timestamp: 2026-06-10T16-27-54Z
slug: app-public-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No active page indicator, scroll indicator nearly invisible |
| 2 | Match System / Real World | 3 | Language and terminology appropriate |
| 3 | User Control and Freedom | 2 | No back-to-top, no section navigation for 7+ sections |
| 4 | Consistency and Standards | 3 | Button system consistent; sustainability section alignment differs |
| 5 | Error Prevention | 3 | Good CMS fallbacks |
| 6 | Recognition Rather Than Recall | 3 | Collection color swatches enable visual recognition |
| 7 | Flexibility and Efficiency | 2 | No search, no filters, no quick navigation |
| 8 | Aesthetic and Minimalist Design | 2 | 7 sections with identical structure, formulaic |
| 9 | Error Recovery | 2 | Not directly testable, fallbacks present |
| 10 | Help and Documentation | 2 | Contact in header, no contextual help |
| **Total** | | **24/40** | **Acceptable** |

## Anti-Patterns Verdict

LLM: HIGH AI-SLOP RISK. 7/7 sections use identical eyebrow+heading+grid+CTA formula. 4/7 are card grids.
Detector: 0 findings (limited by React/Tailwind indirection). Montserrat false negative confirmed.

## Priority Issues

- [P0] Repetitive eyebrow pattern on all 7 sections - AI-generated tell
- [P1] Monotonous section rhythm - no emotional arc after hero
- [P2] News cards have no images - weak page ending
- [P2] Seven CTAs create decision paralysis
- [P3] Downloads section misplaced on homepage

## Persona Red Flags

- Jordan: Value props before product showcase, 7 unstructured CTAs
- Casey: Hero image not responsive for portrait, collection cards too narrow on mobile, hamburger rounded-full contradicts brand
- B2B buyer: No trade portal, no certifications on sustainability stats
- Design consumer: Almost no textile imagery, no close-up weave textures

## Strengths

1. Collection moodColors strips - unique brand-specific element
2. Header scroll behavior - premium transition
3. Design token discipline - consistent system

## Minor Observations

1. Arrow SVG duplicated 10+ times inline
2. Scroll indicator invisible (1px, 20% opacity)
3. Vertical MOSAROMA text invisible (12% opacity, 9px)
4. Footer social links default to href="#"
5. Hamburger button rounded-full contradicts brand spec
