# Vue 3 Skill Rules
<!-- version: 0.1.0 | updated: 2026-02-19 -->

## Component Structure

- Always use Composition API with `<script setup>` syntax, not Options API
- Keep template, script, and style in a single `.vue` file
- Order sections: `<script setup>` → `<template>` → `<style scoped>`

## Props and Emits

- Define props with `defineProps<{}>()` using TypeScript generics, not runtime declaration
- Define emits with `defineEmits<{}>()` using TypeScript generics
- After modifying state that a parent depends on, always verify the emit chain is complete — do not stop at the local change
- Use `update:modelValue` for v-model compatibility, not custom event names

## Reactivity

- Use `ref()` for primitives, `reactive()` for objects
- Never destructure a `reactive()` object directly — use `toRefs()` to preserve reactivity
- Always verify two-way binding contracts (v-model, props, emits) end-to-end, not just locally

## Template

- Use `v-bind` shorthand (`:`) and `v-on` shorthand (`@`) consistently
- Never use `v-if` and `v-for` on the same element — wrap with a `<template>` tag instead
- Always provide a `:key` on `v-for` — use a unique ID, not the array index

## Slots

- When converting a pattern that has named regions, preserve them as named slots
- Always verify slot structure is intact end-to-end after conversion, not just in the child component

## Styling

- Use `<style scoped>` by default to prevent style leakage
- Do not use inline styles unless the value is dynamic and cannot be expressed as a class
- Preserve the original class names from the HTML/CSS pattern — do not rename them

## TypeScript

- Always type component props, emits, and exposed refs explicitly
- Do not use `any` — use `unknown` and narrow the type if needed
