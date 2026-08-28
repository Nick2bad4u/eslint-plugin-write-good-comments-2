/**
 * @packageDocumentation
 * Behavioral tests for the migrated write-good-comments rule.
 */

import {
    jsdocBlockTagConventionsFixture,
    toolControlCommentConventionsFixture,
} from "./_internal/comment-fixtures";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

ruleTester.run("write-good-comments", getPluginRule("write-good-comments"), {
    invalid: [
        {
            code: "// In order to keep this comment short, rewrite it.\nconst value = 1;",
            errors: [
                {
                    messageId: "suggestion",
                },
            ],
            name: "reports classic wordy phrases in line comments",
        },
        {
            code: [
                "/*",
                " * In order to keep this block comment focused, rewrite it.",
                " */",
                "const value = 1;",
            ].join("\n"),
            errors: [
                {
                    messageId: "suggestion",
                },
            ],
            name: "reports wordy phrases inside decorated block comments",
        },
        {
            code: "// This is concise.\nconst value = 1;",
            errors: [
                {
                    messageId: "suggestion",
                },
            ],
            name: "supports upstream e-prime checks",
            options: [
                {
                    adverb: false,
                    cliches: false,
                    eprime: true,
                    illusion: false,
                    passive: false,
                    so: false,
                    thereIs: false,
                    tooWordy: false,
                    weasel: false,
                },
            ],
        },
        {
            code: [
                "/**",
                " * In order to keep this description focused, rewrite it.",
                " * @param {string} value - In order to document this value, rewrite it.",
                " */",
                "const value = 1;",
            ].join("\n"),
            errors: [
                {
                    messageId: "suggestion",
                },
            ],
            name: "reports wordy leading JSDoc prose but ignores tag descriptions",
        },
        {
            code: [
                "/*",
                " * In order to explain the example, start here.",
                " *",
                " * ```ts",
                " * // In order to preserve the legacy call, retry.",
                " * ```",
                " */",
                "const value = 1;",
            ].join("\n"),
            errors: [
                {
                    column: 4,
                    endColumn: 15,
                    line: 2,
                    messageId: "suggestion",
                },
            ],
            name: "reports prose outside fenced markdown while ignoring code",
        },
        {
            code: "const value = 1; // 😀 In order to keep this short, retry.",
            errors: [
                {
                    column: 24,
                    endColumn: 35,
                    line: 1,
                    messageId: "suggestion",
                },
            ],
            name: "preserves trailing-comment UTF-16 source offsets",
        },
    ],
    valid: [
        {
            code: "// This comment stays short and direct.\nconst value = 1;",
            name: "accepts clear comments",
        },
        {
            code: "// The action was completed.\nconst value = 1;",
            name: "allows disabling passive voice checks",
            options: [
                {
                    passive: false,
                },
            ],
        },
        {
            code: "// The read-only setting stays enabled.\nconst value = 1;",
            name: "supports whitelist terms",
            options: [
                {
                    whitelist: ["read-only"],
                },
            ],
        },
        {
            code: "// istanbul ignore next\nconst value = 1;",
            name: "ignores directive comments",
        },
        {
            code: "// prettier-ignore\nconst value = 1;",
            name: "ignores formatting pragma comments",
        },
        {
            code: "// react-hooks/exhaustive-deps\nconst value = 1;",
            name: "ignores lint rule namespace comments",
        },
        {
            code: "// Preserve `In order to` as a literal compatibility phrase.\nconst value = 1;",
            name: "ignores markdown code spans inside comments",
        },
        {
            code: [
                "/**",
                " * Add two numbers together.",
                " */",
                "function add(a, b) {",
                "    return a + b;",
                "}",
            ].join("\n"),
            name: "ignores block comment decoration when linting prose",
        },
        {
            code: [
                "/**",
                " * @param {string} value - In order to complete this step, retry.",
                " */",
                "const value = 1;",
            ].join("\n"),
            name: "ignores wordy phrases inside JSDoc block tags",
        },
        {
            code: jsdocBlockTagConventionsFixture,
            name: "accepts diverse comment conventions while ignoring JSDoc block tags",
        },
        {
            code: toolControlCommentConventionsFixture,
            name: "ignores non-prose tool-control comment conventions",
        },
    ],
});
