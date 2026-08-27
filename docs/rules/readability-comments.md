---
title: readability-comments
description: Flag source comments that are hard to read with retext-readability.
---

# readability-comments

## Targeted pattern scope

This rule checks regular line comments, block comments, and JSDoc-style comment
text with [`retext-readability`](https://github.com/retextjs/retext-readability).

Ordinary line and block comments are analyzed in full. For JSDoc, only the
leading description before the first block tag is analyzed. The complete block
tag section—including tag descriptions and continuation lines—is ignored.
Inline JSDoc tags such as `{@link Thing}` remain part of the leading description
and do not start the ignored block-tag section.

It uses the same markdown-aware comment projection layer as the other prose
rules, so markdown code spans and tool-control comments are ignored before the
readability analysis runs.

## What this rule reports

The rule reports comment sentences that are difficult to read for the configured
target age and difficulty threshold.

In practice, that usually means long, abstract, jargon-heavy sentences that are
hard to parse during a quick maintenance pass.

## Why this rule exists

Comments should help maintainers move faster, not force them to decode dense
prose. This rule highlights the worst readability outliers so teams can keep
inline documentation direct and scannable.

## ❌ Incorrect

```ts
// This comment intentionally accumulates several unnecessarily abstract clauses so the guidance becomes much harder to parse during a quick maintenance pass.
review();
```

```ts
/**
 * This explanation deliberately layers several overly abstract phrases so
 * future maintainers must decode the sentence instead of scanning it.
 */
runTask();
```

## ✅ Correct

```ts
// Keep the fallback path small and easy to review.
review();
```

```ts
/**
 * Run the task once after validation succeeds.
 */
runTask();
```

## Behavior and migration notes

- The rule is **report only**. It does not rewrite comment text.
- `age`, `minWords`, and `threshold` let teams decide how strict readability
  checks should be.
- Short comments are naturally less likely to be reported, and `minWords` can
  raise that floor further.
- This rule stays out of the `recommended` preset because readability scoring
  is stricter and more subjective than the plugin's baseline prose checks.

## Additional examples

Only analyze longer explanatory comments:

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [
 {
  plugins: {
   "write-good-comments": writeGoodComments,
  },
  rules: {
   "write-good-comments/readability-comments": [
    "error",
    {
     age: 18,
     minWords: 12,
     threshold: 0.7,
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
   "write-good-comments/readability-comments": "error",
  },
 },
];
```

## When not to use it

Do not use this rule when your team prefers to judge readability manually or
when the codebase contains required comments with highly specialized,
jargon-dense prose.

If you like the rule in principle but want fewer reports, raise `age`,
`minWords`, or `threshold` before disabling it.

## Package documentation

Upstream package documentation:

- [`retext-readability`](https://github.com/retextjs/retext-readability)

> **Rule catalog ID:** R006

## Further reading

- [Plugin overview](./overview.md)
- [Getting Started](./getting-started.md)
- [All preset](./presets/all.md)
