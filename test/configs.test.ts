/**
 * @packageDocumentation
<<<<<<< HEAD
 * Public preset contract tests for eslint-plugin-write-good-comments-2.
||||||| 53124b2
 * Vitest coverage for `configs.test` behavior.
=======
 * Public preset contract tests for eslint-plugin-write-good-comments.
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
 */

import { describe, expect, it } from "vitest";

import plugin, { writeGoodCommentsConfigNames } from "../src/plugin";
<<<<<<< HEAD

describe("plugin configs", () => {
    const expectedPresetRules = {
        "write-good-comments/task-comment-format": "error",
        "write-good-comments/write-good-comments": "error",
    } as const;
||||||| 53124b2
import {
    typefestConfigMetadataByName,
    typefestConfigNames,
} from "../src/_internal/typefest-config-references";
import typefestPlugin from "../src/plugin";

interface FlatConfigLike {
    files?: unknown;
    languageOptions?: UnknownRecord & {
        parser?: unknown;
        parserOptions?: unknown;
    };
    name?: unknown;
    plugins?: UnknownRecord;
    rules?: UnknownRecord;
}

/**
 * Resolve a named plugin preset config from a dynamic `plugin.configs` map.
 *
 * @param configs - Dynamic plugin configs record.
 * @param configName - Preset key to resolve.
 *
 * @returns Parsed flat-config-like preset when present and object-shaped.
 */
function getConfig(
    configs: Readonly<null | UnknownRecord>,
    configName: string
): FlatConfigLike | undefined {
    const config = configs?.[configName];

    return isObject(config) ? (config as FlatConfigLike) : undefined;
}

/**
 * Resolve the `rules` object for a named plugin preset.
 *
 * @param configs - Dynamic plugin configs record.
 * @param configName - Preset key to resolve.
 *
 * @returns Rules map when present and object-shaped; otherwise `null`.
 */
function getConfigRules(
    configs: Readonly<null | UnknownRecord>,
    configName: string
): null | UnknownRecord {
    const config = configs?.[configName];
    if (!isObject(config)) {
        return null;
    }

    const rules = config["rules"];
    if (!isObject(rules)) {
        return null;
    }

    return rules;
}

/**
 * Extract the `configs` export from a dynamic plugin value.
 *
 * @param pluginValue - Dynamic plugin module value.
 *
 * @returns Config map when available; otherwise `null`.
 */
function getPluginConfigs(pluginValue: unknown): null | UnknownRecord {
    if (!isObject(pluginValue)) {
        return null;
    }

    const configs = pluginValue["configs"];
    if (!isObject(configs)) {
        return null;
    }

    return configs;
}

/**
 * Extract the `rules` export from a dynamic plugin value.
 *
 * @param pluginValue - Dynamic plugin module value.
 *
 * @returns Rules map when available; otherwise `null`.
 */
function getPluginRules(pluginValue: unknown): null | UnknownRecord {
    if (!isObject(pluginValue)) {
        return null;
    }

    const rules = pluginValue["rules"];
    if (!isObject(rules)) {
        return null;
    }

    return rules;
}

/**
 * Check whether a dynamic value is an object-like record.
 *
 * @param value - Runtime value under inspection.
 *
 * @returns `true` when value is object-like and non-null.
 */
function isObject(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null;
}

describe("typefest plugin configs", () => {
    const configs = getPluginConfigs(typefestPlugin);
    const rules = getPluginRules(typefestPlugin);
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

describe("plugin configs", () => {
    it("exports exactly the supported config keys", () => {
        const actualConfigNames = Object.keys(plugin.configs);
        const expectedConfigNames = [...writeGoodCommentsConfigNames];

        actualConfigNames.sort((left, right) => left.localeCompare(right));
        expectedConfigNames.sort((left, right) => left.localeCompare(right));

        expect(actualConfigNames).toStrictEqual(expectedConfigNames);
    });

    it("registers plugin namespace and rule ids in every preset", () => {
        for (const configName of writeGoodCommentsConfigNames) {
            expect(plugin.configs[configName]).toEqual(
                expect.objectContaining({
                    files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
                    name: `write-good-comments:${configName}`,
                    plugins: expect.objectContaining({
                        "write-good-comments": expect.any(Object),
                    }),
<<<<<<< HEAD
                    rules: expectedPresetRules,
||||||| 53124b2
=======
                    rules: {
                        "write-good-comments/write-good-comments": "error",
                    },
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
                })
            );
        }
    });

<<<<<<< HEAD
    it("keeps recommended and all aligned for the current shipped rules", () => {
||||||| 53124b2
    it("enables every rule in the all preset", () => {
        const allRules = getConfigRules(configs, "all");

        expect(allRules).toBeDefined();

        for (const ruleId of Object.keys(rules ?? {})) {
            expect(allRules).toHaveProperty(`typefest/${ruleId}`, "error");
        }
    });

    it("keeps minimal ⊂ recommended ⊂ recommended-type-checked ⊂ strict ⊂ all", () => {
        const minimalRules = getConfigRules(configs, "minimal") ?? {};
        const recommendedRules = getConfigRules(configs, "recommended") ?? {};
        const recommendedTypeCheckedRules =
            getConfigRules(configs, "recommended-type-checked") ?? {};
        const strictRules = getConfigRules(configs, "strict") ?? {};
        const allRules = getConfigRules(configs, "all") ?? {};

        for (const ruleName of Object.keys(minimalRules)) {
            expect(recommendedRules).toHaveProperty(ruleName, "error");
        }

        for (const ruleName of Object.keys(recommendedRules)) {
            expect(recommendedTypeCheckedRules).toHaveProperty(
                ruleName,
                "error"
            );
        }

        for (const ruleName of Object.keys(recommendedTypeCheckedRules)) {
            expect(strictRules).toHaveProperty(ruleName, "error");
        }

        for (const ruleName of Object.keys(strictRules)) {
            expect(allRules).toHaveProperty(ruleName, "error");
        }
    });

    it("keeps type-fest/types focused to type-fest rules", () => {
        const festTypeRulesPreset =
            getConfigRules(configs, "type-fest/types") ?? {};

        for (const ruleName of Object.keys(festTypeRulesPreset)) {
            expect(
                ruleName.startsWith("typefest/prefer-type-fest-")
            ).toBeTruthy();
        }
    });

    it("keeps ts-extras/type-guards focused to ts-extras rules", () => {
        const tsExtrasRules =
            getConfigRules(configs, "ts-extras/type-guards") ?? {};

        for (const ruleName of Object.keys(tsExtrasRules)) {
            expect(
                ruleName.startsWith("typefest/prefer-ts-extras-")
            ).toBeTruthy();
        }
    });

    it("keeps all-only rules excluded from strict and included in all", () => {
        const strictRules = getConfigRules(configs, "strict") ?? {};
        const allRules = getConfigRules(configs, "all") ?? {};

        const allOnlyRules = [
            "typefest/prefer-ts-extras-array-find",
            "typefest/prefer-ts-extras-array-find-last-index",
            "typefest/prefer-ts-extras-is-equal-type",
        ];

        for (const ruleName of allOnlyRules) {
            expect(strictRules).not.toHaveProperty(ruleName);
            expect(allRules).toHaveProperty(ruleName, "error");
        }
    });

    it("enables parser projectService for presets that include typed rules", () => {
        for (const configName of typefestConfigNames) {
            const config = getConfig(configs, configName);

            expect(config).toBeDefined();

            if (typefestConfigMetadataByName[configName].requiresTypeChecking) {
                expect(config?.languageOptions?.parserOptions).toEqual(
                    expect.objectContaining({
                        projectService: true,
                    })
                );
            } else {
                expect(config?.languageOptions?.parserOptions).toEqual(
                    expect.not.objectContaining({
                        projectService: true,
                    })
                );
            }
        }
=======
    it("keeps recommended and all aligned for the single shipped rule", () => {
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
        expect(plugin.configs.recommended.rules).toStrictEqual(
            plugin.configs.all.rules
        );
    });
});
