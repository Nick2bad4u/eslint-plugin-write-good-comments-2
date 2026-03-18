---
title: Getting Started
description: Enable eslint-plugin-write-good-comments-2 quickly in Flat Config.
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-write-good-comments-2
```

Enable one preset in your Flat Config:

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [writeGoodComments.configs.recommended];
```

## Alternative: manual scoped setup

If you prefer to apply the plugin inside your own file-scoped config object,
spread the preset rules manually.

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [
    {
        files: ["src/**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "write-good-comments": writeGoodComments,
        },
        rules: {
            ...writeGoodComments.configs.recommended.rules,
        },
    },
];
```

## Recommended rollout

1. Start with `recommended`.
2. Fix noisy prose comments, inclusive-language reports, and bare TODO-style task comments in small batches.
3. Use per-rule options to disable individual `write-good` checks, tune retext-based language filters, or customize the `task-comment-format` markers when a team has strong local conventions.
4. Switch to `all` when you also want stricter extras such as `no-profane-comments`, `spellcheck-comments`, and `readability-comments`.
