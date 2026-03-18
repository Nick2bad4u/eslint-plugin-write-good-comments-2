---
title: Overview
description: README-style overview for eslint-plugin-write-good-comments-2.
---

# eslint-plugin-write-good-comments-2

`eslint-plugin-write-good-comments-2` improves source comments with
[`write-good`](https://github.com/btford/write-good),
[`retext-equality`](https://github.com/retextjs/retext-equality),
[`retext-profanities`](https://github.com/retextjs/retext-profanities),
[`retext-spell`](https://github.com/retextjs/retext-spell),
[`retext-readability`](https://github.com/retextjs/retext-readability), and
descriptive task-comment enforcement so vague, inconsiderate, misspelled, or
hard-to-read comment text is caught before it spreads through a codebase.

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

- [`write-good-comments`](./write-good-comments.md) — run `write-good` against
  normal source comment prose.
- [`task-comment-format`](./task-comment-format.md) — require TODO-style task
  comments to include a descriptive body.
- [`inclusive-language-comments`](./inclusive-language-comments.md) — require
  source comments to avoid exclusionary or inconsiderate language.
- [`no-profane-comments`](./no-profane-comments.md) — disallow profane wording
  in source comments.
- [`spellcheck-comments`](./spellcheck-comments.md) — spellcheck comment prose
  with a curated technical vocabulary.
- [`readability-comments`](./readability-comments.md) — flag comment sentences
  that are unnecessarily hard to read.

## Next steps

- Open **Getting Started** in this sidebar for installation + usage details.
- Browse [**Presets**](./presets/index.md) for preset-by-preset guidance.
- Use **Rules** to review each shipped rule with examples and options.
