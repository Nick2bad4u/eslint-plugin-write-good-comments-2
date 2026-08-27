/**
 * @packageDocumentation
 * Behavioral tests for the readability-comments rule.
 */

import { jsdocBlockTagConventionsFixture } from "./_internal/comment-fixtures";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

const difficultSentence =
    "// This comment intentionally accumulates several unnecessarily abstract clauses so the guidance becomes much harder to parse during a quick maintenance pass.\nconst value = 1;";

const issue25TagOnlyJSDoc = [
    "/**",
    " * @typedef {Object} CreateEvent",
    " * @property {'create'} action",
    " * @property {Init} Thing",
    " * @property {string | number} organizer_id",
    " */",
    "const value = 1;",
].join("\n");

ruleTester.run("readability-comments", getPluginRule("readability-comments"), {
    invalid: [
        {
            code: difficultSentence,
            errors: [
                {
                    messageId: "problem",
                },
            ],
            name: "reports difficult-to-read prose in line comments",
        },
        {
            code: [
                "/**",
                " * This explanation deliberately layers several overly abstract phrases so future maintainers must decode the sentence instead of scanning it.",
                " */",
                "const value = 1;",
            ].join("\n"),
            errors: [
                {
                    messageId: "problem",
                },
            ],
            name: "reports difficult-to-read prose in decorated block comments",
        },
        {
            code: [
                "/**",
                " * This explanation deliberately layers several overly abstract phrases so future maintainers must decode the sentence instead of scanning it.",
                " *",
                " * @typedef {Object} CreateEvent",
                " * @property {'create'} action",
                " * @property {string | number} organizer_id",
                " */",
                "const value = 1;",
            ].join("\n"),
            errors: [
                {
                    column: 4,
                    endColumn: 143,
                    endLine: 2,
                    line: 2,
                    messageId: "problem",
                },
            ],
            name: "reports only a difficult leading JSDoc description",
        },
    ],
    valid: [
        {
            code: "// Keep the fallback path small and easy to review.\nconst value = 1;",
            name: "accepts straightforward prose comments",
        },
        {
            code: difficultSentence,
            name: "respects a higher minimum word threshold",
            options: [
                {
                    minWords: 40,
                },
            ],
        },
        {
            code: "// Keep `eslint.config.mjs` aligned with the docs.\nconst value = 1;",
            name: "ignores markdown code spans inside comments",
        },
        {
            code: "// istanbul ignore next\nconst value = 1;",
            name: "ignores directive comments",
        },
        {
            code: issue25TagOnlyJSDoc,
            name: "ignores the tag-only JSDoc reported in issue 25",
        },
        {
            code: issue25TagOnlyJSDoc,
            name: "ignores the issue 25 JSDoc with the reported age option",
            options: [
                {
                    age: 20,
                },
            ],
        },
        {
            code: jsdocBlockTagConventionsFixture,
            name: "accepts diverse comment conventions while ignoring JSDoc block tags",
        },
        {
            code: [
                "/**",
                " * Keep the event shape short and direct.",
                " *",
                " * @typedef {Object} CreateEvent",
                " * @property {'create'} action",
                " * @property {Init} Thing",
                " * @property {string | number} organizer_id",
                " */",
                "const value = 1;",
            ].join("\n"),
            name: "ignores difficult tag metadata after an easy description",
        },
    ],
});
