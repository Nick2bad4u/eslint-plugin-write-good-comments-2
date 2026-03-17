/**
 * @packageDocumentation
 * Public plugin entrypoint for eslint-plugin-write-good-comments.
 */

import type { ESLint, Linter } from "eslint";

import packageJson from "../package.json" with { type: "json" };
import writeGoodCommentsRule from "./rules/write-good-comments.js";

/** Default file globs targeted by plugin presets when `files` is omitted. */
const DEFAULT_FILES = ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"] as const;

/** Canonical flat-config preset keys exposed through `plugin.configs`. */
export const writeGoodCommentsConfigNames = ["recommended", "all"] as const;

/** Canonical flat-config preset key type exposed through `plugin.configs`. */
export type WriteGoodCommentsConfigName =
    (typeof writeGoodCommentsConfigNames)[number];

/** Flat-config preset shape produced by this plugin. */
export type WriteGoodCommentsPresetConfig = Linter.Config & {
    rules: NonNullable<Linter.Config["rules"]>;
};

/** Strongly typed qualified rule-id union exported by this plugin. */
export type WriteGoodCommentsRuleId =
    `write-good-comments/${WriteGoodCommentsRuleName}`;

/** Strongly typed unqualified rule-name union exported by this plugin. */
export type WriteGoodCommentsRuleName = "write-good-comments";

/** Runtime rule-entry shape expected by the public ESLint plugin contract. */
type PluginRuleEntry = NonNullable<ESLint.Plugin["rules"]>[string];

/** Runtime rule-map shape expected by the public ESLint plugin contract. */
type PluginRulesMap = NonNullable<ESLint.Plugin["rules"]>;

/** Runtime rule registry shipped by this plugin. */
export const writeGoodCommentsRules: Readonly<
    Record<WriteGoodCommentsRuleName, PluginRuleEntry>
> = {
    "write-good-comments": writeGoodCommentsRule as unknown as PluginRuleEntry,
};

/** Runtime config registry shipped by this plugin. */
export type WriteGoodCommentsConfigs = Record<
    WriteGoodCommentsConfigName,
    WriteGoodCommentsPresetConfig
>;

/** Fully assembled plugin contract used by the runtime default export. */
export type WriteGoodCommentsPlugin = Omit<
    ESLint.Plugin,
    "configs" | "rules"
> & {
    configs: WriteGoodCommentsConfigs;
    meta: {
        name: string;
        namespace: string;
        version: string;
    };
    rules: PluginRulesMap & typeof writeGoodCommentsRules;
};

/**
 * Resolve package version from package.json data.
 *
 * @param pkg - Parsed package metadata value.
 *
 * @returns The package version, or `0.0.0` when unavailable.
 */
const getPackageVersion = (pkg: unknown): string => {
    if (typeof pkg !== "object" || pkg === null) {
        return "0.0.0";
    }

    const version = Reflect.get(pkg, "version");

    return typeof version === "string" ? version : "0.0.0";
};

/**
 * Build an ESLint rules map that enables each provided rule at error level.
 *
 * @param ruleNames - Rule names to enable.
 *
 * @returns Rules config object compatible with flat config.
 */
const errorRulesFor = (
    ruleNames: readonly WriteGoodCommentsRuleName[]
): WriteGoodCommentsPresetConfig["rules"] => {
    const rules: WriteGoodCommentsPresetConfig["rules"] = {};

    for (const ruleName of ruleNames) {
        rules[`write-good-comments/${ruleName}`] = "error";
    }

    return rules;
};

/**
 * Build one exported plugin preset.
 *
 * @param plugin - Plugin self-reference for flat-config `plugins` maps.
 * @param configName - Public preset key.
 *
 * @returns Fully assembled flat config preset.
 */
const createPreset = (
    plugin: Readonly<WriteGoodCommentsPlugin>,
    configName: WriteGoodCommentsConfigName
): WriteGoodCommentsPresetConfig => ({
    files: [...DEFAULT_FILES],
    name: `write-good-comments:${configName}`,
    plugins: {
        "write-good-comments": plugin,
    },
    rules: errorRulesFor(["write-good-comments"]),
});

/** Runtime default plugin export. */
const plugin: WriteGoodCommentsPlugin = {
    configs: {} as WriteGoodCommentsConfigs,
    meta: {
        name: "eslint-plugin-write-good-comments",
        namespace: "write-good-comments",
        version: getPackageVersion(packageJson),
    },
    processors: {},
    rules: writeGoodCommentsRules as PluginRulesMap &
        typeof writeGoodCommentsRules,
};

plugin.configs = {
    all: createPreset(plugin, "all"),
    recommended: createPreset(plugin, "recommended"),
};

export default plugin;
