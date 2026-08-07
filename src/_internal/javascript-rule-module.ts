/**
 * @packageDocumentation
 * ESLint 10 language metadata compatibility for typescript-eslint rule types.
 */

import type { TSESLint } from "@typescript-eslint/utils";
import type { Except, UnknownArray } from "type-fest";

/**
 * Rule-module shape for rules that operate on ESLint's built-in JavaScript
 * language, including JavaScript files parsed as TypeScript.
 *
 * `@typescript-eslint/utils` 8.66 does not yet expose ESLint 10's
 * `meta.languages` field, so this intersection keeps the runtime contract typed
 * without weakening the rest of the rule metadata.
 */
export type JavaScriptRuleModule<
    MessageIds extends string,
    Options extends Readonly<UnknownArray> = [],
    Docs = unknown,
> = Except<TSESLint.RuleModule<MessageIds, Options, Docs>, "meta"> & {
    meta: TSESLint.RuleModule<MessageIds, Options, Docs>["meta"] & {
        languages: readonly ["js/js"];
    };
};
