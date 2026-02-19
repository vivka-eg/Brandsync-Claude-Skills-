# Brandsync Claude Skills Repo

## What This Is

This repo stores framework-specific skill rules that are injected into Claude via an MCP server.
Skill rules are context-agnostic lessons learned from real testing sessions — they compensate for
mistakes Claude makes repeatedly when converting HTML/CSS patterns to frontend frameworks.

This is NOT model training. Claude cannot be trained by users. Skill files are context injected
at request time so Claude behaves correctly without repeating known mistakes.

## The Full Workflow

```
Website (Brandsync)
  └── User selects HTML/CSS pattern + framework
  └── Website generates a prompt

User pastes prompt into Claude Code
  └── Claude Code has MCP configured
  └── MCP serves two things:
        1. get_framework_rules(framework) → skill MD from this repo (pinned tag)
        2. get_pattern(name)             → HTML/CSS pattern content

Claude follows the rules and converts the pattern to the target framework
```

## This Repo's Role

The MCP server fetches skill files from this repo at a **pinned version tag** (e.g. `v0.1.0`).
When a new version is released and the MCP server bumps its pinned tag, all users automatically
get the updated rules on their next request — no user action needed.

## Branching Strategy

```
main   ← stable, what MCP server pins to via tags
dev    ← integration branch, tested before promoting to main
  └── fix/short-description   ← contributor branches, always off dev
```

- Contributors never push directly to `main` or `dev`
- PRs into `dev` require no approval (fast iteration)
- PRs from `dev` into `main` require 1 approval
- After merge to main → create a new tag → MCP server bumps pinned version

## Contributing a New Rule

1. Find a mistake Claude made during testing
2. Use `contributing/template.md` to write the rule in agnostic form
3. Branch off dev: `git checkout dev && git checkout -b fix/short-description`
4. Add the rule to the correct file in `skills/` under the right section
5. Update `CHANGELOG.md` under the upcoming version
6. Open PR into `dev` — self-review using `contributing/review-checklist.md`

## Skill File Format

Each skill file has:
- A version header comment at the top
- Sections grouping related rules
- Rules written as clear imperative statements
- No project-specific references — every rule must apply to any codebase

## Versioning

- Tags follow semver: `v0.1.0`, `v0.2.0`, `v1.0.0`
- Bump patch (`v0.1.1`) for small rule fixes or clarifications
- Bump minor (`v0.2.0`) for new rules or new sections
- Bump major (`v1.0.0`) for breaking restructures

## MCP Integration (in progress)

The MCP server will:
- Expose `get_framework_rules(framework)` — fetches `skills/{framework}.md` at pinned tag
- Expose `get_pattern(name)` — fetches HTML/CSS pattern content
- Cache the skill MD in memory between requests (same string = consistent delivery)
- Pin to a specific tag, not `main`, so bad PRs don't reach users immediately
