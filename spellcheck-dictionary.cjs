const { readFileSync } = require("node:fs");
const nodePath = require("node:path");

/** @type {null | Readonly<{ aff: Uint8Array; dic: Uint8Array }>} */
let spellcheckDictionary = null;

/**
 * Load and memoize the Hunspell dictionary used by the spellcheck rule.
 *
 * @returns {Readonly<{ aff: Uint8Array; dic: Uint8Array }>}
 */
const getSpellcheckDictionary = () => {
    if (spellcheckDictionary !== null) {
        return spellcheckDictionary;
    }

    const dictionaryEntryPath = require.resolve("dictionary-en");
    const dictionaryDirectoryPath = nodePath.dirname(dictionaryEntryPath);

    spellcheckDictionary = {
        aff: readFileSync(nodePath.join(dictionaryDirectoryPath, "index.aff")),
        dic: readFileSync(nodePath.join(dictionaryDirectoryPath, "index.dic")),
    };

    return spellcheckDictionary;
};

module.exports = {
    getSpellcheckDictionary,
};
