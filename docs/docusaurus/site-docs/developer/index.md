---
sidebar_position: 3
---

# Developer Notes

This repository ships a comment-focused ESLint plugin with six rules, flat
config presets, generated docs, and dual ESM/CJS runtime entrypoints.

## Repository focus

- six shipped rules for prose quality, task hygiene, inclusive language,
  profanity, spellcheck, and readability
- Flat Config presets for `recommended` and `all`
- markdown-aware comment analysis helpers under `src/_internal/`
- static rule docs under `docs/rules/`
- generated API docs via TypeDoc for the public plugin entrypoint

## Validation commands

- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run docs:build`
- `npm run release:check`
