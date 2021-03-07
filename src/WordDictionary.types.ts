// word dictionary types
import { ProgramList, ValueStack, WordSignature } from "./types";

export type WordValue = {
    sig?: WordSignature;
    compose: ProgramList | ((s: ValueStack, pl: ProgramList) =>
        [ValueStack, ProgramList?]);
};
export type WordDictionary = {
    [index: string]: WordValue
};
