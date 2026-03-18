---
title: Overview
description: README-style overview for eslint-plugin-write-good-comments-2.
---

# eslint-plugin-write-good-comments-2

`eslint-plugin-write-good-comments-2` improves source comments with
[`write-good`](https://github.com/btford/write-good), inclusive-language
analysis from [`alex`](https://alexjs.com/), profanity checks, and descriptive
task-comment enforcement so vague, inconsiderate, or low-signal comment text is
caught before it spreads through a codebase.

## Installation

```bash
npm install --save-dev eslint-plugin-write-good-comments-2
```

## Quick start

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [writeGoodComments.configs.recommended];
```

## Presets

| Preset                                     | Preset page                             |
| ------------------------------------------ | --------------------------------------- |
| 🟡 `writeGoodComments.configs.recommended` | [Recommended](./presets/recommended.md) |
| 🟣 `writeGoodComments.configs.all`         | [All](./presets/all.md)                 |

## Shipped rules

- [`inclusive-language-comments`](./inclusive-language-comments.md) — require
  source comments to avoid exclusionary or inconsiderate language.
- [`no-profane-comments`](./no-profane-comments.md) — disallow profane wording
  in source comments.
- [`task-comment-format`](./task-comment-format.md) — require TODO-style task
  comments to include a descriptive body.
- [`write-good-comments`](./write-good-comments.md) — run `write-good` against
  normal source comment prose.

## Next steps

- Open **Getting Started** in this sidebar for installation + usage details.
- Browse [**Presets**](./presets/index.md) for preset-by-preset guidance.
- Use **Rules** to review the shipped rule with examples and options.
