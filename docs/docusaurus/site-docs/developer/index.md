---
sidebar_position: 3
---

# Developer Notes

This repository ships a comment-focused ESLint plugin with six rules, flat
config presets, generated docs, and dual ESM/CJS runtime entrypoints.

## What to open first

- the **Rules** section for the rule catalog and preset context
- [TypeDoc API reference](./api/index.md) for the published plugin surface
- [GitHub repository](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2) for workflows, release automation, and issue tracking

## Repository focus

- six shipped rules for prose quality, task hygiene, inclusive language,
  profanity, spellcheck, and readability
- Flat Config presets for `recommended` and `all`
- markdown-aware comment analysis helpers under `src/_internal/`
- static rule docs under `docs/rules/`
- generated API docs via TypeDoc for the public plugin entrypoint

## Developer documentation map

- **Overview docs** explain the package goals and rollout path.
- **Rules docs** cover user-facing behavior, options, and examples.
- **TypeDoc API** documents the exported plugin object and public type aliases.
- **Tests** under `test/` validate public configs, docs integrity, and runtime compatibility.

## Validation commands

- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run docs:build`
- `npm run release:check`
