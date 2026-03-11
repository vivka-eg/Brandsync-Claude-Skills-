---
name: brandsync-foundations-react-native
description: BrandSync theme engine for React Native — typed TypeScript constants with platform-specific elevation shadows and a useThemeTokens hook for dark mode.
version: 1.2
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
> 10. Mobile — Android (Jetpack Compose)
> 11. Mobile — iOS/macOS (SwiftUI)

Once the user answers, record the choice as **[PLATFORM]** and jump to the matching section
(§4 through §12) after completing Steps 2–4 below.

---

## Step 2: Inspect token values for native code generation

Use the MCP call to read the canonical token values — mobile platforms cannot use CSS variables, so you need the resolved hex values from §14 to populate the native token bridge.

```
mcp__brandsync-mcp-server__get_tokens
```

Do not copy `_tokens.css` into a mobile project. Use this call only to inspect token values.

Verify the response contains all required layers:

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

For mobile platforms (Flutter, Jetpack Compose, SwiftUI, React Native, MAUI) that cannot use CSS variables, look up the
resolved hex values for the chosen brand color scale in §14 and use those directly in the token
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
| `build.gradle` or `build.gradle.kts` with `compose` dependency | Jetpack Compose |
| `.xcodeproj` / `Package.swift` / `*.swift` files present | SwiftUI |

If the user's stated platform and detected framework conflict, ask before proceeding.

## Step 4: Check for an existing theme engine

Before generating, check if a theme bridge already exists:

- Web: Is `_tokens.css` already imported globally?
- React/MUI: Is `ThemeProvider` already configured?
- Flutter: Does `lib/tokens/brandsync_tokens.dart` exist?
- React Native: Does `src/tokens/BrandSyncTokens.ts` exist?
- MAUI: Does `BrandSyncTokens.xaml` exist in `Resources/`?
- Jetpack Compose: Does `ui/theme/BrandSyncTokens.kt` exist?
- SwiftUI: Does `Theme/BrandSyncTokens.swift` exist?

If a partial implementation exists, complete it — do not replace working code.

## Step 5: Install Phosphor Icons

Check whether the correct Phosphor package is already present in the project's dependency file.
If it is missing, install it now — before writing any component code.

| Platform             | Check for                       | Install command                        |
|----------------------|---------------------------------|----------------------------------------|
| React                | `@phosphor-icons/react` in `package.json` | `npm i @phosphor-icons/react` |
| Vue 3                | `@phosphor-icons/vue` in `package.json` | `npm i @phosphor-icons/vue` |
| Angular              | `@phosphor-icons/webcomponents` in `package.json` | `npm i @phosphor-icons/webcomponents` |
| Tailwind / plain web | `@phosphor-icons/web` in `package.json` | `npm i @phosphor-icons/web` |

**Angular — required extra step:** After installing, add `CUSTOM_ELEMENTS_SCHEMA` to every
module or standalone component that uses `<ph-*>` elements, otherwise Angular will throw an
unknown element error at compile time:

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import '@phosphor-icons/webcomponents';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<ph-house></ph-house>`,
})
export class AppComponent {}
```

Or for NgModule-based projects, add it once to the root module:
```ts
@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })
```
| Flutter              | `phosphor_flutter` in `pubspec.yaml` | `flutter pub add phosphor_flutter` |
| React Native         | `phosphor-react-native` in `package.json` | `npm i phosphor-react-native` |
| .NET MAUI            | No package — use inline SVG from phosphoricons.com | — |
| Jetpack Compose      | Not applicable — omit Phosphor for native Android | — |
| SwiftUI              | Not applicable — omit Phosphor for native iOS/macOS | — |

Do not skip this step if the project already has a different icon library installed. Phosphor
must be added alongside it — do not remove the existing library.

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
6. ✅ Resolved raw values (from §14) are only permitted in framework theme config that cannot accept CSS variables
7. ❌ Never use Lucide, Heroicons, Font Awesome, Material Icons, or any other icon library — always use Phosphor Icons (see §17)

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
- Elevation / shadows (adapt to platform shadow API — see §14)
- `--duration-*` + `--easing-*` (map to platform animation primitives)
- `--z-index-*` (map to platform layering concept)
- `--container-max`, `--sidebar-width`, `--panel-min-width`

---

# 10. React Native Theme Engine

React Native has no CSS. All tokens are JS/TS constants; no CSS variables.

## File: `src/tokens/BrandSyncTokens.ts`

```typescript
import { Platform, ViewStyle } from 'react-native';

// ============================================================
// BrandSync Token Bridge — React Native
// Semantic tokens only. Web-only tokens (hover, focus, transitions) omitted.
// Values from §14 resolved reference.
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

# 13. Dark Mode

| Framework | Mechanism | Token switching |
|-----------|-----------|-----------------|
| React (CSS) | `document.documentElement.setAttribute('data-theme', 'dark')` | Automatic via CSS vars |
| Vue | Same as React + composable wrapper | Automatic via CSS vars |
| Angular | Same as React | Automatic via CSS vars |
| React + MUI | `data-theme` attribute only — no second MUI theme | Automatic via CSS vars |
| Flutter | `ThemeMode.dark` → `AppTheme.dark` | `*Dark` constant variants |
| Jetpack Compose | `isSystemInDarkTheme()` or manual `isDark` state | `Dark`/`Light` `ColorScheme` via `BrandSyncTheme` |
| SwiftUI | `@Environment(\.colorScheme)` via `BrandSyncTheme` wrapper | `.dark` / `.light` `BrandSyncThemeTokens` instance |
| React Native | `useColorScheme()` hook | `useThemeTokens()` composable |
| Tailwind | `darkMode: ['attribute', '[data-theme="dark"]']` | Automatic via CSS vars |

**Never:**
- Rebuild a theme object dynamically for dark mode on web
- Use `prefers-color-scheme` media query alone — always support manual toggle
- Invent dark-mode color values — use only tokens from the dark block in `_tokens.css`

---

# 14. Resolved Token Reference

Use these flattened values only where CSS variables cannot be used (Flutter, Jetpack Compose,
SwiftUI, React Native, MAUI, MUI palette, Angular Material SCSS palette). Everywhere else use semantic token names.

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

# 15. BrandSync Token Reference

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

# 16. Validation Checklist

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
- [ ] Elevation/shadow values use the resolved reference from §14 on mobile platforms
- [ ] Animation durations mapped to platform animation API (not CSS transitions) on mobile
- [ ] All icons use Phosphor Icons — no substitution with Lucide, Heroicons, Font Awesome, or other libraries
- [ ] Icon colors applied via BrandSync icon semantic tokens (`--icon-default`, `--icon-action`, etc.) — no hardcoded color values
- [ ] Jetpack Compose and SwiftUI: Phosphor Icons not used — icon library choice is left to the project

---

# 17. Icon Library — Phosphor Icons

BrandSync designs use Phosphor Icons exclusively. When generating any component that includes icons,
always install and use the official Phosphor package for the target framework. Never substitute
Lucide, Heroicons, Font Awesome, Material Icons, or any other icon library — even if one is
already installed in the project.

## Package by framework

| Platform             | Package                       | Install command                        |
|----------------------|-------------------------------|----------------------------------------|
| React                | `@phosphor-icons/react`       | `npm i @phosphor-icons/react`          |
| Vue 3                | `@phosphor-icons/vue`         | `npm i @phosphor-icons/vue`            |
| Angular              | `@phosphor-icons/webcomponents` | `npm i @phosphor-icons/webcomponents` |
| Tailwind / plain web | `@phosphor-icons/web`         | `npm i @phosphor-icons/web`            |
| Flutter              | `phosphor_flutter`            | `flutter pub add phosphor_flutter`     |
| Jetpack Compose      | Not applicable — omit Phosphor for native Android | — |
| SwiftUI              | Not applicable — omit Phosphor for native iOS/macOS | — |
| React Native         | `phosphor-react-native`       | `npm i phosphor-react-native`          |
| .NET MAUI            | No official package — use inline SVG from phosphoricons.com | —        |

## Usage examples

**React:**
```tsx
import { House, MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';

<House />                   {/* default weight: regular */}
<House weight="fill" />
<House weight="duotone" />
```

**Vue 3:**
```vue
<script setup>
import { PhHouse } from '@phosphor-icons/vue';
</script>
<template>
  <PhHouse />
  <PhHouse weight="fill" />
</template>
```

**Angular (add `CUSTOM_ELEMENTS_SCHEMA` to the module/standalone component):**
```ts
// main.ts
import '@phosphor-icons/webcomponents';
```
```html
<ph-house></ph-house>
<ph-house weight="fill"></ph-house>
```

**Flutter:**
```dart
import 'package:phosphor_flutter/phosphor_flutter.dart';

Icon(PhosphorIconsRegular.house)
Icon(PhosphorIconsFill.house)
```

**React Native:**
```tsx
import { House } from 'phosphor-react-native';

<House />
<House weight="fill" />
```

## Icon weights

Use `regular` as the default unless the design specifies otherwise.

| Weight    | When to use                              |
|-----------|------------------------------------------|
| `thin`    | Decorative / large display icons         |
| `light`   | Supporting / secondary icons             |
| `regular` | Default — body and UI icons              |
| `bold`    | Emphasis, alerts, CTAs                   |
| `fill`    | Selected state, active state             |
| `duotone` | Illustrations, feature graphics          |

## Coloring icons with BrandSync tokens

Always apply icon color via a BrandSync semantic token. Never hardcode a color value on an icon.

**Web (React / Vue / Angular):**
```tsx
// Correct
<House style={{ color: 'var(--icon-default)' }} />
<House style={{ color: 'var(--icon-action)' }} />

// Wrong — hardcoded
<House color="#21262E" />
```

**Flutter:**
```dart
Icon(PhosphorIconsRegular.house, color: BrandSyncTokens.iconDefault)
```

**React Native:**
```tsx
<House color={tokens.iconDefault} />
```

Available icon semantic tokens:

| Token              | Use                                    |
|--------------------|----------------------------------------|
| `--icon-default`   | Standard UI icons                      |
| `--icon-secondary` | Supporting / lower-priority icons      |
| `--icon-muted`     | Subtle, decorative icons               |
| `--icon-action`    | Icons on primary action elements       |
| `--icon-disabled`  | Disabled state                         |

---

Version: 1.3
Stack: Framework-agnostic (React, Vue, Angular, Flutter, Jetpack Compose, SwiftUI, React Native, Tailwind)
Mode: Token Bridge First
Authority: BrandSync Design System (`_tokens.css`)
Violation Policy: Fail Hard — never generate hardcoded values
