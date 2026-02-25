---
name: brandsync-foundations
description: Cross-framework foundation skill that generates a native theme engine from the BrandSync token system. Detects the target framework, resolves the two-layer token architecture, and produces the correct token bridge — CSS custom properties for web, Dart constants for Flutter, JS/TS for React Native, XAML for MAUI, and Tailwind config for utility-first CSS.
version: 1.1
execution_mode: adaptive
error_policy: fail-with-alternatives
component_strategy: token-bridge-first
ui_philosophy: framework-native-tokens-from-design-system
---

# BrandSync Foundations — Theme Engine Generator

This skill generates the foundational theme engine for any supported framework using the BrandSync
design token system. Run this skill once per project before writing any components.

BrandSync tokens are the single source of truth for every visual value. This skill translates them
into the native construct the target framework understands.

| Aspect            | Approach                                                           |
|-------------------|--------------------------------------------------------------------|
| Token Source      | `_tokens.css` — fetched from MCP, two-layer architecture          |
| Output            | Framework-native theme file(s) — not generic CSS                  |
| Dark Mode         | Token-driven via `data-theme` attribute (web) or ThemeMode (native)|
| Philosophy        | "Generate the bridge once, reference tokens everywhere after"      |

---

# 0. Pre-Flight — Do This BEFORE Generating Any Theme Code

## Step 1: Ask the user — Brand color + Platform

**Before reading any project files or writing any code, ask the user both of these questions.**
Do not proceed until you have answers to both.

---

**Question 1 — Brand color**

Ask the user:

> Which of the 14 BrandSync brand colors is your primary brand color?
>
> 1. Purple
> 2. Cobalt
> 3. Blue *(BrandSync default)*
> 4. Steel
> 5. Teal
> 6. Jade
> 7. Green
> 8. Lime
> 9. Yellow
> 10. Amber
> 11. Orange
> 12. Magenta
> 13. Maroon
> 14. Information *(alias: Blue-info)*

Once the user answers, record the chosen color name as **[BRAND_COLOR]**. This color's primitive
scale (`--[brand-color]-*`) will be used as the primary scale throughout the generated theme.

The CSS variable mapping is:

| Choice | Primitive scale | Default token source |
|--------|----------------|----------------------|
| Purple | `--purple-*`   | `--purple-600` → default, `--purple-700` → hover, `--purple-800` → pressed |
| Cobalt | `--cobalt-*`   | `--cobalt-600` → default, `--cobalt-700` → hover, `--cobalt-800` → pressed |
| Blue   | `--blue-*`     | `--blue-600` → default, `--blue-700` → hover, `--blue-800` → pressed |
| Steel  | `--steel-*`    | `--steel-600` → default, `--steel-700` → hover, `--steel-800` → pressed |
| Teal   | `--teal-*`     | `--teal-600` → default, `--teal-700` → hover, `--teal-800` → pressed |
| Jade   | `--jade-*`     | `--jade-600` → default, `--jade-700` → hover, `--jade-800` → pressed |
| Green  | `--green-*`    | `--green-600` → default, `--green-700` → hover, `--green-800` → pressed |
| Lime   | `--lime-*`     | `--lime-600` → default, `--lime-700` → hover, `--lime-800` → pressed |
| Yellow | `--yellow-*`   | `--yellow-600` → default, `--yellow-700` → hover, `--yellow-800` → pressed |
| Amber  | `--amber-*`    | `--amber-600` → default, `--amber-700` → hover, `--amber-800` → pressed |
| Orange | `--orange-*`   | `--orange-600` → default, `--orange-700` → hover, `--orange-800` → pressed |
| Magenta| `--magenta-*`  | `--magenta-600` → default, `--magenta-700` → hover, `--magenta-800` → pressed |
| Maroon | `--maroon-*`   | `--maroon-600` → default, `--maroon-700` → hover, `--maroon-800` → pressed |
| Information | `--information-*` | `--information-600` → default, `--information-700` → hover, `--information-800` → pressed |

**Dark mode primary** — use lighter shades (scale inverts in dark mode):
`-400` → default, `-300` → hover, `-200` → pressed

---

**Question 2 — Platform**

Ask the user:

> Which platform are you building for?
>
> 1. Web — React (with MUI)
> 2. Web — React (CSS variables only, no component library)
> 3. Web — Angular (with Angular Material)
> 4. Web — Angular (CSS variables only)
> 5. Web — Vue 3
> 6. Web — Tailwind CSS
> 7. Mobile — Flutter
> 8. Mobile — React Native
> 9. Desktop/Mobile — .NET MAUI

Once the user answers, record the choice as **[PLATFORM]** and jump to the matching section
(§4 through §10) after completing Steps 2–4 below.

---

## Step 2: Fetch the canonical tokens

```
mcp__brandsync-mcp-server__get_tokens
```

Verify `_tokens.css` contains all required layers:

**Primitives (color scales):** `--neutral-*`, `--[BRAND_COLOR]-*`, `--success-*`, `--error-*`, `--warning-*`, `--information-*`

**Semantic tokens:**
- `--color-primary-default`, `--color-primary-hover`, `--color-primary-pressed`
- `--surface-base`, `--surface-container`, `--surface-hover`, `--surface-action`
- `--text-default`, `--text-secondary`, `--text-muted`, `--text-action`, `--text-on-action`
- `--border-default`, `--border-neutral-container`, `--border-primary-focus`
- `--spacing-25` through `--spacing-1500`
- `--border-radius-0` through `--border-radius-full`
- `--elevation-0` through `--elevation-6`
- `--transition-color`, `--transition-bg`, `--transition-interactive`

If any semantic tokens are missing, replace `_tokens.css` with the full canonical version.
Undefined CSS variables fail silently — they resolve to empty and break layout without errors.

**Brand color override:** If [BRAND_COLOR] is not Blue, add a CSS override block at the bottom
of `_tokens.css` (or in a separate `_brand.css` imported after) that remaps the primary semantic
tokens to the chosen brand scale:

```css
/* Brand color override — generated from user selection */
:root {
  --color-primary-default:           var(--[BRAND_COLOR]-600);
  --color-primary-hover:             var(--[BRAND_COLOR]-700);
  --color-primary-focused:           var(--[BRAND_COLOR]-700);
  --color-primary-pressed:           var(--[BRAND_COLOR]-800);
  --color-primary-container:         var(--[BRAND_COLOR]-50);
  --color-primary-container-hover:   var(--[BRAND_COLOR]-100);
  --text-action:                     var(--[BRAND_COLOR]-600);
  --text-action-hover:               var(--[BRAND_COLOR]-700);
  --text-link:                       var(--[BRAND_COLOR]-700);
  --icon-action:                     var(--[BRAND_COLOR]-600);
  --icon-action-hover:               var(--[BRAND_COLOR]-700);
  --border-primary:                  var(--[BRAND_COLOR]-500);
  --border-primary-hover:            var(--[BRAND_COLOR]-600);
  --border-primary-focus:            var(--[BRAND_COLOR]-600);
  --border-primary-pressed:          var(--[BRAND_COLOR]-700);
  --surface-action:                  var(--color-primary-default);
}

[data-theme="dark"] {
  --color-primary-default:           var(--[BRAND_COLOR]-400);
  --color-primary-hover:             var(--[BRAND_COLOR]-300);
  --color-primary-focused:           var(--[BRAND_COLOR]-300);
  --color-primary-pressed:           var(--[BRAND_COLOR]-200);
  --color-primary-container:         var(--[BRAND_COLOR]-950);
  --color-primary-container-hover:   var(--[BRAND_COLOR]-900);
  --text-action:                     var(--[BRAND_COLOR]-400);
  --text-action-hover:               var(--[BRAND_COLOR]-500);
  --text-link:                       var(--[BRAND_COLOR]-400);
  --icon-action:                     var(--[BRAND_COLOR]-400);
  --icon-action-hover:               var(--[BRAND_COLOR]-300);
  --border-primary:                  var(--[BRAND_COLOR]-400);
  --border-primary-hover:            var(--[BRAND_COLOR]-300);
  --border-primary-focus:            var(--[BRAND_COLOR]-300);
  --border-primary-pressed:          var(--[BRAND_COLOR]-200);
}
```

For mobile platforms (Flutter, React Native, MAUI) that cannot use CSS variables, look up the
resolved hex values for the chosen brand color scale in §12 and use those directly in the token
bridge file.

## Step 3: Detect the framework (confirm [PLATFORM])

If the user already answered Question 2, use that answer. Otherwise read the project root:

| Signal | Framework |
|--------|-----------|
| `package.json` with `@mui/material` | React + MUI |
| `package.json` with `react` but no MUI | React (CSS vars) |
| `package.json` with `@angular/material` | Angular Material |
| `package.json` with `@angular/core` but no Material | Angular (CSS vars) |
| `package.json` with `vue` | Vue 3 |
| `package.json` with `tailwindcss` | Tailwind CSS |
| `pubspec.yaml` | Flutter |
| `package.json` with `react-native` | React Native |
| `.csproj` with `Microsoft.Maui` | .NET MAUI |

If the user's stated platform and detected framework conflict, ask before proceeding.

## Step 4: Check for an existing theme engine

Before generating, check if a theme bridge already exists:

- Web: Is `_tokens.css` already imported globally?
- React/MUI: Is `ThemeProvider` already configured?
- Flutter: Does `lib/tokens/brandsync_tokens.dart` exist?
- React Native: Does `src/tokens/BrandSyncTokens.ts` exist?
- MAUI: Does `BrandSyncTokens.xaml` exist in `Resources/`?

If a partial implementation exists, complete it — do not replace working code.

---

# 1. Token Architecture

BrandSync tokens have two layers. Never mix them.

```
Layer 1 — Primitives (raw scale values)
  --neutral-900: #21262E
  --primary-600: #0062C1
  --spacing-300: 24px        ← via --scale-300
  --shadow-ambient-xs: rgba(33, 38, 46, 0.06)

Layer 2 — Semantic (contextual roles, reference primitives)
  --surface-base: var(--static-white)
  --color-primary-default: var(--primary-600)
  --text-default: var(--static-black)
  --elevation-1: var(--shadow-xs)
```

**Rule: Always use Layer 2 (semantic) tokens in components. Never reference Layer 1 primitives
in component code.** Primitives only appear in theme engine setup (e.g. MUI `palette`, Flutter
`ThemeData`) where the framework needs raw values it can process internally.

Dark mode works by overriding semantic tokens only. `[data-theme="dark"]` remaps semantic roles
to different primitive values. Components that reference semantics automatically inherit the
correct appearance — no component changes needed.

---

# 2. Core Law

1. 🔴 Every visual value must reference a semantic token — never a hardcoded hex, px, or raw number
2. 🟡 Use framework-native constructs to express tokens (CSS vars, Dart constants, XAML resources)
3. 🟢 Layer 2 semantic tokens are always the correct reference in component code
4. ❌ Never hardcode `#0062C1`, `24px`, `8px`, `rgba(...)` in component or style code
5. ❌ Never use Layer 1 primitives in component code — only in mandatory theme setup locations
6. ✅ Resolved raw values (from §12) are only permitted in framework theme config that cannot accept CSS variables

---

# 3. Platform Scope

Omit web-only tokens when generating for mobile platforms (Flutter, React Native, MAUI).

**Web-only — omit on mobile:**
- All `*-hover` tokens (no pointer device)
- All `*-focused` tokens (no keyboard focus ring)
- All `--border-*-focus` tokens
- All `--border-*-hover` tokens
- `--opacity-hover`, `--opacity-focus`
- All `--transition-*` tokens (use platform animation APIs instead)
- `--grid-columns`, `--grid-columns-narrow`, `--grid-columns-wide`
- `--grid-gutter`, `--grid-margin-sm/md/lg`
- `--breakpoint-*` (use platform breakpoint APIs)

**Universal — include on all platforms:**
- All `*-default` tokens
- All `*-pressed` / `*-active` tokens
- All `*-disabled` tokens
- All `*-selected` tokens
- All color scale primitives
- All semantic color tokens (`--color-*`, `--text-*`, `--surface-*`, `--icon-*`, `--border-default`)
- Typography: font-family, font-size, font-weight, line-height, letter-spacing, text-style tokens
- Spacing + sizing
- Border radius + border width
- Elevation / shadows (adapt to platform shadow API — see §12)
- `--duration-*` + `--easing-*` (map to platform animation primitives)
- `--z-index-*` (map to platform layering concept)
- `--container-max`, `--sidebar-width`, `--panel-min-width`

---

# 4. Web Output (React CSS, Vue, Angular without Material theming)

For projects using CSS custom properties directly — no component library theming layer.

## Global import

**React / Vite (`src/main.tsx` or `src/index.tsx`):**
```tsx
import './assets/_tokens.css';
```

**Vue 3 (`src/main.ts`):**
```ts
import './assets/_tokens.css';
```

**Angular (`angular.json` + `src/styles.scss`):**
```json
// angular.json → projects.[name].architect.build.options.styles
"styles": ["src/assets/_tokens.css", "src/styles.scss"]
```

**Plain HTML:**
```html
<link rel="stylesheet" href="/_tokens.css">
```

## Dark mode toggle (web)

```ts
// Set
document.documentElement.setAttribute('data-theme', 'dark');
// Unset (back to light)
document.documentElement.removeAttribute('data-theme');
// Persist
localStorage.setItem('theme', 'dark');
// Read on mount
const saved = localStorage.getItem('theme') ?? 'light';
if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
```

Never rebuild any configuration or reimport anything — tokens switch automatically.

---

# 5. React + MUI Theme Engine

Two-layer strategy is mandatory — MUI's internal color processing requires raw hex in `palette`.

## File: `src/theme/brandsyncTheme.ts`

```typescript
import { createTheme } from '@mui/material/styles';

// Raw hex values sourced from §12 resolved reference.
// MUI's palette needs these to compute variants and contrast.
export const brandsyncTheme = createTheme({
  palette: {
    primary: {
      main:         '#0062C1',  // --primary-600
      light:        '#0073E1',  // --primary-500
      dark:         '#0051A2',  // --primary-700
      contrastText: '#ffffff',  // --static-white
    },
    error: {
      main:         '#B92F31',  // --error-600
      light:        '#D93539',  // --error-500
      dark:         '#982A2A',  // --error-700
      contrastText: '#ffffff',
    },
    warning: {
      main:         '#805D00',  // --warning-600
      light:        '#956D00',  // --warning-500
      dark:         '#6B4D00',  // --warning-700
      contrastText: '#261A00',  // --warning-950
    },
    success: {
      main:         '#11714E',  // --success-600
      light:        '#00855B',  // --success-500
      dark:         '#1B5D43',  // --success-700
      contrastText: '#ffffff',
    },
    background: {
      default: '#F9FAFB',       // --neutral-25
      paper:   '#ffffff',       // --static-white
    },
    text: {
      primary:   '#000000',     // --static-black
      secondary: '#5D6472',     // --neutral-600
      disabled:  '#A0A5B4',     // --neutral-300
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    fontSize:   16,
    fontWeightRegular: 400,
    fontWeightMedium:  500,
    fontWeightBold:    700,
  },
  shape: {
    borderRadius: 8,            // --border-radius-100
  },
  // styleOverrides CAN use CSS variables — MUI applies them as CSS, not JS values
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius:   'var(--border-radius-100)',
          textTransform:  'none',
          transition:     'var(--transition-interactive)',
        },
        containedPrimary: {
          backgroundColor: 'var(--color-primary-default)',
          color:           'var(--text-on-action)',
          '&:hover':  { backgroundColor: 'var(--color-primary-hover)' },
          '&:active': { backgroundColor: 'var(--color-primary-pressed)' },
          '&.Mui-disabled': { opacity: 'var(--opacity-disabled)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-neutral-container)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-neutral-hover)',
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-primary-focus)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--surface-base)',
        },
      },
    },
  },
});
```

## File: `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { brandsyncTheme } from './theme/brandsyncTheme';
import './assets/_tokens.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={brandsyncTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

## Dark mode (MUI + CSS vars)

Do not create a second MUI theme for dark mode. Toggle `data-theme` only.

```tsx
const toggleDark = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
};
```

BrandSync tokens handle all color switching. MUI palette values are static (light mode base).

---

# 6. Angular Material Theme Engine

Angular Material version determines the theming API. Read `package.json` before generating.

| Version | API | Token layer |
|---------|-----|-------------|
| v14–v16 (M2) | `mat.define-light-theme()` | `--mdc-*` (limited) |
| v17–v18 (M2+M3 hybrid) | Check existing styles for active API | mixed |
| v19+ (M3) | `mat.theme()` | `--mat-*` + `--mdc-*` |

## File: `src/material-theme.scss` (v19+ M3)

```scss
@use '@angular/material' as mat;

// Raw hex values required — SCSS resolves at compile time, CSS vars are strings
$brandsync-theme: mat.theme((
  color: (
    theme-type: light,
    primary: (
      0:   #000000, 10: #001B3E, 20: #002550, 25: #003A78,
      30:  #0051A2, 35: #0062C1, 40: #0073E1, 50: #3E88EF,
      60:  #7AA6F2, 70: #AEC7F8, 80: #D8E3FC, 90: #EEF0FA,
      95:  #F4F6FC, 98: #F9FAFD, 99: #FCFCFE, 100: #ffffff,
    ),
    tertiary: mat.$violet-palette,
    error: (
      0:   #000000, 10: #34100F, 20: #481212, 25: #701D1E,
      30:  #982A2A, 35: #B92F31, 40: #D93539, 50: #EE5351,
      60:  #FF807A, 70: #FFB3AE, 80: #FFDAD7, 90: #FCECEA,
      95:  #FDEFEE, 98: #FFF8F7, 99: #FFFBFF, 100: #ffffff,
    ),
  ),
  typography: (
    brand-family: 'Roboto, sans-serif',
    bold-weight:  700,
    medium-weight: 500,
    regular-weight: 400,
  ),
));

html {
  @include mat.theme($brandsync-theme);
  @include mat.all-component-themes($brandsync-theme);
}
```

## Global token overrides (`src/styles.scss`)

Overlay BrandSync semantic tokens on top of Material's generated theme:

```scss
@import 'material-theme';

html {
  // Form field overrides
  --mdc-outlined-text-field-outline-color:        var(--border-neutral-container);
  --mdc-outlined-text-field-hover-outline-color:  var(--border-neutral-hover);
  --mdc-outlined-text-field-focus-outline-color:  var(--border-primary-focus);
  --mdc-outlined-text-field-label-text-color:     var(--text-secondary);
  --mdc-outlined-text-field-input-text-color:     var(--text-default);

  // Button overrides
  --mdc-filled-button-container-color:    var(--color-primary-default);
  --mdc-filled-button-label-text-color:   var(--text-on-action);

  // Surface overrides
  --mat-app-background-color: var(--surface-container);
  --mat-sidenav-content-background-color: var(--surface-container);
  --mat-card-elevated-container-color: var(--surface-base);
}
```

## Import order (`src/styles.scss`)

```scss
// 1. BrandSync tokens (must be first — Material can reference them)
@import 'assets/_tokens.css';
// 2. Angular Material theme
@import 'material-theme';
// 3. Global overrides
```

---

# 7. Vue 3 Theme Engine

Vue uses CSS custom properties directly. No separate theme object required.

## File: `src/main.ts`

```ts
import { createApp } from 'vue';
import App from './App.vue';
import './assets/_tokens.css';

const app = createApp(App);
app.mount('#app');
```

## Theme composable: `src/composables/useTheme.ts`

```ts
import { ref, watchEffect } from 'vue';

type Theme = 'light' | 'dark';

const theme = ref<Theme>(
  (localStorage.getItem('theme') as Theme) ?? 'light'
);

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem('theme', theme.value);
});

export function useTheme() {
  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  };
  return { theme, toggle };
}
```

## Usage in components

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
const { theme, toggle } = useTheme();
</script>

<template>
  <button @click="toggle">
    {{ theme === 'dark' ? 'Light' : 'Dark' }} mode
  </button>
</template>

<style scoped>
.container {
  background-color: var(--surface-container);
  color: var(--text-default);
  padding: var(--spacing-300);
}
</style>
```

---

# 8. Tailwind CSS Theme Engine

Tailwind config maps semantic token names to CSS variable references. Tailwind resolves them
at runtime; the CSS vars must be present globally.

## File: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts,tsx,vue,svelte}'],
  darkMode: ['attribute', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Primary
        'primary-default':   'var(--color-primary-default)',
        'primary-hover':     'var(--color-primary-hover)',
        'primary-pressed':   'var(--color-primary-pressed)',
        'primary-container': 'var(--color-primary-container)',
        // Surfaces
        'surface-base':       'var(--surface-base)',
        'surface-container':  'var(--surface-container)',
        'surface-hover':      'var(--surface-hover)',
        'surface-selected':   'var(--surface-selected)',
        'surface-action':     'var(--surface-action)',
        'surface-inset':      'var(--surface-inset)',
        // Text
        'text-default':    'var(--text-default)',
        'text-secondary':  'var(--text-secondary)',
        'text-muted':      'var(--text-muted)',
        'text-action':     'var(--text-action)',
        'text-on-action':  'var(--text-on-action)',
        'text-inverse':    'var(--text-inverse)',
        // Status
        'success-default': 'var(--color-success-default)',
        'warning-default': 'var(--color-warning-default)',
        'error-default':   'var(--color-error-default)',
        'info-default':    'var(--color-info-default)',
        // Borders
        'border-default':            'var(--border-default)',
        'border-neutral-container':  'var(--border-neutral-container)',
        'border-primary-focus':      'var(--border-primary-focus)',
      },
      spacing: {
        '25':   'var(--spacing-25)',    // 2px
        '50':   'var(--spacing-50)',    // 4px
        '75':   'var(--spacing-75)',    // 6px
        '100':  'var(--spacing-100)',   // 8px
        '150':  'var(--spacing-150)',   // 12px
        '200':  'var(--spacing-200)',   // 16px
        '250':  'var(--spacing-250)',   // 20px
        '300':  'var(--spacing-300)',   // 24px
        '350':  'var(--spacing-350)',   // 28px
        '400':  'var(--spacing-400)',   // 32px
        '500':  'var(--spacing-500)',   // 40px
        '600':  'var(--spacing-600)',   // 48px
        '800':  'var(--spacing-800)',   // 64px
      },
      borderRadius: {
        '0':    'var(--border-radius-0)',
        '50':   'var(--border-radius-50)',    // 4px
        '75':   'var(--border-radius-75)',    // 6px
        '100':  'var(--border-radius-100)',   // 8px
        '150':  'var(--border-radius-150)',   // 12px
        '200':  'var(--border-radius-200)',   // 16px
        '300':  'var(--border-radius-300)',   // 24px
        'full': 'var(--border-radius-full)',  // 120px
      },
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1': 'var(--elevation-1)',
        'elevation-2': 'var(--elevation-2)',
        'elevation-3': 'var(--elevation-3)',
        'elevation-4': 'var(--elevation-4)',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        mono: ['Roboto Mono', 'Courier New', 'monospace'],
      },
      transitionProperty: {
        'interactive': 'color, background-color, border-color',
      },
      transitionDuration: {
        'fast':    '100ms',
        'default': '200ms',
        'slow':    '300ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

# 9. Flutter Theme Engine

Flutter cannot use CSS variables. All tokens must be translated to typed Dart constants.

## File: `lib/tokens/brandsync_tokens.dart`

```dart
import 'package:flutter/material.dart';

// ============================================================
// BrandSync Token Bridge
// Semantic tokens only — components reference these constants.
// Values sourced from _tokens.css resolved reference (§12).
// ============================================================

abstract class BrandSyncTokens {
  // --- Surfaces ---
  static const Color surfaceBase       = Color(0xFFFFFFFF);  // --static-white
  static const Color surfaceContainer  = Color(0xFFF9FAFB);  // --neutral-25
  static const Color surfaceHover      = Color(0xFFEFF0F8);  // --neutral-50
  static const Color surfaceSelected   = Color(0xFFDEE2ED);  // --neutral-100
  static const Color surfaceActive     = Color(0xFFDEE2ED);  // --neutral-100
  static const Color surfaceAction     = Color(0xFF0062C1);  // --primary-600
  static const Color surfaceInset      = Color(0xFFEFF0F8);  // --neutral-50
  static const Color surfaceInverse    = Color(0xFF21262E);  // --neutral-900

  // --- Surfaces (dark mode) ---
  static const Color surfaceBaseDark      = Color(0xFF191C22);  // --neutral-950
  static const Color surfaceContainerDark = Color(0xFF21262E);  // --neutral-900
  static const Color surfaceHoverDark     = Color(0xFF363C47);  // --neutral-800
  static const Color surfaceSelectedDark  = Color(0xFF4D535F);  // --neutral-700
  static const Color surfaceActiveDark    = Color(0xFF5D6472);  // --neutral-600

  // --- Primary ---
  static const Color colorPrimaryDefault = Color(0xFF0062C1);  // --primary-600
  static const Color colorPrimaryHover   = Color(0xFF0051A2);  // --primary-700
  static const Color colorPrimaryPressed = Color(0xFF003A78);  // --primary-800

  // --- Primary (dark mode) ---
  static const Color colorPrimaryDefaultDark = Color(0xFF3E88EF);  // --primary-400
  static const Color colorPrimaryHoverDark   = Color(0xFF7AA6F2);  // --primary-300
  static const Color colorPrimaryPressedDark = Color(0xFFAEC7F8);  // --primary-200

  // --- Text ---
  static const Color textDefault   = Color(0xFF000000);  // --static-black
  static const Color textSecondary = Color(0xFF5D6472);  // --neutral-600
  static const Color textMuted     = Color(0xFF6D7585);  // --neutral-500
  static const Color textOnAction  = Color(0xFFFFFFFF);  // --static-white
  static const Color textInverse   = Color(0xFFFFFFFF);  // --static-white
  static const Color textAction    = Color(0xFF0062C1);  // --primary-600
  static const Color textDisabled  = Color(0xFFA0A5B4);  // --neutral-300

  // --- Text (dark mode) ---
  static const Color textDefaultDark   = Color(0xFFFFFFFF);  // --static-white
  static const Color textSecondaryDark = Color(0xFFC2C7D3);  // --neutral-200
  static const Color textMutedDark     = Color(0xFFA0A5B4);  // --neutral-300
  static const Color textOnActionDark  = Color(0xFF000000);  // --static-black
  static const Color textActionDark    = Color(0xFF3E88EF);  // --primary-400

  // --- Status ---
  static const Color colorSuccessDefault = Color(0xFF11714E);  // --success-600
  static const Color colorWarningDefault = Color(0xFF805D00);  // --warning-600
  static const Color colorErrorDefault   = Color(0xFFB92F31);  // --error-600
  static const Color colorInfoDefault    = Color(0xFF0066AE);  // --information-600

  // --- Borders ---
  static const Color borderDefault           = Color(0xFFDEE2ED);  // --neutral-100
  static const Color borderNeutralContainer  = Color(0xFFC2C7D3);  // --neutral-200
  static const Color borderPrimaryFocus      = Color(0xFF0062C1);  // --primary-600
  static const Color borderDefaultDark       = Color(0xFF363C47);  // --neutral-800
  static const Color borderNeutralContainerDark = Color(0xFF4D535F); // --neutral-700

  // --- Spacing (as doubles, in logical pixels) ---
  static const double spacing25  =  2.0;
  static const double spacing50  =  4.0;
  static const double spacing75  =  6.0;
  static const double spacing100 =  8.0;
  static const double spacing150 = 12.0;
  static const double spacing200 = 16.0;
  static const double spacing250 = 20.0;
  static const double spacing300 = 24.0;
  static const double spacing350 = 28.0;
  static const double spacing400 = 32.0;
  static const double spacing500 = 40.0;
  static const double spacing600 = 48.0;
  static const double spacing800 = 64.0;

  // --- Border Radius ---
  static const double borderRadius50   =  4.0;
  static const double borderRadius75   =  6.0;
  static const double borderRadius100  =  8.0;
  static const double borderRadius150  = 12.0;
  static const double borderRadius200  = 16.0;
  static const double borderRadius300  = 24.0;
  static const double borderRadiusFull = 120.0;

  // --- Font sizes ---
  static const double fontSizeXs  = 12.0;
  static const double fontSizeSm  = 14.0;
  static const double fontSizeMd  = 16.0;
  static const double fontSizeLg  = 18.0;
  static const double fontSizeXl  = 20.0;
  static const double fontSize2xl = 24.0;
  static const double fontSize3xl = 28.0;
  static const double fontSize4xl = 32.0;
  static const double fontSize6xl = 48.0;

  // --- Font weights ---
  static const FontWeight fontWeightRegular  = FontWeight.w400;
  static const FontWeight fontWeightMedium   = FontWeight.w500;
  static const FontWeight fontWeightSemibold = FontWeight.w600;
  static const FontWeight fontWeightBold     = FontWeight.w700;

  // --- Elevation shadows (light) ---
  // elevation-0: no shadow
  // elevation-1 (cards, inputs at rest)
  static const List<BoxShadow> elevation1 = [
    BoxShadow(color: Color(0x0F21262E), blurRadius: 2, offset: Offset(0, 1)),
    BoxShadow(color: Color(0x1A21262E), blurRadius: 3, offset: Offset(0, 1)),
  ];
  // elevation-2 (dropdowns, hovering cards)
  static const List<BoxShadow> elevation2 = [
    BoxShadow(color: Color(0x1421262E), blurRadius: 3, offset: Offset(0, 1)),
    BoxShadow(color: Color(0x1F21262E), blurRadius: 6, offset: Offset(0, 2)),
  ];
  // elevation-3 (popovers, tooltips)
  static const List<BoxShadow> elevation3 = [
    BoxShadow(color: Color(0x1A21262E), blurRadius: 8,  offset: Offset(0, 2)),
    BoxShadow(color: Color(0x2921262E), blurRadius: 16, offset: Offset(0, 4)),
  ];
  // elevation-4 (modals, dialogs)
  static const List<BoxShadow> elevation4 = [
    BoxShadow(color: Color(0x1F21262E), blurRadius: 16, offset: Offset(0, 4)),
    BoxShadow(color: Color(0x3321262E), blurRadius: 32, offset: Offset(0, 8)),
  ];

  // --- Animation durations ---
  static const Duration durationFast    = Duration(milliseconds: 100);
  static const Duration durationDefault = Duration(milliseconds: 200);
  static const Duration durationSlow    = Duration(milliseconds: 300);
  static const Duration durationSlower  = Duration(milliseconds: 500);

  // --- Animation curves ---
  static const Curve easingStandard   = Cubic(0.4, 0.0, 0.2, 1); // general
  static const Curve easingDecelerate = Cubic(0.0, 0.0, 0.2, 1); // entering
  static const Curve easingAccelerate = Cubic(0.4, 0.0, 1.0, 1); // leaving

  // --- Z-index equivalents (use for layer ordering logic) ---
  static const int zRaised   = 10;
  static const int zDropdown = 100;
  static const int zSticky   = 200;
  static const int zOverlay  = 300;
  static const int zModal    = 400;
  static const int zPopover  = 500;
  static const int zToast    = 600;
}
```

## File: `lib/theme/app_theme.dart`

```dart
import 'package:flutter/material.dart';
import '../tokens/brandsync_tokens.dart';

abstract class AppTheme {
  static ThemeData get light => ThemeData(
    brightness: Brightness.light,
    fontFamily: 'Roboto',
    colorScheme: ColorScheme.light(
      primary:          BrandSyncTokens.colorPrimaryDefault,
      onPrimary:        BrandSyncTokens.textOnAction,
      primaryContainer: const Color(0xFFEEF0FA),   // --primary-50
      secondary:        BrandSyncTokens.colorPrimaryDefault,
      surface:          BrandSyncTokens.surfaceBase,
      onSurface:        BrandSyncTokens.textDefault,
      error:            BrandSyncTokens.colorErrorDefault,
      onError:          BrandSyncTokens.textOnAction,
    ),
    scaffoldBackgroundColor: BrandSyncTokens.surfaceContainer,
    cardTheme: CardTheme(
      color:     BrandSyncTokens.surfaceBase,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius150),
        side: const BorderSide(color: BrandSyncTokens.borderDefault, width: 1),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.disabled))
            return BrandSyncTokens.colorPrimaryDefault.withOpacity(0.5);
          if (states.contains(WidgetState.pressed))
            return BrandSyncTokens.colorPrimaryPressed;
          if (states.contains(WidgetState.hovered))
            return BrandSyncTokens.colorPrimaryHover;
          return BrandSyncTokens.colorPrimaryDefault;
        }),
        foregroundColor: WidgetStateProperty.all(BrandSyncTokens.textOnAction),
        shape: WidgetStateProperty.all(RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius100),
        )),
        padding: WidgetStateProperty.all(
          const EdgeInsets.symmetric(
            horizontal: BrandSyncTokens.spacing250,
            vertical:   BrandSyncTokens.spacing150,
          ),
        ),
      ),
    ),
  );

  static ThemeData get dark => light.copyWith(
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      primary:   BrandSyncTokens.colorPrimaryDefaultDark,
      onPrimary: BrandSyncTokens.textOnActionDark,
      surface:   BrandSyncTokens.surfaceBaseDark,
      onSurface: BrandSyncTokens.textDefaultDark,
    ),
    scaffoldBackgroundColor: BrandSyncTokens.surfaceContainerDark,
    cardTheme: CardTheme(
      color:     BrandSyncTokens.surfaceBaseDark,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius150),
        side: const BorderSide(color: BrandSyncTokens.borderDefaultDark, width: 1),
      ),
    ),
  );
}
```

---

# 10. React Native Theme Engine

React Native has no CSS. All tokens are JS/TS constants; no CSS variables.

## File: `src/tokens/BrandSyncTokens.ts`

```typescript
import { Platform, ViewStyle } from 'react-native';

// ============================================================
// BrandSync Token Bridge — React Native
// Semantic tokens only. Web-only tokens (hover, focus, transitions) omitted.
// Values from §12 resolved reference.
// ============================================================

export const BrandSyncTokens = {
  // --- Surfaces ---
  surfaceBase:      '#ffffff',   // --static-white
  surfaceContainer: '#F9FAFB',   // --neutral-25
  surfaceSelected:  '#DEE2ED',   // --neutral-100
  surfaceActive:    '#DEE2ED',   // --neutral-100
  surfaceAction:    '#0062C1',   // --primary-600
  surfaceInverse:   '#21262E',   // --neutral-900

  // --- Surfaces (dark) ---
  surfaceBaseDark:      '#191C22',   // --neutral-950
  surfaceContainerDark: '#21262E',   // --neutral-900
  surfaceSelectedDark:  '#4D535F',   // --neutral-700

  // --- Primary ---
  colorPrimaryDefault: '#0062C1',   // --primary-600
  colorPrimaryPressed: '#003A78',   // --primary-800
  colorPrimaryDefaultDark: '#3E88EF',  // --primary-400
  colorPrimaryPressedDark: '#AEC7F8',  // --primary-200

  // --- Text ---
  textDefault:   '#000000',   // --static-black
  textSecondary: '#5D6472',   // --neutral-600
  textMuted:     '#6D7585',   // --neutral-500
  textOnAction:  '#ffffff',   // --static-white
  textAction:    '#0062C1',   // --primary-600
  textDisabled:  '#A0A5B4',   // --neutral-300

  // --- Text (dark) ---
  textDefaultDark:   '#ffffff',   // --static-white
  textSecondaryDark: '#C2C7D3',   // --neutral-200
  textMutedDark:     '#A0A5B4',   // --neutral-300
  textOnActionDark:  '#000000',   // --static-black
  textActionDark:    '#3E88EF',   // --primary-400

  // --- Status ---
  colorSuccessDefault: '#11714E',  // --success-600
  colorWarningDefault: '#805D00',  // --warning-600
  colorErrorDefault:   '#B92F31',  // --error-600

  // --- Borders ---
  borderDefault:          '#DEE2ED',  // --neutral-100
  borderNeutralContainer: '#C2C7D3',  // --neutral-200
  borderDefaultDark:      '#363C47',  // --neutral-800

  // --- Spacing (dp) ---
  spacing25:  2,
  spacing50:  4,
  spacing75:  6,
  spacing100: 8,
  spacing150: 12,
  spacing200: 16,
  spacing250: 20,
  spacing300: 24,
  spacing350: 28,
  spacing400: 32,
  spacing500: 40,
  spacing600: 48,
  spacing800: 64,

  // --- Border Radius ---
  borderRadius50:   4,
  borderRadius75:   6,
  borderRadius100:  8,
  borderRadius150:  12,
  borderRadius200:  16,
  borderRadius300:  24,
  borderRadiusFull: 9999,

  // --- Font sizes ---
  fontSizeXs:  12,
  fontSizeSm:  14,
  fontSizeMd:  16,
  fontSizeLg:  18,
  fontSizeXl:  20,
  fontSize2xl: 24,
  fontSize3xl: 28,
  fontSize4xl: 32,

  // --- Font weights ---
  fontWeightRegular:  '400' as const,
  fontWeightMedium:   '500' as const,
  fontWeightSemibold: '600' as const,
  fontWeightBold:     '700' as const,

  // --- Animation ---
  durationFast:    100,
  durationDefault: 200,
  durationSlow:    300,
} as const;

// Elevation shadows — platform-specific
export const BrandSyncElevation = {
  // elevation-0: no shadow (omit shadowProps)
  elevation1: Platform.select<ViewStyle>({
    ios: {
      shadowColor:   '#21262E',
      shadowOffset:  { width: 0, height: 1 },
      shadowOpacity: 0.10,
      shadowRadius:  2,
    },
    android: { elevation: 2 },
    default: {},
  })!,
  elevation2: Platform.select<ViewStyle>({
    ios: {
      shadowColor:   '#21262E',
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius:  6,
    },
    android: { elevation: 4 },
    default: {},
  })!,
  elevation4: Platform.select<ViewStyle>({
    ios: {
      shadowColor:   '#21262E',
      shadowOffset:  { width: 0, height: 8 },
      shadowOpacity: 0.20,
      shadowRadius:  32,
    },
    android: { elevation: 8 },
    default: {},
  })!,
};
```

## Dark mode (React Native)

```typescript
import { useColorScheme } from 'react-native';

export function useThemeTokens() {
  const scheme = useColorScheme();
  const isDark  = scheme === 'dark';

  return {
    surfaceBase:     isDark ? BrandSyncTokens.surfaceBaseDark     : BrandSyncTokens.surfaceBase,
    surfaceContainer:isDark ? BrandSyncTokens.surfaceContainerDark: BrandSyncTokens.surfaceContainer,
    textDefault:     isDark ? BrandSyncTokens.textDefaultDark     : BrandSyncTokens.textDefault,
    textSecondary:   isDark ? BrandSyncTokens.textSecondaryDark   : BrandSyncTokens.textSecondary,
    colorPrimary:    isDark ? BrandSyncTokens.colorPrimaryDefaultDark : BrandSyncTokens.colorPrimaryDefault,
    borderDefault:   isDark ? BrandSyncTokens.borderDefaultDark   : BrandSyncTokens.borderDefault,
  };
}
```

---

# 11. Dark Mode

| Framework | Mechanism | Token switching |
|-----------|-----------|-----------------|
| React (CSS) | `document.documentElement.setAttribute('data-theme', 'dark')` | Automatic via CSS vars |
| Vue | Same as React + composable wrapper | Automatic via CSS vars |
| Angular | Same as React | Automatic via CSS vars |
| React + MUI | `data-theme` attribute only — no second MUI theme | Automatic via CSS vars |
| Flutter | `ThemeMode.dark` → `AppTheme.dark` | `*Dark` constant variants |
| React Native | `useColorScheme()` hook | `useThemeTokens()` composable |
| Tailwind | `darkMode: ['attribute', '[data-theme="dark"]']` | Automatic via CSS vars |

**Never:**
- Rebuild a theme object dynamically for dark mode on web
- Use `prefers-color-scheme` media query alone — always support manual toggle
- Invent dark-mode color values — use only tokens from the dark block in `_tokens.css`

---

# 12. Resolved Token Reference

Use these flattened values only where CSS variables cannot be used (Flutter, React Native,
MAUI, MUI palette, Angular Material SCSS palette). Everywhere else use semantic token names.

## Spacing → px

| Token | Value | | Token | Value |
|-------|-------|-|-------|-------|
| `--spacing-25`  |  2px  | | `--spacing-350` | 28px |
| `--spacing-50`  |  4px  | | `--spacing-400` | 32px |
| `--spacing-75`  |  6px  | | `--spacing-500` | 40px |
| `--spacing-100` |  8px  | | `--spacing-550` | 44px |
| `--spacing-150` | 12px  | | `--spacing-600` | 48px |
| `--spacing-200` | 16px  | | `--spacing-700` | 56px |
| `--spacing-250` | 20px  | | `--spacing-800` | 64px |
| `--spacing-300` | 24px  | | `--spacing-1000`| 80px |

## Border Radius → px

| Token | Value |
|-------|-------|
| `--border-radius-0`   |   0px |
| `--border-radius-50`  |   4px |
| `--border-radius-75`  |   6px |
| `--border-radius-100` |   8px |
| `--border-radius-150` |  12px |
| `--border-radius-200` |  16px |
| `--border-radius-300` |  24px |
| `--border-radius-full`| 120px |

## Font Size → px

| Token | Value | | Token | Value |
|-------|-------|-|-------|-------|
| `--font-size-2xs` | 10px | | `--font-size-xl`  | 20px |
| `--font-size-xs`  | 12px | | `--font-size-2xl` | 24px |
| `--font-size-sm`  | 14px | | `--font-size-3xl` | 28px |
| `--font-size-md`  | 16px | | `--font-size-4xl` | 32px |
| `--font-size-lg`  | 18px | | `--font-size-5xl` | 40px |
|                   |      | | `--font-size-6xl` | 48px |

## Shadows — Light Mode (flattened)

```
elevation-0 : none
elevation-1 : 0 1px 2px rgba(33,38,46,0.06), 0 1px 3px rgba(33,38,46,0.10)
elevation-2 : 0 1px 3px rgba(33,38,46,0.08), 0 2px 6px rgba(33,38,46,0.12)
elevation-3 : 0 2px 8px rgba(33,38,46,0.10), 0 4px 16px rgba(33,38,46,0.16)
elevation-4 : 0 4px 16px rgba(33,38,46,0.12), 0 8px 32px rgba(33,38,46,0.20)
elevation-5 : 0 8px 24px rgba(33,38,46,0.14), 0 16px 48px rgba(33,38,46,0.24)
elevation-6 : 0 16px 48px rgba(33,38,46,0.20), 0 32px 64px rgba(33,38,46,0.32)
```

## Shadows — Dark Mode (flattened, pure-black base)

```
elevation-0 : none
elevation-1 : 0 1px 2px rgba(0,0,0,0.20), 0 1px 3px rgba(0,0,0,0.30)
elevation-2 : 0 1px 3px rgba(0,0,0,0.24), 0 2px 6px rgba(0,0,0,0.36)
elevation-3 : 0 2px 8px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.40)
elevation-4 : 0 4px 16px rgba(0,0,0,0.32), 0 8px 32px rgba(0,0,0,0.48)
elevation-5 : 0 8px 24px rgba(0,0,0,0.36), 0 16px 48px rgba(0,0,0,0.52)
elevation-6 : 0 16px 48px rgba(0,0,0,0.48), 0 32px 64px rgba(0,0,0,0.64)
```

## Semantic Color Tokens — Light Mode (hex)

```
--color-primary-default : #0062C1   --color-primary-hover   : #0051A2
--color-primary-pressed : #003A78   --color-primary-container: #EEF0FA

--surface-base          : #ffffff   --surface-container     : #F9FAFB
--surface-hover         : #EFF0F8   --surface-selected      : #DEE2ED
--surface-action        : #0062C1   --surface-inverse       : #21262E

--text-default          : #000000   --text-secondary        : #5D6472
--text-muted            : #6D7585   --text-on-action        : #ffffff
--text-action           : #0062C1   --text-inverse          : #ffffff
--text-disabled         : #A0A5B4

--border-default        : #DEE2ED   --border-neutral-container: #C2C7D3
--border-primary-focus  : #0062C1   --border-neutral-hover    : #828998

--color-success-default : #11714E   --color-error-default   : #B92F31
--color-warning-default : #805D00   --color-info-default    : #0066AE
```

## Semantic Color Tokens — Dark Mode (hex)

```
--color-primary-default : #3E88EF   --color-primary-hover   : #7AA6F2
--color-primary-pressed : #AEC7F8

--surface-base          : #191C22   --surface-container     : #21262E
--surface-hover         : #363C47   --surface-selected      : #4D535F
--surface-action        : #3E88EF

--text-default          : #ffffff   --text-secondary        : #C2C7D3
--text-muted            : #A0A5B4   --text-on-action        : #000000
--text-action           : #3E88EF   --text-inverse          : #000000

--border-default        : #363C47   --border-neutral-container: #4D535F
--border-primary-focus  : #3E88EF
```

## Transitions (resolved, web only)

```
--transition-color       : color 200ms linear
--transition-bg          : background-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1)
--transition-border      : border-color 200ms linear
--transition-shadow      : box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)
--transition-opacity     : opacity 200ms linear
--transition-transform   : transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)
--transition-interactive : color 200ms linear,
                           background-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1),
                           border-color 200ms linear
```

## Z-Index scale

```
--z-index-below    :  -1   --z-index-overlay  : 300
--z-index-base     :   0   --z-index-modal    : 400
--z-index-raised   :  10   --z-index-popover  : 500
--z-index-dropdown : 100   --z-index-toast    : 600
--z-index-sticky   : 200   --z-index-top      : 999
```

---

# 13. BrandSync Token Reference

Always use semantic tokens in component code. Never reference Layer 1 primitives.

```css
/* Surfaces */
var(--surface-base)          /* white — card, sidebar backgrounds */
var(--surface-container)     /* light grey — page background */
var(--surface-hover)         /* hover state background */
var(--surface-selected)      /* active/selected state */
var(--surface-action)        /* primary action background */
var(--surface-inset)         /* inset / recessed area */
var(--surface-inverse)       /* inverse surface (dark bg in light mode) */

/* Text */
var(--text-default)          /* primary text */
var(--text-secondary)        /* secondary/muted text */
var(--text-muted)            /* placeholder, hint text */
var(--text-action)           /* active tab, link color */
var(--text-on-action)        /* text on primary buttons */
var(--text-inverse)          /* text on inverse surfaces */
var(--text-on-disabled)      /* text on disabled elements */

/* Status text */
var(--text-success)          var(--text-info)
var(--text-warning)          var(--text-error)

/* Primary Actions */
var(--color-primary-default) /* primary button background */
var(--color-primary-hover)   /* primary button hover */
var(--color-primary-pressed) /* primary button active/pressed */
var(--color-primary-container) /* primary container (chips, pills) */

/* Neutral Actions */
var(--color-neutral-container)        /* secondary button bg */
var(--color-neutral-container-hover)  /* secondary button hover */
var(--text-neutral-default)           /* secondary button text */

/* Status Colors */
var(--color-success-default) var(--color-success-container)
var(--color-warning-default) var(--color-warning-container)
var(--color-error-default)   var(--color-error-container)
var(--color-info-default)    var(--color-info-container)

/* Icons */
var(--icon-default)          /* primary icon color */
var(--icon-secondary)        /* secondary icon */
var(--icon-muted)            /* subtle icon */
var(--icon-action)           /* icon on primary action */
var(--icon-disabled)         /* disabled icon */

/* Borders */
var(--border-default)                  /* standard borders */
var(--border-neutral-container)        /* input borders */
var(--border-neutral-hover)            /* input border on hover */
var(--border-primary-focus)            /* focus ring color */

/* Spacing */
var(--spacing-25)    /*  2px */    var(--spacing-250)  /* 20px */
var(--spacing-50)    /*  4px */    var(--spacing-300)  /* 24px */
var(--spacing-75)    /*  6px */    var(--spacing-400)  /* 32px */
var(--spacing-100)   /*  8px */    var(--spacing-500)  /* 40px */
var(--spacing-150)   /* 12px */    var(--spacing-600)  /* 48px */
var(--spacing-200)   /* 16px */    var(--spacing-800)  /* 64px */

/* Border Radius */
var(--border-radius-50)   /*  4px — tight chips */
var(--border-radius-75)   /*  6px — small elements */
var(--border-radius-100)  /*  8px — buttons, inputs */
var(--border-radius-150)  /* 12px — cards, modals */
var(--border-radius-200)  /* 16px — large cards */
var(--border-radius-full) /* 120px — pills, avatars */

/* Border Width */
var(--border-width-thin)   /* 1px */
var(--border-width-medium) /* 2px — focus rings */
var(--border-width-thick)  /* 4px */

/* Elevation */
var(--elevation-0)  /* flat surface */
var(--elevation-1)  /* cards, inputs at rest */
var(--elevation-2)  /* dropdowns, hovering cards */
var(--elevation-3)  /* popovers, tooltips */
var(--elevation-4)  /* modals, dialogs */

/* Transitions (web only) */
var(--transition-color)        /* color changes */
var(--transition-bg)           /* background transitions */
var(--transition-interactive)  /* hover/focus state changes */
var(--transition-shadow)       /* elevation changes */

/* Opacity */
var(--opacity-disabled) /* 0.5 — disabled state */
```

---

# 14. Validation Checklist

Before delivery:

- [ ] User confirmed brand color — one of the 14 BrandSync brand color names
- [ ] User confirmed target platform — theme generated for the correct framework
- [ ] Brand color override block added to `_tokens.css` / `_brand.css` (web) or resolved hex values used in token bridge (mobile)
- [ ] `_tokens.css` fetched from MCP and verified — all semantic token groups present
- [ ] Token bridge file created at the correct path for the framework
- [ ] No hardcoded hex values, px values, or raw numbers in component code
- [ ] No Layer 1 primitive tokens referenced in component code
- [ ] Primary semantic tokens (`--color-primary-*`, `--text-action`, `--icon-action`, `--border-primary-*`) all resolve to the chosen brand color scale
- [ ] Dark mode uses the lighter shade variant of the chosen brand color (`-400`/`-300`/`-200`)
- [ ] Dark mode implemented via the framework-appropriate mechanism
- [ ] Dark mode persists across sessions (localStorage for web, SharedPreferences for Flutter)
- [ ] Web-only tokens (hover, focus, transitions, grid) omitted from mobile token bridges
- [ ] Elevation/shadow values use the resolved reference from §12 on mobile platforms
- [ ] Animation durations mapped to platform animation API (not CSS transitions) on mobile

---

Version: 1.1
Stack: Framework-agnostic (React, Vue, Angular, Flutter, React Native, Tailwind)
Mode: Token Bridge First
Authority: BrandSync Design System (`_tokens.css`)
Violation Policy: Fail Hard — never generate hardcoded values
