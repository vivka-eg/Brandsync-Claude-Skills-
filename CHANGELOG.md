# Changelog

All changes to skill files are documented here.
Format: `## v[version] - [date]` with sections per skill file.

---

## v0.2.6 - 2026-03-11

### skills/brandsync-foundations.md
- Deprecated and removed — replaced by the 9 platform-specific files in `skills/foundations/`

---

## v0.2.5 - 2026-03-11

### skills/foundations/ (all 9 files)
- Removed all `_tokens.css` local file references from platform-specific code examples
- Web files: updated all import statements to `import 'brandsync-tokens/tokens.css'`
- Angular: updated `angular.json` styles array entry to `brandsync-tokens/tokens.css`; SCSS `@import` updated
- Plain HTML: updated `<link>` href to `node_modules/brandsync-tokens/tokens.css`
- Mobile files: updated "missing tokens" instruction from "replace `_tokens.css`" to `npm install brandsync-tokens@latest`
- Intro table: updated Token Source from `_tokens.css — fetched from MCP` → `brandsync-tokens npm package`
- Code comments: updated `_tokens.css resolved reference` → `brandsync-tokens resolved reference`
- Authority line: updated to reference `brandsync-tokens` across all files

---

## v0.2.3 - 2026-03-11

### skills/foundations/ (all 9 files)
- Step 4 updated across all files: web check changed from `_tokens.css` already imported → `brandsync-tokens` installed and imported
- Validation checklist updated: replaced `_tokens.css` fetched from MCP item → `brandsync-tokens` installed item

---

## v0.2.2 - 2026-03-11

### skills/foundations/ (all 9 files)
- Step 2 updated for web platforms (`web`, `react-material`, `angular-material`, `vue`, `tailwind`): replaced MCP `get_tokens` call with `npm install brandsync-tokens`; brand color override block retained
- Step 2 updated for mobile platforms (`flutter`, `react-native`, `jetpack-compose`, `swiftui`): reframed as "inspect token values for native code generation"; added explicit rule — do not copy `_tokens.css` into a mobile project
- Step 4 updated for web files: check changed from `_tokens.css` imported → `brandsync-tokens` installed and imported

---

## v0.2.0 - 2026-03-09 (npm)

### npm package: brandsync-skills
- Published `brandsync-skills` npm package — skill files now installable via `npx brandsync-skills <skill-name>`
- CLI saves skill to `~/.claude/skills/` on install

### skills/foundations/ (new directory)
- Split `brandsync-foundations.md` into 9 platform-specific files under `skills/foundations/`
- Each file contains shared sections (§0 Pre-Flight, §1–3, §13–17) plus the platform-specific section
- `web.md` — §4 Web Output (CSS variables)
- `react-material.md` — §5 React + MUI
- `angular-material.md` — §6 Angular Material
- `vue.md` — §7 Vue 3
- `tailwind.md` — §8 Tailwind CSS
- `flutter.md` — §9 Flutter
- `react-native.md` — §10 React Native
- `jetpack-compose.md` — §11 Jetpack Compose
- `swiftui.md` — §12 SwiftUI

---

## v0.14.3 - 2026-03-02

### skills/vue.md
- Fixed §4 Icon Protocol: replaced `lucide-vue-next` with `@phosphor-icons/vue`; updated named import example (`PhMagnifyingGlass`, `PhBell`, `PhPlus`); added `weight` prop examples; added install step; added explicit prohibition on `lucide-vue-next`, `data-lucide`, and `createIcons()`
- Updated SFC structure template (§2): import example updated to `@phosphor-icons/vue`
- Updated layout example (§7): nav icon updated from `<SearchIcon>` to `<PhMagnifyingGlass>`
- Updated DO/DON'T rules (§13) and Validation Checklist (§15) to reference `@phosphor-icons/vue`
- Updated stack footer
- Version bumped to 1.4

### skills/angular-vanilla-ui.md
- Fixed §8 Icon Protocol: replaced Lucide CDN + `createIcons()` pattern with `@phosphor-icons/webcomponents` npm package; added install + `main.ts` import + `CUSTOM_ELEMENTS_SCHEMA` instructions; replaced `data-lucide` template pattern with `<ph-*>` web component elements; removed DOM-mutation re-initialization requirement (Phosphor web components self-register)
- Fixed §7 Mandatory Angular Component Pattern: both Angular 17+ and Angular <17 examples updated — removed `AfterViewInit` + `initializeIcons()`, replaced with `OnInit` + `CUSTOM_ELEMENTS_SCHEMA` in decorator; theme init moved to `ngOnInit()`
- Fixed §6 Hard Constraints: replaced Lucide CDN and `ngAfterViewInit` icon init bullets with Phosphor webcomponents and `CUSTOM_ELEMENTS_SCHEMA` bullets
- Updated Validation Checklist (§13): replaced Lucide CDN and `createIcons()` items with Phosphor install, schema, and no-CDN items
- Version bumped to 7.2

### skills/angular-material-ui.md
- Fixed §10 Icon Strategy: removed two-option Lucide/Material Icons pattern; replaced with single required `@phosphor-icons/webcomponents` implementation including install, `main.ts` import, `CUSTOM_ELEMENTS_SCHEMA`, and `<ph-*>` template usage
- Fixed §5 Component Pattern: removed `AfterViewInit` + `initializeIcons()` + Lucide `createIcons()`; replaced with `OnInit` + `CUSTOM_ELEMENTS_SCHEMA` in decorator; theme init moved to `ngOnInit()`
- Fixed §6 Template Translation: updated canonical and Material adaptation examples from `<i data-lucide="plus">` to `<ph-plus>`; updated change notes
- Updated Validation Checklist (§14): replaced Lucide/Material icon strategy item with Phosphor enforcement + `CUSTOM_ELEMENTS_SCHEMA` items
- Version bumped to 1.4

---

## v0.14.2 - 2026-03-02

### skills/brandsync-foundations.md
- Added §15 Icon Library — Phosphor Icons: per-framework package table, usage examples (React, Vue, Angular, Flutter, React Native), icon weights table, BrandSync semantic token coloring rules
- Added §0 Step 5: Install Phosphor Icons — mandatory pre-flight step to check and install the correct Phosphor package before writing any component code; includes Angular `CUSTOM_ELEMENTS_SCHEMA` note for both standalone and NgModule projects; .NET MAUI documented as no-package (inline SVG fallback)
- Added §2 Core Law rule #7: never use Lucide, Heroicons, Font Awesome, Material Icons, or any other icon library — always use Phosphor Icons
- Added two checklist items to §14 Validation Checklist: Phosphor-only enforcement and BrandSync icon semantic token coloring
- Version bumped to 1.2

### skills/flutter.md
- Fixed §10 Icon Protocol: replaced `lucide_flutter` (Options A/B pattern) with `phosphor_flutter` as the single required icon package, aligned to the cross-skill Phosphor Icons standard; updated usage examples to `PhosphorIcon` / `PhosphorIcons.*` API with weight variants

---

## v0.14.1 - 2026-02-25

### skills/brandsync-foundations.md
- Added interactive onboarding in §0 Step 1: Claude now asks two questions before any code generation
  - Question 1: brand color — lists all 14 BrandSync brand colors by name with a mapping table (scale → light/dark mode primary hex ladder)
  - Question 2: platform — lists all 9 supported platform options so the user explicitly confirms the target
- Added brand color override block: if the chosen color is not Blue, generates a CSS override (`_brand.css` or appended to `_tokens.css`) that remaps all `--color-primary-*`, `--text-action`, `--icon-action`, and `--border-primary-*` semantic tokens to the chosen brand scale; dark mode block included
- Added mobile brand color note: for Flutter/React Native/MAUI, resolved hex values for the chosen scale must be used in the token bridge (CSS vars not available)
- Updated §3 and §4 to reference [BRAND_COLOR] and [PLATFORM] placeholders throughout
- Added brand-color-specific checklist items: override block present, primary tokens resolve to chosen brand scale, dark mode uses `-400`/`-300`/`-200` variants
- Version bumped to 1.1

---

## v0.14.0 - 2026-02-25

### skills/brandsync-foundations.md
- Initial release of the cross-framework BrandSync Foundations theme engine generator
- §0 Pre-Flight: MCP token fetch, framework detection from project files (package.json, pubspec.yaml, .csproj), existing theme bridge check
- §1 Token Architecture: two-layer primitive/semantic model with dark-mode switching explanation
- §2 Core Law: enforced token authority rules across all frameworks
- §3 Platform Scope: web-only vs universal token classification — guides mobile bridge generation
- §4 Web Output: global `_tokens.css` import patterns for React, Vue, Angular, and plain HTML; dark mode toggle pattern
- §5 React + MUI: `brandsyncTheme.ts` with raw hex palette (mandatory for MUI internals), CSS var `styleOverrides`, `ThemeProvider` wiring, dark mode via `data-theme` only
- §6 Angular Material: version detection table (M2/M3), `material-theme.scss` with flattened palette palette, semantic token overrides in `styles.scss`, import order rule
- §7 Vue 3: global import pattern, `useTheme` composable with localStorage persistence
- §8 Tailwind CSS: `tailwind.config.ts` with full color, spacing, border-radius, shadow, font, and transition extension mapping to CSS vars; `darkMode: attribute` config
- §9 Flutter: complete `brandsync_tokens.dart` with typed Color, spacing doubles, border radius doubles, elevation BoxShadow constants, animation Duration/Curve constants; `app_theme.dart` with `AppTheme.light` / `AppTheme.dark` using `WidgetStateProperty`
- §10 React Native: `BrandSyncTokens.ts` with typed string/number constants (web-only tokens omitted); platform-split `BrandSyncElevation` for iOS/Android shadow APIs; `useThemeTokens()` composable for `useColorScheme()` integration
- §11 Dark Mode: per-framework mechanism summary table; rules against dynamic theme rebuilding and invented dark values
- §12 Resolved Token Reference: flattened spacing, border-radius, font-size, shadow (light + dark), semantic colors (light + dark), transitions, z-index — for use in framework theme configs that cannot accept CSS variables
- §13 BrandSync Token Reference: full semantic token vocabulary (surfaces, text, actions, status, icons, borders, spacing, radius, elevation, transitions, opacity)
- §14 Validation Checklist: framework detection, token bridge path, no hardcoded values, platform scope, dark mode persistence

---

## v0.13.0 - 2026-02-24

### skills/flutter.md
- Initial release of Flutter BrandSync adapter
- §0 Pre-Flight: MCP token fetch, project structure check (pubspec.yaml, main.dart), canonical example fetch
- §3 Project Setup: standard Flutter file structure, required pub.dev packages (flutter_riverpod, lucide_flutter, shared_preferences, go_router), main.dart ProviderScope entry
- §4 Token Bridge: full CSS-to-Dart constants mapping — Color, spacing doubles, border radius doubles in `brandsync_tokens.dart`; `0x????????` sentinel forces compile error on unfilled placeholders
- §5 ThemeData Configuration: `AppTheme.light` / `AppTheme.dark` built from token constants in `app_theme.dart`; `WidgetStateProperty` for button states; `InputDecorationTheme` for inputs; dark variant strategy
- §6 State Management: Riverpod patterns — `StateProvider`, `StateNotifierProvider`, `FutureProvider`; `ConsumerWidget` and `ConsumerStatefulWidget` examples; `dispose()` rule
- §7 Layout Patterns: page wrapper (Scaffold + SafeArea), card (Container + BoxDecoration), two-column (Row + SizedBox), card grid (GridView.builder), form layout, inline row, collapsible section
- §8 List / Table Pattern: `BrandSyncTable` widget with header + data rows; status badge
- §9 Modal / Dialog Pattern: `showDialog` + custom `Dialog` widget with explicit BrandSync shape and color
- §10 Icon Protocol: Option A (`lucide_flutter`) and Option B (`Icons.*`); no CDN rule
- §11 Dark Mode: `ThemeModeNotifier` with `SharedPreferences` persistence; `*Dark` token variants; no `data-theme` attribute (Flutter, not web)
- §12 Token Reference: full Dart constant vocabulary for all BrandSync semantic tokens
- §13 Validation Checklist: token bridge verification, ProviderScope, WidgetStateProperty states, ListView.builder rule, dispose rule, dark mode, no hardcoded values

---

## v0.12.0 - 2026-02-20

### skills/dotnet-maui.md
- Fixed §4 Token Bridge: removed XML comment nodes inside `<Color>` elements (comments are not text content — MAUI's Color type converter would see an empty node and silently produce transparent colors or throw); replaced with a key→CSS mapping table (prose) and a code template using `#hex` sentinel values that the XAML parser rejects loudly if left unfilled; separated spacing/radius constants (safe to use as-is) from Color tokens (must come from MCP)
- Fixed §11 Dark Mode: removed invented dark hex values (`#1A1D27`, `#13151F`, etc.); replaced with `#hex` sentinels and an explicit pre-condition — check MCP `get_tokens` for a `[data-theme="dark"]` block first; if BrandSync has no dark theme tokens, do not invent values
- Version bumped to 1.2

---

## v0.11.0 - 2026-02-20

### skills/dotnet-maui.md
- Fixed §11 Dark Mode: removed `AppThemeColor` (not a MAUI type — would cause build error); replaced with correct pattern of paired light/dark Color tokens (`SurfaceBase` + `SurfaceBaseDark`) and `AppThemeBinding` markup extension used at the property/setter level; added `AppThemeBinding` in Style setter example
- Fixed §4 Token Bridge: added explicit ⚠️ warning that Color hex values are structural placeholders — must be replaced with actual hex values from `get_tokens` MCP response; spacing and radius values noted as safe constants; added CSS token name comments on each Color entry
- Fixed §8 Control Styles / InputContainer: replaced invalid XAML `<Entry.Handlers>` comment placeholder (would cause parse error) with real `EntryHandler.Mapper.AppendToMapping` code in `MauiProgram.cs` for Android underline and iOS border removal
- Fixed §8 Primary Button: added note clarifying `Button.CornerRadius` is `int` and `RoundRectangle.CornerRadius` is a struct — both accept the `x:Double` token via XAML type converters
- Version bumped to 1.1

---

## v0.10.0 - 2026-02-20

### skills/dotnet-maui.md
- Initial release of .NET MAUI BrandSync adapter
- §0 Pre-Flight: MCP token fetch, project structure check (MauiProgram.cs, App.xaml, .csproj), canonical example fetch
- §3 Project Setup: standard MAUI file structure, required NuGet packages (CommunityToolkit.Mvvm + CommunityToolkit.Maui), MauiProgram.cs registration
- §4 Token Bridge: full CSS-to-XAML ResourceDictionary mapping — Color, Thickness (spacing), CornerRadius, and border width tokens in `BrandSyncTokens.xaml`; App.xaml merge instruction
- §5 XAML Page Pattern: ContentPage skeleton with BindingContext wiring and constructor injection note
- §6 MVVM Pattern: CommunityToolkit.Mvvm source generators — `[ObservableProperty]`, `[RelayCommand]`, `ObservableCollection`; XAML binding examples
- §7 Layout Patterns: page wrapper, card (Border+StrokeShape), two-column Grid, card grid (CollectionView GridItemsLayout), form layout, inline row
- §8 Control Styles: PrimaryButton, SecondaryButton, InputContainer with VisualStateManager (Pressed + Disabled states), status badge
- §9 Icon Protocol: MDI font setup via MauiProgram.cs, SVG via MauiImage, explicit rule against CDN icons
- §10 CollectionView: header row, DataTemplate with RelativeSource command binding, selected state VisualStateManager, EmptyView
- §11 Dark Mode: AppThemeBinding color tokens, UserAppTheme manual toggle, Preferences persistence; rule against dynamic ResourceDictionary rebuilding
- §12 Token Reference: full XAML StaticResource vocabulary for all BrandSync semantic tokens
- §13 Validation Checklist: token bridge verification, CT.Mvvm/CT.Maui registration, StaticResource-only rule, VSM states, CollectionView over ListView, Border over Frame, icon bundling, dark mode, empty state

---

## v0.9.0 - 2026-02-20

### skills/angular-material-ui.md
- Expanded Pre-Flight Step 2: structured detection for standalone vs NgModule, styles path from `angular.json`, and existing theme file — no longer assumes `src/styles.scss` or a clean-slate project
- Replaced v17–v18 "inferred, not tested" warning with concrete read-first instructions: search existing styles for `mat.theme(` vs `mat.define-light-theme(` to confirm active API before writing
- Added §5b: Standalone vs NgModule import differences — clarifies where Material module imports go in each project type, with explicit warning against adding `imports[]` to component decorators in NgModule projects
- Added §8 Forms: `mat-form-field` + `matInput` + `mat-select` with ReactiveFormsModule, M2/M3 token layers for form field overrides (`--mdc-outlined-text-field-*` vs `--mat-form-field-*`), global styles placement rule
- Expanded §7 Table: added sort + pagination pattern with `MatTableDataSource`, `MatSort`, `MatPaginator`, and SCSS overrides for sort headers and paginator
- Updated Validation Checklist: grouped into Environment / Tokens / Theming / Components / Output; added checklist items for standalone detection, styles path, existing theme check, v17-v18 API confirmation, forms token layer, table sort/pagination
- Renumbered sections: Dialog §9, Icons §10, Abandon §11, Dark Mode §12, Token Reference §13, Checklist §14
- Version bumped to 1.3

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
