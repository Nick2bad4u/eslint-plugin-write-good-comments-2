// Keep this line comment short and direct.
const plainLineComment = 1;

/// <reference path="./types.d.ts" />
const tripleSlashDirective = 2;

/* Keep this ordinary block comment short and direct. */
const ordinaryBlockComment = 3;

/*
 * Keep this decorated block comment short and direct.
 */
const decoratedBlockComment = 4;

/*
 * Plain blocks keep @param text.
 */
const ordinaryBlockWithAtSign = 5;

/** This banner contains ordinary prose. */
const singleLineJSDocDescription = 6;

/** Keep compact descriptions visible. */
const compactJSDocDescription = 7;

/**
 * Keep multiline descriptions visible.
 */
const multilineJSDocDescription = 8;

/**
 * Resolve {@link Widget} before returning the result.
 */
const inlineJSDocTag = 9;

/**
 * @typedef {Object} CreateEvent
 *
 * @property {"create"} action
 * @property {Init} Thing
 * @property {string | number} organizer_id
 */
const issue25TagOnlyJSDoc = 10;

/** @param {string} documeant - In order to copy the master slave value. */
const compactTagOnlyJSDoc = 11;

/**
 * Keep the public event shape clear.
 *
 * @property {string} master - In order to preserve old metadata.
 * @property {string} slave - This documeant deliberately stays misspelled. This
 *   continuation deliberately accumulates unnecessarily abstract clauses.
 */
const mixedDescriptionAndTags = 12;

/**
 * @custom-tag master slave documeant In order to preserve old metadata.
 * Continue the custom tag with unnecessarily abstract clauses.
 */
const customBlockTag = 13;

/**
 * @example // In order to preserve the master and slave names: const documeant
 * = createLegacyValue();
 */
const exampleBlockTag = 14;

/**
 * Keep tab-decorated descriptions visible.
 *
 * @returns {string} Documeant master slave
 */
const tabDecoratedJSDoc = 15;

/**
 * @ no tag name follows this marker.
 */
const atSignWithoutTagName = 16;

/**
 * Mention @scope/package inside the leading description.
 */
const atSignInsideDescription = 17;

/**
 * Start with {@link Widget} and keep the inline tag visible.
 */
const leadingInlineTag = 18;

/**
 * Choose one clear path:
 *
 * - Keep local state.
 * - Reuse shared state.
 *
 * @returns {string} In order to return the documeant master slave value.
 */
const markdownBeforeBlockTag = 19;

// istanbul ignore next
const coverageDirective = 20;

// @ts-expect-error -- Keep the temporary compatibility check visible.
const typescriptDirective = 21;

// prettier-ignore
const prettierDirective = 22;

// TODO: Remove the fallback soon.
const taskComment = 23;

/* license MIT */
const licenseDirective = 24;

/**/
const compactEmptyJSDoc = 25;

//
const emptyLineComment = 26;

export {};
