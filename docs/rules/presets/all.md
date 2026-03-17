---
title: All preset
---

# 🟣 All

Use this when you want an explicit “everything this plugin ships” preset.

## Config key

```ts
writeGoodComments.configs.all
```

## Flat Config example

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [writeGoodComments.configs.all];
```

Today this preset matches `recommended`, but it exists as the stable catch-all
preset if new non-recommended rules are added later.

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule                                                                                                                     | Fix |
| ------------------------------------------------------------------------------------------------------------------------ | :-: |
| [`write-good-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments) |  —  |
