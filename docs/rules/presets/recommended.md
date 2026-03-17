---
title: Recommended preset
---

# 🟡 Recommended

Use this as the default preset for most projects.

## Config key

```ts
writeGoodComments.configs.recommended
```

## Flat Config example

```ts
import writeGoodComments from "eslint-plugin-write-good-comments";

export default [writeGoodComments.configs.recommended];
```

This preset enables every currently shipped rule and is the recommended default
for general use.

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule                                                                                                                     | Fix |
| ------------------------------------------------------------------------------------------------------------------------ | :-: |
| [`write-good-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments) |  —  |
