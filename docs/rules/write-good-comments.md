---
title: write-good-comments
description: Check source comments with write-good and report low-quality prose.
---

# write-good-comments

## Targeted pattern scope

This rule checks regular line comments, block comments, and JSDoc-style comment
text with [`write-good`](https://github.com/btford/write-good).

It automatically skips common directive comments such as ESLint disables,
TypeScript `@ts-` directives, and similar tool-control comments that should not
be linted as prose.

## What this rule reports

The rule reports prose that `write-good` considers weak, vague, repetitive, or
needlessly wordy. That includes phrases like `In order to`, some adverbs,
clichés, passive voice, and optional `e-prime` violations.

## Why this rule exists

Comments are documentation. When they become vague or bloated, they make code
harder to maintain. This rule gives teams a lightweight, automated nudge toward
clearer comment writing without trying to be a full grammar checker.

## ❌ Incorrect

```ts
// In order to handle this edge case, we basically just try again.
retry();
```

```ts
/*
 * It is important to note that this function is very unique.
 */
runTask();
```

## ✅ Correct

```ts
// Retry once for this edge case.
retry();
```

```ts
/**
 * Run the task once after validation succeeds.
 */
runTask();
```

## Behavior and migration notes

- The rule is **report only**. It does not autofix comment prose.
- It preserves precise source locations by linting normalized comment text while
  keeping offsets aligned with the original comment source.
- JSDoc decoration (`*`) is ignored for analysis, so the rule lints the prose
  instead of the formatting characters.
- Directive comments such as `// eslint-disable-next-line ...` are ignored.

## Additional examples

Enable upstream checks selectively:

```ts
export default [
    {
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

## ESLint flat config example

```ts
import writeGoodComments from "eslint-plugin-write-good-comments";

export default [
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "write-good-comments": writeGoodComments,
        },
        rules: {
            "write-good-comments/write-good-comments": "error",
        },
    },
];
```

## When not to use it

Do not use this rule when a project intentionally keeps comments terse
or when the team prefers a looser, editor-only prose linting workflow.

If the defaults are too noisy, keep the rule and disable individual upstream
checks before turning the rule off entirely.

## Package documentation

Upstream package documentation:

- [`write-good` README](https://github.com/btford/write-good)

Supported options mirror the upstream package:

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

> **Rule catalog ID:** R001

## Further reading

- [Plugin overview](./overview.md)
- [Getting Started](./getting-started.md)
- [Recommended preset](./presets/recommended.md)
