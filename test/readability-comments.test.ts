/**
 * @packageDocumentation
 * Behavioral tests for the readability-comments rule.
 */

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

const difficultSentence =
    "// This comment intentionally accumulates several unnecessarily abstract clauses so the guidance becomes much harder to parse during a quick maintenance pass.\nconst value = 1;";

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
    ],
});
