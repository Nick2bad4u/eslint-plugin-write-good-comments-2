/**
 * @packageDocumentation
 * Shared source fixtures for comment-rule integration tests.
 */

import { readFileSync } from "node:fs";

/** Diverse comment conventions with intentionally problematic JSDoc tags. */
export const jsdocBlockTagConventionsFixture: string = readFileSync(
    new URL(
        "../fixtures/comments/jsdoc-block-tag-conventions.valid.ts",
        import.meta.url
    ),
    "utf8"
);

/** Non-prose tool-control comments with intentionally problematic metadata. */
export const toolControlCommentConventionsFixture: string = readFileSync(
    new URL(
        "../fixtures/comments/tool-control-comment-conventions.valid.ts",
        import.meta.url
    ),
    "utf8"
);
