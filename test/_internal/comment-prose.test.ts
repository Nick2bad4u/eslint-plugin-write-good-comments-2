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
        expect(ignoredCommentPrefixes.directive).toContain("eslint");
        expect(ignoredCommentPrefixes.directive).toContain("istanbul");
        expect(ignoredCommentPrefixes.namespace).toContain(
            "@typescript-eslint"
        );
        expect(ignoredCommentPrefixes.namespace).toContain("prettier");
        expect(ignoredCommentPrefixes.namespace).toContain("react-hooks");
    });

    it("matches ignored comment families without overmatching adjacent prose", () => {
        expect(isIgnoredCommentText("istanbul ignore next")).toBeTruthy();
        expect(
            isIgnoredCommentText("react-hooks/exhaustive-deps")
        ).toBeTruthy();
        expect(isIgnoredCommentText("eslintdisable-next-line")).toBeFalsy();
        expect(isIgnoredCommentText("reacthooksexhaustive-deps")).toBeFalsy();
    });
});
