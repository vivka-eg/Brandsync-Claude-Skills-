---
name: dotnet-maui
description: Maps canonical BrandSync UI to .NET MAUI XAML pages using ResourceDictionary token bridging. Visual fidelity via XAML styles and BrandSync color/spacing tokens.
version: 1.2
execution_mode: adaptive
error_policy: fail-with-alternatives
component_strategy: xaml-resource-driven
ui_philosophy: reproduce-canonical-visual-output-via-xaml-styles
---

# .NET MAUI BrandSync Adapter

Reproduce canonical BrandSync visual output using .NET MAUI XAML pages and controls.
BrandSync defines the visual target; MAUI XAML defines the structure. Bridge the gap using a
`BrandSyncTokens.xaml` ResourceDictionary that maps CSS custom properties to typed XAML resources.

| Aspect        | MAUI Approach                                                          |
|---------------|------------------------------------------------------------------------|
| DOM Structure | XAML element tree — reproduce hierarchy, not HTML tag names            |å
| Styling       | XAML `Style` in `ResourceDictionary` + inline setters                 |
| Tokens        | CSS vars → typed Color/Thickness/CornerRadius XAML resources           |
| Icons         | Font icons via Material Design Icons font or embedded SVG via MauiImage |
| Philosophy    | "Make MAUI controls look like BrandSync via XAML resource bridging"    |

---

# 0. Pre-Flight — Do This BEFORE Writing Any Code

## Step 1: Verify the tokens file

Always fetch the canonical tokens from the MCP server:

```
mcp__brandsync-mcp-server__get_tokens
```

MAUI does not support CSS custom properties natively. Tokens must be translated to typed XAML
resources in `Resources/Styles/BrandSyncTokens.xaml`. Check that this file exists and contains:

**Color tokens (spot-check):**
- `SurfaceBase`, `SurfaceContainer`, `SurfaceHover`, `SurfaceSelected`
- `ColorPrimaryDefault`, `ColorPrimaryHover`
- `TextDefault`, `TextSecondary`, `TextMuted`, `TextAction`, `TextOnAction`
- `BorderDefault`, `BorderNeutralContainer`, `BorderPrimaryFocus`

**Spacing tokens (Thickness resources):**
- `Spacing50` through `Spacing400`

**CornerRadius tokens:**
- `BorderRadius75`, `BorderRadius100`, `BorderRadius150`, `BorderRadiusFull`

If `BrandSyncTokens.xaml` is missing or incomplete, create or complete it using the
**Token Bridge** section below before writing any UI code.

## Step 2: Check project structure

Read `MauiProgram.cs`, `App.xaml`, and the `.csproj` file to confirm:
- .NET MAUI version and target frameworks (affects available APIs)
- Whether CommunityToolkit.Maui is installed (provides additional controls)
- Whether CommunityToolkit.Mvvm is installed (preferred MVVM toolkit)
- How `App.xaml` loads ResourceDictionaries (look for `<ResourceDictionary.MergedDictionaries>`)
- Any existing global Styles already applied

`BrandSyncTokens.xaml` must be merged in `App.xaml` before any page references it:
```xml
<!-- App.xaml -->
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Resources/Styles/BrandSyncTokens.xaml" />
            <ResourceDictionary Source="Resources/Styles/Styles.xaml" />
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

## Step 3: Fetch the canonical example

```
mcp__brandsync-mcp-server__get_example  (name: "PageName")
```

Study the full HTML + CSS before writing a single XAML line. The canonical example defines the
visual target — layout hierarchy, spacing, color usage, and interaction states. MAUI controls
may not match HTML tag names, but the visual rhythm and token usage must match exactly.

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
- A XAML template
- A standalone HTML deliverable

MAUI controls own the element tree — `<Button>`, `<Entry>`, `<CollectionView>` do not
match HTML DOM. The obligation is visual equivalence, not structural equivalence.

---

# 2. Core Law

1. 🔴 Visual output must match the canonical BrandSync blueprint — color, spacing, radius, typography.
2. 🟡 MAUI controls own the DOM — never fight the framework's element tree.
3. ❌ Never hardcode hex colors, pixel values, or corner radii that have a BrandSync token equivalent.
4. ❌ Never use `Colors.White`, `Colors.Gray`, or raw `Color.FromArgb(...)` where a token exists.
5. ❌ Never define Styles inline in a page when they should be in `BrandSyncTokens.xaml` or `Styles.xaml`.
6. ✅ Always use `{StaticResource TokenName}` to reference BrandSync tokens.
7. ✅ Always define visual states (hover, pressed, disabled, focused) via `VisualStateManager`.

---

# 3. Project Setup

**Typical stack:** .NET 8+ / .NET 9 + MAUI + CommunityToolkit.Mvvm + (optionally) CommunityToolkit.Maui

```
MauiApp/
├── App.xaml                        # Merges all ResourceDictionaries
├── App.xaml.cs
├── AppShell.xaml                   # Navigation shell
├── MauiProgram.cs                  # Builder configuration
├── Resources/
│   ├── Styles/
│   │   ├── BrandSyncTokens.xaml   # ← CSS token bridge (Color, Thickness, CornerRadius)
│   │   └── Styles.xaml            # ← Reusable XAML Styles referencing tokens
│   └── Fonts/
│       └── MaterialDesignIcons.ttf # ← Icon font (if used)
├── Views/
│   └── MyPage.xaml                # ContentPage XAML
│   └── MyPage.xaml.cs             # Code-behind (minimal — delegate to ViewModel)
└── ViewModels/
    └── MyPageViewModel.cs         # MVVM logic
```

**Required NuGet packages:**
```xml
<!-- .csproj -->
<PackageReference Include="CommunityToolkit.Mvvm" Version="8.*" />
<PackageReference Include="CommunityToolkit.Maui" Version="*" />
```

Register CommunityToolkit.Maui in `MauiProgram.cs`:
```csharp
builder
    .UseMauiApp<App>()
    .UseMauiCommunityToolkit();
```

---

# 4. Token Bridge — CSS to XAML ResourceDictionary

MAUI has no CSS variable support. Create `Resources/Styles/BrandSyncTokens.xaml` to translate
BrandSync CSS custom properties to typed XAML resources.

> ⚠️ **Color values must come from `mcp__brandsync-mcp-server__get_tokens`.** Do NOT guess or
> invent hex values. Fetch tokens first, then create this file using the actual resolved values.

## Step 1 — Key-to-CSS mapping

Use this table to know which CSS variable each XAML key maps to:

| XAML Key                      | CSS Custom Property                    |
|-------------------------------|----------------------------------------|
| `SurfaceBase`                 | `--surface-base`                       |
| `SurfaceContainer`            | `--surface-container`                  |
| `SurfaceHover`                | `--surface-hover`                      |
| `SurfaceSelected`             | `--surface-selected`                   |
| `TextDefault`                 | `--text-default`                       |
| `TextSecondary`               | `--text-secondary`                     |
| `TextMuted`                   | `--text-muted`                         |
| `TextAction`                  | `--text-action`                        |
| `TextOnAction`                | `--text-on-action`                     |
| `TextNeutralDefault`          | `--text-neutral-default`               |
| `ColorPrimaryDefault`         | `--color-primary-default`              |
| `ColorPrimaryHover`           | `--color-primary-hover`                |
| `ColorNeutralContainer`       | `--color-neutral-container`            |
| `ColorNeutralContainerHover`  | `--color-neutral-container-hover`      |
| `BorderDefault`               | `--border-default`                     |
| `BorderNeutralContainer`      | `--border-neutral-container`           |
| `BorderPrimaryFocus`          | `--border-primary-focus`               |

## Step 2 — Create `BrandSyncTokens.xaml`

Replace each `#hex` value below with the corresponding resolved hex from the MCP response.
Spacing and radius values are fixed pixel constants — do not change them.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <!-- SURFACES — replace with MCP values -->
    <Color x:Key="SurfaceBase">#hex</Color>
    <Color x:Key="SurfaceContainer">#hex</Color>
    <Color x:Key="SurfaceHover">#hex</Color>
    <Color x:Key="SurfaceSelected">#hex</Color>

    <!-- TEXT — replace with MCP values -->
    <Color x:Key="TextDefault">#hex</Color>
    <Color x:Key="TextSecondary">#hex</Color>
    <Color x:Key="TextMuted">#hex</Color>
    <Color x:Key="TextAction">#hex</Color>
    <Color x:Key="TextOnAction">#hex</Color>
    <Color x:Key="TextNeutralDefault">#hex</Color>

    <!-- PRIMARY ACTIONS — replace with MCP values -->
    <Color x:Key="ColorPrimaryDefault">#hex</Color>
    <Color x:Key="ColorPrimaryHover">#hex</Color>

    <!-- NEUTRAL ACTIONS — replace with MCP values -->
    <Color x:Key="ColorNeutralContainer">#hex</Color>
    <Color x:Key="ColorNeutralContainerHover">#hex</Color>

    <!-- BORDERS — replace with MCP values -->
    <Color x:Key="BorderDefault">#hex</Color>
    <Color x:Key="BorderNeutralContainer">#hex</Color>
    <Color x:Key="BorderPrimaryFocus">#hex</Color>

    <!-- SPACING — fixed pixel constants, do not change -->
    <Thickness x:Key="Spacing50">4</Thickness>
    <Thickness x:Key="Spacing100">8</Thickness>
    <Thickness x:Key="Spacing150">12</Thickness>
    <Thickness x:Key="Spacing200">16</Thickness>
    <Thickness x:Key="Spacing250">20</Thickness>
    <Thickness x:Key="Spacing300">24</Thickness>
    <Thickness x:Key="Spacing400">32</Thickness>

    <!-- BORDER RADIUS — fixed constants; Button.CornerRadius=int, RoundRectangle.CornerRadius=struct;
         both accept x:Double via XAML type converters -->
    <x:Double x:Key="BorderRadius75">6</x:Double>
    <x:Double x:Key="BorderRadius100">8</x:Double>
    <x:Double x:Key="BorderRadius150">12</x:Double>
    <x:Double x:Key="BorderRadiusFull">120</x:Double>

    <!-- BORDER WIDTH — fixed constants -->
    <x:Double x:Key="BorderWidthThin">1</x:Double>
    <x:Double x:Key="BorderWidthMedium">2</x:Double>

</ResourceDictionary>
```

`#hex` is not a valid MAUI color value — the XAML parser will throw if any `#hex` placeholder
remains. This is intentional: it makes unfilled tokens fail loudly rather than silently.

**When to update this file:** If the MCP canonical tokens change, update `BrandSyncTokens.xaml`
first, then re-check all pages that reference the changed tokens.

---

# 5. XAML Page Pattern

Every ContentPage follows this structure:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage
    x:Class="MyApp.Views.MyPage"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:vm="clr-namespace:MyApp.ViewModels"
    Title="Page Title"
    BackgroundColor="{StaticResource SurfaceContainer}">

    <ContentPage.BindingContext>
        <vm:MyPageViewModel />
    </ContentPage.BindingContext>

    <ScrollView>
        <VerticalStackLayout Padding="{StaticResource Spacing300}" Spacing="0">

            <!-- Page header -->
            <Grid ColumnDefinitions="*,Auto" Margin="0,0,0,24">
                <Label Text="Page Title"
                       FontSize="22"
                       FontAttributes="Bold"
                       TextColor="{StaticResource TextDefault}" />
                <Button Grid.Column="1"
                        Text="Add Item"
                        Style="{StaticResource PrimaryButton}" />
            </Grid>

            <!-- Content -->
            <Border Style="{StaticResource Card}">
                <!-- card content -->
            </Border>

        </VerticalStackLayout>
    </ScrollView>
</ContentPage>
```

Code-behind is minimal — only wire the ViewModel and handle lifecycle:
```csharp
public partial class MyPage : ContentPage
{
    public MyPage(MyPageViewModel vm)
    {
        InitializeComponent();
        BindingContext = vm;
    }
}
```

Prefer constructor injection over inline `<ContentPage.BindingContext>` when DI is configured.

---

# 6. MVVM Pattern — CommunityToolkit.Mvvm

Always use `CommunityToolkit.Mvvm` source generators. Never implement `INotifyPropertyChanged` manually.

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace MyApp.ViewModels;

[ObservableObject]
public partial class MyPageViewModel
{
    // Observable property — generates IsLoading property + OnIsLoadingChanged
    [ObservableProperty]
    private bool isLoading;

    // Observable property with validation
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(CanSave))]
    private string name = string.Empty;

    // Computed property
    public bool CanSave => !string.IsNullOrWhiteSpace(Name);

    // Observable collection for lists
    public ObservableCollection<MyItem> Items { get; } = new();

    // Command — generates LoadDataCommand
    [RelayCommand]
    private async Task LoadDataAsync()
    {
        IsLoading = true;
        try
        {
            // fetch data
        }
        finally
        {
            IsLoading = false;
        }
    }

    // Command with parameter
    [RelayCommand]
    private void SelectItem(MyItem item)
    {
        // handle selection
    }
}
```

**XAML binding:**
```xml
<!-- Binding to property -->
<ActivityIndicator IsRunning="{Binding IsLoading}" IsVisible="{Binding IsLoading}" />

<!-- Binding to command -->
<Button Command="{Binding LoadDataCommand}" Text="Load" />

<!-- Binding with parameter -->
<Button Command="{Binding SelectItemCommand}" CommandParameter="{Binding .}" />

<!-- Two-way binding for inputs -->
<Entry Text="{Binding Name, Mode=TwoWay}" />
```

---

# 7. Layout Patterns

Reproduce the visual layout from the canonical example. Use the MAUI layout control that best
matches the canonical structure.

## Page Wrapper
```xml
<ContentPage BackgroundColor="{StaticResource SurfaceContainer}">
    <ScrollView>
        <VerticalStackLayout Padding="{StaticResource Spacing300}">
            <!-- content -->
        </VerticalStackLayout>
    </ScrollView>
</ContentPage>
```

## Card
```xml
<Border BackgroundColor="{StaticResource SurfaceBase}"
        Stroke="{StaticResource BorderDefault}"
        StrokeThickness="{StaticResource BorderWidthThin}"
        Padding="{StaticResource Spacing300}">
    <Border.StrokeShape>
        <RoundRectangle CornerRadius="{StaticResource BorderRadius150}" />
    </Border.StrokeShape>
    <!-- card content -->
</Border>
```

Define as a named Style in `Styles.xaml`:
```xml
<Style x:Key="Card" TargetType="Border">
    <Setter Property="BackgroundColor" Value="{StaticResource SurfaceBase}" />
    <Setter Property="Stroke" Value="{StaticResource BorderDefault}" />
    <Setter Property="StrokeThickness" Value="{StaticResource BorderWidthThin}" />
    <Setter Property="Padding" Value="{StaticResource Spacing300}" />
    <Setter Property="StrokeShape">
        <Setter.Value>
            <RoundRectangle CornerRadius="{StaticResource BorderRadius150}" />
        </Setter.Value>
    </Setter>
</Style>
```

## Two-Column (Sidebar + Content)
MAUI is a mobile-first framework. On narrow viewports use `Shell` tabs or flyout for nav.
For desktop layouts use `Grid`:
```xml
<Grid ColumnDefinitions="280,*">
    <!-- Sidebar -->
    <Border Grid.Column="0" BackgroundColor="{StaticResource SurfaceBase}"
            Padding="{StaticResource Spacing200}">
        <!-- nav items -->
    </Border>
    <!-- Main content -->
    <ScrollView Grid.Column="1" BackgroundColor="{StaticResource SurfaceContainer}">
        <VerticalStackLayout Padding="{StaticResource Spacing300}">
            <!-- content -->
        </VerticalStackLayout>
    </ScrollView>
</Grid>
```

## Card Grid
```xml
<CollectionView ItemsSource="{Binding Items}">
    <CollectionView.ItemsLayout>
        <GridItemsLayout Orientation="Vertical" Span="2" HorizontalItemSpacing="16" VerticalItemSpacing="16" />
    </CollectionView.ItemsLayout>
    <CollectionView.ItemTemplate>
        <DataTemplate>
            <Border Style="{StaticResource Card}">
                <!-- item content -->
            </Border>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

## Form Layout
```xml
<VerticalStackLayout Spacing="16">
    <!-- Field group -->
    <VerticalStackLayout Spacing="6">
        <Label Text="Full Name" TextColor="{StaticResource TextSecondary}" FontSize="13" />
        <Border Style="{StaticResource InputContainer}">
            <Entry Placeholder="Enter name"
                   PlaceholderColor="{StaticResource TextMuted}"
                   TextColor="{StaticResource TextDefault}"
                   Text="{Binding Name, Mode=TwoWay}" />
        </Border>
    </VerticalStackLayout>

    <!-- Action row -->
    <HorizontalStackLayout Spacing="12" HorizontalOptions="End">
        <Button Text="Cancel" Style="{StaticResource SecondaryButton}" Command="{Binding CancelCommand}" />
        <Button Text="Save"   Style="{StaticResource PrimaryButton}"   Command="{Binding SaveCommand}" />
    </HorizontalStackLayout>
</VerticalStackLayout>
```

## Inline Row (label + action on same line)
```xml
<Grid ColumnDefinitions="*,Auto" Margin="0,0,0,16">
    <Label Text="Section Title" FontAttributes="Bold" TextColor="{StaticResource TextDefault}"
           VerticalOptions="Center" />
    <Button Grid.Column="1" Text="+ Add" Style="{StaticResource PrimaryButton}" />
</Grid>
```

---

# 8. Control Styles

Define in `Styles.xaml`, reference via `Style="{StaticResource KeyName}"`.

## Primary Button

> `Button.CornerRadius` is `int`. The `BorderRadius*` tokens are `x:Double` — XAML truncates
> silently to int (e.g. `8.0` → `8`). This is safe. `RoundRectangle.CornerRadius` uses a
> `CornerRadius` struct; its type converter also accepts a single numeric value uniformly.

```xml
<Style x:Key="PrimaryButton" TargetType="Button">
    <Setter Property="BackgroundColor"  Value="{StaticResource ColorPrimaryDefault}" />
    <Setter Property="TextColor"        Value="{StaticResource TextOnAction}" />
    <Setter Property="CornerRadius"     Value="{StaticResource BorderRadius100}" />
    <Setter Property="Padding"          Value="16,10" />
    <Setter Property="FontSize"         Value="14" />
    <Setter Property="FontAttributes"   Value="Bold" />
    <Setter Property="VisualStateManager.VisualStateGroups">
        <VisualStateGroupList>
            <VisualStateGroup Name="CommonStates">
                <VisualState Name="Normal" />
                <VisualState Name="Pressed">
                    <VisualState.Setters>
                        <Setter Property="BackgroundColor" Value="{StaticResource ColorPrimaryHover}" />
                    </VisualState.Setters>
                </VisualState>
                <VisualState Name="Disabled">
                    <VisualState.Setters>
                        <Setter Property="Opacity" Value="0.4" />
                    </VisualState.Setters>
                </VisualState>
            </VisualStateGroup>
        </VisualStateGroupList>
    </Setter>
</Style>
```

## Secondary Button
```xml
<Style x:Key="SecondaryButton" TargetType="Button">
    <Setter Property="BackgroundColor"  Value="{StaticResource ColorNeutralContainer}" />
    <Setter Property="TextColor"        Value="{StaticResource TextNeutralDefault}" />
    <Setter Property="CornerRadius"     Value="{StaticResource BorderRadius100}" />
    <Setter Property="Padding"          Value="16,10" />
    <Setter Property="FontSize"         Value="14" />
    <Setter Property="VisualStateManager.VisualStateGroups">
        <VisualStateGroupList>
            <VisualStateGroup Name="CommonStates">
                <VisualState Name="Normal" />
                <VisualState Name="Pressed">
                    <VisualState.Setters>
                        <Setter Property="BackgroundColor" Value="{StaticResource ColorNeutralContainerHover}" />
                    </VisualState.Setters>
                </VisualState>
                <VisualState Name="Disabled">
                    <VisualState.Setters>
                        <Setter Property="Opacity" Value="0.4" />
                    </VisualState.Setters>
                </VisualState>
            </VisualStateGroup>
        </VisualStateGroupList>
    </Setter>
</Style>
```

## Input Container (wraps Entry/Picker)
```xml
<Style x:Key="InputContainer" TargetType="Border">
    <Setter Property="BackgroundColor"  Value="{StaticResource SurfaceBase}" />
    <Setter Property="Stroke"           Value="{StaticResource BorderNeutralContainer}" />
    <Setter Property="StrokeThickness"  Value="{StaticResource BorderWidthThin}" />
    <Setter Property="Padding"          Value="12,10" />
    <Setter Property="StrokeShape">
        <Setter.Value>
            <RoundRectangle CornerRadius="{StaticResource BorderRadius100}" />
        </Setter.Value>
    </Setter>
</Style>
```

**Remove Entry default platform underline/border** (Android shows a bottom underline by default).
Do this once globally in `MauiProgram.cs`, not per-Entry in XAML:

```csharp
// MauiProgram.cs — call inside CreateMauiApp(), after .UseMauiApp<App>()
Microsoft.Maui.Handlers.EntryHandler.Mapper.AppendToMapping("BrandSyncBorderlessEntry", (handler, view) =>
{
#if ANDROID
    handler.PlatformView.BackgroundTintList =
        Android.Content.Res.ColorStateList.ValueOf(Android.Graphics.Color.Transparent);
#elif IOS || MACCATALYST
    handler.PlatformView.BorderStyle = UIKit.UITextBorderStyle.None;
#endif
});
```

Then the XAML Entry needs only `BackgroundColor="Transparent"` — no `<Entry.Handlers>` needed:
```xml
<Entry BackgroundColor="Transparent"
       TextColor="{StaticResource TextDefault}"
       PlaceholderColor="{StaticResource TextMuted}"
       Text="{Binding MyField, Mode=TwoWay}" />
```

## Status Badge
```xml
<Border Padding="6,2"
        BackgroundColor="{StaticResource SurfaceContainer}">
    <Border.StrokeShape>
        <RoundRectangle CornerRadius="{StaticResource BorderRadiusFull}" />
    </Border.StrokeShape>
    <Label Text="{Binding Status}" FontSize="12" TextColor="{StaticResource TextSecondary}" />
</Border>
```

---

# 9. Icon Protocol

Use Material Design Icons font for scalable icons matching the canonical BrandSync patterns.

## Setup

1. Download `MaterialDesignIcons.ttf` and place in `Resources/Fonts/`
2. Register in `MauiProgram.cs`:
```csharp
.ConfigureFonts(fonts =>
{
    fonts.AddFont("MaterialDesignIcons.ttf", "MDI");
})
```

## Usage

```xml
<!-- Icon-only -->
<Label FontFamily="MDI"
       Text="&#xF0349;"
       FontSize="20"
       TextColor="{StaticResource TextSecondary}" />

<!-- Icon inside button (ImageButton) -->
<ImageButton Source="search.svg"
             BackgroundColor="Transparent"
             WidthRequest="20"
             HeightRequest="20" />
```

**SVG alternative (preferred for custom brand icons):**
```xml
<!-- Place .svg in Resources/Images/ — MauiImage auto-converts -->
<Image Source="icon_search.svg" WidthRequest="20" HeightRequest="20" />
```

For tinted SVGs (color matching TextSecondary etc.), use `TintColor` via
CommunityToolkit.Maui `Image` extensions or apply custom renderers.

**DO NOT use external CDN icon libraries** — MAUI is offline-capable. Bundle all icons.

---

# 10. CollectionView (List / Table)

Use `CollectionView` for all scrollable item lists. Never use `ListView` for new code.

```xml
<CollectionView ItemsSource="{Binding Items}"
                SelectionMode="Single"
                SelectedItem="{Binding SelectedItem, Mode=TwoWay}">
    <CollectionView.Header>
        <!-- Optional sticky header row -->
        <Grid ColumnDefinitions="*,120,80" Padding="16,10"
              BackgroundColor="{StaticResource SurfaceContainer}">
            <Label Grid.Column="0" Text="Name"    TextColor="{StaticResource TextSecondary}" FontSize="12" />
            <Label Grid.Column="1" Text="Status"  TextColor="{StaticResource TextSecondary}" FontSize="12" />
            <Label Grid.Column="2" Text="Actions" TextColor="{StaticResource TextSecondary}" FontSize="12" />
        </Grid>
    </CollectionView.Header>

    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="local:MyItem">
            <Grid ColumnDefinitions="*,120,80" Padding="16,12"
                  BackgroundColor="{StaticResource SurfaceBase}">
                <Label Grid.Column="0" Text="{Binding Name}"   TextColor="{StaticResource TextDefault}" />
                <Label Grid.Column="1" Text="{Binding Status}" TextColor="{StaticResource TextSecondary}" />
                <Button Grid.Column="2" Text="Edit" Style="{StaticResource SecondaryButton}"
                        Command="{Binding Source={RelativeSource AncestorType={x:Type ContentPage}},
                                          Path=BindingContext.EditItemCommand}"
                        CommandParameter="{Binding .}" />
            </Grid>
        </DataTemplate>
    </CollectionView.ItemTemplate>

    <CollectionView.EmptyView>
        <Label Text="No items found." TextColor="{StaticResource TextMuted}"
               HorizontalOptions="Center" Margin="{StaticResource Spacing300}" />
    </CollectionView.EmptyView>
</CollectionView>
```

**Visual state for selected row:**
```xml
<VisualStateManager.VisualStateGroups>
    <VisualStateGroup Name="CommonStates">
        <VisualState Name="Normal" />
        <VisualState Name="Selected">
            <VisualState.Setters>
                <Setter Property="BackgroundColor" Value="{StaticResource SurfaceSelected}" />
            </VisualState.Setters>
        </VisualState>
    </VisualStateGroup>
</VisualStateManager.VisualStateGroups>
```

---

# 11. Dark Mode

MAUI does not support theme-aware `Color` resource values inside a `ResourceDictionary` —
there is no `AppThemeColor` type. `AppThemeBinding` is a **markup extension** only, used at
the property level. The correct pattern is:

1. Define separate light and dark Color tokens in `BrandSyncTokens.xaml`
2. Use `AppThemeBinding` at every property that needs to respond to theme changes

## Step 1 — Define paired tokens in `BrandSyncTokens.xaml`

First check whether the MCP `get_tokens` response includes dark theme values. BrandSync may
serve dark tokens under a `[data-theme="dark"]` block in the CSS. If it does, use those values.
If it does not, dark mode is not supported by the design system — do not invent dark colors.

Add a `Dark` variant alongside every light token using the same `#hex` sentinel convention
from §4 — the XAML parser will fail loudly on any unfilled `#hex` placeholder:

```xml
<!-- Surfaces — light values from MCP; Dark values from MCP dark theme block -->
<Color x:Key="SurfaceBase">#hex</Color>
<Color x:Key="SurfaceBaseDark">#hex</Color>
<Color x:Key="SurfaceContainer">#hex</Color>
<Color x:Key="SurfaceContainerDark">#hex</Color>
<Color x:Key="SurfaceHover">#hex</Color>
<Color x:Key="SurfaceHoverDark">#hex</Color>

<!-- Text -->
<Color x:Key="TextDefault">#hex</Color>
<Color x:Key="TextDefaultDark">#hex</Color>
<Color x:Key="TextSecondary">#hex</Color>
<Color x:Key="TextSecondaryDark">#hex</Color>
<Color x:Key="TextMuted">#hex</Color>
<Color x:Key="TextMutedDark">#hex</Color>
<Color x:Key="TextAction">#hex</Color>
<Color x:Key="TextActionDark">#hex</Color>

<!-- Primary Actions -->
<Color x:Key="ColorPrimaryDefault">#hex</Color>
<Color x:Key="ColorPrimaryDefaultDark">#hex</Color>

<!-- Continue pattern for all Color tokens that have dark variants in MCP -->
```

## Step 2 — Use `AppThemeBinding` at the property level

```xml
<ContentPage BackgroundColor="{AppThemeBinding
    Light={StaticResource SurfaceContainer},
    Dark={StaticResource SurfaceContainerDark}}">

<Label TextColor="{AppThemeBinding
    Light={StaticResource TextDefault},
    Dark={StaticResource TextDefaultDark}}" />

<Border BackgroundColor="{AppThemeBinding
    Light={StaticResource SurfaceBase},
    Dark={StaticResource SurfaceBaseDark}}" />
```

Apply `AppThemeBinding` in Styles too:
```xml
<Style x:Key="Card" TargetType="Border">
    <Setter Property="BackgroundColor">
        <Setter.Value>
            <AppThemeBinding
                Light="{StaticResource SurfaceBase}"
                Dark="{StaticResource SurfaceBaseDark}" />
        </Setter.Value>
    </Setter>
</Style>
```

## Manual theme override

```csharp
Application.Current!.UserAppTheme = AppTheme.Light;       // force light
Application.Current!.UserAppTheme = AppTheme.Dark;        // force dark
Application.Current!.UserAppTheme = AppTheme.Unspecified; // follow OS
```

Persist preference:
```csharp
Preferences.Set("app_theme", "dark");
var saved = Preferences.Get("app_theme", "light");
```

Never rebuild ResourceDictionaries dynamically — `AppThemeBinding` + `UserAppTheme` is sufficient.

---

# 12. BrandSync Token Reference

Always reference tokens via `{StaticResource TokenName}`. Never hardcode values.

```xml
<!-- Surfaces -->
BackgroundColor="{StaticResource SurfaceBase}"          <!-- white — card, sidebar -->
BackgroundColor="{StaticResource SurfaceContainer}"     <!-- light grey — page bg -->
BackgroundColor="{StaticResource SurfaceHover}"         <!-- hover state -->
BackgroundColor="{StaticResource SurfaceSelected}"      <!-- active/selected -->

<!-- Text -->
TextColor="{StaticResource TextDefault}"                <!-- primary text -->
TextColor="{StaticResource TextSecondary}"              <!-- secondary/muted -->
TextColor="{StaticResource TextMuted}"                  <!-- placeholder, hint -->
TextColor="{StaticResource TextAction}"                 <!-- active tab, link -->
TextColor="{StaticResource TextOnAction}"               <!-- text on primary button -->

<!-- Primary Actions -->
BackgroundColor="{StaticResource ColorPrimaryDefault}"  <!-- primary button bg -->
BackgroundColor="{StaticResource ColorPrimaryHover}"    <!-- primary button hover -->

<!-- Neutral Actions -->
BackgroundColor="{StaticResource ColorNeutralContainer}"         <!-- secondary button bg -->
BackgroundColor="{StaticResource ColorNeutralContainerHover}"    <!-- secondary button hover -->
TextColor="{StaticResource TextNeutralDefault}"                  <!-- secondary button text -->

<!-- Borders -->
Stroke="{StaticResource BorderDefault}"                 <!-- standard borders -->
Stroke="{StaticResource BorderNeutralContainer}"        <!-- input borders -->
Stroke="{StaticResource BorderPrimaryFocus}"            <!-- focus ring -->

<!-- Spacing (as Margin or Padding) -->
Padding="{StaticResource Spacing50}"    <!-- 4px  -->
Padding="{StaticResource Spacing100}"   <!-- 8px  -->
Padding="{StaticResource Spacing150}"   <!-- 12px -->
Padding="{StaticResource Spacing200}"   <!-- 16px -->
Padding="{StaticResource Spacing250}"   <!-- 20px -->
Padding="{StaticResource Spacing300}"   <!-- 24px -->
Padding="{StaticResource Spacing400}"   <!-- 32px -->

<!-- CornerRadius (on Border's StrokeShape / Button's CornerRadius) -->
CornerRadius="{StaticResource BorderRadius75}"          <!-- 6px  — small elements -->
CornerRadius="{StaticResource BorderRadius100}"         <!-- 8px  — buttons, inputs -->
CornerRadius="{StaticResource BorderRadius150}"         <!-- 12px — cards, modals -->
CornerRadius="{StaticResource BorderRadiusFull}"        <!-- 120px — pills, avatars -->

<!-- Border Width -->
StrokeThickness="{StaticResource BorderWidthThin}"      <!-- 1px -->
StrokeThickness="{StaticResource BorderWidthMedium}"    <!-- 2px — focus rings -->
```

---

# 13. Validation Checklist

Before delivery:

- [ ] `BrandSyncTokens.xaml` verified against MCP canonical — all Color, Spacing, and CornerRadius tokens present
- [ ] `BrandSyncTokens.xaml` merged in `App.xaml` before all other ResourceDictionaries
- [ ] CommunityToolkit.Mvvm installed and registered; `[ObservableProperty]` / `[RelayCommand]` used
- [ ] CommunityToolkit.Maui registered in `MauiProgram.cs` if any CT.Maui controls are used
- [ ] Only `{StaticResource TokenName}` used for colors, spacing, and radii — no hardcoded hex, `Colors.*`, or raw px
- [ ] All interactive controls have `VisualStateManager` entries for Pressed, Disabled (and Focused where applicable)
- [ ] `CollectionView` used for all lists — no `ListView`
- [ ] `Border` + `StrokeShape` + `RoundRectangle` used for rounded containers — no `Frame` (deprecated)
- [ ] Icons bundled locally (font or SVG) — no CDN references
- [ ] Dark mode supported via `AppThemeBinding` or `UserAppTheme` toggle with `Preferences` persistence
- [ ] Visual output matches canonical blueprint — color, spacing, radius, typography
- [ ] MVVM: no business logic in code-behind; only lifecycle and navigation wiring
- [ ] `CollectionView.EmptyView` defined for any list that can be empty

---

Version: 1.2
Stack: .NET MAUI + CommunityToolkit.Mvvm + CommunityToolkit.Maui
Mode: XAML Resource-Driven (BrandSync token bridge via ResourceDictionary)
Authority: BrandSync Design System (canonical HTML/CSS visual target)
Violation Policy: Fail Hard on hardcoded values; Accept MAUI DOM, enforce visual match
