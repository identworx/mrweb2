---
target: Mosaroma website — all public pages
total_score: 26
p0_count: 0
p1_count: 0
timestamp: 2026-06-24T06-52-25Z
slug: mosaroma-website-all-public-pages
---
# Design Critique: Mosaroma Website — Fresh Re-assessment After Top-5 Fixes

## Design Health Score

| # | Heuristic | Prior (2nd) | Current | Key Issue |
|---|-----------|-------------|---------|-----------|
| 1 | Visibility of System Status | 3 | **3** | Active nav state solid; anchor navs lack scroll-tracking |
| 2 | Match System / Real World | 3 | **3** | German copy appropriate; isolated "Collection" (EN) string on NERIO page |
| 3 | User Control and Freedom | 2 | **2** | Anchor navs add in-page jumps; no sticky variant, no back-to-top |
| 4 | Consistency and Standards | 3 | **3** | Sharp-edge system consistent; off-token `bg-[#1a2e1a]` on HomepageSustainability |
| 5 | Error Prevention | 3 | **3** | Form has required + honeypot; no per-field validation |
| 6 | Recognition Rather Than Recall | 3 | **3** | Active state aids recognition; anchor navs have no scroll-tracking |
| 7 | Flexibility and Efficiency | 2 | **2** | Anchor nav is only accelerator; no search, no keyboard shortcuts |
| 8 | Aesthetic and Minimalist Design | 3 | **3** | Good typography, committed design language; section choreography still repetitive |
| 9 | Error Recovery | 2 | **2** | Global form error only; no per-field error messages |
| 10 | Help and Documentation | 2 | **2** | Contact info present; no FAQ, no self-service help |
| **Total** | **26** | **26/40** | **Stable** | **Acceptable — upper band** |

**Score trajectory: 22 → 25 → 26 → 26/40 (stable after fixes)**

---

## Anti-Patterns Verdict

### LLM Assessment

**AI slop signal: Low-moderate.** The site avoids the most obvious AI tells. Three-font system is disciplined. Sharp-edge design language is genuinely committed. The teal NERIO hero gradient is a differentiated creative choice.

Remaining template signals:
- **Section choreography** still follows `heading → paragraph → card grid` on nearly every section of every page. A human editorial director would have broken at least one section into a different arrangement.
- **Background alternation** is mechanical: white → cream → anthracite → white → cream follows a toggle pattern, not an expressive choice.
- **The trailing-period headline style** ("Design trifft Performance." / "Was uns antreibt." / "Grün gewebt. Vom Tropfen an.") appears on virtually every h2. Once is voice; everywhere is template.
- **8 accent-line instances remain** — each is the sole instance on its page. Acceptable as brand voice.

### Deterministic Scan

**13 findings total: 0 in public files, 13 in admin-only files.**

All findings are `gray-on-color` in `components/admin/` (FabricAdminList, MediaEditForm, PageSectionEditForm, PageSectionsEditor, ProductAdminList, StatusFilter). Public site is detector-clean across all 36 rules.

**Zero new findings** from any changed files (Header.tsx, PageCta.tsx, NerioAnchorNav.tsx, HomepageCollections.tsx, ueber-uns, kontakt, nerio, materialien, kollektionen/[slug]).

---

## Fix Verification (5/5 confirmed)

### 1. Über-uns PageCta (dark variant) — CONFIRMED
Lines 222–230 of `app/ueber-uns/page.tsx`. Dark variant with B2B copy, dual CTAs. Creates proper cream → anthracite transition. Page has complete conviction arc: story → promises → sustainability → location → guarantee → CTA.

### 2. Header active navigation state — CONFIRMED
`isLinkActive()` via `usePathname()`. Desktop: pumpkin text + persistent underline when scrolled, subtle white underline on transparent hero. Mobile: pumpkin text for active links. Kontakt button: filled state when active. `aria-current="page"` on all active elements. Thorough implementation.

### 3. Kontakt CTA removal — CONFIRMED
Page ends cleanly with contact form section. No trailing catalog CTA. The form IS the conversion.

### 4. NERIO anchor navigation — CONFIRMED (with caveats)
5 anchor points, all `id` attributes present in fallback page tree. Proper `aria-label`, smooth scroll with header offset, horizontal scroll on mobile. **Caveat 1**: Anchor order mismatch (Produkte ↔ Fakten swapped vs page order). **Caveat 2**: Conditionally rendered only when `!hasCmsSections` — if CMS sections are published, anchor nav disappears.

### 5. Eyebrow monotony reduction — CONFIRMED
8 instances remain in public pages (down from 13). Each is the sole instance on its page. Reduction is genuine and targeted.

---

## What's Working

1. **Header is production-quality.** Scroll-aware transparency, logo invert, active state with aria-current, mobile focus trap, Escape key handling. Best component on the site.

2. **NERIO page is the strongest brand story.** Custom teal hero differentiates it from the PageHero template. OceanCycle → technical facts → products → CTA follows a logical buyer conviction arc. The NerioVideoSection with process videos is substantive content.

3. **Über-uns has the most emotionally coherent arc.** Who we are → what drives us → evidence → where we are → what we promise → invitation. The dark PageCta creates a genuine closing statement.

---

## Priority Issues

### [P2] NerioAnchorNav anchor order mismatch
Nav shows Story → Technologie → **Produkte** → **Fakten** → Beratung, but page order has Fakten before Produkte. Clicking "Produkte" after "Fakten" scrolls DOWN when the nav ordering implies UP. **Fix**: Reorder ANCHORS array to match page section order. `/impeccable layout nerio`

### [P2] Mobile Kontakt button lacks active state
In the mobile menu (Header.tsx lines 309–318), the Kontakt button always renders as `btn-primary` regardless of current page. Desktop version correctly gets a filled state on `/kontakt`. **Fix**: Add pathname check for mobile Kontakt button. `/impeccable harden Header`

### [P2] "Collection ansehen" English string on NERIO page
Two instances of "Collection" (English) instead of "Kollektion" (German) in `app/nerio/page.tsx` (lines 326, 732). Breaks German-language discipline and signals copy-paste from an English template. **Fix**: Replace with "Kollektion ansehen". `/impeccable clarify nerio`

### [P2] Section choreography monotony (structural)
The `heading → paragraph → card grid with ScrollReveal` structure repeats across every page. Breaking with 2–3 genuinely different layouts (full-bleed imagery, editorial layouts, pull quotes) would have more impact than further eyebrow removal. Larger effort. `/impeccable layout`

### [P3] NerioAnchorNav lacks scroll-tracking
No IntersectionObserver to highlight the current section during scroll. MaterialAnchorNav has tab-based active states. The two anchor navs are similar in structure but differ in behavior. **Fix**: Add IntersectionObserver for active section highlighting. `/impeccable animate nerio`

### [P3] Off-token background color on HomepageSustainability
`bg-[#1a2e1a]` (dark forest green) is used only in HomepageSustainability and is not a named design token. The Über-uns sustainability section uses `bg-anthracite` for equivalent content. Creates inconsistency. `/impeccable colorize`

### [P3] Adjacent cream sections on homepage
HomepageNews (`bg-cream`) is followed directly by PageCta light variant (`bg-cream`). Two adjacent cream sections with no visual separation create a merged appearance. `/impeccable layout`

### [P3] Garantie section visually underpowered
"3 Jahre Garantie" is a strong trust signal but receives the same visual treatment as any body-text section. A callout, certificate icon, or visual emphasis would give it appropriate weight. `/impeccable bolder ueber-uns`

---

## Persona Red Flags

### Jordan (First-Timer B2B buyer)
- Homepage hero "Design trifft Performance" is confident but product-agnostic — Jordan doesn't know what Mosaroma sells until reading the sub-headline.
- Collection cards have mood-color bars but no product type labels visible at card level. Jordan doesn't know if these are fabric or finished product collections.
- No pricing indication anywhere — no "Preise auf Anfrage" prompt on collection pages to signal that contact is the next step.

### Riley (Stress Tester / experienced buyer)
- "Collection ansehen" English string chips at credibility for a German B2B buyer.
- Sample request journey breaks at the handoff: "Musterset anfragen" goes to `/kontakt` with no context about which fabric the buyer was viewing. The contact form has no field for this.
- NerioAnchorNav anchor order mismatch would confuse a methodical evaluator clicking through sections sequentially.

### Casey (Mobile User at trade show)
- NerioAnchorNav has no active state on mobile — disorienting on a long scroll.
- The long homepage (9 sections) is heavy scrolling on mobile with no skip-to-section affordance.
- No phone number visible for quick mobile contact (observation — may be intentional business decision).

---

## Cognitive Load Assessment

**3.5 / 8 items failing — moderate cognitive load.**

Failures:
1. **Single focus**: Homepage presents 6+ competing destinations before the footer.
2. **Section scannability**: Many body paragraphs have no sub-headings, no bold pull quotes, no scannable structure.
3. **Redundant content**: Sustainability stats (42%, 38%, 71%) appear in full on both homepage and Über-uns.

Passes: heading hierarchy, button label specificity, paragraph line length, color differentiation, interaction pattern consistency (partial).

---

## Minor Observations

- The `ocean.eyebrow` property in materialien and nerio data objects is still constructed but no longer displayed. Harmless unused data.
- NerioAnchorNav uses bare `<a>` tags with `onClick` — correct for in-page anchors; `href="#id"` ensures non-JS fallback.
- PageCta dark variant integrates cleanly after cream Garantie section on über-uns.
- MaterialAnchorNav has commented-out routes for pages that don't exist yet — consider hiding the nav until sub-pages exist.
- HomepageSustainability diamond grid texture at `opacity-[0.04]` is effectively invisible.
- HomepageCollections "view all" card is bespoke JSX, not a CollectionCard variant — maintenance divergence risk.

---

## Questions to Consider

1. **Is the trailing-period headline style ("Design trifft Performance.") still earning its keep?** It appears on virtually every h2 across the site. Removing the period from 60% of headings would make the remaining ones feel more intentional.

2. **Should the NERIO page's anchor nav serve as a model for the homepage too?** The homepage at 9 sections is the longest scroll on the site and has no in-page navigation. A sticky mini-nav or section indicators could help orientation.

3. **What if the sustainability stats appeared only ONCE?** They're currently duplicated between homepage and Über-uns. Removing from one and cross-linking would reduce redundancy and give each page a more distinct identity.
