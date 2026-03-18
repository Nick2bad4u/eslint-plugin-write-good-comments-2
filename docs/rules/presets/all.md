---
title: All preset
---

# 🟣 All

Use this when you want the full plugin surface, including spellcheck,
readability, and profanity checks.

## Config key

```ts
writeGoodComments.configs.all
```

## Flat Config example

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [writeGoodComments.configs.all];
```

This preset includes every rule the plugin currently ships, including the
stricter opt-in rules that stay out of `recommended` to keep the default rollout
lower-noise.

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule                                                                                                                                     | Fix |
| ---------------------------------------------------------------------------------------------------------------------------------------- | :-: |
| [`inclusive-language-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/inclusive-language-comments) |  —  |
| [`no-profane-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/no-profane-comments)                 |  —  |
| [`readability-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/readability-comments)               |  —  |
| [`spellcheck-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/spellcheck-comments)                 |  —  |
| [`task-comment-format`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/task-comment-format)                 |  —  |
| [`write-good-comments`](https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments)                 |  —  |
