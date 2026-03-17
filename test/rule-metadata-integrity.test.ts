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
            expect(rule.meta?.docs?.description).toMatch(/write-good/iv);
            expect(rule.meta?.docs?.url).toBe(createRuleDocsUrl(ruleName));
            expect(rule.meta?.schema).toHaveLength(1);
            expect(rule.meta?.messages).toEqual({
                suggestion: "{{reason}}",
            });
        }
    });
});
