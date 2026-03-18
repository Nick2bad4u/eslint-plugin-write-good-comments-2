/**
 * @packageDocumentation
 * Behavioral tests for the inclusive-language-comments rule.
 */

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

ruleTester.run(
    "inclusive-language-comments",
    getPluginRule("inclusive-language-comments"),
    {
        invalid: [
            {
                code: "// Use the master branch until the rename lands.\nconst value = 1;",
                errors: [
                    {
                        messageId: "problem",
                    },
                ],
                name: "reports exclusionary language in line comments",
            },
            {
                code: [
                    "/**",
                    " * If a user changes his or her password, send a receipt.",
                    " */",
                    "const value = 1;",
                ].join("\n"),
                errors: [
                    {
                        messageId: "problem",
                    },
                    {
                        messageId: "problem",
                    },
                ],
                name: "supports binary-language checks when enabled",
                options: [
                    {
                        noBinary: true,
                    },
                ],
            },
        ],
        valid: [
            {
                code: "// Keep the migration comment short and concrete.\nconst value = 1;",
                name: "accepts neutral prose comments",
            },
            {
                code: "// Use `master` only as the literal legacy config key.\nconst value = 1;",
                name: "ignores markdown code spans inside comments",
            },
            {
                code: '// The vendor quote still mentions "slave" in historical prose.\nconst value = 1;',
                name: "ignores literal quoted words treated as quoted literals",
            },
            {
                code: "// If a user changes his or her password, send a receipt.\nconst value = 1;",
                name: "allows binary pairings by default",
            },
            {
                code: "// Use the master branch until the rename lands.\nconst value = 1;",
                name: "respects allow-listed equality rule ids",
                options: [
                    {
                        allow: ["master"],
                    },
                ],
            },
            {
                code: "// istanbul ignore next\nconst value = 1;",
                name: "ignores directive comments",
            },
        ],
    }
);
