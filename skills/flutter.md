---
name: flutter
description: Maps canonical BrandSync UI to Flutter widgets using a Dart token constants bridge and ThemeData configuration. Visual fidelity via typed token references and widget decoration.
version: 1.0
execution_mode: adaptive
error_policy: fail-with-alternatives
component_strategy: token-driven-widgets
ui_philosophy: reproduce-canonical-visual-output-via-dart-tokens
---

# Flutter BrandSync Adapter

Reproduce canonical BrandSync visual output using Flutter widgets and Dart.
BrandSync defines the visual target; Flutter's widget tree defines the structure. Bridge the gap
using a `brandsync_tokens.dart` constants file that maps CSS custom properties to typed Dart
values, then reference them throughout the widget tree.

| Aspect        | Flutter Approach                                                           |
|---------------|----------------------------------------------------------------------------|
| DOM Structure | Widget tree — reproduce visual hierarchy, not HTML tag names               |
| Styling       | `BoxDecoration`, `TextStyle`, `ThemeData` + `BrandSyncTokens` constants    |
| Tokens        | CSS vars → typed `Color`, `double`, `BorderRadius` Dart constants          |
| Icons         | `lucide_flutter` package (named imports) or `Icons.*` Material icons       |
| State         | `flutter_riverpod` — `ConsumerWidget` / `ConsumerStatefulWidget`           |
| Philosophy    | "Make Flutter widgets look like BrandSync via typed token constants"        |

---

# 0. Pre-Flight — Do This BEFORE Writing Any Code

## Step 1: Fetch the canonical tokens

Always fetch the canonical tokens from the MCP server:

```
mcp__brandsync-mcp-server__get_tokens
```

Flutter has no CSS variable support. Tokens must be translated to typed Dart constants in
`lib/tokens/brandsync_tokens.dart`. Check that this file exists and contains:

**Color tokens (spot-check):**
- `surfaceBase`, `surfaceContainer`, `surfaceHover`, `surfaceSelected`
- `colorPrimaryDefault`, `colorPrimaryHover`
- `textDefault`, `textSecondary`, `textMuted`, `textAction`, `textOnAction`
- `borderDefault`, `borderNeutralContainer`, `borderPrimaryFocus`

**Spacing tokens:** `spacing50` through `spacing400`

**Border radius tokens:** `borderRadius75`, `borderRadius100`, `borderRadius150`, `borderRadiusFull`

If `brandsync_tokens.dart` is missing or incomplete, create or complete it using the
**Token Bridge** section below before writing any UI code.

## Step 2: Check project structure

Read `pubspec.yaml` and `main.dart` to confirm:
- Flutter SDK version and any relevant constraints
- Whether `flutter_riverpod` is installed (preferred state management)
- Whether `lucide_flutter` is installed (preferred icons)
- Whether `shared_preferences` is installed (required for theme persistence)
- Whether `go_router` is installed (preferred navigation)
- How `MaterialApp` is configured and whether a `ThemeData` is already wired up

## Step 3: Fetch the canonical example

```
mcp__brandsync-mcp-server__get_example  (name: "PageName")
```

Study the full HTML + CSS before writing a single line of Dart. The canonical example defines the
visual target — layout hierarchy, spacing, color usage, and interaction states. Flutter widgets
do not match HTML tag names, but the visual rhythm and token usage must match exactly.

---

# 1. Canonical Blueprint Rule

BrandSync HTML/CSS is the visual blueprint. It defines:

- Visual hierarchy
- Layout rhythm
- Spacing system
- Typography scale
- Token usage
- Interaction states

It is NOT:

- A copy-paste source
- A widget template
- A standalone HTML deliverable

Flutter's widget tree owns the structure — `ElevatedButton`, `TextField`, `ListView` do not
match HTML DOM. The obligation is visual equivalence, not structural equivalence.

---

# 2. Core Law

1. 🔴 Visual output must match the canonical BrandSync blueprint — color, spacing, radius, typography.
2. 🟡 Flutter widgets own the element tree — never fight the framework's rendering pipeline.
3. ❌ Never hardcode `Color(0xFF...)` values inline where a `BrandSyncTokens` constant exists.
4. ❌ Never use `Colors.white`, `Colors.grey`, or `Color.fromARGB(...)` where a token exists.
5. ❌ Never inline `BoxDecoration` values that should live in the token file or a reusable style.
6. ✅ Always use `BrandSyncTokens.tokenName` to reference all visual values.
7. ✅ Always define interaction states (pressed, disabled, hovered, focused) via `WidgetStateProperty`.

---

# 3. Project Setup

**Typical stack:** Flutter + Dart + `flutter_riverpod` + `lucide_flutter` + `shared_preferences` + `go_router`

```
lib/
├── main.dart                          # MaterialApp + ProviderScope entry
├── tokens/
│   └── brandsync_tokens.dart          # ← CSS token bridge (Color, double constants)
├── theme/
│   └── app_theme.dart                 # ← ThemeData built from tokens
├── widgets/
│   └── *.dart                         # Reusable themed widgets
├── pages/
│   └── my_page.dart                   # Screen widgets
└── providers/
    └── *.dart                         # Riverpod providers
```

**`pubspec.yaml` dependencies:**
```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.0.0
  lucide_flutter: ^0.3.0
  shared_preferences: ^2.0.0
  go_router: ^14.0.0
```

**`main.dart` entry:**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme/app_theme.dart';
import 'providers/theme_provider.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    return MaterialApp(
      title: 'App',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: themeMode,
      home: const MyPage(),
    );
  }
}
```

---

# 4. Token Bridge — CSS to Dart Constants

Flutter has no CSS variable support. Create `lib/tokens/brandsync_tokens.dart` to translate
BrandSync CSS custom properties to typed Dart constants.

> ⚠️ **Color values must come from `mcp__brandsync-mcp-server__get_tokens`.** Do NOT guess or
> invent hex values. Fetch tokens first, then create this file using the actual resolved values.

The `0x????????` sentinel below is **intentionally invalid Dart** — the compiler will reject the
file until every placeholder is replaced with a real 8-digit ARGB hex literal (e.g. `0xFFFFFFFF`).
This ensures no unfilled token silently produces wrong colors.

**Format:** `0xFF` + 6-digit RGB hex — e.g. `0xFFFFFFFF` = white, `0xFF0062C1` = brand blue.

## Key-to-CSS mapping

| Dart Constant                 | CSS Custom Property                |
|-------------------------------|------------------------------------|
| `surfaceBase`                 | `--surface-base`                   |
| `surfaceContainer`            | `--surface-container`              |
| `surfaceHover`                | `--surface-hover`                  |
| `surfaceSelected`             | `--surface-selected`               |
| `textDefault`                 | `--text-default`                   |
| `textSecondary`               | `--text-secondary`                 |
| `textMuted`                   | `--text-muted`                     |
| `textAction`                  | `--text-action`                    |
| `textOnAction`                | `--text-on-action`                 |
| `textNeutralDefault`          | `--text-neutral-default`           |
| `colorPrimaryDefault`         | `--color-primary-default`          |
| `colorPrimaryHover`           | `--color-primary-hover`            |
| `colorNeutralContainer`       | `--color-neutral-container`        |
| `colorNeutralContainerHover`  | `--color-neutral-container-hover`  |
| `borderDefault`               | `--border-default`                 |
| `borderNeutralContainer`      | `--border-neutral-container`       |
| `borderPrimaryFocus`          | `--border-primary-focus`           |

## Create `lib/tokens/brandsync_tokens.dart`

```dart
// lib/tokens/brandsync_tokens.dart
// ⚠️ Replace every 0x???????? with a real ARGB hex value from mcp__brandsync-mcp-server__get_tokens
// Any unreplaced placeholder will cause a Dart compile error — this is intentional.
import 'package:flutter/material.dart';

class BrandSyncTokens {
  BrandSyncTokens._();

  // SURFACES — replace with MCP values
  static const Color surfaceBase      = Color(0x????????); // --surface-base
  static const Color surfaceContainer = Color(0x????????); // --surface-container
  static const Color surfaceHover     = Color(0x????????); // --surface-hover
  static const Color surfaceSelected  = Color(0x????????); // --surface-selected

  // TEXT — replace with MCP values
  static const Color textDefault        = Color(0x????????); // --text-default
  static const Color textSecondary      = Color(0x????????); // --text-secondary
  static const Color textMuted          = Color(0x????????); // --text-muted
  static const Color textAction         = Color(0x????????); // --text-action
  static const Color textOnAction       = Color(0x????????); // --text-on-action
  static const Color textNeutralDefault = Color(0x????????); // --text-neutral-default

  // PRIMARY ACTIONS — replace with MCP values
  static const Color colorPrimaryDefault = Color(0x????????); // --color-primary-default
  static const Color colorPrimaryHover   = Color(0x????????); // --color-primary-hover

  // NEUTRAL ACTIONS — replace with MCP values
  static const Color colorNeutralContainer      = Color(0x????????); // --color-neutral-container
  static const Color colorNeutralContainerHover = Color(0x????????); // --color-neutral-container-hover

  // BORDERS — replace with MCP values
  static const Color borderDefault          = Color(0x????????); // --border-default
  static const Color borderNeutralContainer = Color(0x????????); // --border-neutral-container
  static const Color borderPrimaryFocus     = Color(0x????????); // --border-primary-focus

  // SPACING — fixed pixel constants, do not change
  static const double spacing50  = 4.0;
  static const double spacing100 = 8.0;
  static const double spacing150 = 12.0;
  static const double spacing200 = 16.0;
  static const double spacing250 = 20.0;
  static const double spacing300 = 24.0;
  static const double spacing400 = 32.0;

  // BORDER RADIUS — fixed constants
  static const double borderRadius75   = 6.0;
  static const double borderRadius100  = 8.0;
  static const double borderRadius150  = 12.0;
  static const double borderRadiusFull = 120.0;

  // BORDER WIDTH — fixed constants
  static const double borderWidthThin   = 1.0;
  static const double borderWidthMedium = 2.0;
}
```

**When to update this file:** If the MCP canonical tokens change, update `brandsync_tokens.dart`
first, then rebuild and verify all pages that reference the changed tokens.

---

# 5. ThemeData Configuration

Build `ThemeData` from token constants in `lib/theme/app_theme.dart`. Never configure `ThemeData`
inline in `main.dart` or inside widget `build()` methods.

```dart
// lib/theme/app_theme.dart
import 'package:flutter/material.dart';
import '../tokens/brandsync_tokens.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get light => _build(Brightness.light);
  static ThemeData get dark  => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return ThemeData(
      brightness: brightness,
      scaffoldBackgroundColor: isDark
          ? BrandSyncTokens.surfaceContainerDark   // add Dark variants when MCP provides them
          : BrandSyncTokens.surfaceContainer,
      colorScheme: ColorScheme(
        brightness: brightness,
        primary:     BrandSyncTokens.colorPrimaryDefault,
        onPrimary:   BrandSyncTokens.textOnAction,
        secondary:   BrandSyncTokens.colorNeutralContainer,
        onSecondary: BrandSyncTokens.textNeutralDefault,
        surface:     isDark ? BrandSyncTokens.surfaceBaseDark : BrandSyncTokens.surfaceBase,
        onSurface:   isDark ? BrandSyncTokens.textDefaultDark : BrandSyncTokens.textDefault,
        error:       const Color(0xFFD32F2F),
        onError:     Colors.white,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.disabled)) {
              return BrandSyncTokens.colorPrimaryDefault.withValues(alpha: 0.4);
            }
            if (states.contains(WidgetState.pressed) ||
                states.contains(WidgetState.hovered)) {
              return BrandSyncTokens.colorPrimaryHover;
            }
            return BrandSyncTokens.colorPrimaryDefault;
          }),
          foregroundColor: const WidgetStatePropertyAll(BrandSyncTokens.textOnAction),
          shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius100),
            ),
          ),
          padding: const WidgetStatePropertyAll(
            EdgeInsets.symmetric(
              horizontal: BrandSyncTokens.spacing250,
              vertical:   BrandSyncTokens.spacing150,
            ),
          ),
          elevation: const WidgetStatePropertyAll(0),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.pressed) ||
                states.contains(WidgetState.hovered)) {
              return BrandSyncTokens.colorNeutralContainerHover;
            }
            return BrandSyncTokens.colorNeutralContainer;
          }),
          foregroundColor: const WidgetStatePropertyAll(BrandSyncTokens.textNeutralDefault),
          side: WidgetStatePropertyAll(
            BorderSide(
              color: BrandSyncTokens.borderDefault,
              width: BrandSyncTokens.borderWidthThin,
            ),
          ),
          shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius100),
            ),
          ),
          padding: const WidgetStatePropertyAll(
            EdgeInsets.symmetric(
              horizontal: BrandSyncTokens.spacing250,
              vertical:   BrandSyncTokens.spacing150,
            ),
          ),
          elevation: const WidgetStatePropertyAll(0),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius100),
          borderSide: BorderSide(
            color: BrandSyncTokens.borderNeutralContainer,
            width: BrandSyncTokens.borderWidthThin,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius100),
          borderSide: BorderSide(
            color: BrandSyncTokens.borderPrimaryFocus,
            width: BrandSyncTokens.borderWidthMedium,
          ),
        ),
        hintStyle:    TextStyle(color: BrandSyncTokens.textMuted),
        labelStyle:   TextStyle(color: BrandSyncTokens.textSecondary),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: BrandSyncTokens.spacing200,
          vertical:   BrandSyncTokens.spacing150,
        ),
        filled:    true,
        fillColor: isDark ? BrandSyncTokens.surfaceBaseDark : BrandSyncTokens.surfaceBase,
      ),
    );
  }
}
```

> **Dark color variants:** If the MCP `get_tokens` response includes a `[data-theme="dark"]` block,
> add `*Dark` variants to `BrandSyncTokens` (e.g. `surfaceBaseDark`, `textDefaultDark`). If the
> design system has no dark theme, remove `darkTheme` from `MaterialApp` and set
> `themeMode: ThemeMode.light`.

---

# 6. State Management — Riverpod

Use `flutter_riverpod` with `ConsumerWidget` / `ConsumerStatefulWidget`. Never manage complex
UI state with plain `StatefulWidget`.

```dart
// Simple boolean state
final isLoadingProvider = StateProvider<bool>((ref) => false);

// List state with mutations
final itemsProvider = StateNotifierProvider<ItemsNotifier, List<MyItem>>(
  (ref) => ItemsNotifier(),
);

class ItemsNotifier extends StateNotifier<List<MyItem>> {
  ItemsNotifier() : super([]);
  void add(MyItem item) => state = [...state, item];
  void remove(String id) => state = state.where((i) => i.id != id).toList();
}

// Async data
final dataProvider = FutureProvider<List<MyItem>>((ref) async {
  return []; // fetch from API
});
```

**`ConsumerWidget` (read-only state):**
```dart
class MyPage extends ConsumerWidget {
  const MyPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(itemsProvider);
    return Scaffold(
      body: ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) => ItemTile(item: items[index]),
      ),
    );
  }
}
```

**`ConsumerStatefulWidget` (local + Riverpod state):**
```dart
class MyForm extends ConsumerStatefulWidget {
  const MyForm({super.key});

  @override
  ConsumerState<MyForm> createState() => _MyFormState();
}

class _MyFormState extends ConsumerState<MyForm> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose(); // always dispose controllers
    super.dispose();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isLoading = ref.watch(isLoadingProvider);
    return TextField(controller: _controller);
  }
}
```

**Use plain `StatefulWidget` only for:** local animation controllers, focus nodes, or state
that is genuinely isolated to a single leaf widget.

---

# 7. Layout Patterns

Reproduce the visual layout from the canonical example. Use Flutter layout widgets that best
match the canonical structure.

## Page Wrapper
```dart
Scaffold(
  backgroundColor: BrandSyncTokens.surfaceContainer,
  body: SafeArea(
    child: SingleChildScrollView(
      padding: const EdgeInsets.all(BrandSyncTokens.spacing300),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [/* content */],
      ),
    ),
  ),
)
```

## Card
```dart
Container(
  decoration: BoxDecoration(
    color: BrandSyncTokens.surfaceBase,
    border: Border.all(
      color: BrandSyncTokens.borderDefault,
      width: BrandSyncTokens.borderWidthThin,
    ),
    borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius150),
  ),
  padding: const EdgeInsets.all(BrandSyncTokens.spacing300),
  child: /* content */,
)
```

## Two-Column (Sidebar + Content)
```dart
Row(
  children: [
    SizedBox(
      width: 280,
      child: Container(
        color: BrandSyncTokens.surfaceBase,
        child: /* sidebar nav */,
      ),
    ),
    Expanded(
      child: Container(
        color: BrandSyncTokens.surfaceContainer,
        child: /* main content */,
      ),
    ),
  ],
)
```

## Card Grid
```dart
GridView.builder(
  shrinkWrap: true,
  physics: const NeverScrollableScrollPhysics(),
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 3,
    crossAxisSpacing: BrandSyncTokens.spacing200,
    mainAxisSpacing:  BrandSyncTokens.spacing200,
    childAspectRatio: 1.5,
  ),
  itemCount: items.length,
  itemBuilder: (context, index) => /* card widget */,
)
```

## Form Layout
```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text(
      'Full Name',
      style: TextStyle(color: BrandSyncTokens.textSecondary, fontSize: 13),
    ),
    const SizedBox(height: BrandSyncTokens.spacing100),
    const TextField(decoration: InputDecoration(hintText: 'Enter name')),
    const SizedBox(height: BrandSyncTokens.spacing300),
    Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        OutlinedButton(onPressed: onCancel, child: const Text('Cancel')),
        const SizedBox(width: BrandSyncTokens.spacing150),
        ElevatedButton(onPressed: onSave, child: const Text('Save')),
      ],
    ),
  ],
)
```

## Inline Row (label + action on same line)
```dart
Row(
  children: [
    Expanded(
      child: Text(
        'Section Title',
        style: TextStyle(
          color: BrandSyncTokens.textDefault,
          fontWeight: FontWeight.w600,
          fontSize: 16,
        ),
      ),
    ),
    ElevatedButton.icon(
      onPressed: onAdd,
      icon: const Icon(Icons.add, size: 16),
      label: const Text('Add'),
    ),
  ],
)
```

## Collapsible Section
```dart
class CollapsibleSection extends StatefulWidget {
  final String title;
  final Widget child;
  const CollapsibleSection({required this.title, required this.child, super.key});

  @override
  State<CollapsibleSection> createState() => _CollapsibleSectionState();
}

class _CollapsibleSectionState extends State<CollapsibleSection> {
  bool _expanded = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: () => setState(() => _expanded = !_expanded),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: BrandSyncTokens.spacing150),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    widget.title,
                    style: TextStyle(color: BrandSyncTokens.textDefault, fontWeight: FontWeight.w600),
                  ),
                ),
                AnimatedRotation(
                  turns: _expanded ? 0.5 : 0,
                  duration: const Duration(milliseconds: 200),
                  child: Icon(Icons.keyboard_arrow_down, color: BrandSyncTokens.textSecondary),
                ),
              ],
            ),
          ),
        ),
        if (_expanded) widget.child,
      ],
    );
  }
}
```

---

# 8. List / Table Pattern

Use `ListView.builder` for scrollable lists. For tabular data, build a column-grid structure
with a header row.

```dart
class BrandSyncTable extends StatelessWidget {
  final List<String> columns;
  final List<List<Widget>> rows;
  const BrandSyncTable({required this.columns, required this.rows, super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(
          color: BrandSyncTokens.borderDefault,
          width: BrandSyncTokens.borderWidthThin,
        ),
        borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius150),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // Header row
          Container(
            color: BrandSyncTokens.surfaceContainer,
            padding: const EdgeInsets.symmetric(
              horizontal: BrandSyncTokens.spacing200,
              vertical:   BrandSyncTokens.spacing150,
            ),
            child: Row(
              children: columns
                  .map((col) => Expanded(
                        child: Text(
                          col,
                          style: TextStyle(
                            color: BrandSyncTokens.textSecondary,
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                          ),
                        ),
                      ))
                  .toList(),
            ),
          ),
          // Data rows
          ...rows.map(
            (row) => Container(
              decoration: BoxDecoration(
                color: BrandSyncTokens.surfaceBase,
                border: Border(
                  top: BorderSide(
                    color: BrandSyncTokens.borderDefault,
                    width: BrandSyncTokens.borderWidthThin,
                  ),
                ),
              ),
              padding: const EdgeInsets.symmetric(
                horizontal: BrandSyncTokens.spacing200,
                vertical:   BrandSyncTokens.spacing150,
              ),
              child: Row(
                children: row.map((cell) => Expanded(child: cell)).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

## Status Badge
```dart
Container(
  padding: const EdgeInsets.symmetric(
    horizontal: BrandSyncTokens.spacing100,
    vertical: 2,
  ),
  decoration: BoxDecoration(
    color: _badgeColor(status),
    borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadiusFull),
  ),
  child: Text(
    status,
    style: const TextStyle(fontSize: 12),
  ),
)
```

---

# 9. Modal / Dialog Pattern

Use Flutter's `showDialog` with a custom `Dialog` widget. Always set explicit `shape` and
`backgroundColor` — never rely on `ThemeData` defaults for modal appearance.

```dart
// Trigger
void openModal(BuildContext context) {
  showDialog(
    context: context,
    barrierDismissible: true,
    builder: (context) => const MyModal(),
  );
}

// Modal widget
class MyModal extends StatelessWidget {
  const MyModal({super.key});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: BrandSyncTokens.surfaceBase,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(BrandSyncTokens.borderRadius150),
        side: BorderSide(
          color: BrandSyncTokens.borderDefault,
          width: BrandSyncTokens.borderWidthThin,
        ),
      ),
      child: SizedBox(
        width: 480,
        child: Padding(
          padding: const EdgeInsets.all(BrandSyncTokens.spacing300),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Title',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: BrandSyncTokens.textDefault,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const SizedBox(height: BrandSyncTokens.spacing200),
              // Body
              Text('Content', style: TextStyle(color: BrandSyncTokens.textSecondary)),
              const SizedBox(height: BrandSyncTokens.spacing300),
              // Footer
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Cancel'),
                  ),
                  const SizedBox(width: BrandSyncTokens.spacing150),
                  ElevatedButton(
                    onPressed: () { Navigator.of(context).pop(); },
                    child: const Text('Save'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

# 10. Icon Protocol

## Option A: `lucide_flutter` (Recommended for BrandSync consistency)

```dart
import 'package:lucide_flutter/lucide_flutter.dart';

Icon(LucideIcons.search, size: 20, color: BrandSyncTokens.textSecondary)
Icon(LucideIcons.bell,   size: 20, color: BrandSyncTokens.textDefault)
Icon(LucideIcons.plus,   size: 16, color: BrandSyncTokens.textOnAction)
```

## Option B: Material Icons (Built-in, zero setup)

```dart
Icon(Icons.search,                   size: 20, color: BrandSyncTokens.textSecondary)
Icon(Icons.notifications_outlined,   size: 20)
Icon(Icons.add,                      size: 16)
```

Pick one option per project and apply consistently. Do not mix `LucideIcons` and `Icons.*`
within the same component.

**DO NOT use external CDN icon sources** — Flutter apps are offline-capable. Bundle all icons.

---

# 11. Dark Mode

Flutter handles dark mode via `ThemeData` + `ThemeMode`. There is no `data-theme` CSS attribute.
BrandSync tokens must have light and dark variants declared in `BrandSyncTokens` (see §4).

## Theme mode provider

```dart
// lib/providers/theme_provider.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final themeModeProvider = StateNotifierProvider<ThemeModeNotifier, ThemeMode>(
  (ref) => ThemeModeNotifier(),
);

class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  ThemeModeNotifier() : super(ThemeMode.light) {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('theme');
    if (saved == 'dark')  state = ThemeMode.dark;
    if (saved == 'light') state = ThemeMode.light;
  }

  Future<void> toggle() async {
    final next = state == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    state = next;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('theme', next == ThemeMode.dark ? 'dark' : 'light');
  }
}
```

## Toggle in a widget

```dart
ref.read(themeModeProvider.notifier).toggle();
```

## Dark token variants

Add `*Dark` variants to `BrandSyncTokens` **only if** MCP `get_tokens` returns a
`[data-theme="dark"]` CSS block. If BrandSync has no dark theme, do not invent values —
remove `darkTheme` from `MaterialApp` and keep `themeMode: ThemeMode.light`.

```dart
// Add to BrandSyncTokens when dark tokens are available from MCP:
static const Color surfaceBaseDark       = Color(0x????????); // dark --surface-base
static const Color surfaceContainerDark  = Color(0x????????); // dark --surface-container
static const Color textDefaultDark       = Color(0x????????); // dark --text-default
static const Color textSecondaryDark     = Color(0x????????); // dark --text-secondary
// ... continue for all tokens with dark variants in MCP
```

Never rebuild `ThemeData` at runtime. Switching `ThemeModeNotifier.state` is sufficient —
Flutter rebuilds the widget tree automatically.

---

# 12. BrandSync Token Reference

Always reference `BrandSyncTokens.tokenName`. Never hardcode values.

```dart
// Surfaces
BrandSyncTokens.surfaceBase          // white — card, sidebar backgrounds
BrandSyncTokens.surfaceContainer     // light grey — page background
BrandSyncTokens.surfaceHover         // hover state background
BrandSyncTokens.surfaceSelected      // active/selected state

// Text
BrandSyncTokens.textDefault          // primary text
BrandSyncTokens.textSecondary        // secondary/muted text
BrandSyncTokens.textMuted            // placeholder, hint text
BrandSyncTokens.textAction           // active tab, link color
BrandSyncTokens.textOnAction         // text on primary buttons

// Primary Actions
BrandSyncTokens.colorPrimaryDefault  // primary button background
BrandSyncTokens.colorPrimaryHover    // primary button hover

// Neutral Actions
BrandSyncTokens.colorNeutralContainer       // secondary button bg
BrandSyncTokens.colorNeutralContainerHover  // secondary button hover
BrandSyncTokens.textNeutralDefault          // secondary button text

// Borders
BrandSyncTokens.borderDefault           // standard borders
BrandSyncTokens.borderNeutralContainer  // input borders
BrandSyncTokens.borderPrimaryFocus      // focus ring color

// Spacing (pass to EdgeInsets, SizedBox, gap)
BrandSyncTokens.spacing50    // 4.0
BrandSyncTokens.spacing100   // 8.0
BrandSyncTokens.spacing150   // 12.0
BrandSyncTokens.spacing200   // 16.0
BrandSyncTokens.spacing250   // 20.0
BrandSyncTokens.spacing300   // 24.0 — standard section padding
BrandSyncTokens.spacing400   // 32.0

// Border Radius (pass to BorderRadius.circular())
BrandSyncTokens.borderRadius75    // 6.0  — small elements, badges
BrandSyncTokens.borderRadius100   // 8.0  — buttons, inputs
BrandSyncTokens.borderRadius150   // 12.0 — cards, modals
BrandSyncTokens.borderRadiusFull  // 120.0 — pills, avatars

// Border Width
BrandSyncTokens.borderWidthThin    // 1.0
BrandSyncTokens.borderWidthMedium  // 2.0 — focus rings
```

---

# 13. Validation Checklist

Before delivery:

- [ ] `brandsync_tokens.dart` verified against MCP canonical — all Color, spacing, and radius tokens present
- [ ] No `0x????????` placeholders remain — compiler will reject any unfilled token
- [ ] `AppTheme.light` (and `AppTheme.dark` if dark tokens exist in MCP) built from token constants only
- [ ] `ProviderScope` wraps `MaterialApp` in `main.dart`
- [ ] `MaterialApp.theme`, `darkTheme`, and `themeMode` all wired up correctly
- [ ] All primary actions use `ElevatedButton` with `WidgetStateProperty` for hover/press/disabled states
- [ ] All secondary actions use `OutlinedButton` with `WidgetStateProperty` for hover/press/disabled states
- [ ] All inputs use `TextField` / `TextFormField` with `InputDecoration` driven by `ThemeData`
- [ ] All scrollable lists use `ListView.builder` — no unbounded `Column` with `ListView` nesting
- [ ] All dialogs use `showDialog` + custom `Dialog` widget with explicit BrandSync shape and color
- [ ] Icons sourced consistently from `lucide_flutter` OR `Icons.*` — not mixed within a component
- [ ] `dispose()` called for all `TextEditingController`, `FocusNode`, and `AnimationController`
- [ ] Theme persistence implemented via `SharedPreferences` in `ThemeModeNotifier`
- [ ] Dark mode: `*Dark` token variants present only if MCP provides dark theme values
- [ ] No `Colors.white`, `Colors.grey`, or raw `Color(0xFF...)` inline — all colors via `BrandSyncTokens.*`
- [ ] No business logic in widget `build()` methods — delegate to Riverpod providers
- [ ] Visual output matches canonical blueprint — color, spacing, radius, typography

---

Version: 1.0
Stack: Flutter + Dart + flutter_riverpod + lucide_flutter + shared_preferences
Mode: Token-Driven Widgets (BrandSync token bridge via Dart constants)
Authority: BrandSync Design System (canonical HTML/CSS visual target)
Violation Policy: Fail Hard on hardcoded values; Accept Flutter widget tree, enforce visual match
