/**
 * @packageDocumentation
 * ESLint rule that enforces descriptive task-marker comments.
 */

import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { isDefined, setHas } from "ts-extras";

import {
    createCommentLintText,
    createCommentValueSourceLocation,
    isIgnoredCommentText,
} from "../_internal/comment-prose.js";

/** Message ids emitted by this rule. */
type MessageIds = "missingDescription";

/** Configurable rule options tuple. */
type Options = [TaskCommentFormatOptions?];

/** Extra docs metadata carried by this plugin's rules. */
type PluginDocs = Readonly<{
    recommended: boolean;
}>;

/** Configurable rule options. */
type TaskCommentFormatOptions = Readonly<{
    minDescriptionLength?: number;
    terms?: readonly string[];
}>;

/** Default task markers treated as task comments. */
const defaultTaskCommentTerms = [
    "TODO",
    "FIXME",
    "XXX",
    "HACK",
] as const;

/** Default minimum descriptive text length after task-comment metadata. */
const DEFAULT_MIN_DESCRIPTION_LENGTH = 8;

/** Default options for task-comment-format. */
const defaultTaskCommentFormatOptions = {
    minDescriptionLength: DEFAULT_MIN_DESCRIPTION_LENGTH,
    terms: [...defaultTaskCommentTerms],
} as const satisfies TaskCommentFormatOptions;

/** Punctuation separators allowed between task-comment metadata and prose. */
const separatorPattern = /^(?::+|-+|—+)\s*/u;

/** Identifier-like characters that can continue a task marker token. */
const identifierContinuationPattern = /^[\p{L}\p{N}_]/u;

/** Handle characters commonly used in task-comment metadata. */
const taskCommentHandleCharacterPattern = /^[\w\-.]$/iu;

/** Space characters that may trail metadata tokens. */
const spacePattern = /^\s$/u;

/** ASCII alphanumeric characters used in issue keys. */
const asciiAlphaNumericPattern = /^[\da-z]$/iu;

/** Decimal digits used in issue numbers. */
const digitPattern = /^\d$/u;

/**
 * Match a configured task marker at the start of a trimmed comment.
 *
 * @param text - Trimmed comment text.
 * @param normalizedTerms - Uppercased task markers to match.
 *
 * @returns The matched marker text, or `null` when no configured marker
 *   matches.
 */
const matchTaskCommentTerm = (
    text: string,
    normalizedTerms: readonly string[]
): null | string => {
    const uppercasedText = text.toUpperCase();

    for (const normalizedTerm of normalizedTerms) {
        if (!uppercasedText.startsWith(normalizedTerm)) {
            continue;
        }

        const nextCharacter = text.slice(
            normalizedTerm.length,
            normalizedTerm.length + 1
        );

        if (
            nextCharacter.length > 0 &&
            identifierContinuationPattern.test(nextCharacter)
        ) {
            continue;
        }

        return text.slice(0, normalizedTerm.length);
    }

    return null;
};

/**
 * Extend a matched metadata token to include trailing spaces.
 *
 * @param text - Remaining task-comment text.
 * @param tokenLength - Length of the non-space metadata token.
 *
 * @returns Metadata token plus trailing spaces.
 */
const withTrailingWhitespace = (text: string, tokenLength: number): string => {
    let endOffset = tokenLength;

    while (endOffset < text.length) {
        const character = text.slice(endOffset, endOffset + 1);

        if (!spacePattern.test(character)) {
            break;
        }

        endOffset += 1;
    }

    return text.slice(0, endOffset);
};

/**
 * Match parenthesized metadata such as `(nick)`.
 *
 * @param text - Remaining task-comment text.
 *
 * @returns The matched metadata token, or `null` when none is present.
 */
const matchParenthesizedMetadata = (text: string): null | string => {
    if (!text.startsWith("(")) {
        return null;
    }

    const closingOffset = text.indexOf(")", 1);

    if (closingOffset <= 1) {
        return null;
    }

    const innerText = new Set(text.slice(1, closingOffset));

    if (setHas(innerText, "\n") || setHas(innerText, "\r")) {
        return null;
    }

    return withTrailingWhitespace(text, closingOffset + 1);
};

/**
 * Match bracketed metadata such as `[ABC-123]`.
 *
 * @param text - Remaining task-comment text.
 *
 * @returns The matched metadata token, or `null` when none is present.
 */
const matchBracketedMetadata = (text: string): null | string => {
    if (!text.startsWith("[")) {
        return null;
    }

    const closingOffset = text.indexOf("]", 1);

    if (closingOffset <= 1) {
        return null;
    }

    const innerText = new Set(text.slice(1, closingOffset));

    if (setHas(innerText, "\n") || setHas(innerText, "\r")) {
        return null;
    }

    return withTrailingWhitespace(text, closingOffset + 1);
};

/**
 * Match handle metadata such as `@nick`.
 *
 * @param text - Remaining task-comment text.
 *
 * @returns The matched metadata token, or `null` when none is present.
 */
const matchHandleMetadata = (text: string): null | string => {
    if (!text.startsWith("@")) {
        return null;
    }

    let endOffset = 1;

    while (endOffset < text.length) {
        const character = text.slice(endOffset, endOffset + 1);

        if (!taskCommentHandleCharacterPattern.test(character)) {
            break;
        }

        endOffset += 1;
    }

    if (endOffset === 1) {
        return null;
    }

    return withTrailingWhitespace(text, endOffset);
};

/**
 * Consume characters while they satisfy a predicate.
 *
 * @param text - Source text to scan.
 * @param startOffset - Zero-based start offset.
 * @param predicate - Predicate that decides whether scanning should continue.
 *
 * @returns Offset immediately after the consumed span.
 */
const consumeWhile = (
    text: string,
    startOffset: number,
    predicate: (character: string) => boolean
): number => {
    let offset = startOffset;

    while (offset < text.length) {
        const character = text.slice(offset, offset + 1);

        if (!predicate(character)) {
            break;
        }

        offset += 1;
    }

    return offset;
};

/**
 * Match `#123` style issue metadata.
 *
 * @param text - Remaining task-comment text.
 *
 * @returns The matched metadata token, or `null` when none is present.
 */
const matchHashIssueMetadata = (text: string): null | string => {
    if (!text.startsWith("#")) {
        return null;
    }

    const endOffset = consumeWhile(text, 1, (character) =>
        digitPattern.test(character)
    );

    return endOffset > 1 ? withTrailingWhitespace(text, endOffset) : null;
};

/**
 * Match `ABC-123` style issue metadata.
 *
 * @param text - Remaining task-comment text.
 *
 * @returns The matched metadata token, or `null` when none is present.
 */
const matchDashedIssueMetadata = (text: string): null | string => {
    const firstCharacter = text.slice(0, 1);

    if (!/^[a-z]$/iu.test(firstCharacter)) {
        return null;
    }

    const dashOffset = consumeWhile(text, 1, (character) => character !== "-");

    if (
        dashOffset >= text.length ||
        text.slice(dashOffset, dashOffset + 1) !== "-"
    ) {
        return null;
    }

    const issuePrefix = text.slice(0, dashOffset);

    if (
        ![...issuePrefix].every((character) =>
            asciiAlphaNumericPattern.test(character)
        )
    ) {
        return null;
    }

    const endOffset = consumeWhile(text, dashOffset + 1, (character) =>
        digitPattern.test(character)
    );

    return endOffset > dashOffset + 1
        ? withTrailingWhitespace(text, endOffset)
        : null;
};

/**
 * Match issue metadata such as `#123` or `ABC-123`.
 *
 * @param text - Remaining task-comment text.
 *
 * @returns The matched metadata token, or `null` when none is present.
 */
const matchIssueMetadata = (text: string): null | string =>
    matchHashIssueMetadata(text) ?? matchDashedIssueMetadata(text);

/**
 * Match a leading metadata token at the start of task-comment remainder text.
 *
 * @param text - Remaining task-comment text.
 *
 * @returns The matched metadata token, or `null` when none is present.
 */
const matchLeadingMetadata = (text: string): null | string => {
    const parenthesizedMetadata = matchParenthesizedMetadata(text);

    if (parenthesizedMetadata !== null) {
        return parenthesizedMetadata;
    }

    const bracketedMetadata = matchBracketedMetadata(text);

    if (bracketedMetadata !== null) {
        return bracketedMetadata;
    }

    const handleMetadata = matchHandleMetadata(text);

    if (handleMetadata !== null) {
        return handleMetadata;
    }

    const issueMetadata = matchIssueMetadata(text);

    if (issueMetadata !== null) {
        return issueMetadata;
    }

    return null;
};

/**
 * Strip optional metadata and punctuation from the start of a task comment.
 *
 * @param text - Remaining task-comment text after the leading term.
 *
 * @returns Remaining descriptive text.
 */
const stripTaskCommentPreamble = (text: string): string => {
    let remainder = text.trimStart();

    while (remainder.length > 0) {
        const separatorMatch = separatorPattern.exec(remainder);

        if (isDefined(separatorMatch?.[0])) {
            remainder = remainder.slice(separatorMatch[0].length).trimStart();
            continue;
        }

        const matchedMetadata = matchLeadingMetadata(remainder);

        if (matchedMetadata === null) {
            break;
        }

        remainder = remainder.slice(matchedMetadata.length).trimStart();
    }

    return remainder.trim();
};

/**
 * Determine whether the remaining task-comment text is descriptive enough.
 *
 * @param description - Comment text after stripping task markers + metadata.
 * @param minDescriptionLength - Minimum required description length.
 *
 * @returns `true` when the description contains meaningful prose.
 */
const hasMeaningfulDescription = (
    description: string,
    minDescriptionLength: number
): boolean => {
    const compactDescription = description.replaceAll(/\s+/gu, " ").trim();

    return (
        compactDescription.length >= minDescriptionLength &&
        /[\p{L}\p{N}]/u.test(compactDescription)
    );
};

type TaskCommentAnalysisResult = Readonly<{
    leadingWhitespaceOffset: number;
    taskTerm: string;
}>;

/**
 * Analyze a comment and return report data when it lacks a meaningful task
 * description.
 *
 * @param lintText - Raw lint text for a single comment.
 * @param normalizedTerms - Normalized task comment terms.
 * @param minDescriptionLength - Minimum required descriptive text length.
 *
 * @returns Report data when the comment should be flagged, otherwise `null`.
 */
const analyzeTaskComment = (
    lintText: string,
    normalizedTerms: readonly string[],
    minDescriptionLength: number
): null | TaskCommentAnalysisResult => {
    const trimmedLintText = lintText.trim();

    if (isIgnoredCommentText(trimmedLintText)) {
        return null;
    }

    const taskTerm = matchTaskCommentTerm(trimmedLintText, normalizedTerms);

    if (taskTerm === null) {
        return null;
    }

    const description = stripTaskCommentPreamble(
        trimmedLintText.slice(taskTerm.length)
    );

    if (hasMeaningfulDescription(description, minDescriptionLength)) {
        return null;
    }

    return {
        leadingWhitespaceOffset: lintText.length - lintText.trimStart().length,
        taskTerm,
    };
};

/**
 * Report a task comment that does not contain descriptive text.
 *
 * @param context - ESLint rule context.
 * @param sourceCode - Source code for the current file.
 * @param comment - Comment node to report.
 * @param analysis - Precomputed report data for the comment.
 */
const reportTaskCommentWithoutDescription = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    sourceCode: Readonly<TSESLint.SourceCode>,
    comment: Readonly<TSESTree.Comment>,
    analysis: TaskCommentAnalysisResult
): void => {
    context.report({
        data: {
            term: analysis.taskTerm.toUpperCase(),
        },
        loc: createCommentValueSourceLocation(
            comment,
            sourceCode,
            analysis.leadingWhitespaceOffset,
            analysis.leadingWhitespaceOffset + analysis.taskTerm.length
        ),
        messageId: "missingDescription",
    });
};

/**
 * Create the runtime task-comment-format rule.
 */
const taskCommentFormatRule: TSESLint.RuleModule<
    MessageIds,
    Options,
    PluginDocs
> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [
            {
                minDescriptionLength = DEFAULT_MIN_DESCRIPTION_LENGTH,
                terms = defaultTaskCommentTerms,
            } = defaultTaskCommentFormatOptions,
        ] = context.options;
        const normalizedTerms = (
            terms.length > 0 ? terms : defaultTaskCommentTerms
        ).map((term) => term.toUpperCase());

        return {
            Program() {
                for (const comment of sourceCode.getAllComments()) {
                    const lintText = createCommentLintText(comment);
                    const analysis = analyzeTaskComment(
                        lintText,
                        normalizedTerms,
                        minDescriptionLength
                    );

                    if (analysis === null) {
                        continue;
                    }

                    reportTaskCommentWithoutDescription(
                        context,
                        sourceCode,
                        comment,
                        analysis
                    );
                }
            },
        };
    },
    meta: {
        defaultOptions: [defaultTaskCommentFormatOptions],
        deprecated: false,
        docs: {
            description:
                "enforce descriptive TODO-style task comments in source code.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/task-comment-format",
        },
        messages: {
            missingDescription:
                "{{term}} comments must include a descriptive task or reason after the marker.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Optional task-comment markers and minimum description length.",
                properties: {
                    minDescriptionLength: {
                        description:
                            "Minimum number of non-whitespace characters required after stripping task metadata.",
                        minimum: 1,
                        type: "integer",
                    },
                    terms: {
                        description:
                            "Task-comment markers that should require a descriptive body.",
                        items: {
                            minLength: 1,
                            type: "string",
                        },
                        minItems: 1,
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

export default taskCommentFormatRule;
