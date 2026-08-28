---
title: write-good-comments
description: Check source comments with write-good and report low-quality prose.
---

# write-good-comments

## Targeted pattern scope

This rule checks regular line comments, block comments, and JSDoc-style comment
text with [`write-good`](https://github.com/btford/write-good).

Ordinary line and block comments are analyzed in full. For JSDoc, only the
leading description before the first block tag is analyzed. The complete block
tag section—including tag descriptions and continuation lines—is ignored.
Inline JSDoc tags such as `{@link Thing}` remain part of the leading description
and do not start the ignored block-tag section.

It uses the plugin's markdown-aware projection, so code spans, fenced code, and
link destinations are not passed to `write-good`. It also skips common
structural comments such as shebangs, compiler and linter directives, bundler
annotations, source-map pragmas, region markers, and preserved legal comments.

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
- JSDoc decoration (`*`) and the block-tag section are ignored for analysis, so
  the rule lints only the leading prose instead of documentation structure.
- Markdown code and structural tool-control comments such as
  `// eslint-disable-next-line ...` are ignored.

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
import writeGoodComments from "eslint-plugin-write-good-comments-2";

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
