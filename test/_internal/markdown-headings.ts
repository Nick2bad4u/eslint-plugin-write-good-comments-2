/**
 * @packageDocumentation
 * Small markdown heading parser used by docs contract tests.
 */

/**
 * Parse markdown headings at one specific level.
 *
 * @param markdown - Full markdown source text.
 * @param level - Heading level to extract.
 *
 * @returns Heading text in file order.
 */
export const parseMarkdownHeadingsAtLevel = (
    markdown: string,
    level:
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
): readonly string[] => {
    const prefix = `${"#".repeat(level)} `;

    return markdown
        .replaceAll("\r\n", "\n")
        .split("\n")
        .filter((line) => line.startsWith(prefix))
        .map((line) => line.slice(prefix.length).trim());
};
