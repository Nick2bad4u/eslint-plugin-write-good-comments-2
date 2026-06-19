---
title: Recommended preset
---

# 🟡 Recommended

Use this as the default preset for most projects that want better source
comments without enabling every stricter optional check on day one.

## Config key

```ts
writeGoodComments.configs.recommended;
```

## Flat Config example

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [writeGoodComments.configs.recommended];
```

This preset enables the lowest-noise baseline rules: prose quality,
descriptive task comments, and inclusive-language checks.

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule                                                                                                                                     | Fix |
| ---------------------------------------------------------------------------------------------------------------------------------------- | :-: |
| [`inclusive-language-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/inclusive-language-comments) |  —  |
| [`task-comment-format`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/task-comment-format)                 |  —  |
| [`write-good-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments)                 |  —  |
