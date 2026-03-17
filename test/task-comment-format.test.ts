/**
 * @packageDocumentation
 * Behavioral tests for the task-comment-format rule.
 */

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

ruleTester.run("task-comment-format", getPluginRule("task-comment-format"), {
    invalid: [
        {
            code: "// TODO\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports a bare TODO marker",
        },
        {
            code: "// FIXME:\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports task comments that stop after punctuation",
        },
        {
            code: "/* HACK (legacy) */\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports task comments that only include owner-style metadata",
        },
        {
            code: [
                "/*",
                " * TODO [#123]",
                " */",
                "const value = 1;",
            ].join("\n"),
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports task comments that only include issue metadata",
        },
        {
            code: "// NOTE:\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "supports custom task markers",
            options: [
                {
                    terms: ["NOTE"],
                },
            ],
        },
        {
            code: "// TODO: soon\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "enforces minimum description length",
            options: [
                {
                    minDescriptionLength: 6,
                },
            ],
        },
    ],
    valid: [
        {
            code: "// Regular prose comment.\nconst value = 1;",
            name: "ignores non-task comments",
        },
        {
            code: "// TODO: remove the temporary fallback after API v2 ships.\nconst value = 1;",
            name: "accepts descriptive TODO comments",
        },
        {
            code: "// FIXME(jane): handle null input from the partner API.\nconst value = 1;",
            name: "accepts owner metadata before the description",
        },
        {
            code: [
                "/*",
                " * TODO [PROJ-123]: migrate this to the async adapter after release.",
                " */",
                "const value = 1;",
            ].join("\n"),
            name: "accepts block comments with issue metadata and prose",
        },
        {
            code: [
                "/**",
                " * TODO: explain why the fallback stays until the legacy API retires.",
                " */",
                "const value = 1;",
            ].join("\n"),
            name: "accepts decorated block comments",
        },
        {
            code: "// istanbul ignore next\nconst value = 1;",
            name: "ignores directive comments",
        },
        {
            code: "// @typescript-eslint/no-explicit-any\nconst value = 1;",
            name: "ignores rule-id comments from scoped plugin namespaces",
        },
        {
            code: "// NOTE: keep docs generation stable during the rename.\nconst value = 1;",
            name: "respects custom marker configuration",
            options: [
                {
                    terms: ["NOTE"],
                },
            ],
        },
    ],
});
