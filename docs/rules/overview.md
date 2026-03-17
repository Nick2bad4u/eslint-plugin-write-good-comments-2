---
title: Overview
description: README-style overview for eslint-plugin-write-good-comments.
---

# eslint-plugin-write-good-comments

`eslint-plugin-write-good-comments` runs
[`write-good`](https://github.com/btford/write-good) against source comments so
you can catch vague, wordy, or low-signal prose before it spreads through a
codebase.

## Installation

```bash
npm install --save-dev eslint-plugin-write-good-comments
```

## Quick start

```ts
import writeGoodComments from "eslint-plugin-write-good-comments";

export default [writeGoodComments.configs.recommended];
```

## Presets

| Preset                                     | Preset page                             |
| ------------------------------------------ | --------------------------------------- |
| 🟡 `writeGoodComments.configs.recommended` | [Recommended](./presets/recommended.md) |
| 🟣 `writeGoodComments.configs.all`         | [All](./presets/all.md)                 |

## Next steps

- Open **Getting Started** in this sidebar for installation + usage details.
- Browse [**Presets**](./presets/index.md) for preset-by-preset guidance.
- Use **Rules** to review the shipped rule with examples and options.
