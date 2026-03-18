---
title: spellcheck-comments
description: Spellcheck source comments with retext-spell and a curated technical vocabulary.
---

# spellcheck-comments

## Targeted pattern scope

This rule checks regular line comments, block comments, and JSDoc-style comment
text with [`retext-spell`](https://github.com/retextjs/retext-spell).

It uses the plugin's markdown-aware comment projection layer, so inline code spans
such as `` `eslint.config.mjs` `` are ignored instead of being spellchecked as
normal prose. Directive comments such as `eslint-disable` and TypeScript
suppression comments are also skipped.

## What this rule reports

The rule reports words that are unknown to the English dictionary plus the
plugin's built-in technical vocabulary.

That means normal prose typos such as `documeant` or `incorect` are reported,
while common engineering terms such as `eslint`, `repo`, `tsconfig`, and
`retext` are accepted by default.

## Why this rule exists

Typos in comments make documentation look less trustworthy and harder to skim.
A lightweight comment-only spellcheck catches those mistakes before they spread
through code review, generated docs, or copied snippets.

## ❌ Incorrect

```ts
// This documeant stays incorect after review.
publish();
```

```ts
/**
 * Keep this changelog entry acurate and searchable.
 */
save();
```

## ✅ Correct

```ts
// This document stays correct after review.
publish();
```

```ts
/**
 * Keep this changelog entry accurate and searchable.
 */
save();
```

## Behavior and migration notes

- The rule is **report only**. It does not rewrite comment text for you.
- A curated built-in technical vocabulary suppresses common development terms
  that would otherwise be noisy under a plain English dictionary.
- Use `ignoreWords` to add repository-specific jargon, abbreviations, or product
  names.
- This rule is intentionally kept out of the `recommended` preset because
  spellchecking tends to be more repository-specific than prose quality or task
  hygiene.

## Additional examples

Accept local product names and limit each report to three candidates:

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [
    {
        plugins: {
            "write-good-comments": writeGoodComments,
        },
        rules: {
            "write-good-comments/spellcheck-comments": [
                "error",
                {
                    ignoreWords: ["AcmeCloud", "Synclet"],
                    maxSuggestions: 3,
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
            "write-good-comments/spellcheck-comments": "error",
        },
    },
];
```

## When not to use it

Do not use this rule when your repository relies heavily on rapidly changing
domain language and the team is unwilling to maintain an allowlist of accepted
terms.

If the rule is useful but specific terms are noisy, prefer `ignoreWords`
over disabling the rule entirely.

## Package documentation

Upstream package documentation:

- [`retext-spell`](https://github.com/retextjs/retext-spell)
- [`dictionary-en`](https://github.com/wooorm/dictionaries/tree/main/dictionaries/en)

> **Rule catalog ID:** R005

## Further reading

- [Plugin overview](./overview.md)
- [Getting Started](./getting-started.md)
- [All preset](./presets/all.md)
