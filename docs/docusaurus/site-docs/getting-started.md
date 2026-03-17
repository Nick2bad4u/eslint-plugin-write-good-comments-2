---
sidebar_position: 2
---

# Getting Started

Install the plugin:

```bash
<<<<<<< HEAD
npm install --save-dev eslint-plugin-write-good-comments-2
||||||| 53124b2
npm install --save-dev eslint-plugin-typefest
=======
npm install --save-dev eslint-plugin-write-good-comments
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
```

Then enable it in your Flat Config:

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

## Recommended rollout

- Start with `writeGoodComments.configs.recommended`.
<<<<<<< HEAD
- Fix noisy prose comments and bare task comments in small batches.
||||||| 53124b2
- Start with one ruleset (`typefest.configs.recommended` or `typefest.configs.strict`).
- Fix violations in small batches.
- Promote warnings to errors after stabilization.

## Rule navigation

Use the sidebar **Rules** section for the full list of rule docs synced from the repository.
=======
- Fix noisy comments in small batches.
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
- Enable optional upstream checks such as `eprime` only when the team wants
  tighter prose rules.
- Use the **Rules** sidebar section for the full option reference and examples.
