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

If you prefer to apply the rule inside your own file-scoped config object,
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
2. Fix noisy or unclear comments in small batches.
3. Use per-rule options to disable individual `write-good` checks if a team has
   strong local conventions.
4. Switch to `all` only if you want the explicit “everything we ship” preset for
   future expansion.
