# Changelog

All changes to skill files are documented here.
Format: `## v[version] - [date]` with sections per skill file.

---

## v0.8.0 - 2026-02-20

### skills/angular-material-ui.md
- Added Step 2b: version detection table — maps `@angular/material` version to theming API (M2 vs M3) and correct token layer (`--mdc-*` vs `--mat-*`)
- Split Section 3 into M2 (v14–v16) and M3 (v19+) code paths with separate theme setup and override examples
- Marked v17–v18 hybrid path as inferred/untested
- Replaced BrandSync-specific theme filename in code examples with generic `material-theme.scss`
- Updated validation checklist: version detection, correct API per generation, no API mixing
- Version bumped to 1.2

---

## v0.7.0 - 2026-02-19

### skills/vue.md
- Fixed missing opening `---` frontmatter delimiter (YAML block was not valid)
- Fixed primitive token in §4 Icons: `var(--primary-600)` → `var(--color-primary-default)` (violated skill's own semantic token rule)
- Added `localStorage` persistence and `onMounted` initialization to dark mode toggle in §11 (was missing vs all other skills)
- Version bumped to 1.3

---

## v0.6.0 - 2026-02-19

### skills/angular-material-ui.md
- Fixed broken frontmatter (missing closing `---`)
- Fixed all section headers to proper markdown headings
- Fixed all code blocks (added backtick fences and language hints throughout)
- Fixed all bullet lists to proper markdown syntax
- Fixed all tables to proper markdown syntax
- Fixed checklist items to `- [ ]` format
- Removed trailing meta-commentary (planning notes that leaked into skill file)
- Fixed CRITICAL theming inaccuracy: SCSS palette must use raw hex values, not CSS variables (they don't resolve at SCSS compile time)
- Fixed style overrides to use semantic tokens instead of primitive tokens
- Removed `!important` as default — noted as last resort only
- Fixed dialog override placement (global `styles.scss`, not component scope)
- Added pre-flight section (MCP token fetch, environment check, canonical example fetch)
- Added §11 Dark Mode section
- Added §12 BrandSync Token Reference
- Version bumped to 1.1

---

## v0.5.0 - 2026-02-19

### skills/angular-vanilla-ui.md
- Added pre-flight section (MCP token fetch, environment check, canonical example fetch)
- Added `_tokens.css` import instructions for Angular (`src/styles.css` and `angular.json`)
- Added Lucide CDN script tag example in §8 Icon Protocol
- Added Angular 17+ vs <17 split in §4 (environment detection) and §7 (component patterns)
- Added `@if`/`@for` control flow patterns alongside `*ngIf`/`*ngFor` for Angular 17+
- Added §10 BrandSync Token Reference (full semantic token vocabulary)
- Added §11 Dark Mode section (was missing)
- Updated §13 Validation Checklist with token verification, CDN check, control flow check
- Renumbered sections to accommodate new additions
- Version bumped to 7.1

---

## v0.4.0 - 2026-02-19

### skills/react-material.md
- Fixed `&:disabled` → `&.Mui-disabled` (MUI applies a class, not native `:disabled`)
- Added §14 BrandSync Token Reference (full semantic token vocabulary for `sx`/`styleOverrides`)
- Added §15 Layout Patterns (page wrapper, card, sidebar+content, card grid, Stack)
- Renumbered Validation Checklist to §16
- Version bumped to 2.2

---

## v0.3.0 - 2026-02-19

### skills/react-material.md
- Fixed broken frontmatter (missing closing `---`)
- Fixed all section headers to proper markdown headings
- Fixed all bullet lists to proper markdown syntax
- Fixed broken anti-pattern table (section 12)
- Fixed version mismatch: aligned frontmatter and footer to `2.1`
- Fixed typo: `mui-theme-drivens` → `mui-theme-driven`
- Added pre-flight section (Step 1: verify tokens via MCP, Step 2: check project structure, Step 3: fetch canonical example)
- Added validation checklist (section 14)

---

## v0.2.0 - 2026-02-19

### skills/vue.md
- Major expansion: replaced minimal generic rules with full BrandSync Vue 3 adapter (pre-flight checklist, token reference, CSS isolation strategy, layout/table/modal/dropdown patterns, validation checklist)
- Added rule: never put `v-if` and `v-for` on the same element — use `<template v-for>` wrapper instead

---

## v0.1.0 - 2026-02-19

### skills/vue.md
- Initial release with rules for: component structure, props/emits, reactivity, template, slots, styling, TypeScript
