/**
 * @packageDocumentation
 * Strong contract tests for shipped rule metadata.
 */

import { describe, expect, it } from "vitest";

import { createRuleDocsUrl } from "../src/_internal/rule-docs-url";
import plugin from "../src/plugin";

describe("rule metadata integrity", () => {
    it("ships the expected metadata contract for every rule", () => {
        for (const [ruleName, rule] of Object.entries(plugin.rules)) {
            expect(rule.meta?.type).toBe("suggestion");
            expect(rule.meta?.docs?.url).toBe(createRuleDocsUrl(ruleName));
            expect(rule.meta?.schema).toHaveLength(1);

            switch (ruleName) {
                case "task-comment-format": {
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
