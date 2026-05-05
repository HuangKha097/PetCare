---
name: Vibrant Paws Editorial
colors:
  surface: '#f8faf9'
  surface-dim: '#d9dada'
  surface-bright: '#f8faf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f3'
  surface-container: '#edeeee'
  surface-container-high: '#e7e8e8'
  surface-container-highest: '#e1e3e2'
  on-surface: '#191c1c'
  on-surface-variant: '#4c4638'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f0'
  outline: '#7d7766'
  outline-variant: '#cec6b2'
  surface-tint: '#715d03'
  primary: '#524300'
  on-primary: '#ffffff'
  primary-container: '#6e5a00'
  on-primary-container: '#efd374'
  inverse-primary: '#e0c568'
  secondary: '#3a608d'
  on-secondary: '#ffffff'
  secondary-container: '#a7ccff'
  on-secondary-container: '#2f5683'
  tertiary: '#6a3600'
  on-tertiary: '#ffffff'
  tertiary-container: '#8d4a00'
  on-tertiary-container: '#ffc9a2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fde180'
  primary-fixed-dim: '#e0c568'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#554500'
  secondary-fixed: '#d3e4ff'
  secondary-fixed-dim: '#a4c9fc'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#204874'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77e'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f8faf9'
  on-background: '#191c1c'
  surface-variant: '#e1e3e2'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 4.5rem
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.875rem
    fontWeight: '800'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '700'
    letterSpacing: 0.05em
  price-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '900'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  section-padding: 80px
  card-gap: 32px
---

## Brand & Style

The brand identity is **friendly, premium, and energetic**. It targets discerning pet owners who view their pets as family members deserving of high-quality, curated products. The visual style is a hybrid of **Modern Corporate** and **Editorial Asymmetry**, utilizing clean layouts with unexpected "organic" touches like rotated images and large-scale blurs. 

The emotional goal is to evoke a sense of joy and reliability. This is achieved through a warm color palette, approachable rounded shapes, and high-quality photography that feels lived-in rather than staged. The design avoids the clinical feel of traditional pet stores, opting instead for a lifestyle-focused, boutique aesthetic.

## Colors

The palette is rooted in **earthy, sun-drenched tones**. The primary "Harvest Gold" (#6E5A00) provides a sophisticated take on warmth, paired with a soft "Sky Blue" (#375D8A) for secondary actions and high-visibility containers. 

The neutral foundation uses a desaturated, cool-gray range for surfaces to allow the vibrant product photography to stand out. Surface stacking is critical: use `surface-container-lowest` (pure white) for elevated interactive elements and `surface-container-low` for large section backgrounds to create subtle rhythm without heavy borders.

## Typography

The system utilizes a dual-type scale. **Plus Jakarta Sans** is the "voice" of the brand, used for high-impact headlines and personality-driven UI like prices. Its rounded terminals mirror the "friendly pet" brand attribute. **Inter** handles the functional heavy lifting for body copy and metadata, ensuring high legibility across product descriptions.

Key styling rules:
- Use **Extra Bold (800) or Black (900)** for primary headlines to create a strong editorial hierarchy.
- Tighten letter spacing on large displays to maintain visual density.
- Use uppercase labels for small navigational or category markers to provide distinct contrast from body text.

## Layout & Spacing

The layout follows a **Fixed Grid** model with a maximum width of 1280px, centered on the screen. It utilizes a generous 8pt spacing system. Vertical rhythm is defined by large section breaks (80px to 96px) to give content "room to breathe," reflecting the premium positioning.

Grid patterns:
- **Hero:** 50/50 split on desktop, transitioning to single-column stacked on mobile.
- **Product Grids:** 4-column layout on desktop, 1-column on mobile.
- **Categories:** 5-column layout to create a "ribbon" effect.
- **Horizontal Strips:** Full-width promo banners provide a break in the vertical grid flow.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**. 

1. **Surfaces:** Use `surface-container-low` for section backgrounds and `surface-container-lowest` (white) for cards and interactive inputs to create a natural "lift."
2. **Shadows:** Shadows should be extremely soft and diffused (e.g., `0 4px 20px rgba(0,0,0,0.05)`). Higher elevation elements like the Floating Navigation Bar use a larger blur radius but maintain low opacity to avoid a dated "heavy" look.
3. **Glassmorphism:** The Header uses a 70-80% opaque white background with a high blur (backdrop-filter: blur(24px)) to maintain context while keeping content legible.

## Shapes

The shape language is **Ultra-Rounded (Pill-shaped)**. This communicates safety and approachability. 

- **Primary Buttons:** Always use full pill-shaped corners (`rounded-full`).
- **Cards:** Use `rounded-xl` (1.5rem to 2rem) for a modern, friendly feel.
- **Interactive Containers:** Category icons and small tags use `rounded-full`.
- **Special Imagery:** Editorial images feature "soft" corners (`rounded-xl`) and occasional slight rotations (3-5 degrees) to break the rigid digital grid.

## Components

### Buttons
- **Primary:** Pill-shaped, `bg-primary`, `text-on-primary`, bold typography. Hover state: `scale-105` and slight brightness shift.
- **Outline/Secondary:** Pill-shaped, transparent background, `border-outline-variant/20`.

### Cards
- **Product Card:** White background, soft shadow, overflow-hidden. Image area should have a consistent aspect ratio (1:1). Include a "Best Seller" badge in a top corner using the primary brand color.
- **Category Card:** Large emoji or icon center-aligned, `bg-surface-container-low`, transitioning to `bg-primary-container` on hover.

### Navigation
- **Top Bar:** Sticky, glassmorphic blur, bold branding.
- **Mobile Dock:** High-contrast floating bar at the bottom with pill-shaped active state indicators for the current page.

### Feedback & Inputs
- **Newsletter Input:** Pill-shaped, no border, light gray background.
- **Star Ratings:** Use `tertiary` (warm orange) for filled stars to denote quality.