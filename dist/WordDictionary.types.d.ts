import { ProgramList, ValueStack, WordSignature } from "./types";
export declare type WordValue = {
    sig?: WordSignature;
    compose: ProgramList | ((s: ValueStack, pl: ProgramList) => [ValueStack, ProgramList?]);
};
export declare type WordDictionary = {
    [index: string]: WordValue;
};
