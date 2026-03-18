/**
 * @packageDocumentation
 * Markdown-aware retext integration for comment-only ESLint rules.
 */

import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import retextEnglish from "retext-english";
import { unified } from "unified";
import { VFile } from "vfile";

import { createCommentValueSourceLocation } from "./comment-prose.js";
import { resolveDefaultExport } from "./default-export.js";

/** Normalized retext message with stable source offsets. */
export type RetextLintMessage = Readonly<{
    actual: null | string;
    endOffset: number;
    expected: readonly string[];
    note: null | string;
    reason: string;
    ruleId: null | string;
    source: RetextMessageSource;
    startOffset: number;
}>;

/** Optional rule-id filter shared by rule wrappers. */
export type RetextMessageFilterOptions = Readonly<{
    allow?: readonly string[];
    deny?: readonly string[];
}>;

/** Supported message sources emitted by retext rules used in this plugin. */
export type RetextMessageSource =
    | "retext-equality"
    | "retext-profanities"
    | "retext-readability"
    | "retext-spell";

/** Runtime node shape needed to project markdown text ranges. */
type MarkdownNode = Readonly<{
    children?: readonly MarkdownNode[];
    position?: Readonly<{
        end?: Readonly<{
            offset?: number;
        }>;
        start?: Readonly<{
            offset?: number;
        }>;
    }>;
    type: string;
}>;

/** Stable start/end offsets for one normalized message. */
type MessageOffsets = Readonly<{
    endOffset: number;
    startOffset: number;
}>;

/** Position-like runtime shape with stable start and end offsets. */
type MessagePosition = Readonly<{
    end: Readonly<{
        offset?: number;
    }>;
    start: Readonly<{
        offset?: number;
    }>;
}>;

/** Narrow processor surface exposed to rule-specific configuration callbacks. */
type RetextConfigurableProcessor = Readonly<{
    use: (plugin: unknown, options?: unknown) => RetextConfigurableProcessor;
}>;

/** Runtime message type emitted by retext processors. */
type RetextRuntimeMessage = VFile["messages"][number];

/** Lazily create the markdown parser used to blank markdown-only syntax. */
const createMarkdownProjectionProcessor = () =>
    unified()
        .use(resolveDefaultExport(remarkParse))
        .use(resolveDefaultExport(remarkGfm))
        .use(resolveDefaultExport(remarkFrontmatter), ["yaml", "toml"]);

/** Check whether an unknown value is a supported retext message source. */
const isRetextMessageSource = (value: unknown): value is RetextMessageSource =>
    value === "retext-equality" ||
    value === "retext-profanities" ||
    value === "retext-readability" ||
    value === "retext-spell";

/** Check whether an unknown value is a non-negative integer offset. */
const isNonNegativeInteger = (value: unknown): value is number =>
    typeof value === "number" && Number.isInteger(value) && value >= 0;

/** Check whether a runtime place value is a full start/end position object. */
const isMessagePosition = (value: unknown): value is MessagePosition => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    return "end" in value && "start" in value;
};

/** Check whether one message survives the configured allow/deny filter. */
const shouldKeepMessage = (
    message: Readonly<Pick<RetextLintMessage, "ruleId">>,
    filter: Readonly<RetextMessageFilterOptions>
): boolean => {
    if (filter.deny !== undefined) {
        return message.ruleId !== null && filter.deny.includes(message.ruleId);
    }

    if (filter.allow !== undefined && message.ruleId !== null) {
        return !filter.allow.includes(message.ruleId);
    }

    return true;
};

/** Build a blank markdown projection while preserving line endings and tabs. */
const createBlankProjection = (source: string): string[] =>
    Array.from({ length: source.length }, (_, index) => {
        const character = source[index] ?? " ";

        return character === "\n" || character === "\r" || character === "\t"
            ? character
            : " ";
    });

/** Project markdown into a same-length plain-text string for retext analysis. */
export const projectMarkdownCommentText = (source: string): string => {
    const markdownTree = createMarkdownProjectionProcessor().parse(
        new VFile({ value: source })
    ) as MarkdownNode;
    const projection = createBlankProjection(source);

    const visitNode = (node: Readonly<MarkdownNode>): void => {
        if (node.type === "text") {
            const startOffset = node.position?.start?.offset;
            const endOffset = node.position?.end?.offset;

            if (
                isNonNegativeInteger(startOffset) &&
                isNonNegativeInteger(endOffset) &&
                endOffset > startOffset
            ) {
                for (let index = startOffset; index < endOffset; index += 1) {
                    projection[index] = source[index] ?? " ";
                }
            }
        }

        for (const child of node.children ?? []) {
            visitNode(child);
        }
    };

    visitNode(markdownTree);

    return projection.join("");
};

/** Extract stable start/end offsets from one runtime retext message. */
const getMessageOffsets = (
    message: Readonly<RetextRuntimeMessage>
): MessageOffsets | null => {
    const place = message.place;

    if (!isMessagePosition(place)) {
        return null;
    }

    const startOffset = place.start.offset;
    const endOffset = place.end.offset;

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

/** Normalize one runtime retext message into a stable plugin shape. */
const normalizeRetextMessage = (
    message: Readonly<RetextRuntimeMessage>
): null | RetextLintMessage => {
    if (!isRetextMessageSource(message.source)) {
        return null;
    }

    const offsets = getMessageOffsets(message);

    if (offsets === null) {
        return null;
    }

    return {
        actual: message.actual ?? null,
        endOffset: offsets.endOffset,
        expected: [...(message.expected ?? [])],
        note: message.note ?? null,
        reason: message.reason,
        ruleId: message.ruleId ?? null,
        source: message.source,
        startOffset: offsets.startOffset,
    };
};

/** Run one markdown-aware retext analysis pass against projected comment text. */
export const lintMarkdownWithRetext = (
    text: string,
    configureProcessor: (processor: RetextConfigurableProcessor) => void,
    filter: Readonly<RetextMessageFilterOptions> = {}
): readonly RetextLintMessage[] => {
    const projectedText = projectMarkdownCommentText(text);
    const file = new VFile({ path: "comment.md", value: projectedText });
    const processor = unified().use(resolveDefaultExport(retextEnglish));

    configureProcessor(processor as unknown as RetextConfigurableProcessor);

    const tree = processor.parse(file);

    processor.runSync(tree, file);

    const results: RetextLintMessage[] = [];

    for (const message of file.messages) {
        const normalizedMessage = normalizeRetextMessage(message);

        if (
            normalizedMessage === null ||
            !shouldKeepMessage(normalizedMessage, filter)
        ) {
            continue;
        }

        results.push(normalizedMessage);
    }

    return results;
};

/** Convert normalized retext message offsets into an ESLint source location. */
export const createRetextMessageSourceLocation = (
    comment: Readonly<TSESTree.Comment>,
    sourceCode: Readonly<TSESLint.SourceCode>,
    message: Readonly<Pick<RetextLintMessage, "endOffset" | "startOffset">>
): TSESLint.AST.SourceLocation =>
    createCommentValueSourceLocation(
        comment,
        sourceCode,
        message.startOffset,
        message.endOffset
    );
