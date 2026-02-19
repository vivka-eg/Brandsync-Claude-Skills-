---
name: react-mui-ui
description: Deterministic React + MUI execution engine that reproduces canonical BrandSync UI output using strict theme translation and sx-driven styling. Visual fidelity enforced. DOM divergence accepted.
version: 2.2
execution_mode: strict
error_policy: fail-hard
component_strategy: mui-theme-driven
styling_strategy: sx-only
ui_philosophy: mui-structure + token-authority
dom_policy: controlled-divergence
---

# React + MUI BrandSync Execution Doctrine (v2.1)

This skill reproduces canonical BrandSync UI output using React + Material UI.

Canonical HTML/CSS defines the visual blueprint.
React renders. MUI structures. BrandSync governs visual identity.

---

# 0. Pre-Flight — Do This BEFORE Writing Any Code

## Step 1: Verify the tokens file

Always fetch the canonical tokens from the MCP server and compare against the project:

```
mcp__brandsync-mcp-server__get_tokens
```

Check that `src/assets/_tokens.css` (or equivalent) contains all semantic tokens:
- `--surface-container`, `--surface-base`, `--surface-hover`
- `--color-primary-default`, `--color-primary-hover`
- `--text-action`, `--text-on-action`, `--text-secondary`
- `--spacing-25` through `--spacing-800`
- `--border-radius-50` through `--border-radius-full`
- `--border-primary-focus`, `--border-neutral-container`

If ANY are missing, replace `_tokens.css` with the full canonical version before proceeding. Undefined CSS variables fail silently and break layout/color without any error.

## Step 2: Check project structure

Look at `main.jsx` / `index.js` for:
- Where `_tokens.css` is imported
- Whether a `ThemeProvider` is already configured
- Any existing global CSS that could conflict

## Step 3: Fetch the canonical example

```
mcp__brandsync-mcp-server__get_example  (name: "PageName")
```

Study the full HTML + CSS before writing a single line of code. The canonical defines the visual target — not the DOM structure.

---

# 1. Canonical Blueprint Rule

The canonical HTML/CSS defines:

- Visual hierarchy
- Layout rhythm
- Spacing system
- Typography scale
- Token usage
- Interaction states

It is NOT:

- A copy-paste source
- The final DOM structure
- A CSS file to reuse
- Standalone HTML output

**DOM reproduction is not required. Visual fidelity is mandatory.**

---

# 2. Core Execution Law

- 🔴 Visual output must match canonical
- 🟡 MUI provides structure
- 🟢 BrandSync tokens override appearance
- ❌ No raw HTML output
- ❌ No external CSS files
- ❌ No default MUI theme
- ❌ No hardcoded values

---

# 3. Styling Doctrine

All styling must use:

- ✅ `sx` prop
- ✅ Theme `components.styleOverrides`
- ✅ CSS variables (design tokens)

Never:

- ❌ Create separate `.css` files
- ❌ Use global `.Mui-*` overrides
- ❌ Use `style={{}}` inline style prop
- ❌ Hardcode hex values
- ❌ Mix styling paradigms

Component-level styling must live inside the component.

```jsx
<Box sx={{
  bgcolor: 'var(--surface-base)',
  p: 'var(--spacing-300)',
  borderRadius: 'var(--border-radius-100)',
}} />
```

---

# 4. Token Authority Rule

Every visual value must reference a token.

**Forbidden:**
```jsx
bgcolor: '#ffffff'
padding: '24px'
borderRadius: '8px'
```

**Mandatory:**
```jsx
bgcolor: 'var(--surface-base)'
p: 'var(--spacing-300)'
borderRadius: 'var(--border-radius-100)'
```

No exceptions.

---

# 5. Theme Translation Model

## 🚨 CRITICAL: MUI Theme Palette Limitation

MUI's theme palette **CANNOT** process CSS variables. MUI needs raw color values to:
- Calculate color variants (light, dark)
- Compute contrast ratios
- Process colors with internal utilities

**Theme Palette Rule:**
```javascript
// ❌ WRONG — will cause runtime errors
palette: {
  primary: {
    main: 'var(--color-primary-default)',  // MUI can't parse this
  }
}

// ✅ CORRECT — use raw hex values from tokens.css
palette: {
  primary: {
    main: '#0062C1',  // --primary-600
    light: '#0073E1', // --primary-500
    dark: '#0051A2',  // --primary-700
  }
}
```

**Complete Theme Structure:**

```javascript
import { createTheme, ThemeProvider } from '@mui/material/styles';

const brandsyncTheme = createTheme({
  palette: {
    // Use RAW VALUES from tokens.css (primitives, not semantic tokens)
    primary: {
      main: '#0062C1',      // --primary-600
      light: '#0073E1',     // --primary-500
      dark: '#0051A2',      // --primary-700
      contrastText: '#ffffff',
    },
    background: {
      default: '#F9FAFB',   // --neutral-25
      paper: '#ffffff',     // --static-white
    },
    text: {
      primary: '#000000',   // --static-black
      secondary: '#5D6472', // --neutral-600
    },
  },
  typography: {
    // Use RAW VALUES — no CSS variables
    fontFamily: '"Roboto", sans-serif',
    fontSize: 16,
    fontWeight: 400,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    // styleOverrides CAN use CSS variables
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-100)',
          padding: 'var(--spacing-150) var(--spacing-250)',
        }
      }
    }
  }
});
```

**Two-Layer Strategy:**

1. **Theme config** → raw hex values (MUI needs these)
2. **`styleOverrides` + `sx` props** → CSS variables (token-driven)

Wrap application:

```jsx
<ThemeProvider theme={brandsyncTheme}>
  <App />
</ThemeProvider>
```

Default MUI theme usage is invalid.

---

# 6. MUI Idiomatic Usage

**Must use:**
- `slotProps` (not deprecated APIs)
- `sx` prop
- Responsive objects
- MUI breakpoints
- MUI component APIs properly

**Forbidden:**
```jsx
<TextField InputProps={{ ... }} />   // ❌ deprecated
```

**Correct:**
```jsx
<TextField slotProps={{ input: { ... } }} />
```

---

# 7. Responsive Doctrine

Responsive must use MUI breakpoint system.

```jsx
<Box sx={{
  display: { xs: 'block', md: 'flex' },
  p: { xs: 'var(--spacing-200)', md: 'var(--spacing-400)' }
}} />
```

Never hardcode media queries manually unless unavoidable.

---

# 8. Interaction Completeness Rule

All interactive components must implement hover, focus, active, disabled, and transition states.

```jsx
<Button sx={{
  bgcolor: 'var(--color-primary-default)',
  '&:hover': {
    bgcolor: 'var(--color-primary-hover)',
  },
  '&:active': {
    bgcolor: 'var(--color-primary-pressed)',
  },
  '&.Mui-disabled': {
    opacity: 'var(--opacity-disabled)',
  },
  transition: 'var(--transition-default)',
}} />
```

Incomplete interaction states are invalid.

---

# 9. Component Interaction Awareness

Components must not be built in isolation. Layout relationships must be preserved.

```jsx
// If sidebar width = 280px, main content must account for it
<Box sx={{
  ml: { md: '280px' },
  transition: 'margin-left 0.3s ease',
}} />
```

---

# 10. Structural Divergence Policy

MUI DOM structure will differ from canonical. This is expected.

**Accept:**
- `.MuiButton-root`
- Internal spans
- Emotion classes

**Never depend on:**
- `.Mui-*` selectors
- Deep nested overrides

**Use instead:**
- `sx`
- `styleOverrides`
- Theme-level overrides

---

# 11. Dark Mode Strategy

Dark mode must be token-driven:

```css
:root {
  --surface-base: #ffffff;
}

[data-theme="dark"] {
  --surface-base: #1a1a1a;
}
```

React toggles via:

```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

Theme must reference CSS variables. Never rebuild theme dynamically.

---

# 12. Anti-Pattern Enforcement

| Anti-Pattern | Status |
|---|---|
| Separate CSS file | ❌ Forbidden |
| CSS variables in theme palette | ❌ Forbidden (causes runtime errors) |
| Inline `style` prop | ❌ Forbidden |
| Global `.Mui-*` override | ❌ Forbidden |
| Deprecated API (`InputProps`, etc.) | ❌ Forbidden |
| Missing responsive handling | ❌ Forbidden |
| No interaction state transitions | ❌ Forbidden |
| Hardcoded values in `sx`/`styleOverrides` | ❌ Forbidden |

---

# 13. CSS Variables vs Raw Values — Quick Reference

| Location | Use | Example | Reason |
|----------|-----|---------|--------|
| Theme `palette` | Raw hex values | `main: '#0062C1'` | MUI needs to process colors |
| Theme `typography` | Raw values | `fontFamily: '"Roboto"'` | MUI needs to process fonts |
| Theme `spacing` | Raw numbers | `spacing: 8` | MUI needs to calculate spacing |
| `styleOverrides` | CSS variables | `padding: 'var(--spacing-200)'` | Tokens work in CSS |
| `sx` prop | CSS variables | `bgcolor: 'var(--surface-base)'` | Tokens work in CSS |
| Component inline | CSS variables | `color="var(--text-default)"` | Tokens work in CSS |

**Golden Rule:** If MUI's theme needs to **process** the value (colors, fonts, numbers), use raw values. Everywhere else, use CSS variables.

---

# 14. BrandSync Token Reference

Always use semantic tokens in `sx` and `styleOverrides`. Raw primitives are only allowed in the MUI theme palette (see §5).

```jsx
// Surfaces
bgcolor: 'var(--surface-base)'          // white — card, sidebar backgrounds
bgcolor: 'var(--surface-container)'     // light grey — page background
bgcolor: 'var(--surface-hover)'         // hover state background
bgcolor: 'var(--surface-selected)'      // active/selected state

// Text
color: 'var(--text-default)'            // primary text
color: 'var(--text-secondary)'          // secondary/muted text
color: 'var(--text-muted)'              // placeholder, hint text
color: 'var(--text-action)'             // active tab, link color
color: 'var(--text-on-action)'          // text on primary buttons

// Primary Actions
bgcolor: 'var(--color-primary-default)' // primary button background
bgcolor: 'var(--color-primary-hover)'   // primary button hover

// Neutral Actions
bgcolor: 'var(--color-neutral-container)'       // secondary button bg
bgcolor: 'var(--color-neutral-container-hover)' // secondary button hover
color:   'var(--text-neutral-default)'          // secondary button text

// Borders
borderColor: 'var(--border-default)'            // standard borders
borderColor: 'var(--border-neutral-container)'  // input borders
borderColor: 'var(--border-primary-focus)'      // focus ring color

// Spacing
p: 'var(--spacing-50)'    // 4px
p: 'var(--spacing-100)'   // 8px
p: 'var(--spacing-150)'   // 12px
p: 'var(--spacing-200)'   // 16px
p: 'var(--spacing-250)'   // 20px
p: 'var(--spacing-300)'   // 24px
p: 'var(--spacing-400)'   // 32px

// Border Radius
borderRadius: 'var(--border-radius-75)'   // 6px  — small elements
borderRadius: 'var(--border-radius-100)'  // 8px  — buttons, inputs
borderRadius: 'var(--border-radius-150)'  // 12px — cards, modals
borderRadius: 'var(--border-radius-full)' // 120px — pills, avatars

// Border Width
border: 'var(--border-width-thin) solid ...'   // 1px
border: 'var(--border-width-medium) solid ...' // 2px — focus rings
```

---

# 15. Layout Patterns

Reproduce the layout structure from the canonical example. Use MUI primitives — no raw HTML layout elements.

## Page Wrapper

```jsx
<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <Box sx={{ p: 'var(--spacing-300)', borderBottom: 'var(--border-width-thin) solid var(--border-default)' }}>
    {/* header */}
  </Box>
  <Box sx={{ flex: 1, overflowY: 'auto', p: 'var(--spacing-300)' }}>
    {/* content */}
  </Box>
</Box>
```

## Card

```jsx
<Paper sx={{
  bgcolor: 'var(--surface-base)',
  border: 'var(--border-width-thin) solid var(--border-default)',
  borderRadius: 'var(--border-radius-150)',
  p: 'var(--spacing-300)',
}}>
  {/* content */}
</Paper>
```

## Two-Column (Sidebar + Content)

```jsx
<Box sx={{ display: 'flex', minHeight: '100vh' }}>
  <Box sx={{
    width: 280,
    flexShrink: 0,
    position: 'fixed',
    height: '100vh',
    bgcolor: 'var(--surface-base)',
    borderRight: 'var(--border-width-thin) solid var(--border-default)',
  }}>
    {/* sidebar */}
  </Box>
  <Box sx={{
    flex: 1,
    ml: '280px',
    bgcolor: 'var(--surface-container)',
  }}>
    {/* main content */}
  </Box>
</Box>
```

## Card Grid

```jsx
<Grid2 container spacing={2}>
  {items.map(item => (
    <Grid2 key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
      <Paper sx={{ p: 'var(--spacing-300)', borderRadius: 'var(--border-radius-150)' }}>
        {/* card content */}
      </Paper>
    </Grid2>
  ))}
</Grid2>
```

## Stack (vertical or horizontal rhythm)

```jsx
<Stack spacing={2} direction="row" alignItems="center">
  <Typography>Label</Typography>
  <Button>Action</Button>
</Stack>
```

---

# 16. Validation Checklist

Before delivery:

- [ ] `_tokens.css` verified against MCP canonical — all semantic tokens present
- [ ] `ThemeProvider` wraps the application with `brandsyncTheme`
- [ ] Theme palette uses raw hex values (no CSS variables in `palette`)
- [ ] `styleOverrides` and `sx` props use CSS variable tokens (no hardcoded values)
- [ ] No separate `.css` files created for component styles
- [ ] No deprecated MUI APIs used (`InputProps` → `slotProps`)
- [ ] All interactive components have hover, focus, active, disabled, and transition states
- [ ] Responsive layout uses MUI breakpoint system
- [ ] Layout relationships between components preserved (sidebar offsets, etc.)
- [ ] Dark mode works via `data-theme` attribute (no dynamic theme rebuild)
- [ ] No `.Mui-*` selectors used for overrides
- [ ] Visual output matches canonical blueprint

---

Version: 2.2
Stack: React + MUI + BrandSync tokens
Mode: Theme + sx Discipline
Authority: BrandSync Design System
DOM Policy: Controlled Divergence
Violation Policy: Fail Hard
