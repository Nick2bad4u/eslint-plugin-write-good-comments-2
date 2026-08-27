---
title: spellcheck-comments
description: Spellcheck source comments with cspell dictionaries and a curated coding vocabulary.
---

# spellcheck-comments

## Targeted pattern scope

This rule checks regular line comments, block comments, and JSDoc-style comment
text with [`cspell`](https://cspell.org/) dictionaries.

Ordinary line and block comments are analyzed in full. For JSDoc, only the
leading description before the first block tag is analyzed. The complete block
tag section—including tag descriptions and continuation lines—is ignored.
Inline JSDoc tags such as `{@link Thing}` remain part of the leading description
and do not start the ignored block-tag section.

It uses the plugin's markdown-aware comment projection layer, so inline code spans
such as `` `eslint.config.mjs` `` are ignored instead of being spellchecked as
normal prose. Directive comments such as `eslint-disable` and TypeScript
suppression comments are also skipped.

## What this rule reports

The rule reports words that are unknown, misspelled, or explicitly flagged by
the imported cspell dictionaries plus the plugin's built-in technical
vocabulary.

That means normal prose typos such as `documeant` or `incorect` are reported,
while common engineering terms such as `eslint`, `repo`, `tsconfig`, and
`Node.js` are accepted by default.

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
- Built-in cspell imports cover American English, common misspellings, British/Commonwealth English variants, and a broad set of coding dictionaries such as Bash, CSS, Git, HTML, Makefile, MIME types, mnemonics, Node.js, npm, PowerShell, public licenses, scientific terms, shell, software terms, SQL, TypeScript, and Win32 terminology.
- Use `ignoreWords` to add repository-specific jargon, abbreviations, or product names inline in ESLint config.
- Use `ignoreWordFiles` to load accepted words from cspell-style dictionary text files instead of copying a long allowlist into your ESLint config.
- Use `cspellConfigImports` to import extra cspell dictionary packages or local cspell config files.
- The three dictionary-related options expect different formats:
  - `ignoreWords`: a plain array of accepted tokens written directly in ESLint config.
  - `ignoreWordFiles`: an array of file paths to cspell-style word lists, resolved from the repository root when ESLint runs.
  - `cspellConfigImports`: an array of cspell config imports, either local config files such as `"./cspell.json"` / `"./config/cspell/project-terms.yaml"` or package dictionary entrypoints such as `"@cspell/dict-rust/cspell-ext.json"`.
- No safe "only spellcheck known words" mode exists. Unknown words are exactly where real typos and repository-specific terms overlap, so extend the accepted vocabulary instead of suppressing all unknowns.
- This rule is intentionally kept out of the `recommended` preset because
  spellchecking tends to be more repository-specific than prose quality or task
  hygiene.

## Additional examples

Rule option shape and defaults:

```ts
type SpellcheckCommentsOptions = {
 cspellConfigImports?: readonly string[];
 ignoreDigits?: boolean;
 ignoreLiteral?: boolean;
 ignoreWordFiles?: readonly string[];
 ignoreWords?: readonly string[];
 maxSuggestions?: number;
 normalizeApostrophes?: boolean;
 useDefaultDictionaries?: boolean;
};

const defaults = {
 cspellConfigImports: [],
 ignoreDigits: true,
 ignoreLiteral: true,
 ignoreWordFiles: [],
 ignoreWords: [],
 maxSuggestions: 5,
 normalizeApostrophes: true,
 useDefaultDictionaries: true,
};
```

For `ignoreWordFiles`, use normal cspell word-list formatting:

```txt
AcmeCloud
Synclet
WriteGoodComments
```

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

Load repository vocabulary from a cspell-style word list file:

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
     ignoreWordFiles: ["./config/cspell/project-words.txt"],
    },
   ],
  },
 },
];
```

Import an additional cspell package dictionary for repository-specific terms:

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
     cspellConfigImports: ["@cspell/dict-rust/cspell-ext.json"],
    },
   ],
  },
 },
];
```

Import a local cspell config file that already groups project-specific dictionaries:

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
     cspellConfigImports: ["./config/cspell/project-terms.yaml"],
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

- [`cspell`](https://cspell.org/)
- [`cspell-lib`](https://www.npmjs.com/package/cspell-lib)

> **Rule catalog ID:** R005

## Further reading

- [Plugin overview](./overview.md)
- [Getting Started](./getting-started.md)
- [All preset](./presets/all.md)
