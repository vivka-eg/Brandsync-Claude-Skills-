---
name: vue-brandsync
description: Maps canonical BrandSync UI to Vue 3 components using scoped styles and design tokens. Visual fidelity with full DOM control.
version: 1.3
execution_mode: adaptive
error_policy: fail-with-alternatives
component_strategy: vanilla-vue
ui_philosophy: reproduce-canonical-with-vue-primitives
---

# Vue 3 BrandSync Adapter

Reproduce canonical BrandSync visual output using Vue 3 Single File Components (SFCs) with scoped styles.

## Core Principle

Vue gives full DOM control — reproduce the canonical HTML structure exactly, then wire it with Vue reactivity.

| Aspect | Vue 3 Approach |
|--------|----------------|
| DOM Structure | Match canonical HTML exactly |
| Styling | Scoped `<style>` with BrandSync tokens |
| Icons | `lucide-vue-next` (named imports) |
| State | `ref()` / `computed()` via `<script setup>` |
| Components | Composition API, SFC pattern |
| Philosophy | "Reproduce canonical blueprint with Vue wiring" |

---

# 0. Pre-Flight — Do This BEFORE Writing Any Code

## Step 1: Verify the tokens file

The project's `_tokens.css` may be outdated or incomplete. Always fetch the canonical tokens from the MCP server and compare:

```
mcp__brandsync-mcp-server__get_tokens
```

Check that the project's `src/assets/_tokens.css` contains all semantic tokens:
- `--surface-container`, `--surface-base`, `--surface-hover`
- `--color-primary-default`, `--color-primary-hover`
- `--text-action`, `--text-on-action`, `--text-secondary`
- `--spacing-25` through `--spacing-800`
- `--border-radius-50` through `--border-radius-full`
- `--border-primary-focus`, `--border-neutral-container`

If ANY of these are missing, replace `_tokens.css` with the full canonical version from MCP before proceeding. Undefined CSS variables fail silently — they resolve to nothing and break layout/color without any error.

## Step 2: Check for existing global CSS

Look at `main.js` for any globally imported CSS files:

```js
import './assets/_tokens.css'
import './assets/some-global-styles.css'  // ← if this exists, it affects ALL components
```

If any global CSS file exists beyond `_tokens.css`, read it and note ALL class names it defines. Any new component you build MUST use a unique prefix for every class to avoid collisions.

## Step 3: Fetch the canonical example

```
mcp__brandsync-mcp-server__get_example  (name: "PageName")
```

Study the full HTML + CSS before writing a single line of code.

---

# 1. Project Setup (This Project)

**Stack:** Vue 3 + Vite + `lucide-vue-next`
**No UI library** (no Vuetify, no PrimeVue, no Quasar — vanilla Vue only)
**Design tokens:** `src/assets/_tokens.css` — imported in `main.js`

```
src/
├── assets/
│   ├── _tokens.css        # BrandSync design tokens — ALWAYS import
│   └── *.css              # Any other global CSS files (check main.js)
├── components/
│   └── *.vue              # SFC components — each uses <style scoped>
├── App.vue
└── main.js
```

**`main.js` token import:**
```js
import './assets/_tokens.css'
```

---

# 2. SFC Structure Template

Every component follows this structure:

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { IconName } from 'lucide-vue-next'

// State
const myState = ref(false)

// Computed
const derivedValue = computed(() => myState.value ? 'a' : 'b')

// Methods (plain functions)
const handleAction = () => {
  myState.value = !myState.value
}
</script>

<template>
  <!-- Canonical DOM structure reproduced exactly -->
  <div class="prefix-wrapper">
    <button @click="handleAction" :class="{ 'prefix-wrapper--active': myState }">
      <IconName :size="20" />
      <span>Label</span>
    </button>
  </div>
</template>

<style scoped>
.prefix-wrapper {
  background: var(--surface-base);
  border: var(--border-width-thin) solid var(--border-default);
}
</style>
```

---

# 3. Vue 3 Reactivity Patterns

## State
```js
const isOpen = ref(false)           // primitive
const items = ref([])               // array
const user = ref({ name: '' })      // object
```

## Computed
```js
const badgeClass = computed(() => ({
  'badge-success': status.value === 'active',
  'badge-neutral': status.value === 'inactive',
  'badge-error':   status.value === 'expired',
}))
```

## Template Directives
```html
<!-- Conditional rendering -->
<div v-if="isVisible">Show</div>
<div v-else>Hide</div>
<div v-show="isVisible">CSS toggle (keeps DOM)</div>

<!-- List rendering -->
<tr v-for="row in tableData" :key="row.id">

<!-- ❌ NEVER put v-if and v-for on the same element -->
<!-- ✅ Wrap with <template> instead -->
<template v-for="item in items" :key="item.id">
  <div v-if="item.visible">{{ item.name }}</div>
</template>

<!-- Dynamic class -->
<div :class="{ collapsed: isCollapsed, active: isActive }">
<div :class="[baseClass, conditionalClass]">

<!-- Dynamic style -->
<div :style="{ width: navWidth + 'px' }">

<!-- Events -->
<button @click="handler">
<input @input="onInput" @keyup.enter="onEnter">
<a @click.prevent="navigate">  <!-- .prevent = preventDefault -->

<!-- Two-way binding -->
<input v-model="searchQuery">
```

---

# 4. Icons — `lucide-vue-next`

**Always use named imports:**
```js
import { Search, Bell, Plus, ChevronDown, Settings } from 'lucide-vue-next'
```

**Usage in template:**
```html
<Search :size="20" />
<Bell :size="20" stroke-width="1.5" />
<Plus :size="16" color="var(--color-primary-default)" />
```

**DO NOT use `lucide` (vanilla) in Vue — use `lucide-vue-next` only.**
No `createIcons()` or `data-lucide` attributes — those are for vanilla JS.

---

# 5. Styling Rules

## Scoped Styles (Default)
```vue
<style scoped>
/* Vue adds data-v-[hash] — styles only apply to this component */
.btn { background: var(--color-primary-default); }
</style>
```

## BrandSync Tokens — Always Use Semantic Tokens

Use semantic tokens (not raw primitives) wherever they exist:

```css
/* Surfaces */
var(--surface-base)          /* white — sidebar, card backgrounds */
var(--surface-container)     /* light grey — page background */
var(--surface-hover)         /* hover state background */
var(--surface-selected)      /* active/selected state */

/* Text */
var(--text-default)          /* primary text */
var(--text-secondary)        /* secondary/muted text */
var(--text-muted)            /* placeholder, hint text */
var(--text-action)           /* active tab, link color */
var(--text-on-action)        /* text on primary buttons */

/* Primary Actions */
var(--color-primary-default) /* primary button background */
var(--color-primary-hover)   /* primary button hover */

/* Neutral Actions */
var(--color-neutral-container)       /* secondary button bg */
var(--color-neutral-container-hover) /* secondary button hover */
var(--text-neutral-default)          /* secondary button text */

/* Borders */
var(--border-default)           /* standard borders */
var(--border-neutral-container) /* input borders */
var(--border-primary-focus)     /* focus ring color */

/* Spacing — use token names, not raw px */
var(--spacing-50)    /* 4px  */
var(--spacing-100)   /* 8px  */
var(--spacing-150)   /* 12px */
var(--spacing-200)   /* 16px */
var(--spacing-250)   /* 20px */
var(--spacing-300)   /* 24px */
var(--spacing-400)   /* 32px */

/* Border Radius */
var(--border-radius-75)   /* 6px  — small elements */
var(--border-radius-100)  /* 8px  — buttons, inputs */
var(--border-radius-150)  /* 12px — cards, modals */
var(--border-radius-full) /* 120px — pills, avatars */

/* Border Width */
var(--border-width-thin)   /* 1px */
var(--border-width-medium) /* 2px — focus rings */
```

## NO External CSS Files
Do not create `.css` files for component styles. Use `<style scoped>` in SFCs.
Global/reset styles go in `App.vue` `<style>` (not scoped).

## Deep Selector (for child component styling)
```css
/* Only when you need to pierce scoped boundary */
:deep(.child-class) { color: red; }
```

---

# 6. CSS Isolation — Adding Pages to Projects with Global CSS

When a project has an existing global CSS file (e.g. `dashboard-complete.css`), every new component MUST use a **unique class prefix** for all its classes. This prevents any name collision with the global styles.

## Why this is necessary

Global CSS files define classes like `.nav-item`, `.btn`, `.main-content`, `.form-group`. These apply to ANY element in the DOM with those class names — including inside your new component, even with `<style scoped>`. Scoped styles have higher specificity for properties they define, but global styles still apply for properties your scoped styles don't explicitly override.

## The prefix strategy

Pick a short prefix unique to the component (e.g. `pd-` for Personal Details, `inv-` for Invoice, `usr-` for User Settings):

```css
/* ❌ Collides with global .nav-item, .btn, .main-content */
.nav-item { ... }
.btn { ... }
.main-content { ... }

/* ✅ Completely isolated */
.pd-nav-item { ... }
.pd-btn { ... }
.pd-main { ... }
```

## BEM modifiers for state

Use `--` for state modifiers instead of chaining classes:

```css
/* Canonical pattern (vanilla):  .sidebar.collapsed */
/* Vue scoped with prefix:       .pd-sidebar--collapsed */
```

Toggle via Vue class binding:
```html
<aside class="pd-sidebar" :class="{ 'pd-sidebar--collapsed': isCollapsed }">
```

## Full example structure

```vue
<template>
  <div class="inv-layout">
    <aside class="inv-sidebar" :class="{ 'inv-sidebar--collapsed': collapsed }">
      <nav class="inv-sidebar__nav">
        <a class="inv-nav-item" :class="{ 'inv-nav-item--active': isActive }">
          <SearchIcon class="inv-nav-icon" :size="18" />
          <span class="inv-nav-label">Item</span>
        </a>
      </nav>
    </aside>
    <main class="inv-main" :class="{ 'inv-main--shifted': collapsed }">
      <!-- content -->
    </main>
  </div>
</template>

<style scoped>
.inv-layout { display: flex; min-height: 100vh; }
.inv-sidebar { width: 280px; background-color: var(--surface-base); position: fixed; ... }
.inv-sidebar--collapsed { width: 80px; }
.inv-main { flex: 1; margin-left: 280px; background-color: var(--surface-container); }
.inv-main--shifted { margin-left: 80px; }
/* ... all styles self-contained, zero dependency on any external CSS */
</style>
```

The component is fully standalone — it works identically whether or not the global CSS file is loaded.

---

# 7. Layout Patterns

Always reproduce the layout structure from the canonical example exactly. Below are the common primitives — use whichever the design calls for.

## Page Wrapper
```html
<div class="prefix-page">
  <header class="prefix-page-header"><!-- title, actions --></header>
  <main class="prefix-page-body"><!-- content --></main>
</div>
```
```css
.prefix-page { display: flex; flex-direction: column; height: 100%; }
.prefix-page-body { flex: 1; overflow-y: auto; padding: var(--spacing-300); }
```

## Card
```html
<div class="prefix-card">
  <div class="prefix-card__header"><h3>Title</h3></div>
  <div class="prefix-card__body"><!-- content --></div>
  <div class="prefix-card__footer"><!-- actions --></div>
</div>
```
```css
.prefix-card {
  background: var(--surface-base);
  border: var(--border-width-thin) solid var(--border-default);
  border-radius: var(--border-radius-150);
  padding: var(--spacing-300);
}
```

## Two-Column (Sidebar + Content)
```html
<div class="prefix-layout">
  <aside class="prefix-sidebar"><!-- nav or filters --></aside>
  <div class="prefix-main"><!-- page body --></div>
</div>
```
```css
.prefix-layout { display: flex; min-height: 100vh; }
.prefix-sidebar { width: 280px; position: fixed; height: 100vh; background: var(--surface-base); }
.prefix-main { flex: 1; margin-left: 280px; background: var(--surface-container); }
```

## Card Grid
```html
<div class="prefix-grid">
  <div class="prefix-card" v-for="item in items" :key="item.id">
    <!-- card content -->
  </div>
</div>
```
```css
.prefix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-200);
}
```

## Form Layout
```html
<form class="prefix-form" @submit.prevent="handleSubmit">
  <div class="prefix-form__grid">
    <div class="prefix-field">
      <label class="prefix-field__label" for="name">Name</label>
      <input id="name" class="prefix-field__input" v-model="form.name" type="text" />
    </div>
  </div>
  <div class="prefix-form__actions">
    <button type="button" class="prefix-btn prefix-btn--secondary" @click="cancel">Cancel</button>
    <button type="submit" class="prefix-btn prefix-btn--primary">Save</button>
  </div>
</form>
```
```js
const form = ref({ name: '', email: '' })
const handleSubmit = () => { /* validate then emit/call API */ }
```

## Inline Row (label + action on same line)
```html
<div class="prefix-row">
  <span class="prefix-row__label">Section Title</span>
  <button class="prefix-btn prefix-btn--primary"><Plus :size="14" /> Add</button>
</div>
```
```css
.prefix-row { display: flex; align-items: center; justify-content: space-between; }
```

## Collapsible Section (generic accordion)
```js
const expanded = ref(true)
const toggle = () => { expanded.value = !expanded.value }
```
```html
<div class="prefix-section">
  <button class="prefix-section__header" @click="toggle">
    <span>Section Title</span>
    <ChevronDown :size="16" :class="{ 'prefix-section__chevron--rotated': expanded }" />
  </button>
  <div v-show="expanded" class="prefix-section__body">
    <!-- content -->
  </div>
</div>
```
```css
.prefix-section__chevron--rotated { transform: rotate(180deg); transition: transform 0.2s ease; }
```

---

# 8. Table Pattern

```vue
<template>
  <table class="prefix-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in tableData" :key="row.id">
        <td>{{ row.name }}</td>
        <td>
          <span class="prefix-badge" :class="badgeClass(row.status)">
            {{ row.status }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

```js
const badgeClass = (status) => ({
  'prefix-badge--success': status === 'active',
  'prefix-badge--neutral': status === 'inactive',
  'prefix-badge--error':   status === 'expired',
})
```

---

# 9. Modal / Overlay Pattern

Vue has no built-in modal service. Use `v-if` + teleport:

```vue
<template>
  <Teleport to="body">
    <div v-if="showModal" class="prefix-overlay" @click.self="closeModal">
      <div class="prefix-modal">
        <div class="prefix-modal__header">
          <h2>Title</h2>
          <button @click="closeModal"><X :size="20" /></button>
        </div>
        <div class="prefix-modal__body">
          <!-- content -->
        </div>
        <div class="prefix-modal__footer">
          <button class="prefix-btn prefix-btn--secondary" @click="closeModal">Cancel</button>
          <button class="prefix-btn prefix-btn--primary" @click="confirm">Save</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
```

```js
const showModal = ref(false)
const openModal = () => { showModal.value = true }
const closeModal = () => { showModal.value = false }
```

**`<Teleport to="body">`** — always use for modals to avoid z-index/overflow issues.

---

# 10. Dropdown Pattern

```vue
<template>
  <div class="prefix-dropdown" ref="dropdownRef">
    <button @click="showDropdown = !showDropdown">
      Options <ChevronDown :size="16" />
    </button>
    <div v-if="showDropdown" class="prefix-dropdown__menu">
      <button v-for="item in options" :key="item.value"
              class="prefix-dropdown__item"
              @click="selectItem(item)">
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
```

**Click-outside to close:**
```js
import { ref, onMounted, onUnmounted } from 'vue'

const showDropdown = ref(false)
const dropdownRef = ref(null)

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
```

---

# 11. Theme Toggle (Dark Mode)

```js
const currentTheme = ref('light')

// Initialize from saved preference on mount
onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    currentTheme.value = saved
    document.documentElement.setAttribute('data-theme', saved)
  }
})

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  localStorage.setItem('theme', currentTheme.value)
}
```

BrandSync tokens automatically switch with `[data-theme="dark"]` in `_tokens.css`.

---

# 12. Component Communication

## Props (parent → child)
```js
// Child
const props = defineProps({
  title: String,
  isActive: { type: Boolean, default: false },
  items: { type: Array, required: true }
})
```
```html
<!-- Parent -->
<MyComponent :title="pageTitle" :items="tableData" />
```

## Emits (child → parent)
```js
// Child
const emit = defineEmits(['close', 'save'])
const handleSave = () => emit('save', formData.value)
```
```html
<!-- Parent -->
<MyModal @close="showModal = false" @save="onSave" />
```

---

# 13. Critical Rules

**✅ DO:**
- Verify `_tokens.css` against MCP canonical BEFORE writing CSS
- Check for global CSS files in `main.js` BEFORE writing class names
- Use a unique prefix for ALL classes in every new component (e.g. `pd-`, `inv-`, `usr-`)
- Always use `<script setup>` (Composition API)
- Use `ref()` for all reactive state
- Import Lucide icons by name from `lucide-vue-next`
- Use semantic BrandSync tokens (`var(--surface-base)`, `var(--spacing-200)`, etc.)
- Use `<Teleport to="body">` for modals and overlays
- Match canonical DOM structure exactly
- Use `.prevent` modifier for links that shouldn't navigate
- Clean up event listeners in `onUnmounted`

**❌ DON'T:**
- Use Options API (`data()`, `methods:`, `computed:`) — project uses Composition API
- Use `data-lucide` attributes or `createIcons()` — those are vanilla JS Lucide
- Create separate `.css` files for component styles
- Hardcode hex colors or px values that have a token equivalent
- Use primitive tokens (`--neutral-600`) when a semantic token exists (`--text-secondary`)
- Use token names that don't exist in `_tokens.css` (e.g. `--neutral-0`, `--radius-sm`, `--radius-lg` are NOT valid)
- Use `v-html` unless absolutely necessary (XSS risk)
- Forget `:key` on `v-for` loops
- Put `v-if` and `v-for` on the same element — wrap with `<template v-for>` and put `v-if` on the inner element
- Use `$refs` in `<script setup>` — use `const myRef = ref(null)` instead
- Reuse class names from a global CSS file in a new component

---

# 14. Common Patterns Quick Reference

| Need | Vue Pattern |
|------|-------------|
| Toggle boolean | `isOpen.value = !isOpen.value` |
| Conditional render | `v-if` / `v-else` |
| Conditional CSS toggle | `v-show` |
| Loop over array | `v-for="item in items" :key="item.id"` |
| Dynamic class | `:class="{ active: isActive }"` |
| Dynamic style | `:style="{ width: w + 'px' }"` |
| Input binding | `v-model="myRef"` |
| Prevent default | `@click.prevent` |
| Stop propagation | `@click.stop` |
| Listen to child event | `@event-name="handler"` |
| Run on mount | `onMounted(() => { ... })` |
| Computed value | `const x = computed(() => ...)` |
| Watch for changes | `watch(myRef, (newVal) => { ... })` |

---

# 15. Validation Checklist

Before delivery:

- [ ] `_tokens.css` verified against MCP canonical — all semantic tokens present
- [ ] Global CSS files in `main.js` checked for class name conflicts
- [ ] Unique class prefix chosen and applied to ALL component classes
- [ ] `<script setup>` used (not Options API)
- [ ] All icons imported from `lucide-vue-next` by name
- [ ] Only valid BrandSync semantic tokens used — no hardcoded values, no made-up token names
- [ ] Canonical DOM structure reproduced
- [ ] All `v-for` loops have `:key`
- [ ] Modals use `<Teleport to="body">`
- [ ] Click-outside handlers cleaned up in `onUnmounted`
- [ ] Scoped styles used (no separate CSS files)
- [ ] Component works correctly whether or not global CSS is loaded
- [ ] Dark mode works via `data-theme` attribute
- [ ] No `data-lucide` attributes in template

---

Version: 1.3
Stack: Vue 3 + Vite + lucide-vue-next
Mode: Vanilla Vue (no UI library)
Authority: Canonical DOM fidelity + BrandSync token compliance
