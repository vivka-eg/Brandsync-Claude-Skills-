# Skills Repo

Framework-specific skill rules injected into Claude via MCP.
These rules are context-agnostic and capture learned patterns from real testing sessions.

## Structure

```
skills/         ← one file per framework
contributing/   ← templates and checklists for contributors
CHANGELOG.md    ← version history
```

## How It Works

The MCP server fetches the relevant skill file at a pinned version tag and injects it
into Claude's context alongside the HTML/CSS pattern. Claude follows these rules when
converting patterns to the target framework.

## Contributing

1. Find a mistake Claude made during testing
2. Use `contributing/template.md` to write the agnostic rule
3. Branch off `dev`: `git checkout -b fix/short-description`
4. Add the rule to the correct skill file and update `CHANGELOG.md`
5. Open a PR into `dev` — use `contributing/review-checklist.md` to self-review first
6. After validation on `dev`, a maintainer promotes to `main` and creates a new tag

## Versioning

- `main` = stable, what MCP server pins to
- `dev` = integration branch
- Tags: `v0.1.0`, `v0.2.0`, etc.
- Each skill file has a version header: `<!-- version: x.x.x | updated: date -->`
