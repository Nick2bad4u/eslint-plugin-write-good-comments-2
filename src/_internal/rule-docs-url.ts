/**
 * @packageDocumentation
 * Canonical rule documentation URL helpers.
 */

/** Stable docs host/prefix for generated rule docs links. */
export const RULE_DOCS_URL_BASE =
    "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/" as const;

/**
 * Build the canonical documentation URL for one rule id.
 *
 * @param ruleName - Rule id (for example `write-good-comments`).
 *
 * @returns Canonical docs URL for the rule page.
 */
export const createRuleDocsUrl = (ruleName: string): string =>
    `${RULE_DOCS_URL_BASE}${ruleName}`;
