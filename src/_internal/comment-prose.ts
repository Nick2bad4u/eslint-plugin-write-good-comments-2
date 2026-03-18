/**
 * @packageDocumentation
 * Shared helpers for linting natural-language source comments.
 */

import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { arrayFirst, arrayJoin, isDefined, setHas } from "ts-extras";

/** Absolute offset of comment content inside its full source token. */
const COMMENT_CONTENT_START_OFFSET = 2;

/**
 * Non-space separators for directive-style prefixes such as: istanbul ignore
 * next.
 */
const ignoredCommentDirectiveSeparators = new Set(["-", ":"]);

/**
 * Separators for rule-id and namespace prefixes such as
 * `unicorn/no-array-callback-reference`.
 */
const ignoredCommentNamespaceSeparators = new Set([
    "-",
    "/",
    ":",
]);

/** Directive-style prefixes that should not be linted as natural-language prose. */
const ignoredCommentDirectivePrefixes: readonly string[] = Object.freeze([
    "@ts-",
    "c8",
    "codecov",
    "copyright",
    "coveralls",
    "cspell",
    "eslint",
    "exported",
    "global",
    "globals",
    "ignored",
    "istanbul",
    "jshint",
    "jslint",
    "license",
    "pragma",
    "spell-checker:",
    "ts-check",
    "ts-expect-error",
    "ts-ignore",
    "ts-nocheck",
    "tslint",
    "v8",
]);

/** Rule-id and namespace prefixes that should not be linted as prose. */
const ignoredCommentNamespacePrefixes: readonly string[] = Object.freeze([
    "@docusaurus",
    "@eslint",
    "@react",
    "@typescript-eslint",
    "boundaries",
    "depend",
    "deprecation",
    "etc",
    "ex",
    "functional",
    "import",
    "import-x",
    "import-zod",
    "jcoreio",
    "jsdoc",
    "jsx",
    "jsx-a11y",
    "loadable-imports",
    "math",
    "metamask",
    "microsoft",
    "n",
    "neverthrow",
    "no-constructor-bind",
    "no-explicit-type-exports",
    "no-function-declare-after-return",
    "no-lookahead-lookbehind-regexp",
    "no-non-null-asserted-nullish-coalescing",
    "no-non-null-asserted-optional-chain",
    "no-secrets",
    "no-unary-plus",
    "no-unawaited-dot-catch-throw",
    "no-unnecessary-type-assertion",
    "no-unsanitized",
    "no-unsafe-optional-chaining",
    "no-use-extend-native",
    "nyc",
    "observers",
    "perfectionist",
    "prefer-arrow",
    "prettier",
    "promise",
    "react",
    "react-hooks",
    "react-hooks-addons",
    "redos",
    "regexp",
    "require-jsdoc",
    "safe-jsx",
    "security",
    "sonarjs",
    "sort-class-members",
    "sort-destructure-keys",
    "sort-keys-fix",
    "sql-template",
    "ssr-friendly",
    "styled-components-a11y",
    "switch-case",
    "total-functions",
    "tsdoc",
    "unicorn",
    "unused-imports",
    "usememo-recommendations",
    "validate-jsx-nesting",
    "write-good-comments",
    "xss",
]);

/**
 * Prefix families for comments that should be ignored rather than linted as
 * prose.
 */
export type IgnoredCommentPrefixes = Readonly<{
    directive: readonly string[];
    namespace: readonly string[];
}>;

/**
 * Prefix families for comments that should be ignored rather than linted as
 * prose.
 */
export const ignoredCommentPrefixes: IgnoredCommentPrefixes = Object.freeze({
    directive: ignoredCommentDirectivePrefixes,
    namespace: ignoredCommentNamespacePrefixes,
});

/** Check whether a comment starts with an ignored directive or rule namespace. */
const startsWithIgnoredPrefix = (
    commentText: string,
    prefix: string,
    separators: ReadonlySet<string>,
    allowWhitespaceSeparator: boolean
): boolean => {
    if (!commentText.startsWith(prefix)) {
        return false;
    }

    const nextCharacter = commentText[prefix.length];

    return (
        !isDefined(nextCharacter) ||
        (allowWhitespaceSeparator && /\s/u.test(nextCharacter)) ||
        setHas(separators, nextCharacter)
    );
};

/** Leading JSDoc-style decoration to neutralize in block comments. */
const blockCommentDecorationPattern = /^[\t\v\f ]*\*(?:[\t ]|$)/u;

/**
 * Determine whether a comment should be ignored entirely.
 *
 * @param commentText - Trimmed comment text after block-comment normalization.
 *
 * @returns `true` when the comment is a directive or empty.
 */
export const isIgnoredCommentText = (commentText: string): boolean => {
    if (commentText.length === 0) {
        return true;
    }

    const normalizedCommentText = commentText.toLowerCase();

    if (
        ignoredCommentDirectivePrefixes.some((prefix) =>
            startsWithIgnoredPrefix(
                normalizedCommentText,
                prefix,
                ignoredCommentDirectiveSeparators,
                true
            )
        )
    ) {
        return true;
    }

    return ignoredCommentNamespacePrefixes.some((prefix) =>
        startsWithIgnoredPrefix(
            normalizedCommentText,
            prefix,
            ignoredCommentNamespaceSeparators,
            false
        )
    );
};

/**
 * Neutralize decorative block-comment prefixes while preserving source offsets.
 *
 * @param comment - Source comment token.
 *
 * @returns Lint text with stable indexing relative to `comment.value`.
 */
export const createCommentLintText = (
    comment: Readonly<TSESTree.Comment>
): string => {
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
        return arrayJoin(characters, "");
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

        if (isDefined(decorationMatch?.[0])) {
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

    return arrayJoin(characters, "");
};

/**
 * Convert a comment-relative text span into an ESLint source location.
 *
 * @param comment - Source comment token.
 * @param sourceCode - Source code utility object.
 * @param startOffset - Inclusive start offset within `comment.value`.
 * @param endOffset - Exclusive end offset within `comment.value`.
 *
 * @returns ESLint location for the requested span.
 */
export const createCommentValueSourceLocation = (
    comment: Readonly<TSESTree.Comment>,
    sourceCode: Readonly<TSESLint.SourceCode>,
    startOffset: number,
    endOffset: number
): TSESLint.AST.SourceLocation => {
    const safeStartOffset = Math.max(startOffset, 0);
    const safeEndOffset = Math.min(
        Math.max(endOffset, safeStartOffset + 1),
        comment.value.length
    );
    const commentValueStartIndex =
        arrayFirst(comment.range) + COMMENT_CONTENT_START_OFFSET;

    return {
        end: sourceCode.getLocFromIndex(commentValueStartIndex + safeEndOffset),
        start: sourceCode.getLocFromIndex(
            commentValueStartIndex + safeStartOffset
        ),
    };
};
