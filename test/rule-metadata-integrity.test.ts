/**
 * @packageDocumentation
 * Strong contract tests for shipped rule metadata.
 */

import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

const expectedRuleDocsUrls = {
    "inclusive-language-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/inclusive-language-comments",
    "no-profane-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/no-profane-comments",
    "readability-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/readability-comments",
    "spellcheck-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/spellcheck-comments",
    "task-comment-format":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/task-comment-format",
    "write-good-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments",
} as const;

describe("rule metadata integrity", () => {
    it("ships the expected metadata contract for every rule", () => {
        for (const [ruleName, rule] of Object.entries(plugin.rules)) {
            expect(rule.meta?.type).toBe("suggestion");
            expect(rule.meta?.schema).toHaveLength(1);

            switch (ruleName) {
                case "inclusive-language-comments": {
                    expect(rule.meta?.docs?.url).toBe(
                        expectedRuleDocsUrls[ruleName]
                    );

                    expect(rule.meta?.docs?.description).toMatch(
                        /considerate|inclusive/iv
                    );

                    expect(rule.meta?.messages).toEqual({
                        problem: "{{reason}}",
                    });

                    break;
                }

                case "no-profane-comments": {
                    expect(rule.meta?.docs?.url).toBe(
                        expectedRuleDocsUrls[ruleName]
                    );

                    expect(rule.meta?.docs?.description).toMatch(/profane/iv);

                    expect(rule.meta?.messages).toEqual({
                        problem: "{{reason}}",
                    });

                    break;
                }

                case "readability-comments": {
                    expect(rule.meta?.docs?.url).toBe(
                        expectedRuleDocsUrls[ruleName]
                    );

                    expect(rule.meta?.docs?.description).toMatch(
                        /hard to read|readability/iv
                    );

                    expect(rule.meta?.messages).toEqual({
                        problem: "{{reason}}",
                    });

                    break;
                }

                case "spellcheck-comments": {
                    expect(rule.meta?.docs?.url).toBe(
                        expectedRuleDocsUrls[ruleName]
                    );

                    expect(rule.meta?.docs?.description).toMatch(
                        /spellcheck|spell/iv
                    );

                    expect(rule.meta?.messages).toEqual({
                        problem: "{{reason}}",
                    });

                    break;
                }

                case "task-comment-format": {
                    expect(rule.meta?.docs?.url).toBe(
                        expectedRuleDocsUrls[ruleName]
                    );

                    expect(rule.meta?.docs?.description).toMatch(
                        /todo-style task comments/iv
                    );

                    expect(rule.meta?.messages).toEqual({
                        missingDescription:
                            "{{term}} comments must include a descriptive task or reason after the marker.",
                    });

                    break;
                }

                case "write-good-comments": {
                    expect(rule.meta?.docs?.url).toBe(
                        expectedRuleDocsUrls[ruleName]
                    );

                    expect(rule.meta?.docs?.description).toMatch(
                        /write-good/iv
                    );

                    expect(rule.meta?.messages).toEqual({
                        suggestion: "{{reason}}",
                    });

                    break;
                }

                default: {
                    throw new Error(`Unexpected rule '${ruleName}'.`);
                }
            }
        }
    });
});
