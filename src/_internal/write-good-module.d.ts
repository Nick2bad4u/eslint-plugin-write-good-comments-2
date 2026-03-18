/**
 * @packageDocumentation
 * Ambient module declaration for the untyped `write-good` dependency.
 */

import type { UnknownRecord } from "type-fest";

declare module "write-good" {
    /** Suggestion returned from `write-good`. */
    export type WriteGoodModuleSuggestion = Readonly<{
        index: number;
        offset: number;
        reason: string;
    }>;

    /** Upstream prose-lint function signature. */
    type WriteGoodModule = (
        text: string,
        options?: Readonly<UnknownRecord>
    ) => readonly WriteGoodModuleSuggestion[];

    const writeGood: WriteGoodModule;

    export default writeGood;
}
