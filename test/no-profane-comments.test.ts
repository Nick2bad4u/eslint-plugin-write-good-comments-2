/**
 * @packageDocumentation
 * Behavioral tests for the no-profane-comments rule.
 */

import {
    jsdocBlockTagConventionsFixture,
    toolControlCommentConventionsFixture,
} from "./_internal/comment-fixtures";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

ruleTester.run("no-profane-comments", getPluginRule("no-profane-comments"), {
    invalid: [
        {
            code: "// This fallback is a pain in the butt.\nconst value = 1;",
            errors: [
                {
                    messageId: "problem",
                },
            ],
            name: "reports profane wording in line comments",
        },
        {
            code: [
                "/*",
                " * slave replicas still follow the leader node.",
                " */",
                "const value = 1;",
            ].join("\n"),
            errors: [
                {
                    messageId: "problem",
                },
            ],
            name: "reports profane wording in decorated block comments",
        },
        {
            code: [
                "/**",
                " * This fallback is a pain in the butt.",
                " * @property {string} slave",
                " */",
                "const value = 1;",
            ].join("\n"),
            errors: [
                {
                    messageId: "problem",
                },
            ],
            name: "reports profane leading JSDoc prose but ignores block tags",
        },
    ],
    valid: [
        {
            code: "// Keep the rollback path available for one more release.\nconst value = 1;",
            name: "accepts non-profane comments",
        },
        {
            code: "// Use `slave` only as the literal legacy config key.\nconst value = 1;",
            name: "ignores markdown code spans inside comments",
        },
        {
            code: "// This fallback is a pain in the butt.\nconst value = 1;",
            name: "respects minimum profanity sureness",
            options: [
                {
                    profanitySureness: 1,
                },
            ],
        },
        {
            code: "// slave replicas still follow the leader node.\nconst value = 1;",
            name: "respects allow-listed profanity rule ids",
            options: [
                {
                    allow: ["slave"],
                },
            ],
        },
        {
            code: "// @ts-expect-error -- temporary escape hatch for legacy API mismatch.\nconst value = 1 as never;",
            name: "ignores directive comments",
        },
        {
            code: [
                "/**",
                " * @property {string} slave",
                " */",
                "const value = 1;",
            ].join("\n"),
            name: "ignores profane terms inside JSDoc block tags",
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
