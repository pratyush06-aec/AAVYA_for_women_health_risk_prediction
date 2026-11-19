# Google Stitch UI & Design System Guidelines

When designing, generating, or modifying screens with Stitch MCP or frontend UI code:

## 1. Design Token Integrity
- Always check if a project design system exists (`list_design_systems`).
- When generating screens, never hardcode random hex colors or unlinked theme properties if a design system is present. Direct prompts to layout, content, and structure; let Stitch apply the project design system tokens.
- Generate or upload clean, cohesive `DESIGN.md` files (`upload_design_md`, `create_design_system_from_design_md`) to establish typography, color palettes, and surface contrast.

## 2. Professional UI/UX Prompting Pipeline
- Refine vague terms into precise design tokens and layout specifications (e.g., "sticky navigation bar with glassmorphism" instead of "nice header").
- Maintain consistent component terminology across screens and variants.
- Structure responsive viewports intentionally (mobile, tablet, desktop).

## 3. Component Extraction & Conversion
- Convert generated Stitch screens into modular, production-ready components following the repository's framework conventions (React, Vue, Svelte, or Vanilla).
- Strip out inline mockup styling artifacts and bind directly to semantic project tokens and headless primitives.
