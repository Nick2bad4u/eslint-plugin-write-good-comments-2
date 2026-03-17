---
sidebar_position: 3
---

# Developer Notes

This repository modernizes the legacy `eslint-plugin-write-good-comments`
package into a strict TypeScript + Vitest + Docusaurus template.

## Repository focus

- one shipped rule: `write-good-comments`
- Flat Config presets for `recommended` and `all`
- static rule docs under `docs/rules/`
- generated API docs via TypeDoc for the public plugin entrypoint

## Validation commands

- `npm run build`
- `npm run typecheck`
- `npm run test`
- `npm run docs:build`
