---
target: Mosaroma website — all public pages
total_score: 25
p0_count: 0
p1_count: 2
timestamp: 2026-06-23T12-51-24Z
slug: mosaroma-website-all-public-pages
---
# Design Critique: Mosaroma Website — All Public Pages

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No active-state in main nav; no loading indicator in FabricLibrary; anchor navs lack active-section highlight |
| 2 | Match System / Real World | 3 | Domain vocabulary correct; German used consistently; minor English loanword inconsistency |
| 3 | User Control and Freedom | 2 | Nerio page (750+ lines) has no in-page nav or back-to-top; breadcrumbs easily missed on dark hero bands |
| 4 | Consistency and Standards | 3 | ueber-uns lacks PageCta (every other page has one); section padding values vary inconsistently |
| 5 | Error Prevention | 3 | Form types and required markers present; no visible inline validation feedback in source |
| 6 | Recognition Rather Than Recall | 3 | Breadcrumbs present everywhere; anchor navs lack current-section highlighting; no "you are here" in main nav |
| 7 | Flexibility and Efficiency | 2 | No search anywhere; no keyboard shortcuts; fabric library URL state only partially reflected |
| 8 | Aesthetic and Minimalist Design | 3 | Clean typography and color; monotony from repeated section-opening patterns and 4-column grids |
| 9 | Error Recovery | 2 | Error messages text-only with no visual treatment; no custom 404 design visible |
| 10 | Help and Documentation | 2 | No FAQ; no glossary for technical textile terms; care instructions page is thorough |
| **Total** | | **25/40** | **Acceptable — significant improvements needed** |

**Previous score: 22/40 → Current: 25/40 (+3)**

---

## Anti-Patterns Verdict

**Does this look AI-generated?**

**LLM assessment: Moderate risk.** A design-literate visitor would not immediately say "AI made this," but the pattern repetition creates a strong "template kit" feel. The site reads as assembled from a well-made component library rather than editorially composed.

Specific tells:
- **Eyebrow + accent-line monotony** — the identical `accent-line` div + `font-accent text-xs tracking-[0.3em] uppercase` pattern appears **15+ times** across the site. On materialien alone, 3 instances. On nerio, 2-3. This is the strongest "template generated this" signal.
- **Numbered section markers** — materialien uses numbered squares for Mackintosh steps and OceanCycle. Nerio uses them too. Pflege-garantie uses oversized "01", "02", "03". The numbered-card-with-pumpkin-accent grid is recognizable AI scaffolding.
- **4-card grids everywhere** — value props (4), sustainability stats (3), collections (4), OceanCycle (4), Nerio promise (4), Nerio highlights (4), service links (4), about-us promises (4). Cumulative effect is template-like.
- **Stat/metric blocks** — large pumpkin numbers appear on homepage sustainability, about-us (twice), Nerio highlights, and materialien OceanCycle. "Big number + small label" repeated 5+ times.
- **Clean signals** — no gradient text, no glassmorphism, no side-stripe borders, no hero-metric template in the SaaS sense. The woven-fiber texture on cards is a brand-specific touch that lifts above generic.

**Deterministic scan: Zero findings in public-facing code.** The automated detector scanned 190 files (84 in `app/`, 106 in `components/`). All 13 findings (`gray-on-color` rule) were isolated to `components/admin/` — internal CMS status badges and warning panels. 35 of 36 rules returned zero hits. The public site is clean from a static-analysis perspective. Note: the detector catches class-level patterns; layout monotony and compositional sameness require human judgment, which is where Assessment A picks up.

---

## Overall Impression

The foundations are genuinely premium — typography, color palette, spacing, animation curves, and accessibility all reflect craft. But the site is held back by compositional monotony: every section opens the same way (accent-line + eyebrow), every grid is 4 columns, and every page follows the same Hero → Breadcrumb → Sections → CTA → Footer rhythm with no variation. The pflege-garantie "3 Jahre" section proves the team can design with drama and confidence — but it's the only section on the entire site that takes that risk. The gap between "what exists" and "what could exist" is the gap between a well-made template and a premium digital showroom.

---

## What's Working

1. **The pflege-garantie guarantee section** (`app/kataloge/pflege-garantie/page.tsx:206-230`). The oversized "3" at 10-12rem with "Jahre auf Mosaroma" on a full-width pumpkin background is bold, confident, and brand-appropriate. It uses scale, color, and asymmetric grid to create drama. This is the one section that feels like a design *decision* rather than a template fill. The rest of the site should aspire to this level of commitment.

2. **The typography system.** Montserrat (display/heading), Source Sans 3 (body), Josefin Sans (accent/labels) — three families with committed weight/size contrast. `text-wrap: balance` and `text-wrap: pretty` show typographic craft. Body text at 17px/1.8 line-height is generous and readable. Heading tracking (-0.02em) gives premium density.

3. **Accessibility foundations.** Skip-to-content link with proper focus behavior, `main#main` landmark, `focus-visible` rings everywhere, `prefers-reduced-motion` respected for all animations, print styles, `aria-label` on interactive elements, focus trap in mobile menu, `lang="de"`. Above-average for this site type, reflecting seven rounds of systematic WCAG work.

---

## Priority Issues

### [P1] Eyebrow + accent-line monotony across all subpages
**What:** The identical accent-line + tiny uppercase tracked eyebrow pattern appears 15+ times across the site — on materialien (×3), nerio (×2-3), kollektionen, kontakt, ueber-uns, technische-daten, pflege-garantie, produktmasse, and every collection detail page. This is the primary "template assembled this" signal.

**Why it matters:** A premium brand's digital showroom should feel editorially composed, not assembled from repeating components. When every section opens identically, visitors perceive a system, not a voice. The pflegegarantie "3" section proves the alternative: when one section breaks the pattern, it communicates intentionality and confidence.

**Fix:** Vary section-opening devices. Keep the eyebrow on 2-3 sections per page max. Replace others with: a bold pull-quote, oversized type, a color-block accent, asymmetric layout, or simply the heading alone. The variety itself communicates editorial intention.

**Suggested command:** `/impeccable typeset` — rework section-opening cadence across all public pages

### [P1] Ueber-uns page lacks CTA and has structural weakness
**What:** The about-us page is the only subpage without a PageCta. It ends abruptly after a brief guarantee section (`app/ueber-uns/page.tsx:226-229`). Every other public page has a closing CTA.

**Why it matters:** For a B2B brand, about-us is a key trust page. Trade buyers evaluating suppliers visit this page to assess credibility. Ending without a conversion moment is a missed opportunity. The structural gap also breaks the consistency pattern that every other page follows.

**Fix:** Add a PageCta (dark variant would contrast well after the cream guarantee section). Evaluate whether the page has enough substance — consider facility imagery, a timeline, or partner context.

**Suggested command:** `/impeccable polish ueber-uns`

### [P2] Nerio page is too long with no in-page navigation
**What:** The Nerio page (`app/nerio/page.tsx`) has 10+ sections and 750+ lines. Users cannot jump to specific content or orient within the page. No anchor navigation, no sticky section indicator, no return-to-top.

**Why it matters:** Mobile users (Casey) will bounce before reaching the CTA. Even desktop users lose orientation in a single-scroll page this long. The materialien page solved this with MaterialAnchorNav — Nerio needs the same treatment.

**Fix:** Add a MaterialAnchorNav-style anchor bar. Group logically: Story | Technology | Products | Facts. Evaluate whether all 10+ sections need to coexist on one page.

**Suggested command:** `/impeccable layout nerio`

### [P2] No active navigation state in header
**What:** Nav links in `components/Header.tsx:156-180` all share identical styling regardless of the current page. No visual indicator of where the user is beyond breadcrumbs.

**Why it matters:** Basic wayfinding. Users should know which section they're in at a glance. This is a standard pattern and its absence is notable on a site with 7+ nav items.

**Fix:** Add a `usePathname()` comparison and apply a distinct style (pumpkin underline or different opacity) to the active nav link.

**Suggested command:** `/impeccable harden Header`

### [P3] Kontakt page CTA is contextually wrong
**What:** The contact page ends with a PageCta saying "Alle Details im Katalog" — the same CTA copy as the materialien page. On a contact page, the user has already decided to reach out; a catalog CTA is disconnected.

**Fix:** Remove the PageCta entirely (the form IS the conversion), or change to "Entdecken Sie unsere Kollektionen" to route users who aren't ready to contact yet.

**Suggested command:** `/impeccable clarify kontakt`

---

## Persona Red Flags

**Jordan (First-Timer):**
- "Kollektionen" vs "Produktkategorien" in the nav is confusing — are these different ways to browse the same products?
- No search anywhere — Jordan can't look for "blue cushion" or "outdoor throw"
- Materialien page dumps Mackintosh, Olefin, OceanCycle, and Stofffamilien with no progressive disclosure — overwhelming for a consumer who just wants to know "is this waterproof?"
- Homepage hero has two CTAs but no product-type quick-links ("Looking for cushions? Throws?")

**Sam (Accessibility-Dependent):**
- Accent font at 9-10px (`text-[10px]`, `text-[9px]`) is below comfortable reading threshold. Even with magnification, these are hard to parse. Present throughout all pages.
- Skip-link works correctly — **resolved**
- ScrollReveal starts elements at `opacity: 0` — if JS fails, content remains invisible. The `prefers-reduced-motion` handling is correct (sets opacity to 1), but this is client-side only.

**Casey (Distracted Mobile User):**
- Materialien, Nerio, and collection detail pages are extremely long scrolls on mobile — Casey will bounce before reaching any CTA
- Primary conversion action is always at page bottom. No sticky mobile CTA bar or earlier inline CTAs.
- No mobile-specific shortcuts (product-type filters, collection quick-links)

---

## Minor Observations

- `section-padding` utility is not used consistently — some sections use it, others have custom padding, creating subtle vertical rhythm drift.
- `img-zoom` class defined in globals.css but unused in components (hover zoom done via inline Tailwind). Dead CSS.
- PageCta `dark` variant exists but is currently unused on any page — an underutilized tool for visual variety.
- `minimal` PageCta variant on white background after a white content section (produktmasse) creates no visual separation.
- CollectionCard mood-color gradient placeholders are well-designed and prevent the site from looking broken before real photography is uploaded.
- Footer CTA disabled by default (ctaEnabled) — correct call to avoid double CTA with PageCta.

---

## Questions to Consider

1. **If you removed every eyebrow, every accent-line, and every numbered step marker — would the hierarchy actually suffer?** Or would the headings alone carry the structure fine, and the site would immediately feel editorially composed rather than template-assembled? Try it on materialien and compare.

2. **Why does NERIO get its own landing page but Mackintosh does not?** Mackintosh is the primary technology and appears on more products, yet it's buried inside materialien as a section. If NERIO deserves hero-level storytelling, so does Mackintosh.

3. **Every CTA on every page routes to `/kontakt`. Is this a funnel or a dead end?** A trade buyer comparing 3 outdoor textile suppliers will not fill out a generic contact form for each. Consider a more specific inquiry flow: which collection, which product category, what quantity, what timeline.
