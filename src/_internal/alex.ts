/**
 * @packageDocumentation
 * Typed alex integration for comment-only ESLint rules.
 */

import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { markdown as alexMarkdown } from "alex";

import { createCommentValueSourceLocation } from "./comment-prose.js";

/** Normalized alex lint message with stable character offsets. */
export type AlexLintMessage = Readonly<{
    actual: null | string;
    endOffset: number;
    expected: readonly string[];
    reason: string;
    ruleId: null | string;
    source: AlexMessageSource;
    startOffset: number;
}>;

/** Options supported by comment-focused alex wrappers in this plugin. */
export type AlexMarkdownOptions = Readonly<{
    allow?: readonly string[];
    deny?: readonly string[];
    noBinary?: boolean;
    profanitySureness?: 0 | 1 | 2;
}>;

/** Alex-backed message sources supported by this plugin. */
export type AlexMessageSource = "retext-equality" | "retext-profanities";

/** Character offsets within analyzed comment text. */
type AlexMessageOffsets = Readonly<{
    endOffset: number;
    startOffset: number;
}>;

/** Runtime message type emitted by alex markdown analysis. */
type AlexRuntimeMessage = ReturnType<typeof alexMarkdown>["messages"][number];

/** Runtime alex options object accepted by the markdown API. */
type AlexRuntimeOptions = Exclude<
    Parameters<typeof alexMarkdown>[1],
    readonly string[] | string[] | undefined
>;

/** Check whether a dynamic value is a non-negative integer offset. */
const isNonNegativeInteger = (value: unknown): value is number =>
    typeof value === "number" && Number.isInteger(value) && value >= 0;

/** Check whether a runtime message source is supported by this plugin. */
const isAlexMessageSource = (value: unknown): value is AlexMessageSource =>
    value === "retext-equality" || value === "retext-profanities";

/** Convert readonly plugin options into alex runtime options. */
const createAlexRuntimeOptions = (
    options: Readonly<AlexMarkdownOptions>
): AlexRuntimeOptions => ({
    allow: options.allow === undefined ? undefined : [...options.allow],
    deny: options.deny === undefined ? undefined : [...options.deny],
    noBinary: options.noBinary,
    profanitySureness: options.profanitySureness,
});

/** Extract stable start/end offsets from one alex message. */
const getAlexMessageOffsets = (
    message: Readonly<AlexRuntimeMessage>
): AlexMessageOffsets | null => {
    const position = message.position;

    if (position === null) {
        return null;
    }

    const startOffset = position.start.offset;
    const endOffset = position.end.offset;

    if (
        !isNonNegativeInteger(startOffset) ||
        !isNonNegativeInteger(endOffset) ||
        endOffset <= startOffset
    ) {
        return null;
    }

    return {
        endOffset,
        startOffset,
    };
};

/** Run alex markdown analysis and normalize supported messages. */
export const lintMarkdownWithAlex = (
    text: string,
    options: Readonly<AlexMarkdownOptions> = {}
): readonly AlexLintMessage[] => {
    const messages = alexMarkdown(
        text,
        createAlexRuntimeOptions(options)
    ).messages;
    const results: AlexLintMessage[] = [];

    for (const message of messages) {
        if (!isAlexMessageSource(message.source)) {
            continue;
        }

        const offsets = getAlexMessageOffsets(message);

        if (offsets === null) {
            continue;
        }

        results.push({
            actual: message.actual,
            endOffset: offsets.endOffset,
            expected: [...(message.expected ?? [])],
            reason: message.reason,
            ruleId: message.ruleId,
            source: message.source,
            startOffset: offsets.startOffset,
        });
    }

    return results;
};

/** Convert normalized alex message offsets into an ESLint source location. */
export const createAlexMessageSourceLocation = (
    comment: Readonly<TSESTree.Comment>,
    sourceCode: Readonly<TSESLint.SourceCode>,
    message: Readonly<Pick<AlexLintMessage, "endOffset" | "startOffset">>
): TSESLint.AST.SourceLocation =>
    createCommentValueSourceLocation(
        comment,
        sourceCode,
        message.startOffset,
        message.endOffset
    );
