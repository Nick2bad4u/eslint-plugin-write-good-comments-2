/**
 * @packageDocumentation
 * ESLint rule that runs `write-good` against source comments.
 */

import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import {
    writeGood,
    type WriteGoodOptions,
    type WriteGoodSuggestion,
} from "../_internal/write-good.js";

/** Message ids emitted by this rule. */
type MessageIds = "suggestion";

/** Configurable rule options. */
type Options = [WriteGoodOptions?];

/** Absolute offset of comment content inside its full source token. */
const COMMENT_CONTENT_START_OFFSET = 2;

/** Pattern for directive-style comments that should not be linted as prose. */
const ignoredCommentPattern =
    /^(?:@ts-|c8\b|cspell\b|eslint\b|eslint-|exported\b|global\b|globals\b|istanbul\b|jshint\b|jslint\b|spell-checker:|ts-check\b|ts-expect-error\b|ts-ignore\b|ts-nocheck\b|tslint\b)/iu;

/** Leading JSDoc-style decoration to neutralize in block comments. */
const blockCommentDecorationPattern = /^[\t\v\f ]*\*(?:[\t ]|$)/u;

/**
 * Determine whether a comment should be ignored entirely.
 *
 * @param commentText - Trimmed comment text after block-comment normalization.
 *
 * @returns `true` when the comment is a directive or empty.
 */
const isIgnoredComment = (commentText: string): boolean => {
    if (commentText.length === 0) {
        return true;
    }

    return ignoredCommentPattern.test(commentText);
};

/**
 * Neutralize decorative block-comment prefixes while preserving source offsets.
 *
 * @param comment - Source comment token.
 *
 * @returns Lint text with stable indexing relative to `comment.value`.
 */
const createLintText = (comment: Readonly<TSESTree.Comment>): string => {
    const characters = [...comment.value];

    const replaceRangeWithSpaces = (
        startIndex: number,
        endIndex: number
    ): void => {
        for (let index = startIndex; index < endIndex; index += 1) {
            if (characters[index] !== "\r" && characters[index] !== "\n") {
                characters[index] = " ";
            }
        }
    };

    replaceRangeWithSpaces(
        0,
        comment.value.length - comment.value.trimStart().length
    );
    replaceRangeWithSpaces(
        comment.value.trimEnd().length,
        comment.value.length
    );

    if (comment.type !== "Block") {
        return characters.join("");
    }

    let lineStartIndex = 0;

    while (lineStartIndex <= comment.value.length) {
        const carriageReturnIndex = comment.value.indexOf("\r", lineStartIndex);
        const lineFeedIndex = comment.value.indexOf("\n", lineStartIndex);
        let lineEndIndex = comment.value.length;

        if (carriageReturnIndex !== -1) {
            lineEndIndex = Math.min(lineEndIndex, carriageReturnIndex);
        }

        if (lineFeedIndex !== -1) {
            lineEndIndex = Math.min(lineEndIndex, lineFeedIndex);
        }

        const lineText = comment.value.slice(lineStartIndex, lineEndIndex);
        const decorationMatch = blockCommentDecorationPattern.exec(lineText);

        if (decorationMatch?.[0] !== undefined) {
            replaceRangeWithSpaces(
                lineStartIndex,
                lineStartIndex + decorationMatch[0].length
            );
        }

        if (lineEndIndex >= comment.value.length) {
            break;
        }

        const hasCarriageReturn = comment.value[lineEndIndex] === "\r";
        lineStartIndex =
            hasCarriageReturn && comment.value[lineEndIndex + 1] === "\n"
                ? lineEndIndex + 2
                : lineEndIndex + 1;
    }

    return characters.join("");
};

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
): TSESLint.AST.SourceLocation => {
    const commentValueStartIndex =
        comment.range[0] + COMMENT_CONTENT_START_OFFSET;
    const suggestionStartIndex = commentValueStartIndex + suggestion.index;
    const suggestionEndIndex =
        suggestionStartIndex + Math.max(suggestion.offset, 1);

    return {
        end: sourceCode.getLocFromIndex(suggestionEndIndex),
        start: sourceCode.getLocFromIndex(suggestionStartIndex),
    };
};

/**
 * Create the runtime write-good-comments rule.
 */
const writeGoodCommentsRule: TSESLint.RuleModule<MessageIds, Options> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [options = {}] = context.options;

        return {
            Program() {
                for (const comment of sourceCode.getAllComments()) {
                    const lintText = createLintText(comment);
                    const trimmedLintText = lintText.trim();

                    if (isIgnoredComment(trimmedLintText)) {
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
            },
        };
    },
    defaultOptions: [{}],
    meta: {
        defaultOptions: [{}],
        docs: {
            description:
                "enforce high-quality prose in source comments with write-good.",
            // @ts-expect-error -- eslint-plugin metadata lint rules require this legacy property.
            recommended: true,
            url: createRuleDocsUrl("write-good-comments"),
        },
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
