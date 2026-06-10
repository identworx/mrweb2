---
name: Mosaroma Industries
description: Premium outdoor textiles where design meets performance
colors:
  pumpkin: "#E07B12"
  burnt-sienna: "#D35400"
  anthracite: "#2D2D2D"
  warm-linen: "#FAF8F5"
  soft-stone: "#F5F5F5"
  weathered-silver: "#B8B8B8"
  dusk-gray: "#555555"
  forest-deep: "#1a2e1a"
typography:
  display:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Josefin Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.15em"
rounded:
  none: "0"
  admin: "8px"
  admin-lg: "12px"
spacing:
  section-sm: "5rem"
  section-md: "7rem"
  section-lg: "8rem"
  card-sm: "1rem"
  card-md: "1.5rem"
  container-x: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.pumpkin}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "16px 40px"
  button-primary-hover:
    backgroundColor: "{colors.burnt-sienna}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "16px 40px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.anthracite}"
    rounded: "{rounded.none}"
    padding: "16px 40px"
  button-outline-hover:
    backgroundColor: "{colors.anthracite}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "16px 40px"
---

# Design System: Mosaroma Industries

## 1. Overview

**Creative North Star: "Der Garten-Salon"**

The Mosaroma design system evokes the atmosphere of a perfectly curated outdoor living space — warm, inviting, and quietly confident. Every surface feels like stepping into a sun-dappled terrace where premium textiles meet natural materials. The system is generous with whitespace and deliberate with detail: sharp edges on public surfaces convey precision; warm transitions and subtle hover states invite exploration without demanding attention.

This is not a clinical product catalog. It is not a discount e-commerce shop with pop-ups and banners. It is not a SaaS landing page with hero metrics and gradient buttons. Mosaroma speaks with the calm authority of a brand that knows its craft — German engineering precision married to Italian aesthetic sensibility. The textiles are the hero; the interface serves them.

**Key Characteristics:**
- Sharp-edged cards and containers on public pages (zero border radius) — precision as identity
- Warm pumpkin accent used sparingly — its rarity is the point
- Generous vertical rhythm between sections (5–8rem) — breathing room, not density
- Hover states that feel physical: gentle lift (-1px translate), soft shadow bloom, image zoom at 1.2s
- Three-font system with clear roles: Montserrat commands, Source Sans 3 narrates, Josefin Sans whispers

## 2. Colors: The Terrace Palette

A restrained-to-committed palette anchored by a single warm accent against tonal neutrals. The pumpkin carries the brand voice; everything else supports it.

### Primary
- **Pumpkin** (#E07B12): The brand accent. CTAs, active states, hover highlights, accent lines. Used on ≤15% of any given screen. Its warmth is earned, not sprayed.
- **Burnt Sienna** (#D35400): The pumpkin's deeper register. Hover states on primary buttons, link hover states. Always a response to interaction, never at rest.

### Neutral
- **Anthracite** (#2D2D2D): Primary ink. Headings, footer background, outline buttons. Dense and grounding — the weight that makes the pumpkin glow.
- **Warm Linen** (#FAF8F5): The body background. A barely-there warmth that reads as natural light on fabric, not as the AI-default cream. Existing and committed.
- **Soft Stone** (#F5F5F5): Secondary surface for alternating sections and card backgrounds. Cooler than warm linen, just enough to create rhythm.
- **Weathered Silver** (#B8B8B8): Borders, dividers, disabled states. Quiet and structural.
- **Dusk Gray** (#555555): Body text. 4.85:1 contrast ratio against warm linen — comfortably above WCAG AA.

### Specialty
- **Forest Deep** (#1a2e1a): The sustainability section's dark canvas. Used once, with purpose — the only section that breaks the light palette, grounding the sustainability message in earth tones.

### Named Rules
**The One-Voice Rule.** Pumpkin is the only saturated color on public pages. No secondary accent, no tertiary. The palette's restraint forces every pumpkin element to carry weight.

## 3. Typography

**Display Font:** Montserrat (with system-ui fallback)
**Body Font:** Source Sans 3 (with system-ui fallback)
**Label Font:** Josefin Sans (with system-ui fallback)

**Character:** A geometric-humanist pairing that straddles technical confidence and warmth. Montserrat's wide proportions give headings architectural presence; Source Sans 3's open apertures make body text feel approachable and legible at small sizes. Josefin Sans enters as a whispered accent — uppercase, tracked-out labels that signal category and navigation without competing with the headline.

### Hierarchy
- **Display** (Extrabold 800, clamp(2.75rem, 7vw, 5.5rem), line-height 1.05, tracking -0.02em): Hero headlines only. The largest voice on the page — used once per view.
- **Headline** (Bold 700, clamp(1.875rem, 4vw, 2.75rem), line-height 1.15, tracking -0.01em): Section headings. Tighter than body but generous enough to breathe.
- **Title** (Bold 700, 1rem–1.125rem, line-height 1.3): Card titles, sub-section headings. Montserrat at conversational scale.
- **Body** (Regular 400, 1.0625rem, line-height 1.8): Long-form text. Source Sans 3 at a comfortable reading size with generous leading.
- **Label** (Regular 400, 0.75rem, tracking 0.15em, uppercase): Josefin Sans. Navigation, eyebrow text, metadata. Always uppercase, always tracked.

### Named Rules
**The Three-Voice Rule.** Each font has one job. Montserrat commands attention (headings). Source Sans 3 carries the narrative (body, descriptions). Josefin Sans marks territory (labels, navigation, accents). Never cross them.

## 4. Elevation

This system is flat by default. Depth is earned through interaction, not decoration. Surfaces sit flush at rest; shadows appear only as a response to hover, creating a tactile "lifting" sensation that mirrors picking up a fabric swatch.

### Shadow Vocabulary
- **Card Hover Bloom** (`0 8px 30px rgba(0,0,0,0.06)`): The primary interactive shadow. Cards, download items, collection tiles — anything that lifts on hover. Diffuse and warm; 6% opacity keeps it atmospheric, not structural.
- **Button Hover Glow** (`0 4px 20px rgba(224,123,18,0.25)`): Pumpkin-tinted shadow on primary buttons. The brand color bleeds into the shadow, reinforcing the warmth.
- **Header Settle** (`0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)`): Two-layer shadow when the header transitions to its scrolled state. The first layer grounds it; the second creates subtle depth.
- **Modal Backdrop** (`bg-black/50`): Full-screen overlay at 50% opacity. Admin modals only — the public site has no modals.

### Named Rules
**The Flat-By-Default Rule.** No surface has a shadow at rest. Shadows are motion artifacts — they appear during hover, scroll transitions, and modal overlays. A shadow at rest is a shadow without purpose.

## 5. Components

### Buttons
Warm and decisive. Every button is a quiet invitation.

- **Shape:** Sharp edges (0 border radius). No rounding on public buttons — the precision is the brand.
- **Primary:** Pumpkin background, white text. Montserrat semibold, 0.75rem, tracking 0.15em, uppercase. Padding 1rem 2.5rem. The arrow icon (14px SVG) sits after the label with 0.75rem gap.
- **Hover:** Background shifts to burnt sienna, lifts -1px, gains pumpkin-tinted shadow glow. Transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94).
- **Outline:** Transparent background, anthracite text and 1px border. Same typography as primary.
- **Outline Hover:** Fills to anthracite background, white text. Same lift and timing.
- **Outline White:** For dark backgrounds (sustainability section, hero). White text, 30% white border.

### Cards / Containers
Clean surfaces that come alive on interaction.

- **Corner Style:** None (0 border radius). Sharp edges on all public cards.
- **Background:** White or cream, depending on section alternation.
- **Shadow Strategy:** Flat at rest. On hover: -1px lift + bloom shadow (0 8px 30px rgba(0,0,0,0.06)).
- **Border:** Transparent at rest; on hover some cards gain a faint pumpkin-tinted border (border-pumpkin/10).
- **Internal Padding:** 1rem–1.5rem (p-4 to p-6), increasing with breakpoint.
- **Image Treatment:** Aspect-ratio containers with object-cover. Images zoom to scale(1.05) over 1.2s on parent hover.

### Navigation
The header is a living surface that responds to scroll context.

- **Default (Hero):** Transparent background, white text, gradient scrim for readability. Height 88px (mobile) / 108px (desktop).
- **Scrolled:** White/97% opacity with backdrop-blur-xl. Height compresses to 68px/76px. Subtle two-layer shadow appears.
- **Links:** Josefin Sans label style. Hover reveals animated underline (width 0 → 100%, pumpkin, 300ms).
- **Mobile:** Hamburger menu with animated line rotation (300ms). Full-screen overlay.

### Accent Line
The signature micro-element. A 3rem × 1px pumpkin line that precedes section eyebrows. Consistent across all section types — it's the visual punctuation mark of the brand.

### Inputs / Fields (Admin)
- **Style:** 1px gray-300 border, rounded-lg (8px), white background, text-sm.
- **Focus:** Ring-2 orange-500, border becomes transparent. The orange focus ring connects admin UI to the brand accent.
- **Error:** Red-600 text below the field. No border color change on error — the message carries the signal.

## 6. Do's and Don'ts

### Do:
- **Do** use pumpkin (#E07B12) as the sole saturated accent on public pages. Its scarcity is its power.
- **Do** keep public cards and containers at 0 border radius. The sharp edges are the brand's signature precision.
- **Do** use the three-font system with discipline: Montserrat for headings, Source Sans 3 for body, Josefin Sans for labels.
- **Do** apply hover lift (-1px translateY) with the standard easing (cubic-bezier 0.25, 0.46, 0.45, 0.94) on interactive cards.
- **Do** alternate section backgrounds between warm linen (#FAF8F5) and white (#FFFFFF) for visual rhythm.
- **Do** show textiles in context (terrace, garden, hotel) rather than isolated on white backgrounds.
- **Do** respect `prefers-reduced-motion` — disable translateY lifts and image zooms, keep color transitions.

### Don't:
- **Don't** introduce a second saturated accent color. The one-voice rule: pumpkin only.
- **Don't** add border-radius to public-facing cards or buttons. Sharp edges = Mosaroma.
- **Don't** use shadows at rest on any public element. Shadows are hover-only (the flat-by-default rule).
- **Don't** use bounce or elastic easing. The brand's motion is smooth and confident, never playful.
- **Don't** build generic B2B catalog pages with stock photos and data tables — that's the anti-reference.
- **Don't** add rabatt banners, pop-ups, or promotional overlays — that's the overloaded e-commerce anti-reference.
- **Don't** use SaaS-style hero metrics (big number + small label + gradient) — explicitly rejected in PRODUCT.md.
- **Don't** use gradient text (background-clip: text with gradient). Emphasis via weight and size, not decoration.
- **Don't** nest cards inside cards. One level of containment maximum.
- **Don't** cross the font roles: no Josefin Sans in body text, no Source Sans 3 in headings, no Montserrat in labels.
