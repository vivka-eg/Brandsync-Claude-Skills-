# Skill Contribution Template

Use this format when adding a new rule to any skill file.

---

## Finding

**What happened (specific):**
[Describe the exact mistake Claude made, including the scenario and context]

**Why it was wrong:**
[Explain what the correct behavior should have been]

**Rule (agnostic):**
[Write the rule as if you're describing it to someone who has never seen your project.
It must make sense in any codebase, not just the one where you found the issue.]

---

## Checklist before submitting PR

- [ ] The rule is written in the agnostic form, not tied to a specific file or project
- [ ] The rule is in the correct section of the skill file
- [ ] The rule does not duplicate an existing rule (check the file first)
- [ ] Tested against at least 2 different scenarios to confirm it generalises
- [ ] CHANGELOG.md updated under the correct version section

---

## Example

**What happened (specific):**
Claude updated the form field value in PersonalDetails.vue but did not emit
`update:modelValue`, which broke v-model binding in the parent component.

**Why it was wrong:**
The parent was using v-model which depends on the `update:modelValue` emit.
Claude only verified the local change, not the full binding chain.

**Rule (agnostic):**
After modifying reactive state in a child component, verify two-way binding
contracts (v-model, emit, props) are intact end-to-end, not just locally.
