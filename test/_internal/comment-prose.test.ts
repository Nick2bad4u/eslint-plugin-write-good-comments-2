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
import { projectMarkdownCommentText } from "../../src/_internal/retext";
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

/** Extract every ECMAScript line ending without normalization. */
const getLineEndings = (source: string): readonly string[] =>
    source.match(/\r\n|[\n\r\u{2028}\u{2029}]/gv) ?? [];

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
        expect(ignoredCommentPrefixes.directive).toContain("biome-ignore");
        expect(ignoredCommentPrefixes.directive).toContain("deno-lint-ignore");
        expect(ignoredCommentPrefixes.directive).toContain("eslint");
        expect(ignoredCommentPrefixes.directive).toContain("istanbul");
        expect(ignoredCommentPrefixes.directive).toContain("oxlint-disable");
        expect(ignoredCommentPrefixes.directive).toContain("prettier-ignore");
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
        expect(isIgnoredCommentText("prettier-ignore")).toBe(true);
        expect(isIgnoredCommentText("react-hooks/exhaustive-deps")).toBe(true);
        expect(isIgnoredCommentText("@typescript-eslint/no-explicit-any")).toBe(
            true
        );
        expect(isIgnoredCommentText("eslintdisable-next-line")).toBe(false);
        expect(isIgnoredCommentText("@tsexpect-error")).toBe(false);
        expect(isIgnoredCommentText("reacthooksexhaustive-deps")).toBe(false);
        expect(isIgnoredCommentText("React-based prose is retained.")).toBe(
            false
        );
        expect(isIgnoredCommentText("Import-time prose is retained.")).toBe(
            false
        );
        expect(isIgnoredCommentText("React: retain this explanation.")).toBe(
            false
        );
    });

    it.each([
        {
            name: "Biome suppression",
            text: "biome-ignore lint/suspicious/noExplicitAny: legacy boundary",
        },
        {
            name: "Deno formatting suppression",
            text: "deno-fmt-ignore-file",
        },
        {
            name: "Deno lint suppression",
            text: "deno-lint-ignore no-explicit-any -- generated boundary",
        },
        {
            name: "Deno type declaration",
            text: '@deno-types="./types.d.ts"',
        },
        {
            name: "Flow file pragma",
            text: "@flow strict-local",
        },
        {
            name: "JSX import-source pragma",
            text: "@jsxImportSource custom-jsx-runtime",
        },
        {
            name: "NOSONAR suppression",
            text: "NOSONAR generated boundary",
        },
        {
            name: "Oxlint suppression",
            text: "oxlint-disable-next-line no-console -- generated boundary",
        },
        {
            name: "Vite dynamic-import annotation",
            text: "@vite-ignore",
        },
        {
            name: "Bun target annotation",
            text: "@bun-cjs",
        },
    ])("recognizes $name prefix comments", ({ text }) => {
        expect.hasAssertions();
        expect(isIgnoredCommentText(text)).toBe(true);
    });

    it.each([
        {
            name: "Flow suppression",
            source: "// $FlowFixMe[incompatible-type] master slave documeant",
        },
        {
            name: "Flow expected-error suppression",
            source: "// $FlowExpectedError[incompatible-type] master slave documeant",
        },
        {
            name: "Flow lint control",
            source: "// flowlint sketchy-null:off",
        },
        {
            name: "Flow line lint control",
            source: "// flowlint-line sketchy-null:warn",
        },
        {
            name: "Flow next-line lint control",
            source: "// flowlint-next-line sketchy-null:error",
        },
        {
            name: "preserved block license",
            source: "/*! @license MIT master slave documeant */",
        },
        {
            name: "preserved line license",
            source: "//! @preserve master slave documeant",
        },
        {
            name: "PURE annotation",
            source: "/*#__PURE__*/",
        },
        {
            name: "NO_SIDE_EFFECTS annotation",
            source: "/* @__NO_SIDE_EFFECTS__ */",
        },
        {
            name: "source-map URL",
            source: "//# sourceMappingURL=documeant.js.map",
        },
        {
            name: "source URL",
            source: "//@ sourceURL=webpack://documeant/module.js",
        },
        {
            name: "Bun debug ID",
            source: "//# debugId=documeant-master-slave",
        },
        {
            name: "TypeScript AMD dependency",
            source: '/// <amd-dependency path="./documeant.js" name="master-slave" />',
        },
        {
            name: "TypeScript AMD module",
            source: '/// <amd-module name="documeant-master-slave" />',
        },
        {
            name: "TypeScript reference",
            source: '/// <reference path="./documeant-master-slave.d.ts" />',
        },
        {
            name: "region marker",
            source: "// #region master slave documeant",
        },
        {
            name: "end-region marker",
            source: "// #endregion master slave documeant",
        },
        {
            name: "webpack chunk-name annotation",
            source: '/* webpackChunkName: "documeant-master-slave" */',
        },
        {
            name: "webpack exclusion annotation",
            source: "/* webpackExclude: /documeant-master-slave/ */",
        },
    ])("projects the complete $name away", ({ source }) => {
        expect.hasAssertions();

        const comment = parseOnlyComment(source);
        const projectedText = createCommentProseLintText(comment);

        expect(projectedText).toHaveLength(comment.value.length);
        expect(getLineEndings(projectedText)).toStrictEqual(
            getLineEndings(comment.value)
        );
        expect(projectedText.trim()).toBe("");
    });

    it.each([
        "A licensee must preserve this notice.",
        "Biome keeps formatting consistent.",
        "Flow fixes improve generated definitions.",
        "#regional settings belong in configuration.",
        "Preserve the source URL in this map.",
        "Use <reference> when discussing a citation.",
        "webpack chunk names should remain stable.",
        "@jsxImportSources are described in this guide.",
        "React-based state should be documented.",
        "Import-time behavior should be documented.",
        "React: retain this explanation.",
    ])("does not overmatch nearby prose: %s", (text) => {
        expect.hasAssertions();
        expect(isIgnoredCommentText(text)).toBe(false);
    });

    it("retains webpack-like text when it is a JSDoc description", () => {
        expect.hasAssertions();

        const comment = parseOnlyComment(
            '/** webpackChunkName: "not-magic" remains prose. */'
        );

        expect(createCommentProseLintText(comment).trim()).toBe(
            'webpackChunkName: "not-magic" remains prose.'
        );
    });

    it.each([
        {
            lineEnding: "\r",
            name: "lone carriage returns",
        },
        {
            lineEnding: "\u{2028}",
            name: "line separators",
        },
        {
            lineEnding: "\u{2029}",
            name: "paragraph separators",
        },
    ])("normalizes decorated blocks with $name", ({ lineEnding }) => {
        expect.hasAssertions();

        const comment = parseOnlyComment(
            `/*${lineEnding} * Decorated prose remains.${lineEnding} */`
        );
        const lintText = createCommentLintText(comment);

        expect(lintText).toHaveLength(comment.value.length);
        expect(getLineEndings(lintText)).toStrictEqual(
            getLineEndings(comment.value)
        );
        expect(lintText).toContain("Decorated prose remains.");
        expect(lintText).not.toContain("*");
    });

    it.each([
        {
            lineEnding: "\r\n",
            name: "CRLF",
        },
        {
            lineEnding: "\n",
            name: "line feeds",
        },
        {
            lineEnding: "\r",
            name: "carriage returns",
        },
        {
            lineEnding: "\u{2028}",
            name: "line separators",
        },
        {
            lineEnding: "\u{2029}",
            name: "paragraph separators",
        },
    ])("preserves $name in markdown projections", ({ lineEnding }) => {
        expect.hasAssertions();

        const source = `Visible prose.${lineEnding}\`documeant\``;
        const projectedText = projectMarkdownCommentText(source);

        expect(projectedText).toHaveLength(source.length);
        expect(getLineEndings(projectedText)).toStrictEqual(
            getLineEndings(source)
        );
        expect(projectedText).toContain("Visible prose.");
        expect(projectedText).not.toContain("documeant");
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
