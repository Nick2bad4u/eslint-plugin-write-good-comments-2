/**
 * @packageDocumentation
 * Behavioral tests for the migrated write-good-comments rule.
 */

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
    ],
});
