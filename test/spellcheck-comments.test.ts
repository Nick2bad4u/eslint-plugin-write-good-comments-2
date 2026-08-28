/**
 * @packageDocumentation
 * Behavioral tests for the spellcheck-comments rule.
 */

import {
    jsdocBlockTagConventionsFixture,
    toolControlCommentConventionsFixture,
} from "./_internal/comment-fixtures";
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
                " * @property {string} documeant",
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
        {
            code: "// Keep the comment accurate.\nconst value = 1;",
            errors: [
                {
                    messageId: "dictionaryLoadFailed",
                },
            ],
            name: "reports unreadable cspell-style word list files once per file",
            options: [
                {
                    ignoreWordFiles: [
                        "test/fixtures/spellcheck/missing-cspell-words.txt",
                    ],
                },
            ],
        },
        {
            code: "// Keep the comment accurate.\nconst value = 1;",
            errors: [
                {
                    messageId: "dictionaryLoadFailed",
                },
            ],
            name: "reports unreadable imported cspell config resources once per file",
            options: [
                {
                    cspellConfigImports: [
                        "./test/fixtures/spellcheck/missing-cspell.config.json",
                    ],
                },
            ],
        },
        {
            code: "// Read the [documeant guide](https://example.test/useles-path).\nconst value = 1;",
            errors: [
                {
                    column: 14,
                    endColumn: 23,
                    line: 1,
                    messageId: "problem",
                },
            ],
            name: "checks markdown link labels while ignoring destinations",
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
            code: "// Keep the powershell sql mime makefile licence note concise.\nconst value = 1;",
            name: "accepts expanded default cspell dictionary vocabulary",
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
            code: "// Keep the acmecloud synclet changelog accurate.\nconst value = 1;",
            name: "accepts repo vocabulary loaded from cspell-style word list files",
            options: [
                {
                    ignoreWordFiles: [
                        "test/fixtures/spellcheck/cspell-words.txt",
                    ],
                },
            ],
        },
        {
            code: "// Keep the cargo clippy note accurate.\nconst value = 1;",
            name: "accepts imported cspell package dictionaries",
            options: [
                {
                    cspellConfigImports: ["@cspell/dict-rust/cspell-ext.json"],
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
                " * @property {string} documeant",
                " */",
                "const value = 1;",
            ].join("\n"),
            name: "ignores misspellings inside JSDoc block tags",
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
