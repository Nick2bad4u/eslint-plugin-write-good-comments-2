/**
 * @packageDocumentation
 * Public preset contract tests for eslint-plugin-write-good-comments-2.
 */

import { describe, expect, it } from "vitest";

import plugin, { writeGoodCommentsConfigNames } from "../src/plugin";

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
                    rules: {
                        "write-good-comments/write-good-comments": "error",
                    },
                })
            );
        }
    });

    it("keeps recommended and all aligned for the single shipped rule", () => {
        expect(plugin.configs.recommended.rules).toStrictEqual(
            plugin.configs.all.rules
        );
    });
});
