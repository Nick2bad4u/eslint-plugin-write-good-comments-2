/**
 * @packageDocumentation
 * Parser-integration regressions for non-JSDoc comment conventions.
 */

import { Linter } from "eslint";
import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

const writeGoodRuleId = "write-good-comments/write-good-comments" as const;

/** Lint script source with only the write-good comment rule enabled. */
const lintScriptComments = (source: string): readonly Linter.LintMessage[] => {
    const linter = new Linter({ configType: "flat" });

    return linter.verify(
        source,
        [
            {
                languageOptions: {
                    ecmaVersion: "latest",
                    sourceType: "script",
                },
                plugins: {
                    "write-good-comments": plugin,
                },
                rules: {
                    [writeGoodRuleId]: "error",
                },
            },
        ],
        { filename: "comment-conventions.js" }
    );
};

describe("non-JSDoc comment conventions", () => {
    it.each([
        {
            column: 6,
            endColumn: 17,
            name: "opening HTML comment",
            source: "<!-- In order to keep this short, retry.\nconst value = 1;",
        },
        {
            column: 5,
            endColumn: 16,
            name: "closing HTML comment",
            source: "--> In order to keep this short, retry.\nconst value = 1;",
        },
    ])(
        "reports the correct offsets in an Annex B $name",
        ({ column, endColumn, source }) => {
            expect.hasAssertions();

            expect(lintScriptComments(source)).toStrictEqual([
                expect.objectContaining({
                    column,
                    endColumn,
                    endLine: 1,
                    line: 1,
                    ruleId: writeGoodRuleId,
                }),
            ]);
        }
    );

    it.each([
        "// React-based documentation exists in order to explain the adapter.\nconst value = 1;",
        "// Import-time documentation exists in order to explain the adapter.\nconst value = 1;",
        "// React: document this in order to explain the adapter.\nconst value = 1;",
        "/// In order to document this behavior, explain the adapter.\nconst value = 1;",
    ])(
        "retains nearby prose instead of overmatching a control prefix",
        (source) => {
            expect.hasAssertions();

            expect(lintScriptComments(source)).toStrictEqual([
                expect.objectContaining({
                    ruleId: writeGoodRuleId,
                }),
            ]);
        }
    );
});
