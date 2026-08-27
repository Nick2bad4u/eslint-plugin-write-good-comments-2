/**
 * @packageDocumentation
 * ESLint rule that runs `write-good` against source comments.
 */

import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import type { JavaScriptRuleModule } from "../_internal/javascript-rule-module.js";

import {
    createCommentProseLintText,
    createCommentValueSourceLocation,
    isIgnoredCommentText,
} from "../_internal/comment-prose.js";
import {
    writeGood,
    type WriteGoodOptions,
    type WriteGoodSuggestion,
} from "../_internal/write-good.js";

/** Message ids emitted by this rule. */
type MessageIds = "suggestion";

/** Configurable rule options. */
type Options = [WriteGoodOptions?];

/** Extra docs metadata carried by this plugin's rules. */
type PluginDocs = Readonly<{
    recommended: boolean;
}>;

/** Default options for write-good-comments. */
const defaultWriteGoodCommentsOptions = {} as const satisfies WriteGoodOptions;

/**
 * Convert a suggestion offset into an ESLint location.
 *
 * @param comment - Source comment token.
 * @param sourceCode - Source code utility object.
 * @param suggestion - Upstream write-good suggestion.
 *
 * @returns ESLint location for the suggestion span.
 */
const createSuggestionLocation = (
    comment: Readonly<TSESTree.Comment>,
    sourceCode: Readonly<TSESLint.SourceCode>,
    suggestion: WriteGoodSuggestion
): TSESLint.AST.SourceLocation =>
    createCommentValueSourceLocation(
        comment,
        sourceCode,
        suggestion.index,
        suggestion.index + Math.max(suggestion.offset, 1)
    );

/**
 * Create the runtime write-good-comments rule.
 */
const writeGoodCommentsRule: JavaScriptRuleModule<
    MessageIds,
    Options,
    PluginDocs
> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [options = defaultWriteGoodCommentsOptions] = context.options;

        const onProgram = (): void => {
            for (const comment of sourceCode.getAllComments()) {
                const lintText = createCommentProseLintText(comment);
                const trimmedLintText = lintText.trim();

                if (isIgnoredCommentText(trimmedLintText)) {
                    continue;
                }

                const suggestions = writeGood(lintText, options);

                for (const suggestion of suggestions) {
                    context.report({
                        data: {
                            reason: suggestion.reason.trim(),
                        },
                        loc: createSuggestionLocation(
                            comment,
                            sourceCode,
                            suggestion
                        ),
                        messageId: "suggestion",
                    });
                }
            }
        };

        return { Program: onProgram };
    },
    meta: {
        defaultOptions: [defaultWriteGoodCommentsOptions],
        deprecated: false,
        docs: {
            description:
                "enforce high-quality prose in source comments with write-good.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/write-good-comments",
        },
        languages: ["js/js"],
        messages: {
            suggestion: "{{reason}}",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Optional write-good checks and whitelist terms for comment prose linting.",
                properties: {
                    adverb: {
                        description:
                            "Enable or disable adverb detection in comments.",
                        type: "boolean",
                    },
                    cliches: {
                        description:
                            "Enable or disable cliche detection in comments.",
                        type: "boolean",
                    },
                    eprime: {
                        description:
                            "Enable or disable e-prime detection in comments.",
                        type: "boolean",
                    },
                    illusion: {
                        description:
                            "Enable or disable lexical-illusion detection in comments.",
                        type: "boolean",
                    },
                    passive: {
                        description:
                            "Enable or disable passive-voice detection in comments.",
                        type: "boolean",
                    },
                    so: {
                        description:
                            "Enable or disable leading-'so' detection in comments.",
                        type: "boolean",
                    },
                    thereIs: {
                        description:
                            "Enable or disable 'there is' phrasing detection in comments.",
                        type: "boolean",
                    },
                    tooWordy: {
                        description:
                            "Enable or disable overly wordy phrase detection in comments.",
                        type: "boolean",
                    },
                    weasel: {
                        description:
                            "Enable or disable weasel-word detection in comments.",
                        type: "boolean",
                    },
                    whitelist: {
                        description:
                            "Allow listed terms to pass without write-good reports.",
                        items: {
                            description: "One literal term to ignore.",
                            type: "string",
                        },
                        type: "array",
                        uniqueItems: true,
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
};

export default writeGoodCommentsRule;
