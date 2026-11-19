# Interface Polish Principles (Make Interfaces Feel Better)

When writing or modifying any user interface code (components, styles, animations, layouts):

## 1. Surfaces & Geometry
- **Concentric Border Radius:** Outer radius = inner radius + padding. Never eyeball nested radii.
- **Optical Alignment:** When geometric centering looks unbalanced (buttons with icons, play triangles, badges), adjust manually for optical weight.
- **Shadows for Elevation, Borders for Structure:** Use layered transparent `box-shadow` for depth; reserve borders for dividers, state, and focus indicators.
- **Image Outlines:** Add a 1px outline with low opacity (`oklch(0 0 0 / 0.1)` in light mode, `oklch(1 0 0 / 0.1)` in dark mode); never use tinted grays.
- **Minimum Hit Area:** Maintain at least 44x44px (touch/mobile) or 40x40px (dense desktop).

## 2. Typography
- **Font Smoothing:** Apply `-webkit-font-smoothing: antialiased` on root layout for crisper text.
- **Tabular Numbers:** Always use `font-variant-numeric: tabular-nums` (or `tabular-nums` in Tailwind) for dynamic or updating numbers.
- **Text Wrapping:** Use `text-wrap: balance` on headings and `text-wrap: pretty` on body text to prevent orphans.

## 3. Motion & Micro-interactions
- **Scale on Press:** Use `scale(0.96)` for tactile button press feedback. Never below `0.95`.
- **Interruptible Transitions:** Use CSS transitions for state changes; avoid un-interruptible keyframes for interactive states.
- **Never `transition: all`:** Always specify exact transition properties (`transform, opacity`).
- **Motion Restraint:** Stagger enter animations (~100ms) only for staged hierarchy entrances, never routine high-frequency interactions.
- **Icon Sizing & Weights:** Match icon stroke weight to adjacent text weight (1.5px for regular 400, 2px for semibold 600). Use `currentColor` on a single SVG asset rather than swapping images.
