/**
 * @packageDocumentation
 * Shared helpers for linting natural-language source comments.
 */

import {
    AST_TOKEN_TYPES,
    type TSESLint,
    type TSESTree,
} from "@typescript-eslint/utils";
import { arrayFirst, arrayJoin, isDefined, setHas } from "ts-extras";

/** Standard offset of content inside line-comment and block-comment tokens. */
const STANDARD_COMMENT_CONTENT_START_OFFSET = 2;

/** Runtime comment type used by ESLint for a leading hashbang. */
const SHEBANG_COMMENT_TYPE = "Shebang";

/**
 * Non-space separators for directive-style prefixes such as: istanbul ignore
 * next.
 */
const ignoredCommentDirectiveSeparators = new Set([
    "-",
    ":",
    "=",
]);

/**
 * Separators for rule-id and namespace prefixes such as
 * `unicorn/no-array-callback-reference`.
 */
const ignoredCommentNamespaceSeparators = new Set(["/"]);

/** Directive-style prefixes that should not be linted as natural-language prose. */
const ignoredCommentDirectivePrefixes: readonly string[] = Object.freeze([
    "@bun",
    "@copyright",
    "@deno-types",
    "@flow",
    "@jsx",
    "@jsxfrag",
    "@jsximportsource",
    "@jsxruntime",
    "@license",
    "@noflow",
    "@preserve",
    "@ts-",
    "@vite-ignore",
    "biome-ignore",
    "c8",
    "codecov",
    "copyright",
    "coveralls",
    "cspell",
    "deno-fmt-ignore",
    "deno-lint-ignore",
    "eslint",
    "exported",
    "global",
    "globals",
    "ignored",
    "istanbul",
    "jshint",
    "jslint",
    "license",
    "nosonar",
    "oxlint-disable",
    "oxlint-enable",
    "pragma",
    "prettier-ignore",
    "spell-checker:",
    "ts-check",
    "ts-expect-error",
    "ts-ignore",
    "ts-nocheck",
    "tslint",
    "v8",
]);

/** Exact structural comment syntaxes that are not natural-language prose. */
const ignoredCommentControlSyntaxPatterns: readonly RegExp[] = Object.freeze([
    /^\$(?:flowexpectederror|flowfixme)\[[^\s\]]+\](?:\s|$)/v,
    /^#\s*(?:end)?region(?:\s|$)/v,
    /^#\s*debugid=\S+\s*$/v,
    /^[#@]\s*__(?:inline|no_side_effects|noinline|pure)__(?:\s|$)/v,
    /^[#@]\s*source(?:mapping)?url=\S+\s*$/v,
    /^\/\s*<(?:amd-dependency|amd-module|reference)\b/v,
    /^flowlint(?:-line|-next-line)?\s+\S+:(?:error|off|warn)(?:[\s,]|$)/v,
    /^webpack(?:chunkname|exclude|exports|fetchpriority|ignore|include|mode|prefetch|preload)\s*:/v,
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
const hasIgnoredPrefixStart = (
    commentText: string,
    prefix: string,
    separators: ReadonlySet<string>,
    allowWhitespaceSeparator: boolean
): boolean => {
    if (!commentText.startsWith(prefix)) {
        return false;
    }

    const prefixEndCharacter = prefix.at(-1);

    if (
        isDefined(prefixEndCharacter) &&
        setHas(separators, prefixEndCharacter)
    ) {
        return true;
    }

    const nextCharacter = commentText[prefix.length];

    return (
        !isDefined(nextCharacter) ||
        (allowWhitespaceSeparator && /\s/v.test(nextCharacter)) ||
        setHas(separators, nextCharacter)
    );
};

/** Leading JSDoc-style decoration to neutralize in block comments. */
const blockCommentDecorationPattern = /^[\t\v\f ]*\*(?:[\t ]|$)/v;

/** First JSDoc block tag on a normalized comment line. */
const jsdocBlockTagLinePattern = /^[\t\v\f ]*@\S/mv;

/** ECMAScript source-code line-terminator code units. */
const sourceLineTerminators = new Set([
    "\n",
    "\r",
    "\u{2028}",
    "\u{2029}",
]);

/** Mutable source projection operations with read-only public fields. */
type SourceTextProjection = Readonly<{
    length: number;
    replaceRangeWithSpaces: (startIndex: number, endIndex: number) => void;
    toString: () => string;
}>;

/** Check for every ECMAScript source-code line-terminator code unit. */
const isSourceLineTerminator = (character: string | undefined): boolean =>
    isDefined(character) && setHas(sourceLineTerminators, character);

/** Create an offset-preserving UTF-16 code-unit projection of source text. */
const createSourceTextProjection = (source: string): SourceTextProjection => {
    const characters = Array.from(
        { length: source.length },
        (_, index) => source[index] ?? ""
    );

    return {
        length: characters.length,
        replaceRangeWithSpaces: (startIndex, endIndex): void => {
            for (let index = startIndex; index < endIndex; index += 1) {
                if (!isSourceLineTerminator(characters[index])) {
                    characters[index] = " ";
                }
            }
        },
        toString: (): string => arrayJoin(characters, ""),
    };
};

/** Replace a complete normalized comment with offset-preserving whitespace. */
const blankCommentLintText = (lintText: string): string => {
    const projection = createSourceTextProjection(lintText);

    projection.replaceRangeWithSpaces(0, projection.length);

    return projection.toString();
};

/** Check whether an ESLint block token uses the standard JSDoc opener. */
const isJSDocBlockComment = (comment: Readonly<TSESTree.Comment>): boolean =>
    comment.type === AST_TOKEN_TYPES.Block &&
    comment.value.startsWith("*") &&
    !comment.value.startsWith("**");

/** Check for the hashbang token type exposed by ESLint source code objects. */
const isShebangComment = (comment: Readonly<TSESTree.Comment>): boolean => {
    const commentType: string = comment.type;

    return commentType === SHEBANG_COMMENT_TYPE;
};

/** Determine the content offset for standard and Annex B comment tokens. */
const getCommentContentStartOffset = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    commentStartIndex: number
): number => {
    const commentTokenStart = sourceCode.text.slice(
        commentStartIndex,
        commentStartIndex + 4
    );

    if (commentTokenStart.startsWith("<!--")) {
        return 4;
    }

    if (commentTokenStart.startsWith("-->")) {
        return 3;
    }

    return STANDARD_COMMENT_CONTENT_START_OFFSET;
};

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
            hasIgnoredPrefixStart(
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
        hasIgnoredPrefixStart(
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
    const projection = createSourceTextProjection(comment.value);

    projection.replaceRangeWithSpaces(
        0,
        comment.value.length - comment.value.trimStart().length
    );
    projection.replaceRangeWithSpaces(
        comment.value.trimEnd().length,
        comment.value.length
    );

    if (comment.type !== AST_TOKEN_TYPES.Block) {
        return projection.toString();
    }

    let lineStartIndex = 0;

    for (let index = 0; index <= comment.value.length; index += 1) {
        const character = comment.value[index];

        if (
            index < comment.value.length &&
            !isSourceLineTerminator(character)
        ) {
            continue;
        }

        const lineText = comment.value.slice(lineStartIndex, index);
        const decorationMatch = blockCommentDecorationPattern.exec(lineText);

        if (isDefined(decorationMatch?.[0])) {
            projection.replaceRangeWithSpaces(
                lineStartIndex,
                lineStartIndex + decorationMatch[0].length
            );
        }

        if (character === "\r" && comment.value[index + 1] === "\n") {
            index += 1;
        }

        lineStartIndex = index + 1;
    }

    return projection.toString();
};

/**
 * Create offset-preserving natural-language text for one source comment.
 *
 * For JSDoc blocks, only the leading description before the first block tag is
 * retained. The tag section is structural documentation rather than prose for
 * the comment-quality rules.
 *
 * @param comment - Source comment token.
 *
 * @returns Prose text with stable indexing relative to `comment.value`.
 */
export const createCommentProseLintText = (
    comment: Readonly<TSESTree.Comment>
): string => {
    const lintText = createCommentLintText(comment);

    if (isShebangComment(comment) || comment.value.startsWith("!")) {
        return blankCommentLintText(lintText);
    }

    if (!isJSDocBlockComment(comment)) {
        const normalizedLintText = lintText.trim().toLowerCase();

        if (
            ignoredCommentControlSyntaxPatterns.some((pattern) =>
                pattern.test(normalizedLintText)
            )
        ) {
            return blankCommentLintText(lintText);
        }

        return lintText;
    }

    const projection = createSourceTextProjection(lintText);

    // Compact JSDoc forms such as `/**Description. */` retain the opener's
    // extra `*` after ordinary block-decoration normalization.
    projection.replaceRangeWithSpaces(0, 1);

    const normalizedLintText = projection.toString();
    const blockTagMatch = jsdocBlockTagLinePattern.exec(normalizedLintText);

    if (blockTagMatch === null) {
        return normalizedLintText;
    }

    projection.replaceRangeWithSpaces(blockTagMatch.index, projection.length);

    return projection.toString();
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
    const commentStartIndex = arrayFirst(comment.range);
    const commentValueStartIndex =
        commentStartIndex +
        getCommentContentStartOffset(sourceCode, commentStartIndex);

    return {
        end: sourceCode.getLocFromIndex(commentValueStartIndex + safeEndOffset),
        start: sourceCode.getLocFromIndex(
            commentValueStartIndex + safeStartOffset
        ),
    };
};
