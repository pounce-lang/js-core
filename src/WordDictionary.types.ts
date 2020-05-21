import { ProgramList, ValueStack, WordSignature, Word } from "./types";

export type WordValue = {
    sig?: WordSignature;
    def: ProgramList | ((s: ValueStack, pl: ProgramList, wd?: WordDictionary) =>
        [ValueStack, ProgramList?, WordDictionary?]);
};
export type WordDictionary = {
    [index: string]: WordValue //(WordValue | WordDictionary)
};
