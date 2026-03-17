---
title: Overview
<<<<<<< HEAD
description: README-style overview for eslint-plugin-write-good-comments-2.
||||||| 53124b2
description: README-style overview for eslint-plugin-typefest.
=======
description: README-style overview for eslint-plugin-write-good-comments.
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
---

<<<<<<< HEAD
# eslint-plugin-write-good-comments-2
||||||| 53124b2
# eslint-plugin-typefest
=======
# eslint-plugin-write-good-comments
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

<<<<<<< HEAD
`eslint-plugin-write-good-comments-2` runs
[`write-good`](https://github.com/btford/write-good) against source comments and
also keeps TODO-style task comments descriptive so you can catch vague, wordy,
or low-signal comment text before it spreads through a codebase.
||||||| 53124b2
ESLint plugin for teams that want consistent TypeScript-first conventions based on:

- [`type-fest`](https://github.com/sindresorhus/type-fest)
- [`ts-extras`](https://github.com/sindresorhus/ts-extras)

The plugin ships focused rule sets for modern Flat Config usage, with parser setup included in each preset.
=======
`eslint-plugin-write-good-comments` runs
[`write-good`](https://github.com/btford/write-good) against source comments so
you can catch vague, wordy, or low-signal prose before it spreads through a
codebase.
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

## Installation

```bash
<<<<<<< HEAD
npm install --save-dev eslint-plugin-write-good-comments-2
||||||| 53124b2
npm install --save-dev eslint-plugin-typefest typescript
=======
npm install --save-dev eslint-plugin-write-good-comments
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
```

## Quick start

```ts
<<<<<<< HEAD
import writeGoodComments from "eslint-plugin-write-good-comments-2";
||||||| 53124b2
import typefest from "eslint-plugin-typefest";
=======
import writeGoodComments from "eslint-plugin-write-good-comments";
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

export default [writeGoodComments.configs.recommended];
```

## Presets

| Preset                                     | Preset page                             |
| ------------------------------------------ | --------------------------------------- |
| 🟡 `writeGoodComments.configs.recommended` | [Recommended](./presets/recommended.md) |
| 🟣 `writeGoodComments.configs.all`         | [All](./presets/all.md)                 |
<<<<<<< HEAD

## Shipped rules

- [`task-comment-format`](./task-comment-format.md) — require TODO-style task
  comments to include a descriptive body.
- [`write-good-comments`](./write-good-comments.md) — run `write-good` against
  normal source comment prose.
||||||| 53124b2
| Preset                                            | Preset page                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| 🟢 `typefest.configs.minimal`                     | [Minimal](./presets/minimal.md)                                     |
| 🟡 `typefest.configs.recommended`                 | [Recommended](./presets/recommended.md)                             |
| 🟠 `typefest.configs["recommended-type-checked"]` | [Recommended (type-checked)](./presets/recommended-type-checked.md) |
| 🔴 `typefest.configs.strict`                      | [Strict](./presets/strict.md)                                       |
| 🟣 `typefest.configs.all`                         | [All](./presets/all.md)                                             |
| 💠 `typefest.configs["type-fest/types"]`          | [type-fest/types](./presets/type-fest-types.md)                     |
| ✴️ `typefest.configs["ts-extras/type-guards"]`    | [ts-extras/type-guards](./presets/ts-extras-type-guards.md)         |
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

## Next steps

- Open **Getting Started** in this sidebar for installation + usage details.
- Browse [**Presets**](./presets/index.md) for preset-by-preset guidance.
- Use **Rules** to review the shipped rule with examples and options.
