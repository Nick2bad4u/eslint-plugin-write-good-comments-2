<<<<<<< HEAD
# eslint-plugin-write-good-comments-2
||||||| 53124b2
# eslint-plugin-typefest
=======
# eslint-plugin-write-good-comments
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

> Lint source comments with [`write-good`](https://github.com/btford/write-good).

[![CI.](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/actions/workflows/ci.yml)
[![codecov.](https://codecov.io/gh/Nick2bad4u/eslint-plugin-write-good-comments-2/branch/main/graph/badge.svg)](https://codecov.io/gh/Nick2bad4u/eslint-plugin-write-good-comments-2)
<<<<<<< HEAD
[![npm version.](https://img.shields.io/npm/v/eslint-plugin-write-good-comments-2.svg)](https://www.npmjs.com/package/eslint-plugin-write-good-comments-2)
||||||| 53124b2
ESLint plugin for teams that want consistent TypeScript-first conventions based on:
=======
[![npm version.](https://img.shields.io/npm/v/eslint-plugin-write-good-comments.svg)](https://www.npmjs.com/package/eslint-plugin-write-good-comments)
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

<<<<<<< HEAD
`eslint-plugin-write-good-comments-2` checks comment prose in JavaScript and
TypeScript source files. It catches vague phrases, wordy constructions, passive
voice, clichés, optional e-prime violations, and bare TODO-style task comments
before unclear source documentation reaches review or production.
||||||| 53124b2
- [`type-fest`](https://github.com/sindresorhus/type-fest)
- [`ts-extras`](https://github.com/sindresorhus/ts-extras)

The plugin ships focused rule sets for modern flat config usage, with parser setup
included in each preset config.

## Table of contents

1. [Installation](#installation)
2. [Quick start (flat config)](#quick-start-flat-config)
3. [Presets](#presets)
4. [Configuration examples by preset](#configuration-examples-by-preset)
5. [Global settings](#global-settings)
6. [Rules](#rules)
7. [Contributors ✨](#contributors-)
=======
`eslint-plugin-write-good-comments` checks comment prose in JavaScript and
TypeScript source files. It catches vague phrases, wordy constructions, passive
voice, clichés, and optional e-prime violations before unclear comments reach
review or production.
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

## Installation

```bash
<<<<<<< HEAD
npm install --save-dev eslint-plugin-write-good-comments-2
||||||| 53124b2
```sh
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
### Compatibility
=======
import writeGoodComments from "eslint-plugin-write-good-comments";
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

export default [writeGoodComments.configs.recommended];
```

## Presets

- `recommended` — best default for almost every project.
- `all` — explicit “everything we ship” preset.

You can also apply the rule manually inside your own scoped config object:

```ts
<<<<<<< HEAD
import writeGoodComments from "eslint-plugin-write-good-comments-2";
||||||| 53124b2
## Configuration examples by preset

```js
import typefest from "eslint-plugin-typefest";
=======
import writeGoodComments from "eslint-plugin-write-good-comments";
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

export default [
    {
        files: ["src/**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "write-good-comments": writeGoodComments,
        },
        rules: {
<<<<<<< HEAD
            "write-good-comments/task-comment-format": "error",
||||||| 53124b2
  // Smallest baseline footprint.
  typefest.configs.minimal,

  // Balanced default for most teams.
  // typefest.configs.recommended,

  // Recommended plus type-aware ts-extras helper rules.
  // typefest.configs["recommended-type-checked"],

  // Recommended plus additional stable runtime utilities.
  // typefest.configs.strict,

  // Every rule (includes experimental rules).
  // typefest.configs.all,

  // Focused subsets:
  // typefest.configs["type-fest/types"],
  // typefest.configs["ts-extras/type-guards"],
];
```

### Parser setup behavior

Each preset already includes:

- `files: ["**/*.{ts,tsx,mts,cts}"]`
- `languageOptions.parser` (`@typescript-eslint/parser`)
- `languageOptions.parserOptions`:
  - `ecmaVersion: "latest"`
  - `projectService: true` (for presets that include typed rules, such as `recommended-type-checked`, `strict`, and `all`)
  - `sourceType: "module"`

End users usually do **not** need to wire parser config manually.

If you need custom parser options (for example `tsconfigRootDir`), extend a preset:

```js
import typefest from "eslint-plugin-typefest";

const recommended = typefest.configs.recommended;

export default [
  {
    ...recommended,
    languageOptions: {
      ...recommended.languageOptions,
      parserOptions: {
        ...recommended.languageOptions?.parserOptions,
        // Add projectService only when you opt into a type-aware preset.
      },
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
            "write-good-comments/write-good-comments": [
                "error",
                {
                    eprime: true,
                    whitelist: ["read-only"],
                },
            ],
        },
    },
];
```

## Rules

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only
- `Preset key` legend:
  - [🟡](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/recommended) — [`writeGoodComments.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/recommended)
  - [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all) — [`writeGoodComments.configs.all`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all)

| Rule                                                                                                                     | Fix | Preset key                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------ | :-: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
<<<<<<< HEAD
| [`task-comment-format`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/task-comment-format) |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all) |
||||||| 53124b2
| Rule                                                                                                                                              |  Fix  | Preset key                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | :---: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`prefer-ts-extras-array-at`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-array-at)                           |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-array-concat`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-array-concat)                   |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-array-find`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-array-find)                       |   🔧  | [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                                                                                                      |
| [`prefer-ts-extras-array-find-last`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-array-find-last)             |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-array-find-last-index`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-array-find-last-index) |   🔧  | [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                                                                                                      |
| [`prefer-ts-extras-array-first`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-array-first)                     | 🔧 💡 | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-array-includes`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-array-includes)               | 🔧 💡 | [🟠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended-type-checked) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                         |
| [`prefer-ts-extras-array-join`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-array-join)                       |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-array-last`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-array-last)                       | 🔧 💡 | [🟠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended-type-checked) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                            |
| [`prefer-ts-extras-as-writable`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-as-writable)                     |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-assert-defined`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-assert-defined)               | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-assert-error`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-assert-error)                   |   💡  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-assert-present`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-assert-present)               | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-is-defined`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-defined)                       |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-is-defined-filter`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-defined-filter)         |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards) |
| [`prefer-ts-extras-is-empty`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-empty)                           |   🔧  | [🟠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended-type-checked) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                         |
| [`prefer-ts-extras-is-equal-type`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-equal-type)                 |   💡  | [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                                                                                                      |
| [`prefer-ts-extras-is-finite`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-finite)                         |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-is-infinite`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-infinite)                     |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-is-integer`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-integer)                       |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-is-present`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-present)                       |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-is-present-filter`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-present-filter)         |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards) |
| [`prefer-ts-extras-is-safe-integer`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-is-safe-integer)             |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-key-in`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-key-in)                               |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-not`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-not)                                     |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-object-entries`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-object-entries)               |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-object-from-entries`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-object-from-entries)     |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-object-has-in`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-object-has-in)                 | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-object-has-own`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-object-has-own)               | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                                      |
| [`prefer-ts-extras-object-keys`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-object-keys)                     |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-object-values`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-object-values)                 |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-ts-extras-safe-cast-to`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-safe-cast-to)                   |   🔧  | [🟠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended-type-checked) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                         |
| [`prefer-ts-extras-set-has`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-set-has)                             | 🔧 💡 | [🟠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended-type-checked) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [✴️](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/ts-extras-type-guards)                                                                         |
| [`prefer-ts-extras-string-split`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-ts-extras-string-split)                   |   🔧  | [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all)                                                                                                                                                                                                                                                                                  |
| [`prefer-type-fest-abstract-constructor`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-abstract-constructor)   |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-arrayable`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-arrayable)                         |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)       |
| [`prefer-type-fest-async-return-type`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-async-return-type)         |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-conditional-pick`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-conditional-pick)           |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-constructor`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-constructor)                     |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-except`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-except)                               |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)       |
| [`prefer-type-fest-if`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-if)                                       |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-iterable-element`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-iterable-element)           |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-json-array`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-json-array)                       |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)       |
| [`prefer-type-fest-json-object`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-json-object)                     |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)       |
| [`prefer-type-fest-json-primitive`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-json-primitive)               |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)       |
| [`prefer-type-fest-json-value`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-json-value)                       |   💡  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)       |
| [`prefer-type-fest-keys-of-union`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-keys-of-union)                 |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-literal-union`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-literal-union)                 |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-merge-exclusive`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-merge-exclusive)             |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-non-empty-tuple`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-non-empty-tuple)             |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-omit-index-signature`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-omit-index-signature)   |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-partial-deep`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-partial-deep)                   |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-primitive`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-primitive)                         |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)       |
| [`prefer-type-fest-promisable`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-promisable)                       |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)       |
| [`prefer-type-fest-readonly-deep`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-readonly-deep)                 |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-require-all-or-none`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-require-all-or-none)     |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-require-at-least-one`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-require-at-least-one)   |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-require-exactly-one`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-require-exactly-one)     |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-require-one-or-none`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-require-one-or-none)     |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-required-deep`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-required-deep)                 |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-schema`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-schema)                               |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-set-non-nullable`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-set-non-nullable)           |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-set-optional`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-set-optional)                   |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-set-readonly`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-set-readonly)                   |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-set-required`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-set-required)                   |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-simplify`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-simplify)                           |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-tagged-brands`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-tagged-brands)                 |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-tuple-of`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-tuple-of)                           |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-unknown-array`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-unknown-array)                 |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-unknown-map`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-unknown-map)                     |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-unknown-record`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-unknown-record)               |   🔧  | [🟢](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)       |
| [`prefer-type-fest-unknown-set`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-unknown-set)                     |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-unwrap-tagged`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-unwrap-tagged)                 |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-value-of`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-value-of)                           |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-writable`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-writable)                           |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
| [`prefer-type-fest-writable-deep`](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/prefer-type-fest-writable-deep)                 |   🔧  | [🟡](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/all) [💠](https://nick2bad4u.github.io/eslint-plugin-typefest/docs/rules/presets/type-fest-types)                                                                                            |
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
| [`write-good-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments) |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all) |

<<<<<<< HEAD
## Rule options
||||||| 53124b2
## Contributors ✨
=======
## Options
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

<<<<<<< HEAD
### `task-comment-format`
||||||| 53124b2
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
=======
The rule mirrors the upstream `write-good` options:
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

<<<<<<< HEAD
- `terms: string[]` — task markers that should require a descriptive body.
- `minDescriptionLength: number` — minimum non-whitespace description length after optional task metadata.
||||||| 53124b2
[![All Contributors.](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
=======
- `passive`
- `illusion`
- `so`
- `thereIs`
- `weasel`
- `adverb`
- `tooWordy`
- `cliches`
- `eprime`
- `whitelist: string[]`
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

<<<<<<< HEAD
### `write-good-comments`
||||||| 53124b2
<!-- ALL-CONTRIBUTORS-BADGE:END -->
=======
## Ignored comment types
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

<<<<<<< HEAD
This rule mirrors the upstream `write-good` options:
||||||| 53124b2
Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
=======
The rule intentionally ignores tool-control comments such as:
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

<<<<<<< HEAD
- `passive`
- `illusion`
- `so`
- `thereIs`
- `weasel`
- `adverb`
- `tooWordy`
- `cliches`
- `eprime`
- `whitelist: string[]`
||||||| 53124b2
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
=======
- `eslint-disable` directives
- `@ts-ignore`, `@ts-expect-error`, and related TypeScript directives
- similar coverage or tool comments that are not normal prose
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

<<<<<<< HEAD
## Ignored comment types
||||||| 53124b2
<!-- prettier-ignore-start -->
=======
## Documentation
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

<<<<<<< HEAD
The comment-prose rules intentionally ignore tool-control comments such as:

- `eslint-disable` directives
- `@ts-ignore`, `@ts-expect-error`, and related TypeScript directives
- similar coverage or tool comments that are not normal prose

## Documentation

- [Overview](./docs/rules/overview.md)
- [Getting Started](./docs/rules/getting-started.md)
- [Rule docs](./docs/rules/task-comment-format.md)
||||||| 53124b2
<!-- markdownlint-disable -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://github.com/Nick2bad4u"><img src="https://avatars.githubusercontent.com/u/20943337?v=4?s=80" width="80px;" alt="Nick2bad4u"/><br /><sub><b>Nick2bad4u</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-typefest/issues?q=author%3ANick2bad4u" title="Bug reports">🐛</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-typefest/commits?author=Nick2bad4u" title="Code">💻</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-typefest/commits?author=Nick2bad4u" title="Documentation">📖</a> <a href="#ideas-Nick2bad4u" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-Nick2bad4u" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-Nick2bad4u" title="Maintenance">🚧</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-typefest/pulls?q=is%3Apr+reviewed-by%3ANick2bad4u" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-typefest/commits?author=Nick2bad4u" title="Tests">⚠️</a> <a href="#tool-Nick2bad4u" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="25%"><a href="https://snyk.io/"><img src="https://avatars.githubusercontent.com/u/19733683?v=4?s=80" width="80px;" alt="Snyk bot"/><br /><sub><b>Snyk bot</b></sub></a><br /><a href="#security-snyk-bot" title="Security">🛡️</a> <a href="#infra-snyk-bot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-snyk-bot" title="Maintenance">🚧</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-typefest/pulls?q=is%3Apr+reviewed-by%3Asnyk-bot" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="25%"><a href="https://www.stepsecurity.io/"><img src="https://avatars.githubusercontent.com/u/89328645?v=4?s=80" width="80px;" alt="StepSecurity Bot"/><br /><sub><b>StepSecurity Bot</b></sub></a><br /><a href="#security-step-security-bot" title="Security">🛡️</a> <a href="#infra-step-security-bot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-step-security-bot" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="25%"><a href="https://github.com/apps/dependabot"><img src="https://avatars.githubusercontent.com/in/29110?v=4?s=80" width="80px;" alt="dependabot[bot]"/><br /><sub><b>dependabot[bot]</b></sub></a><br /><a href="#infra-dependabot[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#security-dependabot[bot]" title="Security">🛡️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://github.com/apps/github-actions"><img src="https://avatars.githubusercontent.com/in/15368?v=4?s=80" width="80px;" alt="github-actions[bot]"/><br /><sub><b>github-actions[bot]</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-typefest/commits?author=github-actions[bot]" title="Code">💻</a> <a href="#infra-github-actions[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
=======
- [Overview](./docs/rules/overview.md)
- [Getting Started](./docs/rules/getting-started.md)
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
- [Rule docs](./docs/rules/write-good-comments.md)
- [Preset docs](./docs/rules/presets/index.md)
- [Docusaurus site](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/)
