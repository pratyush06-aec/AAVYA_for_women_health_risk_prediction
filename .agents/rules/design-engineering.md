# Design Engineering & Motion Craft (Emil Kowalski)

When writing or modifying any user interface, component, animation, or interaction:

## 1. Core Philosophy & Taste
- **Unseen details compound:** The goal of craft is invisible correctness. When an interaction behaves exactly as assumed, users feel quality without knowing why.
- **Never animate keyboard actions:** Actions repeated 100+ times/day get zero animation (command palette toggles, shortcuts, hotkeys).
- **Sub-300ms UI motion:** Keep dropdowns, tooltips, buttons, and selects snappy (<300ms). Only modals, drawers, and toasts may run 300-500ms.

## 2. Easing & Curves
- **Never use `ease-in` for UI animations:** It delays initial movement and feels sluggish.
- **Entrances and exits:** Use `ease-out` (starts fast, feels immediately responsive).
- **Custom curves over CSS defaults:**
  - Strong UI ease-out: `cubic-bezier(0.23, 1, 0.32, 1)`
  - Moving/morphing on screen: `cubic-bezier(0.77, 0, 0.175, 1)` (ease-in-out)
  - Drawers/sheets: `cubic-bezier(0.32, 0.72, 0, 1)`

## 3. Physical Springs & Interruptibility
- Prefer springs for gestures, dragging, and interruptible state (Apple style: `{ type: "spring", duration: 0.5, bounce: 0 }` for clean UI).
- Springs preserve momentum when interrupted; keyframes restart from zero.

## 4. Tactile Micro-Interactions
- **Active press feedback:** `transform: scale(0.97)` on `:active` for responsive button feedback.
- **Popover transform-origin:** Origin stays at the trigger element (modals stay centered).
- **Avatars & icons:** Always `flex-shrink: 0` to prevent oval squishing.
- **Typography:** Large headings use tighter tracking (`-0.02em`). Body text capped at `max-width: 65ch`. Numbers use `tabular-nums`.
- **Perceived speed:** Faster spinners and instant tooltips across grouped elements make the entire app feel fast.
