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
- Fix noisy prose comments, inclusive-language findings, and bare task comments
  in small batches.
- Use rule options to tune `write-good`, retext-based language filters, or task
  markers to match local conventions.
- Switch to `writeGoodComments.configs.all` when you also want profanity,
  spellcheck, and readability checks.
- Use the **Rules** sidebar section for the full option reference and examples.
