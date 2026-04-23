/**
 * @packageDocumentation
 * Local typed facade for the untyped `write-good` package.
 */



/** Runtime contract exposed by the `write-good` package. */
export type WriteGood = (
    text: string,
    options?: WriteGoodOptions
) => readonly WriteGoodSuggestion[];

/** Options accepted by the underlying `write-good` package. */
export type WriteGoodOptions = Readonly<{
    adverb?: boolean;
    cliches?: boolean;
    eprime?: boolean;
    illusion?: boolean;
    passive?: boolean;
    so?: boolean;
    thereIs?: boolean;
    tooWordy?: boolean;
    weasel?: boolean;
    whitelist?: readonly string[];
}>;

/** Suggestion item returned by `write-good`. */
export type WriteGoodSuggestion = Readonly<{
    index: number;
    offset: number;
    reason: string;
}>;

/** Typed wrapper around the upstream CommonJS export. */


export {default as writeGood} from "write-good";