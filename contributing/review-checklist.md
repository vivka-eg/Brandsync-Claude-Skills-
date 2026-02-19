# PR Review Checklist

Use this when reviewing a PR that adds or modifies skill rules.

---

## Agnosticism Check

- [ ] Would this rule make sense in a completely different project?
- [ ] Does the rule reference any specific file names, component names, or project-specific terms?
- [ ] If yes to the above — send back for abstraction before merging

## Quality Check

- [ ] Is the rule clear and actionable? (Claude must be able to follow it without guessing)
- [ ] Is the rule in the correct section of the skill file?
- [ ] Does it duplicate an existing rule?
- [ ] Is it too broad? (A rule that says "always write good code" is useless)
- [ ] Is it too narrow? (A rule that only applies to one edge case may not be worth adding)

## Evidence Check

- [ ] Was this rule derived from an actual observed mistake, not a hypothetical?
- [ ] Has it been validated against more than one scenario?

## Format Check

- [ ] Rule is written as a clear imperative statement
- [ ] CHANGELOG.md is updated
- [ ] Version header in the skill file is updated if this is going into a release
