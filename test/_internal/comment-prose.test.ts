/**
 * @packageDocumentation
 * Regression coverage for shared comment-prose helpers.
 */

import { parse } from "@typescript-eslint/parser";
import { describe, expect, it } from "vitest";

import {
    createCommentLintText,
    createCommentProseLintText,
    ignoredCommentPrefixes,
    isIgnoredCommentText,
} from "../../src/_internal/comment-prose";
import { jsdocBlockTagConventionsFixture } from "./comment-fixtures";

/** Parse exactly one source comment for projection tests. */
const parseOnlyComment = (source: string) => {
    const { comments } = parse(`${source}\nconst value = 1;`, {
        comment: true,
        ecmaVersion: "latest",
        loc: true,
        range: true,
        sourceType: "module",
    });
    const [comment] = comments;

    if (comment === undefined || comments.length !== 1) {
        throw new Error("Expected projection fixture to contain one comment.");
    }

    return comment;
};

/** Extract line endings without normalizing LF, CRLF, or lone CR forms. */
const getLineEndings = (source: string): readonly string[] =>
    source.match(/\r\n|[\n\r]/gv) ?? [];

const issue25TagOnlyJSDoc = [
    "/**",
    " * @typedef {Object} CreateEvent",
    " * @property {'create'} action",
    " * @property {Init} Thing",
    " * @property {string | number} organizer_id",
    " */",
].join("\n");

describe("comment prose helpers", () => {
    it("exports grouped ignored comment families for maintenance", () => {
        expect.hasAssertions();
        expect(ignoredCommentPrefixes.directive).toContain("eslint");
        expect(ignoredCommentPrefixes.directive).toContain("istanbul");
        expect(ignoredCommentPrefixes.namespace).toContain(
            "@typescript-eslint"
        );
        expect(ignoredCommentPrefixes.namespace).toContain("prettier");
        expect(ignoredCommentPrefixes.namespace).toContain("react-hooks");
    });

    it("matches ignored comment families without overmatching adjacent prose", () => {
        expect.hasAssertions();
        expect(isIgnoredCommentText("istanbul ignore next")).toBe(true);
        expect(isIgnoredCommentText("@ts-expect-error -- type mismatch")).toBe(
            true
        );
        expect(isIgnoredCommentText("spell-checker:disable")).toBe(true);
        expect(isIgnoredCommentText("react-hooks/exhaustive-deps")).toBe(true);
        expect(isIgnoredCommentText("eslintdisable-next-line")).toBe(false);
        expect(isIgnoredCommentText("@tsexpect-error")).toBe(false);
        expect(isIgnoredCommentText("reacthooksexhaustive-deps")).toBe(false);
    });

    it("projects the tag-only JSDoc from issue 25 to offset-safe whitespace", () => {
        expect.hasAssertions();

        const comment = parseOnlyComment(issue25TagOnlyJSDoc);
        const projectedText = createCommentProseLintText(comment);

        expect(projectedText).toHaveLength(comment.value.length);
        expect(projectedText.trim()).toBe("");
        expect(getLineEndings(projectedText)).toStrictEqual(
            getLineEndings(comment.value)
        );
    });

    it("retains the leading description and inline tags at original offsets", () => {
        expect.hasAssertions();

        const comment = parseOnlyComment(
            [
                "/**",
                " * Explain 😀 events with {@link CreateEvent} before metadata.",
                " * Keep this second description line aligned.",
                " *",
                " * @typedef {Object} CreateEvent",
                " * @property {string} value - Ignore this tag description.",
                " */",
            ].join("\n")
        );
        const lintText = createCommentLintText(comment);
        const projectedText = createCommentProseLintText(comment);
        const firstTagOffset = lintText.indexOf("@typedef");

        expect(firstTagOffset).toBeGreaterThanOrEqual(0);
        expect(projectedText).toHaveLength(comment.value.length);
        expect(projectedText.slice(0, firstTagOffset)).toBe(
            lintText.slice(0, firstTagOffset)
        );
        expect(projectedText.slice(firstTagOffset).trim()).toBe("");
        expect(projectedText).toContain("{@link CreateEvent}");
    });

    it.each([
        {
            name: "compact tag-only JSDoc",
            source: "/**@param {string} value - Ignore this description. */",
        },
        {
            name: "multiline example body",
            source: [
                "/**",
                " * @example",
                " * const result = runExample();",
                " * Continue the example here.",
                " */",
            ].join("\n"),
        },
        {
            name: "unknown custom block tag",
            source: [
                "/**",
                " * @custom-tag metadata",
                " * Continue the custom tag here.",
                " */",
            ].join("\n"),
        },
    ])("removes the complete $name section", ({ source }) => {
        expect.hasAssertions();

        const comment = parseOnlyComment(source);
        const projectedText = createCommentProseLintText(comment);

        expect(projectedText).toHaveLength(comment.value.length);
        expect(projectedText.trim()).toBe("");
    });

    it("preserves CRLF line endings while removing JSDoc block tags", () => {
        expect.hasAssertions();

        const comment = parseOnlyComment(
            issue25TagOnlyJSDoc.replaceAll("\n", "\r\n")
        );
        const projectedText = createCommentProseLintText(comment);

        expect(projectedText).toHaveLength(comment.value.length);
        expect(projectedText.trim()).toBe("");
        expect(getLineEndings(projectedText)).toStrictEqual(
            getLineEndings(comment.value)
        );
        expect(getLineEndings(projectedText)).toContain("\r\n");
    });

    it("retains compact single-line JSDoc descriptions without block tags", () => {
        expect.hasAssertions();

        const comment = parseOnlyComment(
            "/**Describe the fallback clearly. */"
        );
        const projectedText = createCommentProseLintText(comment);

        expect(projectedText).toHaveLength(comment.value.length);
        expect(projectedText.trim()).toBe("Describe the fallback clearly.");
    });

    it("preserves offsets across the shared comment-convention fixture", () => {
        expect.hasAssertions();

        const { comments } = parse(jsdocBlockTagConventionsFixture, {
            comment: true,
            ecmaVersion: "latest",
            loc: true,
            range: true,
            sourceType: "module",
        });
        const projectedComments = comments.map((comment) => ({
            comment,
            text: createCommentProseLintText(comment),
        }));

        expect(projectedComments).toHaveLength(26);

        for (const { comment, text } of projectedComments) {
            expect(text).toHaveLength(comment.value.length);
            expect(getLineEndings(text)).toStrictEqual(
                getLineEndings(comment.value)
            );
        }

        const combinedProse = projectedComments
            .map(({ text }) => text)
            .join("\n");

        expect(combinedProse).toContain("Plain blocks keep @param text.");
        expect(combinedProse).toContain("{@link Widget}");
        expect(combinedProse).toContain("@scope/package");
        expect(combinedProse).toContain("TODO: Remove the fallback soon.");
        expect(combinedProse).not.toMatch(
            /In order to|documeant|\bmaster\b|\bslave\b|unnecessarily abstract/v
        );
    });

    it.each([
        "// @param {string} value - Ordinary line comment.",
        "/* @param {string} value - Ordinary block comment. */",
        "/*** @param {string} value - Extra-star block comment. */",
    ])("does not treat non-JSDoc source as a block-tag section", (source) => {
        expect.hasAssertions();

        const comment = parseOnlyComment(source);

        expect(createCommentProseLintText(comment)).toBe(
            createCommentLintText(comment)
        );
    });
});
