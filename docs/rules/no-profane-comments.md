---
title: no-profane-comments
description: Disallow profane wording in source comments.
---

# no-profane-comments

Disallow profane wording in source comments.

## Targeted pattern scope

This rule checks normal source comments with [`alex`](https://alexjs.com/) for
profane or vulgar wording backed by `retext-profanities`.

It applies to line comments, block comments, and JSDoc-style comment text after
block-comment decoration is normalized. Tool-control comments such as
`eslint-disable` and TypeScript suppression comments are ignored.

## What this rule reports

This rule reports comment prose that `alex` considers profane or vulgar.

By default, it includes lower-sureness matches as well, which means mildly
risky words can still be reported when the upstream data marks them as profane
in some contexts.

## Why this rule exists

Profane comments usually do not improve technical documentation. More often,
they add frustration, reduce professionalism, and make comment text harder to
reuse in logs, docs, or support channels.

Reporting this wording keeps inline documentation easier to share and helps
teams avoid normalizing hostile or low-signal commentary in the codebase.

## ❌ Incorrect

```ts
// This fallback is a pain in the butt.
useFallback();
```

```ts
/* slave replicas still follow the leader node. */
connect();
```

## ✅ Correct

```ts
// This fallback is still frustrating to maintain.
useFallback();
```

```ts
/* Secondary replicas still follow the leader node. */
connect();
```

## Behavior and migration notes

- The rule is **report only**. It does not auto-rewrite comment wording.
- Markdown code spans such as `` `slave` `` are ignored by the alex markdown
  parser, which helps avoid reports on literal identifiers.
- Use `profanitySureness` to ignore low-confidence matches when the default is
  too noisy for your repository.
- This rule is a stricter style choice, so keeping it in an explicit `all` preset is often a better default than enabling it in every recommended rollout.

## Additional examples

Raise the minimum sureness and allow one known legacy term temporarily:

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [
    {
        plugins: {
            "write-good-comments": writeGoodComments,
        },
        rules: {
            "write-good-comments/no-profane-comments": [
                "error",
                {
                    allow: ["slave"],
                    profanitySureness: 1,
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
            "write-good-comments/no-profane-comments": "error",
        },
    },
];
```

## When not to use it

Do not use this rule if your team intentionally allows coarse internal tone in
comments or if your repository contains domain terms that the upstream
profanity data flags even though they are required in context.

If you still want the rule but only for high-confidence matches, keep it enabled
with a stricter `profanitySureness` instead of disabling it outright.

## Package documentation

This rule wraps alex’s profanity analysis:

- [alex](https://alexjs.com/)
- [alex package reference](https://www.npmjs.com/package/alex)
- [retext-profanities](https://www.npmjs.com/package/retext-profanities)

> **Rule catalog ID:** R004

## Further reading

- [Plugin overview](./overview.md)
- [Getting Started](./getting-started.md)
- [retext-profanities](https://github.com/retextjs/retext-profanities)
