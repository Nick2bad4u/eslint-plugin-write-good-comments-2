/**
 * @packageDocumentation
 * Strong contract tests for shipped rule metadata.
 */

import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

const expectedRuleDocsUrls = {
    "inclusive-language-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/inclusive-language-comments",
    "no-profane-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/no-profane-comments",
    "readability-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/readability-comments",
    "spellcheck-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/spellcheck-comments",
    "task-comment-format":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/task-comment-format",
    "write-good-comments":
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments",
} as const;

const expectedRuleMetadata = {
    "inclusive-language-comments": {
        descriptionPattern: /considerate|inclusive/iv,
        messages: {
            problem: "{{reason}}",
        },
        recommended: true,
    },
    "no-profane-comments": {
        descriptionPattern: /profane/iv,
        messages: {
            problem: "{{reason}}",
        },
        recommended: false,
    },
    "readability-comments": {
        descriptionPattern: /hard to read|readability/iv,
        messages: {
            problem: "{{reason}}",
        },
        recommended: false,
    },
    "spellcheck-comments": {
        descriptionPattern: /spellcheck|spell/iv,
        messages: {
            dictionaryLoadFailed:
                "Could not load spellcheck cspell resources: {{details}}",
            problem: "{{reason}}",
        },
        recommended: false,
    },
    "task-comment-format": {
        descriptionPattern: /todo-style task comments/iv,
        messages: {
            missingDescription:
                "{{term}} comments must include a descriptive task or reason after the marker.",
        },
        recommended: true,
    },
    "write-good-comments": {
        descriptionPattern: /write-good/iv,
        messages: {
            suggestion: "{{reason}}",
        },
        recommended: true,
    },
} as const;

describe("rule metadata integrity", () => {
    it("ships the expected metadata contract for every rule", () => {
        expect.hasAssertions();

        for (const [ruleName, rule] of Object.entries(plugin.rules)) {
            const metadata =
                expectedRuleMetadata[
                    ruleName as keyof typeof expectedRuleMetadata
                ];

            if (metadata === undefined) {
                throw new Error(`Unexpected rule '${ruleName}'.`);
            }

            expect(rule.meta?.type).toBe("suggestion");
            expect(rule.meta?.schema).toHaveLength(1);

            expect(rule.meta?.docs?.url).toBe(
                expectedRuleDocsUrls[
                    ruleName as keyof typeof expectedRuleDocsUrls
                ]
            );
            expect(rule.meta?.docs?.description).toMatch(
                metadata.descriptionPattern
            );
            expect(rule.meta?.docs?.recommended).toBe(metadata.recommended);
            expect(rule.meta?.messages).toStrictEqual(metadata.messages);
        }
    });
});
