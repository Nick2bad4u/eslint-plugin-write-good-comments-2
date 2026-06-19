/**
 * @packageDocumentation
 * Regression coverage for shared comment-prose helpers.
 */

import { describe, expect, it } from "vitest";

import {
    ignoredCommentPrefixes,
    isIgnoredCommentText,
} from "../../src/_internal/comment-prose";

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
        expect(isIgnoredCommentText("react-hooks/exhaustive-deps")).toBe(true);
        expect(isIgnoredCommentText("eslintdisable-next-line")).toBe(false);
        expect(isIgnoredCommentText("reacthooksexhaustive-deps")).toBe(false);
    });
});
