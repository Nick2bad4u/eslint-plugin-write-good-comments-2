# eslint-plugin-write-good-comments-2

> Lint source comments for prose quality, inclusive language, profanity, and task-comment hygiene.

[![npm license.](https://flat.badgen.net/npm/license/eslint-plugin-write-good-comments-2?color=purple)](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/blob/main/LICENSE) [![npm total downloads.](https://flat.badgen.net/npm/dt/eslint-plugin-write-good-comments-2?color=pink)](https://www.npmjs.com/package/eslint-plugin-write-good-comments-2) [![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-write-good-comments-2?color=cyan)](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-write-good-comments-2?color=yellow)](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/Nick2bad4u/eslint-plugin-write-good-comments-2?color=green)](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/forks) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/eslint-plugin-write-good-comments-2?color=red)](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/issues) [![codecov.](https://codecov.io/gh/Nick2bad4u/eslint-plugin-write-good-comments-2/branch/main/graph/badge.svg)](https://codecov.io/gh/Nick2bad4u/eslint-plugin-write-good-comments-2)

`eslint-plugin-write-good-comments-2` checks comment prose in JavaScript and
TypeScript source files. It catches vague phrases, wordy constructions, passive
voice, clichés, optional e-prime violations, potentially inconsiderate
language, profane wording, misspellings, hard-to-read prose, and bare
TODO-style task comments before unclear source documentation reaches review or
production.

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

- `recommended` — best default for almost every project.
- `all` — explicit “everything we ship” preset.

You can also apply the rule manually inside your own scoped config object:

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [
    {
        files: ["src/**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "write-good-comments": writeGoodComments,
        },
        rules: {
            "write-good-comments/inclusive-language-comments": "error",
            "write-good-comments/task-comment-format": "error",
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

| Rule                                                                                                                                     | Fix | Preset key                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`inclusive-language-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/inclusive-language-comments) |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all) |
| [`no-profane-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/no-profane-comments)                 |  —  | [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all)                                                                                                       |
| [`readability-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/readability-comments)               |  —  | [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all)                                                                                                       |
| [`spellcheck-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/spellcheck-comments)                 |  —  | [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all)                                                                                                       |
| [`task-comment-format`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/task-comment-format)                 |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all) |
| [`write-good-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments)                 |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all) |

## Rule options

### `inclusive-language-comments`

- `allow: string[]` — `retext-equality` rule ids to suppress for this rule.
- `deny: string[]` — `retext-equality` rule ids to report exclusively.
- `noBinary: boolean` — report binary pairings such as `his or her`.

### `no-profane-comments`

- `allow: string[]` — `retext-profanities` rule ids to suppress for this rule.
- `deny: string[]` — `retext-profanities` rule ids to report exclusively.
- `profanitySureness: 0 | 1 | 2` — minimum profanity confidence to report.

### `spellcheck-comments`

- `ignoreWords: string[]` — repository-specific terms to accept.
- `ignoreDigits: boolean` — ignore words containing digits.
- `ignoreLiteral: boolean` — ignore quoted literals.
- `maxSuggestions: number` — maximum spelling candidates to include.
- `normalizeApostrophes: boolean` — normalize curly and straight apostrophes.

### `readability-comments`

- `age: number` — target reader age for the readability model.
- `minWords: number` — minimum sentence length before analysis applies.
- `threshold: number` — maximum difficult-word ratio before reporting.

### `task-comment-format`

- `terms: string[]` — task markers that should require a descriptive body.
- `minDescriptionLength: number` — minimum non-whitespace description length after optional task metadata.

### `write-good-comments`

This rule mirrors the upstream `write-good` options:

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

The comment-prose rules intentionally ignore tool-control comments such as:

- `eslint-disable` directives
- `@ts-ignore`, `@ts-expect-error`, and related TypeScript directives
- similar coverage or tool comments that are not normal prose

## Documentation

- [Overview](./docs/rules/overview.md)
- [Getting Started](./docs/rules/getting-started.md)
- [Rule docs](./docs/rules/inclusive-language-comments.md)
- [Rule docs](./docs/rules/no-profane-comments.md)
- [Rule docs](./docs/rules/task-comment-format.md)
- [Rule docs](./docs/rules/write-good-comments.md)
- [Preset docs](./docs/rules/presets/index.md)
- [Docusaurus site](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/)
