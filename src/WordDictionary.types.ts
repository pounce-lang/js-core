import { ProgramList, ValueStack, WordSignature, Word, CombinedSig } from "./types";

export type WordValue = {
    sig?: CombinedSig;
    compose: ProgramList | ((s: ValueStack, pl: ProgramList) =>
        [ValueStack, ProgramList?]);
};
export type WordDictionary = {
    [index: string]: WordValue
};
