// @ts-check

const SCHEME_RE = /^[a-zA-Z][a-zA-Z+.-]*:/u;

/**
 * @typedef {{ marker: "`" | "~"; length: number }} FenceState
 */

/**
 * Returns whether the character at `index` is escaped by an odd number of
 * preceding backslashes.
 *
 * @param {string} input
 * @param {number} index
 */
function isEscaped(input, index) {
    let backslashCount = 0;
    let i = index - 1;

    while (i >= 0 && input.charAt(i) === "\\") {
        backslashCount += 1;
        i -= 1;
    }

    return backslashCount % 2 === 1;
}

/**
 * Finds the opening `[` which matches the `]` at `closeBracketIndex`.
 *
 * Handles nested brackets and backslash escapes.
 *
 * @param {string} line
 * @param {number} closeBracketIndex
 */
function findInlineLinkLabelOpenBracket(line, closeBracketIndex) {
    let depth = 0;

    for (let i = closeBracketIndex - 1; i >= 0; i -= 1) {
        const ch = line.charAt(i);

        const isBracket = ch === "[" || ch === "]";
        const escapedBracket = isBracket && isEscaped(line, i);
        if (!escapedBracket) {
            if (ch === "]") {
                depth += 1;
            } else if (ch === "[") {
                if (depth === 0) {
                    return i;
                }

                depth -= 1;
            }
        }
    }

    return -1;
}

/**
 * Prefixes bare relative Markdown file link destinations with `./` so
 * Docusaurus treats them as file paths.
 *
 * @param {string} url - The inline link destination (may contain whitespace).
 */
function prefixIfBareRelativeMarkdownFile(url) {
    const trimmedStart = url.trimStart();
    const leadingWs = url.slice(0, url.length - trimmedStart.length);

    const trimmedEnd = url.trimEnd();
    const trailingWs = url.slice(trimmedEnd.length);

    const trimmed = url.slice(leadingWs.length, url.length - trailingWs.length);

    // Ignore fragments, absolute paths, already-relative paths, protocol-relative URLs.
    if (
        trimmed.startsWith("#") ||
        trimmed.startsWith("/") ||
        trimmed.startsWith("./") ||
        trimmed.startsWith("../") ||
        trimmed.startsWith("//")
    ) {
        return url;
    }

    // Ignore any explicit scheme (http:, https:, mailto:, vscode:, etc.).
    if (SCHEME_RE.test(trimmed)) {
        return url;
    }

    const hashIndex = trimmed.indexOf("#");
    const beforeHash = hashIndex === -1 ? trimmed : trimmed.slice(0, hashIndex);

    const queryIndex = beforeHash.indexOf("?");
    const pathname =
        queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex);

    // Only touch markdown-file links.
    if (!pathname.endsWith(".md") && !pathname.endsWith(".mdx")) {
        return url;
    }

    return `${leadingWs}./${trimmed}${trailingWs}`;
}

/**
 * Returns a matching closing `)` for a Markdown inline link target starting at
 * `startIndex` (immediately after the opening `](`).
 *
 * Handles balanced parentheses and backslash escapes.
 *
 * @param {string} input
 * @param {number} startIndex
 *
 * @returns {number} Index of the closing `)`, or -1 if not found
 */
function findInlineLinkClosingParen(input, startIndex) {
    let depth = 0;
    let i = startIndex;

    while (i < input.length) {
        const ch = input.charAt(i);

        switch (ch) {
            case "(": {
                depth += 1;
                i += 1;

                break;
            }
            case ")": {
                if (depth === 0) {
                    return i;
                }

                depth -= 1;
                i += 1;

                break;
            }
            case "\\": {
                // Skip escaped character (including escaped parens).
                i += 2;

                break;
            }
            default: {
                i += 1;
            }
        }
    }

    return -1;
}

/**
 * Splits a Markdown inline link payload into destination + remainder.
 *
 * The payload is the text inside `(...)` for an inline link.
 *
 * - Destination may be angle-wrapped or a raw destination.
 * - Remainder (if any) includes the title and its leading whitespace.
 *
 * @param {string} payload
 *
 * @returns {{ destination: string; remainder: string }}
 */
function splitInlineLinkDestination(payload) {
    const core = payload.trim();
    if (core.length === 0) {
        return { destination: "", remainder: "" };
    }

    const splitAngleWrapped = splitAngleWrappedDestination(core);
    if (splitAngleWrapped !== null) {
        return splitAngleWrapped;
    }

    const rawDestinationEnd = findRawDestinationEndIndex(core);
    if (rawDestinationEnd === -1) {
        return { destination: core, remainder: "" };
    }

    return {
        destination: core.slice(0, rawDestinationEnd),
        remainder: core.slice(rawDestinationEnd),
    };
}

/**
 * Splits angle-wrapped destinations from inline-link payload text.
 *
 * Returns `null` when the payload is not angle-wrapped.
 *
 * @param {string} payloadCore
 *
 * @returns {null | { destination: string; remainder: string }}
 */
function splitAngleWrappedDestination(payloadCore) {
    if (!payloadCore.startsWith("<")) {
        return null;
    }

    const closeBracketIndex = findClosingAngleBracket(payloadCore, 1);
    if (closeBracketIndex === -1) {
        // Unclosed angle-wrapped destination; treat the whole payload as destination text.
        return { destination: payloadCore, remainder: "" };
    }

    return {
        destination: payloadCore.slice(0, closeBracketIndex + 1),
        remainder: payloadCore.slice(closeBracketIndex + 1),
    };
}

/**
 * Finds a non-escaped `>` inside an angle-wrapped inline-link destination.
 *
 * @param {string} payloadCore
 * @param {number} startIndex
 */
function findClosingAngleBracket(payloadCore, startIndex) {
    for (let i = startIndex; i < payloadCore.length; ) {
        const ch = payloadCore.charAt(i);
        if (ch === "\\") {
            i += 2;
            continue;
        }

        if (ch === ">") {
            return i;
        }

        i += 1;
    }

    return -1;
}

/**
 * Finds where a raw destination should be split from title/remainder text.
 *
 * For raw destinations, the split point is the first depth-0 whitespace.
 *
 * @param {string} payloadCore
 */
function findRawDestinationEndIndex(payloadCore) {
    let depth = 0;

    for (let i = 0; i < payloadCore.length; ) {
        const ch = payloadCore.charAt(i);
        if (ch === "\\") {
            i += 2;
            continue;
        }

        if (ch === "(") {
            depth += 1;
            i += 1;
            continue;
        }

        if (ch === ")") {
            depth = depth > 0 ? depth - 1 : 0;
            i += 1;
            continue;
        }

        if (depth === 0 && /\s/u.test(ch)) {
            return i;
        }

        i += 1;
    }

    return -1;
}

/**
 * Applies the `./` prefix rule to an inline-link payload.
 *
 * Preserves any optional title portion unchanged.
 *
 * @param {string} payload
 */
function prefixInlineLinkPayload(payload) {
    const trimmedStart = payload.trimStart();
    const leadingWs = payload.slice(0, payload.length - trimmedStart.length);

    const trimmedEnd = payload.trimEnd();
    const trailingWs = payload.slice(trimmedEnd.length);

    const core = payload.trim();
    const { destination, remainder } = splitInlineLinkDestination(core);
    if (destination.length === 0) {
        return payload;
    }

    const isAngleWrapped =
        destination.startsWith("<") &&
        destination.endsWith(">") &&
        destination.length >= 2;
    const inner = isAngleWrapped ? destination.slice(1, -1) : destination;

    const rewrittenInner = prefixIfBareRelativeMarkdownFile(inner);
    if (rewrittenInner === inner) {
        return payload;
    }

    const rewrittenDestination = isAngleWrapped
        ? `<${rewrittenInner}>`
        : rewrittenInner;

    return `${leadingWs}${rewrittenDestination}${remainder}${trailingWs}`;
}

/**
 * Prefixes bare Markdown-file link targets on a single line, avoiding
 * modifications inside inline code spans.
 *
 * @param {string} line
 */
function prefixInlineMarkdownLinksInLine(line) {
    let out = "";
    let i = 0;

    /** @type {null | number} */
    let codeSpanLength = null;

    while (i < line.length) {
        // Inline code spans (backticks). Track the opening run length and only close on the same length.
        const tickRun = line.charAt(i) === "`" ? countRun(line, i, "`") : 0;
        if (tickRun > 0) {
            codeSpanLength = updateCodeSpanLength(codeSpanLength, tickRun);
            out += line.slice(i, i + tickRun);
            i += tickRun;
            continue;
        }

        if (codeSpanLength === null) {
            const rewrittenInlineLink = rewriteInlineLinkAt(line, i);
            if (rewrittenInlineLink !== null) {
                out += rewrittenInlineLink.text;
                i = rewrittenInlineLink.nextIndex;
                continue;
            }
        }

        out += line.charAt(i);
        i += 1;
    }

    return out;
}

/**
 * Counts how many times `char` repeats starting at `startIndex`.
 *
 * @param {string} input
 * @param {number} startIndex
 * @param {string} char
 */
function countRun(input, startIndex, char) {
    let count = 0;
    while (
        startIndex + count < input.length &&
        input.charAt(startIndex + count) === char
    ) {
        count += 1;
    }
    return count;
}

/**
 * Updates inline-code span state based on a detected backtick run.
 *
 * @param {null | number} currentCodeSpanLength
 * @param {number} tickRun
 */
function updateCodeSpanLength(currentCodeSpanLength, tickRun) {
    if (currentCodeSpanLength === null) {
        return tickRun;
    }

    return tickRun === currentCodeSpanLength ? null : currentCodeSpanLength;
}

/**
 * Attempts to rewrite one inline markdown link starting at index `i`.
 *
 * Returns `null` when no valid `[label](destination)` span starts at `i`.
 *
 * @param {string} line
 * @param {number} i
 *
 * @returns {null | { nextIndex: number; text: string }}
 */
function rewriteInlineLinkAt(line, i) {
    if (line.charAt(i) !== "]" || line.charAt(i + 1) !== "(") {
        return null;
    }

    // Ensure this is actually a `[label](` sequence, not random text containing `](`.
    const labelOpen = findInlineLinkLabelOpenBracket(line, i);
    if (labelOpen === -1) {
        return null;
    }

    const urlStart = i + 2;
    const end = findInlineLinkClosingParen(line, urlStart);
    if (end === -1) {
        return null;
    }

    const payload = line.slice(urlStart, end);
    const rewrittenPayload = prefixInlineLinkPayload(payload);

    return {
        nextIndex: end + 1,
        text: `](${rewrittenPayload})`,
    };
}

/**
 * Prefixes bare intra-doc Markdown file links with `./`.
 *
 * This function is designed to operate on TypeDoc's markdown renderer output,
 * where links are mostly simple inline links. It intentionally avoids parsing
 * inside fenced code blocks and inline code spans.
 *
 * @param {string} input
 *
 * @returns {string}
 */
export function prefixBareMarkdownFileLinksInMarkdown(input) {
    const newline = input.includes("\r\n") ? "\r\n" : "\n";
    const lines = input.split(/\r?\n/u);

    /** @type {null | FenceState} */
    let fenceState = null;

    const outLines = lines.map((line) => {
        // Only treat runs of a single marker character as fences.
        const fenceMatch = /^\s*(?<marker>[`~])\k<marker>{2,}/u.exec(line);
        if (fenceMatch) {
            const [matchText] = fenceMatch;
            const run = matchText.trimStart();
            const { groups } = fenceMatch;
            const typedGroups =
                /** @type {undefined | { marker: string | undefined }} */ (
                    groups
                );
            const markerChar = typedGroups?.marker ?? run.charAt(0);
            /** @type {"`" | "~"} */
            let marker = "~";
            if (markerChar === "`") {
                marker = "`";
            }
            const { length } = run;

            if (fenceState === null) {
                fenceState = { length, marker };
            } else if (
                marker === fenceState.marker &&
                length >= fenceState.length
            ) {
                fenceState = null;
            }

            return line;
        }

        if (fenceState !== null) {
            return line;
        }

        return prefixInlineMarkdownLinksInLine(line);
    });

    return outLines.join(newline);
}
