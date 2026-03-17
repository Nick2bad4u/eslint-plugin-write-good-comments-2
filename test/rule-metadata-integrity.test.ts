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
<<<<<<< HEAD
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
||||||| 53124b2
    it("exports processors for plugin shape parity", () => {
        expect(typefestPlugin).toHaveProperty("processors");
        expect(typefestPlugin.processors).toEqual({});
    });

    it("keeps src/rules file names in sync with registered rule names", () => {
        const registeredRuleNames = Object.keys(typefestPlugin.rules).toSorted(
            (left, right) => left.localeCompare(right)
        );

        expect(getRuleSourceFileNames()).toStrictEqual(registeredRuleNames);
    });

    it("enforces required metadata invariants for every rule", () => {
        const ruleEntries = objectEntries(typefestPlugin.rules);
        const seenRuleCatalogIds = new Set<string>();
        const seenRuleIds = new Set<string>();
        const seenRuleNumbers = new Set<number>();

        expect(ruleEntries.length).toBeGreaterThan(0);

        for (const [ruleName, ruleModule] of ruleEntries) {
            const ruleRecord = getRuleRecord(ruleName, ruleModule);
            const metaRecord = getRuleMetaRecord(ruleName, ruleRecord);
            const docsRecord = getRuleDocsRecord(ruleName, metaRecord);

            assertBaseRuleMetadataContract({
                metaRecord,
                ruleName,
                ruleRecord,
            });
            assertDefaultOptionsContract({
                metaRecord,
                ruleName,
                ruleRecord,
            });
            assertDocsContract({
                docsRecord,
                ruleName,
            });
            assertMessageAndFixContract({
                metaRecord,
                ruleName,
            });

            const docsRuleId = docsRecord["ruleId"];
            const docsRuleCatalogId = docsRecord["ruleCatalogId"];
            const docsRuleNumber = docsRecord["ruleNumber"];

            if (typeof docsRuleCatalogId === "string") {
                seenRuleCatalogIds.add(docsRuleCatalogId);
            }

            if (typeof docsRuleId === "string") {
                seenRuleIds.add(docsRuleId);
            }

            if (typeof docsRuleNumber === "number") {
                seenRuleNumbers.add(docsRuleNumber);
            }
=======
            expect(rule.meta?.docs?.description).toMatch(/write-good/iv);
            expect(rule.meta?.docs?.url).toBe(createRuleDocsUrl(ruleName));
            expect(rule.meta?.schema).toHaveLength(1);
            expect(rule.meta?.messages).toEqual({
                suggestion: "{{reason}}",
            });
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
        }
    });
});
