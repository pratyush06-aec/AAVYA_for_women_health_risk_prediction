# UI Baseline & Deslop Guidelines (ibelick / ui-skills)

Apply these rules when writing, modifying, or reviewing any frontend, component, or layout code:

## 1. Baseline Hygiene & Deslop
- **No AI slop:** Never introduce unrequested gradients (especially purple/multicolor), floating glow effects, or decorative bloat.
- **Viewport height:** Never use `h-screen`; always use `h-dvh` to avoid mobile browser address bar clipping.
- **Safe areas:** Always respect `safe-area-inset` for fixed or absolute bars, dialogs, and sheets.
- **Class management:** Use `cn` (`clsx` + `tailwind-merge`) for dynamic class composition.
- **Sizing:** Use `size-*` for square elements instead of separate `w-* h-*`.

## 2. Accessible Components & Interactions
- **Primitives first:** Use accessible headless primitives (`Base UI`, `Radix`, `React Aria`) for keyboard, dialog, dropdown, and focus management. Never rebuild complex focus/keyboard state by hand.
- **Icon controls:** Every icon-only button must have an explicit `aria-label` or `aria-labelledby`.
- **Destructive safety:** Always gate irreversible or destructive actions behind an `AlertDialog`.
- **Form dignity:** Never block paste in inputs or textareas. Place validation errors directly adjacent to the input.
- **Empty states:** Every empty state must offer one clear, affirmative primary next action.

## 3. Motion & Compositor Boundaries
- **Compositor only:** Never animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`). Animate exclusively `transform` and `opacity`.
- **No blur thrashing:** Never animate heavy backdrop filters or `blur()` on expanding/scrolling containers.
- **Feedback budget:** Interaction feedback transitions must settle in under 200ms.
