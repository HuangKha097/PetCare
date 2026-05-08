---
name: PetCare
description: A comprehensive ecosystem for premium pet wellness and e-commerce.
colors:
  primary: "#F4D35E"
  primary-dark: "#d6b541"
  surface: "#f5f7f6"
  surface-container-low: "#eff1f0"
  surface-container-high: "#e0e2e1"
  surface-container-highest: "#d1d3d2"
  surface-container-lowest: "#ffffff"
  on-background: "#2c2f2f"
  on-surface-variant: "#5c5f5f"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  xl: "16px"
  full: "9999px"
spacing:
  section: "64px"
  gap: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.xl}"
    padding: "12px 32px"
  card:
    backgroundColor: "{colors.surface-container-lowest}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: PetCare

## 1. Overview

**Creative North Star: "The Modern Menagerie"**

PetCare balances the warmth of a local pet community with the precision of a professional medical institution. It avoids the cluttered, high-saturation tropes of legacy pet stores, opting instead for a refined, editorial-inspired aesthetic. The system uses soft, organic shapes (large radii) and a "sun-drenched" palette to evoke comfort and trust.

**Key Characteristics:**
- **Warm Precision**: Organic curves meet a rigorous grid.
- **Sun-Drenched Neutrals**: A primary yellow accent supported by soft, layered grays.
- **Emotional Typography**: Bold, black-weight headlines that feel authoritative yet friendly.

## 2. Colors

The palette is anchored by a warm, buttery primary yellow, supported by a sophisticated range of tinted neutrals that provide depth without using pure black or white.

### Primary
- **Golden Retriever** (#F4D35E): Used for primary CTAs, active states, and brand highlights. It represents energy and optimism.
- **Roasted Malt** (#d6b541): A deeper variant used for hover states and text contrast on light backgrounds.

### Neutral
- **Fresh Linen** (#ffffff): The base for cards and elevated surfaces.
- **Morning Mist** (#f5f7f6): The primary background color.
- **Pebble** (#eff1f0): Used for low-level containers and section backgrounds.
- **Charcoal** (#2c2f2f): The primary text color. Never use pure #000.

### Named Rules
**The 10% Gold Rule.** The primary yellow accent is used on ≤10% of any given screen. Its rarity makes it a powerful signal for action.

## 3. Typography

**Display Font:** Inter (with Noto Sans fallback)
**Body Font:** Inter (with Noto Sans fallback)

**Character:** The system relies on weight contrast rather than family contrast. By pushing Inter to its "Black" (900) weight for displays, we achieve a modern, impactful look that remains highly readable.

### Hierarchy
- **Display** (Black/900, clamp(2.5rem, 5vw, 4.5rem), 1.1): Hero headlines and major section titles.
- **Headline** (Bold/700, 2rem, 1.2): Component headings and card titles.
- **Body** (Regular/400, 1rem, 1.6): All long-form text and descriptions.
- **Label** (Bold/700, 0.75rem, 0.1em letter-spacing): Badges, categories, and uppercase metadata.

## 4. Elevation

Depth is conveyed through tonal layering rather than heavy shadows. We use subtle shifts in surface color to distinguish between levels of importance.

### Shadow Vocabulary
- **Ambient Glow** (`box-shadow: 0 16px 40px -8px rgba(0,0,0,0.10)`): Used exclusively on hover for cards to indicate interactivity.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows are a reactive state, appearing only when the user interacts with an element.

## 5. Components

### Buttons
- **Shape:** Large organic curves (16px radius).
- **Primary:** High-contrast Golden Retriever (#F4D35E) with bold charcoal text.
- **Secondary:** Tonal gray (#e0e2e1) with subtle hover transitions.
- **States:** Interactive elements scale slightly (105%) on hover to feel tactile.

### Cards
- **Style:** Clean white (#ffffff) containers with soft 16px corners.
- **Interaction:** Cards lift and gain a soft shadow on hover to encourage exploration.

### Navigation
- **Style:** Minimal and transparent, or glassmorphism (white/80 with backdrop-blur) to maintain context.

## 6. Do's and Don'ts

### Do:
- **Do** lead with high-quality pet photography.
- **Do** use the full 16px radius for all interactive containers.
- **Do** maintain ample whitespace (64px+) between major sections.

### Don't:
- **Don't** use generic pet icons or cartoonish illustrations.
- **Don't** use pure #000 or #fff for backgrounds; always use tinted neutrals.
- **Don't** use gradients or glassmorphism as a default; save them for special emphasis.
