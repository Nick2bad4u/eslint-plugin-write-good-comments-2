/**
 * @packageDocumentation
<<<<<<< HEAD
 * Public plugin entrypoint for eslint-plugin-write-good-comments-2.
||||||| 53124b2
 * Public plugin entrypoint for eslint-plugin-typefest exports and preset wiring.
=======
 * Public plugin entrypoint for eslint-plugin-write-good-comments.
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
 */

import type { ESLint, Linter } from "eslint";

import packageJson from "../package.json" with { type: "json" };
<<<<<<< HEAD
import taskCommentFormatRule from "./rules/task-comment-format.js";
||||||| 53124b2
import {
    deriveRuleDocsMetadataByName,
    deriveRulePresetMembershipByRuleName,
    deriveTypeCheckedRuleNameSet,
} from "./_internal/rule-docs-metadata.js";
import { typefestRules } from "./_internal/rules-registry.js";
import {
    type TypefestConfigName as InternalTypefestConfigName,
    typefestConfigMetadataByName,
    typefestConfigNames,
} from "./_internal/typefest-config-references.js";

/** ESLint severity used by generated preset rule maps. */
const ERROR_SEVERITY = "error" as const;
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
import writeGoodCommentsRule from "./rules/write-good-comments.js";

/** Default file globs targeted by plugin presets when `files` is omitted. */
const DEFAULT_FILES = ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"] as const;

/** Canonical flat-config preset keys exposed through `plugin.configs`. */
export const writeGoodCommentsConfigNames = ["recommended", "all"] as const;

<<<<<<< HEAD
/** Canonical rule names exposed through `plugin.rules`. */
export const writeGoodCommentsRuleNames = [
    "task-comment-format",
    "write-good-comments",
] as const;

||||||| 53124b2
/**
 * Flat-config preset shape produced by this plugin.
 *
 * @remarks
 * The `rules` map is required so preset composition can always merge concrete
 * rule severity entries without additional null checks.
 */
export type TypefestPresetConfig = Linter.Config & {
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
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
<<<<<<< HEAD
export type WriteGoodCommentsRuleName =
    (typeof writeGoodCommentsRuleNames)[number];
||||||| 53124b2
/** Normalized language-options shape for preset composition helpers. */
type FlatLanguageOptions = NonNullable<FlatConfig["languageOptions"]>;
=======
export type WriteGoodCommentsRuleName = "write-good-comments";
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

/** Runtime rule-entry shape expected by the public ESLint plugin contract. */
type PluginRuleEntry = NonNullable<ESLint.Plugin["rules"]>[string];

/** Runtime rule-map shape expected by the public ESLint plugin contract. */
type PluginRulesMap = NonNullable<ESLint.Plugin["rules"]>;

/** Runtime rule registry shipped by this plugin. */
export const writeGoodCommentsRules: Readonly<
    Record<WriteGoodCommentsRuleName, PluginRuleEntry>
> = {
<<<<<<< HEAD
    "task-comment-format": taskCommentFormatRule as unknown as PluginRuleEntry,
    "write-good-comments": writeGoodCommentsRule as unknown as PluginRuleEntry,
};

/** Rule memberships for each public preset. */
const presetRuleNamesByConfigName: Readonly<
    Record<WriteGoodCommentsConfigName, readonly WriteGoodCommentsRuleName[]>
> = {
    all: [...writeGoodCommentsRuleNames],
    recommended: [...writeGoodCommentsRuleNames],
||||||| 53124b2
/** Contract for the `configs` object exported by this plugin. */
type TypefestConfigsContract = Record<TypefestConfigName, TypefestPresetConfig>;
=======
    "write-good-comments": writeGoodCommentsRule as unknown as PluginRuleEntry,
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
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
<<<<<<< HEAD
};

/**
 * Resolve package name from package.json data.
 *
 * @param pkg - Parsed package metadata value.
 *
 * @returns The package name, or `eslint-plugin-write-good-comments-2` when
 *   unavailable.
 */
const getPackageName = (pkg: unknown): string => {
    if (typeof pkg !== "object" || pkg === null) {
        return "eslint-plugin-write-good-comments-2";
    }

    const name = Reflect.get(pkg, "name");

    return typeof name === "string"
        ? name
        : "eslint-plugin-write-good-comments-2";
||||||| 53124b2
}

/** Package metadata used to populate plugin runtime `meta.version`. */
const packageJsonValue = safeCastTo<unknown>(packageJson);

/** Parser module reused across preset construction. */
const typeScriptParserValue: FlatLanguageOptions["parser"] = typeScriptParser;

/** Default parser options applied when a preset omits parser options. */
const defaultParserOptions = {
    ecmaVersion: "latest",
    sourceType: "module",
} satisfies FlatParserOptions;

/**
 * Normalize unknown parser options into a mutable parser-options object.
 */
const normalizeParserOptions = (
    parserOptions: FlatLanguageOptions["parserOptions"]
): FlatParserOptions =>
    parserOptions !== null &&
    typeof parserOptions === "object" &&
    !Array.isArray(parserOptions)
        ? { ...parserOptions }
        : { ...defaultParserOptions };

/**
 * Fully-qualified ESLint rule id used by this plugin.
 *
 * @remarks
 * Consumers typically use this when building strongly typed rule maps or helper
 * utilities that require namespaced rule identifiers.
 */
export type TypefestRuleId = `typefest/${TypefestRuleName}`;

/** Unqualified rule name supported by `eslint-plugin-typefest`. */
export type TypefestRuleName = keyof typeof typefestRules;

/**
 * ESLint-compatible rule map view of the strongly typed internal rule record.
 */
const typefestEslintRules: NonNullable<ESLint.Plugin["rules"]> &
    typeof typefestRules = typefestRules as NonNullable<
    ESLint.Plugin["rules"]
> &
    typeof typefestRules;

const isTypefestRuleName = (value: string): value is TypefestRuleName =>
    objectHasIn(typefestRules, value);

const typefestRuleEntries: readonly (readonly [
    TypefestRuleName,
    (typeof typefestRules)[TypefestRuleName],
])[] = (() => {
    const entries: (readonly [
        TypefestRuleName,
        (typeof typefestRules)[TypefestRuleName],
    ])[] = [];

    for (const [ruleName] of objectEntries(typefestRules)) {
        if (!isTypefestRuleName(ruleName)) {
            continue;
        }

        const ruleDefinition = typefestRules[ruleName];

        if (ruleDefinition === undefined) {
            continue;
        }

        entries.push([ruleName, ruleDefinition]);
    }

    return entries;
})();

const ruleDocsMetadataByRuleName = deriveRuleDocsMetadataByName(typefestRules);
const rulePresetMembership = deriveRulePresetMembershipByRuleName(
    ruleDocsMetadataByRuleName
);
const typeCheckedRuleNames = deriveTypeCheckedRuleNameSet(
    ruleDocsMetadataByRuleName
);

const createEmptyPresetRuleMap = (): Record<
    TypefestConfigName,
    TypefestRuleName[]
> => {
    const presetRuleMap = {} as Record<TypefestConfigName, TypefestRuleName[]>;

    for (const configName of typefestConfigNames) {
        presetRuleMap[configName] = [];
    }

    return presetRuleMap;
};

const dedupeRuleNames = (
    ruleNames: readonly TypefestRuleName[]
): TypefestRuleName[] => [...new Set(ruleNames)];

const derivePresetRuleNamesByConfig = (): Readonly<
    Record<TypefestConfigName, readonly TypefestRuleName[]>
> => {
    const presetRuleNamesByConfig = createEmptyPresetRuleMap();

    for (const [ruleName] of typefestRuleEntries) {
        const configNames = rulePresetMembership[ruleName];

        if (!isDefined(configNames) || isEmpty(configNames)) {
            throw new TypeError(
                `Rule '${ruleName}' is missing preset membership metadata.`
            );
        }

        for (const configName of configNames) {
            presetRuleNamesByConfig[configName].push(ruleName);
        }
    }

    return {
        all: dedupeRuleNames(presetRuleNamesByConfig.all),
        minimal: dedupeRuleNames(presetRuleNamesByConfig.minimal),
        recommended: dedupeRuleNames(presetRuleNamesByConfig.recommended),
        "recommended-type-checked": dedupeRuleNames(
            presetRuleNamesByConfig["recommended-type-checked"]
        ),
        strict: dedupeRuleNames(presetRuleNamesByConfig.strict),
        "ts-extras/type-guards": dedupeRuleNames(
            presetRuleNamesByConfig["ts-extras/type-guards"]
        ),
        "type-fest/types": dedupeRuleNames(
            presetRuleNamesByConfig["type-fest/types"]
        ),
    };
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
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
<<<<<<< HEAD
    rules: errorRulesFor(presetRuleNamesByConfigName[configName]),
||||||| 53124b2
function withTypefestPlugin(
    config: Readonly<TypefestPresetConfig>,
    plugin: Readonly<ESLint.Plugin>,
    options: Readonly<{ requiresTypeChecking: boolean }>
): TypefestPresetConfig {
    const existingLanguageOptions = config.languageOptions ?? {};
    const existingParserOptions = existingLanguageOptions["parserOptions"];
    const parserOptions = normalizeParserOptions(existingParserOptions);
=======
    rules: errorRulesFor(["write-good-comments"]),
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
});

/** Runtime default plugin export. */
const plugin: WriteGoodCommentsPlugin = {
    configs: {} as WriteGoodCommentsConfigs,
    meta: {
<<<<<<< HEAD
        name: getPackageName(packageJson),
||||||| 53124b2
        name: "eslint-plugin-typefest",
        namespace: "typefest",
        version: getPackageVersion(packageJsonValue),
=======
        name: "eslint-plugin-write-good-comments",
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
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
