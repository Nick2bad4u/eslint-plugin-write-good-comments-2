/**
 * @packageDocumentation
 * ESLint rule that enforces descriptive task-marker comments.
 */

import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { setHas } from "ts-extras";

import type { JavaScriptRuleModule } from "../_internal/javascript-rule-module.js";

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
    "FIXME",
    "HACK",
    "TODO",
    "XXX",
] as const;

/** Default minimum descriptive text length after task-comment metadata. */
const DEFAULT_MIN_DESCRIPTION_LENGTH = 8;

/** Default options for task-comment-format. */
const defaultTaskCommentFormatOptions = {
    minDescriptionLength: DEFAULT_MIN_DESCRIPTION_LENGTH,
    terms: [...defaultTaskCommentTerms],
} as const satisfies TaskCommentFormatOptions;

/** Identifier-like characters that can continue a task marker token. */
const identifierContinuationPattern = /^[\p{L}\p{N}_]/v;

/** Characters allowed at either edge of an owner identifier. */
const ownerEdgeCharacterPattern = /^\w$/v;

/** Space characters that may trail metadata tokens. */
const spacePattern = /^\s$/v;

/** ASCII alphanumeric characters used in issue keys. */
const asciiAlphaNumericPattern = /^[\da-z]$/iv;

/** Decimal digits used in issue numbers. */
const digitPattern = /^\d$/v;

/** ASCII letters that may start a keyed issue reference. */
const asciiLetterPattern = /^[a-z]$/iv;

/** Punctuation separators allowed before descriptive prose. */
const separatorCharacters = new Set([
    "-",
    "—",
    ":",
]);

/**
 * Determine whether a character may occur inside an owner identifier.
 *
 * @param character - Single character to validate.
 *
 * @returns Whether the character is an owner character.
 */
const isOwnerCharacter = (character: string): boolean =>
    ownerEdgeCharacterPattern.test(character) ||
    character === "." ||
    character === "-";

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
            nextCharacter.length === 0 ||
            !identifierContinuationPattern.test(nextCharacter)
        ) {
            return text.slice(0, normalizedTerm.length);
        }
    }

    return null;
};

/**
 * Skip whitespace without allocating progressively shorter substrings.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset at which to start scanning.
 *
 * @returns Offset of the first non-whitespace character.
 */
const findNonWhitespaceOffset = (text: string, startOffset: number): number => {
    let endOffset = startOffset;

    while (endOffset < text.length) {
        const character = text.slice(endOffset, endOffset + 1);

        if (!spacePattern.test(character)) {
            break;
        }

        endOffset += 1;
    }

    return endOffset;
};

/**
 * Determine whether a token ends at a metadata boundary.
 *
 * @param text - Task-comment remainder text.
 * @param offset - Offset immediately after the token.
 *
 * @returns Whether the next character can terminate metadata.
 */
const isMetadataBoundary = (text: string, offset: number): boolean =>
    offset >= text.length ||
    spacePattern.test(text.slice(offset, offset + 1)) ||
    setHas(separatorCharacters, text.slice(offset, offset + 1));

/**
 * Validate an owner token such as `jane`, `team_api`, or `dev.ops`.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Inclusive owner start, after any `@` prefix.
 * @param endOffset - Exclusive owner end.
 *
 * @returns Whether the complete range is a recognizable owner token.
 */
const isOwnerToken = (
    text: string,
    startOffset: number,
    endOffset: number
): boolean => {
    if (startOffset >= endOffset) {
        return false;
    }

    if (
        !ownerEdgeCharacterPattern.test(
            text.slice(startOffset, startOffset + 1)
        ) ||
        !ownerEdgeCharacterPattern.test(text.slice(endOffset - 1, endOffset))
    ) {
        return false;
    }

    for (let offset = startOffset + 1; offset < endOffset - 1; offset += 1) {
        if (!isOwnerCharacter(text.slice(offset, offset + 1))) {
            return false;
        }
    }

    return true;
};

/**
 * Find a same-line closing delimiter.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset immediately after the opening delimiter.
 * @param closingDelimiter - Delimiter to find.
 *
 * @returns Closing delimiter offset, or `null` for malformed input.
 */
const findClosingDelimiter = (
    text: string,
    startOffset: number,
    closingDelimiter: ")" | "]"
): null | number => {
    for (let offset = startOffset; offset < text.length; offset += 1) {
        const character = text.slice(offset, offset + 1);

        if (character === closingDelimiter) {
            return offset;
        }

        if (character === "\n" || character === "\r") {
            return null;
        }
    }

    return null;
};

/**
 * Consume characters while they satisfy a predicate.
 *
 * @param text - Source text to scan.
 * @param startOffset - Zero-based start offset.
 * @param isConsumableCharacter - Predicate that decides whether scanning should
 *   continue.
 *
 * @returns Offset immediately after the consumed span.
 */
const consumeWhile = (
    text: string,
    startOffset: number,
    isConsumableCharacter: (character: string) => boolean
): number => {
    let offset = startOffset;

    while (offset < text.length) {
        const character = text.slice(offset, offset + 1);

        if (!isConsumableCharacter(character)) {
            break;
        }

        offset += 1;
    }

    return offset;
};

/**
 * Match the end of a `#123` style issue reference.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset of the `#` character.
 *
 * @returns Exclusive issue-reference end, or `null` when invalid.
 */
const matchHashIssueEnd = (
    text: string,
    startOffset: number
): null | number => {
    if (text.slice(startOffset, startOffset + 1) !== "#") {
        return null;
    }

    const endOffset = consumeWhile(text, startOffset + 1, (character) =>
        digitPattern.test(character)
    );

    return endOffset > startOffset + 1 ? endOffset : null;
};

/**
 * Match the end of an `ABC-123` style issue reference.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset of the issue-key prefix.
 *
 * @returns Exclusive issue-reference end, or `null` when invalid.
 */
const matchDashedIssueEnd = (
    text: string,
    startOffset: number
): null | number => {
    const firstCharacter = text.slice(startOffset, startOffset + 1);

    if (!asciiLetterPattern.test(firstCharacter)) {
        return null;
    }

    const dashOffset = consumeWhile(text, startOffset + 1, (character) =>
        asciiAlphaNumericPattern.test(character)
    );

    if (
        dashOffset >= text.length ||
        text.slice(dashOffset, dashOffset + 1) !== "-"
    ) {
        return null;
    }

    const endOffset = consumeWhile(text, dashOffset + 1, (character) =>
        digitPattern.test(character)
    );

    return endOffset > dashOffset + 1 ? endOffset : null;
};

/**
 * Match the end of an issue reference such as `#123` or `ABC-123`.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset at which the issue reference starts.
 *
 * @returns Exclusive issue-reference end, or `null` when invalid.
 */
const matchIssueEnd = (text: string, startOffset: number): null | number =>
    matchHashIssueEnd(text, startOffset) ??
    matchDashedIssueEnd(text, startOffset);

/**
 * Match parenthesized owner metadata such as `(jane)` or `(@jane)`.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset of the opening parenthesis.
 *
 * @returns Exclusive metadata end, or `null` when invalid.
 */
const matchParenthesizedOwnerEnd = (
    text: string,
    startOffset: number
): null | number => {
    if (text.slice(startOffset, startOffset + 1) !== "(") {
        return null;
    }

    const contentStartOffset =
        startOffset +
        (text.slice(startOffset + 1, startOffset + 2) === "@" ? 2 : 1);
    const closingOffset = findClosingDelimiter(text, contentStartOffset, ")");

    if (
        closingOffset === null ||
        !isOwnerToken(text, contentStartOffset, closingOffset) ||
        !isMetadataBoundary(text, closingOffset + 1)
    ) {
        return null;
    }

    return closingOffset + 1;
};

/**
 * Match bracketed issue metadata such as `[#123]` or `[ABC-123]`.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset of the opening bracket.
 *
 * @returns Exclusive metadata end, or `null` when invalid.
 */
const matchBracketedIssueEnd = (
    text: string,
    startOffset: number
): null | number => {
    if (text.slice(startOffset, startOffset + 1) !== "[") {
        return null;
    }

    const contentStartOffset = startOffset + 1;
    const closingOffset = findClosingDelimiter(text, contentStartOffset, "]");
    const issueEnd = matchIssueEnd(text, contentStartOffset);

    if (
        closingOffset === null ||
        issueEnd !== closingOffset ||
        !isMetadataBoundary(text, closingOffset + 1)
    ) {
        return null;
    }

    return closingOffset + 1;
};

/**
 * Match handle metadata such as `@jane`.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset of the `@` character.
 *
 * @returns Exclusive metadata end, or `null` when invalid.
 */
const matchHandleEnd = (text: string, startOffset: number): null | number => {
    if (text.slice(startOffset, startOffset + 1) !== "@") {
        return null;
    }

    const ownerStartOffset = startOffset + 1;

    if (
        !ownerEdgeCharacterPattern.test(
            text.slice(ownerStartOffset, ownerStartOffset + 1)
        )
    ) {
        return null;
    }

    let endOffset = ownerStartOffset + 1;
    let lastOwnerEdgeOffset = endOffset;

    while (
        endOffset < text.length &&
        isOwnerCharacter(text.slice(endOffset, endOffset + 1))
    ) {
        endOffset += 1;

        if (
            ownerEdgeCharacterPattern.test(text.slice(endOffset - 1, endOffset))
        ) {
            lastOwnerEdgeOffset = endOffset;
        }
    }

    return isMetadataBoundary(text, lastOwnerEdgeOffset)
        ? lastOwnerEdgeOffset
        : null;
};

/**
 * Match an unwrapped issue reference at a complete metadata boundary.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset at which the issue reference starts.
 *
 * @returns Exclusive metadata end, or `null` when invalid.
 */
const matchUnwrappedIssueEnd = (
    text: string,
    startOffset: number
): null | number => {
    const issueEnd = matchIssueEnd(text, startOffset);

    return issueEnd !== null && isMetadataBoundary(text, issueEnd)
        ? issueEnd
        : null;
};

/**
 * Match a leading metadata token at the start of task-comment remainder text.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset at which metadata may start.
 *
 * @returns Exclusive metadata end, or `null` when none is present.
 */
const matchLeadingMetadataEnd = (
    text: string,
    startOffset: number
): null | number =>
    matchParenthesizedOwnerEnd(text, startOffset) ??
    matchBracketedIssueEnd(text, startOffset) ??
    matchHandleEnd(text, startOffset) ??
    matchUnwrappedIssueEnd(text, startOffset);

/**
 * Match a punctuation separator before metadata or descriptive prose.
 *
 * @param text - Task-comment remainder text.
 * @param startOffset - Offset at which a separator may start.
 *
 * @returns Exclusive separator end, or `null` when none is present.
 */
const matchSeparatorEnd = (
    text: string,
    startOffset: number
): null | number => {
    const separator = text.slice(startOffset, startOffset + 1);

    if (!setHas(separatorCharacters, separator)) {
        return null;
    }

    return consumeWhile(
        text,
        startOffset + 1,
        (character) => character === separator
    );
};

/**
 * Strip optional metadata and punctuation from the start of a task comment.
 *
 * @param text - Remaining task-comment text after the leading term.
 *
 * @returns Remaining descriptive text.
 */
const stripTaskCommentPreamble = (text: string): string => {
    let offset = findNonWhitespaceOffset(text, 0);

    while (offset < text.length) {
        const preambleEnd =
            matchSeparatorEnd(text, offset) ??
            matchLeadingMetadataEnd(text, offset);

        if (preambleEnd === null) {
            return text.slice(offset).trim();
        }

        offset = findNonWhitespaceOffset(text, preambleEnd);
    }

    return text.slice(offset).trim();
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
    const compactDescription = description.replaceAll(/\s+/gv, " ").trim();

    return (
        compactDescription.length >= minDescriptionLength &&
        /[\p{L}\p{N}]/v.test(compactDescription)
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
const taskCommentFormatRule: JavaScriptRuleModule<
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

        const onProgram = (): void => {
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
        };

        return { Program: onProgram };
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
        languages: ["js/js"],
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
