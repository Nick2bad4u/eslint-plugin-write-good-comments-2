---
title: task-comment-format
description: Require TODO-style task comments to include a descriptive body.
---

# task-comment-format

## Targeted pattern scope

This rule checks TODO-style task comments that start with markers such as
`TODO`, `FIXME`, `XXX`, or `HACK`.

It applies to line comments, block comments, and JSDoc-style comment text after
block-comment decoration is normalized. Tool-control comments such as
`eslint-disable` and TypeScript suppression comments are ignored.

## What this rule reports

This rule reports task comments that stop at the marker or only contain metadata
such as an owner, handle, or issue reference without any descriptive prose.

By default, comments like `TODO`, `FIXME:`, `HACK (legacy)`, or
`TODO [#123]` are invalid because they record that something is wrong without
explaining what should happen next.

## Why this rule exists

Bare task comments create maintenance debt. They signal unfinished work, but
they do not tell future readers what needs to change or why the task still
matters.

Requiring a short descriptive body makes task comments more actionable during
code review, easier to search for later, and less likely to become permanent
noise.

## ❌ Incorrect

```ts
// TODO
startServer();
```

```ts
// FIXME:
retryRequest();
```

```ts
/* HACK (legacy) */
enableFallback();
```

## ✅ Correct

```ts
// TODO: remove the temporary fallback after the API v2 rollout.
startServer();
```

```ts
// FIXME(jane): handle null input from the partner API.
retryRequest();
```

```ts
/* HACK [PROJ-123]: keep this branch until the cache bug is fixed upstream. */
enableFallback();
```

## Behavior and migration notes

- The rule is **report only**. It does not rewrite task comments for you.
- Optional metadata such as `(owner)`, `[issue]`, `@handle`, or `#123` is
  allowed, but metadata alone is not enough.
- The default markers are `TODO`, `FIXME`, `XXX`, and `HACK`.
- Directive comments such as `// eslint-disable-next-line ...` are ignored.

## Additional examples

Customize the accepted task markers and minimum description length:

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [
    {
        plugins: {
            "write-good-comments": writeGoodComments,
        },
        rules: {
            "write-good-comments/task-comment-format": [
                "error",
                {
                    minDescriptionLength: 12,
                    terms: ["TODO", "NOTE"],
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
            "write-good-comments/task-comment-format": "error",
        },
    },
];
```

## When not to use it

Do not use this rule if your team bans TODO-style comments entirely with a rule
such as `eslint/no-warning-comments` or if all follow-up work must live only in
an external issue tracker.

If your team keeps task comments, this rule works best when you want them to be
descriptive instead of bare markers.

## Package documentation

This rule complements related task-comment tooling:

- [ESLint `no-warning-comments`](https://eslint.org/docs/latest/rules/no-warning-comments)
- [Unicorn `expiring-todo-comments`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/expiring-todo-comments.md)

> **Rule catalog ID:** R002

## Further reading

- [Plugin overview](./overview.md)
- [Getting Started](./getting-started.md)
- [Recommended preset](./presets/recommended.md)
