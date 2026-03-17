---
name: "Copilot-Instructions-ESLint-Docs"
description: "Instructions for writing perfect ESLint rule documentation."
applyTo: "docs/**"
---

<instructions>
  <goal>

## Your Goal for ESLint Rule Documentation

- Your goal is to make every ESLint rule documentation file (`docs/rules/<rule-id>.md`) totally self-contained, allowing a developer to understand *why* the rule exists, *what* it flags, and *how* to fix it without looking at the source code.
- For adjacent docs in `docs/rules/` such as guides, preset pages, `overview.md`, or `getting-started.md`, keep the same tone and accuracy standards, but do not force rule-only sections where they do not fit.
- You adhere strictly to the `typescript-eslint` and standard ESLint documentation style guides.

  </goal>

  <structure>

## Documentation Structure

Rule documentation files in `docs/rules/<rule-id>.md` should follow this structure closely:

1.  **Title:** The bare rule ID as the H1 header (e.g., `# write-good-comments`).
2.  **Description:** A short, one-sentence description of what the rule does.
3.  **Meta Badges (Optional):** Badges for `Recommended`, `Fixable`, or `Type Checked` only if the repository’s current docs pattern uses them.
4.  **Rule Details:** An explanation of the problem the rule solves. Why is this pattern bad?
5.  **Examples:**
    - Use `❌ Incorrect` and `✅ Correct` headers.
    - **Crucial:** Always include code blocks with specific comments explaining *why* a line is incorrect.
    - If the rule is configurable, show examples for different configurations.
6.  **Options (if applicable):**
    - A TypeScript interface definition of the options object.
    - Default values clearly marked.
    - Examples for each option.
7.  **When Not To Use It:** specific scenarios where disabling this rule is acceptable.
8.  **Further Reading:** Links to MDN, TypeScript docs, or relevant specs.

  </structure>

  <style>

## Style & Tone

- **Voice:** Professional, objective, and helpful. Avoid slang.
- **Clarity:** Use active voice. "This rule reports..." instead of "This rule is used to report...".
- **Code Blocks:**
  - Always tag code blocks with `ts` or `tsx` (since this is a TypeScript plugin).
  - Use `// eslint-disable-next-line` or specific comments in examples only if necessary to clarify context, but usually, just show the raw code that triggers the error.
- **Configuration:**
  - Assume **Flat Config** (`eslint.config.mjs`) for all configuration examples.
  - Do not use legacy `.eslintrc` JSON snippets.

  </style>

  <guidelines>

## Writing Guidelines

- **The "Why":** Never just say "Don't do X." Explain the consequence.
  - *Bad:* "Don't use `any`."
  - *Good:* "Using `any` bypasses the TypeScript type checker, which can lead to runtime errors that strict typing would otherwise catch."
- **The "Fix":** If the rule is `fixable`, explicitly state what the auto-fixer does (e.g., "The auto-fixer will replace `var` with `let`.").
- **Type Information:** If the rule requires type information (`parserServices`), add a specific note at the top of the docs:
  > ⚠️ This rule requires type information to run. It will not work without `projectService` (or equivalent typed parser setup) configured.
- **Preset awareness:** Repository presets such as `write-good-comments.configs.recommended` and `write-good-comments.configs.all` already wire the plugin for you; do not imply that users must always configure it manually.
- **Consistency:** Ensure the examples actually trigger the rule. Do not use hypothetical examples that strictly wouldn't fail the specific AST selector of the rule.

  </guidelines>

  <examples>

## Example Doc

```markdown
# write-good-comments

Run [`write-good`](https://github.com/btford/write-good) against source comments.

## Targeted pattern scope

This rule focuses on prose quality issues in line comments, block comments, and JSDoc text while ignoring directive-style comments such as ESLint and TypeScript suppressions.

## What this rule reports

This rule reports comment text that `write-good` considers unclear, overly wordy, passive, clichéd, or otherwise weak.

## Why this rule exists

Weak comments are harder to maintain because they are often vague, repetitive, or noisy. Catching comment-quality issues early keeps inline documentation concise and easier to trust.

## ❌ Incorrect

```ts
// This is very very obviously basically bad.
export const value = 1;
```

## ✅ Correct

```ts
// Keep comments short and precise.
export const value = 1;
```

## Behavior and migration notes

- Directive comments such as `// eslint-disable-next-line` are ignored.
- Block-comment decoration like leading `*` in JSDoc is normalized before linting.
- Use the `whitelist` option for product names or domain-specific terms.

## Additional examples

### ❌ Incorrect — Additional example

```ts
// There is a way to do this, basically.
export const warning = true;
```

### ✅ Correct — Additional example

```ts
// Prefer direct, concrete comments.
export const warning = true;
```

### ✅ Correct — Repository-wide usage

```ts
// eslint-disable-next-line no-console
console.log("ok");
```

## ESLint flat config example

```ts
<<<<<<< HEAD
import writeGoodComments from "eslint-plugin-write-good-comments-2";
||||||| 53124b2
import typefest from "eslint-plugin-typefest";
=======
import writeGoodComments from "eslint-plugin-write-good-comments";
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

export default [
    {
        plugins: { "write-good-comments": writeGoodComments },
        rules: {
          "write-good-comments/write-good-comments": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your team intentionally allows free-form prose in comments or prefers to review comment quality manually.

## Package documentation

write-good package documentation:

- [`write-good` README](https://github.com/btford/write-good)
- [`write-good` package reference](https://www.npmjs.com/package/write-good)

> **Rule catalog ID:** R001

## Further reading

- [`write-good` README](https://github.com/btford/write-good)
- [ESLint custom rule docs](https://eslint.org/docs/latest/extend/custom-rules)
- [JSDoc reference](https://jsdoc.app/)

## Adoption resources

- [Rule overview](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/overview)
- [Getting started](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/getting-started)

```

  </examples>
</instructions>
