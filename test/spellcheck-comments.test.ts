/**
 * @packageDocumentation
 * Behavioral tests for the spellcheck-comments rule.
 */

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

ruleTester.run("spellcheck-comments", getPluginRule("spellcheck-comments"), {
    invalid: [
        {
            code: "// This documeant stays useles after review.\nconst value = 1;",
            errors: [
                {
                    messageId: "problem",
                },
                {
                    messageId: "problem",
                },
            ],
            name: "reports misspellings in line comments",
        },
        {
            code: [
                "/**",
                " * This changelog entry is still incorect.",
                " */",
                "const value = 1;",
            ].join("\n"),
            errors: [
                {
                    messageId: "problem",
                },
            ],
            name: "reports misspellings in decorated block comments",
        },
    ],
    valid: [
        {
            code: "// Keep the comment concise and accurate.\nconst value = 1;",
            name: "accepts correct prose comments",
        },
        {
            code: "// Keep the eslint config docs in the repo plugin guide.\nconst value = 1;",
            name: "accepts built-in technical vocabulary",
        },
        {
            code: "// Keep `documeant` only as the literal legacy key.\nconst value = 1;",
            name: "ignores markdown code spans inside comments",
        },
        {
            code: "// This documeant stays useles after review.\nconst value = 1;",
            name: "accepts user-defined extra words",
            options: [
                {
                    ignoreWords: ["documeant", "useles"],
                },
            ],
        },
        {
            code: "// @ts-expect-error -- temporary escape hatch for legacy API mismatch.\nconst value = 1 as never;",
            name: "ignores directive comments",
        },
    ],
});
