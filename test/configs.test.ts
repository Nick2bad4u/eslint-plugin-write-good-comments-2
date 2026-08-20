/**
 * @packageDocumentation
 * Public preset contract tests for eslint-plugin-write-good-comments-2.
 */

import { type ESLint, Linter } from "eslint";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import plugin, { writeGoodCommentsConfigNames } from "../src/plugin";

/** Check whether a dynamically loaded value is the ESLint JSON plugin. */
const isJsonLanguagePlugin = (value: unknown): value is ESLint.Plugin => {
    if (
        typeof value !== "object" ||
        value === null ||
        !("languages" in value)
    ) {
        return false;
    }

    const { languages } = value;

    return (
        typeof languages === "object" &&
        languages !== null &&
        Object.hasOwn(languages, "json")
    );
};

/** Load the ESLint JSON plugin through the shared config package that owns it. */
const loadSharedJsonPlugin = (): ESLint.Plugin => {
    const requireFromSharedConfig = createRequire(
        import.meta.resolve("eslint-config-nick2bad4u/package.json")
    );
    const jsonModule: unknown = requireFromSharedConfig("@eslint/json");

    if (
        typeof jsonModule !== "object" ||
        jsonModule === null ||
        !("default" in jsonModule) ||
        !isJsonLanguagePlugin(jsonModule.default)
    ) {
        throw new TypeError(
            "The shared config's @eslint/json dependency has no default plugin export."
        );
    }

    return jsonModule.default;
};

describe("plugin configs", () => {
    const expectedPresetRulesByConfigName = {
        all: {
            "write-good-comments/inclusive-language-comments": "error",
            "write-good-comments/no-profane-comments": "error",
            "write-good-comments/readability-comments": "error",
            "write-good-comments/spellcheck-comments": "error",
            "write-good-comments/task-comment-format": "error",
            "write-good-comments/write-good-comments": "error",
        },
        recommended: {
            "write-good-comments/inclusive-language-comments": "error",
            "write-good-comments/task-comment-format": "error",
            "write-good-comments/write-good-comments": "error",
        },
    } as const;

    it("exports exactly the supported config keys", () => {
        expect.hasAssertions();

        const actualConfigNames = Object.keys(plugin.configs);
        const expectedConfigNames = [...writeGoodCommentsConfigNames];

        actualConfigNames.sort((left, right) => left.localeCompare(right));
        expectedConfigNames.sort((left, right) => left.localeCompare(right));

        expect(actualConfigNames).toStrictEqual(expectedConfigNames);
    });

    it("registers plugin namespace and rule ids in every preset", () => {
        expect.hasAssertions();

        for (const configName of writeGoodCommentsConfigNames) {
            const expectedPluginNamespace = expect.objectContaining({
                "write-good-comments": expect.any(Object),
            });
            const expectedConfig = expect.objectContaining({
                files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
                name: `write-good-comments:${configName}`,
                plugins: expectedPluginNamespace,
                rules: expectedPresetRulesByConfigName[configName],
            });

            expect(plugin.configs[configName]).toStrictEqual(expectedConfig);
        }
    });

    it("keeps all as a strict superset of recommended", () => {
        expect.hasAssertions();
        expect(plugin.configs.all.rules).toStrictEqual(
            expect.objectContaining(plugin.configs.recommended.rules)
        );

        expect(plugin.configs.recommended.rules).not.toHaveProperty(
            "write-good-comments/no-profane-comments"
        );
        expect(plugin.configs.recommended.rules).not.toHaveProperty(
            "write-good-comments/spellcheck-comments"
        );
        expect(plugin.configs.recommended.rules).not.toHaveProperty(
            "write-good-comments/readability-comments"
        );
    });

    it("coexists with the shared JSON language while still linting JavaScript", () => {
        expect.hasAssertions();

        const jsonPlugin = loadSharedJsonPlugin();

        const linter = new Linter({ configType: "flat" });
        const jsonMessages = linter.verify(
            '{"enabled":true}\n',
            [
                {
                    plugins: {
                        json: jsonPlugin,
                    },
                },
                {
                    files: ["**/*.json"],
                    language: "json/json",
                },
                plugin.configs.recommended,
            ],
            { filename: "fixture.json" }
        );
        const javascriptMessages = linter.verify(
            "// TODO\nconst value = 1;\n",
            [plugin.configs.recommended],
            { filename: "fixture.js" }
        );

        expect(jsonMessages).toStrictEqual([]);
        expect(javascriptMessages).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ruleId: "write-good-comments/task-comment-format",
                }),
            ])
        );
    });
});
