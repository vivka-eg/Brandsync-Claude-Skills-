---
name: angular-material-ui
description: Maps canonical BrandSync UI to Angular Material components with heavy theming. Visual fidelity over structural fidelity.
version: 1.4
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

Read `package.json` and `angular.json` to detect:

**A. Angular + Material version**
- Determines M2 vs M3 API — see Step 2b

**B. Standalone vs NgModule**
- Read any existing component file and check for `standalone: true` in the decorator
- This affects where Material module imports go — see §5b

**C. Styles file path**
- Read `angular.json` → `projects.[name].architect.build.options.styles[]`
- Do NOT assume `src/styles.scss` — use the actual path from `angular.json`
- If the styles array already references a theme SCSS file, read it before writing any theming code

**D. Existing theme detection**
- If a theme SCSS file already exists: read it, detect which API is in use, and match it — do not overwrite or restructure
- If no theme file exists: create one at a path that fits the existing project structure

## Step 2b: Detect theming generation

Based on `@angular/material` version, select the correct theming API — then use **only** that API throughout. Do not mix M2 and M3 patterns.

| Version | Generation | Theming API | Token layer |
|---------|-----------|-------------|-------------|
| v14–v16 | M2 only | `mat.define-palette()` + `mat.define-light-theme()` | `--mdc-*` |
| v17–v18 | M2 or M3 | Read existing styles to confirm — see below | Match what's already there |
| v19+ | M3 default | `mat.theme()` | `--mat-*` |

**If v17–v18 detected — Read Before Writing:**
1. Find the main styles SCSS file (from `angular.json` styles array)
2. Search for `mat.theme(` → M3 is active
3. Search for `mat.define-light-theme(` → M2 is active
4. If neither is found, search for any `@include mat.` call and infer from context
5. Match the API you find. Do not introduce the other API. If you cannot determine which is active, output a diagnostic and ask before proceeding.

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
// ❌ WRONG — CSS variables don't resolve in SCSS (both M2 and M3)
600: var(--color-primary-default),  // compiles to "var(...)" string — broken

// ✅ CORRECT — use raw hex values from _tokens.css primitives
600: #0062C1,
```

## Two-Layer Strategy (applies to both M2 and M3)

1. **SCSS palette / theme definition** → raw hex values (compiler needs these)
2. **Component overrides + styles** → CSS variables (token-driven)

---

## M2 Theming (v14–v16)

Token layer for overrides: `--mdc-*` classes (e.g. `--mdc-filled-button-container-color`)

```scss
// src/material-theme.scss  (name this whatever suits the project)
@use '@angular/material' as mat;
@import 'assets/_tokens.css';

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

Override example (M2 token layer):
```scss
.mat-mdc-raised-button.mat-primary {
  --mdc-filled-button-container-color: var(--color-primary-default);
  --mdc-filled-button-hover-container-color: var(--color-primary-hover);
}
```

---

## M3 Theming (v19+)

Token layer for overrides: `--mat-*` classes (e.g. `--mat-filled-button-background-color`)

```scss
// src/material-theme.scss  (name this whatever suits the project)
@use '@angular/material' as mat;
@import 'assets/_tokens.css';

$brandsync-theme: mat.theme((
  color: (
    primary: mat.$blue-palette,   // base palette — overridden per-component via CSS vars
    theme-type: light,
  ),
  typography: (
    brand-family: 'Roboto, sans-serif',
    plain-family: 'Roboto, sans-serif',
  ),
));

html {
  @include mat.theme($brandsync-theme);
}
```

Override example (M3 token layer):
```scss
.mat-mdc-raised-button.mat-primary {
  --mat-filled-button-background-color: var(--color-primary-default);
  --mat-filled-button-hover-background-color: var(--color-primary-hover);
}
```

---

Register in `angular.json` styles array (both generations):
```json
"styles": [
  "src/assets/_tokens.css",
  "src/material-theme.scss",
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
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // required for <ph-*> Phosphor web components
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }

  openModal() {
    this.dialog.open(ModalComponent, { width: '480px' });
  }
}
```

---

# 5b. Standalone vs NgModule — Import Differences

Before writing any component, read one existing component to confirm which pattern the project uses.

**Standalone (Angular 14+):**
```ts
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatDialogModule],
  ...
})
```

**NgModule-based:**
```ts
// In the feature module or SharedModule — NOT in the component decorator
@NgModule({
  imports: [MatButtonModule, MatTableModule, MatDialogModule],
  ...
})
export class FeatureModule {}

// Component has no imports array
@Component({
  selector: 'app-example',
  ...
})
```

Do NOT add an `imports` array to a component decorator in an NgModule-based project — Angular will throw a compile error.

---

# 6. Template Translation

**Canonical (vanilla):**
```html
<button class="btn btn-primary" (click)="save()">
  <ph-plus size="16"></ph-plus>
  <span>New row</span>
</button>
```

**Material adaptation:**
```html
<button mat-raised-button color="primary" (click)="save()">
  <ph-plus size="16"></ph-plus>
  <span>New row</span>
</button>
```

Changes made:
- `class="btn btn-primary"` → `mat-raised-button color="primary"`
- Phosphor `<ph-*>` elements work inside Material buttons — no substitution to `mat-icon` required
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

## Table with Sorting and Pagination

If the canonical includes sortable columns or a paginator, use `MatTableDataSource` with `MatSort` and `MatPaginator`.

Add to imports: `MatSortModule`, `MatPaginatorModule`

```ts
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

dataSource = new MatTableDataSource(this.rows);
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatPaginator) paginator!: MatPaginator;

ngAfterViewInit() {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}
```

```html
<mat-table [dataSource]="dataSource" matSort class="brandsync-table">
  <ng-container matColumnDef="name">
    <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.name }}</mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
  <mat-row *matRowDef="let row; columns: columns"></mat-row>
</mat-table>
<mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons />
```

```scss
// In global styles.scss — paginator renders outside component scope
.mat-mdc-header-cell[mat-sort-header] {
  cursor: pointer;
  &:hover { background-color: var(--surface-hover); }
}

.mat-mdc-paginator {
  background-color: var(--surface-container);
  color: var(--text-secondary);
  border-top: var(--border-width-thin) solid var(--border-default);
}
```

---

# 8. Forms

Forms require `mat-form-field` wrapping `matInput` or `mat-select`. Form field overrides must be in global `styles.scss` — they render outside component scope.

Add to imports: `MatFormFieldModule`, `MatInputModule`, `MatSelectModule`, `ReactiveFormsModule`

```ts
import { inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

form = inject(FormBuilder).group({
  name: ['', Validators.required],
  status: [''],
});
```

```html
<form [formGroup]="form">
  <mat-form-field appearance="outline" class="brandsync-field">
    <mat-label>Name</mat-label>
    <input matInput formControlName="name" />
    <mat-error *ngIf="form.get('name')?.hasError('required')">Required</mat-error>
  </mat-form-field>

  <mat-form-field appearance="outline" class="brandsync-field">
    <mat-label>Status</mat-label>
    <mat-select formControlName="status">
      <mat-option value="active">Active</mat-option>
      <mat-option value="inactive">Inactive</mat-option>
    </mat-select>
  </mat-form-field>
</form>
```

```scss
// In global styles.scss — mat-form-field internals render outside component scope

.brandsync-field {
  width: 100%;

  // --- M2 token layer (v14–v16) ---
  --mdc-outlined-text-field-outline-color: var(--border-neutral-container);
  --mdc-outlined-text-field-focus-outline-color: var(--border-primary-focus);
  --mdc-outlined-text-field-input-text-color: var(--text-default);
  --mdc-outlined-text-field-label-text-color: var(--text-secondary);
  --mdc-outlined-text-field-error-outline-color: var(--color-error-default);

  // --- M3 token layer (v19+) — comment out whichever is not in use ---
  // --mat-form-field-outlined-outline-color: var(--border-neutral-container);
  // --mat-form-field-outlined-focus-outline-color: var(--border-primary-focus);
  // --mat-form-field-label-text-color: var(--text-secondary);
  // --mat-form-field-error-text-color: var(--color-error-default);
}
```

**Rule:** Comment out the token layer not in use. It documents which API is active and prevents accidental mixing.

---

# 9. Dialog / Modal Implementation

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

# 10. Icon Strategy

BrandSync designs use Phosphor Icons. Always use `@phosphor-icons/webcomponents` — never `mat-icon` or Lucide.

**Install (once per project):**
```
npm i @phosphor-icons/webcomponents
```

**Import once in `main.ts`:**
```ts
import '@phosphor-icons/webcomponents';
```

**Add `CUSTOM_ELEMENTS_SCHEMA` to every component that uses `<ph-*>` elements** (already in §5 Component Pattern — apply to all new components too):
```ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  ...
})
```

**Usage in templates:**
```html
<ph-plus size="16" style="color: var(--icon-on-action)"></ph-plus>
<ph-magnifying-glass size="20" style="color: var(--icon-default)"></ph-magnifying-glass>
<ph-bell size="20" weight="fill" style="color: var(--icon-action)"></ph-bell>
```

Icon names are kebab-case Phosphor names prefixed with `ph-`. Weight via `weight` attribute: `thin`, `light`, `regular` (default), `bold`, `fill`, `duotone`. Colors via inline style or CSS `color` property using BrandSync icon tokens.

No `createIcons()`, no `MatIconModule`, no CDN script tags.

---

# 11. When to Abandon Material

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

# 12. Dark Mode

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

# 13. BrandSync Token Reference

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

# 14. Validation Checklist

Before delivery:

**Environment detection**
- [ ] Standalone vs NgModule confirmed by reading an existing component — imports placed in correct location
- [ ] Styles path read from `angular.json` — not assumed to be `src/styles.scss`
- [ ] Existing theme file checked before writing any theming code
- [ ] If v17–v18: active API (M2 or M3) confirmed by reading existing styles — not guessed

**Tokens**
- [ ] `_tokens.css` verified against MCP canonical — all semantic tokens present
- [ ] `_tokens.css` imported in the correct styles file (per `angular.json`) and listed in styles array

**Theming**
- [ ] `@angular/material` version read from `package.json` — M2 or M3 theming API selected accordingly
- [ ] M2 projects: `mat.define-palette()` + `mat.define-light-theme()` used; overrides use `--mdc-*` tokens
- [ ] M3 projects: `mat.theme()` used; overrides use `--mat-*` tokens
- [ ] M2/M3 APIs not mixed in the same project
- [ ] Material theme SCSS uses raw hex values (no CSS variables in SCSS palette)
- [ ] Component overrides use CSS variable tokens (not hardcoded values, not primitive tokens)
- [ ] `!important` used only where Material specificity requires it — not as default

**Components**
- [ ] Dialog/modal styles placed in global `styles.scss` (not component scope)
- [ ] Form field (`mat-form-field`) overrides placed in global `styles.scss`
- [ ] Forms: correct token layer used (`--mdc-outlined-text-field-*` for M2, `--mat-form-field-*` for M3)
- [ ] Tables with sorting: `MatSortModule` imported, `MatTableDataSource` used
- [ ] Tables with pagination: `MatPaginatorModule` imported, paginator styled to match BrandSync
- [ ] All icons use Phosphor (`@phosphor-icons/webcomponents`); no `mat-icon`, Lucide CDN, or other icon library
- [ ] `CUSTOM_ELEMENTS_SCHEMA` added to every component using `<ph-*>` elements
- [ ] Custom components built for patterns that don't map to Material

**Output**
- [ ] Dark mode works via `data-theme` attribute
- [ ] Visual output matches canonical blueprint (DOM structure differences are accepted)

---

Version: 1.4
Mode: Material Adaptation
Authority: Visual fidelity over structural fidelity
Violation Policy: Accept Material DOM, enforce visual match
