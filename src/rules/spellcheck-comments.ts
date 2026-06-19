/**
 * @packageDocumentation
 * ESLint rule that spellchecks source comments with cspell dictionaries.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import { arrayJoin } from "ts-extras";

import {
    createCommentLintText,
    createCommentValueSourceLocation,
    isIgnoredCommentText,
} from "../_internal/comment-prose.js";
import { projectMarkdownCommentText } from "../_internal/retext.js";
import {
    createSpellcheckCspellDictionaryCollection,
    spellcheckProjectedTextWithCspell,
} from "../_internal/spellcheck-cspell.js";
import { defaultSpellcheckIgnoreWords } from "../_internal/spellcheck-default-words.js";

/** Message ids emitted by this rule. */
type MessageIds = "dictionaryLoadFailed" | "problem";

/** Configurable rule options tuple. */
type Options = [SpellcheckCommentsOptions?];

/** Extra docs metadata carried by this plugin's rules. */
type PluginDocs = Readonly<{
    recommended: boolean;
}>;

/** Configurable spellcheck rule options. */
type SpellcheckCommentsOptions = Readonly<{
    cspellConfigImports?: readonly string[];
    ignoreDigits?: boolean;
    ignoreLiteral?: boolean;
    ignoreWordFiles?: readonly string[];
    ignoreWords?: readonly string[];
    maxSuggestions?: number;
    normalizeApostrophes?: boolean;
    useDefaultDictionaries?: boolean;
}>;

/** Default options for spellcheck-comments. */
const defaultSpellcheckCommentsOptions = {
    cspellConfigImports: [],
    ignoreDigits: true,
    ignoreLiteral: true,
    ignoreWordFiles: [],
    ignoreWords: [],
    maxSuggestions: 5,
    normalizeApostrophes: true,
    useDefaultDictionaries: true,
} as const satisfies SpellcheckCommentsOptions;

/** Merge built-in and user-provided spellcheck ignore words. */
const createSpellcheckIgnoreWords = (
    options: Readonly<SpellcheckCommentsOptions>,
    loadedIgnoreWords: readonly string[]
): readonly string[] => {
    const configuredIgnoreWords = options.ignoreWords ?? [];

    return [
        // eslint-disable-next-line unicorn/prefer-iterator-concat -- Iterator.concat is not available in this package's runtime target.
        ...new Set([
            ...defaultSpellcheckIgnoreWords,
            ...loadedIgnoreWords,
            ...configuredIgnoreWords,
        ]),
    ];
};

/** Format cspell resource load problems into one actionable ESLint report. */
const formatDictionaryLoadErrors = (
    resourceErrors: readonly Readonly<{ message: string; resource: string }>[]
): string =>
    arrayJoin(
        resourceErrors.map(
            ({ message, resource }) => `${resource}: ${message}`
        ),
        "; "
    );

/** Create the runtime spellcheck-comments rule. */
const spellcheckCommentsRule: TSESLint.RuleModule<
    MessageIds,
    Options,
    PluginDocs
> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [options = defaultSpellcheckCommentsOptions] = context.options;
        const normalizedOptions = {
            cspellConfigImports:
                options.cspellConfigImports ??
                defaultSpellcheckCommentsOptions.cspellConfigImports,
            ignoreDigits:
                options.ignoreDigits ??
                defaultSpellcheckCommentsOptions.ignoreDigits,
            ignoreLiteral:
                options.ignoreLiteral ??
                defaultSpellcheckCommentsOptions.ignoreLiteral,
            ignoreWordFiles:
                options.ignoreWordFiles ??
                defaultSpellcheckCommentsOptions.ignoreWordFiles,
            ignoreWords:
                options.ignoreWords ??
                defaultSpellcheckCommentsOptions.ignoreWords,
            maxSuggestions:
                options.maxSuggestions ??
                defaultSpellcheckCommentsOptions.maxSuggestions,
            normalizeApostrophes:
                options.normalizeApostrophes ??
                defaultSpellcheckCommentsOptions.normalizeApostrophes,
            useDefaultDictionaries:
                options.useDefaultDictionaries ??
                defaultSpellcheckCommentsOptions.useDefaultDictionaries,
        };
        const ignoreWords = createSpellcheckIgnoreWords(normalizedOptions, []);
        const spellcheckDictionaryCollection =
            createSpellcheckCspellDictionaryCollection({
                configImports: normalizedOptions.cspellConfigImports,
                cwd: process.cwd(),
                ignoreWordFiles: normalizedOptions.ignoreWordFiles,
                ignoreWords,
                useDefaultDictionaries:
                    normalizedOptions.useDefaultDictionaries,
            });

        const spellcheckRuntimeOptions = {
            ignoreDigits: normalizedOptions.ignoreDigits,
            ignoreLiteral: normalizedOptions.ignoreLiteral,
            maxSuggestions: normalizedOptions.maxSuggestions,
            normalizeApostrophes: normalizedOptions.normalizeApostrophes,
        };

        const reportIssueLocation = (
            comment: Parameters<typeof createCommentLintText>[0],
            issue: Readonly<{ endOffset: number; startOffset: number }>
        ) =>
            createCommentValueSourceLocation(
                comment,
                sourceCode,
                issue.startOffset,
                issue.endOffset
            );

        const reportSpellcheckProblems = (
            comment: Parameters<typeof createCommentLintText>[0],
            lintText: string
        ): void => {
            const projectedLintText = projectMarkdownCommentText(lintText);

            for (const issue of spellcheckProjectedTextWithCspell(
                projectedLintText,
                spellcheckDictionaryCollection.collection,
                spellcheckRuntimeOptions
            )) {
                context.report({
                    data: {
                        reason: issue.reason,
                    },
                    loc: reportIssueLocation(comment, issue),
                    messageId: "problem",
                });
            }
        };

        return {
            Program(program) {
                if (spellcheckDictionaryCollection.errors.length > 0) {
                    context.report({
                        data: {
                            details: formatDictionaryLoadErrors(
                                spellcheckDictionaryCollection.errors
                            ),
                        },
                        messageId: "dictionaryLoadFailed",
                        node: program,
                    });
                }

                for (const comment of sourceCode.getAllComments()) {
                    const trimmedCommentValue = comment.value.trim();

                    if (isIgnoredCommentText(trimmedCommentValue)) {
                        continue;
                    }

                    const lintText = createCommentLintText(comment);

                    reportSpellcheckProblems(comment, lintText);
                }
            },
        };
    },
    meta: {
        defaultOptions: [defaultSpellcheckCommentsOptions],
        deprecated: false,
        docs: {
            description:
                "enforce correct spelling in source comments with cspell dictionaries, curated technical vocabulary, and optional imported cspell configs.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/spellcheck-comments",
        },
        messages: {
            dictionaryLoadFailed:
                "Could not load spellcheck cspell resources: {{details}}",
            problem: "{{reason}}",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Optional spellcheck controls for comment prose, including extra accepted technical vocabulary.",
                properties: {
                    cspellConfigImports: {
                        description:
                            "Additional cspell config resources to import, such as package dictionary configs or local cspell json/yaml files.",
                        items: {
                            minLength: 1,
                            type: "string",
                        },
                        type: "array",
                        uniqueItems: true,
                    },
                    ignoreDigits: {
                        description:
                            "Ignore words that include digits such as versioned identifiers.",
                        type: "boolean",
                    },
                    ignoreLiteral: {
                        description:
                            "Ignore quoted literals such as 'teh' or \"cfg\".",
                        type: "boolean",
                    },
                    ignoreWordFiles: {
                        description:
                            "Paths to cspell-style word-list files that should be accepted without spellcheck reports.",
                        items: {
                            minLength: 1,
                            type: "string",
                        },
                        type: "array",
                        uniqueItems: true,
                    },
                    ignoreWords: {
                        description:
                            "Additional domain-specific words to accept without spellcheck reports.",
                        items: {
                            minLength: 1,
                            type: "string",
                        },
                        type: "array",
                        uniqueItems: true,
                    },
                    maxSuggestions: {
                        description:
                            "Maximum number of candidate spellings to include in each report.",
                        minimum: 1,
                        type: "integer",
                    },
                    normalizeApostrophes: {
                        description:
                            "Normalize curly and straight apostrophes before spellchecking.",
                        type: "boolean",
                    },
                    useDefaultDictionaries: {
                        description:
                            "Load the rule's built-in cspell dictionary imports for English and common coding terminology.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
};

export default spellcheckCommentsRule;
