---
sidebar_position: 2
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-write-good-comments-2
```

Then enable it in your Flat Config:

```ts
import writeGoodComments from "eslint-plugin-write-good-comments-2";

export default [writeGoodComments.configs.recommended];
```

## Recommended rollout

- Start with `writeGoodComments.configs.recommended`.
- Fix noisy comments in small batches.
- Enable optional upstream checks such as `eprime` only when the team wants
  tighter prose rules.
- Use the **Rules** sidebar section for the full option reference and examples.
