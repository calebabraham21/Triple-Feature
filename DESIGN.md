---
name: Triple Feature
description: Movie recommendation engine — editorial publication aesthetic, light surface, monochromatic palette.
colors:
  paper: "#f9f7f4"
  frame: "#fdfcfb"
  ink: "#1e1b18"
  fog: "#847e7a"
  ash: "#ccc8c3"
  smoke: "#eae8e5"
  reel: "#221f1c"
typography:
  display:
    fontFamily: "DM Mono, monospace"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.04em"
  headline:
    fontFamily: "DM Mono, monospace"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.01em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 600
    fontSize: "1rem"
    lineHeight: 1.4
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 400
    fontSize: "0.875rem"
    lineHeight: 1.65
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 600
    fontSize: "0.625rem"
    lineHeight: 1
    letterSpacing: "0.18em"
    textTransform: "uppercase"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.frame}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ash}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  archive-row:
    borderBottom: "1px solid {colors.smoke}"
    padding: "20px 4px"
    hoverBackground: "rgba(234,232,229,0.4)"
  film-detail-modal:
    backgroundColor: "{colors.frame}"
    borderColor: "{colors.smoke}"
    rounded: "{rounded.lg}"
---

# Design System: Triple Feature

## 1. Overview

**Creative North Star: "The Trusted Recommendation"**

Triple Feature is an editorial film publication that happens to be a recommendation engine. The design reads like a trusted print publication — clean white surfaces, authoritative monospaced headings, and desaturated cinematic photography. The recommendation is the product; the interface steps back and lets the answer occupy the stage.

The system is light because editorial authority reads on white. The darkness lives in the hero image at the top of the wizard and in the film detail photography — desaturated, almost monochrome, like archival prints. This contrast (dark image / light content) is the system's visual signature.

**Key Characteristics:**
- Warm off-white surface stack (paper → frame → smoke → ash)
- Two typefaces: DM Mono for identifiers and film titles, DM Sans for everything the user reads
- Monochromatic palette — ink, fog, ash, smoke — with no accent colors at rest
- Hero sections use desaturated film photography against a near-black field
- All elements flat at rest; borders define structure, not shadows

## 2. Colors: The Paper Stock Palette

A warm near-white field. Depth through tonal steps, not shadows or glow.

### Surface stack (lightest to darkest)
- **Frame** (`#fdfcfb`): Cards, modals, surfaces that sit above the page
- **Paper** (`#f9f7f4`): Page background — warm off-white, the base of everything
- **Smoke** (`#eae8e5`): Subtle dividers, skeleton loading backgrounds
- **Ash** (`#ccc8c3`): Borders on interactive elements, chip pills at rest

### Text stack (darkest to lightest)
- **Ink** (`#1e1b18`): Primary text, headings, interactive element fill
- **Fog** (`#847e7a`): Secondary text, metadata labels, placeholder copy

### Dark register
- **Reel** (`#221f1c`): Near-black for hero image backgrounds, loading overlay

### Named Rules
**The Monochrome Rule.** No accent colors on interactive state. Selected chips use ink fill. Hover uses border-fog. Active nav links use border-ink underline. Color signals are carried by tone steps, not hue.

**The Hero Exception.** Hero sections intentionally use reel as background with desaturated photography. This is the system's only "dark" moment — purposeful cinema, not default darkness.

## 3. Typography: Two Voices

**Display/Heading Font:** DM Mono (weights 300/400/500), Google Fonts
**Body Font:** DM Sans (weights 300–700), Google Fonts

### Hierarchy
- **Display** (DM Mono 500, product wordmark only, tracking 0.04em)
- **Wizard Title** (DM Mono 500, `clamp(1.2rem, 2.2vw, 1.55rem)`, tracking 0.01em): Step headings
- **Archive Title** (DM Mono 500, 0.875–1rem): Film titles in the archive list
- **Label** (DM Sans 600, 0.625rem, tracking 0.18em, uppercase): Step labels, metadata keys
- **Body** (DM Sans 400, 0.875rem, line-height 1.65): All descriptive text and instructions

### Named Rules
**The Mono Scope Rule.** DM Mono is for identifiers: wordmark, step titles, film titles. Not for instructions, descriptions, or labels.

**The Two-Voice Rule.** DM Mono and DM Sans are the only typefaces.

## 4. Elevation

Flat by default. No resting shadows. Depth through tonal surface stack and 1px borders.

- **Modals / overlays**: `shadow-2xl` exclusively, on film detail modals and confirmation dialogs
- **Hover state on rows**: background tint only — no shadow, no scale
- **No hover scaling** anywhere in the system

## 5. Components

### Buttons (GlowButton)
- **Primary**: ink background, paper text, 4px radius. Hover: reel background
- **Secondary**: frame background, ink text, ash border. Hover: fog border
- No snake animations, no glow, no gradient borders

### Chip Pills
- **Unselected**: frame background, ash border, fog text
- **Selected**: ink background, ink border, paper text
- **Disabled**: 40% opacity, cursor-not-allowed

### Archive Rows
- 56–64px poster thumbnail left, content right
- Film title in DM Mono; rating, year, director, overview in fog DM Sans
- Border-bottom 1px smoke; hover: smoke background tint

### Film Detail Modal
- Bottom-sheet on mobile, centered on desktop
- Hero image: `aspect-ratio: 16/7`, `saturate(0.25) brightness(0.65)`, gradient fade to reel
- Two-column on tablet+: prose left, poster + metadata right
- Metadata labels: uppercase, fog/60, DM Sans 600 0.625rem

### Navigation
- Frame/95 background, 1px smoke border-bottom
- Wordmark: DM Mono 500 xl, text-ink
- Links: DM Sans 500 sm, fog at rest, ink on hover, 1px ink underline when active

### Loading Overlay
- reel/95 background — the system's only full-dark state
- DM Mono headline, paper text, thin indeterminate progress bar

## 6. Do's and Don'ts

### Do:
- Use the four-step surface stack for all layering (paper → frame → smoke → ash)
- Desaturate all film photography: `saturate(0.12–0.25) brightness(0.6–0.7)`
- Use DM Mono exclusively for film titles and wizard step headings
- Keep surfaces flat at rest; hover signals are border changes and background tints only

### Don't:
- Introduce accent colors — the palette is monochromatic by design
- Use glow effects, snake animations, gradient borders, or conic gradients
- Use Orbitron — DM Mono is the only display font, max weight 500
- Add resting shadows to cards or rows — shadows belong only on modals
- Scale elements on hover — archive rows use background tints only
