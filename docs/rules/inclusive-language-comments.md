---
title: inclusive-language-comments
description: Require source comments to avoid exclusionary or inconsiderate language.
---

# inclusive-language-comments

Require source comments to avoid exclusionary or inconsiderate language.

## Targeted pattern scope

This rule checks normal source comments for inclusive-language issues backed directly by
[`retext-equality`](https://github.com/retextjs/retext-equality).

It applies to line comments, block comments, and JSDoc-style comment text after
block-comment decoration is normalized. Tool-control comments such as
`eslint-disable` and TypeScript suppression comments are ignored.

## What this rule reports

This rule reports comment prose that `retext-equality` considers potentially
insensitive, exclusionary, or otherwise inconsiderate.

Typical reports include legacy terms such as `master`, gendered pronouns used
for a generic person, and similar phrases that have clearer or more inclusive
alternatives.

## Why this rule exists

Code comments are documentation. If the wording in that documentation is dated,
exclusionary, or casually inconsiderate, the comment becomes harder to share,
review, and trust.

Catching these phrases early gives teams a concrete chance to choose language
that is clearer and more welcoming without waiting for a manual documentation
pass.

## ❌ Incorrect

```ts
// Use the master branch until the rename lands.
release();
```

```ts
// If a user changes his or her password, send a receipt.
sendReceipt();
```

## ✅ Correct

```ts
// Use the primary branch until the rename lands.
release();
```

```ts
// If a user changes their password, send a receipt.
sendReceipt();
```

## Behavior and migration notes

- The rule is **report only**. It does not auto-rewrite language for you.
- Markdown code spans such as `` `master` `` are ignored by the plugin's markdown-aware comment projection layer, which avoids reports on literal identifiers.
- Quoted literal words can also be skipped when `retext-equality` treats them as literals instead of normal prose.
- The `noBinary` option is off by default, so phrases such as `his or her` are
  only reported when you opt in.

## Additional examples

Customize the equality filters and enable binary-language checks:

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [
 {
  plugins: {
   "write-good-comments": writeGoodComments,
  },
  rules: {
   "write-good-comments/inclusive-language-comments": [
    "error",
    {
     allow: ["master"],
     noBinary: true,
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
   "write-good-comments/inclusive-language-comments": "error",
  },
 },
];
```

## When not to use it

Do not use this rule if your team deliberately mirrors external terminology in
comments exactly as published and prefers to review inclusive-language concerns
manually.

You may also skip it if your repository contains historical quotations or
third-party excerpts where preserving original wording matters more than
normalizing comment prose.

## Package documentation

This rule wraps direct `retext-equality` analysis:

- [`retext-equality`](https://github.com/retextjs/retext-equality)

> **Rule catalog ID:** R003

## Further reading

- [Plugin overview](./overview.md)
- [Getting Started](./getting-started.md)
- [Recommended preset](./presets/recommended.md)
