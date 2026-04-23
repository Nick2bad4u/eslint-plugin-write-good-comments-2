/**
 * @packageDocumentation
 * Shared RuleTester + Vitest integration for eslint-plugin-write-good-comments-2.
 */

import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

import plugin from "../../src/plugin";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = (
    ...arguments_: readonly [...Parameters<typeof RuleTester.itOnly>]
) => {
    Reflect.apply(Reflect.get(it, "only"), undefined, arguments_);
};

/** Rule module parameter type accepted by `RuleTester#run`. */
type PluginRuleModule = Parameters<RuleTester["run"]>[1];

/** Create a RuleTester instance configured for TypeScript parser usage. */
export const createRuleTester = (): RuleTester =>
    new RuleTester({
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
    });

/** Check whether a dynamic value is a non-null object record. */
const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
    typeof value === "object" && value !== null;

/** Check whether a dynamic value looks like an ESLint rule module. */
const isRuleModule = (value: unknown): value is PluginRuleModule => {
    if (!isRecord(value)) {
        return false;
    }

    const maybeCreate = value["create"];

    return typeof maybeCreate === "function";
};

/** Lookup a rule module from the plugin by its unqualified rule id. */
export const getPluginRule = (ruleId: string): PluginRuleModule => {
    const dynamicRules = plugin.rules as Readonly<Record<string, unknown>>;

    if (!Object.hasOwn(dynamicRules, ruleId)) {
        throw new Error(
            `Rule '${ruleId}' is not registered in eslint-plugin-write-good-comments-2.`
        );
    }

    const rule = dynamicRules[ruleId];

    if (!isRuleModule(rule)) {
        throw new TypeError(
            `Rule '${ruleId}' is not a valid ESLint rule module.`
        );
    }

    return rule;
};
