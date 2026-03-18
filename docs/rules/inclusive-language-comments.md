---
title: inclusive-language-comments
description: Require source comments to avoid exclusionary or inconsiderate language.
---

# inclusive-language-comments

Require source comments to avoid exclusionary or inconsiderate language.

## Targeted pattern scope

This rule checks normal source comments with [`alex`](https://alexjs.com/) for
inclusive-language issues backed by `retext-equality`.

It applies to line comments, block comments, and JSDoc-style comment text after
block-comment decoration is normalized. Tool-control comments such as
`eslint-disable` and TypeScript suppression comments are ignored.

## What this rule reports

This rule reports comment prose that uses wording `alex` considers potentially
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
- Markdown code spans such as `` `master` `` are ignored by the alex markdown
  parser, which helps avoid reports on literal identifiers.
- Quoted literal words may also be ignored when alex treats them as literal
  text rather than normal prose.
- The `noBinary` option is off by default, so phrases such as `his or her` are
  only reported when you opt in.

## Additional examples

Customize the alex equality filters and enable binary-language checks:

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

This rule wraps alex’s inclusive-language analysis:

- [alex](https://alexjs.com/)
- [alex package reference](https://www.npmjs.com/package/alex)
- [retext-equality](https://www.npmjs.com/package/retext-equality)

> **Rule catalog ID:** R003

## Further reading

- [Plugin overview](./overview.md)
- [Getting Started](./getting-started.md)
- [alex further reading](https://alexjs.com/#further-reading)
