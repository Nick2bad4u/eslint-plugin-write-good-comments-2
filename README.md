# eslint-plugin-write-good-comments

> Lint source comments with [`write-good`](https://github.com/btford/write-good).

[![CI.](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/actions/workflows/ci.yml)
[![codecov.](https://codecov.io/gh/Nick2bad4u/eslint-plugin-write-good-comments-2/branch/main/graph/badge.svg)](https://codecov.io/gh/Nick2bad4u/eslint-plugin-write-good-comments-2)
[![npm version.](https://img.shields.io/npm/v/eslint-plugin-write-good-comments.svg)](https://www.npmjs.com/package/eslint-plugin-write-good-comments)

`eslint-plugin-write-good-comments` checks comment prose in JavaScript and
TypeScript source files. It catches vague phrases, wordy constructions, passive
voice, clichés, and optional e-prime violations before unclear comments reach
review or production.

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

- `recommended` — best default for almost every project.
- `all` — explicit “everything we ship” preset.

You can also apply the rule manually inside your own scoped config object:

```ts
import writeGoodComments from "eslint-plugin-write-good-comments";

export default [
    {
        files: ["src/**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "write-good-comments": writeGoodComments,
        },
        rules: {
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
| [`write-good-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments) |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all) |

## Options

The rule mirrors the upstream `write-good` options:

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

## Ignored comment types

The rule intentionally ignores tool-control comments such as:

- `eslint-disable` directives
- `@ts-ignore`, `@ts-expect-error`, and related TypeScript directives
- similar coverage or tool comments that are not normal prose

## Documentation

- [Overview](./docs/rules/overview.md)
- [Getting Started](./docs/rules/getting-started.md)
- [Rule docs](./docs/rules/write-good-comments.md)
- [Preset docs](./docs/rules/presets/index.md)
- [Docusaurus site](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/)
