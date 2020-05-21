import { ProgramList, ValueStack, WordSignature } from "./types";
export declare type WordValue = {
    sig?: WordSignature;
    def: ProgramList | ((s: ValueStack, pl: ProgramList, wd?: WordDictionary) => [ValueStack, ProgramList?, WordDictionary?]);
};
export declare type WordDictionary = {
    [index: string]: WordValue;
};
