---
title: Getting Started
<<<<<<< HEAD
description: Enable eslint-plugin-write-good-comments-2 quickly in Flat Config.
||||||| 53124b2
description: Enable eslint-plugin-typefest quickly in Flat Config.
=======
description: Enable eslint-plugin-write-good-comments quickly in Flat Config.
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
---

# Getting Started

Install the plugin:

```bash
<<<<<<< HEAD
npm install --save-dev eslint-plugin-write-good-comments-2
||||||| 53124b2
npm install --save-dev eslint-plugin-typefest typescript
=======
npm install --save-dev eslint-plugin-write-good-comments
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
```

Enable one preset in your Flat Config:

```ts
<<<<<<< HEAD
import writeGoodComments from "eslint-plugin-write-good-comments-2";
||||||| 53124b2
import typefest from "eslint-plugin-typefest";
=======
import writeGoodComments from "eslint-plugin-write-good-comments";
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

export default [writeGoodComments.configs.recommended];
```

## Alternative: manual scoped setup

If you prefer to apply the rule inside your own file-scoped config object,
spread the preset rules manually.

```ts
<<<<<<< HEAD
import writeGoodComments from "eslint-plugin-write-good-comments-2";
||||||| 53124b2
import tsParser from "@typescript-eslint/parser";
import typefest from "eslint-plugin-typefest";
=======
import writeGoodComments from "eslint-plugin-write-good-comments";
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

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
<<<<<<< HEAD
2. Fix noisy prose comments and bare TODO-style task comments in small batches.
3. Use per-rule options to disable individual `write-good` checks or customize
   the `task-comment-format` markers when a team has strong local conventions.
4. Switch to `all` only if you want the explicit “everything we ship” preset
   for future expansion.
||||||| 53124b2
1. Start with `recommended` (or `minimal` if you want low initial noise).
2. Fix violations in small batches.
3. Move to `recommended-type-checked` when you are ready for typed rules.
4. Move to `strict` once your baseline is stable.
5. Use `all` only when you explicitly want every rule, including experimental rules.

## Need a subset instead of a full preset?

- 💠 `typefest.configs["type-fest/types"]`
- ✴️ `typefest.configs["ts-extras/type-guards"]`

See the **Presets** section in this sidebar for details and examples.
=======
2. Fix noisy or unclear comments in small batches.
3. Use per-rule options to disable individual `write-good` checks if a team has
   strong local conventions.
4. Switch to `all` only if you want the explicit “everything we ship” preset for
   future expansion.
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
