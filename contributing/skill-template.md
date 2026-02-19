# Skill File Template

Use this skeleton when creating a new skill file for a framework not yet covered.
Copy this file to `skills/[framework-id].md` and fill in every placeholder.

For adding a new **rule** to an existing skill file, use `template.md` instead.

---

## Standard Structure

Every skill file must follow this exact section order. Add framework-specific
sections between Section 2 and the Token Reference section.

---

```markdown
---
name: [framework-id]
description: [One sentence — what this skill does and its core philosophy]
version: 1.0
execution_mode: [strict|adaptive]
error_policy: [fail-hard|fail-with-alternatives]
component_strategy: [e.g. blueprint-driven, theme-driven, material-mapping]
ui_philosophy: [e.g. reproduce-canonical-output, visual-fidelity-over-structure]
---

# [Framework Name] BrandSync [Descriptor]

[1–3 sentences describing what this skill does, what framework it targets, and
what governs the visual output. Keep it punchy — this is the executive summary.]

| Aspect        | [Framework] Approach                                         |
|---------------|--------------------------------------------------------------|
| DOM Structure | [e.g. Match canonical exactly / Framework controls the DOM] |
| Styling       | [e.g. Scoped <style> / sx prop / SCSS overrides]            |
| Icons         | [e.g. lucide-vue-next / Lucide CDN / MatIconModule]         |
| Philosophy    | [One-line statement of the core trade-off]                  |

---

# 0. Pre-Flight — Do This BEFORE Writing Any Code

## Step 1: Verify the tokens file

Always fetch the canonical tokens from the MCP server and compare against the project:

\```
mcp__brandsync-mcp-server__get_tokens
\```

Check that `[path/to/_tokens.css]` contains all semantic tokens:
- `--surface-container`, `--surface-base`, `--surface-hover`
- `--color-primary-default`, `--color-primary-hover`
- `--text-action`, `--text-on-action`, `--text-secondary`
- `--spacing-25` through `--spacing-800`
- `--border-radius-50` through `--border-radius-full`
- `--border-primary-focus`, `--border-neutral-container`

If ANY are missing, replace `_tokens.css` with the full canonical version before
proceeding. Undefined CSS variables fail silently and break layout/color without
any error.

**[Framework-specific import instruction — e.g. how to import _tokens.css]:**
\```[language]
[import statement or config entry]
\```

## Step 2: Check project structure

[Framework-specific — what to read before writing code. Common things to check:]
- Package versions (affects API availability)
- Standalone vs module architecture
- Any existing global CSS that could conflict
- Relevant config files (`angular.json`, `vite.config.js`, etc.)

## Step 3: Fetch the canonical example

\```
mcp__brandsync-mcp-server__get_example  (name: "PageName")
\```

Study the full HTML + CSS before writing a single line of code.
[State whether canonical defines structure too, or visual target only.]

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
- The final DOM structure
- A standalone HTML deliverable

[Add one sentence on the framework's relationship to canonical DOM — does it match
exactly, or does the framework control the DOM?]

---

# 2. Core Law

[List the non-negotiable rules for this framework as a short enforced list.
Use traffic-light emoji for visual weight, ❌ for forbidden, ✅ for required.]

1. 🔴 [Most critical rule — always visual match]
2. 🟡 [Framework's role]
3. ❌ [Key forbidden thing]
4. ❌ [Another forbidden thing]
5. ✅ [Required pattern]

---

# [3+]. [Framework-Specific Sections]

[Add numbered sections for the patterns unique to this framework.
Examples: component pattern, icon protocol, responsive rules, state management,
theming, component mapping strategy, etc.

Keep section names consistent with sibling skill files where the concept overlaps:]
- "Icon Protocol" (Angular vanilla uses this)
- "Responsive Rule" / "Responsive Doctrine"
- "Dark Mode" (shared name across all files)
- "BrandSync Token Reference" (shared name across all files)
- "Validation Checklist" (always the last numbered section)

---

# [N]. BrandSync Token Reference

Always use semantic tokens. Never hardcode values.

\```[css|scss|jsx]
/* Surfaces */
[syntax] var(--surface-base)          /* white — card, sidebar backgrounds */
[syntax] var(--surface-container)     /* light grey — page background */
[syntax] var(--surface-hover)         /* hover state background */
[syntax] var(--surface-selected)      /* active/selected state */

/* Text */
[syntax] var(--text-default)          /* primary text */
[syntax] var(--text-secondary)        /* secondary/muted text */
[syntax] var(--text-muted)            /* placeholder, hint text */
[syntax] var(--text-action)           /* active tab, link color */
[syntax] var(--text-on-action)        /* text on primary buttons */

/* Primary Actions */
[syntax] var(--color-primary-default) /* primary button background */
[syntax] var(--color-primary-hover)   /* primary button hover */

/* Neutral Actions */
[syntax] var(--color-neutral-container)       /* secondary button bg */
[syntax] var(--color-neutral-container-hover) /* secondary button hover */
[syntax] var(--text-neutral-default)          /* secondary button text */

/* Borders */
[syntax] var(--border-default)            /* standard borders */
[syntax] var(--border-neutral-container)  /* input borders */
[syntax] var(--border-primary-focus)      /* focus ring color */

/* Spacing */
[syntax] var(--spacing-50)    /* 4px  */
[syntax] var(--spacing-100)   /* 8px  */
[syntax] var(--spacing-150)   /* 12px */
[syntax] var(--spacing-200)   /* 16px */
[syntax] var(--spacing-250)   /* 20px */
[syntax] var(--spacing-300)   /* 24px */
[syntax] var(--spacing-400)   /* 32px */

/* Border Radius */
[syntax] var(--border-radius-75)   /* 6px  — small elements */
[syntax] var(--border-radius-100)  /* 8px  — buttons, inputs */
[syntax] var(--border-radius-150)  /* 12px — cards, modals */
[syntax] var(--border-radius-full) /* 120px — pills, avatars */

/* Border Width */
[syntax] var(--border-width-thin)   /* 1px */
[syntax] var(--border-width-medium) /* 2px — focus rings */
\```

---

# [N+1]. Dark Mode

Dark mode is token-driven via `data-theme` on `<html>`. BrandSync tokens switch
automatically — no theme rebuild needed.

\```[language]
[Framework-specific toggle implementation]
\```

Toggle must:
- Set `data-theme` attribute on `document.documentElement`
- Persist selection to `localStorage`
- Read saved value on mount/init

Never rebuild the theme dynamically.

---

# [N+2]. Validation Checklist

Before delivery:

- [ ] `_tokens.css` verified against MCP canonical — all semantic tokens present
- [ ] [Framework token import verified]
- [ ] [Framework-specific setup checks]
- [ ] Only valid BrandSync semantic tokens used — no hardcoded values
- [ ] All interactive components have hover, focus, active, disabled, and transition states
- [ ] Dark mode works via `data-theme` attribute
- [ ] Visual output matches canonical blueprint

---

Version: 1.0
Stack: [Framework] + [Key dependencies]
Mode: [Short descriptor — e.g. Blueprint-Driven, Theme + sx Discipline]
Authority: [What governs visual output — e.g. BrandSync Design System]
Violation Policy: [Fail Hard | Accept [X] DOM, enforce visual match]
```

---

## Frontmatter Field Reference

| Field | Required | Values |
|-------|----------|--------|
| `name` | Yes | Unique kebab-case ID matching the filename |
| `description` | Yes | One sentence summary |
| `version` | Yes | Semver starting at `1.0` |
| `execution_mode` | Yes | `strict` (no alternatives given) or `adaptive` (alternatives acceptable) |
| `error_policy` | Yes | `fail-hard` or `fail-with-alternatives` |
| `component_strategy` | Yes | Short descriptor of how components are built |
| `ui_philosophy` | Yes | Short descriptor of the visual approach |

## Version Footer Field Reference

The footer at the bottom of every skill file must use these exact field names:

```
Version: [semver]
Stack: [Framework] + [key deps, comma-separated]
Mode: [Same as execution approach in one phrase]
Authority: [What is the source of truth for visual output]
Violation Policy: [Fail Hard | custom statement]
```

**Important:** Keep the frontmatter `version:` and the footer `Version:` in sync.
They must always match.

## Checklist before opening a PR for a new skill file

- [ ] File placed at `skills/[framework-id].md`
- [ ] Frontmatter `version` matches footer `Version`
- [ ] All `[PLACEHOLDER]` text replaced — no square-bracket tokens remaining
- [ ] Section 0 Pre-Flight steps match the project's actual file paths
- [ ] Token Reference uses the correct syntax for the framework (CSS/JSX/SCSS)
- [ ] Validation checklist includes framework-specific checks
- [ ] Tested by converting at least one canonical BrandSync example
- [ ] `CHANGELOG.md` updated under the upcoming version
