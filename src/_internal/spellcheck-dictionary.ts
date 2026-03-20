/**
 * @packageDocumentation
 * Internal Hunspell dictionary loader for comment spellchecking.
 */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { arrayJoin, isDefined, stringSplit } from "ts-extras";

/** Spellcheck dictionary payload consumed by `retext-spell`. */
export type SpellcheckDictionary = Readonly<{
    aff: Uint8Array;
    dic: Uint8Array;
}>;

/** Extract a module specifier-like path from a Node stack frame line. */
const extractModuleSpecifierFromStackFrame = (
    stackFrame: string
): string | undefined => {
    const trimmedStackFrame = stackFrame.trim();
    const segmentWithLocation = trimmedStackFrame.includes("(")
        ? trimmedStackFrame.slice(
              trimmedStackFrame.indexOf("(") + 1,
              trimmedStackFrame.lastIndexOf(")")
          )
        : trimmedStackFrame.replace(/^at\s+/v, "");

    const locationParts = stringSplit(segmentWithLocation, ":");

    if (locationParts.length < 3) {
        return undefined;
    }

    const moduleSpecifier = arrayJoin(locationParts.slice(0, -2), ":");

    return moduleSpecifier.includes("/") || moduleSpecifier.includes("\\")
        ? moduleSpecifier
        : undefined;
};

/**
 * Resolve the current module URL without relying on CommonJS globals.
 *
 * The ESM build can use `import.meta.url` directly, but the bundled CJS build
 * does not preserve `import.meta`. In that case, the current bundled module
 * path is still available in the stack trace of the active call frame.
 *
 * @returns Current module file URL when it can be derived.
 */
const getCurrentModuleUrlFromStack = (): string | undefined => {
    const stackTrace = new Error("Resolve current module URL from stack trace.")
        .stack;

    if (typeof stackTrace !== "string") {
        return undefined;
    }

    for (const stackFrame of stringSplit(stackTrace, "\n").slice(1)) {
        const moduleSpecifier =
            extractModuleSpecifierFromStackFrame(stackFrame);

        if (!isDefined(moduleSpecifier)) {
            continue;
        }

        return moduleSpecifier.startsWith("file:")
            ? moduleSpecifier
            : pathToFileURL(moduleSpecifier).href;
    }

    return undefined;
};

/** Resolve modules relative to this package even in the bundled CJS build. */
const getRequireFromInternal = () =>
    createRequire(getCurrentModuleUrlFromStack() ?? import.meta.url);

let spellcheckDictionary: null | SpellcheckDictionary = null;

/**
 * Load and memoize the Hunspell dictionary used by the spellcheck rule.
 *
 * @returns Hunspell aff/dic buffers.
 */
export const getSpellcheckDictionary = (): SpellcheckDictionary => {
    if (spellcheckDictionary !== null) {
        return spellcheckDictionary;
    }

    const dictionaryEntryPath =
        getRequireFromInternal().resolve("dictionary-en");
    const dictionaryDirectoryPath = dirname(dictionaryEntryPath);

    spellcheckDictionary = Object.freeze({
        aff: readFileSync(join(dictionaryDirectoryPath, "index.aff")),
        dic: readFileSync(join(dictionaryDirectoryPath, "index.dic")),
    });

    return spellcheckDictionary;
};
