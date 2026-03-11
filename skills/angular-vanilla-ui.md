---
name: angular-ui
description: Deterministic Angular execution engine that reproduces canonical BrandSync UI output using native Angular architecture. Reference-driven. No invention.
version: 7.2
execution_mode: strict
error_policy: fail-hard
component_strategy: blueprint-driven
ui_philosophy: angular-reproduces-canonical-output
---

# Angular UI Execution Doctrine (Blueprint Model)

This skill reproduces canonical BrandSync UI output using Angular-native implementation.

Canonical HTML/CSS is a blueprint.
Angular is the execution engine.

The final rendered Angular UI must match the canonical visual and structural output,
but must be implemented entirely inside Angular component architecture.

---

# 0. Pre-Flight — Do This BEFORE Writing Any Code

## Step 1: Verify the tokens file

Always fetch the canonical tokens from the MCP server and compare against the project:

```
mcp__brandsync-mcp-server__get_tokens
```

Check that `src/styles.css` imports `_tokens.css` and contains all semantic tokens:
- `--surface-container`, `--surface-base`, `--surface-hover`
- `--color-primary-default`, `--color-primary-hover`
- `--text-action`, `--text-on-action`, `--text-secondary`
- `--spacing-25` through `--spacing-800`
- `--border-radius-50` through `--border-radius-full`
- `--border-primary-focus`, `--border-neutral-container`

If ANY are missing, replace `_tokens.css` with the full canonical version before proceeding. Undefined CSS variables fail silently and break layout/color without any error.

**Angular token import — add to `src/styles.css`:**
```css
@import './assets/_tokens.css';
```

Or register in `angular.json` styles array:
```json
"styles": ["src/assets/_tokens.css", "src/styles.css"]
```

## Step 2: Check Angular environment

Read `package.json` to determine:
- Angular version (affects control flow syntax and signal availability)
- Whether Angular Material is present (do NOT use it — see §4)
- Whether the project uses standalone components or NgModule

## Step 3: Fetch the canonical example

```
mcp__brandsync-mcp-server__get_example  (name: "PageName")
```

Study the full HTML + CSS before writing a single line of code. The canonical defines the visual target AND the DOM structure for Angular.

---

# 1. Canonical Blueprint Rule (CRITICAL — FIRST PRINCIPLE)

BrandSync HTML/CSS is REFERENCE ONLY.

It defines:
- Visual output
- DOM hierarchy
- Class names
- Layout structure
- Token usage

It is NOT:
- A copy-paste source
- A standalone HTML deliverable
- The final output format
- A static page implementation

Angular must implement an equivalent UI that matches the canonical rendered result.

Direct static HTML page output is invalid.
Raw HTML/CSS copy responses are invalid.
Standalone markup without Angular component structure is invalid.

Rendered result must match canonical.
Implementation must be Angular-native.

---

# 2. Core Law

1. 🔴 Canonical UI output must be reproduced exactly
2. 🟡 Angular executes the blueprint
3. ❌ No external UI libraries
4. ❌ No pure HTML/CSS responses
5. ❌ No structural reinterpretation
6. ❌ No layout invention beyond canonical system

If request exceeds canonical scope:
- State limitation clearly
- Provide canonical-compliant implementation only

---

# 3. Authority Separation

Canonical owns:
- Structure
- Layout hierarchy
- Class system
- Tokens
- Visual fidelity

Angular owns:
- State
- Lifecycle
- Interaction
- Rendering logic
- DOM updates
- Initialization
- Environment detection

Angular reproduces canonical output.
Angular does not rewrite canonical structure.

---

# 4. Angular Environment Detection (MANDATORY)

Before implementation, detect:

- Angular version
- Angular Material presence
- Standalone vs NgModule
- Strict mode
- SSR

**If Angular Material detected:**
- Do NOT use it
- Do NOT import it
- Ignore it completely

**If Angular < 17:**
- Use `*ngIf` / `*ngFor` structural directives
- Import `CommonModule` in standalone components
- Avoid Signals
- Use RxJS safely — no constructor subscriptions

**If Angular 17+:**
- Prefer `@if` / `@for` / `@switch` built-in control flow (no imports needed)
- Prefer signals for simple state (`signal()`, `computed()`)
- No constructor subscriptions

Environment awareness must influence implementation strategy.

---

# 5. Structural Fidelity Enforcement

The Angular-rendered DOM must:

- Preserve canonical DOM hierarchy
- Preserve class names exactly
- Preserve wrapper structure
- Preserve layout nesting
- Preserve token usage

**Allowed Angular additions:**
- `@if` / `@for` (Angular 17+) or `*ngIf` / `*ngFor` (< 17)
- `(click)` and event bindings
- Property bindings `[class]`, `[style]`
- Interpolation `{{ }}`

**Forbidden:**
- Removing wrappers
- Changing nesting levels
- Renaming classes
- Refactoring layout
- Simplifying DOM
- Altering spacing tokens
- Creative restructuring

Visual match and structural fidelity are mandatory.

---

# 6. Hard Constraints

Never:
- ❌ Angular Material components
- ❌ PrimeNG
- ❌ Bootstrap
- ❌ Tailwind
- ❌ CSS frameworks
- ❌ Constructor subscriptions
- ❌ Deprecated Angular APIs
- ❌ Standalone static HTML output

Always:
- ✅ Standalone Angular components
- ✅ Phosphor Icons via `@phosphor-icons/webcomponents` npm package (imported once in `main.ts`)
- ✅ `CUSTOM_ELEMENTS_SCHEMA` in every component that uses `<ph-*>` elements
- ✅ Theme persistence via `localStorage`
- ✅ Desktop-first responsive approach
- ✅ Strict TypeScript compliance

---

# 7. Mandatory Angular Component Pattern

## Angular 17+ (signals + new control flow)

```ts
import { Component, signal, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-name',
  standalone: true,
  imports: [NgClass],  // CommonModule not needed for @if/@for
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // required for <ph-*> Phosphor web components
  templateUrl: './name.component.html',
  styleUrl: './name.component.css'
})
export class NameComponent implements OnInit {
  isCollapsed = signal(false);
  activeItem = signal('dashboard');
  items = signal([{ id: 'dashboard', label: 'Dashboard' }]);

  ngOnInit() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }
}
```

```html
<!-- Angular 17+ control flow -->
@if (isCollapsed()) {
  <span class="nav-label">Label</span>
}

@for (item of items(); track item.id) {
  <a class="nav-item" [class.nav-item--active]="activeItem() === item.id">
    {{ item.label }}
  </a>
}
```

## Angular < 17 (RxJS + structural directives)

```ts
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-name',
  standalone: true,
  imports: [CommonModule],  // provides *ngIf, *ngFor, NgClass, NgStyle
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // required for <ph-*> Phosphor web components
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css']  // array syntax for < 17
})
export class NameComponent implements OnInit {
  isCollapsed = false;
  activeItem = 'dashboard';

  ngOnInit() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }
}
```

```html
<!-- Angular < 17 structural directives -->
<span *ngIf="!isCollapsed" class="nav-label">Label</span>

<a *ngFor="let item of items"
   class="nav-item"
   [class.nav-item--active]="activeItem === item.id">
  {{ item.label }}
</a>
```

Pure markup without Angular lifecycle integration is invalid.

---

# 8. Icon Protocol

BrandSync designs use Phosphor Icons. Always use the `@phosphor-icons/webcomponents` npm package — never a CDN script tag.

**Install (once per project):**
```
npm i @phosphor-icons/webcomponents
```

**Import once in `main.ts`:**
```ts
import '@phosphor-icons/webcomponents';
```

**Add `CUSTOM_ELEMENTS_SCHEMA` to every component that uses `<ph-*>` elements:**
```ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  ...
})
```

**Use `<ph-*>` elements in templates:**
```html
<ph-magnifying-glass size="20" style="color: var(--icon-default)"></ph-magnifying-glass>
<ph-bell size="20" weight="fill" style="color: var(--icon-action)"></ph-bell>
<ph-plus size="16" style="color: var(--icon-on-action)"></ph-plus>
```

Icon names are kebab-case Phosphor names prefixed with `ph-`. Weight via `weight` attribute: `thin`, `light`, `regular` (default), `bold`, `fill`, `duotone`.

No `createIcons()`. No re-initialization after DOM mutations. Phosphor web components self-register and render wherever `<ph-*>` elements appear in the DOM.

Do NOT use `data-lucide` attributes, CDN script tags, or the Lucide library.

---

# 9. Responsive Rule

Desktop-first only:

```css
@media (max-width: 1024px) {}
@media (max-width: 768px)  {}
@media (max-width: 480px)  {}
```

Mobile-first only if explicitly required by the canonical design.

---

# 10. BrandSync Token Reference

Always use semantic tokens in component CSS. Never hardcode values.

```css
/* Surfaces */
background: var(--surface-base);          /* white — card, sidebar backgrounds */
background: var(--surface-container);     /* light grey — page background */
background: var(--surface-hover);         /* hover state background */
background: var(--surface-selected);      /* active/selected state */

/* Text */
color: var(--text-default);               /* primary text */
color: var(--text-secondary);             /* secondary/muted text */
color: var(--text-muted);                 /* placeholder, hint text */
color: var(--text-action);                /* active tab, link color */
color: var(--text-on-action);             /* text on primary buttons */

/* Primary Actions */
background: var(--color-primary-default); /* primary button background */
background: var(--color-primary-hover);   /* primary button hover */

/* Neutral Actions */
background: var(--color-neutral-container);       /* secondary button bg */
background: var(--color-neutral-container-hover); /* secondary button hover */
color: var(--text-neutral-default);               /* secondary button text */

/* Borders */
border-color: var(--border-default);              /* standard borders */
border-color: var(--border-neutral-container);    /* input borders */
border-color: var(--border-primary-focus);        /* focus ring color */

/* Spacing */
padding: var(--spacing-50);    /* 4px  */
padding: var(--spacing-100);   /* 8px  */
padding: var(--spacing-150);   /* 12px */
padding: var(--spacing-200);   /* 16px */
padding: var(--spacing-250);   /* 20px */
padding: var(--spacing-300);   /* 24px */
padding: var(--spacing-400);   /* 32px */

/* Border Radius */
border-radius: var(--border-radius-75);   /* 6px  — small elements */
border-radius: var(--border-radius-100);  /* 8px  — buttons, inputs */
border-radius: var(--border-radius-150);  /* 12px — cards, modals */
border-radius: var(--border-radius-full); /* 120px — pills, avatars */

/* Border Width */
border: var(--border-width-thin) solid ...;   /* 1px */
border: var(--border-width-medium) solid ...; /* 2px — focus rings */
```

---

# 11. Dark Mode

Dark mode is token-driven via `data-theme` on `<html>`. BrandSync tokens switch automatically:

```css
:root             { --surface-base: #ffffff; }
[data-theme="dark"] { --surface-base: #1a1a1a; }
```

Toggle in component:

```ts
toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  this.initializeIcons();  // re-run after DOM update
}
```

Never rebuild theme dynamically. Never use Angular Material theming.

---

# 12. Output Requirements

Every execution MUST include:

1. Angular environment summary (version, standalone/NgModule, control flow syntax used)
2. File tree
3. Required setup changes (`index.html` CDN script, `styles.css` token import)
4. Component TypeScript
5. Component HTML
6. Component CSS
7. Validation checklist

No narrative. No optional alternatives. Single authoritative implementation.

---

# 13. Validation Checklist

Before delivery:

- [ ] `_tokens.css` verified against MCP canonical — all semantic tokens present
- [ ] `_tokens.css` imported in `src/styles.css` or `angular.json` styles array
- [ ] `@phosphor-icons/webcomponents` installed and imported once in `main.ts`
- [ ] `CUSTOM_ELEMENTS_SCHEMA` added to every component that uses `<ph-*>` elements
- [ ] No CDN script tags, `data-lucide` attributes, or `createIcons()` calls
- [ ] Correct control flow syntax for detected Angular version (`@if`/`@for` vs `*ngIf`/`*ngFor`)
- [ ] `CommonModule` imported for Angular < 17; `NgClass`/`NgStyle` imported individually for 17+
- [ ] No Angular Material, PrimeNG, Bootstrap, Tailwind, or CSS framework used
- [ ] DOM structure matches canonical hierarchy exactly
- [ ] Class names preserved from canonical exactly
- [ ] Only valid BrandSync semantic tokens used — no hardcoded values
- [ ] Theme toggle uses `data-theme` attribute + `localStorage`
- [ ] Desktop-first responsive approach applied
- [ ] Visual output matches canonical blueprint

---

Version: 7.2
Mode: Blueprint-Driven
Authority: Angular reproduces canonical output
Violation Policy: Fail Hard
