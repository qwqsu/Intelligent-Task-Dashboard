---
name: Lumina Dashboard System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#414751'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#717783'
  outline-variant: '#c1c7d3'
  surface-tint: '#0060ac'
  primary: '#005da7'
  on-primary: '#ffffff'
  primary-container: '#2976c7'
  on-primary-container: '#fdfcff'
  inverse-primary: '#a4c9ff'
  secondary: '#ab0a9a'
  on-secondary: '#ffffff'
  secondary-container: '#fe62e3'
  on-secondary-container: '#69005e'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a4c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#ffd7f0'
  secondary-fixed-dim: '#fface8'
  on-secondary-fixed: '#3a0033'
  on-secondary-fixed-variant: '#840076'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 40px
  card-padding: 24px
  stack-gap: 16px
---

## Brand & Style

This design system is built on the principles of **Glassmorphism**, emphasizing clarity, depth, and a high-tech "ethereal" aesthetic. It is specifically tailored for a task planning dashboard where focus and organization are paramount. The visual language aims to evoke a sense of calm, professional productivity through the use of translucent layers that mimic frosted glass.

The atmosphere is airy and modern, utilizing vibrant accent colors to guide the eye toward critical actions without overwhelming the user. The primary goal is to provide a "premium digital workspace" feel that feels lightweight yet structured. By leveraging background blurs and subtle light-refractive borders, the interface achieves a multi-dimensional depth that keeps the user's focus on the content.

## Colors

The palette is anchored by a sophisticated range of translucent whites and soft greys, designed to act as the "glass" substrate. 

- **Primary (Electric Blue):** Used for primary actions, progress indicators, and active states. It provides a crisp, high-tech contrast against the frosted surfaces.
- **Secondary (Vibrant Magenta):** Used for categorization, secondary highlights, and interactive elements like hover states to add a touch of modern vibrancy and energy.
- **Functional Colors:** A vibrant Green (#10B981) for completion and a soft Amber for warnings, ensuring utility is never sacrificed for style.
- **Gradients:** Subtle, large-scale background gradients are essential to make the glass effect visible. The app background should never be a flat solid color; use soft transitions between cool greys and off-whites to give the backdrop-blur meaningful "texture" to distort.

## Typography

This design system utilizes **Inter** for its exceptional legibility and neutral, systematic appearance. The typography strategy relies on clear hierarchies and generous line-heights to maintain the "airy" feel.

- **Weight Strategy:** Headlines use Semi-Bold and Bold weights to anchor the glass panels. Body text remains at Regular (400) weight to ensure maximum clarity over semi-transparent backgrounds.
- **Contrast:** High-level labels and metadata utilize a slightly increased letter-spacing and uppercase styling to differentiate them from task descriptions.
- **Color:** Use Slate-900 for primary text and Slate-500 for secondary/meta information. Avoid pure black to maintain the sophisticated, soft-contrast aesthetic.

## Layout & Spacing

The layout follows a **fluid grid** logic with a maximum container width of 1440px for desktop. It employs a 12-column grid for the main content area, with a fixed-width sidebar (280px) that utilizes a more intense glass blur to separate navigation from the workspace.

- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm.
- **Negative Space:** Generous padding within glass cards (24px) is required to prevent the UI from feeling cluttered, which is a common risk with glassmorphism.
- **Breakpoints:**
  - **Desktop (1024px+):** Full 12-column grid, persistent sidebar.
  - **Tablet (768px - 1023px):** 8-column grid, sidebar collapses into a glass drawer.
  - **Mobile (<767px):** Single column, margins reduced to 16px, bottom navigation or "floating" glass menu.

## Elevation & Depth

Depth is conveyed through a combination of **Backdrop Blurs** and **Inner Glows** rather than traditional heavy shadows.

- **The Glass Pane:** Every primary container must have `backdrop-filter: blur(16px)` and a background of `rgba(255, 255, 255, 0.6)`.
- **The Light Border:** A 1px solid border using `rgba(255, 255, 255, 0.3)` mimics the edge of a glass sheet, catching the light.
- **Shadows:** Use extremely soft, tinted shadows (`box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07)`). The shadow color should be a very desaturated version of the primary blue to maintain color harmony.
- **Layering:** Elements "higher" in the stack (like Modals or Tooltips) should increase blur density to 24px and slightly decrease transparency to emphasize their proximity to the user.

## Shapes

The design system uses **Rounded** (Level 2) geometry to reinforce the soft, approachable atmosphere. 

- **Cards & Panes:** Standard containers use a 1rem (16px) corner radius.
- **Interactive Elements:** Buttons and input fields use a 0.5rem (8px) radius to provide a distinct look from the larger containers they inhabit.
- **Contextual Shapes:** Progress bars and status tags utilize fully rounded (pill-shaped) ends to provide a visual break from the predominantly rectangular grid.

## Components

### Buttons
- **Primary:** Solid Electric Blue gradient with a subtle white inner glow. On hover, a slight "lift" (translateY: -2px) and an increase in glow intensity.
- **Secondary/Glass:** A more transparent glass base with a 1px border. Hover state increases the background opacity to 80%.

### Cards (Task Panes)
The core component. Features the standard glass effect. Cards should include a subtle `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)` as an overlay to simulate light hitting the surface.

### Inputs & Selects
Transparent backgrounds with a bottom-only border or a very faint 4-sided border. On focus, the border color transitions to Electric Blue with a soft outer glow.

### Lists & Tables
Rows should be separated by thin, low-opacity lines (`rgba(255,255,255,0.1)`). Hovering over a list item should trigger a "glass highlight" where that specific row becomes slightly more opaque and blurred.

### Progress Indicators
Utilize the Vibrant Magenta and Electric Blue. Use high-saturation colors for the fill and a low-opacity version of the same color for the track to maintain the translucent theme.

### Animations
- **Fade-in:** Glass panels should fade in while scaling from 98% to 100% over 400ms using a `cubic-bezier(0.16, 1, 0.3, 1)` easing.
- **Hover Transitions:** All interactive blurs and opacities should transition over 200ms for a "liquid" feel.