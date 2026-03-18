/**
 * @packageDocumentation
 * ESLint rule that spellchecks source comments with retext-spell.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import retextSpell from "retext-spell";

import { getSpellcheckDictionary } from "../../spellcheck-dictionary.cjs";
import {
    createCommentLintText,
    isIgnoredCommentText,
} from "../_internal/comment-prose.js";
import { resolveDefaultExport } from "../_internal/default-export.js";
import {
    createRetextMessageSourceLocation,
    lintMarkdownWithRetext,
} from "../_internal/retext.js";
import { defaultSpellcheckIgnoreWords } from "../_internal/spellcheck-default-words.js";

/** Message ids emitted by this rule. */
type MessageIds = "problem";

/** Configurable rule options tuple. */
type Options = [SpellcheckCommentsOptions?];

/** Configurable spellcheck rule options. */
type SpellcheckCommentsOptions = Readonly<{
    ignoreDigits?: boolean;
    ignoreLiteral?: boolean;
    ignoreWords?: readonly string[];
    maxSuggestions?: number;
    normalizeApostrophes?: boolean;
}>;

/** Default options for spellcheck-comments. */
const defaultSpellcheckCommentsOptions = {
    ignoreDigits: true,
    ignoreLiteral: true,
    ignoreWords: [],
    maxSuggestions: 5,
    normalizeApostrophes: true,
} as const satisfies SpellcheckCommentsOptions;

/** Merge built-in and user-provided spellcheck ignore words. */
const createSpellcheckIgnoreWords = (
    options: Readonly<SpellcheckCommentsOptions>
): readonly string[] => [
    ...new Set([
        ...defaultSpellcheckIgnoreWords,
        ...(options.ignoreWords ?? []),
    ]),
];

/** Create the runtime spellcheck-comments rule. */
const spellcheckCommentsRule: TSESLint.RuleModule<MessageIds, Options> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [options = defaultSpellcheckCommentsOptions] = context.options;
        const dictionary = getSpellcheckDictionary();
        const ignoreWords = createSpellcheckIgnoreWords(options);

        return {
            Program() {
                for (const comment of sourceCode.getAllComments()) {
                    const lintText = createCommentLintText(comment);
                    const trimmedLintText = lintText.trim();

                    if (isIgnoredCommentText(trimmedLintText)) {
                        continue;
                    }

                    for (const message of lintMarkdownWithRetext(
                        lintText,
                        (processor) => {
                            processor.use(resolveDefaultExport(retextSpell), {
                                dictionary,
                                ignore: ignoreWords,
                                ignoreDigits: options.ignoreDigits,
                                ignoreLiteral: options.ignoreLiteral,
                                max: options.maxSuggestions,
                                normalizeApostrophes:
                                    options.normalizeApostrophes,
                            });
                        }
                    )) {
                        if (message.source !== "retext-spell") {
                            continue;
                        }

                        context.report({
                            data: {
                                reason: message.reason.trim(),
                            },
                            loc: createRetextMessageSourceLocation(
                                comment,
                                sourceCode,
                                message
                            ),
                            messageId: "problem",
                        });
                    }
                }
            },
        };
    },
    defaultOptions: [defaultSpellcheckCommentsOptions],
    meta: {
        defaultOptions: [defaultSpellcheckCommentsOptions],
        deprecated: false,
        docs: {
            description:
                "enforce correct spelling in source comments with retext-spell and a curated technical vocabulary.",
            frozen: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/spellcheck-comments",
        },
        messages: {
            problem: "{{reason}}",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Optional spellcheck controls for comment prose, including extra accepted technical vocabulary.",
                properties: {
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
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
};

export default spellcheckCommentsRule;
