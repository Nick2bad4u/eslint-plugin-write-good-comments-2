export type SpellcheckDictionary = Readonly<{
    aff: Uint8Array;
    dic: Uint8Array;
}>;

export declare const getSpellcheckDictionary: () => SpellcheckDictionary;
