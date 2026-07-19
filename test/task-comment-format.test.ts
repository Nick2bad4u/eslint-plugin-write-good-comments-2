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
            code: "// TODO @jane\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports task comments that only include handle metadata",
        },
        {
            code: "// TODO PROJ-123\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports task comments that only include unwrapped issue keys",
        },
        {
            code: "// TODO(jane)\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports task comments that only include a parenthesized owner",
            output: null,
        },
        {
            code: "// TODO(@jane)\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports task comments that only include a parenthesized handle",
        },
        {
            code: "// TODO [PROJ-123]\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports task comments that only include a bracketed keyed issue",
        },
        {
            code: "// TODO @jane #123\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports task comments that only include multiple metadata tokens",
        },
        {
            code: "// TODO @longowner-\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "treats trailing hyphens after handles as separators",
        },
        {
            code: "// TODO [#123\nconst value = 1;",
            errors: [
                {
                    messageId: "missingDescription",
                },
            ],
            name: "reports an unclosed short bracket as insufficient prose",
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
            code: "// TODO123 remains a tracking code, not a task marker.\nconst value = 1;",
            name: "ignores identifier continuations after task markers",
        },
        {
            code: "// TODO: remove the temporary fallback after API v2 ships.\nconst value = 1;",
            name: "accepts descriptive TODO comments",
        },
        {
            code: "// TODO: (This is broken)\nconst value = 1;",
            name: "keeps multiword parenthesized text as descriptive prose",
        },
        {
            code: "// TODO [Needs redesign]\nconst value = 1;",
            name: "keeps multiword bracketed text as descriptive prose",
        },
        {
            code: "// TODO (This is broken\nconst value = 1;",
            name: "keeps an unclosed parenthesis as descriptive prose",
        },
        {
            code: "// TODO [Needs redesign\nconst value = 1;",
            name: "keeps an unclosed bracket as descriptive prose",
        },
        {
            code: "// TODO (jane]\nconst value = 1;",
            name: "keeps mismatched parentheses as descriptive prose",
            options: [
                {
                    minDescriptionLength: 6,
                },
            ],
        },
        {
            code: "// TODO [#123)\nconst value = 1;",
            name: "keeps mismatched brackets as descriptive prose",
            options: [
                {
                    minDescriptionLength: 6,
                },
            ],
        },
        {
            code: "// TODO [owner]\nconst value = 1;",
            name: "does not treat a bracketed owner as issue metadata",
            options: [
                {
                    minDescriptionLength: 7,
                },
            ],
        },
        {
            code: "// TODO [] x\nconst value = 1;",
            name: "keeps empty brackets as descriptive text",
            options: [
                {
                    minDescriptionLength: 4,
                },
            ],
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
        {
            code: "// TODO @jane #123: remove this fallback after the API migration.\nconst value = 1;",
            name: "accepts multiple metadata tokens before descriptive prose",
        },
        {
            code: "// FIXME(@jane) [PROJ-123] #456: handle null input from the adapter.\nconst value = 1;",
            name: "accepts all supported metadata forms before descriptive prose",
        },
        {
            code: "// TODO #123abc\nconst value = 1;",
            name: "does not consume a partial hash issue reference",
            options: [
                {
                    minDescriptionLength: 7,
                },
            ],
        },
        {
            code: "// TODO PROJ-123abc\nconst value = 1;",
            name: "does not consume a partial keyed issue reference",
            options: [
                {
                    minDescriptionLength: 11,
                },
            ],
        },
        {
            code: "// note: keep the lowercase marker working after normalization.\nconst value = 1;",
            name: "normalizes custom task markers before matching",
            options: [
                {
                    terms: ["note"],
                },
            ],
        },
    ],
});
