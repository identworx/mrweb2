---
target: Mosaroma website — all public pages
total_score: 26
p0_count: 0
p1_count: 0
timestamp: 2026-06-23T15-40-19Z
slug: mosaroma-website-all-public-pages
---
# Design Critique: Mosaroma Website — Follow-up After Top-5 Fixes

## Design Health Score

| # | Heuristic | Prior | Current | Key Change |
|---|-----------|-------|---------|------------|
| 1 | Visibility of System Status | 2 | **3** | Active nav state shows current page; NerioAnchorNav adds section navigation |
| 2 | Match System / Real World | 3 | 3 | Unchanged — domain language remains appropriate |
| 3 | User Control and Freedom | 2 | 2 | NerioAnchorNav adds in-page jumps; no sticky variant or back-to-top |
| 4 | Consistency and Standards | 3 | 3 | Active state improves consistency; minor NerioAnchorNav vs MaterialAnchorNav behavioral difference |
| 5 | Error Prevention | 3 | 3 | Unchanged |
| 6 | Recognition Rather Than Recall | 3 | 3 | Active state helps recognition significantly; nearing a 4 but anchor navs lack scroll-tracking |
| 7 | Flexibility and Efficiency | 2 | 2 | Anchor nav adds one-page efficiency; no site search, no keyboard shortcuts |
| 8 | Aesthetic and Minimalist Design | 3 | 3 | Eyebrow reduction helps; fundamental section choreography unchanged |
| 9 | Error Recovery | 2 | 2 | Unchanged |
| 10 | Help and Documentation | 2 | 2 | Unchanged |
| **Total** | **25** | **26/40** | **+1** | **Acceptable — approaching Good band** |

**Score trajectory: 22 → 25 → 26/40 (+4 total since first critique)**

---

## Fix Verification

### 1. Über-uns PageCta (dark variant) — RESOLVED
Lines 222-230 of `app/ueber-uns/page.tsx`. Dark variant with B2B copy ("Ob Fachhandel, Hotellerie oder Gastronomie"), dual CTAs (Kontakt + Kollektionen). Creates proper cream → anthracite transition. The page now has a complete conversion funnel: story → promises → sustainability → location → guarantee → CTA.

### 2. Header active navigation state — RESOLVED
`components/Header.tsx` implements `isLinkActive()` via `usePathname()`. Desktop: pumpkin text + persistent underline when scrolled, subtle white underline on transparent hero. Kontakt button: filled state when active. Mobile: pumpkin text for active links. `aria-current="page"` on all active elements. Clean, professional implementation.

### 3. Kontakt CTA removal — RESOLVED
`app/kontakt/page.tsx` ends cleanly with the contact form section. No trailing catalog CTA. The form IS the conversion — correct editorial decision.

### 4. NERIO anchor navigation — RESOLVED (with caveat)
`components/nerio/NerioAnchorNav.tsx` implements 5 anchor points following MaterialAnchorNav pattern. Proper `aria-label`, smooth scroll with header offset, horizontal scroll on mobile. All 5 target `id` attributes present in `app/nerio/page.tsx`.

**Caveat — anchor order mismatch:** The nav order (Story → Technologie → Produkte → Fakten → Beratung) does not match page section order. On the page, "Fakten" (Highlights/Stats) appears BEFORE "Produkte" (Products section). Clicking "Produkte" after "Fakten" would scroll DOWN, but the nav ordering suggests the reverse. This is a minor navigation issue to fix.

### 5. Eyebrow monotony reduction — RESOLVED
5 accent-line + eyebrow instances removed from: materialien OceanCycle, nerio OceanCycle, kollektionen/[slug] Farbwelt, ueber-uns Versprechen, HomepageCollections. All removals verified in code. Dead `eyebrow` variable cleaned from HomepageCollections. Total accent-line instances in app pages reduced from 13 to 8 (−38%).

---

## Anti-Patterns Verdict Update

**Prior:** Moderate risk — 15+ accent-line instances in pages, strong template signal.
**Current:** Reduced risk — 8 instances in pages, pattern broken on highest-traffic pages (homepage, materialien, nerio, collection detail, ueber-uns).

**Template signal reduced ~30%.** The five removals targeted the most repetitive spots (second eyebrow on same page, redundant labels where visual content speaks for itself). The remaining eyebrows are each the sole instance on their page, which is brand voice rather than scaffolding.

**Deterministic scan:** 13 findings unchanged (all admin-only `gray-on-color`). Zero new findings from any changed files. Public site remains clean across all 36 detector rules.

---

## What's Working (updated)

1. **Header active state is thorough and well-crafted.** Handles root path vs nested paths correctly. Visual treatment is elegant — pumpkin text + persistent underline when scrolled, subtle white underline on transparent header. `aria-current="page"` everywhere. The Kontakt button's filled state is a nice detail.

2. **Über-uns page now has a complete conversion funnel.** The B2B PageCta with contextually appropriate copy provides a natural endpoint. Page flow: story → promises → sustainability → location → guarantee → CTA — logical and complete.

3. **Typography and accessibility foundations remain strong.** Three-font system, WCAG contrast tokens, skip-link, focus-visible rings, reduced-motion handling, print styles — all intact through every change.

---

## Remaining Issues

### [P2] NerioAnchorNav anchor order mismatch
The nav shows Story → Technologie → **Produkte** → **Fakten** → Beratung, but the page order is Story → Technologie → Versprechen → **Fakten** → Videos → Technical Facts → **Produkte** → Beratung. "Produkte" and "Fakten" are swapped relative to their actual page position. Fix: reorder nav to match page flow.

### [P2] Mobile Kontakt button lacks active state
In the mobile menu (Header.tsx line 309-318), the Kontakt button always renders as `btn-primary` regardless of current page. The desktop Kontakt button properly gets a filled state on `/kontakt`. Minor gap in an otherwise thorough implementation.

### [P2] Section choreography monotony (structural)
The accent-line reduction was effective for section openers, but the full section structure — heading → paragraph → card grid with staggered ScrollReveal — repeats across every page. Breaking this pattern with 2-3 genuinely different layouts (full-bleed imagery, editorial layouts, pull quotes) would have more impact than further eyebrow removal. This is a larger effort item.

### [P3] NerioAnchorNav lacks scroll-tracking
No IntersectionObserver to highlight the current section during scroll. MaterialAnchorNav has tab-based active states. The two anchor navs are similar in structure but differ in behavior.

### [P3] 8 accent-line instances remain in app pages
Down from 13. Each is now the sole instance on its page, which is acceptable as brand voice. Further reduction would affect kontakt (the only eyebrow on a simple page) and service-component-driven pages where the pattern is embedded in reusable components.

---

## Minor Observations

- The `ocean.eyebrow` property in materialien and nerio data objects is still constructed but no longer displayed. Harmless unused data — not worth a code change.
- NerioAnchorNav uses bare `<a>` tags with `onClick` — correct for in-page anchors; `href="#id"` ensures non-JS fallback works.
- PageCta dark variant integrates cleanly after cream Garantie section on ueber-uns. No visual seam issue.
- The contact page now transitions directly from the form section (white bg) to Footer (anthracite bg) with sufficient padding (pb-24/pb-32/pb-40). No layout gap.
