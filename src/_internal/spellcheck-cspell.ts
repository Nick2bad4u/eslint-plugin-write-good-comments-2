/**
 * @packageDocumentation
 * Synchronous cspell-backed spellchecking for projected comment prose.
 */

import type { UnknownRecord } from "type-fest";

import {
    createIgnoreWordsDictionary,
    createInlineSpellingDictionary,
    createSpellingDictionary,
    createCollection as createSpellingDictionaryCollection,
    createSpellingDictionaryFromTrieFile,
    type SpellingDictionary,
    type SpellingDictionaryCollection,
    type SpellingDictionaryOptions,
    type SuggestOptions,
} from "cspell-dictionary";
import {
    type DictionaryDefinition,
    type DictionaryDefinitionInline,
    Text,
} from "cspell-lib";
import JSON5 from "json5";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gunzipSync } from "node:zlib";
import {
    arrayJoin,
    isDefined,
    isEmpty,
    objectHasIn,
    setHas,
    stringSplit,
} from "ts-extras";
import { parse as parseYaml } from "yaml";

/** Resource references imported by default for comment spellchecking. */
const defaultSpellcheckCspellConfigImports = [
    "@cspell/dict-bash/cspell-ext.json",
    "@cspell/dict-companies/cspell-ext.json",
    "@cspell/dict-css/cspell-ext.json",
    "@cspell/dict-en-au/cspell-ext.json",
    "@cspell/dict-en-ca/cspell-ext.json",
    "@cspell/dict-en-common-misspellings/cspell-ext.json",
    "@cspell/dict-en-gb-ise/cspell-ext.json",
    "@cspell/dict-en-gb-legacy/cspell-ext.json",
    "@cspell/dict-en-gb/cspell-ext.json",
    "@cspell/dict-en_us/cspell-ext.json",
    "@cspell/dict-filetypes/cspell-ext.json",
    "@cspell/dict-git/cspell-ext.json",
    "@cspell/dict-html/cspell-ext.json",
    "@cspell/dict-makefile/cspell-ext.json",
    "@cspell/dict-mime-types/cspell-ext.json",
    "@cspell/dict-mnemonics/cspell-ext.json",
    "@cspell/dict-node/cspell-ext.json",
    "@cspell/dict-npm/cspell-ext.json",
    "@cspell/dict-people-names/cspell-ext.json",
    "@cspell/dict-powershell/cspell-ext.json",
    "@cspell/dict-public-licenses/cspell-ext.json",
    "@cspell/dict-scientific-terms-us/cspell-ext.json",
    "@cspell/dict-shell/cspell-ext.json",
    "@cspell/dict-software-terms/cspell-ext.json",
    "@cspell/dict-sql/cspell-ext.json",
    "@cspell/dict-typescript/cspell-ext.json",
    "@cspell/dict-win32/cspell-ext.json",
] as const;

/** Result returned when constructing one spellcheck dictionary collection. */
export type SpellcheckCspellDictionaryCollectionResult = Readonly<{
    collection: SpellingDictionaryCollection;
    errors: readonly SpellcheckCspellResourceError[];
}>;

/** Options used to build one cspell-backed dictionary collection. */
export type SpellcheckCspellDictionaryOptions = Readonly<{
    configImports?: readonly string[];
    cwd: string;
    ignoreWordFiles?: readonly string[];
    ignoreWords?: readonly string[];
    locale?: string;
    useDefaultDictionaries?: boolean;
}>;

/** One issue produced by the synchronous cspell spellchecker. */
export type SpellcheckCspellIssue = Readonly<{
    endOffset: number;
    reason: string;
    startOffset: number;
}>;

/** One cspell resource load problem. */
export type SpellcheckCspellResourceError = Readonly<{
    message: string;
    resource: string;
}>;

/** Options that control one projected-text spellcheck run. */
export type SpellcheckProjectedTextOptions = Readonly<{
    ignoreDigits: boolean;
    ignoreLiteral: boolean;
    maxSuggestions: number;
    normalizeApostrophes: boolean;
}>;

/** Cached base dictionary collection built from imported cspell configs. */
type CachedBaseDictionaryCollection = Readonly<{
    collection: SpellingDictionaryCollection;
    errors: readonly SpellcheckCspellResourceError[];
}>;

/** Internal subset of cspell config data that this rule understands. */
type CspellConfigResource = Readonly<UnknownRecord>;

/** Internal shape for language-specific cspell config fragments. */
type CspellLanguageSetting = Readonly<UnknownRecord>;

/** Dictionary definition paired with the directory it resolves relative to. */
type DictionaryDefinitionEntry = Readonly<{
    baseDirectoryPath: string;
    definition: DictionaryDefinition;
}>;

/** Mutable aggregate built while reading cspell config imports. */
interface MutableCollectedCspellConfig {
    definitionsByName: Map<string, DictionaryDefinitionEntry>;
    enabledDictionaryNames: Set<string>;
    errors: SpellcheckCspellResourceError[];
    flagWords: Set<string>;
    ignoreWords: Set<string>;
    suggestWords: Set<string>;
    words: Set<string>;
}

/** Default locale used when selecting locale-aware cspell settings. */
const defaultSpellcheckLocale = "en-US";

/** Default language id used when selecting language-aware cspell settings. */
const defaultSpellcheckLanguageId = "markdown";

/** Default minimum word length applied by cspell validation. */
const defaultMinWordLength = 4;

/** Default suggestion timeout used by cspell. */
const defaultSuggestionTimeoutMs = 500;

/** Cached base collections reused across files with identical cspell imports. */
const cachedBaseDictionaryCollections = new Map<
    string,
    CachedBaseDictionaryCollection
>();

/** Check whether a dynamic value is a non-null object. */
const isRecord = (value: unknown): value is Readonly<UnknownRecord> =>
    typeof value === "object" && value !== null;

/** Check whether a dynamic value is a string array. */
const isStringArray = (value: unknown): value is readonly string[] =>
    Array.isArray(value) && value.every((item) => typeof item === "string");

/** Preserve an unknown boundary for values returned by loosely typed parsers. */
const toUnknown = (value: unknown): unknown => value;

/** Parse JSON5 text and immediately treat the result as an unknown boundary. */
function parseJson5Unknown(fileContent: string): unknown {
    return JSON5.parse(fileContent);
}

/** Check whether a dynamic value is a usable dictionary definition. */
const isDictionaryDefinition = (
    value: unknown
): value is Readonly<DictionaryDefinition> =>
    isRecord(value) && typeof Reflect.get(value, "name") === "string";

/** Read one optional string field from a loose config record. */
const getOptionalStringField = (
    record: Readonly<UnknownRecord>,
    key: string
): string | undefined => {
    const value = Reflect.get(record, key);

    return typeof value === "string" ? value : undefined;
};

/** Read one optional string-array field from a loose config record. */
const getOptionalStringArrayField = (
    record: Readonly<UnknownRecord>,
    key: string
): readonly string[] | undefined => {
    const value = Reflect.get(record, key);

    return isStringArray(value) ? value : undefined;
};

/** Read one optional dictionary-definition array from a loose config record. */
const getOptionalDictionaryDefinitions = (
    record: Readonly<UnknownRecord>
): readonly DictionaryDefinition[] | undefined => {
    const value = Reflect.get(record, "dictionaryDefinitions");

    if (!Array.isArray(value)) {
        return undefined;
    }

    const dictionaryDefinitions: DictionaryDefinition[] = [];

    for (const item of value) {
        if (isDictionaryDefinition(item)) {
            dictionaryDefinitions.push(item);
        }
    }

    return dictionaryDefinitions;
};

/** Read one optional language-settings array from a loose config record. */
const getOptionalLanguageSettings = (
    record: Readonly<UnknownRecord>
): readonly CspellLanguageSetting[] | undefined => {
    const value = Reflect.get(record, "languageSettings");

    if (!Array.isArray(value)) {
        return undefined;
    }

    const languageSettings: CspellLanguageSetting[] = [];

    for (const item of value) {
        if (isRecord(item)) {
            languageSettings.push(item);
        }
    }

    return languageSettings;
};

/** Resolve modules relative to this package even in the bundled CJS build. */
const getRequireFromInternal = () => {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonUrl = pathToFileURL(packageJsonPath);

    return createRequire(packageJsonUrl.href);
};

/** Check whether a locale selector matches the target locale. */
const isLocaleMatch = (
    selector: string | undefined,
    locale: string
): boolean => {
    if (!isDefined(selector) || selector.trim().length === 0) {
        return false;
    }

    const normalizedLocale = locale.toLowerCase();

    return stringSplit(selector, ",").some((segment) => {
        const normalizedSegment = segment.trim().toLowerCase();

        return (
            normalizedSegment === "*" ||
            normalizedSegment === normalizedLocale ||
            normalizedLocale.startsWith(`${normalizedSegment}-`)
        );
    });
};

/** Check whether a language-id selector matches the target language id. */
const isLanguageIdMatch = (
    selector: string | undefined,
    languageId: string
): boolean => {
    if (!isDefined(selector) || selector.trim().length === 0) {
        return false;
    }

    const normalizedLanguageId = languageId.toLowerCase();

    return stringSplit(selector, ",").some((segment) => {
        const normalizedSegment = segment.trim().toLowerCase();

        return (
            normalizedSegment === "*" ||
            normalizedSegment === normalizedLanguageId
        );
    });
};

/** Normalize one config import ref into an absolute file path. */
const resolveConfigImportPath = (importRef: string, cwd: string): string => {
    const hasWindowsDrivePrefix =
        importRef.length >= 3 &&
        (importRef.at(2) === "/" || importRef.at(2) === "\\") &&
        /^[A-Za-z]:/v.test(importRef.slice(0, 2));

    if (importRef.startsWith("file:")) {
        return fileURLToPath(importRef);
    }

    if (
        hasWindowsDrivePrefix ||
        importRef.startsWith(".") ||
        importRef.startsWith("/")
    ) {
        return path.resolve(cwd, importRef);
    }

    const requireFromInternal = getRequireFromInternal();

    try {
        return requireFromInternal.resolve(importRef, { paths: [cwd] });
    } catch {
        return requireFromInternal.resolve(importRef);
    }
};

/** Normalize line endings to LF before line-based dictionary parsing. */
const normalizeLineEndings = (content: string): string =>
    content.replaceAll(/\r\n?/gv, "\n");

/** Convert one text file into lines using cspell's own line splitting rules. */
const toLines = (content: string): readonly string[] =>
    stringSplit(normalizeLineEndings(content), "\n");

/** Parse one JSON/JSONC/YAML cspell config resource. */
const parseCspellConfigResource = (
    filePath: string,
    fileContent: string
): CspellConfigResource => {
    const parsedValue: unknown = /\.ya?ml$/iv.test(filePath)
        ? parseYaml(fileContent)
        : toUnknown(parseJson5Unknown(fileContent));

    return isRecord(parsedValue) ? parsedValue : {};
};

/** Check whether a dictionary definition is inline. */
const isInlineDictionaryDefinition = (
    definition: Readonly<DictionaryDefinition>
): definition is Readonly<DictionaryDefinitionInline> =>
    objectHasIn(definition, "flagWords") ||
    objectHasIn(definition, "ignoreWords") ||
    objectHasIn(definition, "suggestWords") ||
    objectHasIn(definition, "words");

/** Resolve the file-system path for one file-backed dictionary definition. */
const getDictionaryDefinitionPath = (
    definition: Readonly<DictionaryDefinition>
): string | undefined => {
    const pathValue = Reflect.get(definition, "path");

    if (typeof pathValue === "string") {
        return pathValue;
    }

    const legacyFileValue = Reflect.get(definition, "file");

    return typeof legacyFileValue === "string" ? legacyFileValue : undefined;
};

/** Build spelling-dictionary options from one cspell dictionary definition. */
const createDictionaryOptions = (
    definition: Readonly<DictionaryDefinition>
): SpellingDictionaryOptions => {
    const options: SpellingDictionaryOptions = {};
    const repMap = Reflect.get(definition, "repMap");
    const ignoreForbiddenWords = Reflect.get(
        definition,
        "ignoreForbiddenWords"
    );
    const noSuggest = Reflect.get(definition, "noSuggest");
    const supportNonStrictSearches = Reflect.get(
        definition,
        "supportNonStrictSearches"
    );

    if (Array.isArray(repMap)) {
        options.repMap = repMap;
    }

    if (typeof ignoreForbiddenWords === "boolean") {
        options.ignoreForbiddenWords = ignoreForbiddenWords;
    }

    if (typeof noSuggest === "boolean") {
        options.noSuggest = noSuggest;
    }

    if (typeof supportNonStrictSearches === "boolean") {
        options.supportNonStrictSearches = supportNonStrictSearches;
    }

    return options;
};

/** Convert one word-list file into the iterable expected by cspell loaders. */
const createWordListEntries = (
    fileContent: string,
    type: string | undefined
): Iterable<string> => {
    const lines = toLines(fileContent);

    switch (type) {
        case "C": {
            return lines.flatMap(
                (line) =>
                    line
                        .replaceAll(/#.*/gv, "")
                        .match(/[\w\p{L}\p{M}'`’]+/gv) ?? []
            );
        }

        case undefined: {
            return lines;
        }

        case "W": {
            return lines.flatMap(
                (line) => line.replaceAll(/#.*/gv, "").match(/\S+/gv) ?? []
            );
        }

        default: {
            return lines;
        }
    }
};

/** Build one cspell dictionary from one definition entry. */
const buildDictionaryFromDefinitionEntry = (
    entry: Readonly<DictionaryDefinitionEntry>
): SpellingDictionary => {
    const { baseDirectoryPath, definition } = entry;

    if (isInlineDictionaryDefinition(definition)) {
        return createInlineSpellingDictionary(definition, baseDirectoryPath);
    }

    const definitionPath = getDictionaryDefinitionPath(definition);

    if (!isDefined(definitionPath)) {
        return createSpellingDictionary(
            new Set<string>(),
            definition.name,
            baseDirectoryPath,
            {
                ...createDictionaryOptions(definition),
                noSuggest: true,
            }
        );
    }

    const resolvedFilePath = path.resolve(baseDirectoryPath, definitionPath);
    const dictionaryOptions = createDictionaryOptions(definition);
    // eslint-disable-next-line n/no-sync, security/detect-non-literal-fs-filename -- Dictionaries must be loaded synchronously during rule initialization.
    const compressedFileContent = readFileSync(resolvedFilePath);
    const dictionaryFileContent = resolvedFilePath.endsWith(".gz")
        ? // eslint-disable-next-line n/no-sync -- Dictionary data is loaded in-memory synchronously for ESLint rule execution.
          gunzipSync(compressedFileContent)
        : compressedFileContent;

    if (/\.b?trie(?:\.gz)?$/iv.test(resolvedFilePath)) {
        return createSpellingDictionaryFromTrieFile(
            dictionaryFileContent,
            definition.name,
            resolvedFilePath,
            dictionaryOptions
        );
    }

    const textContent = dictionaryFileContent.toString("utf8");
    const dictionaryType = Reflect.get(definition, "type");
    const wordListEntries = createWordListEntries(
        textContent,
        typeof dictionaryType === "string" ? dictionaryType : undefined
    );

    return createSpellingDictionary(
        wordListEntries,
        definition.name,
        resolvedFilePath,
        dictionaryOptions
    );
};

/** Build one cspell dictionary from one accepted-words file path. */
const buildDictionaryFromWordFilePath = (
    filePath: string,
    cwd: string
): SpellingDictionary =>
    buildDictionaryFromDefinitionEntry({
        baseDirectoryPath: cwd,
        definition: {
            name: filePath,
            noSuggest: true,
            path: filePath,
        },
    });

/** Add all string values in one array into a set. */
const addStringsToSet = (
    target: Set<string>,
    values: readonly string[] | undefined
): void => {
    const strings = values ?? [];

    for (const value of strings) {
        if (value.trim().length > 0) {
            target.add(value);
        }
    }
};

/** Collect matching language settings for the target locale and language id. */
const getMatchingLanguageSettings = (
    resource: Readonly<CspellConfigResource>,
    languageId: string,
    locale: string
): readonly CspellLanguageSetting[] =>
    (getOptionalLanguageSettings(resource) ?? []).filter(
        (languageSetting) =>
            isLanguageIdMatch(
                getOptionalStringField(languageSetting, "languageId"),
                languageId
            ) &&
            isLocaleMatch(
                getOptionalStringField(languageSetting, "locale"),
                locale
            )
    );

/** Collect dictionary and word data from one parsed cspell config resource. */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- These helpers intentionally mutate the aggregate while collecting imported cspell config data. */
const collectConfigDataFromResource = (
    aggregate: MutableCollectedCspellConfig,
    resource: Readonly<CspellConfigResource>,
    baseDirectoryPath: string,
    languageId: string,
    locale: string
): void => {
    const matchingLanguageSettings = getMatchingLanguageSettings(
        resource,
        languageId,
        locale
    );
    const dictionaryDefinitions = [
        ...(getOptionalDictionaryDefinitions(resource) ?? []),
        ...matchingLanguageSettings.flatMap(
            (languageSetting) =>
                getOptionalDictionaryDefinitions(languageSetting) ?? []
        ),
    ];
    const resourceDictionaryNames =
        getOptionalStringArrayField(resource, "dictionaries") ?? [];
    const languageSettingDictionaryNames = matchingLanguageSettings.flatMap(
        (languageSetting) =>
            getOptionalStringArrayField(languageSetting, "dictionaries") ?? []
    );
    // eslint-disable-next-line unicorn/prefer-iterator-concat -- Iterator.concat is not available in this package's runtime target.
    const enabledDictionaryNames = new Set<string>([
        ...resourceDictionaryNames,
        ...languageSettingDictionaryNames,
    ]);

    for (const dictionaryDefinition of dictionaryDefinitions) {
        aggregate.definitionsByName.set(dictionaryDefinition.name, {
            baseDirectoryPath,
            definition: dictionaryDefinition,
        });
    }

    if (enabledDictionaryNames.size === 0) {
        for (const dictionaryDefinition of dictionaryDefinitions) {
            enabledDictionaryNames.add(dictionaryDefinition.name);
        }
    }

    for (const dictionaryName of enabledDictionaryNames) {
        aggregate.enabledDictionaryNames.add(dictionaryName);
    }

    addStringsToSet(
        aggregate.words,
        getOptionalStringArrayField(resource, "words")
    );
    addStringsToSet(
        aggregate.ignoreWords,
        getOptionalStringArrayField(resource, "ignoreWords")
    );
    addStringsToSet(
        aggregate.flagWords,
        getOptionalStringArrayField(resource, "flagWords")
    );
    addStringsToSet(
        aggregate.suggestWords,
        getOptionalStringArrayField(resource, "suggestWords")
    );

    for (const languageSetting of matchingLanguageSettings) {
        addStringsToSet(
            aggregate.words,
            getOptionalStringArrayField(languageSetting, "words")
        );
        addStringsToSet(
            aggregate.ignoreWords,
            getOptionalStringArrayField(languageSetting, "ignoreWords")
        );
        addStringsToSet(
            aggregate.flagWords,
            getOptionalStringArrayField(languageSetting, "flagWords")
        );
        addStringsToSet(
            aggregate.suggestWords,
            getOptionalStringArrayField(languageSetting, "suggestWords")
        );
    }
};

/** Parse one resolved cspell config resource and report problems inline. */
function tryParseCspellConfigResource(
    aggregate: MutableCollectedCspellConfig,
    resolvedImportPath: string
): CspellConfigResource | undefined {
    let parsedResource: CspellConfigResource | null = null;

    try {
        parsedResource = parseCspellConfigResource(
            resolvedImportPath,
            // eslint-disable-next-line n/no-sync, security/detect-non-literal-fs-filename -- Config imports are resolved dynamically and must be read synchronously in rule setup.
            readFileSync(resolvedImportPath, "utf8")
        );
    } catch (error: unknown) {
        aggregate.errors.push({
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown config parse problem.",
            resource: resolvedImportPath,
        });
    }

    return parsedResource ?? undefined;
}

/** Resolve one cspell config import path and report problems inline. */
function tryResolveConfigImportPath(
    aggregate: MutableCollectedCspellConfig,
    importRef: string,
    cwd: string
): string | undefined {
    let resolvedImportPath: null | string = null;

    try {
        resolvedImportPath = resolveConfigImportPath(importRef, cwd);
    } catch (error: unknown) {
        aggregate.errors.push({
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown config resolution problem.",
            resource: importRef,
        });
    }

    return resolvedImportPath ?? undefined;
}

/** Read one cspell config import and all of its nested imports synchronously. */
const collectConfigDataFromImport = (
    aggregate: MutableCollectedCspellConfig,
    importRef: string,
    cwd: string,
    seenFilePaths: Set<string>,
    languageId: string,
    locale: string
): void => {
    const resolvedImportPath = tryResolveConfigImportPath(
        aggregate,
        importRef,
        cwd
    );

    if (!isDefined(resolvedImportPath)) {
        return;
    }

    if (setHas(seenFilePaths, resolvedImportPath)) {
        return;
    }

    seenFilePaths.add(resolvedImportPath);

    const parsedResource = tryParseCspellConfigResource(
        aggregate,
        resolvedImportPath
    );

    if (!isDefined(parsedResource)) {
        return;
    }

    const baseDirectoryPath = path.dirname(resolvedImportPath);
    const nestedImportRefs =
        getOptionalStringArrayField(parsedResource, "import") ?? [];

    for (const nestedImportRef of nestedImportRefs) {
        collectConfigDataFromImport(
            aggregate,
            nestedImportRef,
            baseDirectoryPath,
            seenFilePaths,
            languageId,
            locale
        );
    }

    collectConfigDataFromResource(
        aggregate,
        parsedResource,
        baseDirectoryPath,
        languageId,
        locale
    );
};
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- These helpers intentionally mutate the aggregate while collecting imported cspell config data. */

/** Create one empty mutable cspell config aggregate. */
const createEmptyCollectedConfig = (): MutableCollectedCspellConfig => ({
    definitionsByName: new Map<string, DictionaryDefinitionEntry>(),
    enabledDictionaryNames: new Set<string>(),
    errors: [],
    flagWords: new Set<string>(),
    ignoreWords: new Set<string>(),
    suggestWords: new Set<string>(),
    words: new Set<string>(),
});

/** Build one inline special-purpose dictionary from collected config words. */
const createInlineSpecialDictionaries = (
    aggregate: Readonly<MutableCollectedCspellConfig>
): readonly SpellingDictionary[] => {
    const dictionaries: SpellingDictionary[] = [];

    if (aggregate.words.size > 0) {
        dictionaries.push(
            createInlineSpellingDictionary(
                {
                    name: "spellcheck-comments-inline-words",
                    words: [...aggregate.words],
                },
                "spellcheck-comments inline words"
            )
        );
    }

    if (aggregate.ignoreWords.size > 0) {
        dictionaries.push(
            createInlineSpellingDictionary(
                {
                    ignoreWords: [...aggregate.ignoreWords],
                    name: "spellcheck-comments-inline-ignore-words",
                },
                "spellcheck-comments inline ignore words"
            )
        );
    }

    if (aggregate.flagWords.size > 0) {
        dictionaries.push(
            createInlineSpellingDictionary(
                {
                    flagWords: [...aggregate.flagWords],
                    name: "spellcheck-comments-inline-flag-words",
                },
                "spellcheck-comments inline flag words"
            )
        );
    }

    if (aggregate.suggestWords.size > 0) {
        dictionaries.push(
            createInlineSpellingDictionary(
                {
                    name: "spellcheck-comments-inline-suggest-words",
                    suggestWords: [...aggregate.suggestWords],
                },
                "spellcheck-comments inline suggest words"
            )
        );
    }

    return dictionaries;
};

/** Create the cache key for one base imported cspell dictionary collection. */
const createBaseDictionaryCacheKey = (
    configImports: readonly string[],
    locale: string,
    useDefaultDictionaries: boolean
): string =>
    JSON5.stringify({
        configImports,
        locale,
        useDefaultDictionaries,
    });

/** Load and cache the base imported cspell dictionary collection. */
const loadBaseImportedDictionaryCollection = (
    cwd: string,
    configImports: readonly string[],
    locale: string,
    useDefaultDictionaries: boolean
): CachedBaseDictionaryCollection => {
    const cacheKey = createBaseDictionaryCacheKey(
        configImports,
        locale,
        useDefaultDictionaries
    );
    const cachedCollection = cachedBaseDictionaryCollections.get(cacheKey);

    if (isDefined(cachedCollection)) {
        return cachedCollection;
    }

    const aggregate = createEmptyCollectedConfig();
    const normalizedImportRefs = useDefaultDictionaries
        ? [...defaultSpellcheckCspellConfigImports, ...configImports]
        : [...configImports];
    const seenFilePaths = new Set<string>();

    const uniqueImportRefs = new Set(normalizedImportRefs);

    for (const importRef of uniqueImportRefs) {
        collectConfigDataFromImport(
            aggregate,
            importRef,
            cwd,
            seenFilePaths,
            defaultSpellcheckLanguageId,
            locale
        );
    }

    const dictionaries: SpellingDictionary[] = [];

    for (const enabledDictionaryName of aggregate.enabledDictionaryNames) {
        const definitionEntry = aggregate.definitionsByName.get(
            enabledDictionaryName
        );

        if (!isDefined(definitionEntry)) {
            aggregate.errors.push({
                message: "Configured dictionary name was not defined.",
                resource: enabledDictionaryName,
            });

            continue;
        }

        try {
            dictionaries.push(
                buildDictionaryFromDefinitionEntry(definitionEntry)
            );
        } catch (error: unknown) {
            aggregate.errors.push({
                message:
                    error instanceof Error
                        ? error.message
                        : "Unknown dictionary build problem.",
                resource: enabledDictionaryName,
            });
        }
    }

    dictionaries.push(...createInlineSpecialDictionaries(aggregate));

    const cachedEntry: CachedBaseDictionaryCollection = Object.freeze({
        collection: createSpellingDictionaryCollection(
            dictionaries,
            "spellcheck-comments imported cspell dictionaries"
        ),
        errors: [...aggregate.errors],
    });

    cachedBaseDictionaryCollections.set(cacheKey, cachedEntry);

    return cachedEntry;
};

/**
 * Build one cspell-backed dictionary collection for spellcheck-comments.
 *
 * @param options - Rule options that influence imported dictionaries.
 *
 * @returns The assembled collection plus any resource load problems.
 */
export const createSpellcheckCspellDictionaryCollection = (
    options: Readonly<SpellcheckCspellDictionaryOptions>
): SpellcheckCspellDictionaryCollectionResult => {
    const locale = options.locale ?? defaultSpellcheckLocale;
    const acceptedWords = new Set(options.ignoreWords);
    const baseCollection = loadBaseImportedDictionaryCollection(
        options.cwd,
        options.configImports ?? [],
        locale,
        options.useDefaultDictionaries ?? true
    );
    const dictionaries = [...baseCollection.collection.dictionaries];
    const errors = [...baseCollection.errors];

    if (acceptedWords.size > 0) {
        dictionaries.push(
            createIgnoreWordsDictionary(
                [...acceptedWords],
                "spellcheck-comments accepted words",
                "spellcheck-comments options"
            )
        );
    }

    const uniqueIgnoreWordFilePaths = new Set(options.ignoreWordFiles);

    for (const ignoreWordFilePath of uniqueIgnoreWordFilePaths) {
        try {
            dictionaries.push(
                buildDictionaryFromWordFilePath(ignoreWordFilePath, options.cwd)
            );
        } catch (error: unknown) {
            errors.push({
                message:
                    error instanceof Error
                        ? error.message
                        : "Unknown accepted-word file problem.",
                resource: ignoreWordFilePath,
            });
        }
    }

    return {
        collection: createSpellingDictionaryCollection(
            dictionaries,
            "spellcheck-comments cspell collection"
        ),
        errors,
    };
};

/** Check whether a word token should be skipped because it is quoted. */
const isQuotedLiteralWord = (
    text: string,
    startOffset: number,
    endOffset: number
): boolean => {
    const previousCharacter = text[startOffset - 1];
    const nextCharacter = text[endOffset];

    return (
        (previousCharacter === '"' && nextCharacter === '"') ||
        (previousCharacter === "'" && nextCharacter === "'")
    );
};

/** Normalize apostrophe-like characters without changing text length. */
const normalizeSpellcheckText = (text: string): string =>
    text.replaceAll(/[`’]/gv, "'");

/** Format one cspell spellcheck problem into an ESLint-friendly message. */
const createProblemReason = (
    word: string,
    suggestions: readonly string[],
    isForbiddenWord: boolean
): string => {
    if (isEmpty(suggestions)) {
        return isForbiddenWord
            ? `Possible misspelling "${word}".`
            : `Unknown or misspelled word "${word}".`;
    }

    return isForbiddenWord
        ? `Possible misspelling "${word}". Suggestions: ${arrayJoin(suggestions, ", ")}.`
        : `Unknown or misspelled word "${word}". Suggestions: ${arrayJoin(suggestions, ", ")}.`;
};

/** Build cspell suggestion options for one spellcheck pass. */
const createSuggestOptions = (maxSuggestions: number): SuggestOptions => ({
    ignoreCase: true,
    includeTies: false,
    numChanges: 3,
    numSuggestions: maxSuggestions,
    timeout: defaultSuggestionTimeoutMs,
});

/**
 * Spellcheck projected markdown text with the assembled cspell dictionaries.
 *
 * @param text - Projected markdown comment text.
 * @param collection - Prebuilt cspell dictionary collection.
 * @param options - Runtime spellcheck behavior.
 *
 * @returns Stable issue offsets and human-readable reasons.
 */
export const spellcheckProjectedTextWithCspell = (
    text: string,
    collection: Readonly<SpellingDictionaryCollection>,
    options: Readonly<SpellcheckProjectedTextOptions>
): readonly SpellcheckCspellIssue[] => {
    const normalizedText = options.normalizeApostrophes
        ? normalizeSpellcheckText(text)
        : text;
    const results: SpellcheckCspellIssue[] = [];
    const suggestOptions = createSuggestOptions(options.maxSuggestions);

    const wordOffsets = Text.extractWordsFromTextOffset(
        Text.textOffset(normalizedText)
    );

    for (const wordOffset of wordOffsets) {
        const word = wordOffset.text;
        const startOffset = wordOffset.offset;
        const endOffset = startOffset + word.length;

        const shouldIgnoreWord =
            word.length < defaultMinWordLength ||
            (options.ignoreDigits && /\d/v.test(word)) ||
            (options.ignoreLiteral &&
                isQuotedLiteralWord(normalizedText, startOffset, endOffset));

        if (!shouldIgnoreWord) {
            const isKnownWord = collection.has(word, { ignoreCase: true });
            const isForbiddenWord = collection.isForbidden(word, true);

            if (!isKnownWord || isForbiddenWord) {
                const suggestions = [
                    ...new Set(
                        collection
                            .suggest(word, suggestOptions)
                            .map((suggestion) => suggestion.word)
                            .filter(
                                (suggestedWord) =>
                                    suggestedWord.localeCompare(
                                        word,
                                        undefined,
                                        {
                                            sensitivity: "accent",
                                        }
                                    ) !== 0
                            )
                    ),
                ].slice(0, options.maxSuggestions);

                results.push({
                    endOffset,
                    reason: createProblemReason(
                        word,
                        suggestions,
                        isForbiddenWord
                    ),
                    startOffset,
                });
            }
        }
    }

    return results;
};
