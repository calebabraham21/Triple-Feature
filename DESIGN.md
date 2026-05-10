---
name: Triple Feature
description: Movie recommendation engine that gives you three curated picks instead of infinite scroll.
colors:
  film-burn: "#ff4444"
  emulsion-blue: "#4a9eff"
  end-reel-flare: "#8b5cf6"
  projection-arc: "#fbbf24"
  projection-booth: "#0a0a0a"
  lamphouse: "#1a1a1a"
  exposure: "#2a2a2a"
  silver-edge: "#3a3a3a"
typography:
  display:
    fontFamily: "DM Mono, monospace"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.05em"
  headline:
    fontFamily: "DM Mono, monospace"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0.02em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 600
    fontSize: "1.125rem"
    lineHeight: 1.4
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 600
    fontSize: "0.75rem"
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  md: "8px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.lamphouse}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.exposure}"
  button-secondary:
    backgroundColor: "{colors.exposure}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  movie-card:
    backgroundColor: "{colors.lamphouse}"
    rounded: "{rounded.lg}"
    padding: "0px"
  card:
    backgroundColor: "{colors.lamphouse}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Triple Feature

## 1. Overview

**Creative North Star: "The Trusted Recommendation"**

Triple Feature is built around the credibility of a personal voice. Not an algorithm, not a rating aggregator: a friend with a dog-eared notebook who has seen everything and tells you exactly what to put on. The design system holds that posture in every detail — dark surfaces that take film seriously, typography with authority, interactions that reward attention rather than demanding it.

The system is dark because the content demands it. Not dark as a trend, not dark to signal "professional tool" — dark because this is a projection-room experience. The user is in a seat, the lights have gone down, and three choices are about to appear. Everything around that moment should recede. The backgrounds hold back; the content steps forward.

Against the near-black field, the accents read as photochemical events: a film burn at the edges, an emulsion-blue light leak bleeding across the frame, the purple flare of end-of-reel celluloid. These are not decorative highlights. They mark state, signal interactivity, and confirm selection. Their rarity is the point.

**Key Characteristics:**
- Near-black surface stack (four steps from `#0a0a0a` to `#3a3a3a`) creates depth without shadows
- Two typefaces: Orbitron for identifiers and titles, DM Sans for everything the user reads
- Accents evoke photochemical imperfection, not generic UI convention
- All elements are flat at rest; they earn their lift on hover and active state
- The creator's personal voice is an explicit design ingredient, not a branding afterthought

## 2. Colors: The Film Stock Palette

A near-black field with four accent colors that read as photochemical events rather than UI convention.

### Primary
- **Film Burn** (`#ff4444`): The loudest accent. CTA glow, the animated `glow` keyframe, primary loading indicator. Reads as a film-burn light leak at the frame edge. Used sparingly; its rarity is its authority.

### Secondary
- **Emulsion Blue** (`#4a9eff`): Active navigation states, background atmospheric haze in `.app-gradient`, the right edge of the snake-border sweep, hover underlines on nav links. The blue of a projector's throw through smoke. Cool and spatial.

### Tertiary
- **End-Reel Flare** (`#8b5cf6`): Hover states, the gradient bridge between Emulsion Blue and Film Burn in multi-color transitions, the left edge of the `.side-rails` gradient. The purple bleed of celluloid at end of reel. Less frequent than red or blue; marks state transitions.
- **Projection Arc** (`#fbbf24`): Rating badges and star icons only. The color of the arc lamp. Not an action color, not a hover color.

### Neutral
- **Projection Booth** (`#0a0a0a`): Page background. The darkest surface. Light-absorbing but not pure black — it has presence.
- **Lamphouse** (`#1a1a1a`): Primary surface. Card backgrounds, nav body, modal shells.
- **Exposure** (`#2a2a2a`): Secondary surface. Borders on interactive elements at rest, hover backgrounds on secondary buttons, skeleton shimmer base.
- **Silver Edge** (`#3a3a3a`): Tertiary surface. Borders on interactive elements at rest, dividers, the outer edge of the tonal stack.

### Named Rules
**The Rarity Rule.** Film Burn and End-Reel Flare appear only on interactive state and meaningful emphasis. They must not appear as background fills on static content. If either is visible at rest, it has lost its signal.

**The App-Gradient Rule.** The page background is `.app-gradient`: Emulsion Blue radial hazes layered over Projection Booth, not a flat `#0a0a0a`. Any new full-bleed background must honor this atmospheric base — the haze is the room, not a decoration.

## 3. Typography: Two Voices

**Display/Heading Font:** DM Mono (weights 300/400/500), Google Fonts
**Body Font:** DM Sans (weights 300–700), Google Fonts

**Character:** DM Mono carries the film identity — quiet, technical, monospaced, like a film slate or editing terminal. DM Sans is the readable counterpart: a warm geometric sans that makes everything DM Mono sets up legible and approachable. The pairing creates a deliberate split between the cinematic identifier and the human explanation.

### Hierarchy
- **Display** (DM Mono 500, logo and hero title, line-height 1, letter-spacing 0.05em): The film's title card. Used for the product mark and hero-level identity text only.
- **Headline** (DM Mono 500, ~1.5–2rem, line-height 1.15, letter-spacing 0.02em): Section headers, wizard step labels, results headers. Should feel like a chapter title in a film encyclopedia.
- **Title** (DM Sans 600, 1.125rem, line-height 1.4): Movie titles in cards, modal subheads, component-level headings. The bridge between Orbitron-level identity and readable body text.
- **Body** (DM Sans 400, 1rem, line-height 1.6): All descriptive text, about-page copy, wizard instructions, taglines. Max line length 65–75ch.
- **Label** (DM Sans 600, 0.75rem, line-height 1, letter-spacing 0.08em, uppercase): Badges (year, runtime, language, rating), step indicators, meta tags on movie cards.

### Named Rules
**The Two-Voice Rule.** DM Mono and DM Sans are the only typefaces. System-ui is a last-resort fallback only. A third typeface breaks the pairing.

**The Mono Scope Rule.** DM Mono is for identifiers: the product name, section titles, step headings. It is not for instructions, descriptions, or anything the user reads for more than three seconds. DM Sans handles the rest.

## 4. Elevation

Triple Feature is flat by default. No ambient shadows appear on static elements; depth is communicated entirely through the tonal step from Projection Booth through to Silver Edge.

Elevation is earned, not assumed. When an element is interactive, it declares itself through the hover state: scale(1.05) on cards, the snake-border animation on buttons, the glow pulse on CTA elements. The lift is the event, not the resting posture.

### Shadow Vocabulary
- **Glow Pulse** (`0 0 5px #ff4444, 0 0 10px #ff4444, 0 0 15px #ff4444` alternating to `0 0 10px/20px/30px`): Used exclusively on the `.glow` animation keyframe. CTA-level emphasis. Not for general use.
- **Card Lift** (Tailwind `shadow-lg` → `shadow-2xl` on hover): Applied on movie-card and generic card hover. A structural shadow that says "this surface is now above the plane."
- **Inner Focus Ring** (`0 0 0 2px rgba(255,255,255,0.12) inset, 0 4px 10px rgba(0,0,0,0.25)`): Appears inside `.trace-snake` on hover. Confirms the active state without changing the element's footprint.

### Named Rules
**The Flat-By-Default Rule.** No element carries a resting shadow. Hover is the only trigger for lift. A shadow on a static element is noise; remove it.

## 5. Components

### Buttons
Triple Feature has one canonical button component (`GlowButton`) in two variants. It is visually quiet at rest: dark background, thin border, white text. On hover, four trace lines chase the perimeter in sequence — top, right, bottom, left — over ~600ms with staggered delays. A conic-gradient ring sweeps once and holds.

- **Shape:** Gently rounded corners (8px, `rounded-lg`)
- **Primary:** Lamphouse background (`#1a1a1a`), Exposure border (`#2a2a2a`), white text, semibold (600), `px-6 py-3`
- **Secondary:** Exposure background (`#2a2a2a`), Silver Edge border (`#3a3a3a`), white text, medium (500), `px-4 py-2`
- **Hover:** Snake trace animation (four spans, 0.35s each, delays 0s / 0.08s / 0.17s / 0.25s), inner glow ring, conic-gradient sweep in Emulsion Blue and Film Burn completing in one pass
- **Disabled:** 50% opacity, pointer-events none, no hover state

### Chips / Preference Pills
Used in the wizard flow for genre, decade, and runtime selection.

- **Unselected:** Lamphouse background, Silver Edge border, white/80 text
- **Selected:** Tinted accent background (Emulsion Blue tint for genre/decade, Film Burn tint for active runtime), white text, accent-colored border
- **Locked / Max-reached:** Unselectable chips drop to 50% opacity. Maximum two genres enforced.

### Cards
**Movie Card** (`.movie-card`): Poster-first. Lamphouse background, rounded-xl (12px), Silver Edge border at rest. On hover: scale(1.05), shadow-2xl lift, gradient border reveal (End-Reel Flare → Emulsion Blue → Film Burn, 1px, CSS mask technique). The gradient border is the card's signature and must not appear at rest.

**Generic Card** (`.card`): Used for stats, content blocks, and structured information. Lamphouse background, rounded-xl, Silver Edge border. Hover: scale(1.05), Emulsion Blue border, shadow lift. Internal padding: 24px.

### Navigation
Fixed to the top. Backdrop: `movie-posters.jpg` at `blur-xl` and 40% opacity, overlaid with `bg-black/60` and a Film Burn/End-Reel Flare/Emulsion Blue gradient wash at 10–15% opacity. Creates the sense of a cinema lobby: contextual, atmospheric, not decorative.

- **Logo:** Image mark only (TripFeatLogo.png), no wordmark beside it. Links home.
- **Links:** DM Sans medium (500), `text-base`, white/80 at rest, white on hover. Active: Emulsion Blue. Hover: underline slides in from left via pseudo-element, transitioning from gradient-to-purple.
- **Mobile:** Right-side drawer via React Portal. Glass background (`rgba(0,0,0,0.6)` + `blur(6px)`), left border at `rgba(255,255,255,0.15)`. Nav items stagger in at 25ms intervals via Framer Motion (`staggerChildren: 0.025`).

### Signature Component: The Snake Border
The system's signature interaction. Four absolutely-positioned trace spans animate sequentially on hover, tracing the element's perimeter as if a spotlight is sweeping it. The sweep completes in ~600ms. A conic-gradient variant (CSS `@property --angle`) provides a complementary spinning ring on buttons.

Applied to: `GlowButton`, preference chips, and interactive cards. Not used on plain text links or static content.

## 6. Do's and Don'ts

### Do:
- **Do** use Orbitron for product-identity text (the product name, section titles, wizard step headings) and DM Sans for everything the user actually reads.
- **Do** keep accents rare. Film Burn and End-Reel Flare are state signals, not decoration. If they appear more than 10% of a given surface at rest, pull back.
- **Do** start any new full-bleed background from `.app-gradient` — the radial Emulsion Blue hazes over Projection Booth. The atmosphere is the product.
- **Do** use scale(1.05) plus shadow-2xl as the hover treatment for cards. The scale is the affordance; the shadow follows.
- **Do** apply the snake border to every interactive element that isn't a plain text link. It's the system's handshake with the user.
- **Do** use the four-step neutral scale (Projection Booth, Lamphouse, Exposure, Silver Edge) for surface layering. Never introduce a fifth neutral.

### Don't:
- **Don't** build a Letterboxd. Triple Feature has no community layer, no film diary, no social feed, no critic scores. No Tomatometer badges, no review counts, no "people who liked X" rows.
- **Don't** build a Netflix or streaming service interface. No infinite scroll grids, no genre carousels, no "because you watched" recommendations. The product is three answers, not forty options.
- **Don't** build a generic SaaS dark mode. No dark-blue sidebar plus card grid template. The dark aesthetic is earned from cinema, not borrowed from Notion's dark theme or a B2B dashboard. If a new screen could be mistaken for enterprise software, rework it.
- **Don't** use `border-left` greater than 1px as a colored accent stripe on cards, callouts, or list items. Rewrite with background tints, full borders, or nothing.
- **Don't** use gradient text (`background-clip: text` with a gradient fill). Use solid Film Burn, Emulsion Blue, or white. Emphasis through weight or size.
- **Don't** use glassmorphism decoratively. `.glass-effect` exists for the mobile nav drawer and modal overlays only. It is not a default card treatment.
- **Don't** add resting shadows to static elements. Shadows appear only on hover. A resting shadow is noise.
- **Don't** let Projection Arc (`#fbbf24`) migrate beyond its role. It's for star ratings and score badges. It is not an action color, CTA color, or hover color.
