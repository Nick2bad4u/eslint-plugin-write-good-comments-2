/**
 * @packageDocumentation
 * Internal Hunspell dictionary loader for comment spellchecking.
 */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

/** Spellcheck dictionary payload consumed by `retext-spell`. */
export type SpellcheckDictionary = Readonly<{
    aff: Uint8Array;
    dic: Uint8Array;
}>;

const requireFromInternal =
    typeof require === "function" ? require : createRequire(import.meta.url);

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

    const dictionaryEntryPath = requireFromInternal.resolve("dictionary-en");
    const dictionaryDirectoryPath = dirname(dictionaryEntryPath);

    spellcheckDictionary = Object.freeze({
        aff: readFileSync(join(dictionaryDirectoryPath, "index.aff")),
        dic: readFileSync(join(dictionaryDirectoryPath, "index.dic")),
    });

    return spellcheckDictionary;
};
