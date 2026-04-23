/**
 * @packageDocumentation
 * Public preset contract tests for eslint-plugin-write-good-comments-2.
 */

import { describe, expect, it } from "vitest";

import plugin, { writeGoodCommentsConfigNames } from "../src/plugin";

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
            expect(plugin.configs[configName]).toStrictEqual(
                expect.objectContaining({
                    files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
                    name: `write-good-comments:${configName}`,
                    plugins: expect.objectContaining({
                        "write-good-comments": expect.any(Object),
                    }),
                    rules: expectedPresetRulesByConfigName[configName],
                })
            );
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
});
