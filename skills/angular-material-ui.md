---
name: angular-material-ui
description: Maps canonical BrandSync UI to Angular Material components with heavy theming. Visual fidelity over structural fidelity.
version: 1.1
execution_mode: adaptive
error_policy: fail-with-alternatives
component_strategy: material-mapping
ui_philosophy: material-as-implementation-layer
---

# Angular Material BrandSync Adapter

Reproduce canonical BrandSync visual output using Angular Material components.

| Aspect | Vanilla Angular | Angular Material |
|--------|----------------|------------------|
| DOM Structure | Exact canonical match | Material's structure (can't match) |
| CSS | Direct canonical CSS | Material theming + overrides |
| Components | Custom HTML | `<mat-button>`, `<mat-table>`, etc. |
| Philosophy | "Reproduce blueprint exactly" | "Make Material look like BrandSync" |

---

# 0. Pre-Flight — Do This BEFORE Writing Any Code

## Step 1: Verify the tokens file

Always fetch the canonical tokens from the MCP server and compare against the project:

```
mcp__brandsync-mcp-server__get_tokens
```

Check that `src/styles.scss` (or `src/styles.css`) imports `_tokens.css` and contains all semantic tokens:
- `--surface-container`, `--surface-base`, `--surface-hover`
- `--color-primary-default`, `--color-primary-hover`
- `--text-action`, `--text-on-action`, `--text-secondary`
- `--spacing-25` through `--spacing-800`
- `--border-radius-50` through `--border-radius-full`
- `--border-primary-focus`, `--border-neutral-container`

If ANY are missing, replace `_tokens.css` with the full canonical version before proceeding.

**Import in `src/styles.scss`:**
```scss
@import 'assets/_tokens.css';
```

## Step 2: Check Angular environment

Read `package.json` to determine:
- Angular version (affects theming API — M2 vs M3)
- Angular Material version (`@angular/material`)
- Whether the project uses standalone components or NgModule

## Step 3: Fetch the canonical example

```
mcp__brandsync-mcp-server__get_example  (name: "PageName")
```

Study the full HTML + CSS before writing. The canonical defines the **visual target** — not the DOM structure (Material controls the DOM).

---

# 1. Critical Understanding — DOM Divergence

**You CANNOT preserve canonical DOM structure with Angular Material.**

Material components generate their own DOM:

```html
<!-- ❌ Canonical structure — not achievable with Material -->
<button class="btn btn-primary">Click</button>

<!-- ✅ What Material actually renders -->
<button mat-raised-button color="primary" class="mat-mdc-raised-button ...">
  <span class="mat-mdc-button-persistent-ripple"></span>
  <span class="mdc-button__label">Click</span>
  <span class="mat-ripple"></span>
</button>
```

**Trade-off:**
- ❌ Lose: Exact DOM structure
- ✅ Gain: Material features (accessibility, ripples, animations)
- 🎯 Goal: Visual output matches BrandSync

---

# 2. Component Mapping Strategy

Before coding, map each BrandSync pattern to its Material equivalent:

| BrandSync Canonical | Angular Material | Notes |
|---------------------|-----------------|-------|
| `.btn.btn-primary` | `<button mat-raised-button color="primary">` | Theme primary color |
| `.btn.btn-secondary` | `<button mat-flat-button>` | Custom theme |
| `.data-table` | `<mat-table>` | Heavy styling needed |
| `.form-select` | `<mat-select>` | Override Material styles |
| `.modal-overlay` | `<mat-dialog>` | Use dialog service |
| `.badge` | `<mat-chip>` | Custom chip styling |
| `.nav-menu` | `<mat-nav-list>` | Sidebar navigation |

**When no Material component fits:**
- ✅ Build a custom component (vanilla approach for that element)
- ✅ Use Material CDK primitives where helpful
- ❌ Don't force-fit Material where it doesn't belong

---

# 3. Theming — CRITICAL: No CSS Variables in SCSS Palette

## 🚨 CSS Variables Cannot Be Used in SCSS Palette Definitions

Angular Material's SCSS palette requires **raw hex values** — CSS variables are not resolved at SCSS compile time and will silently produce broken output.

```scss
// ❌ WRONG — CSS variables don't resolve in SCSS
$brandsync-primary: mat.define-palette((
  600: var(--color-primary-default),  // compiles to "var(...)" string — broken
));

// ✅ CORRECT — use raw hex values from _tokens.css primitives
$brandsync-primary: mat.define-palette((
  50:  #EBF3FF,
  100: #C2D9F7,
  200: #99C0F0,
  300: #70A6E8,
  400: #3D83D4,
  500: #0073E1,
  600: #0062C1,  // --primary-600 — main brand color
  700: #0051A2,
  800: #004082,
  900: #002F61,
  contrast: (
    50:  rgba(black, 0.87),
    600: white,
    900: white,
  )
));
```

## Two-Layer Strategy (same principle as React MUI)

1. **SCSS palette** → raw hex values (compiler needs these)
2. **Component overrides + styles** → CSS variables (token-driven)

## Complete Theme Setup

```scss
// src/brandsync-theme.scss
@use '@angular/material' as mat;
@import 'assets/_tokens.css';

$brandsync-primary: mat.define-palette((
  600: #0062C1,
  // ... full palette
  contrast: (600: white)
));

$brandsync-accent: mat.define-palette((
  600: #5D6472,
  contrast: (600: white)
));

$brandsync-theme: mat.define-light-theme((
  color: (
    primary: $brandsync-primary,
    accent:  $brandsync-accent,
  ),
  typography: mat.define-typography-config(
    $font-family: 'Roboto, sans-serif',
  ),
));

@include mat.all-component-themes($brandsync-theme);
```

Register in `angular.json` styles array:
```json
"styles": [
  "src/assets/_tokens.css",
  "src/brandsync-theme.scss",
  "src/styles.scss"
]
```

---

# 4. Material Style Overrides

Override Material component styles using **CSS variables** (tokens work in CSS, just not in SCSS palette definitions).

Use `!important` only when Material's specificity cannot be overridden otherwise — not as a default.

```scss
// Material button → BrandSync button
.mat-mdc-raised-button.mat-primary {
  background-color: var(--color-primary-default);
  border-radius: var(--border-radius-100);
  padding: var(--spacing-150) var(--spacing-250);
  font-weight: 600;

  &:hover {
    background-color: var(--color-primary-hover);
  }
}

// Material table → BrandSync table
.mat-mdc-table {
  border: var(--border-width-thin) solid var(--border-default);
  border-radius: var(--border-radius-150);

  .mat-mdc-header-cell {
    background-color: var(--surface-container);
    color: var(--text-secondary);
    font-weight: 600;
  }

  .mat-mdc-row:hover .mat-mdc-cell {
    background-color: var(--surface-hover);
  }
}
```

---

# 5. Component Pattern

```ts
import { Component, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.initializeTheme();
    this.initializeIcons();  // required if using Lucide (Option A in §9)
  }

  private initializeTheme() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }

  private initializeIcons() {
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }

  openModal() {
    this.dialog.open(ModalComponent, { width: '480px' });
  }
}
```

---

# 6. Template Translation

**Canonical (vanilla):**
```html
<button class="btn btn-primary" (click)="save()">
  <i data-lucide="plus"></i>
  <span>New row</span>
</button>
```

**Material adaptation:**
```html
<button mat-raised-button color="primary" (click)="save()">
  <mat-icon>add</mat-icon>
  <span>New row</span>
</button>
```

Changes made:
- `class="btn btn-primary"` → `mat-raised-button color="primary"`
- Lucide icon → Material icon (or keep Lucide — see §9)
- Event handler and content unchanged

---

# 7. Table Implementation

Tables require the most adaptation. Material's `mat-table` is CDK-based and structurally different:

```html
<mat-table [dataSource]="tableData" class="brandsync-table">
  <ng-container matColumnDef="name">
    <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.name }}</mat-cell>
  </ng-container>

  <ng-container matColumnDef="status">
    <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
    <mat-cell *matCellDef="let row">
      <span class="badge" [class]="'badge--' + row.status">{{ row.status }}</span>
    </mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
  <mat-row *matRowDef="let row; columns: columns"></mat-row>
</mat-table>
```

```scss
.brandsync-table {
  border: var(--border-width-thin) solid var(--border-default);
  border-radius: var(--border-radius-150);
  overflow: hidden;

  .mat-mdc-header-cell {
    background-color: var(--surface-container);
    color: var(--text-secondary);
    font-weight: 600;
    padding: var(--spacing-150) var(--spacing-200);
  }

  .mat-mdc-cell {
    padding: var(--spacing-150) var(--spacing-200);
    color: var(--text-default);
  }
}
```

---

# 8. Dialog / Modal Implementation

```ts
// Open dialog matching BrandSync modal dimensions
this.dialog.open(ConfirmModalComponent, {
  width: '480px',
  panelClass: 'brandsync-dialog',
});
```

```scss
// In global styles.scss — dialogs render outside component scope
.brandsync-dialog .mat-mdc-dialog-container {
  border-radius: var(--border-radius-150);
  padding: 0;

  .mat-mdc-dialog-surface {
    background-color: var(--surface-base);
    border: var(--border-width-thin) solid var(--border-default);
  }
}
```

**Note:** Dialog overlay styles must be in global `styles.scss` (not component SCSS) because the dialog is rendered in a CDK overlay outside the component tree.

---

# 9. Icon Strategy

## Option A: Keep Lucide (Recommended for BrandSync consistency)

```html
<button mat-raised-button color="primary">
  <i data-lucide="plus" class="btn-icon"></i>
  New row
</button>
```

Requires `createIcons()` call in `ngAfterViewInit()` — same as vanilla Angular skill.

## Option B: Material Icons (Native integration)

```html
<button mat-raised-button color="primary">
  <mat-icon>add</mat-icon>
  New row
</button>
```

Requires `MatIconModule` import. Different visual style from BrandSync canonical.

---

# 10. When to Abandon Material

Some BrandSync patterns don't map well to Material. Build these as custom (vanilla) components:

| Build custom | Use Material |
|---|---|
| Navigation drawer | Buttons |
| Custom dropdown menus | Form inputs (`mat-select`, `mat-input`) |
| Badge/pill components | Dialogs |
| Pagination controls | Checkboxes, radios |
| Custom cards | Tabs, expansion panels |

Mixing Material + custom components in the same page is valid and expected.

---

# 11. Dark Mode

Dark mode is token-driven via `data-theme` on `<html>`. BrandSync CSS variables switch automatically:

```ts
toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
```

Material components will adopt the new token values because their overrides use `var(--token)` references. No Angular Material dark theme rebuild needed.

---

# 12. BrandSync Token Reference

Use semantic tokens in all SCSS component overrides. Never hardcode values.

```scss
// Surfaces
background-color: var(--surface-base);          // white — card, sidebar
background-color: var(--surface-container);     // light grey — page bg
background-color: var(--surface-hover);         // hover state
background-color: var(--surface-selected);      // selected state

// Text
color: var(--text-default);                     // primary text
color: var(--text-secondary);                   // muted text
color: var(--text-action);                      // active/link color
color: var(--text-on-action);                   // text on primary buttons

// Primary Actions
background-color: var(--color-primary-default); // primary button bg
background-color: var(--color-primary-hover);   // primary button hover

// Borders
border-color: var(--border-default);            // standard borders
border-color: var(--border-neutral-container);  // input borders
border-color: var(--border-primary-focus);      // focus ring

// Spacing
padding: var(--spacing-100);   // 8px
padding: var(--spacing-150);   // 12px
padding: var(--spacing-200);   // 16px
padding: var(--spacing-300);   // 24px

// Border Radius
border-radius: var(--border-radius-100);  // 8px  — buttons, inputs
border-radius: var(--border-radius-150);  // 12px — cards, dialogs
border-radius: var(--border-radius-full); // pills
```

---

# 13. Validation Checklist

Before delivery:

- [ ] `_tokens.css` verified against MCP canonical — all semantic tokens present
- [ ] `_tokens.css` imported in `src/styles.scss` and `angular.json` styles array
- [ ] Material theme SCSS uses raw hex values (no CSS variables in SCSS palette)
- [ ] Component overrides use CSS variable tokens (not hardcoded values, not primitive tokens)
- [ ] `!important` used only where Material specificity requires it — not as default
- [ ] Dialog/modal styles placed in global `styles.scss` (not component scope)
- [ ] Icons strategy decided (Lucide or Material Icons) and applied consistently
- [ ] Tables styled to match BrandSync visual output
- [ ] Dark mode works via `data-theme` attribute
- [ ] Custom components built for patterns that don't map to Material
- [ ] Visual output matches canonical blueprint (DOM structure differences are accepted)

---

Version: 1.1
Mode: Material Adaptation
Authority: Visual fidelity over structural fidelity
Violation Policy: Accept Material DOM, enforce visual match
